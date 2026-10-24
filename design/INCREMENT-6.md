# Increment 6 — menu and gradient refinements

All shared nine-dot menu controls are disabled and labeled Menu. Removed header new-entry callbacks from the screen components and App. The bottom gradient circle still launches Mood Picker, and archive/calendar/plus controls remain connected.

New Entry uses the selected strip’s exact linear gradient as its writing-canvas background, sized to the608px editing region above the dark tray. The purple ambient glow is suppressed after selection; typed content and palette choice remain in the separate story draft. The red palette uses white header controls, while writing text remains dark over the lighter body colors. Capsule composition keeps its existing white canvas.

Splash wave coefficients changed from0.095/0.05/0.025×0.65 to0.032/0.018/0.008, with broader horizontal wavelengths and vertical phase variation. Removed sin(yπ) attenuation so the displacement is no longer concentrated at the middle. Existing reduced-motion, GPU cleanup and static-gradient fallback remain intact.

Validation:49 interaction/geometry checks and the production build pass. This includes inactive menus on all12 menu-bearing screens, retained mood logging through the central circle, selected background changes and persistence of typed content. Both splash GLSL stages compile in standalone Mesa/EGL. Frames at0,1.25,2.5seconds were rendered and inspected; mean pixel differences across upper/middle/lower thirds were10.11/23.16/5.36, confirming movement across the whole field. Browser QA remains unavailable because the observed browser security-policy restriction persists.
