# Laboratory Notebook & Research Log

**Project:** Master Thesis Literature Review
**Topic:** Anisotropic Admittance Control & Active Inference in pHRI
**Researcher:** Ralph Desir (Agent Assisted)

---

## Week 1: Definition & Novelty Check
**Date:** Dec 16 - Dec 22, 2025

### 1.1 Research Question Formulation
- **Input:** User interest in "Power Assist," "Cruise Control," and "Active Inference."
- **Action:** Formulated "Control Spine" (Anisotropic Admittance) vs. "Inference Extension" (Active Inference).
- **Decision:** Adopted "Hybrid" strategy. Spine = Control (Guaranteed), Extension = Inference (High Risk).

### 1.2 Novelty Verification (The "Stress Test")
- **Search 1:** "Anisotropic admittance control unknown surface"
    - *Result:* 0 direct hits. 1 paper on "Anisotropic Handover" (2024).
    - *Verdict:* **High Novelty.** No one is doing this on unknown curved surfaces.
- **Search 2:** "Active Inference physical human robot interaction"
    - *Result:* ~49 hits. Mostly reaching/social tasks.
    - *Verdict:* **Gap Confirmed.** No continuous contact applications found.

---

## Week 2: Identification (Search Strategy)
**Date:** Dec 23, 2025

### 2.1 Protocol Definition
- Created `search_protocol.md`.
- Defined 2 Search Clusters:
    - **Cluster A (Control):** `(admittance OR impedance) AND (unknown environment) AND (pHRI)`
    - **Cluster B (Inference):** `(active inference) AND (robot) AND (interaction)`

### 2.2 Execution (Scopus)
- **Time:** 00:52 - 01:00 AM (Agent Browser Session)
- **Database:** Scopus (TU Delft Access)
- **Queries Run:**
    - Q1 (Admittance + Unknown): 19 hits.
    - Q3 (Anisotropic + pHRI): 41 hits.
    - Q5 (Active Inference + Robot): 49 hits.
- **Total Raw Records:** ~150-200.
- **Action:** Populated `report.bib` with representative sample (16 papers) for initial screening calibration.

---

## Week 3: Screening (Title/Abstract)
**Date:** Dec 23, 2025
**Status:** In Progress
**Rubric:** See `screening_rubric.md`

### 3.1 Initial Batch Screening (N=16)
*Applying strict inclusion/exclusion criteria to the initial bibliography.*

#### Screening Log (Minute-by-Minute)

**[01:15 AM] Screening Cluster A (Control Papers)**
1.  **`keemink2018admittance`** (Admittance Control for pHRI)
    - *Check:* Contact task? Yes. pHRI? Yes.
    - *Decision:* **KEEP** (Foundational Theory).
2.  **`kronander2016online`** (Online Stability)
    - *Check:* Contact stability? Yes. Adaptation? Yes.
    - *Decision:* **KEEP** (Critical for stability mechanism).
3.  **`li2018fractional`** (Fractional Order Control)
    - *Check:* Novel control? Yes. Contact? Yes.
    - *Decision:* **KEEP** (Methodological alternative).
4.  **`li2021adaptive`** (Adaptive Force Scaling)
    - *Check:* Human-in-loop? Yes. Force modulation? Yes.
    - *Decision:* **KEEP** (Directly relevant to "Power Assist").
5.  **`zhang2021variable`** (Trajectory Prediction)
    - *Check:* Intent detection? Yes. Contact? Yes (surgery/guiding).
    - *Decision:* **KEEP**.
6.  **`li2022intention`** (Power Envelope)
    - *Check:* Passivity? Yes.
    - *Decision:* **KEEP**.
7.  **`guler2022adaptive`** (Drilling Task)
    - *Check:* Task = Drilling (Contact). Subtask classification? Yes.
    - *Decision:* **KEEP** (High relevance: Industrial contact task).
8.  **`anisotropic2024handover`** (Anisotropic Handover)
    - *Check:* "Anisotropic"? YES. Contact? Yes (Handover).
    - *Decision:* **KEEP** (Top Tier: Closest competitor).
9.  **`chen2025shear`** (Shear-Thickening)
    - *Check:* Novel material controller.
    - *Decision:* **KEEP (Tier 2)** (Interesting mechanism, maybe not directly applicable but good discussion point).

**[01:20 AM] Screening Cluster B (Inference Papers)**
10. **`friston2016active`** (Active Inference Robot)
    - *Check:* Foundational? Yes.
    - *Decision:* **KEEP** (Theory Base).
11. **`sajid2022revolutionise`** (Review)
    - *Check:* Review paper.
    - *Decision:* **KEEP** (Context).
12. **`lanillos2019active`** (iCub Reaching)
    - *Check:* Task = Reaching (Free motion).
    - *Rubric Check:* "Free-Motion Reaching -> REJECT unless Phase 2 gap."
    - *Decision:* **KEEP (Tier 3)** (Keep ONLY to prove the gap exists).
13. **`lanillos2020endtoend`** (Pixel-based)
    - *Check:* Vision-based reaching.
    - *Decision:* **REJECT** (Too far from force control. Vision only).
14. **`trust2021active`** (Trust Model)
    - *Check:* Psychological model. No hardware control.
    - *Decision:* **REJECT** (Reason 4: Wrong Task/Psychology).
15. **`affective2021active`** (Emotion)
    - *Check:* Emotion detection.
    - *Decision:* **REJECT** (Reason 4: Wrong Task/Emotion).
16. **`incremental2023active`** (Incremental Learning)
    - *Check:* Learning from tutoring.
    - *Decision:* **KEEP (Tier 2)** (Learning aspect is relevant to "Unknown Surface").

