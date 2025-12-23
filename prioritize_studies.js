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
    
    // TIER 0: DIAMOND (Intersection) - The "Holy Grail"
    // Unknown Surface AND Anisotropic
    const isUnknown = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation');
    const isAniso = text.includes('anisotropic') || text.includes('tangential') || text.includes('directional');
    if (isUnknown && isAniso) {
        return { tier: 0, reason: "💎 DIAMOND: Unknown Surface + Anisotropic (Thesis Core)" };
    }

    // TIER 0.5: PLATINUM (The "Heavy Hitters") - ~20-30 papers
    // 1. Explicit Anisotropic Control (rare and critical)
    if (text.includes('anisotropic') || text.includes('directional compliance') || text.includes('directional impedance')) {
        return { tier: 0.5, reason: "PLATINUM: Explicit Anisotropic/Directional Control" };
    }
    // 2. Active Inference WITH Contact/Force (rare and critical)
    if ((text.includes('active inference') || text.includes('free energy')) && (text.includes('contact') || text.includes('force') || text.includes('haptic'))) {
        return { tier: 0.5, reason: "PLATINUM: Active Inference + Contact" };
    }
    // 3. Unknown Surface + Admittance (The "Grinding" Competitors)
    if (isUnknown && (text.includes('admittance') || text.includes('impedance'))) {
        return { tier: 0.5, reason: "PLATINUM: Unknown Surface + Impedance/Admittance" };
    }

    // TIER 1: GOLD (Component Solutions)
    const isUnknownGeneral = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation');
    if (isUnknownGeneral) {
        return { tier: 1, reason: "GOLD: Unknown Surface (General)" };
    }
    if (text.includes('control') && (text.includes('contact') || text.includes('interaction'))) {
        return { tier: 1, reason: "GOLD: General Contact Control" };
    }

    // TIER 2: SILVER (Support)
    const hasGrinding = text.includes('grinding') || text.includes('polishing') || text.includes('sanding');
    const hasAdaptAdmittance = text.includes('variable admittance') || text.includes('adaptive admittance');
    if (hasGrinding || hasAdaptAdmittance) {
        return { tier: 2, reason: "SILVER: Grinding/Adaptive Support" };
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

    let output = `# Week 3.5: Strategic Reading Priority (Platinum Cut)\n\n`;
    output += `**Objective:** Identify the top ~30 papers (Diamond + Platinum) for deep reading.\n\n`;
    
    output += `## 💎 Tier 0: The Diamond List (Thesis Core) - ${tier0.length} Papers\n`;
    output += `*Intersection of Unknown Surface AND Anisotropy.*\n\n`;
    output += `| Citation Key | Year | Title | Reason |\n| :--- | :--- | :--- | :--- |\n`;
    tier0.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 💍 Tier 0.5: The Platinum List (Heavy Hitters) - ${tier05.length} Papers\n`;
    output += `*Major competitors: Explicit Anisotropy, Active Inf+Contact, or Unknown Surface Control.*\n\n`;
    tier05.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥇 Tier 1: The Gold List (General Components) - ${tier1.length} Papers\n`;
    tier1.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥈 Tier 2: The Silver List (Support) - ${tier2.length} Papers\n`;
    tier2.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);
    
    output += `\n## 🥉 Tier 3: The Bronze List (Context) - ${tier3.length} Papers\n`;
    tier3.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Generated Platinum List: T0=${tier0.length}, T0.5=${tier05.length}, T1=${tier1.length}, T2=${tier2.length}`);
}

generatePriorityList();
