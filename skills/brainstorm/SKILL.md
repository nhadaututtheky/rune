---
name: brainstorm
description: Creative ideation and solution exploration. Generates multiple approaches with trade-offs, uses structured frameworks (SCAMPER, First Principles), and hands off to plan for structuring.
metadata:
  author: runedev
  version: "0.2.0"
  layer: L2
  model: opus
  group: creation
---

# brainstorm

## Purpose

Creative ideation and solution exploration. Brainstorm is the creative engine of the Creation group — it generates multiple approaches with trade-offs, explores alternatives using structured frameworks, and hands the selected approach to plan for structuring. Uses opus for deep creative reasoning.

<HARD-GATE>
Do NOT invoke any implementation skill or write any code until the user has approved the design.
This applies to EVERY task regardless of perceived simplicity.
"This is too simple to need a design" is a rationalization. Simple tasks get simple designs (a few sentences), but they still get designs.
</HARD-GATE>

## Triggers

- Called by `cook` when multiple valid approaches exist for a feature
- Called by `plan` when architecture decision needs creative exploration
- `/rune brainstorm <topic>` — manual brainstorming
- Auto-trigger: when task description is vague or open-ended

## Calls (outbound)

- `plan` (L2): when idea is selected and needs structuring into actionable steps
- `research` (L3): gather data for informed brainstorming (existing solutions, benchmarks)
- `trend-scout` (L3): market context and trends for product-oriented brainstorming
- `problem-solver` (L3): structured reasoning frameworks (SCAMPER, First Principles, 6 Hats)
- `sequential-thinking` (L3): evaluating approaches with many variables

## Called By (inbound)

- `cook` (L1): when multiple valid approaches exist for a feature
- `plan` (L2): when architecture decision needs creative exploration
- User: `/rune brainstorm <topic>` direct invocation

## Cross-Hub Connections

- `brainstorm` ↔ `plan` — bidirectional: brainstorm generates options → plan structures the chosen one, plan needs exploration → brainstorm ideates

## Reasoning Frameworks

```
SCAMPER     — Substitute, Combine, Adapt, Modify, Put to use, Eliminate, Reverse
FIRST PRINCIPLES — Break down to fundamentals, rebuild from ground up
6 THINKING HATS  — Facts, Emotions, Caution, Benefits, Creativity, Process
CRAZY 8s    — 8 ideas in 8 minutes (rapid ideation)
```

## Executable Steps

### Step 1 — Frame the Problem
State the decision to be made in one clear sentence: "We need to decide HOW TO [achieve X] given [constraints Y]." Identify:
- Hard constraints (cannot change): budget, existing tech stack, deadlines
- Soft constraints (prefer to avoid): complexity, breaking changes, unfamiliar tech
- Success criteria: what does a good solution look like?

If the problem is unclear, ask the user ONE clarifying question before proceeding.

### Step 2 — Generate 2–3 Approaches
Produce exactly 2–3 distinct approaches. Each approach must be meaningfully different — not just variations of the same idea. For each approach provide:
- **Name**: short memorable label
- **Description**: 2–4 sentences on how it works
- **Pros**: concrete advantages (not generic "simple" — be specific)
- **Cons**: concrete disadvantages and failure modes
- **Effort**: low (< 1 day) | medium (1–3 days) | high (> 3 days)
- **Risk**: low | medium | high + one-line explanation of the main risk

If the domain is unfamiliar or data is needed, invoke `rune:research` before generating options. For product/market context, invoke `rune:trend-scout`.

### Step 3 — Evaluate
Apply the most relevant framework to structure the evaluation:
- Use **SCAMPER** when exploring variations of an existing solution
- Use **First Principles** when the problem looks unsolvable with conventional approaches
- Use **6 Thinking Hats** when stakeholder perspectives matter (product vs. engineering vs. user)
- Use **Crazy 8s** (rapid listing) when time-boxed exploration is needed

For approaches with many interacting variables, invoke `rune:sequential-thinking` to reason through trade-offs systematically.

### Step 4 — Recommend
Select ONE approach as the recommendation. State:
- Which option is recommended
- Primary reason (1 sentence)
- Conditions under which a different option would be better (hedge case)

Do not recommend "it depends" without a concrete decision rule.

### Step 5 — Return to Plan
Pass the recommended approach back to `rune:plan` for structuring into an executable implementation plan. Include:
- The chosen option name
- Key constraints to honor in the plan
- Any risks identified that the plan must mitigate

If the user rejects the recommendation, return to Step 2 with adjusted constraints and regenerate.

## Constraints

1. MUST propose 2-3 approaches with trade-offs — never present only one option
2. MUST include your recommendation and reasoning for why
3. MUST ask one question at a time — don't overwhelm with multiple questions
4. MUST save approved design to docs/plans/ before transitioning to plan
5. MUST NOT jump to implementation — brainstorm → plan → implement is the order

## Output Format

```
## Brainstorm: [Topic]

### Context
[Problem statement and constraints]

### Option A: [Name] (Recommended)
- **Approach**: [description]
- **Pros**: [advantages]
- **Cons**: [disadvantages]
- **Effort**: low | medium | high
- **Risk**: low | medium | high — [main risk]

### Option B: [Name]
- **Approach**: [description]
- **Pros**: [advantages]
- **Cons**: [disadvantages]
- **Effort**: low | medium | high
- **Risk**: low | medium | high — [main risk]

### Option C: [Name] (if needed)
...

### Recommendation
Option A — [one-line primary reason].
Choose Option B if [specific hedge condition].

### Next Step
Proceeding to rune:plan with Option A. Constraints to honor: [list].
```

## Cost Profile

~2000-5000 tokens input, ~1000-2500 tokens output. Opus for creative reasoning depth. Runs infrequently — only when creative exploration is needed.
