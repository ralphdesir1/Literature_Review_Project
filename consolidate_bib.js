const fs = require('fs');
const path = require('path');

const RAW_BIB = path.join(__dirname, 'data', 'raw', 'scopus_2025-12-23.bib');
const BATCH_DIR = path.join(__dirname);
const OUTPUT_DIR = path.join(__dirname, 'data', 'included');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'included_studies.bib');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 1. Parse Raw BibTeX into a Map
const rawContent = fs.readFileSync(RAW_BIB, 'utf-8');
const entries = {};
// Simple block splitter for BibTeX entries
const rawEntries = rawContent.split(/@\w+\{/);

// Re-construct the map (Key -> Full Bib Entry)
// Note: The previous regex was strict; this splitter is safer for full-text extraction
let currentKey = "";
rawContent.replace(/@(\w+)\{([^,]+),/g, (match, type, key) => {
    // Find the start index of this key in the file to extract the full block
    // This is complex to regex perfectly, so we use the previous parsed map logic for simplicity
    // Actually, let's reuse the robust regex from before but capture the FULL entry
    return match;
});

const ENTRY_REGEX = /(@\w+\{([^,]+),[\s\S]*?\n\})/g;
let match;
while ((match = ENTRY_REGEX.exec(rawContent)) !== null) {
    const fullEntry = match[1];
    const key = match[2].trim();
    entries[key] = fullEntry;
}

// 2. Scan Batches for [x]
let includedCount = 0;
let excludedCount = 0;
let finalBibContent = "% Selected Studies after Week 3 Screening\n\n";

for (let i = 1; i <= 8; i++) {
    const batchFile = path.join(BATCH_DIR, `screening_batch_${i}.md`);
    if (fs.existsSync(batchFile)) {
        const lines = fs.readFileSync(batchFile, 'utf-8').split('\n');
        lines.forEach(line => {
            if (line.includes('| [x] |')) {
                const keyMatch = line.match(/`([^`]+)`/);
                if (keyMatch) {
                    const key = keyMatch[1];
                    if (entries[key]) {
                        finalBibContent += entries[key] + "\n\n";
                        includedCount++;
                    }
                }
            } else if (line.includes('| [ ] |')) {
                excludedCount++;
            }
        });
    }
}

fs.writeFileSync(OUTPUT_FILE, finalBibContent);
console.log(`Included: ${includedCount}`);
console.log(`Excluded: ${excludedCount}`);
console.log(`Total: ${includedCount + excludedCount}`);

