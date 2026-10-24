# Increment 10 — Maya’s relationship Stories

Eleven supplied high-resolution393×852 mobile SVGs. The filled white progress widths atx24/y67 determine order, independently of upload order or filenames:

| Position | Source title | Filled width |
|---|---|---|
|1|Zero Days Apart 👶|32px|
|2|Quietly Twin-Coded 👯‍♀️|57px|
|3|The Three-Word Diagnosis 🏷️|89px|
|4|The Secret Superpower 💡|121px|
|5|Unlocked Memory 🗝️|153px|
|6|The Lifeline 📞|185px|
|7|Upgraded Connection 📈|217px|
|8|Curiosity Unlocked ❓|249px|
|9|Water Under the Bridge 🌧️|281px|
|10|Never Change 🔒|313px|
|11|Bottom Line 🤍|345px|

Intake/extraction: full-frame light-text gradient stories, no bottom navigation. A common vertical gradient uses#ffaf8b0%,#ff91c631.6901%,#ffade859.3897%,#82ae4e91.3146%, with10% black tint. Status bar stays at20px; continuous progress is345×2px at24/67, track20% white (10% final). Next is a65×30px15px-radius white15% pill at304/99 with a44px hit area. Final Share is40px at329/99; final Close is345×44px at24/727. Text is centered in varying mid-frame blocks: the original supplied serif outlines are retained exactly as transparent vector assets rather than approximated with another font. A native heading/blockquote supplies accessible title and exact prose for each page. No extra visual heading is introduced. Source screens remain unchanged in design/references/increment-10.

Route: Maya profile → Space → View Story → friend-story/maya. Other friends keep their existing generic relationship Note; Maya-specific statements are never assigned to another person. A direct story link for another friend returns to that friend’s Space. This immersive route omits the bottom bar; closing returns to Maya’s Space. Each opening starts at frame1; only one history entry is added for the viewer.

Interaction: auto-advance every7s for frames1–10; final frame remains open for reading, Close, replay or Share. Continuous progress starts at the supplied chapter width and interpolates toward the next chapter while time passes. Tap left32% goes back; tap elsewhere or Next advances. Hold pauses without advancing on release. Horizontal swipes navigate; downward swipe closes. Arrow keys navigate, Escape closes, and Space toggles playback when focus is not on a native control. Small persistent Close/Pause controls extend the source so users can exit or pause anywhere; final Pause becomes Replay. The share sheet copies the supplied story text and sends nothing. Dialog/background behavior is inherited from the existing accessible Modal.

Timers stop on document hiding/window blur, pointer hold, explicit pause, share-sheet opening and unmount. Resuming preserves reading time. Reduced motion starts in manual mode; users can opt into playback. Frames switch directly, without dimming their text. Existing reduced-motion styles suppress progress interpolation. All artwork is warmed locally before quick navigation. Private journals, mood drafts, friend messages and capsule data are not used.

## Validation

73 automated checks pass across all existing flows and nine new story checks. Ordering is verified independently by reading the white-bar widths from every retained source SVG. Tests cover every chapter, final hold/replay/close, precise pause/resume timing, tap/swipe/hold gestures, visibility and focus suspension, reduced motion, keyboard/assistive navigation, share scope, timer cleanup and subject protection. Production build passes. The supported browser confirmed the full entry path, automatic progression, pause, tap-left navigation and faithful full-frame vector artwork. The final chapter reached100% and exposed Share/Close/Replay, Close returned to Maya’s Space with the main navigation restored, and reopening started at frame1. The share sheet displayed only the11 supplied chapters; the test browser denied clipboard writing and the manual-copy fallback appeared correctly. Clipboard success is covered by the automated check.
