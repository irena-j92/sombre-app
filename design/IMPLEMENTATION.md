# Reference extraction and implementation

Source: six high-resolution Figma-style SVG exports, each exactly 393 × 852. Text has been converted to path outlines, so source font names are unavailable. All layouts are light mode. These supplied SVGs supersede the previous concept boards.

## Seven-layer extraction

| Layer | Measured reference and implementation |
|---|---|
| Layout | Single 393 × 852 frame. Content margins 24px; usable width 345px. Status strip y20–36. Onboarding arrows y50–94; header controls same. Footer rule y784. |
| Typography | Heading candidate: Instrument Serif, chosen for high contrast, fine serifs, narrow rounded letterforms; Georgia fallback. Start/Intro headings ~32px, line-height32px. Feature titles20/24. Summary24–26/32. Body neutral sans14/20, summary16/19; DM Sans/Arial. Source wordmark preserved as outlined vector. |
| Color | White #fff. Start background #f2f2f2. Ink #111. Secondary #888. Pills #e8e8e8, selected pink #f2d2e4. Rule #c4c4c4. Outer stage #f7f7f7. Core radial: #be903c 50%, #d390bf 75%, #ec5f2b 100%. Splash: #4d4c00, #5ba871, #fdc0f8, #ffad74, #ff6c2c. |
| Spacing | Onboarding intro x24 y122. Feature tile64 ×64, gap16 to text. Start rows y322/406/490, row gap20. Intro rows y291/379/467/555, gap24. CTA x24 y716, 345×56. |
| Components | Square black CTA with no radius, solid black64px feature tiles, underlined links, thin chevrons, nine-dot menu, 32px Core avatar and68px Profile avatar, 220px/110px kernel, 110×45 mood pills with22.5px radius; one pink pill rotated−15.0743°. |
| Atmosphere | Flat interface, no added card shadows or rounded device border. Splash gradient gently translates/scales. Very subtle splash grain; static radial kernel matches reference. Original portrait reused with center crop. |
| Responsive/interaction | Center fixed frame on desktop. Proportional downscale below393px. Scroll screen content inside fixed frame when expanded. Fresh launch3s splash; reduced motion freezes animation; keyboard focus, native buttons, browser history and tab-arrow navigation. |

## Screens

### Splash
Full-frame animated gradient. White illustrative device status strip. Original outlined logo bounds x121 y402 width151 height39, centered horizontally. Three-second timed transition uses history replacement so Back does not return to the splash. No credentials or collection occur.

### Start
#f2f2f2 background. Heading “A little room / for how you feel.”; supporting copy; three feature rows with source’s blank black tiles. Begin and forward arrow open Intro. Account link displays prototype scope and a continue-on-device action.

### Intro 01
White background. Heading “Your feelings / belong to you.” Four privacy feature rows. Begin and forward arrow open Core. Back returns to Start. Privacy link explains the current sample-only implementation rather than claiming unimplemented security guarantees.

### Core
Avatar center x40 y72; date at top; disabled future menu. Four period tabs, initially This week. Kernel center196,287 radius110. Summary follows reference including lorem ipsum. Six blank source pills remain decorative. Rule at784. Avatar opens Profile. Period tabs select accessible demo views using the same supplied sample artwork; no fabricated clinical or computed metrics.

### Profile
Back arrow returns to Core; title You. Avatar center196,145 radius34. Zoey and biography. Timeline bars y303–363, baseline375, endpoint captions Aug25/Sep04. Missing day remains blank. Kernel center196,496 radius55. Shared MoodSummary component. No data is public or sent.

## Verification

Production build and eight interaction checks cover the timer, complete navigation chain, onboarding arrows, history synchronization, keyboard period selection, privacy dialog dismissal/focus, account explanation and narrow-frame scaling.

Native browser QA is unavailable in this environment because the required control-browser capability is not installed. No live browser visual comparison is claimed. Original SVGs were rasterized for reference inspection; implementation measurements and asset colors were checked against source coordinates.

## Future work

Connect Settings and other screens incrementally without replacing this component structure. Add actual mood data only with explicit storage and privacy behavior. Original exports remain in `design/references/` for faithful follow-up work.

## Increment 2 — Calendar and check-in (19 October 2026)

Seven new 393 × 852 SVG references were inspected: Calendar, Entry, Mood Picker, Check in, Mood Explainer, Today’s Entry, Share. Share is retained for the next increment; six screens are connected in this increment.

### Layout extraction

- Calendar: white canvas; shared header y50–94, year2026. Large04 date and Tuesday at left, muted Sep at right. Week labels y414. Seven columns of45×60 tiles starting x24 y440, with5px gaps, five rows ending760. Sixth top-row tile at x274 y440 opens Entry. Ten original gradient tiles extracted at3× for reuse; empty tiles #f8f8f8, white8px dots and12×2 future dashes.
- Entry: full-frame vertical gradient #3fa3d9 → #d1a4d9 → #efd2e0 → #d9a0ae → #f086a4. White status/header. Privacy badge x24 y122,80×32; two decorative32px markers to right. Title Calm session around y195, quotation follows. Bottom seven groups of three8px dots; groups are32px wide separated by20px; row spacing12px, baseline y756. Footer68px with translucent white fill.
- Mood Picker: heading at x24 y111,40/40 serif. Six165px gradient circles in two columns,15px gaps, x24/204 and y235/415/595. Labels26px serif. Original happy/sad/embarrassed/angry/calm/frustrated palettes reproduced from SVG stops.
- Check in: angry radial gradient centered197,426,479px radius with #f8c6f7/#fee2ec/#ff8d88/#fa7800/#cb0027 stops. White header and80px serif counter in the middle. First state adds requested Voice/Type choices. Voice starts at00:00, advances for6seconds, then opens Mood Explainer. Bottom waveform varies every280ms. No microphone access, recording or speech analysis occurs.
- Mood Explainer: angry linear gradient #cb0027/#fa7800/#ff8d88/#fee2ec/#f8c6f7. Header Your Mood; angry, pronunciation and source definition beginning y231. Analysis status below. First dot group16rows, next4, remaining2; fills bottom to top. Auto transition after3.2seconds, canceled on leaving.
- Today’s Entry: same linear gradient and privacy row as source; title Intense moment, supplied placeholder quote or current typed note. Tall first dot group. Back/Done return to Core. Shared Entry component preserves saved/today variations.

### Interaction and state

Profile graph is a native button. The menu is a new-entry button across active headers. Mood-picker back returns to the screen from which new entry was launched. Selecting a mood starts a fresh draft. Drafts are temporary in-memory state and never leave the browser tab. Voice is explicitly labeled Voice preview. Timed transitions replace transient history entries. Type is optional, requires nonblank text, and supports up to3000characters. Entry’s play control replays the dot visualization; no unavailable audio is claimed. Private/share placeholder lock icons are decorative until designed.

### Verification

All13interaction checks pass: previous eight plus calendar/Entry navigation and target placement, full Voice timing and changing waveform, timer cancellation/origin return, typed-note propagation, and analysis cancellation. Production build checked. The earlier browser-QA limitation still applies; no live browser visual test is claimed.

## Increment 3 — Physical entry page turns (19 October 2026)

Motion purpose: establish adjacent saved/today entries as pages in a private journal. Physical, restrained motion; no changes to unrelated screens.

- Input: footer arrows/top Next, horizontal swipe or edge drag. Turn takes0.72seconds for a button, while drag release uses0.18–0.68seconds according to remaining travel. GSAP power2 curves accelerate the sheet and decelerate it into place; progress stays bounded0–1 so paper never overshoots beyond the book.
- Rendering: a180×24-segment plane is bent around a moving cylinder in custom GLSL. Cylinder radius0.105of page width. Grab height tilts the fold; front shading follows the bend. Back face is warm paper with faint mood-color transmission from the unprinted margin. A second shader renders the destination and contact shadow.
- Content: html2canvas captures both actual React entry papers after fonts load, in memory, on-device. Snapshot clone is detached from the scaled mobile frame. No screenshots, text or notes are uploaded. Page navigation/status controls stay above the canvas. The destination hands off to the semantic DOM with dots already filled, avoiding a final-frame flash.
- Performance: GSAP/Three/html2canvas are lazy-loaded in entry viewing. Capped2×pixel ratio, two canvas textures, two meshes, rendering only on progress updates. No permanent animation loop. Resources and pending turns are canceled/disposed when leaving. Texture/capture failures and context loss return to usable DOM navigation.
- Access: real buttons, live page count, keyboard arrows, cancel via Escape, reduced-motion and WebGL-unavailable instant fallback. Vertical note scrolling is retained; pointer capture starts only after horizontal intent. A short drag cancels; >30%travel or a deliberate quick flick commits.
- Verification:18DOM/interaction checks cover existing flows plus animated forward/backward completion, partial-drag cancellation, deliberate swipe and unmount cleanup, keyboard/reduced-motion navigation and WebGL failure. Four GLSL stages compiled in a standalone Mesa/EGL OpenGL ES context; forward/backward turns rendered at eight progress checkpoints and inspected. Both final frames matched the destination entry textures. Browser capture fidelity and device GPU performance remain unverified because native browser QA is unavailable here.


## Preview reliability correction

Root cause traced in html2canvas1.4.1 DocumentCloner.createCanvasClone: it calls the source canvas.getContext('2d'). Because entry snapshots were prepared before WebGL initialization, cloning the full document claimed the animation canvas as a2D canvas, preventing later WebGL use. The canvas/overlays now carry data-html2canvas-ignore and an explicit capture filter excludes canvases before cloning.

Other fixes: zero-detail clicks no longer imply keyboard input; keyboard intent is tracked from actual key events. Calendar entry selection performs a book-opening turn. Snapshot failures/timeouts/transparent output use a native Canvas2D painting of the entry's actual title, note, mood palette and dots. WebGL failure uses a28-strip GSAP/CSS3D curl instead of silently skipping the effect. Context loss invalidates the failed renderer. A data-page-turn-renderer attribute exposes the chosen renderer for debugging without adding UI.

Validation:25checks cover existing flows plus capture exclusion, capture failure/timeout, compositor forward/back endpoints and disposal, zero-detail clicks, Calendar opening and missing/failed WebGL. Production build passed. Live browser QA remains unavailable; the initialization conflict was identified from the actual capture-library source and covered by regression checks.

## Reference refinement — bottom-corner curl

Reference: `design/references/corner-turn-reference.jpg`. The desired geometry is a lower-right triangular peel with a tapered white underside, not a full-height vertical roll.

The GLSL sheet now projects every vertex onto an oblique fold normal (about23degrees), with the fold beginning at the bottom outer corner. Radius narrows toward the top to create a pointed lip. Surface position and lighting follow the diagonal bend; the reverse is near-white with a gray crease and minimal mood-color transmission. The destination receives a soft diagonal contact shadow. Previous-entry turns mirror this to the lower-left corner.

The mesh is128×160segments for a smooth diagonal silhouette. The compositor fallback uses an18×32grid of tiles and the same physical-coordinate geometry from `geometry.js`, with local3Drotation around the fold axis. Controls, capture exclusion, gesture cancellation and reduced-motion behavior remain intact.

Validation:28interaction/geometry checks, including a flat initial page, lifted lower corner with untouched top edge, mirrored reverse turns, and full sheet clearance at completion. Both GLSL directions compiled and rendered at0%,15%,42%,100%; final frames matched the destination textures. Live browser QA remains unavailable.

## Direct launch and flowing splash (22 October 2026)

Removed the Start/Intro component, routes, and associated styles. A fresh visit keeps the three-second splash, then replaces it with Core; legacy Start/Intro hashes normalize to Core on initial load and history navigation.

The original five-color splash palette is now warped inside a lightweight WebGL fragment shader. Three overlapping wave fields deform the color transitions while the wordmark, status bar, and grain remain separate and sharp. One quad, capped 1.5× pixel ratio, no new dependencies. Reduced motion renders one still frame. Missing/failed WebGL or context loss reveals the original CSS gradient; leaving the screen cancels the frame loop and deletes buffers, program, and shaders.

Validation: all 28 interaction/geometry checks and the production build pass. Both splash GLSL stages compiled in a standalone Mesa/EGL context; frames at 0, 1.25, and 2.5 seconds were rendered and visually inspected to verify distinct flowing waves and the retained palette. Browser QA was attempted through the managed preview, but browser security policy blocked observation; browser appearance and device performance remain unverified.
