import { useCallback, useEffect, useRef, useState } from 'react';
import AppFrame from './components/AppFrame.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';
import { friendScreens, useScreen } from './hooks/useScreen.js';
import Splash from './screens/Splash.jsx';
import Core from './screens/Core.jsx';
import Spaces from './screens/Spaces.jsx';
import FriendProfile from './screens/FriendProfile.jsx';
import FriendSpace from './screens/FriendSpace.jsx';
import FriendStory from './screens/FriendStory.jsx';
import FriendMoods from './screens/FriendMoods.jsx';
import FriendShared from './screens/FriendShared.jsx';
import FriendNote from './screens/FriendNote.jsx';
import FriendComposer from './components/FriendComposer.jsx';
import { friends, getFriend, resolveFriendNote } from './data/friends.js';
import Profile from './screens/Profile.jsx';
import Moods from './screens/Moods.jsx';
import Calendar from './screens/Calendar.jsx';
import MoodPicker from './screens/MoodPicker.jsx';
import MoodTransition from './screens/MoodTransition.jsx';
import CheckIn from './screens/CheckIn.jsx';
import MoodExplainer from './screens/MoodExplainer.jsx';
import Entry from './screens/Entry.jsx';
import FirstAid from './screens/FirstAid.jsx';
import Share from './screens/Share.jsx';
import ScrapbookPick from './screens/ScrapbookPick.jsx';
import DiaryEditor from './screens/DiaryEditor.jsx';
import TimeCapsuleReady from './screens/TimeCapsuleReady.jsx';
import { initialDraft } from './data/checkIn.js';
import { initialDiaryDraft } from './data/diary.js';

const screenTitles = { splash: 'Sombre', core: 'Your Core', spaces: 'Spaces', 'personal-space': 'Your Space', 'friend-profile': 'Friend profile', 'friend-story': 'Clara & Maya’s story', 'friend-space': 'Shared space', 'friend-moods': 'Shared moods', 'friend-shared': 'Shared notes', 'friend-note': 'Shared note', moods: 'Your moods', profile: 'Your profile', calendar: 'Calendar', entry: 'Your entry', 'mood-picker': 'Choose mood', transition: 'Your selected mood', 'check-in': 'Record mood', 'mood-explainer': 'Analyzing', 'todays-entry': 'Today’s entry', 'first-aid': 'First aid', share: 'Share', diary: 'Diary', 'new-diary-entry': 'New Entry', 'time-capsule-compose': 'Time Capsule', 'time-capsule-ready': 'Time Capsule' };
const primaryScreens = new Set([...friendScreens, 'personal-space', 'core', 'spaces', 'profile', 'moods', 'calendar', 'entry', 'todays-entry', 'mood-picker', 'transition', 'check-in', 'mood-explainer', 'first-aid', 'diary']);

export default function App() {
  const { screen, friendId, noteId, navigate } = useScreen();
  const friend = getFriend(friendId);
  const [draft, setDraft] = useState(initialDraft);
  const [storyDraft, setStoryDraft] = useState(() => ({ ...initialDiaryDraft }));
  const [capsuleDraft, setCapsuleDraft] = useState(() => ({ ...initialDiaryDraft }));
  const entryOrigin = useRef({ screen: 'core' });
  const [connections, setConnections] = useState(() => new Set(friends.filter((person) => person.connected).map((person) => person.id)));
  const [readActivity, setReadActivity] = useState(() => new Set());
  const [friendNotes, setFriendNotes] = useState([]);
  const nextNote = useRef(1);
  const [composer, setComposer] = useState(null);
  const [friendNoteOrigin, setFriendNoteOrigin] = useState({ screen: 'friend-profile', friendId: 'maya' });
  const [friendAidOrigin, setFriendAidOrigin] = useState({ friendId: 'maya', noteId: 'public-1' });
  const [shareOrigin, setShareOrigin] = useState('todays-entry');
  const [aidOrigin, setAidOrigin] = useState('todays-entry');
  const [savedEntryOrigin, setSavedEntryOrigin] = useState('calendar');
  const content = useRef(null);
  const previousScreen = useRef(screen);
  const openBook = screen === 'entry' && previousScreen.current === 'calendar';
  const isBook = screen === 'entry' || screen === 'todays-entry';
  const isCheckInFlow = screen === 'transition' || screen === 'check-in';
  const screenKey = isBook ? 'entry-book' : isCheckInFlow ? 'check-in-flow' : friendScreens.has(screen) ? `${screen}:${friend.id}:${screen === 'friend-note' ? noteId : ''}` : screen;
  const showNavigation = primaryScreens.has(screen) && screen !== 'friend-story';
  const activeNavigation = screen === 'core' ? 'home' : screen === 'spaces' || friendScreens.has(screen) || (screen === 'first-aid' && aidOrigin === 'friend-note') ? 'spaces' : screen === 'profile' || screen === 'personal-space' || screen === 'moods' || screen === 'calendar' ? 'you' : ['diary', 'entry', 'todays-entry', 'first-aid'].includes(screen) ? 'diary' : 'log';
  useEffect(() => { previousScreen.current = screen; }, [screen]);
  useEffect(() => {
    document.title = `${screenTitles[screen]} — Sombre`;
    if (screen !== 'splash') content.current?.querySelector('h1')?.focus({ preventScroll: true });
  }, [screen, friendId, noteId]);
  useEffect(() => setComposer(null), [screen, friendId, noteId]);
  useEffect(() => { if (screen === 'friend-story' && friend.id !== 'maya') navigate('friend-space', { friendId: friend.id, replace: true }); }, [screen, friend.id, navigate]);

  const toggleConnection = (id) => setConnections((previous) => { const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const markRead = (id) => setReadActivity((previous) => new Set([...previous, id]));
  const openFriendNote = (id, note, origin) => { setFriendNoteOrigin({ screen: origin, friendId: id }); navigate('friend-note', { friendId: id, noteId: note }); };
  const saveFriendNote = (note) => {
    const saved = { ...note, id: `draft-${nextNote.current++}`, friendId: composer.friendId, draft: true };
    setFriendNotes((previous) => [saved, ...previous]);
    navigate('friend-shared', { friendId: composer.friendId });
    setComposer(null);
  };
  const returnFromFriendNote = () => navigate(friendNoteOrigin.screen, { friendId: friend.id });

  const startEntry = () => {
    if (primaryScreens.has(screen) && !['mood-picker', 'transition', 'check-in', 'mood-explainer'].includes(screen)) entryOrigin.current = { screen, friendId: friend.id, noteId };
    setDraft(initialDraft);
    navigate('mood-picker');
  };
  const openSavedEntry = (origin) => { setSavedEntryOrigin(origin); navigate('entry'); };
  const chooseMood = (mood) => { setDraft({ ...initialDraft, mood }); navigate('transition'); };
  const updateDraft = useCallback((patch) => setDraft((previous) => ({ ...previous, ...patch })), []);
  const completeCheckIn = useCallback((mode, note) => {
    setDraft((previous) => ({ ...previous, mode, note, completed: true }));
    navigate('mood-explainer', { replace: true });
  }, [navigate]);

  return <AppFrame>
    <div className={`screen-transition ${isCheckInFlow ? 'check-in-flow' : ''} ${showNavigation ? 'has-main-navigation' : ''}`} key={screenKey} ref={content}>
      {screen === 'splash' && <Splash navigate={navigate} />}
      {screen === 'core' && <Core navigate={navigate} />}
      {screen === 'spaces' && <Spaces navigate={navigate} connections={connections} onToggleConnection={toggleConnection} readActivity={readActivity} onRead={markRead} onOpenNote={openFriendNote} />}
      {screen === 'personal-space' && <Profile navigate={navigate} space />}
      {screen === 'friend-profile' && <FriendProfile friend={friend} navigate={navigate} connected={connections.has(friend.id)} onToggleConnection={toggleConnection} onCompose={() => setComposer({ friendId: friend.id, reply: false })} onOpenNote={openFriendNote} />}
      {screen === 'friend-space' && <FriendSpace friend={friend} navigate={navigate} onOpenStory={() => friend.id === 'maya' ? navigate('friend-story', { friendId: friend.id }) : openFriendNote(friend.id, 'story', 'friend-space')} />}
      {screen === 'friend-story' && friend.id === 'maya' && <FriendStory onClose={() => navigate('friend-space', { friendId: friend.id, replace: true })} />}
      {screen === 'friend-moods' && <FriendMoods friend={friend} navigate={navigate} onOpenNote={openFriendNote} />}
      {screen === 'friend-shared' && <FriendShared friend={friend} navigate={navigate} notes={friendNotes} connected={connections.has(friend.id)} onToggleConnection={toggleConnection} onCompose={(replyTo) => setComposer({ friendId: friend.id, reply: true, replyTo })} onOpenNote={openFriendNote} />}
      {screen === 'friend-note' && <FriendNote friend={friend} note={resolveFriendNote(friend.id, noteId, friendNotes)} onBack={returnFromFriendNote} backLabel={friendNoteOrigin.screen === 'spaces' ? 'Back to Spaces' : friendNoteOrigin.screen === 'friend-shared' ? `Back to notes with ${friend.name}` : friendNoteOrigin.screen === 'friend-space' ? `Back to your space with ${friend.name}` : friendNoteOrigin.screen === 'friend-moods' ? `Back to ${friend.name}’s moods` : `Back to ${friend.name}’s profile`} onFirstAid={() => { setFriendAidOrigin({ friendId: friend.id, noteId }); setAidOrigin('friend-note'); navigate('first-aid'); }} />}
      {screen === 'profile' && <Profile navigate={navigate} onOpenEntry={() => openSavedEntry('profile')} />}
      {screen === 'moods' && <Moods navigate={navigate} onOpenEntry={() => openSavedEntry('moods')} />}
      {screen === 'calendar' && <Calendar navigate={navigate} onOpenEntry={() => openSavedEntry('calendar')} />}
      {isBook && <Entry navigate={navigate} draft={draft} today={screen === 'todays-entry'} openOnMount={openBook} backScreen={savedEntryOrigin} onShare={() => { setShareOrigin(screen); navigate('share'); }} onFirstAid={() => { setAidOrigin(screen); navigate('first-aid'); }} />}
      {screen === 'mood-picker' && <MoodPicker onBack={() => navigate(entryOrigin.current.screen, entryOrigin.current)} onChoose={chooseMood} />}
      {screen === 'transition' && <MoodTransition navigate={navigate} draft={draft} />}
      {screen === 'check-in' && <CheckIn navigate={navigate} draft={draft} onDraftChange={updateDraft} onComplete={completeCheckIn} />}
      {screen === 'mood-explainer' && <MoodExplainer navigate={navigate} draft={draft} />}
      {screen === 'first-aid' && <FirstAid navigate={aidOrigin === 'friend-note' ? (next, options) => navigate(next, next === 'friend-note' ? { ...options, ...friendAidOrigin } : options) : navigate} draft={aidOrigin === 'friend-note' ? initialDraft : draft} backScreen={aidOrigin} />}
      {screen === 'share' && <Share navigate={navigate} backScreen={shareOrigin} />}
      {screen === 'diary' && <ScrapbookPick navigate={navigate} onOpenEntry={() => openSavedEntry('diary')} />}
      {screen === 'new-diary-entry' && <DiaryEditor navigate={navigate} draft={storyDraft} onChange={setStoryDraft} />}
      {screen === 'time-capsule-compose' && <DiaryEditor navigate={navigate} draft={capsuleDraft} onChange={setCapsuleDraft} capsule />}
      {screen === 'time-capsule-ready' && <TimeCapsuleReady navigate={navigate} draft={capsuleDraft} />}
    </div>
    {composer && <FriendComposer friend={getFriend(composer.friendId)} reply={composer.reply} replyTo={composer.replyTo} onSave={saveFriendNote} onClose={() => setComposer(null)} />}
    {showNavigation && <BottomNavigation active={activeNavigation} navigate={navigate} onNewEntry={startEntry} />}
  </AppFrame>;
}
