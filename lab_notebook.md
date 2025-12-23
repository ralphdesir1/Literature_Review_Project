## Week 3: Screening (Title/Abstract)
**Date:** Dec 23, 2025
**Status:** Completed
**Rubric:** See `screening_rubric.md`

### 3.1 Initial Batch Screening (N=16)
*Applying strict inclusion/exclusion criteria to the initial bibliography.*
- **Kept:** 13 papers (Foundational theory + Anisotropic Handover competitor).
- **Rejected:** 3 papers (Vision/Emotion focused).

### 3.2 Full Scopus Screening (N=354)
**Date:** Dec 23, 2025
- **Method:** Automated parsing of 354 abstracts using `auto_screen.js`.
- **Criteria Applied:**
    - *Inclusion:* Unknown Surface, Anisotropic, Active Inference, Contact Tasks.
    - *Exclusion:* Vision-only, Autonomous-only, Medical/Rehab (non-industrial).
- **Results:**
    - **Total Screened:** 354
    - **Included:** 172
    - **Excluded:** 182
- **Output:** `data/included/included_studies.bib` generated via `consolidate_bib.js`.
- **PRISMA Update:** Flowchart updated with N=172 moving to Full Text Review.

---

## Week 4: Eligibility (Full Text Review)
**Status:** Next Step
**Target:** Reduce N=172 -> N=~25.
