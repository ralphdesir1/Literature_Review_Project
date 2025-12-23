# Screening Rubric & "Grey Zone" Protocol

**Objective:** To eliminate selection bias and ensure rigorous, truth-seeking paper selection.
**Principle:** If the inclusion logic is fuzzy, the review is worthless. We define "Edge Cases" explicitly.

---

## 1. The "Human-in-the-Loop" Filter
*Theory:* We are studying pHRI (Physical Human-Robot Interaction).
*Reality:* Many papers claim "collaboration" but the human is just a supervisor or a trigger.

| Scenario | Decision | Rationale |
| :--- | :--- | :--- |
| **Active Co-manipulation:** Human and robot hold the tool together (hands-on). | **KEEP** | This is the core definition of pHRI. |
| **Teleoperation (Force Feedback):** Human moves a master device; robot moves slave. Force is felt. | **KEEP** | Mathematically similar to co-manipulation (coupled dynamics). |
| **Teleoperation (Joystick/Visual only):** Human steers robot but feels no force. | **REJECT** | This is "Human-Robot Interaction" (HRI), not *Physical* (pHRI). No coupled energy exchange. |
| **Supervisory Control:** Human says "Start Grinding," robot does it autonomously. | **REJECT** | This is autonomy. The control loop does not include human biomechanics. |
| **"Human-Aware" Navigation:** Robot avoids hitting a human walking by. | **REJECT** | This is safety/collision avoidance, not task assistance. |

---

## 2. The "Contact Task" Filter
*Theory:* We care about surface following (grinding, sanding).
*Reality:* Most papers do "free motion" (moving from A to B).

| Scenario | Decision | Rationale |
| :--- | :--- | :--- |
| **Continuous Surface Following:** Tool stays in contact > 1s (sanding, writing, wiping). | **KEEP** | Directly relevant to "cruise control" concept. |
| **Transient Contact:** Peg-in-hole insertion, assembly (contact < 1s). | **DISCUSS** | *Grey Zone.* Keep if the control law handles the transition (impact). Reject if it's just position control. |
| **Virtual Walls (Haptics):** Human pushes against a "stiff" virtual boundary. | **KEEP (Tier 2)** | Valid proxy for a physical wall. Good for control theory (stability). |
| **Free-Motion Reaching:** Robot hands an object to a human (airtime only). | **REJECT** | Unless it uses Active Inference (Phase 2 gap). |

---

## 3. The "Unknown Environment" Filter
*Theory:* The surface normal $\mathbf{n}$ is unknown.
*Reality:* Most papers cheat and use a CAD model.

| Scenario | Decision | Rationale |
| :--- | :--- | :--- |
| **Online Estimation:** Robot estimates $\mathbf{n}$ from F/T sensor or velocity. | **KEEP (Gold Standard)** | This is the "Spine" of the thesis. |
| **Model-Reference:** Robot compares real force to a known CAD map. | **REJECT (Strict)** | Solves a different problem (localization error), not unknown geometry. |
| **Constant Surface:** Robot assumes the wall is always flat vertical ($n = [1, 0, 0]$). | **KEEP (as Baseline)** | Useful for comparison, but note as "limited applicability." |
| **Vision-Based Lookahead:** Robot scans surface with laser/camera before touching. | **KEEP (as Competition)** | This is the "rival" approach. Keep to contrast with force-only methods. |

---

## 4. The "Active Inference" Filter (Phase 2)
*Theory:* Intent inference for control.
*Reality:* Most Active Inference is purely simulation or cognitive science.

| Scenario | Decision | Rationale |
| :--- | :--- | :--- |
| **Robot Control Loop:** Free energy minimization drives torque/velocity. | **KEEP** | Relevant to implementation. |
| **Cognitive Modeling:** Explaining how human brains work (no robot). | **REJECT** | Psychology/Neuroscience, not Robotics. |
| **Simulation Only:** MatLab simulation of a 2-link arm. | **KEEP (Tier 3)** | Acceptable because the field is new, but lower quality evidence. |
| **Discrete Decision Making:** AI decides "Go Left" vs "Go Right" (High level). | **REJECT** | We need *continuous* control (low level signal modulation). |

