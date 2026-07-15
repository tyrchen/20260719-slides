# Visualization and D3 patterns

## Select by relationship

| Content relationship | Preferred form | Avoid |
| --- | --- | --- |
| two alternatives | strong contrast | two identical cards with weak labels |
| repeated fields | table | prose list |
| ordered work | flow or timeline | unrelated circles |
| feedback and learning | loop or flywheel | one-way arrows |
| multi-role collaboration | directed network | role list without flow |
| options with trade-offs | decision matrix | declaring a winner without dimensions |
| three sources, one method | convergence streams | three circles pointing at an empty center |
| layers of career value | stack | vague pyramid |
| future tensions | compass or branching horizon | another summary quote |

Skip a visualization for one fact, one instruction, or a short quotation.

## Make diagrams explanatory

Every diagram must identify:

- entities;
- direction;
- transformation;
- verifier or feedback source;
- ownership or responsibility when relevant.

Use color consistently. For example:

- software: blue;
- hardware: lime;
- knowledge: orange;
- synthesis: pink;
- career and responsibility: violet;
- final reflection: cyan.

Do not change the meaning of a color halfway through the deck.

## D3 motion rules

Use animation to reveal one of these:

- data moving through a system;
- work branching across roles;
- feedback returning;
- exceptions escalating;
- evidence accumulating;
- a repeated cycle accelerating;
- several worlds converging.

Keep fixed geometry for explanatory networks. Force simulation introduces jitter and weakens precise storytelling unless emergence itself is the point.

Make essential nodes visible on the first frame. Animate:

- path drawing;
- particles along stable paths;
- value interpolation;
- subtle emphasis;
- transitions between meaningful states.

Do not animate all nodes from opacity zero when an early screenshot or a quick slide advance would look empty.

## Continuous flow pattern

For looped particles:

1. Compute `path.getTotalLength()`.
2. Use `getPointAtLength(t * length)` in `attrTween`.
3. Repeat only while the containing slide has `.active`.
4. Interrupt and hide the particle after leaving the slide.
5. Rerender the chart when revisiting the slide.

Use staggered particles rather than one large moving dot. Keep particles smaller than labels and nodes.

## Collaboration network pattern

Show at least four flows:

1. human direction and permission entering the system;
2. work moving among Agent roles;
3. artifacts and evidence reaching users, tests, or production;
4. feedback returning, with exceptional cases visibly escalating to a human.

This distinguishes delegation from abdication.

## Final-page pattern

Tie the final visual to the deck's vocabulary. A useful construction is:

- center: human agency;
- moving ring: AI-accelerated software, hardware, and knowledge work;
- outward axes: direction, evidence, imagination, responsibility;
- endpoints: open questions rather than conclusions.

Leave negative space and end with one short framing sentence.

## Layout and typography

Use 1280×720 as the minimum desktop audit unless the user specifies another baseline.

- Keep titles on one line.
- Prefer title sizes above 34px at 720p.
- Keep chart labels legible after `viewBox` scaling.
- Reserve top and bottom space for navigation chrome.
- Use safe horizontal margins.
- Keep evidence bars and captions outside chart collision zones.
- Reduce chart height before shrinking all labels.

Inspect dense and animated slides at both initial and settled states.

## Slide-site architecture

Render charts only in the active slide. On navigation:

1. set the active class;
2. update theme color and page metadata;
3. render charts inside the active slide;
4. clear and rebuild the SVG when revisiting.

Vendor D3 locally for offline talks. Place chart data and labels next to the renderer, not in CSS.

