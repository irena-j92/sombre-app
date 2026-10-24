export const diaryGradients = [
  "linear-gradient(#68a16f 0.0%,#eab800 26.9231%,#ffc0d5 54.3269%,#b497f5 74.0385%,#454e5c 100.0%)",
  "linear-gradient(#cc8dfd 0.0%,#ffa5ee 32.5%,#ffd0d8 50.8333%,#ffda00 75.4167%,#ffed35 100.0%)",
  "linear-gradient(#1ec5ff 0.0%,#f5c1ff 38.3333%,#eed8e5 58.3333%,#ff779a 100.0%)",
  "linear-gradient(#68a16f 0.0%,#eab800 26.9231%,#ffc0d5 54.3269%,#b497f5 74.0385%,#454e5c 100.0%)",
  "linear-gradient(#cc8dfd 0.0%,#ffa5ee 32.5%,#ffd0d8 50.8333%,#ffda00 75.4167%,#ffed35 100.0%)",
  "linear-gradient(#1ec5ff 0.0%,#f5c1ff 38.3333%,#eed8e5 58.3333%,#ff779a 100.0%)",
  "linear-gradient(#68a16f 0.0%,#eab800 26.9231%,#ffc0d5 54.3269%,#b497f5 74.0385%,#454e5c 100.0%)",
  "linear-gradient(#cb0027 0.0%,#fa7800 25.9615%,#ff8d88 49.0385%,#fee2ec 78.8462%,#f8c6f7 100.0%)",
  "linear-gradient(#cc8dfd 0.0%,#ffa5ee 32.5%,#ffd0d8 50.8333%,#ffda00 75.4167%,#ffed35 100.0%)",
  "linear-gradient(#68a16f 0.0%,#eab800 26.9231%,#ffc0d5 54.3269%,#b497f5 74.0385%,#454e5c 100.0%)"
];

export const initialDiaryDraft = { text: '', gradient: null };
export const sampleCapsuleMessage = 'One moment at a time. You can go at your own pace, and leave a little room for yourself today.';

// Placeholder copy supplied in the Diary reference, kept separate from private drafts.
export const diaryStories = Array.from({ length: 3 }, (_, index) => ({
  id: `sample-story-${index + 1}`,
  title: 'Lorem ipsum dolor sit amet',
  preview: 'Lorem ipsum dolor sit amet, consectetur aliqua adipiscing elit, sed do eiusmod tempor incididunt...',
  text: 'Lorem ipsum dolor sit amet, consectetur aliqua adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}));
