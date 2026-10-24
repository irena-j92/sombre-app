// This increment demonstrates the designed flow with illustrative data.
export const VOICE_DURATION_MS = 6000;
export const MOOD_TRANSITION_MS = 2200;
export const ANALYSIS_DURATION_MS = 3200;
export const moodOptions = [
  { id: 'happy', label: 'happy', orb: 'radial-gradient(circle closest-side,#c0df9b 42.3077%,#439595 75%,#81b13e 100%)', pronunciation: '/ˈhæpi/', definition: 'Feeling pleased, content, or glad about something.' },
  { id: 'sad', label: 'sad', orb: 'radial-gradient(circle closest-side,#a5eefb 42.3077%,#436f95 75%,#3eb1b1 100%)', pronunciation: '/sæd/', definition: 'Feeling unhappy, low, or affected by a loss or disappointment.' },
  { id: 'embarrassed', label: 'embarrassed', orb: 'radial-gradient(circle closest-side,#f4da73 50%,#ff779a 75%,#fa7100 100%)', pronunciation: '/ɪmˈbærəst/', definition: 'Feeling self-conscious or uncomfortable about something that happened.' },
  { id: 'angry', label: 'angry', orb: 'radial-gradient(circle closest-side,#ffc38b 50%,#ef7100 75%,#c30224 100%)', pronunciation: '/ˈaŋɡri/', definition: 'A feeling or showing a strong, unhappy emotion – like anger or rage – usually caused by a bad situation or unfair treatment' },
  { id: 'calm', label: 'calm', orb: 'radial-gradient(circle closest-side,#c3d8fa 50%,#b39dd0 75%,#de8aa1 100%)', pronunciation: '/kɑːm/', definition: 'Feeling settled, peaceful, or at ease in this moment.' },
  { id: 'frustrated', label: 'frustrated', orb: 'radial-gradient(circle closest-side,#f4da73 50%,#be903c 75%,#ffda00 100%)', pronunciation: '/frʌˈstreɪtɪd/', definition: 'Feeling upset because something is getting in the way of what you need or want.' },
];
export const initialDraft = { mood: 'angry', mode: null, note: '', completed: false };
export const moodById = (id) => moodOptions.find((mood) => mood.id === id) ?? moodOptions[3];
