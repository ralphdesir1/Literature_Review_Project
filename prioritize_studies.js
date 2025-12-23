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
        entries.push(entry);
    }
    return entries;
}

function categorizePaper(entry) {
    const text = ((entry.title || "") + " " + (entry.abstract || "") + " " + (entry.keywords || "")).toLowerCase();
    
    // TIER 0: THE DIAMOND LIST (Intersection of Core Concepts)
    // Must be "Unknown Surface" AND "Anisotropic/Tangential"
    const isUnknown = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation');
    const isAniso = text.includes('anisotropic') || text.includes('tangential') || text.includes('directional');
    
    if (isUnknown && isAniso) {
        return { tier: 0, reason: "💎 DIAMOND: Unknown Surface + Anisotropic (Thesis Core)" };
    }

    // TIER 1: The "Gold Standard" (Ruthless Cut)
    const isUnknownSurface = (text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation') || text.includes('geometry estimation')) 
                             && (text.includes('control') || text.includes('impedance') || text.includes('admittance'));
    const isAnisotropicOnly = text.includes('anisotropic') || text.includes('directional compliance');
    const isActiveInfContact = (text.includes('active inference') || text.includes('free energy')) 
                               && (text.includes('contact') || text.includes('force') || text.includes('haptic'));

    if (isUnknownSurface || isAnisotropicOnly || isActiveInfContact) {
        return { tier: 1, reason: "GOLD: Solves ONE core problem (Unknown OR Aniso OR ActInf)" };
    }

    // TIER 2: The "Silver Standard"
    const hasGrinding = text.includes('grinding') || text.includes('polishing') || text.includes('sanding') || text.includes('deburring');
    const hasAdaptAdmittance = text.includes('variable admittance') || text.includes('adaptive admittance') || text.includes('learning admittance');
    const hasActiveInf = text.includes('active inference') || text.includes('free energy'); 

    if (hasGrinding || hasAdaptAdmittance || hasActiveInf) {
        return { tier: 2, reason: "SILVER: Strong Support (Grinding/Adaptive)" };
    }

    return { tier: 3, reason: "BRONZE: General Context" };
}

function generatePriorityList() {
    if (!fs.existsSync(INCLUDED_BIB)) {
        console.error("Included studies file not found.");
        return;
    }
    
    const content = fs.readFileSync(INCLUDED_BIB, 'utf-8');
    const entries = parseBibTex(content);
    
    const tier0 = [];
    const tier1 = [];
    const tier2 = [];
    const tier3 = [];

    entries.forEach(entry => {
        const cat = categorizePaper(entry);
        entry.reason = cat.reason;
        if (cat.tier === 0) tier0.push(entry);
        else if (cat.tier === 1) tier1.push(entry);
        else if (cat.tier === 2) tier2.push(entry);
        else tier3.push(entry);
    });

    let output = `# Week 3.5: Strategic Reading Priority (Diamond Cut)\n\n`;
    output += `**Objective:** Identify the "Diamond" papers that intersect both core challenges.\n\n`;
    
    output += `## 💎 Tier 0: The Diamond List (Thesis Core) - ${tier0.length} Papers\n`;
    output += `*These papers address BOTH 'Unknown Surface' AND 'Anisotropic/Tangential' control. Read these FIRST.*\n\n`;
    output += `| Citation Key | Year | Title | Reason |\n| :--- | :--- | :--- | :--- |\n`;
    tier0.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥇 Tier 1: The Gold List (Component Solutions) - ${tier1.length} Papers\n`;
    output += `*These solve ONE of the core problems (Unknown Surface OR Anisotropy OR Active Inf).*\n\n`;
    tier1.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥈 Tier 2: The Silver List (Support) - ${tier2.length} Papers\n`;
    tier2.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥉 Tier 3: The Bronze List (Context) - ${tier3.length} Papers\n`;
    tier3.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Generated Diamond List: T0=${tier0.length}, T1=${tier1.length}, T2=${tier2.length}, T3=${tier3.length}`);
}

generatePriorityList();
