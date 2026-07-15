---
name: build-high-quality-slides
description: Design, build, revise, and validate high-quality slide decks and modern HTML slide sites. Use when Codex needs to turn an outline into a presentation, improve an existing deck, remove AI-like or translated prose, design diagrams and D3 visualizations, add transitions and keyboard/fullscreen behavior, separate slide content from styles, audit title wrapping and overflow, or publish a static presentation to GitHub Pages. Especially useful for long Chinese technical talks with multiple topics, demos, charts, and a narrative ending.
---

# Build High Quality Slides

Build a presentation as a guided argument, not a stack of decorated pages. Make every visual explain a relationship and make every transition earn the next topic.

## Establish the contract

Before editing:

1. Inspect `AGENTS.md`, the repository status, existing slide architecture, and user-owned changes.
2. Identify the audience, duration, thesis, learning outcomes, topic count, demo constraints, and target page range.
3. Inventory every current slide by number, section, title, and purpose.
4. Treat screenshots from the user as concrete defect reports. Locate the exact slide and reproduce at the shown resolution.
5. Preserve unrelated modifications. Never fold unfinished user content into a slide commit without intent.

Define success in audience terms: what should they remember, explain, question, or do after the talk?

## Build the narrative before the pages

Use this sequence:

1. Open with the tension, proof, and central claim.
2. Give each topic one governing question and one external verifier.
3. Advance through end-to-end slices, evidence, failure modes, and conclusions.
4. Insert transition pages that connect the previous topic's verifier to the next topic's uncertainty.
5. Reserve demos as blank, unmistakable pages when the user requests placeholders.
6. End with synthesis, human responsibility, curiosity, imagination, and open questions—not a repeated summary.

For a multi-topic technical talk, let recurring structure create coherence. Examples:

- software → tests and compatibility;
- hardware → measurement and field data;
- knowledge → sources, review, and reader understanding;
- shared method → build, measure, learn, and retain project memory.

## Write natural, speakable copy

Read [editorial-review.md](references/editorial-review.md) whenever the deck contains Chinese copy or the user reports AI-like/translated language.

Apply these rules:

- Put one claim in each title and keep the title on one line.
- Prefer concrete verbs and observable evidence over abstract nouns.
- Translate general labels into Chinese; retain English only for real technical identifiers or protocols.
- Avoid repetitive rhetorical questions, symmetrical slogans, and inflated claims.
- Use one memorable sentence only when it follows from the evidence already shown.
- Give all quotations one consistent visual treatment.
- Read every title and lead aloud. Rewrite anything a speaker would not naturally say.

## Choose the smallest visual that proves the point

Read [visualization-patterns.md](references/visualization-patterns.md) before adding or redesigning diagrams.

Match form to relationship:

- comparison → two-sided contrast or matrix;
- exact mapping → table;
- sequence → flow or timeline;
- feedback → loop or flywheel;
- ownership and collaboration → network with direction and escalation;
- layered capability → stack;
- trade-offs → decision matrix or positioned plot;
- convergence → colored streams feeding a shared method;
- reflection → compass, horizon, branching questions, or deliberate negative space.

Do not use a decorative cluster of unlabeled circles. A viewer should understand what moves, what changes, and what proves correctness without narration.

## Use D3 only when motion carries meaning

Use D3 for data flow, feedback, convergence, repeated cycles, changing values, and collaboration networks. Use HTML/CSS/SVG for stable cards, tables, and simple architecture.

For every D3 chart:

1. Use a stable `viewBox` and deterministic node positions unless simulation is the actual subject.
2. Make the first frame complete and readable. Animate paths and particles, not basic comprehension.
3. Keep labels outside moving paths and verify the smallest presentation resolution.
4. Give topic colors persistent meaning across the deck.
5. Loop flow animations only while the slide is active; stop them after leaving and restart by rerendering on return.
6. Use motion to show direction, feedback, state change, or accumulation. Remove motion that only decorates.
7. Vendor critical runtime dependencies for offline talks and retain their licenses.

## Keep content, presentation, and runtime separate

Prefer this structure for a slide site:

```text
index.html       shell and controls
content.js       slide order, titles, and semantic markup
styles.css       layout, theme, typography, responsive rules
charts.js        D3 renderers and local chart data
visuals.js       reusable static SVG illustrations
app.js           navigation, fullscreen, overview, title fitting
vendor/          offline dependencies and licenses
```

Do not bury prose inside CSS or navigation logic. Keep chart labels near chart data. Make routine content edits possible without touching layout code.

## Design transitions and the ending

Use a transition page when changing engineering worlds or moving from method to career. State both sides of the bridge.

Build the ending as an emotional sequence:

1. show what changes;
2. show what remains human;
3. restore curiosity and imagination;
4. ask exploratory questions;
5. finish with a visual that leaves agency with the audience.

Do not finish by restating the opening quote. A strong final page opens the Q&A rather than closing thought down.

## Validate in proportion to presentation risk

Before delivery:

1. Run syntax checks for all JavaScript.
2. Confirm the page count and navigation targets.
3. Run the bundled layout audit:

   ```bash
   node .agents/skills/build-high-quality-slides/scripts/audit-slide-site.mjs index.html --width 1280 --height 720
   ```

4. Require zero slide overflow and zero title overflow. Investigate titles smaller than the chosen threshold.
5. Capture screenshots of dense slides, D3 slides, transitions, the longest title, and the final page.
6. Check initial and animated states. A screenshot taken early must not look empty.
7. Test keyboard navigation, overview, touch navigation, fullscreen, direct hashes, and return visits to animated slides.
8. Test offline loading when the talk cannot depend on venue networking.

Never claim a visual is fixed from code inspection alone. Render it at the user's resolution.

## Publish safely

For a static GitHub Pages deployment:

- package only runtime files;
- include local vendor dependencies and licenses;
- use the official Pages artifact and deploy actions;
- trigger deployment from the default branch;
- verify the workflow conclusion and the public URL with HTTP 200;
- keep source-only notes and drafts out of the deployed artifact.

## Completion gate

Finish only when all are true:

- the deck has a coherent argument and smooth topic transitions;
- Chinese copy is natural and speakable;
- titles stay on one line without becoming too small;
- diagrams explain relationships rather than decorate;
- D3 animation has semantic purpose and a readable first frame;
- the ending raises the audience's emotional and intellectual energy;
- layout audit, screenshots, navigation, and deployment checks pass;
- unrelated user changes remain intact.

