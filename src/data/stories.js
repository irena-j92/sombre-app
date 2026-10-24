// Ordered by the filled progress width in the supplied SVG exports.
export const STORY_DURATION_MS = 7000;
export const mayaStories = [
  { title: 'Zero Days Apart 👶', progress: 32, text: 'Clara has known Maya for literally 100% of Maya’s life—and Maya hasn’t left her side since the day she was born.' },
  { title: 'Quietly Twin-Coded 👯‍♀️', progress: 57, text: 'You’ve never actually talked about it, but you both instinctively react to awkward situations in the exact same way.' },
  { title: 'The Three-Word Diagnosis 🏷️', progress: 89, text: 'If you had to explain your bond to a complete stranger, it boils down to: Unfiltered, Unshakeable, Chaotic.' },
  { title: 'The Secret Superpower 💡', progress: 121, text: 'Maya sees a resilience in Clara that Clara constantly underappreciates; Clara sees a brilliant creativity in Maya that Maya takes for granted.' },
  { title: 'Unlocked Memory 🗝️', progress: 153, text: 'That late-night summer conversation where you couldn’t stop laughing until your stomach hurt is still the No1 core memory on replay.' },
  { title: 'The Lifeline 📞', progress: 185, text: 'The moment you felt most understood wasn’t a grand gesture—it was just sitting together in quiet comfort when everything else was falling apart.' },
  { title: 'Upgraded Connection 📈', progress: 217, text: 'You shifted from “sisters sharing a hallway and fighting over clothes” to genuine, chosen best friends navigating adulthood together.' },
  { title: 'Curiosity Unlocked ❓', progress: 249, text: '“What was running through your mind during that huge life transition we never fully broke down afterward?”' },
  { title: 'Water Under the Bridge 🌧️', progress: 281, text: 'Even the tiny, forgotten moments of past disappointment were just stepping stones to building total honesty between you today.' },
  { title: 'Never Change 🔒', progress: 313, text: 'No matter where life, careers, or distance take you, the ability to act completely ridiculous together will remain 100% untouched.' },
  { title: 'Bottom Line 🤍', progress: 345, text: '“If today was the last conversation we ever had, know this: having you as a sister is the greatest gift of my lifetime.”' },
].map((story, index) => ({ ...story, artwork: `/assets/stories/maya-${String(index + 1).padStart(2, '0')}.svg` }));
