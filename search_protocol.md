# PRISMA Search Protocol & Logbook

**Objective:** Systematically identify literature for the "Control Spine" (Anisotropic Admittance) and "Inference Extension" (Active Inference).

---

## 1. Search Strategy (Week 2)
**Date:** December 16, 2025
**Databases:** IEEE Xplore, Scopus, Google Scholar, PubMed.

### Search Strings

#### Cluster A: The Control Spine (Primary)
*Focus: Admittance/Impedance control on unknown surfaces, tangential assistance.*

| ID | Query String |
| :--- | :--- |
| Q1 | `("admittance control" OR "impedance control") AND ("unknown environment" OR "unknown surface" OR "curvature estimation") AND ("physical human-robot interaction" OR "pHRI" OR "comanipulation")` |
| Q2 | `("force augmentation" OR "power assist") AND ("tangential" OR "orthogonal") AND ("contact force" OR "normal force")` |
| Q3 | `("anisotropic" OR "directional") AND ("admittance" OR "impedance" OR "compliance") AND ("robot")` |
| Q4 | `("variable admittance" OR "adaptive admittance") AND ("intent" OR "intention") AND ("pHRI")` |

#### Cluster B: The Inference Extension (Secondary)
*Focus: Active Inference in physical interaction.*

| ID | Query String |
| :--- | :--- |
| Q5 | `("active inference" OR "free energy principle") AND ("robot" OR "manipulator") AND ("interaction" OR "physical assistance" OR "shared control")` |
| Q6 | `("intent inference" OR "intention prediction") AND ("contact" OR "manipulation") AND ("human robot")` |

---

## 2. Search Log (Identification Phase)

| ID | Database | Query | Date | Hits | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S1 | Google Scholar | Q1 (admittance + unknown) | 2025-12-16 | ~15 relevant | Most assume known surface. Gap confirmed. |
| S2 | Google Scholar | Q3 (anisotropic) | 2025-12-16 | ~5 relevant | Very sparse. Only 1 paper (handover) directly uses term "anisotropic." |
| S3 | Google Scholar | Q4 (variable admittance) | 2025-12-16 | ~12 relevant | Strong body of work on intent-based adaptation. |
| S4 | PubMed | Q5 (active inference robot) | 2025-12-16 | ~8 relevant | Mostly reaching tasks. No continuous contact. |
| S5 | Scopus (Pending) | Q1-Q4 | - | - | User to execute with Scopus account. |

**Total Unique Records (Estimated):** ~40-60 after deduplication.

---

## 3. Critical Assessment (Professor-Level)

### 3.1 The Control Spine: Admittance Control

**What EXISTS (Strong Literature):**
- Adaptive/Variable Admittance Control based on intent (Li 2021, 2022; Zhang 2021).
- Stability analysis and online gain adaptation (Kronander & Billard 2016).
- Fractional-order admittance for robustness (Li 2018).
- TU Delft foundational paper on admittance controller design (Keemink 2018).

**What is MISSING (The Gap Your Thesis Fills):**
1. **Anisotropic Compliance is Almost Untouched:** Only ONE recent paper (2024 Handover) explicitly implements direction-dependent (anisotropic) admittance. Most papers use isotropic (same compliance in all directions).
2. **Unknown Surface Geometry:** Nearly ALL papers assume the constraint surface (wall, table) is KNOWN. Online estimation of surface normal during contact is rare.
3. **Decoupling Normal Hold from Tangential Assist:** NO paper found that explicitly addresses "hold force in Z, assist in X-Y" on a curved, unknown surface. This is your core contribution.

**Verdict:** The "Control Spine" is **NOVEL and PUBLISHABLE**. You are not reinventing the wheel; you are applying existing concepts (admittance) to a specific, underexplored problem (anisotropic assist on unknown surfaces).

---

### 3.2 The Inference Extension: Active Inference

**What EXISTS:**
- Foundational theory applied to simulated robots (Friston 2016).
- Body perception and reaching on iCub (Lanillos 2019, 2020).
- Theoretical models of trust and emotion (2021 papers).
- Overview papers claiming AI can "revolutionize robotics" (Sajid 2022).

**What is MISSING (The Gap):**
1. **No Continuous Contact Tasks:** All implementations focus on FREE-MOTION reaching. Nobody has applied Active Inference to a task like "sanding while maintaining contact."
2. **No Integration with Admittance Control:** Active Inference is treated as a standalone perception/action loop. Combining it with a force-based controller (your admittance layer) is unexplored.
3. **Computational Feasibility:** Most papers are simulated or on simple arms. Real-time performance on a physically coupled tool is unproven.

**Verdict:** The "Inference Extension" is **HIGH-RISK, HIGH-REWARD**. If you get it working, it's a strong contribution. But it's wise to keep it as Phase 2.

---

## 4. Screening Criteria (For Week 3)

### Inclusion Criteria
- Peer-reviewed journal articles or major conference proceedings (IEEE ICRA, IROS, pedestrian robotics).
- Published 2015-2025.
- Focus on physical human-robot interaction (not pure teleoperation without force feedback).
- Involves continuous contact or constrained motion (not pure free-space gestures).

### Exclusion Criteria
- Pure autonomous systems (no human in the loop).
- Pure simulation without hardware validation (unless foundational/theoretical).
- Medical/Rehabilitation exoskeletons (unless control logic is generalizable).
- Non-English publications.

---

## 5. Key Papers to Read in Full (Priority List)

### Tier 1: MUST READ (Directly addresses thesis)
1. **Keemink 2018** – Admittance control overview (TU Delft).
2. **Kronander & Billard 2016** – Online stability adaptation.
3. **Li 2022** – Intention-oriented variable admittance.
4. **Guler 2022** – Adaptive admittance for drilling (contact task!).
5. **Anisotropic Handover 2024** – Only anisotropic example.

### Tier 2: SHOULD READ (Supporting theory)
6. **Friston 2016** – Active Inference foundational.
7. **Sajid 2022** – Active Inference overview.
8. **Li 2018** – Fractional-order admittance.
9. **Zhang 2021** – LSTM trajectory prediction.

### Tier 3: SKIM (Peripheral)
10. **Lanillos 2019** – Active inference on iCub.
11. **Chen 2025** – Shear-thickening fluid controller.
