const fs = require('fs');
const path = require('path');

const INCLUDED_BIB = path.join(__dirname, 'data', 'included', 'included_studies.bib');
const OUTPUT_FILE = path.join(__dirname, 'priority_reading_list.md');

// Robust BibTeX Regex
const ENTRY_REGEX = /@\w+\{([^,]+),([\s\S]*?)\n\}/g;
const FIELD_REGEX = /(\w+)\s*=\s*\{([^\}]+)\}/g;

function parseBibTex(content) {
    const entries = [];
    let match;
    while ((match = ENTRY_REGEX.exec(content)) !== null) {
        const key = match[1].trim();
        const body = match[2];
        const entry = { key };
        let fieldMatch;
        while ((fieldMatch = FIELD_REGEX.exec(body)) !== null) {
            entry[fieldMatch[1].toLowerCase()] = fieldMatch[2].replace(/\n/g, ' ').trim();
        }
        // Ensure year is an integer
        entry.yearInt = parseInt(entry.year) || 0;
        entries.push(entry);
    }
    return entries;
}

function categorizePaper(entry) {
    const text = ((entry.title || "") + " " + (entry.abstract || "") + " " + (entry.keywords || "")).toLowerCase();
    
    // TIER 0: THE DIAMOND LIST (Intersection)
    const isUnknown = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation');
    const isAniso = text.includes('anisotropic') || text.includes('tangential') || text.includes('directional');
    if (isUnknown && isAniso) {
        return { tier: 0, reason: "💎 DIAMOND: Intersection (Unknown + Anisotropic)" };
    }

    // TIER 0.5: THE "ASSOCIATE PROFESSOR" CUT (Quality/Recency/Relevance)
    // Target: ~30 papers.
    // Logic: 
    // 1. Recent (2022+) Unknown Surface OR Anisotropic
    // 2. ANY year if it's "Active Inference + Contact" (Rare/High Value)
    // 3. Foundational papers (Keemink, Kronander) irrespective of year

    const isRecent = entry.yearInt >= 2022;
    const isFoundational = entry.key.includes('keemink') || entry.key.includes('kronander') || entry.key.includes('friston');
    
    // Core Topics
    const isCoreTopic = (isUnknown || isAniso); 
    const isActInfContact = (text.includes('active inference') || text.includes('free energy')) && (text.includes('contact') || text.includes('force'));

    // Rule 1: Recent Core Topic
    if (isRecent && isCoreTopic) {
        return { tier: 0.5, reason: "✨ TIER 0.5: Recent State-of-Art (2022+) Core Topic" };
    }
    // Rule 2: Active Inference in Contact (Rare Gem)
    if (isActInfContact) {
        return { tier: 0.5, reason: "✨ TIER 0.5: Active Inference in Contact (High Value)" };
    }
    // Rule 3: Foundational
    if (isFoundational) {
        return { tier: 0.5, reason: "✨ TIER 0.5: Foundational Theory (Must Cite)" };
    }

    // TIER 1: The "Gold" (Old or Less Specific)
    // Older Unknown Surface/Anisotropic papers
    if (isCoreTopic) {
        return { tier: 1, reason: "GOLD: Relevant but Older/Less Specific" };
    }

    // TIER 2: Silver (Support)
    const hasGrinding = text.includes('grinding') || text.includes('polishing');
    const hasAdaptAdmittance = text.includes('variable admittance') || text.includes('adaptive admittance');
    if (hasGrinding || hasAdaptAdmittance) {
        return { tier: 2, reason: "SILVER: Strong Support" };
    }

    return { tier: 3, reason: "BRONZE: Context" };
}

function generatePriorityList() {
    if (!fs.existsSync(INCLUDED_BIB)) {
        console.error("Included studies file not found.");
        return;
    }
    
    const content = fs.readFileSync(INCLUDED_BIB, 'utf-8');
    const entries = parseBibTex(content);
    
    const tier0 = [];
    const tier05 = [];
    const tier1 = [];
    const tier2 = [];
    const tier3 = [];

    entries.forEach(entry => {
        const cat = categorizePaper(entry);
        entry.reason = cat.reason;
        if (cat.tier === 0) tier0.push(entry);
        else if (cat.tier === 0.5) tier05.push(entry);
        else if (cat.tier === 1) tier1.push(entry);
        else if (cat.tier === 2) tier2.push(entry);
        else tier3.push(entry);
    });

    let output = `# Week 3.5: Strategic Reading Priority (The Professor's Selection)\n\n`;
    output += `**Objective:** A realistic "Must Read" list of ~30 papers that define the State of the Art.\n\n`;
    
    output += `## 💎 Tier 0: The Intersection (N=${tier0.length})\n`;
    output += `*The Exact Gap. Read these first.*\n`;
    tier0.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## ✨ Tier 0.5: The "Associate Professor" List (N=${tier05.length})\n`;
    output += `*High-Impact Papers: Recent (2022+) Core Topics, Foundational Theory, or Rare Active Inference applications.*\n`;
    output += `| Citation Key | Year | Title | Reason |\n| :--- | :--- | :--- | :--- |\n`;
    tier05.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥇 Tier 1: The Archive (N=${tier1.length})\n`;
    output += `*Good papers, but either older (<2022) or less specific. Use to bulk up the bibliography.*\n`;
    tier1.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥈 Tier 2: The Support (N=${tier2.length})\n`;
    output += `*Grinding applications and Adaptive Admittance.*\n`;
    // tier2.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Generated Professor List: T0=${tier0.length}, T0.5=${tier05.length}, T1=${tier1.length}`);
}

generatePriorityList();
