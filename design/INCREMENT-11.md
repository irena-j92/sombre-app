# Increment 11 — Diary and Time Capsules

## Reference intake and extraction

Four high-resolution outlined SVG exports: Diary at 393 × 1010; New Entry and Time Capsule 01/02 at 393 × 852. White surfaces, charcoal text, serif display type, flat borders, colored gradient strips, no rounded cards. Source copies are preserved unchanged in `references/increment-11`.

| Layer | Diary | New Entry / Capsule composer | Capsule preview |
|---|---|---|---|
| Layout | Header at y50–98; collage x40/y156/320×368; tabs y575–619; rows y649,751,853 | Header y50–98; category x24/y135; writing x24/y180; tray y608–852 | Header y50–98; heading x24/y132; art x76/y236/232×312; details x24/y570; actions y674,727 |
| Typography | Arial 14/20 tabs; Georgia/Times 14/20 row title; Arial 12/16 preview and 10/14 date | Georgia/Times 34/40 writing, tracking −.2px; 32/40 capsule heading; Arial 14/20 secondary, 12/16 collection; capsule writing 30/36 | Georgia/Times 32/40 title, 26/36 detail; Arial 14/20 subtitle, 12/16 invitation, 10/14 action labels |
| Color | #fff, #2c2c2c, #888, #c4c4c4, #e2e2e2; original photo/gradient art | #fff, #888, #a8a8a8; tray #2c2c2c; source 10 linear gradients | #fff, #2c2c2c, #888; source cyan/white pill gradients |
| Spacing | 24px side insets; row 52px orb; text x96; 102px row pitch | Palette strips 14×60 at y688; 36.778px pitch; tools centered y800 | 24px side inset; 8px action gap; 45px actions; invitation below buttons |
| Components | Collage artwork + real plus target; collection tablist; scrollable list rows | Textarea, archive/calendar controls, selectable mood strips, five tools | Exact capsule artwork; open modal; inactive reminder |
| Atmosphere | Source embedded photos, shadows, rotated papers and gradient layers retained as vector asset | Soft #6a1f59 ambient circle, opacity .2, 50px blur; no added effects | Original blurred vector pill retained; no added shadow |
| Interaction / responsive | Existing fixed 393×852 frame; content scrolls below header and above fixed navigation | Existing typed drafts and gradient selection; focus tool, archive → composer → calendar → preview | Opens the separate capsule draft or illustrative default; no real reminder/scheduling |

The 1010px Diary source is content, not a new device size. The original y positions are retained inside a scroll region; the existing 393×852 frame and fixed bottom navigation remain. Source artwork is extracted with only referenced SVG definitions, including embedded collage photos; no asset is regenerated or approximated.

## Bounded interaction logic

- Diary starts on Stories with three illustrative rows from the supplied placeholder content. A row opens its readable local preview. All includes those stories plus the existing saved mood; Logbook contains the saved mood and opens the existing entry book. Personal remains locked.
- Plus → New Entry. Archive → Time Capsule composer. Calendar → Time Capsule preview. Back navigation reverses each step.
- Story and capsule text and gradient choices remain separate React state. Selecting a gradient colors the composing canvas while retaining the dark tool tray. No changes are sent or persisted remotely.
- Menu controls remain disabled. Unsupported drawing, stickers, media, and reminders remain inactive as in the prototype. Main navigation remains on Diary; the three compose/preview screens stay fullscreen.

## Validation

76 automated checks pass across 9 test files, including collection filtering, entry return, modal focus restoration, and separate capsule/story drafts and gradients. Production build and git whitespace checks pass. Browser QA verified original collage/photos and capsule artwork load, Diary scroll (226px overflow) above fixed navigation, story preview, complete plus/archive/calendar flow and back navigation, and typed capsule opening. Visual comparison checked all four supplied layouts; source artwork and coordinates are retained, with editable DOM text using the closest existing book font stack. Existing Stories, check-in, social privacy, and book-turn tests remain passing.
