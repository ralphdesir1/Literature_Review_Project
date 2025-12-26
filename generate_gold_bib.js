const fs = require('fs');
const path = require('path');

const INCLUDED_BIB = path.join(__dirname, 'data', 'included', 'included_studies.bib');
const OUTPUT_FILE = path.join(__dirname, 'data', 'included', 'gold_standard_45.bib');

// Robust BibTeX Regex
const ENTRY_REGEX = /(@\w+\{([^,]+),[\s\S]*?\n\})/g;
const FIELD_REGEX = /(\w+)\s*=\s*\{([^\}]+)\}/g;

function parseBibTex(content) {
    const entries = [];
    let match;
    while ((match = ENTRY_REGEX.exec(content)) !== null) {
        const fullEntry = match[1];
        const key = match[2].trim();
        const entry = { key, full: fullEntry };
        
        // Extract fields for tier logic
        const body = match[1];
        let fieldMatch;
        while ((fieldMatch = FIELD_REGEX.exec(body)) !== null) {
            entry[fieldMatch[1].toLowerCase()] = fieldMatch[2].replace(/\n/g, ' ').trim();
        }
        entry.yearInt = parseInt(entry.year) || 0;
        entries.push(entry);
    }
    return entries;
}

function getTier(entry) {
    const text = ((entry.title || "") + " " + (entry.abstract || "") + " " + (entry.keywords || "")).toLowerCase();
    const isUnknown = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation');
    const isAniso = text.includes('anisotropic') || text.includes('tangential') || text.includes('directional');
    if (isUnknown && isAniso) return 0;

    const isRecent = entry.yearInt >= 2022;
    const isFoundational = entry.key.includes('keemink') || entry.key.includes('kronander') || entry.key.includes('friston');
    const isCoreTopic = (isUnknown || isAniso); 
    const isActInfContact = (text.includes('active inference') || text.includes('free energy')) && (text.includes('contact') || text.includes('force'));

    if ((isRecent && isCoreTopic) || isActInfContact || isFoundational) return 0.5;
    return 3;
}

const content = fs.readFileSync(INCLUDED_BIB, 'utf-8');
const entries = parseBibTex(content);
const goldEntries = entries.filter(e => getTier(e) <= 0.5);

let finalOutput = "% GOLD STANDARD 45 - Top Priority for Week 4\n\n";
goldEntries.forEach(e => finalOutput += e.full + "\n\n");

fs.writeFileSync(OUTPUT_FILE, finalOutput);
console.log(`Exported ${goldEntries.length} papers to gold_standard_45.bib`);

