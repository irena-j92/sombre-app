# Increment 5 — Diary and time capsules

Four high-resolution 393 × 852 SVG mobile frames, all white with thin gray header rules. Existing local Instrument Serif and neutral sans typography remain consistent with Sombre. The editor tray is near-black and uses narrow mood-gradient strips. Shadows are absent except the faint ambient blur and the original capsule artwork.

| Screen | Grid and spacing | Type and components | Color / texture | Behavior |
|---|---|---|---|---|
| Scrapbook Pick | Header y50–94, line y98; rear book x95.571 y180.428, 241.429×330; front x62.714 y170.428, 262.5×350; radius2; plus center184.571/344.714; tabs y575–619 | Diary header14; 40px translucent plus disk; tabs14 and 60px selected underline; Personal locked | Red/orange/pink front gradient, 4% black tint, 20% white front-face overlay; lavender/yellow rear with 10% black tint | Diary tab opens this screen; plus → New Entry; back → Core |
| New Entry | Stories pill x24 y135, 70×32; editor x24 y179; bottom tray starts y608; Latest Moods label y630, ten14×60 strips x24–369 y688; tools centered y800 | Serif40/48 placeholder; pill12; tray labels14/12; thin22px tool icons | White, #a8a8a8 placeholder; #111 tray; #6a1f59 blurred209px circle at196/776, 20% opacity, blur50 | Text can be typed and retained in the tab; archive → Time Capsule 02; back → Diary |
| Time Capsule 02 | Calendar control x327 y117, 44×44 hit area and40px outlined disk; heading x24 y167; subline y214; same editor tray | Serif40/48 heading, 14px gray subline; editable message field below | White and #888 copy; same ten gradients and editor tray | Calendar → Time Capsule 01; back → New Entry |
| Time Capsule 01 | Heading x24 y127; subline y176; original capsule around x110–285 y247–461; title y495; metadata y535; helper y584; buttons x24 y674,345×45 and y727,345×45 | Serif40/48 heading; serif30/36 capsule title;14 metadata;18 helper;10 uppercase actions | White, #111/#888 copy; supplied glossy pink capsule with original SVG gradients/filters preserved | Back → Time Capsule 02; Open shows local message; reminder remains inactive until scheduling is designed |

Main navigation: 60px bar, five equal columns, Home / Spaces / central40px gradient disk / Diary / You. Header and main navigation hit targets are at least44px. Palette targets are approximately37×80px to preserve all ten strips within the supplied frame. Home → Core, You → Profile, Diary → Scrapbook Pick, center → Mood Picker. Spaces remains inactive until its flow is supplied. Main navigation appears on the existing primary screens and Diary; immersive editors, capsule detail, Share, splash and mood transition keep their supplied layouts. Entry pagination moves into the open space in the privacy row so the book controls stay usable above the new navigation.

Responsive behavior retains the centered 393×852 frame and proportional scaling on narrower viewports. Controls use visible focus states and text alternatives. Editor text stays in React state only, with no automatic notifications or external writes. Browser visual QA remains unavailable because the earlier browser security-policy block is unresolved.


## Verification

All 39 interaction/geometry checks pass. The five new checks cover the complete Diary → New Entry → archive → Time Capsule 02 → calendar → Time Capsule 01 chain and return path, separate text drafts and selected gradients, capsule reveal/close, Home/You/central-circle navigation, canceling an active voice timer through Diary, and keyboard collection-tab selection. Existing book-turn and mood flows remain covered. The production build passes. The isolated capsule vector was rendered and visually inspected against the supplied artwork. Full browser screenshot comparison remains unverified because the observed browser security-policy restriction persists.

Spaces, Personal, reminder scheduling and unsupported editor tools remain inactive. Type, text entry, gradient selection, View Collection, Open Capsule and the requested navigation controls operate locally. No new dependency or external integration was added.
