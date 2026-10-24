// Illustrative identities and public sample content from the attached designs.
const asset = (name) => `/assets/friends/${name}.svg`;
export const friends = [
  { id: 'maya', name: 'Maya', handle: '@mayazzz', spaces: 23, avatar: asset('person-3'), portrait: asset('maya-profile'), connected: true },
  { id: 'lena', name: 'Lena', handle: '@lenam', spaces: 16, avatar: asset('person-0'), connected: true },
  { id: 'eli', name: 'Eli', handle: '@eliwaves', spaces: 11, avatar: asset('person-1'), connected: true },
  { id: 'nora', name: 'Nora', handle: '@noradays', spaces: 18, avatar: asset('person-2'), connected: true },
  { id: 'ezra', name: 'Ezra', handle: '@ezrastill', spaces: 9, avatar: asset('person-4'), connected: true },
  { id: 'alex', name: 'Alex', handle: '@alexslow', spaces: 14, avatar: asset('person-5'), connected: true },
  { id: 'sam', name: 'Sam', handle: '@samtakes', spaces: 7, avatar: asset('person-6'), connected: true },
  { id: 'maurizio', name: 'maurizio', handle: '@maurizio96', spaces: 12, avatar: asset('suggestion-0'), connected: false },
  { id: 'jocelyn', name: 'jocelyn', handle: '@yojojojo', spaces: 8, avatar: asset('suggestion-1'), connected: false },
  { id: 'kierra', name: 'Kierra', handle: '@kierrashome', spaces: 21, avatar: asset('suggestion-2'), connected: false },
];
export const getFriend = (id) => friends.find((friend) => friend.id === id) || friends[0];
export const suggestedFriends = friends.slice(7);
export const activity = ['lena', 'eli', 'nora', 'maya', 'ezra', 'alex', 'sam'].map((friendId, index) => ({
  id: `activity-${friendId}`, friendId, noteId: 'public-1', time: ['21:45', '20:12', '13:28', '09:47', '08:38', 'Yesterday', 'Yesterday'][index], unread: index < 2,
}));
export const sampleTitle = 'Lorem ipsum dolor sit amet';
export const sampleExcerpt = 'Lorem ipsum dolor sit amet, consectetur aliqua adipiscing elit, sed do eiusmod tempor incididunt...';
export const publicNote = { title: 'Awkward event', text: 'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: 'Sep 28, 2026', visibility: 'Public', draft: false };
export const storyText = 'This palette reflects a relationship that is vibrant, deeply rooted, and filled with warmth. Together, you balance growth, grounded loyalty, shared joy, and unconditional comfort — creating a dynamic where both of you can truly flourish.';
export const relationshipTraits = [
  ['Growth & renewal', 'You bring out the best in each other, constantly encouraging fresh ideas, personal evolution, and new adventures together.'],
  ['Loyalty & trust', 'Your bond is built on a deep, unbreakable foundation; no matter how much life changes, you are each other’s lifelong anchor.'],
  ['Joyful spark', 'Full of shared laughter, playfulness, and affection, this is the lighthearted warmth and inside-joke magic that keeps your relationship bright.'],
  ['Unconditional comfort', 'A gentle, safe space where both of you can drop your guard, speak openly, and feel completely accepted just as you are.'],
];
export const sharedSamples = [
  { id: 'public-1', author: 'friend', time: '21:45', ageDays: 0, canReply: true },
  { id: 'sample-reply', author: 'you', time: '20:12', ageDays: 0, child: true },
  { id: 'public-2', author: 'friend', time: '13:28', ageDays: 0 },
  { id: 'public-3', author: 'friend', time: '09:47', ageDays: 0 },
  { id: 'sample-note', author: 'you', time: '08:38', ageDays: 0 },
  { id: 'public-4', author: 'friend', time: 'Yesterday', ageDays: 1 },
  { id: 'public-5', author: 'friend', time: 'Yesterday', ageDays: 1 },
];
export function resolveFriendNote(friendId, noteId, notes) {
  const local = notes.find((note) => note.id === noteId && note.friendId === friendId);
  if (local) return { ...local, date: 'Today', visibility: 'Draft', draft: true };
  if (noteId === 'story') return { title: 'Sunlit Meadow Bloom', text: storyText, date: 'Sep 28, 2026', visibility: 'Shared', draft: false };
  if (['sample-reply', 'sample-note'].includes(noteId)) return { ...publicNote, author: 'Clara' };
  if (/^public-[1-6]$/.test(noteId)) return publicNote;
  return null;
}
