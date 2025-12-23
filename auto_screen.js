const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'data', 'raw', 'scopus_2025-12-23.bib');
const BATCH_DIR = path.join(__dirname);

// Regex to parse BibTeX
const ENTRY_REGEX = /@\w+\{([^,]+),([\s\S]*?)\n\}/g;
const FIELD_REGEX = /(\w+)\s*=\s*\{([^\}]+)\}/g;

// Rubric Logic (Simulated "AI Researcher")
function evaluatePaper(title, abstract) {
    const text = (title + " " + abstract).toLowerCase();
    
    // EXCLUSION CRITERIA
    if (text.includes('vision-based') || text.includes('camera') || text.includes('visual servoing')) {
        if (!text.includes('force') && !text.includes('impedance') && !text.includes('admittance')) {
            return { keep: false, reason: "Reason 4: Vision/Camera only (No Force)" };
        }
    }
    if (text.includes('teleoperation') && !text.includes('haptic') && !text.includes('force feedback')) {
        return { keep: false, reason: "Reason 3: Teleop (No Force Feedback)" };
    }
    if (text.includes('exoskeleton') || text.includes('rehabilitation') || text.includes('gait')) {
        // Strict check: Is it industrial?
        if (!text.includes('industrial') && !text.includes('tool') && !text.includes('assembly')) {
            return { keep: false, reason: "Reason 4: Medical/Rehab (Wrong Domain)" };
        }
    }
    if (text.includes('autonomous') && !text.includes('human') && !text.includes('collaboration') && !text.includes('shared control')) {
        return { keep: false, reason: "Reason 1: Fully Autonomous (No Human)" };
    }

    // INCLUSION CRITERIA (The "Gold" list)
    if (text.includes('unknown surface') || text.includes('unknown environment') || text.includes('curvature estimation')) {
        return { keep: true, reason: "*Keep: Unknown Surface (Core Spine)*" };
    }
    if (text.includes('anisotropic') || text.includes('directional compliance')) {
        return { keep: true, reason: "*Keep: Anisotropic (Core Spine)*" };
    }
    if (text.includes('active inference') || text.includes('free energy')) {
        return { keep: true, reason: "*Keep: Active Inference (Phase 2)*" };
    }
    if (text.includes('grinding') || text.includes('polishing') || text.includes('sanding')) {
        return { keep: true, reason: "*Keep: Contact Task (Core)*" };
    }
    if ((text.includes('admittance') || text.includes('impedance')) && text.includes('human')) {
        return { keep: true, reason: "Keep: General pHRI Control" };
    }

    // Default Reject (if generic)
    return { keep: false, reason: "Reason 4: Generic/Irrelevant" };
}

function processBatches() {
    const rawContent = fs.readFileSync(INPUT_FILE, 'utf-8');
    let match;
    const entries = {};

    // Parse all entries first to map Key -> Abstract
    while ((match = ENTRY_REGEX.exec(rawContent)) !== null) {
        const key = match[1].trim();
        const body = match[2];
        let abstract = "";
        let title = "";
        
        let fieldMatch;
        while ((fieldMatch = FIELD_REGEX.exec(body)) !== null) {
            if (fieldMatch[1].toLowerCase() === 'abstract') abstract = fieldMatch[2];
            if (fieldMatch[1].toLowerCase() === 'title') title = fieldMatch[2];
        }
        entries[key] = { title, abstract };
    }

    // Process all 8 batch files
    for (let i = 1; i <= 8; i++) {
        const batchFile = path.join(BATCH_DIR, `screening_batch_${i}.md`);
        if (fs.existsSync(batchFile)) {
            let content = fs.readFileSync(batchFile, 'utf-8');
            const lines = content.split('\n');
            const newLines = [];

            lines.forEach(line => {
                if (line.startsWith('| [ ] | `')) {
                    // Extract Key
                    const keyMatch = line.match(/`([^`]+)`/);
                    if (keyMatch) {
                        const key = keyMatch[1];
                        const data = entries[key];
                        if (data) {
                            const decision = evaluatePaper(data.title, data.abstract);
                            const checkbox = decision.keep ? "[x]" : "[ ]";
                            const reason = decision.reason;
                            
                            // Replace [ ] with [x] and append reason
                            let newLine = line.replace('[ ]', checkbox);
                            // Append reason to the last column (currently empty "||")
                            newLine = newLine.replace('| |', `| ${reason} |`);
                            newLines.push(newLine);
                        } else {
                            newLines.push(line); // Key not found (weird)
                        }
                    } else {
                        newLines.push(line);
                    }
                } else {
                    newLines.push(line);
                }
            });

            fs.writeFileSync(batchFile, newLines.join('\n'));
            console.log(`Processed Batch ${i}`);
        }
    }
}

processBatches();

