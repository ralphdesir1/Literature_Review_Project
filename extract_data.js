const fs = require('fs');
const path = require('path');

const INCLUDED_BIB = path.join(__dirname, 'data', 'included', 'included_studies.bib');
const OUTPUT_FILE = path.join(__dirname, 'data_extraction_matrix.md');

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
        entry.yearInt = parseInt(entry.year) || 0;
        entries.push(entry);
    }
    return entries;
}

// Re-implement Tier Logic to select the top 45
function getTier(entry) {
    const text = ((entry.title || "") + " " + (entry.abstract || "") + " " + (entry.keywords || "")).toLowerCase();
    
    const isUnknown = text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation');
    const isAniso = text.includes('anisotropic') || text.includes('tangential') || text.includes('directional');
    if (isUnknown && isAniso) return 0; // Diamond

    const isRecent = entry.yearInt >= 2022;
    const isFoundational = entry.key.includes('keemink') || entry.key.includes('kronander') || entry.key.includes('friston');
    const isCoreTopic = (isUnknown || isAniso); 
    const isActInfContact = (text.includes('active inference') || text.includes('free energy')) && (text.includes('contact') || text.includes('force'));

    if ((isRecent && isCoreTopic) || isActInfContact || isFoundational) return 0.5; // Tier 0.5

    return 3; // Ignore lower tiers for this matrix
}

function analyzeAbstract(entry) {
    const text = ((entry.title || "") + " " + (entry.abstract || "")).toLowerCase();
    
    // Q1: Surface Knowledge
    let surface = "❓ Unclear";
    if (text.includes('unknown') || text.includes('estimate') || text.includes('reconstruct')) surface = "✅ Unknown (Estimated)";
    else if (text.includes('cad') || text.includes('known') || text.includes('predefined')) surface = "❌ Known (CAD)";
    
    // Q2: Anisotropy
    let aniso = "❌ Isotropic";
    if (text.includes('anisotropic') || text.includes('directional') || text.includes('tangential')) aniso = "✅ Anisotropic";
    
    // Q3: Intent Method
    let intent = "None/Constant";
    if (text.includes('active inference') || text.includes('free energy')) intent = "🧠 Active Inference";
    else if (text.includes('neural network') || text.includes('learning')) intent = "🤖 Learning/NN";
    else if (text.includes('variable admittance') || text.includes('adaptive')) intent = "🎛️ Adaptive Gains";

    // Q4: Task
    let task = "Generic pHRI";
    if (text.includes('grinding') || text.includes('polishing') || text.includes('sanding')) task = "⚙️ Grinding/Sanding";
    else if (text.includes('drilling')) task = "🔩 Drilling";
    else if (text.includes('reaching')) task = "👋 Reaching";

    return { surface, aniso, intent, task };
}

function generateMatrix() {
    if (!fs.existsSync(INCLUDED_BIB)) return;
    const content = fs.readFileSync(INCLUDED_BIB, 'utf-8');
    const entries = parseBibTex(content);
    
    // Filter Top 45 (Tier 0 & 0.5)
    const targetPapers = entries.filter(e => getTier(e) <= 0.5);

    let output = `# Week 4: Data Extraction Matrix (The "Cheat Sheet")\n\n`;
    output += `**Objective:** Don't read blindly. Verify these "AI Guesses" for the top ${targetPapers.length} papers.\n`;
    output += `**Your Job:** If the AI says "Unknown" but the paper actually uses a CAD model, mark it as a "Win" for your thesis gap!\n\n`;
    
    output += `| Citation Key | Surface Assumption | Anisotropy | Intent Method | Task Domain | AI Note |\n`;
    output += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    targetPapers.forEach(e => {
        const data = analyzeAbstract(e);
        // Highlight Tier 0
        const note = getTier(e) === 0 ? "**💎 CORE**" : "";
        output += `| \`${e.key}\` | ${data.surface} | ${data.aniso} | ${data.intent} | ${data.task} | ${note} |\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Generated Matrix for ${targetPapers.length} papers.`);
}

generateMatrix();

