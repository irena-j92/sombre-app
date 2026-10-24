# Sombre

Sombre’s connected screens, rebuilt as a React + Vite + Tailwind CSS web app from the supplied 393 × 852 SVG designs.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Vite serves the app at http://localhost:4173. To create and inspect the production build:

```sh
npm run build
npm run preview
```

Run the interaction checks with `npm test`.

## Current flow

- A fresh visit opens the grainy, waving gradient splash for three seconds, then goes directly to Core.
- Old Start and Intro links redirect to Core.
- Core → profile photo → Profile → back arrow → Core.
- Bottom navigation: Home → Core; Spaces → the friends activity feed; You → Profile; Diary → Scrapbook Pick; center gradient circle → Mood Picker. The bar now uses the supplied icons and angular-gradient circle rather than visible text labels.
- Diary → cover plus → New Entry → archive icon → Time Capsule 02 → calendar icon → Time Capsule 01. Back controls follow this sequence in reverse.
- Story and capsule text are separate temporary drafts. Mood strips can be selected, Type focuses the editor, and View Collection returns to Diary. Open Capsule reveals the current capsule text, or the sample message when empty.
- Profile → entry graph → Calendar → sixth rectangle in its first row → Entry.
- The header nine-dot menu is inactive on every screen. Use the central gradient circle in the bottom navigation to log a mood.
- Updated Mood Picker → angry → 2.2-second bouncing circle transition → Check in → Voice → six-second timer → updated Mood Explainer → after 3.2 seconds → updated Today’s Entry.
- The transition circle rises, rebounds, then expands into Check In’s warm radial background. Reduced motion uses a short still transition.
- Today’s Entry → First Aid icon → exercise list (inactive for now) → Skip → Core. Back returns to the same entry.
- Today’s Entry → Share → supplied sample profile card and share tray → Close or Escape → same entry. Save downloads the supplied sample card; external platform actions are inactive in this increment.
- Today and First Aid use the nine-dot menu in place of edit. Main navigation uses the supplied Home, Spaces, Diary and You icons with a central angular-gradient circle. All five controls work and retain accessible text labels. Book pagination sits in the privacy row above the new bar.
- Check in first offers Voice and Type. Type accepts a note and carries it through to Today’s Entry.
- Entry dots fill by rows from bottom to top. Voice dots vary in height; reduced-motion preferences keep the waveform still. Leaving a screen cancels its pending timers.
- Browser Back and Forward work. Hash URLs allow each screen to reload directly: `#/core`, `#/spaces`, `#/profile`, `#/calendar`, `#/entry`, `#/mood-picker`, `#/transition`, `#/check-in`, `#/mood-explainer`, `#/todays-entry`, `#/first-aid`, `#/share`, `#/diary`, `#/new-diary-entry`, `#/time-capsule-compose`, `#/time-capsule-ready`.
- The frame stays 393 × 852, centered on an almost-white page. Narrower viewports scale it proportionally; shorter desktop viewports can scroll the outer page.
- Reduced-motion preferences disable movement and transitions.

## Scope

This is the first visual frontend increment, using sample data. There is no account service, real mood tracking, health assessment, microphone capture, audio analysis, backend, or data collection. Voice is a timed visual prototype with no microphone permission request. Typed notes exist only in React state in the current tab, and reset on reload or a new entry. Period tabs change the selected view while showing the supplied sample artwork. Read More explains the sample summary. Header menu buttons remain visible but disabled; the central gradient button opens Mood Picker.

The blank mood pills, lorem ipsum summary, date and profile content intentionally match the references. Replace them when their corresponding features are designed. The Settings reference is retained for the next iteration and is not connected yet.

## Structure

- `src/screens/`: Splash, Core, Spaces, Profile, Calendar, MoodPicker, MoodTransition, CheckIn, MoodExplainer, Entry (saved and today variants), FirstAid, Share, ScrapbookPick, DiaryEditor (story/capsule variants), TimeCapsuleReady.
- `src/components/`: frame, header/navigation, status bar, reusable gradient kernel, mood summary, accessible modal.
- `src/hooks/useScreen.js`: portable hash routing.
- `src/data/`: sample timeline, extracted calendar tiles, mood palettes, and check-in timing.
- `src/styles.css`: exact frame measurements, design tokens and animation.
- `public/assets/`: supplied avatar, extracted SVG wordmark and calendar gradient artwork.
- `design/references/`: original SVGs plus later screen references under increment-4/, increment-5/ and increment-7/.
- `design/IMPLEMENTATION.md`: reference measurements and verification notes.

Fonts are bundled locally. Instrument Serif is the closest selected heading face because the exported text is outlined; original font metadata is absent. Body text follows the supplied neutral sans style. No remote fonts or stock imagery are required.

## Book-style entry browsing

Entry and Today’s Entry are two pages in one book viewer. Use the footer arrows, the saved entry’s top Next arrow, a horizontal swipe, or drag the page edge. A short drag returns the paper to rest; a longer drag or flick completes the turn. Left/Right arrow keys switch pages directly. Escape cancels an in-progress curl. The top Back/Done controls still leave the entry viewer.

GSAP animates a Three.js WebGL sheet with custom GLSL vertex/fragment shaders: a tapered bottom-corner peel that moves diagonally up the page, a clean white paper reverse, and a soft moving crease shadow. The actual rendered entry—including a typed note, mood gradient, privacy markers, and dots—is captured locally with html2canvas and mapped onto the sheet. Header controls remain live above the turning page. No snapshots or notes leave the browser.

Selecting the saved entry in Calendar also opens it with a book-page turn. Preview-generated pointer clicks animate even if their click detail is zero. The graphics/capture code loads only inside entry browsing. Rendering happens only while dragging or settling; the canvas is hidden at rest. GPU textures and context are disposed when leaving the viewer. Reduced motion and keyboard navigation use instant page changes. Unavailable WebGL uses a GSAP-driven compositor page curl instead. The live semantic page remains the source of accessible content throughout.


### Preview reliability fix

The animation canvas and overlays are explicitly excluded from html2canvas cloning. Cloning the unused animation canvas would otherwise initialize it as 2D before Three.js could request WebGL, silently disabling the curl. Capture rejection, empty/tainted snapshots, or a capture timeout now use a native-canvas entry texture. If WebGL cannot initialize, a576-tile CSS3D/GSAP renderer bends the same diagonal corner geometry with a paper reverse and shadow. Only actual keyboard input or reduced motion bypasses animation.

## Direct launch and wavy splash

Start and Intro have been removed. The splash retains its three-second duration and now replaces itself with Core. Old onboarding hash links normalize to Core, including browser history navigation. A lightweight WebGL shader bends the original olive, green, lilac, peach and orange palette with overlapping waves beneath the fixed wordmark and grain. It uses one quad, caps pixel ratio at 1.5, and disposes resources on exit. Reduced motion draws one still frame; unavailable WebGL shows the original static gradient.

## Updated check-in flow

See `design/INCREMENT-4.md` for the extracted measurements, palettes and motion timings. Voice remains a timed visual preview with no microphone capture or real audio analysis. The assistant badge says preview. First Aid exercises are disabled as requested; only navigation and Skip are active. The supplied Share QR/handle are sample profile artwork, not a link to private journal content. Typed notes remain in the current tab and survive visiting First Aid or Share. The splash now uses lower-amplitude, broad waves across the whole color field, with its former center-only falloff removed.

## Diary and time capsules

See `design/INCREMENT-5.md` for the new screen measurements. The glossy capsule is an isolated vector asset extracted from the supplied SVG, preserving its gradients and filters. The original reference files remain in the source project. The central main-navigation circle uses a grainy mesh gradient.

The four new screens are connected as requested. The two text drafts and selected gradients remain in React state in the current tab and reset on reload. No automatic saving service, reminder scheduling, drawing, sticker/photo upload, music integration, or shared-spaces service is claimed. Those controls remain inactive pending their next design increment. Open Capsule is a local preview of the typed message, or the illustrative default. Main navigation stays out of immersive editors, capsule detail, Share and the splash so it does not cover their supplied controls.

## Inactive menus and story backgrounds

The nine-dot header menu has no action on any screen; it is a native disabled button labeled Menu. All old header new-entry callbacks have been removed. The central gradient circle remains the mood logging entry point. Archive, calendar, page navigation and Diary plus controls retain their existing behavior.

Selecting a mood strip in New Entry applies that exact gradient to the entire writing canvas above the dark editing tray. The selection and typed text survive navigation. A selected background suppresses the ambient purple glow to keep the palette accurate. Text stays dark in the writing area; the red palette uses a light header for contrast. The capsule editor remains unchanged.

The splash uses three broad wave fields with smaller coefficients (0.032/0.018/0.008) and no vertical sine envelope, spreading motion into the upper and lower color bands. Its colors, grain, wordmark, timing, reduced-motion support and fallback behavior are retained.

## October 24 screen and navigation update

See `design/INCREMENT-7.md` for the latest extraction. All six mood-flow screens now use the new SVG revision. The shared navigation is68px high on a white background, with the exact four source icon paths and the center gradient translated to CSS. The source MENU export puts its angular gradient inside an SVG foreignObject; using a native CSS conic gradient keeps the circle present in the application. Keyboard order follows the visible Home/Spaces/Log a mood/Diary/You sequence. Every destination is connected; Spaces currently shows a bounded empty state rather than claiming a sharing service.

Navigation remains visible during the bouncing transition and recording/analysis screens. Leaving them cancels their timers and animation context. The new16-column recording waveform grows around a shared center line. Today’s Entry uses the smaller privacy/action controls, updated text placement, and the supplied pencil icon; editing remains inactive. First Aid uses the new left-aligned heading and lower-opacity rows. Existing Diary, capsule, Share, and book-turn flows remain intact.

## Updated profile and report screens

See `design/INCREMENT-8.md` for extraction and verification. Core now contains Clara’s weekly report, populated word pills, entry chart and supplied organic gradient kernel. Profile has connected Overview, personal Space and Moods sections, a review-card pager and swipe, and the supplied portraits/artwork. The longer SVG exports scroll within the fixed phone frame above the bottom navigation. Settings and Shared remain inactive until their screens are supplied.

Collection updates the existing Calendar route; the first-row sixth tile still opens the saved Note. Profile’s recent mood and Moods rows open that same supplied sample Note. Back returns to the originating profile/history/calendar screen. Share and First Aid now return to whichever entry opened them. The Note keeps the GSAP/WebGL page turns and bottom-up dot fill. Source text is outlined, so wider Georgia/Times serif proportions are used for these new views; the existing Instrument Serif remains elsewhere. All displayed reports, profile descriptions and mood rows are illustrative.

## Friends and social Spaces

The bottom Spaces destination now opens the supplied activity feed. Clara’s personal palette remains under You → Space (`#/personal-space`). See `design/INCREMENT-9.md` for source measurements and interaction decisions.

- Suggested people and feed portraits open friend profiles; feed text opens a public sample Note and clears its unread indicator.
- Friend profiles connect Overview, Space, Moods and Shared. The relationship palette’s View Story opens a story in the Note layout.
- Add friends searches the supplied sample identities. Connection changes, read state, notes and replies live in React state for this tab and reset on reload. Nothing is sent.
- Leave a Note and Reply open a form; Save creates a local Draft in that friend’s Shared feed. Drafts stay out of every other friend’s feed.
- Shared’s Today filter shows today’s sample items; This Week/Month/All Time include the available sample history.
- Friend Note’s aid button opens the existing exercise preview and returns to that same friend/note. Share copies only the displayed note text.
- Routes include their subject, e.g. `#/friend-profile/maya`, `#/friend-space/maya`, `#/friend-moods/maya`, `#/friend-shared/maya`, `#/friend-note/maya/public-1`. Missing local drafts have an unavailable state.

These screens never read private mood drafts, Diary stories or capsule contents. The supplied compatibility descriptions and personality language are illustrative copy, not computed assessments. No network friendship, notifications, messaging, global search or public publication of notes is implemented. Form dialogs cover the bottom navigation, trap keyboard focus across inputs, make the background inert, and restore focus on close.

## Maya’s Instagram-style story viewer

Open Spaces → Maya’s portrait → Space → View Story. Eleven supplied screens run in the order encoded by their white progress bars, starting with Zero Days Apart and ending with Bottom Line. The viewer fills the393×852 frame and hides the bottom navigation. Its quote artwork is the original SVG typography, with equivalent accessible text in the DOM.

- Stories auto-advance every7seconds. The final page stays open for Close, Share or Replay.
- Tap right/Next to advance; tap the left third or use Previous/Left Arrow to go back. Horizontal swipes navigate; swipe down or Escape closes.
- Hold the screen to pause without advancing on release. The Pause/Play control and Space key also work. Reduced motion starts in manual mode.
- Reading time pauses when the tab is hidden, the window loses focus, or a share sheet is open. Timers/listeners are cleaned on exit.
- The final Share control copies the supplied story text; it sends nothing. Private journal entries and local notes are not used.

See `design/INCREMENT-10.md` for the exact source order/measurements. The story route is `#/friend-story/maya`. Other people retain the existing generic View Story note until their own content is supplied.

## Latest Diary and capsule screens

The four Increment 11 exports update the Diary collage/list, New Entry, capsule composer, and blue capsule preview. Diary keeps the 393×852 frame while its taller reference content scrolls above the bottom bar. Stories shows the three supplied illustrative entries; All adds the existing mood entry; Logbook opens that entry with a return to Diary. Story rows open a readable sample preview. The supplied collage photos, capsule artwork, and tool icons are extracted SVG assets. Draft text and gradient selections remain separate for stories and capsules and last only for the current session. Reminders and media tools remain inactive.
