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
| Q3 | `("anisotropic" OR "directional" OR "virtual fixture") AND ("admittance" OR "impedance" OR "compliance") AND ("robot")` |
| Q4 | `("variable admittance" OR "adaptive admittance" OR "variable impedance") AND ("intent" OR "intention") AND ("pHRI")` |

#### Cluster B: The Inference Extension (Secondary)
*Focus: Active Inference in physical interaction.*

| ID | Query String |
| :--- | :--- |
| Q5 | `("active inference" OR "free energy principle") AND ("robot" OR "manipulator") AND ("interaction" OR "physical assistance" OR "shared control")` |
| Q6 | `("intent inference" OR "intention prediction") AND ("contact" OR "manipulation") AND ("human robot")` |

### 1.2 The "Snowball" Strategy (Backward/Forward Chaining)
*To mitigate the risk of keyword mismatch, we will perform Snowballing on the top 5 "Gold Standard" papers.*

**Mechanism:**
1.  **Backward Chaining:** Scan the *References* of the Tier 1 papers.
2.  **Forward Chaining:** Scan the *Citations* (Who cited them?) using Scopus/Google Scholar.

**Target Papers for Snowballing:**
1.  *Keemink et al. (2018)* - Admittance Control Review.
2.  *Kronander & Billard (2016)* - Online Stability.
3.  *Rosenberg (1993)* - Virtual Fixtures (The historical root of anisotropy).
4.  *Li et al. (2020)* - Variable Admittance.
5.  *Friston et al. (2016)* - Active Inference in Robotics.

---

## 2. Search Log (Identification Phase)

| ID | Database | Query | Date | Hits | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S1 | Google Scholar | Q1 (admittance + unknown) | 2025-12-16 | ~15 relevant | Most assume known surface. Gap confirmed. |
| S2 | Google Scholar | Q3 (anisotropic) | 2025-12-16 | ~5 relevant | Very sparse. Only 1 paper (handover) directly uses term "anisotropic." |
| S3 | Google Scholar | Q4 (variable admittance) | 2025-12-16 | ~12 relevant | Strong body of work on intent-based adaptation. |
| S4 | PubMed | Q5 (active inference robot) | 2025-12-16 | ~8 relevant | Mostly reaching tasks. No continuous contact. |
| S5 | Scopus | Q1 (admittance + unknown) | 2025-12-23 | 19 hits | Found directly competing grinding papers (force+vision). |
| S6 | Scopus | Q2 (power assist + tangential) | 2025-12-23 | 12 hits | Specific to heavy tools; anisotropy usually not explicit. |
| S7 | Scopus | Q3 (anisotropic + pHRI) | 2025-12-23 | 41 hits | Narrow, niche area. Perfect for novel contribution. |
| S8 | Scopus | Q4 (variable adm + intent) | 2025-12-23 | 78 hits | Strong overlap with intent detection; lacks surface adaptation. |
| S9 | Scopus | Q5 (active inference) | 2025-12-23 | 49 hits | Emerging area; gap in continuous contact tasks confirmed. |
| S10 | Scopus | Q6 (intent + contact) | 2025-12-23 | 120 hits | Broadest cluster; provides the context for 'intent' research. |

**Total Unique Records (Estimated):** ~150-200 after deduplication.

---

## 3. Critical Assessment (Associate Professor Level)

### 3.1 State of the Art: The "Grinding" Competition
As your advisor, I've looked at the Scopus results for Q1. There is a cluster of papers around **robotic grinding on unknown surfaces** (e.g., *Zhang et al., 2020; Li et al., 2019*). 
**Critique:** These papers typically solve the "unknown surface" problem using **Force/Vision fusion** or **Hybrid Force/Position Control**. They treat the robot as an autonomous tool.
**Your Opportunity:** Your work focuses on **pHRI (Physical Human-Robot Interaction)**. The human is in the loop. The "Anisotropic Admittance" is not just for the robot to follow the surface; it's to *assist the human* in doing so. This "Shared Control" perspective is your primary shield against "it's already been done."

### 3.2 The "Anisotropic" Niche
Query Q3/S7 returned 41 hits. This is the "sweet spot." 
**Critique:** Most "anisotropic" work is in **micro-assembly** or **haptic rendering** (making a virtual wall feel stiff). 
**Your Opportunity:** Applying it to **power-assist** for heavy tools is rare. You aren't just making it stiff in one direction; you're making it "active" (force-hold) in one direction and "passive/light" (admittance) in another. This "Direction-Dependent Shared Control" is a high-quality academic angle.

### 3.3 Active Inference: The "Theoretical" Bridge
Query Q5/S9 returned 49 hits. 
**Critique:** This is a "hot" topic, but current research is stuck in "Reaching 101." They show a humanoid arm reaching for a ball using Free Energy minimization. 
**Your Opportunity:** Moving Active Inference into **constrained, contact-rich tasks** (like your insulation task) is a significant jump. If you can show that Active Inference handles the *ambiguity* of whether a human wants to "push harder" vs. "slide faster" better than standard Kalman Filters or LSTM, you have a top-tier journal paper (e.g., *IEEE Transactions on Haptics*).

---

## 4. Screening Strategy (The "Professor's Filter")

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
