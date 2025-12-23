const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, 'data', 'raw', 'scopus_2025-12-23.bib');
const BATCH_SIZE = 50;
const OUTPUT_DIR = path.join(__dirname);

// Regex to parse BibTeX entries loosely (robust to formatting variances)
const ENTRY_REGEX = /@\w+\{([^,]+),([\s\S]*?)\n\}/g;
const FIELD_REGEX = /(\w+)\s*=\s*\{([^\}]+)\}/g;

function parseBibTex(content) {
    const entries = [];
    let match;
    
    // Normalize line endings
    content = content.replace(/\r\n/g, '\n');

    while ((match = ENTRY_REGEX.exec(content)) !== null) {
        const key = match[1].trim();
        const body = match[2];
        const entry = { key, raw: match[0] };
        
        let fieldMatch;
        while ((fieldMatch = FIELD_REGEX.exec(body)) !== null) {
            const fieldName = fieldMatch[1].toLowerCase();
            const fieldValue = fieldMatch[2].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            entry[fieldName] = fieldValue;
        }
        entries.push(entry);
    }
    return entries;
}

function getAnnotation(entry) {
    const text = ((entry.title || "") + " " + (entry.abstract || "") + " " + (entry.keywords || "")).toLowerCase();
    
    // Heuristic 1: Duplicate check is handled later, this is semantic annotation
    
    // Heuristic 2: Vision Only?
    if ((text.includes('vision') || text.includes('camera') || text.includes('visual')) && 
        !text.includes('force') && !text.includes('haptic') && !text.includes('impedance') && !text.includes('admittance')) {
        return "(AI Hint: Check if Vision-Only)";
    }

    // Heuristic 3: High Relevance (Grinding/Contact)
    if (text.includes('grinding') || text.includes('polishing') || text.includes('sanding') || text.includes('deburring') || text.includes('surface following')) {
        return "**(AI Hint: HIGH RELEVANCE - Contact Task)**";
    }

    // Heuristic 4: Anisotropic
    if (text.includes('anisotropic') || text.includes('directional compliance') || text.includes('directional impedance')) {
        return "**(AI Hint: HIGH RELEVANCE - Anisotropic)**";
    }

    // Heuristic 5: Active Inference
    if (text.includes('active inference') || text.includes('free energy')) {
        return "(AI Hint: Phase 2 Candidate)";
    }

    return "";
}

function generateChecklists() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Error: File not found at ${INPUT_FILE}`);
        return;
    }

    const rawContent = fs.readFileSync(INPUT_FILE, 'utf-8');
    const entries = parseBibTex(rawContent);
    
    console.log(`Parsed ${entries.length} records.`);

    // Deduplication Logic
    const seenTitles = new Set();
    const uniqueEntries = [];
    let duplicates = 0;

    entries.forEach(entry => {
        // Simple fuzzy title match
        const normTitle = (entry.title || "").toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normTitle.length > 10 && seenTitles.has(normTitle)) {
            entry.isDuplicate = true;
            duplicates++;
        } else {
            if (normTitle.length > 10) seenTitles.add(normTitle);
            entry.isDuplicate = false;
        }
        uniqueEntries.push(entry);
    });

    console.log(`Found ${duplicates} likely duplicates.`);

    // Generate Batches
    let batchNum = 1;
    let currentBatchContent = `# Week 3 Screening Checklist - Batch ${batchNum}\n\n`;
    currentBatchContent += `| Keep? | Citation Key | Year | Title | AI Note | Reason (if Excluded) |\n`;
    currentBatchContent += `| :---: | :--- | :--- | :--- | :--- | :--- |\n`;

    uniqueEntries.forEach((entry, index) => {
        const title = (entry.title || "No Title").substring(0, 100) + "...";
        const year = entry.year || "????";
        const note = entry.isDuplicate ? "**[DUPLICATE]**" : getAnnotation(entry);
        const checkbox = entry.isDuplicate ? "[ ]" : "[ ]";
        
        currentBatchContent += `| ${checkbox} | \`${entry.key}\` | ${year} | ${title} | ${note} | |\n`;

        // Batch splitting
        if ((index + 1) % BATCH_SIZE === 0 || index === uniqueEntries.length - 1) {
            const filename = `screening_batch_${batchNum}.md`;
            fs.writeFileSync(path.join(OUTPUT_DIR, filename), currentBatchContent);
            console.log(`Created ${filename}`);
            
            batchNum++;
            currentBatchContent = `# Week 3 Screening Checklist - Batch ${batchNum}\n\n`;
            currentBatchContent += `| Keep? | Citation Key | Year | Title | AI Note | Reason (if Excluded) |\n`;
            currentBatchContent += `| :---: | :--- | :--- | :--- | :--- | :--- |\n`;
        }
    });
}

generateChecklists();

