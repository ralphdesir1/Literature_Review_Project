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
    
    // TIER 1: The "Spine" (Direct Competitors)
    // Must solve the core problem: Unknown Surface + Force Control OR Anisotropic Control
    const hasUnknown = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation') || text.includes('geometry estimation');
    const hasAniso = text.includes('anisotropic') || text.includes('directional compliance') || text.includes('directional impedance');
    const hasActiveInfContact = (text.includes('active inference') || text.includes('free energy')) && (text.includes('contact') || text.includes('force'));
    
    if (hasUnknown || hasAniso || hasActiveInfContact) {
        return { tier: 1, reason: "Direct Competitor (Unknown Surface / Anisotropic / Active Inf + Contact)" };
    }

    // TIER 2: The "Bridge" (Strong Support)
    // Good Admittance papers, Active Inference theory, or specific industrial tasks (grinding)
    const hasGrinding = text.includes('grinding') || text.includes('polishing') || text.includes('sanding') || text.includes('deburring');
    const hasAdaptAdmittance = text.includes('variable admittance') || text.includes('adaptive admittance') || text.includes('learning admittance');
    const hasActiveInf = text.includes('active inference') || text.includes('free energy'); // Theory only

    if (hasGrinding || hasAdaptAdmittance || hasActiveInf) {
        return { tier: 2, reason: "Strong Support (Grinding / Adaptive Control / Inference Theory)" };
    }

    // TIER 3: The "Noise" (General Context)
    return { tier: 3, reason: "General Context (pHRI Stability / General Control)" };
}

function generatePriorityList() {
    if (!fs.existsSync(INCLUDED_BIB)) {
        console.error("Included studies file not found.");
        return;
    }
    
    const content = fs.readFileSync(INCLUDED_BIB, 'utf-8');
    const entries = parseBibTex(content);
    
    const tier1 = [];
    const tier2 = [];
    const tier3 = [];

    entries.forEach(entry => {
        const cat = categorizePaper(entry);
        entry.reason = cat.reason;
        if (cat.tier === 1) tier1.push(entry);
        else if (cat.tier === 2) tier2.push(entry);
        else tier3.push(entry);
    });

    let output = `# Week 3.5: Strategic Reading Priority\n\n`;
    output += `**Objective:** Cut N=${entries.length} down to ~40 high-value papers for Week 4 Full Text Review.\n\n`;
    
    output += `## 🥇 Tier 1: The "Spine" (Must Read) - ${tier1.length} Papers\n`;
    output += `*Direct competitors addressing Unknown Surfaces, Anisotropy, or Active Inference in Contact.*\n\n`;
    output += `| Citation Key | Year | Title | Reason |\n| :--- | :--- | :--- | :--- |\n`;
    tier1.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥈 Tier 2: The "Bridge" (Should Read) - ${tier2.length} Papers\n`;
    output += `*Strong supporting work on Grinding, Adaptive Control, or Inference Theory.*\n\n`;
    output += `| Citation Key | Year | Title | Reason |\n| :--- | :--- | :--- | :--- |\n`;
    tier2.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    output += `\n## 🥉 Tier 3: The "Context" (Skim/Reference) - ${tier3.length} Papers\n`;
    output += `*General pHRI stability and control papers. Keep in bibliography but do not prioritize reading.*\n\n`;
    // output += `*(List hidden for brevity, see included_studies.bib)*\n`; 
    // Uncomment above and comment below if list is too long, but for now list them
    tier3.forEach(e => output += `| \`${e.key}\` | ${e.year} | ${e.title.substring(0,60)}... | ${e.reason} |\n`);

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Generated Priority List: T1=${tier1.length}, T2=${tier2.length}, T3=${tier3.length}`);
}

generatePriorityList();

