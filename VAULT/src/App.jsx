import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { 
  ShieldAlert, Sparkles, Users, MapPin, BookOpen, Rocket, Scroll, Zap, 
  Lock, Unlock, Play, CheckCircle2, Trophy, Clock, UserPlus, Compass, 
  Radio, Terminal, ChevronRight, Award, Star, AlertTriangle, Flame, RefreshCw, Volume2, VolumeX,
  Video, VideoOff, Eye, Sliders, Sun, Trees, Flower2, Leaf, FlaskConical, Key, Activity, Send, ArrowRight, Plus,
  Menu, X, PanelLeftClose, PanelLeftOpen, ArrowLeft, ChevronDown, LogOut, Home, BarChart3, User, UserCheck, LogIn,
  Mic, MicOff, Headphones, PhoneCall, PhoneOff, Copy, Check, Share2, Globe, Shield, RefreshCw as RefreshIcon,
  Settings, KeyRound, Bell, RotateCcw, MoreHorizontal, Target, Palette
} from 'lucide-react';
// Video asset imports for guaranteed asset resolution across builds
import natureVideo from './assets/nature.mp4';
import bgNewVideo from './assets/backgroundnew.mp4';
const BG_VIDEO_URL = bgNewVideo || natureVideo;
import { 
  initialMissions, 
  initialCharacters, 
  initialTopics, 
  initialLobby, 
  triviaQuestions,
  FALLBACK_SUBJECT_IMG,
  FALLBACK_AVATAR_IMG
} from './data/initialData';
import { heistStages } from './data/heistPuzzles';
import { getPuzzleSetForHeist } from './data/puzzlePool';
import { calculateLevel } from './utils/leveling';
import { heistAudio } from './components/HeistAudioEngine';
import HackerTerminal from './components/HackerTerminal';
import EngineerLaserGrid from './components/EngineerLaserGrid';
import ScientistLab from './components/ScientistLab';
import CryptographerDeck from './components/CryptographerDeck';
import InterdependenceMatrix from './components/InterdependenceMatrix';
import ExtractionProtocolModal from './components/ExtractionProtocolModal';
import RadioComms from './components/RadioComms';
import SkillAnalyticsModal from './components/SkillAnalyticsModal';
import ParticleBurst from './components/ParticleBurst';
import LoadingScreen from './components/LoadingScreen';
import XPRing from './components/XPRing';
import { voiceEngine } from './services/voiceEngine';
import CreateCustomHeistModal from './components/CreateCustomHeistModal';
import RemediationRoadmapModal from './components/RemediationRoadmapModal';
import HeroPage from './components/HeroPage';
import FireflyField from './components/FireflyField';
import AuthModal from './components/AuthModal';
import StatsDashboard from './components/StatsDashboard';
import GraphicalRoadmap from './components/GraphicalRoadmap';
import OperativeDirectoryModal from './components/OperativeDirectoryModal';
import SquadRecruitmentBoard from './components/SquadRecruitmentBoard';
import OnboardingTour, { shouldShowTour, resetTour } from './components/OnboardingTour';
import SoloTrainingModal from './components/SoloTrainingModal';
import AchievementUnlockBanner from './components/AchievementUnlockBanner';
import { evaluateAchievements } from './utils/achievementTracker';
import { generateRemediationPlan } from './data/remediationData';
import { authAPI, heistAPI, missionAPI, leaderboardAPI, friendAPI, userAPI } from './services/api.js';
import { connectSocket, disconnectSocket, onSocketEvent, offSocketEvent, getSocket, lobbySocket, heistSocket } from './services/socket.js';
import { getLoyaltyPoints, setLoyaltyPoints, applyLoyaltyEvent, getLoyaltyRank, initLoyaltyFromUser } from './utils/loyaltyPoints';
import DeserterWarningModal from './components/DeserterWarningModal';

// Specialist role configurations for multiplayer synchronization
const ROLE_CONFIGS = [
  { key: 'hacker', label: 'The Hacker', title: 'Canopy Hacker', charId: 'c1', discipline: 'CS & Logic', color: '#22D3EE' },
  { key: 'engineer', label: 'The Engineer', title: 'Laser Specialist', charId: 'c2', discipline: 'Physics & Optics', color: '#FBBF24' },
  { key: 'scientist', label: 'The Scientist', title: 'Botanical Chemist', charId: 'c3', discipline: 'Chemistry & Biology', color: '#A3E635' },
  { key: 'cryptographer', label: 'The Cryptographer', title: 'Cipher Specialist', charId: 'c4', discipline: 'Math & Ciphers', color: '#C084FC' }
];

// Vault Themes — cosmetic color palettes for the sidebar accent and heist
// HUD. Unlock conditions here must match server/routes/users.js exactly,
// since the server is the authority on what's actually equippable.
const VAULT_THEMES = [
  { id: 'default', name: 'Forest Ranger', primary: '#10B981', primaryHover: '#34D399', accent: '#F59E0B', bg: '#03140C', surface: '#041C13', glow: 'rgba(16, 185, 129, 0.45)', unlockText: 'Standard Issue Syndicate Theme' },
  { id: 'ember', name: 'Ember Vault', primary: '#F97316', primaryHover: '#FB923C', accent: '#FBBF24', bg: '#180a04', surface: '#261208', glow: 'rgba(249, 115, 22, 0.45)', unlockText: 'Molten Core & Thermal Infiltration' },
  { id: 'crimson', name: 'Crimson Lockdown', primary: '#E11D48', primaryHover: '#F43F5E', accent: '#FB7185', bg: '#170308', surface: '#270810', glow: 'rgba(225, 29, 72, 0.45)', unlockText: 'High Security Lockdown Alert' },
  { id: 'azure', name: 'Azure Frequency', primary: '#0EA5E9', primaryHover: '#38BDF8', accent: '#7DD3FC', bg: '#02121e', surface: '#041d30', glow: 'rgba(14, 165, 233, 0.45)', unlockText: 'Sub-Zero Cryo Transmission' },
  { id: 'golden', name: 'Golden Syndicate', primary: '#EAB308', primaryHover: '#FACC15', accent: '#FDE047', bg: '#181202', surface: '#281f05', glow: 'rgba(234, 179, 8, 0.45)', unlockText: 'Elite Syndicate Mastermind' }
];

// Role perks — spend earned skill points (1 per level gained) to unlock
// a passive bonus for the role you're currently playing. Cost/ids here
// must match server/routes/users.js exactly, since the server enforces
// the actual spend.
const PERKS = [
  { id: 'hacker_quick_fingers', role: 'hacker', name: 'Quick Fingers', desc: '+10s starting timer when you play Hacker', cost: 1 },
  { id: 'engineer_reinforced_rig', role: 'engineer', name: 'Reinforced Rig', desc: 'Your first alarm trip is forgiven when you play Engineer', cost: 1 },
  { id: 'scientist_steady_hands', role: 'scientist', name: 'Steady Hands', desc: '+50 bonus XP on victory when you play Scientist', cost: 1 },
  { id: 'cryptographer_head_start', role: 'cryptographer', name: 'Cipher Instinct', desc: 'Start with a 1x combo head start when you play Cryptographer', cost: 1 }
];

function normalizeRoleKey(role) {
  if (!role) return 'hacker';
  const r = role.toLowerCase();
  if (r.includes('hacker')) return 'hacker';
  if (r.includes('engineer') || r.includes('laser') || r.includes('safecracker')) return 'engineer';
  if (r.includes('scientist') || r.includes('chemist') || r.includes('flora')) return 'scientist';
  if (r.includes('crypto') || r.includes('cipher') || r.includes('infiltrator')) return 'cryptographer';
  return 'hacker';
}

export function sanitizeUser(rawUser) {
  if (!rawUser) return null;
  const username = rawUser.username || (rawUser.email ? rawUser.email.split('@')[0] : 'operative');
  const callsign = rawUser.callsign || username || 'Operative';
  const role = rawUser.role || 'Canopy Hacker';
  const level = typeof rawUser.level === 'number' && !isNaN(rawUser.level) ? Math.max(1, rawUser.level) : 1;
  const xp = typeof rawUser.xp === 'number' && !isNaN(rawUser.xp) ? Math.max(0, rawUser.xp) : 0;
  const rawId = rawUser.id != null ? String(rawUser.id) : (rawUser.agentId || 'guest-01');
  const agentId = rawUser.agentId || rawUser.agent_id || (
    rawId.length > 8 
      ? `VLT-${rawId.replace(/-/g, '').substring(0, 4).toUpperCase()}-${rawId.replace(/-/g, '').substring(4, 7).toUpperCase()}` 
      : `VLT-${rawId.toUpperCase()}`
  );

  return {
    ...rawUser,
    id: rawUser.id || rawId,
    agentId,
    username,
    callsign,
    role,
    level,
    xp,
    rank: rawUser.rank || 'Junior Ranger',
    avatar: rawUser.avatar || FALLBACK_AVATAR_IMG,
    badges: Array.isArray(rawUser.badges) && rawUser.badges.length > 0 ? rawUser.badges : ['Forest Ranger'],
    achievements: Array.isArray(rawUser.achievements) ? rawUser.achievements : [],
    history: Array.isArray(rawUser.history) ? rawUser.history : [],
    loyaltyPoints: typeof rawUser.loyaltyPoints === 'number' ? rawUser.loyaltyPoints : (typeof rawUser.loyalty_points === 'number' ? rawUser.loyalty_points : 1000),
    skillPoints: typeof rawUser.skillPoints === 'number' ? rawUser.skillPoints : 0,
    unlockedPerks: Array.isArray(rawUser.unlockedPerks) ? rawUser.unlockedPerks : [],
    notificationPrefs: rawUser.notificationPrefs || {
      soundEnabled: true,
      hapticFeedback: true,
      heistAlerts: true,
      squadInvites: true
    },
    cardConfig: rawUser.cardConfig || {
      motto: `${String(role).toUpperCase()} SPECIALIST`,
      showcasedMedals: ['speed_runner', 'mvp_award', 'cipher_grandmaster']
    },
    stats: {
      missionsCompleted: 0,
      winRate: 100,
      vaultsCracked: 0,
      alarmsTripped: 0,
      fastestTime: '--',
      csMastery: 75,
      physicsMastery: 70,
      chemMastery: 70,
      mathMastery: 75,
      cryptoMastery: 50,
      ...(rawUser.stats || {})
    }
  };
}

export default function App() {
  const activeSocket = getSocket() || connectSocket();
  const [activeTab, setActiveTab] = useState('home');
  const [tabHistory, setTabHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isEndHeistModalOpen, setIsEndHeistModalOpen] = useState(false);
  const [endHeistVoteState, setEndHeistVoteState] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isSoloTrainingOpen, setIsSoloTrainingOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_current_user');
      return saved ? sanitizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });
  const [missions, setMissions] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_missions_subject_v4');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMissions;
    } catch {
      return initialMissions;
    }
  });
  const [characters] = useState(initialCharacters || []);
  const [topics] = useState(initialTopics || []);
  const [lobby, setLobby] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_lobby_subject_v4');
      const parsed = saved ? JSON.parse(saved) : null;
      // Only restore a lobby that was in the waiting/recruiting state.
      // An 'active' heist cannot be resumed after a page refresh because
      // the server-side heist session (activeHeists Map) is gone.
      if (parsed?.code && Array.isArray(parsed?.players) && parsed?.status === 'waiting') {
        return parsed;
      }
    } catch {}
    return initialLobby;
  });

  const [isLobbyVoiceConnected, setIsLobbyVoiceConnected] = useState(false);
  const [isLobbyMicMuted, setIsLobbyMicMuted] = useState(false);
  const [isLobbyDeafened, setIsLobbyDeafened] = useState(false);
  const [speakingPlayerSlot, setSpeakingPlayerSlot] = useState(1);
  const [micVolumeBars, setMicVolumeBars] = useState([8, 14, 10, 18, 12, 16, 10, 12]);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  useEffect(() => {
    const unsubVol = voiceEngine.onVolume((bars) => setMicVolumeBars(bars));
    const unsubSpk = voiceEngine.onSpeaking((speaking) => setIsUserSpeaking(speaking));
    return () => {
      unsubVol();
      unsubSpk();
    };
  }, []);

  // Security protocol: Restrict direct text copy and clipboard extraction across VAULT chambers
  useEffect(() => {
    const isEditable = (target) => {
      if (!target) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable ||
        Boolean(target.closest?.('input, textarea, [contenteditable="true"]'))
      );
    };

    const handleCopy = (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
      toast.error("🔒 Security Protocol: Direct text extraction is disabled in VAULT chambers.", {
        id: 'vault-copy-restriction',
        duration: 500
      });
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'c') {
        if (isEditable(e.target)) return;
        const selection = window.getSelection()?.toString();
        if (selection && selection.trim().length > 0) {
          e.preventDefault();
          toast.warning("🔒 Security Protocol: Direct clipboard extraction blocked.", {
            id: 'vault-copy-key-restriction',
            duration: 500
          });
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [unlockedThemes, setUnlockedThemes] = useState(['default', 'ember', 'crimson', 'azure', 'golden']);
  const [equippedThemeId, setEquippedThemeId] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('vault_current_user') || '{}');
      return savedUser.equippedTheme || localStorage.getItem('vault_theme') || 'default';
    } catch (_) {
      return 'default';
    }
  });
  const [isEquippingTheme, setIsEquippingTheme] = useState(null);
  const [isUnlockingPerk, setIsUnlockingPerk] = useState(null);
  const [engineerAlarmForgiven, setEngineerAlarmForgiven] = useState(false);
  const [activePuzzleOverrides, setActivePuzzleOverrides] = useState(null);
  const [heistAttemptSeed, setHeistAttemptSeed] = useState('');
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    heistInvites: true,
    friendRequests: true,
    weeklySummary: false,
    soundEnabled: true,
    hapticFeedback: true,
    heistAlerts: true,
    squadInvites: true
  });
  const [bgVideoActive, setBgVideoActive] = useState(true);
  const [selectedBgVideo, setSelectedBgVideo] = useState('cyber'); // 'cyber' (backgroundnew.mp4) or 'nature' (nature.mp4)
  const [bgDimMode, setBgDimMode] = useState('vivid'); 
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Helper callback ref that immediately configures the native HTML video DOM node
  const setVideoNode = (node) => {
    videoRef.current = node;
    if (node) {
      node.defaultMuted = true;
      node.muted = true;
      node.playsInline = true;
      node.setAttribute('playsinline', '');
      node.setAttribute('webkit-playsinline', '');
      node.setAttribute('muted', '');
      node.setAttribute('autoplay', '');
      node.setAttribute('loop', '');
      const p = node.play();
      if (p !== undefined) {
        p.then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    }
  };

  // Guarantee background video autoplays across all platforms (Safari, Chrome, iOS WebKit, Mobile PWA)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    };

    playVideo();

    // Universal unlock on any user interaction (critical for mobile iOS Safari & Chrome autoplay policy)
    const unlockEvents = ['touchstart', 'touchend', 'click', 'keydown', 'scroll', 'pointerdown'];
    unlockEvents.forEach(evt => window.addEventListener(evt, playVideo, { passive: true }));

    return () => {
      unlockEvents.forEach(evt => window.removeEventListener(evt, playVideo));
    };
  }, [bgVideoActive, selectedBgVideo]);
  const [isCustomHeistModalOpen, setIsCustomHeistModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [allStages, setAllStages] = useState(heistStages);

  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [activeCockpitRole, setActiveCockpitRole] = useState('hacker');
  const [stageSolvedRoles, setStageSolvedRoles] = useState({
    1: {},
    2: {},
    3: {},
    99: {}
  });
  const [stageRoleClues, setStageRoleClues] = useState({
    1: {},
    2: {},
    3: {},
    99: {}
  });
  const [alarmLevel, setAlarmLevel] = useState('LOW_SECURITY'); 
  const [alarmFails, setAlarmFails] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [screenShakeEnabled, setScreenShakeEnabled] = useState(() => {
    try {
      return localStorage.getItem('vault_screen_shake') !== 'false';
    } catch {
      return true;
    }
  });
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isExtractionActive, setIsExtractionActive] = useState(false);
  // Tracks how many times each role has failed a puzzle this stage (for micro-hint threshold)
  const [roleFailCounts, setRoleFailCounts] = useState({});
  const [radioMessages, setRadioMessages] = useState([
    { sender: "Sylvan HQ", role: "hq", text: "Expedition crew deployed. Interlock sequence initialized. Coordinate all 4 roles!", time: "00:01" },
    { sender: "Scientist Cleo", role: "scientist", text: "Analyzing compound stoichiometry now. Will transmit optical density to Engineer.", time: "00:04" }
  ]);
  const lobbyChatEndRef = useRef(null);

  // Radio Comms UX: Unread message badge & auto-scroll tracking
  const [unreadRadioCount, setUnreadRadioCount] = useState(0);
  const [xpFlyout, setXpFlyout] = useState(null);
  const [lastEarnedXp, setLastEarnedXp] = useState(0);

  // ── Syndicate Achievements Queue & Tracker ──
  const [achievementQueue, setAchievementQueue] = useState([]);

  const triggerAchievementCheck = useCallback((eventType, eventData = {}) => {
    setCurrentUser(user => {
      if (!user) return user;
      const newlyUnlocked = evaluateAchievements(user, eventType, eventData);
      if (!newlyUnlocked || newlyUnlocked.length === 0) return user;

      const totalBonusXp = newlyUnlocked.reduce((acc, a) => acc + (a.xpReward || 0), 0);
      const newAchievementIds = newlyUnlocked.map(a => a.id);
      const newBadgeTitles = newlyUnlocked.map(a => a.title);

      const updatedXp = (user.xp || 0) + totalBonusXp;
      const updatedLevel = calculateLevel(updatedXp);
      const updatedUser = {
        ...user,
        xp: updatedXp,
        level: updatedLevel,
        achievements: Array.from(new Set([...(user.achievements || []), ...newAchievementIds])),
        badges: Array.from(new Set([...(user.badges || []), ...newBadgeTitles]))
      };

      try {
        localStorage.setItem('vault_current_user', JSON.stringify(updatedUser));
      } catch {}
      window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: updatedUser }));

      if (user.id && !user.isGuest) {
        userAPI.updateProfile(user.id, {
          xp: updatedXp,
          level: updatedLevel,
          achievements: updatedUser.achievements,
          badges: updatedUser.badges
        }).catch(() => {});
      }

      setAchievementQueue(prev => [...prev, ...newlyUnlocked]);

      if (totalBonusXp > 0) {
        setXpFlyout({ amount: totalBonusXp, id: Date.now() });
        setTimeout(() => setXpFlyout(null), 3000);
      }

      return updatedUser;
    });
  }, []);

  useEffect(() => {
    const handleCustomAchEvent = (e) => {
      if (e.detail?.type) {
        triggerAchievementCheck(e.detail.type, e.detail.data || {});
      }
    };
    window.addEventListener('vault:achievement-event', handleCustomAchEvent);
    return () => window.removeEventListener('vault:achievement-event', handleCustomAchEvent);
  }, [triggerAchievementCheck]);



  useEffect(() => {
    if (activeTab === 'lobby') {
      lobbyChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [radioMessages, activeTab]);

  useEffect(() => {
    if (activeTab === 'liveheist') {
      setUnreadRadioCount(prev => prev + 1);
    } else {
      setUnreadRadioCount(0);
    }
  }, [radioMessages.length]);

  useEffect(() => {
    if (activeTab === 'lobby') {
      setUnreadRadioCount(0);
    }
  }, [activeTab]);

  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsKey, setAnalyticsKey] = useState(0);
  const [isMatchVictory, setIsMatchVictory] = useState(true);
  const [analyticsStats, setAnalyticsStats] = useState({
    hackerXp: 450,
    engineerXp: 450,
    scientistXp: 450,
    cryptoXp: 450,
    timeElapsed: "1m 18s",
    accuracy: "96%",
    alarmsTripped: 0
  });

  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isAgentDirectoryOpen, setIsAgentDirectoryOpen] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [joinRoomCodeInput, setJoinRoomCodeInput] = useState('');
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [createRoomTitleInput, setCreateRoomTitleInput] = useState('');
  const [isInSquadRoom, setIsInSquadRoom] = useState(false);
  const [isLeaveSquadModalOpen, setIsLeaveSquadModalOpen] = useState(false);
  const [isDeserterWarningOpen, setIsDeserterWarningOpen] = useState(false);
  const [deserterWarningIsHeistActive, setDeserterWarningIsHeistActive] = useState(false);

  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const isInSquadRoomRef = useRef(isInSquadRoom);
  useEffect(() => {
    isInSquadRoomRef.current = isInSquadRoom;
  }, [isInSquadRoom]);

  // Clean up timers, alarms, and audio when navigating away from live heist
  useEffect(() => {
    if (activeTab !== 'liveheist') {
      if (isTimerRunning) setIsTimerRunning(false);
      if (alarmLevel !== 'LOW_SECURITY') setAlarmLevel('LOW_SECURITY');
      heistAudio.stopTension();
    }
  }, [activeTab]);

  // ── Loyalty Points ─────────────────────────────────────────────────────────
  const [loyaltyPoints, setLoyaltyPointsState] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_current_user');
      const user = saved ? JSON.parse(saved) : null;
      const lp = initLoyaltyFromUser(user);
      // Seed to 1000 if no points have been earned yet
      if (lp === 0) {
        setLoyaltyPoints(1000);
        return 1000;
      }
      return lp;
    } catch {
      const lp = getLoyaltyPoints();
      return lp === 0 ? 1000 : lp;
    }
  });

  // Helper: apply an LP event and sync React state
  const applyLP = (eventKey, labelOverride) => {
    const result = applyLoyaltyEvent(eventKey, labelOverride);
    if (result) {
      setLoyaltyPointsState(result.newPoints);
      // Sync to currentUser object
      setCurrentUser(prev => {
        if (!prev) return prev;
        const updated = { ...prev, loyaltyPoints: result.newPoints };
        try { localStorage.setItem('vault_current_user', JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
    return result;
  };
  const [isLaunchingCountdown, setIsLaunchingCountdown] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(3);
  const [lobbyRadioInput, setLobbyRadioInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Heist Session Interruption Recovery
  const [recoverySession, setRecoverySession] = useState(() => {
    try {
      const saved = localStorage.getItem('vault_active_session');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed?.roomCode && parsed?.timestamp && (Date.now() - parsed.timestamp < 15 * 60 * 1000)) {
        return parsed;
      }
      localStorage.removeItem('vault_active_session');
      return null;
    } catch {
      return null;
    }
  });

  const [emailInput, setEmailInput] = useState('');
  const [crewNameInput, setCrewNameInput] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [targetSlotId, setTargetSlotId] = useState(null);
  const [joinPlayerName, setJoinPlayerName] = useState('');
  const [joinRole, setJoinRole] = useState('The Hacker');
  const [joinCharacterId, setJoinCharacterId] = useState('c1');

  const [unlockedRooms, setUnlockedRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_unlocked_rooms_sylvan');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });
  const [activeRoom, setActiveRoom] = useState(1);
  const [roomSolved, setRoomSolved] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_room_solved_sylvan');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_xp_sylvan');
      return saved ? parseInt(saved, 10) : 1200;
    } catch {
      return 1200;
    }
  });
  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_streak_sylvan');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  const [showFinale, setShowFinale] = useState(false);
  const [builderSaving, setBuilderSaving] = useState(false);
  const [builder, setBuilder] = useState({ 
    title: '', 
    category: 'Forest Botany & Lore', 
    difficulty: 'Medium', 
    reward: '5,000 XP & Leaf Star', 
    description: '', 
    question: '', 
    answer: '' 
  });

  // ─── Fullscreen Lock Helpers (iOS Safari & Mobile Safe) ─────────
  const isFullscreenSupported = () => {
    if (typeof document === 'undefined') return false;
    return Boolean(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  const enterHeistFullscreen = () => {
    if (!isFullscreenSupported()) return;
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch (e) { /* fullscreen not supported / blocked */ }
  };

  const exitHeistFullscreen = () => {
    if (!isFullscreenSupported()) return;
    try {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
    } catch (e) { /* already not fullscreen */ }
  };

  const isHeistLocked = isTimerRunning && activeTab === 'liveheist';

  // Squad mode & Solo squad state: If a person is alone in the squad (<=1 human player),
  // all puzzle modules, questions, and stages are fully unlocked for them.
  const activeSquadPlayers = (lobby?.players || []).filter(p => (p.userId || p.username) && !p.isAi);
  const isSquadMultiplayer = Boolean(lobby?.code && activeSquadPlayers.length > 1);
  const isAloneInSquad = !isSquadMultiplayer;

  const navigateToTab = (newTab) => {
    if (newTab === 'login') {
      setIsAuthModalOpen(true);
      heistAudio.playKeyClick();
      return;
    }
    // Block navigation during active heist
    if (isHeistLocked && newTab !== 'liveheist') {
      toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
      return;
    }
    const protectedTabs = ['stats', 'builder'];
    if (!currentUser && protectedTabs.includes(newTab)) {
      setIsAuthModalOpen(true);
      toast.info("🔐 Operative clearance required: Sign in with email & password to access this sector.");
      return;
    }
    if (newTab !== activeTab) {
      if (activeTab === 'liveheist' && newTab !== 'liveheist') {
        setIsTimerRunning(false);
        heistAudio.stopTension();
        setAlarmLevel('LOW_SECURITY');
        setAlarmFails(0);
      }
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleGoBack = () => {
    // Block back navigation during active heist
    if (isHeistLocked) {
      toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
      return;
    }
    heistAudio.playKeyClick();
    if (activeTab === 'liveheist') {
      setIsTimerRunning(false);
      heistAudio.stopTension();
      setAlarmLevel('LOW_SECURITY');
      setAlarmFails(0);
    }
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTab(prevTab);
    } else {
      setActiveTab('home');
    }
  };

  const handleLeaveHeistLocally = () => {
    setDeserterWarningIsHeistActive(true);
    handleConfirmLeaveSquad();
  };

  const handleConcludeHeist = (actionType = 'abort', force = false) => {
    // Count only slots with a real connected player, not empty role slots —
    // lobby.players always has 4 entries regardless of how many people
    // actually joined, so raw .length is always 4 and would incorrectly
    // force a vote even when testing solo.
    const activePlayers = (lobby?.players || []).filter(p => p.userId || p.username);
    const roomCode = lobby?.roomCode || lobby?.code;

    // If in multiplayer and not forced by a successful vote, propose a vote instead
    if (!force && activePlayers.length > 1 && activeTab === 'liveheist' && roomCode) {
      const activeSocket = getSocket();
      if (activeSocket) {
        activeSocket.emit('heist:propose-end', {
          roomCode,
          directive: actionType,
          proposedBy: currentUser?.callsign || currentUser?.username || 'A teammate'
        }, (res) => {
          if (res?.error) {
            // Server has no heist record (e.g. backend restarted) — fall through to local conclude
            console.warn('[HEIST] propose-end server error:', res.error, '— falling back to local conclude');
            toast.info('Ending heist locally (server session expired).');
            handleConcludeHeist(actionType, true); // force local path
          }
        });
        setIsEndHeistModalOpen(false);
      }
      return;
    }

    setIsTimerRunning(false);
    heistAudio.stopTension();
    setIsEndHeistModalOpen(false);
    exitHeistFullscreen();

    const stage = allStages[currentStageIdx] || heistStages[0];
    const stageId = stage.stageId || 1;
    const defaultTime = stage.timeLimit || 180;

    if (actionType === 'debrief') {
      heistAudio.playSuccessChime();
      const solved = stageSolvedRoles[stageId] || {};
      const solvedCount = Object.keys(solved).filter(k => solved[k]).length;
      const totalTimeSpent = Math.max(0, defaultTime - timeLeft);
      const timeStr = `${Math.floor(totalTimeSpent / 60)}m ${(totalTimeSpent % 60)}s`;

      setIsMatchVictory(solvedCount > 0);
      const comboBonus = maxCombo >= 2 ? maxCombo * 25 : 0;
      const scientistPerkBonus = (activeCockpitRole === 'scientist' && solvedCount > 0 && (currentUser?.unlockedPerks || []).includes('scientist_steady_hands')) ? 50 : 0;
      
      const hackerXp = solved.hacker ? 350 : 100;
      const engineerXp = solved.engineer ? 350 : 100;
      const scientistXp = (solved.scientist ? 350 : 100) + scientistPerkBonus;
      const cryptoXp = solved.cryptographer ? 350 : 100;
      const gainedXp = hackerXp + engineerXp + scientistXp + cryptoXp + comboBonus;

      setAnalyticsStats({
        hackerXp,
        engineerXp,
        scientistXp,
        cryptoXp,
        timeElapsed: timeStr,
        accuracy: alarmFails === 0 ? "100%" : `${Math.max(50, 100 - alarmFails * 10)}%`,
        alarmsTripped: alarmFails,
        comboBonus,
        maxCombo
      });

      // Update standalone xp state
      setXp(prev => {
        const next = (typeof prev === 'number' ? prev : 1200) + gainedXp;
        try { localStorage.setItem('kh_xp_sylvan', next.toString()); } catch {}
        return next;
      });

      if (gainedXp > 0) {
        setLastEarnedXp(gainedXp);
        setXpFlyout({ amount: gainedXp, id: Date.now() });
        setTimeout(() => setXpFlyout(null), 2800);
      }

      if (currentUser) {
        const resultLabel = solvedCount > 0 ? 'VICTORY' : 'CONCLUDED';
        const roleLabel = activeCockpitRole === 'hacker' ? 'Canopy Hacker' : activeCockpitRole === 'engineer' ? 'Woodland Engineer' : activeCockpitRole === 'scientist' ? 'Flora Scientist' : 'Mist Cryptographer';
        const newRecord = {
          id: `h-${Date.now()}`,
          mission: stage.title || 'Infiltration Op',
          role: roleLabel,
          result: resultLabel,
          xp: `+${gainedXp} XP`,
          time: timeStr,
          date: 'Just now'
        };
        // Optimistic local update so the UI reflects progress immediately,
        // without waiting on the network round-trip.
        const optimisticUser = {
          ...currentUser,
          xp: currentUser.xp + gainedXp,
          level: calculateLevel(currentUser.xp + gainedXp),
          stats: {
            ...currentUser.stats,
            missionsCompleted: (currentUser.stats?.missionsCompleted || 0) + 1,
            vaultsCracked: (currentUser.stats?.vaultsCracked || 0) + solvedCount,
            alarmsTripped: (currentUser.stats?.alarmsTripped || 0) + alarmFails
          },
          history: [newRecord, ...(currentUser.history || [])]
        };
        setCurrentUser(optimisticUser);
        try {
          localStorage.setItem('vault_current_user', JSON.stringify(optimisticUser));
        } catch {}
        window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: optimisticUser }));

        if (solvedCount > 0) {
          triggerAchievementCheck('HEIST_COMPLETE', {
            timeTaken: totalTimeSpent,
            alarmsTripped: alarmFails,
            isCoop: Boolean(lobby?.code && lobby?.players?.length > 1)
          });
          // ── Award Loyalty Points for completing heist ──────────────────
          const isCoop = Boolean(lobby?.code && (lobby?.players || []).filter(p => p.userId || p.username).length > 1);
          if (isCoop) {
            // Squad heist: bonus LP for completing + extra for winning all roles
            const lpResult = applyLP('COMPLETE_HEIST');
            if (lpResult) {
              const { newPoints, rank } = lpResult;
              toast.success(`🛡️ +50 Loyalty Points! ${rank.emoji} ${rank.name} · ${newPoints} LP`, { duration: 500 });
            }
            if (solvedCount === 4) {
              // Full squad win bonus
              setTimeout(() => {
                const winResult = applyLP('WIN_HEIST');
                if (winResult) {
                  toast.success(`🏆 Squad Win Bonus +100 LP! ${winResult.rank.emoji} ${winResult.newPoints} LP total`, { duration: 500 });
                  setLoyaltyPointsState(winResult.newPoints);
                }
              }, 1200);
            }
          }
        }

        // Persist to the database so XP/level/history are consistent across
        // every device the account logs into, not just this browser tab.
        heistAPI.completeHeist({
          mission_title: stage.title || 'Infiltration Op',
          role: activeCockpitRole || 'hacker',
          result: resultLabel,
          xp_earned: gainedXp,
          time_elapsed: timeStr,
          accuracy: alarmFails === 0 ? '100%' : `${Math.max(50, 100 - alarmFails * 10)}%`,
          alarms_tripped: alarmFails,
          vaults_cracked: solvedCount
        }).then((res) => {
          if (res?.user) {
            // Reconcile with the server's authoritative xp/level in case
            // of any drift, while keeping locally-tracked fields like history.
            setCurrentUser(prev => {
              const reconciled = { ...prev, ...res.user, history: prev?.history || optimisticUser.history };
              try {
                localStorage.setItem('vault_current_user', JSON.stringify(reconciled));
              } catch {}
              return reconciled;
            });
            window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: res.user }));
          }
        }).catch((err) => {
          console.error('[HEIST] Failed to persist results to server:', err);
          toast.error('Could not save mission results to your account. Progress may not sync across devices.');
        });
      }

      setTimeLeft(defaultTime);
      setAlarmLevel('LOW_SECURITY');
      setAlarmFails(0);

      setAnalyticsModalOpen(true);
    } else {
      heistAudio.playRadioSquelch();
      setTimeLeft(defaultTime);
      setAlarmLevel('LOW_SECURITY');
      setAlarmFails(0);

      setActiveTab('home');
    }
  };

  const handleLoginSuccess = (userData) => {
    const cleanUser = sanitizeUser(userData);
    // Seed LP to 1000 if user has no stored points
    const seededLP = initLoyaltyFromUser(cleanUser);
    const finalLP = seededLP === 0 ? 1000 : seededLP;
    if (finalLP !== seededLP) setLoyaltyPoints(finalLP);
    setLoyaltyPointsState(finalLP);
    const userWithLP = { ...cleanUser, loyaltyPoints: finalLP };
    setCurrentUser(userWithLP);
    try { localStorage.setItem('vault_current_user', JSON.stringify(userWithLP)); } catch {}
    setSidebarCollapsed(false);
    setActiveTab('home');
    // Connect to Socket.io after successful login
    try { connectSocket(); } catch (e) { /* socket optional */ }
    // Only launch the onboarding tutorial if user has never seen it before
    if (shouldShowTour()) {
      setTimeout(() => {
        setShowTour(true);
      }, 800);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vault_current_user');
    localStorage.removeItem('vault_guest_id');
    localStorage.removeItem('vault_guest_name');
    authAPI.logout();
    disconnectSocket();
    setActiveTab('home');
    setTabHistory([]);
    setIsAuthModalOpen(false);
    setShowTour(false);
    toast.info("👋 Signed out. Welcome to the Syndicate Public Gateway.");
  };

  const handleChangePassword = async () => {
    if (!currentPasswordInput || !newPasswordInput) {
      toast.error('Fill in both current and new password.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPasswordInput.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authAPI.changePassword(currentPasswordInput, newPasswordInput);
      toast.success('Password updated successfully.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err) {
      toast.error(err?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotificationPrefs = async () => {
    if (!currentUser?.id) return;
    setIsSavingPrefs(true);
    try {
      const res = await userAPI.updateProfile(currentUser.id, { notification_prefs: notifPrefs });
      const updated = { ...currentUser, notificationPrefs: res?.user?.notificationPrefs || notifPrefs };
      setCurrentUser(updated);
      localStorage.setItem('vault_current_user', JSON.stringify(updated));
      toast.success('Notification preferences saved.');
    } catch (err) {
      toast.error(err?.message || 'Failed to save preferences.');
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const applyThemeToDOM = (themeId) => {
    const theme = VAULT_THEMES.find(t => t.id === themeId) || VAULT_THEMES[0];
    document.documentElement.setAttribute('data-theme', theme.id);
    document.documentElement.style.setProperty('--vault-primary', theme.primary);
    document.documentElement.style.setProperty('--vault-primary-hover', theme.primaryHover || theme.primary);
    document.documentElement.style.setProperty('--vault-accent', theme.accent);
    document.documentElement.style.setProperty('--vault-glow', theme.glow || 'rgba(16, 185, 129, 0.45)');
    document.documentElement.style.setProperty('--vault-theme-bg', theme.bg || '#03140C');
    document.documentElement.style.setProperty('--vault-theme-surface', theme.surface || '#041C13');
  };

  const handleEquipTheme = async (themeId) => {
    if (isEquippingTheme) return;
    setIsEquippingTheme(themeId);
    try {
      const updated = { ...(currentUser || {}), equippedTheme: themeId };
      setCurrentUser(updated);
      setEquippedThemeId(themeId);
      localStorage.setItem('vault_theme', themeId);
      if (currentUser) {
        localStorage.setItem('vault_current_user', JSON.stringify(updated));
      }
      applyThemeToDOM(themeId);
      heistAudio.playSuccessChime();

      if (currentUser?.id) {
        await userAPI.updateProfile(currentUser.id, { equipped_theme: themeId, equippedTheme: themeId }).catch(() => {});
      }
      const themeObj = VAULT_THEMES.find(t => t.id === themeId);
      toast.success(`✨ Equipped Theme: ${themeObj?.name || themeId}`);
    } catch (err) {
      toast.error(err?.message || 'Failed to equip theme.');
    } finally {
      setIsEquippingTheme(null);
    }
  };

  const handleUnlockPerk = async (perkId) => {
    if (!currentUser?.id || isUnlockingPerk) return;
    setIsUnlockingPerk(perkId);
    try {
      const res = await userAPI.unlockPerk(currentUser.id, perkId);
      const updated = {
        ...currentUser,
        skillPoints: res?.skillPoints ?? currentUser.skillPoints,
        unlockedPerks: res?.unlockedPerks || currentUser.unlockedPerks
      };
      setCurrentUser(updated);
      localStorage.setItem('vault_current_user', JSON.stringify(updated));
      toast.success(`Unlocked: ${PERKS.find(p => p.id === perkId)?.name}`);
    } catch (err) {
      toast.error(err?.message || 'Could not unlock that perk.');
    } finally {
      setIsUnlockingPerk(null);
    }
  };

  // Auto-show onboarding tour for first-time visitors
  useEffect(() => {
    // Delay slightly so the app finishes rendering before the overlay appears
    const tourTimer = setTimeout(() => {
      if (shouldShowTour()) {
        setShowTour(true);
      }
    }, 800);
    return () => clearTimeout(tourTimer);
  }, []);

  // Auto-login from JWT token on mount if returning user
  useEffect(() => {
    if (!currentUser && authAPI.isAuthenticated()) {
      authAPI.getMe().then(data => {
        if (data?.user) {
          const cleanUser = sanitizeUser(data.user);
          setCurrentUser(cleanUser);
          try { localStorage.setItem('vault_current_user', JSON.stringify(cleanUser)); } catch {}
          try { connectSocket(); } catch (e) { /* socket optional */ }
        }
      }).catch(() => {
        // Token expired or invalid — clean up
        authAPI.logout();
      }).finally(() => {
        setIsAppLoading(false);
      });
    } else {
      if (currentUser) {
        // Connect socket for existing session
        try { connectSocket(); } catch (e) { /* socket optional */ }
      }
      setIsAppLoading(false);
    }

    // Listen for auth expiration events from API service
    const handleAuthExpired = () => {
      setCurrentUser(null);
      setActiveTab('home');
      toast.warning('🔒 Session expired. Please sign in again.');
    };
    window.addEventListener('vault:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('vault:auth-expired', handleAuthExpired);
  }, []);

  // Real-Time Socket Event Subscriptions & Live Room Sync
  useEffect(() => {
    // Check for room parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      const code = roomParam.trim().toUpperCase();
      lobbySocket.get(code, (res) => {
        if (res?.lobby) {
          setLobby(res.lobby);
          setActiveTab('lobby');
        }
      });
    }

    // Hydrate missions from REST API if available
    missionAPI.list().then(data => {
      if (data?.missions && data.missions.length > 0) {
        setMissions(data.missions);
      }
    }).catch(() => { /* offline fallback */ });

    // Socket Connection Status
    const handleConnected = () => {
      setIsSocketConnected(true);
      if (lobby?.code) {
        lobbySocket.get(lobby.code, (res) => {
          if (res?.lobby) setLobby(res.lobby);
        });
      }
    };

    const handleDisconnected = () => {
      setIsSocketConnected(false);
    };

    // Lobby Events
    const handleLobbyState = (newLobby) => {
      if (newLobby && Array.isArray(newLobby.players)) {
        setLobby(newLobby);
      }
    };

    const handleLobbyPlayerJoined = (data) => {
      heistAudio.playSuccessChime();
    };

    const handleLobbyPlayerLeft = (data) => {};

    const handleLobbyPlayerReady = (data) => {};

    const handleLobbyRoleChanged = (data) => {};

    const handleLobbyHostChanged = (data) => {};

    const handleLobbyKicked = (data) => {
      toast.error(data.message || 'You have been removed from the squad.');
      setActiveTab('home');
    };

    const handleLobbyStarting = (data) => {
      setIsLaunchingCountdown(true);
      const countdownSecs = (typeof data?.countdown === 'number' && data.countdown > 0) ? data.countdown : 3;
      setLaunchCountdown(countdownSecs);
      heistAudio.playRadioSquelch();
      let cnt = countdownSecs;

      const finishCountdownAndStart = () => {
        setIsLaunchingCountdown(false);
        if (activeTabRef.current !== 'liveheist') {
          handleHeistStarted(data);
        }
      };

      const cntInterval = setInterval(() => {
        cnt -= 1;
        if (cnt > 0) {
          setLaunchCountdown(cnt);
          heistAudio.playKeyClick();
        } else {
          clearInterval(cntInterval);
          finishCountdownAndStart();
        }
      }, 1000);

      // Safety fallback: guaranteed auto-entry in case of timer throttling
      setTimeout(() => {
        clearInterval(cntInterval);
        finishCountdownAndStart();
      }, (countdownSecs + 0.5) * 1000);
    };

    const handleLobbyError = (data) => {
      if (data?.message) toast.error(data.message);
    };

    // Live Heist Events
    const handleHeistStarted = (data) => {
      setIsLaunchingCountdown(false);
      
      const incomingRoomCode = data?.roomCode || data?.code || lobby?.code || lobby?.roomCode;
      if (incomingRoomCode) {
        setLobby(prev => ({
          ...(prev || {}),
          ...(data?.lobby || {}),
          code: incomingRoomCode,
          roomCode: incomingRoomCode,
          players: data?.players || data?.lobby?.players || prev?.players || []
        }));
      }

      const currentLobby = data?.lobby || lobby;
      const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
      const myName = currentUser?.username || localStorage.getItem('vault_guest_name');
      const playersList = data?.players || currentLobby?.players || [];
      const mySlot = playersList.find(p => (p.userId && p.userId === myId) || (myName && p.username === myName));
      const assignedRole = mySlot?.role ? normalizeRoleKey(mySlot.role) : (activeCockpitRole || 'hacker');
      const attemptSeed = data?.attemptSeed ? String(data.attemptSeed) : String(Date.now());
      const isHost = mySlot?.isHost || (currentLobby?.hostId && currentLobby.hostId === myId);

      handleStartHeistStage(0, !!isHost, assignedRole, attemptSeed, incomingRoomCode);
    };

    const handleRemotePuzzleSolved = (data) => {
      if (data?.role) {
        const roleKey = (data.role || '').toLowerCase().trim();
        const stage = allStages[currentStageIdx] || heistStages[0];
        const sId = stage.stageId || 1;

        setStageSolvedRoles(prev => {
          const currentForStage = {
            ...(prev[sId] || {}),
            ...(data.solvedRoles || {}),
            [roleKey]: true
          };

          const activeRoles = stage.selectedRoles 
            ? Object.keys(stage.selectedRoles).filter(k => stage.selectedRoles[k])
            : ['hacker', 'engineer', 'scientist', 'cryptographer'];

          if (activeRoles.every(r => currentForStage[r])) {
            setIsExtractionActive(true);
            heistAudio.playRadioSquelch();
          }

          return {
            ...prev,
            [sId]: currentForStage
          };
        });

        if (data.clue) {
          setStageRoleClues(prev => ({
            ...prev,
            [sId]: { ...(prev[sId] || {}), [roleKey]: data.clue }
          }));
        }

        const solverName = data.solvedBy || `${roleKey.toUpperCase()} Specialist`;
        const timeStr = data.time || `${Math.floor((180 - timeLeft) / 60)}:${((180 - timeLeft) % 60).toString().padStart(2, '0')}`;
        setRadioMessages(prev => {
          const text = `[PASSED] ${data.clue || 'Security protocol bypassed'} — Transmitting across interdependence pipeline!`;
          const last = prev[prev.length - 1];
          if (last && last.text === text && last.sender === solverName) return prev;
          return [...prev, {
            sender: solverName,
            role: roleKey,
            text,
            time: timeStr
          }];
        });

        heistAudio.playSuccessChime();
        toast.success(`🔓 ${roleKey.toUpperCase()} puzzle solved by ${solverName}!`);
      }
    };

    const handleRemoteHeistState = (state) => {
      if (!state) return;
      if (activeTabRef.current !== 'liveheist' && !isInSquadRoomRef.current) return;
      const stage = allStages[currentStageIdx] || heistStages[0];
      const sId = stage.stageId || 1;
      if (state.solvedRoles && Object.keys(state.solvedRoles).length > 0) {
        setStageSolvedRoles(prev => ({
          ...prev,
          [sId]: { ...(prev[sId] || {}), ...state.solvedRoles }
        }));
      }
      if (state.clues && Object.keys(state.clues).length > 0) {
        setStageRoleClues(prev => ({
          ...prev,
          [sId]: { ...(prev[sId] || {}), ...state.clues }
        }));
      }
      if (state.timeLeft !== undefined) setTimeLeft(state.timeLeft);
      if (state.alarmLevel && activeTabRef.current === 'liveheist') setAlarmLevel(state.alarmLevel);
      if (state.alarmFails !== undefined) setAlarmFails(state.alarmFails);
    };

    const handleRemotePuzzleFailed = (data) => {
      if (activeTabRef.current !== 'liveheist' && !isInSquadRoomRef.current) return;
      if (data) {
        if (data.alarmFails !== undefined) setAlarmFails(data.alarmFails);
        if (data.alarmLevel && activeTabRef.current === 'liveheist') setAlarmLevel(data.alarmLevel);
        if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft);
        if (activeTabRef.current === 'liveheist') {
          heistAudio.playAlarmChime();
          toast.error(`🚨 ALARM ESCALATED by ${data.failedBy || 'teammate'}: ${data.reason}`);
        }
      }
    };

    const handleRemoteRadioMessage = (msg) => {
      if (msg?.text) {
        setRadioMessages(prev => {
          const last = prev[prev.length - 1];
          if (
            last && 
            last.text === msg.text && 
            last.sender === msg.sender && 
            (last.time === msg.time || !last.time || !msg.time)
          ) {
            return prev;
          }
          return [...prev, msg];
        });
        heistAudio.playRadioSquelch();
      }
    };

    const handleTimerTick = (data) => {
      if (activeTabRef.current !== 'liveheist' && !isInSquadRoomRef.current) return;
      if (data?.timeLeft !== undefined) setTimeLeft(data.timeLeft);
      if (data?.alarmLevel && activeTabRef.current === 'liveheist') setAlarmLevel(data.alarmLevel);
    };

    const handleRemoteStageSynced = (data) => {
      if (data) {
        setCurrentStageIdx(data.stageIdx || 0);
        setTimeLeft(data.timeLimit || 180);
        setAlarmLevel('LOW_SECURITY');
        setAlarmFails(0);
        toast.success(`Advancing to Stage ${(data.stageIdx || 0) + 1} synchronously!`);
      }
    };

    const handleVoteState = (data) => {
      // Server sends { directive, proposedBy, yesCount, noCount, total }
      // Vote modal reads { directive, proposedBy, yesVotes[], noVotes[], requiredVotes }
      // Normalize here so the UI doesn't need to change.
      const majority = Math.floor((data.total || 2) / 2) + 1;
      setEndHeistVoteState({
        ...data,
        yesVotes: Array.from({ length: data.yesCount || 0 }),
        noVotes: Array.from({ length: data.noCount || 0 }),
        requiredVotes: majority
      });
    };

    const handleEndVoted = (data) => {
      setEndHeistVoteState(null);
      handleConcludeHeist(data?.directive || 'abort', true);
    };

    const handleVoteFailed = () => {
      setEndHeistVoteState(null);
      toast.error("Majority vote failed. Mission continues!");
    };

    const handleLobbyVoiceUpdate = (data) => {
      if (data?.slotId) {
        setLobby(prev => {
          if (!prev?.players) return prev;
          const updatedPlayers = prev.players.map(p => {
            if (p.slotId === data.slotId || p.userId === data.userId) {
              return { ...p, voiceState: data.voiceState };
            }
            return p;
          });
          return { ...prev, players: updatedPlayers };
        });
      }
    };

    onSocketEvent('connected', handleConnected);
    onSocketEvent('disconnected', handleDisconnected);
    onSocketEvent('lobbyState', handleLobbyState);
    onSocketEvent('lobbyPlayerJoined', handleLobbyPlayerJoined);
    onSocketEvent('lobbyPlayerLeft', handleLobbyPlayerLeft);
    onSocketEvent('lobbyPlayerReady', handleLobbyPlayerReady);
    onSocketEvent('lobbyRoleChanged', handleLobbyRoleChanged);
    onSocketEvent('lobbyHostChanged', handleLobbyHostChanged);
    onSocketEvent('lobbyKicked', handleLobbyKicked);
    onSocketEvent('lobbyStarting', handleLobbyStarting);
    onSocketEvent('lobbyVoiceUpdate', handleLobbyVoiceUpdate);
    onSocketEvent('lobbyError', handleLobbyError);
    onSocketEvent('heistStarted', handleHeistStarted);
    onSocketEvent('heistState', handleRemoteHeistState);
    onSocketEvent('heistPuzzleSolved', handleRemotePuzzleSolved);
    onSocketEvent('heistPuzzleFailed', handleRemotePuzzleFailed);
    onSocketEvent('lobbyRadioMessage', handleRemoteRadioMessage);
    onSocketEvent('heistRadioMessage', handleRemoteRadioMessage);
    onSocketEvent('heistTimerTick', handleTimerTick);
    onSocketEvent('heistStageSynced', handleRemoteStageSynced);
    onSocketEvent('heistVoteState', handleVoteState);
    onSocketEvent('heistEndVoted', handleEndVoted);
    onSocketEvent('heistVoteFailed', handleVoteFailed);

    const handleExtractionStart = () => {
      setIsExtractionActive(true);
      heistAudio.playRadioSquelch();
    };
    onSocketEvent('heistExtractionStart', handleExtractionStart);

    return () => {
      offSocketEvent('heistExtractionStart', handleExtractionStart);
      offSocketEvent('connected', handleConnected);
      offSocketEvent('disconnected', handleDisconnected);
      offSocketEvent('lobbyState', handleLobbyState);
      offSocketEvent('lobbyPlayerJoined', handleLobbyPlayerJoined);
      offSocketEvent('lobbyPlayerLeft', handleLobbyPlayerLeft);
      offSocketEvent('lobbyPlayerReady', handleLobbyPlayerReady);
      offSocketEvent('lobbyRoleChanged', handleLobbyRoleChanged);
      offSocketEvent('lobbyHostChanged', handleLobbyHostChanged);
      offSocketEvent('lobbyKicked', handleLobbyKicked);
      offSocketEvent('lobbyStarting', handleLobbyStarting);
      offSocketEvent('lobbyVoiceUpdate', handleLobbyVoiceUpdate);
      offSocketEvent('lobbyError', handleLobbyError);
      offSocketEvent('heistStarted', handleHeistStarted);
      offSocketEvent('heistState', handleRemoteHeistState);
      offSocketEvent('heistPuzzleSolved', handleRemotePuzzleSolved);
      offSocketEvent('heistPuzzleFailed', handleRemotePuzzleFailed);
      offSocketEvent('lobbyRadioMessage', handleRemoteRadioMessage);
      offSocketEvent('heistRadioMessage', handleRemoteRadioMessage);
      offSocketEvent('heistTimerTick', handleTimerTick);
      offSocketEvent('heistStageSynced', handleRemoteStageSynced);
      offSocketEvent('heistVoteState', handleVoteState);
      offSocketEvent('heistEndVoted', handleEndVoted);
      offSocketEvent('heistVoteFailed', handleVoteFailed);
    };
  }, [currentStageIdx, lobby?.code, currentUser]);

  useEffect(() => {
    heistAudio.toggleSound(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (currentUser?.notificationPrefs) {
      setNotifPrefs(currentUser.notificationPrefs);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id) {
      setUnlockedThemes(['default', 'ember', 'crimson', 'azure', 'golden']);
      return;
    }
    userAPI.getUnlocks(currentUser.id)
      .then(res => {
        if (res?.unlocked && Array.isArray(res.unlocked) && res.unlocked.length > 0) {
          setUnlockedThemes(Array.from(new Set(['default', 'ember', 'crimson', 'azure', 'golden', ...res.unlocked])));
        }
      })
      .catch(() => {});
  }, [currentUser?.id]);

  useEffect(() => {
    const activeTheme = currentUser?.equippedTheme || equippedThemeId || localStorage.getItem('vault_theme') || 'default';
    applyThemeToDOM(activeTheme);
  }, [currentUser?.equippedTheme, equippedThemeId]);

  useEffect(() => {
    localStorage.setItem('kh_missions_subject_v4', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('kh_lobby_subject_v4', JSON.stringify(lobby));
  }, [lobby]);

  useEffect(() => {
    localStorage.setItem('kh_unlocked_rooms_sylvan', JSON.stringify(unlockedRooms));
  }, [unlockedRooms]);

  useEffect(() => {
    localStorage.setItem('kh_room_solved_sylvan', JSON.stringify(roomSolved));
  }, [roomSolved]);

  useEffect(() => {
    localStorage.setItem('kh_xp_sylvan', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('kh_streak_sylvan', streak.toString());
  }, [streak]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && activeTab === 'liveheist' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleHeistTimeout();
            return 0;
          }
          if (prev <= 30 && alarmLevel !== 'HIGH_LOCKDOWN') {
            setAlarmLevel('HIGH_LOCKDOWN');
            heistAudio.startTensionBeat('HIGH_LOCKDOWN');
          } else if (prev <= 60 && alarmLevel === 'LOW_SECURITY') {
            setAlarmLevel('MEDIUM_ALERT');
            heistAudio.startTensionBeat('MEDIUM_ALERT');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeTab, timeLeft, alarmLevel]);

  // Re-enter fullscreen if user presses Escape during active heist (desktop / supported only)
  useEffect(() => {
    if (!isHeistLocked || !isFullscreenSupported()) return;
    const handleFullscreenChange = () => {
      if (isHeistLocked && !document.fullscreenElement && !document.webkitFullscreenElement) {
        // Re-request fullscreen after a brief delay
        setTimeout(() => {
          if (isFullscreenSupported()) {
            enterHeistFullscreen();
            toast.warning("🔒 Fullscreen locked during heist! Use END HEIST to exit.");
          }
        }, 300);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [isHeistLocked]);

  // Fix 2a: Warn operative before accidental page unload or navigation during active heist
  useEffect(() => {
    if (!isHeistLocked) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Leaving will disconnect you from your squad!';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isHeistLocked]);

  // ─────────────────────────────────────────────────────────────
  // Multiplayer Room Handlers
  // ─────────────────────────────────────────────────────────────

  const handleCreateNewRoom = (customTitle) => {
    const code = `HEIST-${Math.floor(100 + Math.random() * 900)}`;
    const title = customTitle || `Squad Delta ${code}`;
    const myName = currentUser?.callsign || currentUser?.username || localStorage.getItem('vault_guest_name') || 'Operative';

    lobbySocket.create('m1', code, title, 'hacker', 'c1', (res) => {
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.lobby) {
        setLobby(res.lobby);
        setIsInSquadRoom(true);
        setActiveTab('lobby');
        heistAudio.playSuccessChime();
        toast.success(`Squad room initialized! Code: ${res.lobby.code || code}`);
      }
    });
    setIsCreateRoomModalOpen(false);
    setCreateRoomTitleInput('');
  };

  const handleJoinRoomSubmit = (e) => {
    e.preventDefault();
    const code = joinRoomCodeInput.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a valid room code (e.g. HEIST-782)');
      return;
    }

    const myName = currentUser?.callsign || currentUser?.username || localStorage.getItem('vault_guest_name') || 'Operative';

    lobbySocket.join(code, 'engineer', 'c2', myName, (res) => {
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.lobby) {
        setLobby(res.lobby);
        setIsInSquadRoom(true);
        setActiveTab('lobby');
        heistAudio.playSuccessChime();
        setIsJoinRoomModalOpen(false);
        setJoinRoomCodeInput('');
        toast.success(`Joined squad ${res.lobby.name || code}!`);
      }
    });
  };

  const handleJoinSquadOperation = (roomCode, chosenRole = 'hacker') => {
    if (!roomCode || !roomCode.trim()) {
      toast.error("Enter a valid room code before enlisting.");
      return;
    }
    const roleMap = {
      hacker: 'c1',
      engineer: 'c2',
      scientist: 'c3',
      cryptographer: 'c4'
    };
    const charId = roleMap[chosenRole] || 'c1';
    const myName = currentUser?.callsign || currentUser?.username || localStorage.getItem('vault_guest_name') || 'Operative';

    lobbySocket.join(roomCode, chosenRole, charId, myName, (res) => {
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.lobby) {
        setLobby(res.lobby);
        setIsInSquadRoom(true);
        setActiveTab('lobby');
        heistAudio.playSuccessChime();
        toast.success(`Enlisted in squad ${res.lobby.name || roomCode}!`);
      }
    });
  };

  const handleToggleVoice = async () => {
    heistAudio.playKeyClick();
    const roomCode = lobby.roomCode || lobby.code;
    if (!roomCode) {
      toast.error("No active squad room found. Join or create a squad before starting voice.");
      return;
    }
    if (isLobbyVoiceConnected) {
      voiceEngine.stopVoice();
      setIsLobbyVoiceConnected(false);
      lobbySocket.updateVoiceState(roomCode, false, isLobbyMicMuted, isLobbyDeafened);
      toast.info("🔴 Disconnected from Squad Voice Channel");
    } else {
      try {
        let currentSocket = getSocket();
        if (!currentSocket || !currentSocket.connected) {
          currentSocket = connectSocket();
        }
        await voiceEngine.startVoice(currentSocket, roomCode);
        setIsLobbyVoiceConnected(true);
        lobbySocket.updateVoiceState(roomCode, true, isLobbyMicMuted, isLobbyDeafened);
        toast.success("🎙️ Voice Channel Live (Opus HD Audio Mesh)");
      } catch (err) {
        console.error('[VOICE] Toggle voice error:', err);
        toast.error(err?.message || "Microphone access denied or unavailable");
        setIsLobbyVoiceConnected(false);
      }
    }
  };

  const handleToggleMic = () => {
    const newMuted = !isLobbyMicMuted;
    setIsLobbyMicMuted(newMuted);
    voiceEngine.setMuted(newMuted);
    const roomCode = lobby.roomCode || lobby.code || 'MAIN';
    lobbySocket.updateVoiceState(roomCode, isLobbyVoiceConnected, newMuted, isLobbyDeafened);
    heistAudio.playKeyClick();
    toast.info(newMuted ? "🔇 Microphone Muted" : "🎙️ Microphone Live & Transmitting");
  };

  const handleToggleDeafen = () => {
    const newDeafened = !isLobbyDeafened;
    setIsLobbyDeafened(newDeafened);
    voiceEngine.setDeafened(newDeafened);
    const roomCode = lobby.roomCode || lobby.code || 'MAIN';
    lobbySocket.updateVoiceState(roomCode, isLobbyVoiceConnected, isLobbyMicMuted, newDeafened);
    heistAudio.playKeyClick();
    toast.info(newDeafened ? "🎧 Deafen Active: Audio Muted" : "🔊 Deafen Off: Audio Live");
  };

  const handleCopyInviteLink = () => {
    const code = lobby?.code || lobby?.roomCode || '';
    if (!code) {
      toast.error('No active room code to share.');
      return;
    }
    const link = `${window.location.origin}?room=${code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      toast.success('🔗 Invite link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCopyRoomCode = () => {
    const code = lobby?.code || lobby?.roomCode || '';
    if (!code) {
      toast.error('No active room code.');
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      toast.success(`📋 Room code ${code} copied!`);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleSelectRole = (roleKey) => {
    const code = lobby?.code || lobby?.roomCode;
    const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
    const myName = currentUser?.username || localStorage.getItem('vault_guest_name') || 'qwerty';

    // Verify role lock-out: if another player has taken this role, block it
    const isTaken = (lobby?.players || []).some(s => {
      const pName = s.playerName || s.username;
      const isMe = (s.userId && s.userId === myId) || (myName && pName === myName);
      return !isMe && s.role && normalizeRoleKey(s.role) === roleKey && pName;
    });

    if (isTaken) {
      toast.error('That specialist role is already claimed by another squad member!');
      return;
    }

    if (code) lobbySocket.selectRole(code, roleKey);

    const roleMap = {
      hacker: { role: 'The Hacker', charId: 'c1' },
      engineer: { role: 'The Engineer', charId: 'c2' },
      scientist: { role: 'The Scientist', charId: 'c3' },
      cryptographer: { role: 'The Cryptographer', charId: 'c4' }
    };
    const target = roleMap[roleKey] || roleMap.hacker;

    setLobby(prev => {
      if (!prev?.players) return prev;
      const updated = prev.players.map(p => {
        const isMe = (p.userId && p.userId === myId) || (myName && (p.playerName === myName || p.username === myName));
        if (isMe) {
          return { ...p, role: target.role, characterId: target.charId };
        }
        return p;
      });
      return { ...prev, players: updated };
    });

    heistAudio.playKeyClick();
  };

  const handleToggleReady = (currentReadyState) => {
    const code = lobby?.code || lobby?.roomCode;
    if (code) lobbySocket.setReady(code, !currentReadyState);
    const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
    const myName = currentUser?.username || localStorage.getItem('vault_guest_name') || 'qwerty';
    setLobby(prev => {
      if (!prev?.players) return prev;
      const updated = prev.players.map(p => {
        const isMe = (p.userId && p.userId === myId) || (myName && (p.playerName === myName || p.username === myName));
        if (isMe) {
          return { ...p, isReady: !currentReadyState };
        }
        return p;
      });
      return { ...prev, players: updated };
    });
    heistAudio.playKeyClick();
  };

  const handleKickSlot = (slotId) => {
    const code = lobby?.code || lobby?.roomCode;
    if (code) lobbySocket.kick(code, slotId);
    heistAudio.playKeyClick();
  };

  const handleStartMultiplayerHeist = () => {
    const code = lobby?.code || lobby?.roomCode;
    if (!code) {
      toast.error('No active squad room found to launch.');
      return;
    }
    lobbySocket.start(code, (res) => {
      if (res?.error) {
        toast.error(res.error);
        return;
      }
    });
  };

  const handleConfirmLeaveSquad = () => {
    localStorage.removeItem('vault_active_session');
    setRecoverySession(null);
    const code = lobby?.code || lobby?.roomCode;
    if (code) {
      lobbySocket.leave(code);
      try {
        heistSocket.leave(code);
      } catch (e) {}
    }
    if (isLobbyVoiceConnected) {
      try {
        voiceEngine.leaveRoom();
      } catch (e) {}
      setIsLobbyVoiceConnected(false);
    }
    setIsInSquadRoom(false);
    setIsLeaveSquadModalOpen(false);
    setIsDeserterWarningOpen(false);
    setIsEndHeistModalOpen(false);

    // Completely reset all heist alarms, timer, and tension audio
    setIsTimerRunning(false);
    setAlarmLevel('LOW_SECURITY');
    setAlarmFails(0);
    setTimeLeft(180);
    heistAudio.stopTension();
    exitHeistFullscreen();
    heistAudio.playKeyClick();

    // ── Loyalty Points deduction ONLY when leaving mid-heist ───────────
    const heistWasActive = (isTimerRunning && activeTab === 'liveheist') || deserterWarningIsHeistActive;
    if (heistWasActive) {
      setIsMatchVictory(false);
      setActiveTab('operations');

      const lpResult = applyLP('LEAVE_MID_HEIST');
      if (lpResult && lpResult.delta < 0) {
        const { newPoints, rank, previousRank } = lpResult;
        const rankText = rank.name !== previousRank.name
          ? ` ⬇ Rank dropped to ${rank.emoji} ${rank.name}!`
          : ` ${rank.emoji} ${rank.name} · ${newPoints} LP`;
        toast.error(`💀 MID-HEIST DESERTION: ${lpResult.delta} LP penalty.${rankText}`, { duration: 500 });
      }
      setDeserterWarningIsHeistActive(false);
    } else {
      // Leaving from squad lobby before heist: NO PENALTY!
      toast.info("Left squad lobby.");
      if (activeTab === 'liveheist' || activeTab === 'lobby') {
        setActiveTab('home');
      }
    }
  };

  // ── Open the correct leave dialog depending on heist state ─────────────
  const handleRequestLeaveSquad = () => {
    const heistActive = isTimerRunning && activeTab === 'liveheist';
    if (heistActive) {
      // Mid-heist: show dramatic Deserter Warning with penalty
      setIsEndHeistModalOpen(false);
      setDeserterWarningIsHeistActive(true);
      setIsDeserterWarningOpen(true);
    } else {
      // Squad Lobby: standard confirmation modal with NO penalty
      setIsLeaveSquadModalOpen(true);
    }
  };

  const handleSendLobbyRadio = (e) => {
    e?.preventDefault?.();
    if (!lobbyRadioInput.trim()) return;
    const roomCode = lobby.roomCode || lobby.code;
    if (!roomCode) {
      toast.error("No active squad room found. Join or create a squad before broadcasting.");
      return;
    }
    const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
    const mySlot = lobby?.players?.find(p => p.userId === myId);
    const myRole = mySlot?.role ? normalizeRoleKey(mySlot.role) : 'hacker';

    lobbySocket.sendRadioMessage(roomCode, lobbyRadioInput.trim(), myRole);
    setLobbyRadioInput('');
    heistAudio.playRadioSquelch();
  };

  const handleSendLobbyQuickMacro = (text) => {
    if (!text || !text.trim()) return;
    const roomCode = lobby.roomCode || lobby.code;
    if (!roomCode) {
      toast.error("No active squad room found. Join or create a squad before broadcasting.");
      return;
    }
    const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
    const mySlot = lobby?.players?.find(p => p.userId === myId);
    const myRole = mySlot?.role ? normalizeRoleKey(mySlot.role) : 'hacker';

    lobbySocket.sendRadioMessage(roomCode, text.trim(), myRole);
    heistAudio.playRadioSquelch();
  };

  // ─────────────────────────────────────────────────────────────
  // In-Game Heist Handlers
  // ─────────────────────────────────────────────────────────────

  const handleLaunchToLobby = (stageIdx = 0, customTitle = null) => {
    const title = customTitle || allStages[stageIdx]?.title || 'Operation';
    if (!isInSquadRoom) {
      handleCreateNewRoom(title);
    } else {
      toast.info(`Squad ready. Launch when everyone is positioned in the lobby.`);
    }
    setActiveTab('lobby');
  };

  const handleStartHeistStage = (stageIdx = 0, isInitiator = true, overrideRole = null, incomingAttemptSeed = null, targetRoomCode = null) => {
    setCurrentStageIdx(stageIdx);
    const sessionRoomCode = targetRoomCode || lobby?.code || lobby?.roomCode;
    if (sessionRoomCode && (lobby?.players?.length > 1 || lobby?.status === 'active')) {
      triggerAchievementCheck('HEIST_LAUNCH', { isCoop: true });
    }
    const stage = allStages[stageIdx] || heistStages[0];
    const activeRoles = stage.selectedRoles 
      ? Object.keys(stage.selectedRoles).filter(k => stage.selectedRoles[k])
      : ['hacker', 'engineer', 'scientist', 'cryptographer'];
    const chosenRole = overrideRole || activeCockpitRole || activeRoles[0] || 'hacker';
    const myPerks = currentUser?.unlockedPerks || [];

    // A fresh attempt seed means a genuinely new heist launch — reuse the
    // existing one for stage-to-stage progression within the same session,
    // so a full run doesn't reshuffle puzzles mid-heist.
    const attemptSeed = incomingAttemptSeed || heistAttemptSeed || String(Date.now());
    if (attemptSeed !== heistAttemptSeed) setHeistAttemptSeed(attemptSeed);

    // Pick a puzzle set from the pool, deterministically, so every client
    // in the same room computes the identical selection without needing
    // any puzzle data to be transmitted over the socket.
    const puzzleSet = getPuzzleSetForHeist(sessionRoomCode || lobby?.code, stageIdx, attemptSeed);
    setActivePuzzleOverrides(puzzleSet);

    // ── Reset all per-heist state so the previous run's data is never visible ──
    setStageSolvedRoles({ 1: {}, 2: {}, 3: {}, 99: {} });
    setStageRoleClues({ 1: {}, 2: {}, 3: {}, 99: {} });
    setRoleFailCounts({});
    setIsExtractionActive(false);
    setRadioMessages([
      { sender: "Sylvan HQ", role: "hq", text: "Expedition crew deployed. Interlock sequence initialized. Coordinate all 4 roles!", time: "00:01" },
      { sender: "Scientist Cleo", role: "scientist", text: "Analyzing compound stoichiometry now. Will transmit optical density to Engineer.", time: "00:04" }
    ]);

    // Apply role perk effects for the role the player is actually about
    // to play this stage as.
    const timerBonus = (chosenRole === 'hacker' && myPerks.includes('hacker_quick_fingers')) ? 10 : 0;
    setTimeLeft((stage.timeLimit || 180) + timerBonus);
    setIsTimerRunning(true);
    setAlarmLevel('LOW_SECURITY');
    setAlarmFails(0);
    setComboStreak((chosenRole === 'cryptographer' && myPerks.includes('cryptographer_head_start')) ? 1 : 0);
    setMaxCombo(0);
    setEngineerAlarmForgiven(chosenRole === 'engineer' && myPerks.includes('engineer_reinforced_rig'));

    setActiveCockpitRole(chosenRole);
    setActiveTab('liveheist');
    enterHeistFullscreen();
    heistAudio.startTensionBeat('LOW_SECURITY');
    heistAudio.playRadioSquelch();

    // Save active heist session for recovery if page is refreshed
    if (sessionRoomCode) {
      localStorage.setItem('vault_active_session', JSON.stringify({
        roomCode: sessionRoomCode,
        role: chosenRole,
        stageIdx,
        timestamp: Date.now()
      }));
    }

    try {
      if (sessionRoomCode) {
        heistSocket.joinRoom(sessionRoomCode);
        if (isInitiator) {
          heistSocket.start(sessionRoomCode, stageIdx, stage.timeLimit || 180, puzzleSet, stage.selectedRoles);
        }
      }
    } catch (e) {
      console.warn('[SOCKET] Heist start fallback');
    }
  };

  useEffect(() => {
    window.__VAULT_START_HEIST__ = (idx = 0) => handleStartHeistStage(idx);
  }, [allStages]);


  const handleLaunchCustomHeist = (customStage) => {
    const stageIdx = allStages.length;
    setAllStages(prev => [...prev, customStage]);
    setCurrentStageIdx(stageIdx);
    setTimeLeft(customStage.timeLimit || 180);
    setIsTimerRunning(true);
    setAlarmLevel('LOW_SECURITY');
    setAlarmFails(0);
    const activeRoles = Object.keys(customStage.selectedRoles || {}).filter(k => customStage.selectedRoles[k]);
    setActiveCockpitRole(activeRoles[0] || 'hacker');
    setActiveTab('liveheist');
    enterHeistFullscreen();
    heistAudio.startTensionBeat('LOW_SECURITY');
    heistAudio.playRadioSquelch();

    // Save active heist session for custom heist recovery
    const customSessionCode = lobby?.code || lobby?.roomCode;
    if (customSessionCode) {
      localStorage.setItem('vault_active_session', JSON.stringify({
        roomCode: customSessionCode,
        role: activeRoles[0] || 'hacker',
        stageIdx,
        timestamp: Date.now()
      }));
    }

    try {
      heistSocket.joinRoom(lobby.code);
      heistSocket.start(lobby.code, stageIdx, customStage.timeLimit || 180, customStage.puzzles, customStage.selectedRoles);
    } catch (e) { /* socket fallback */ }
  };

  const handleSaveCustomHeist = (customStage) => {
    const newMission = {
      id: `custom-${Math.random().toString(36).substring(2, 9)}`,
      title: customStage.title,
      category: customStage.subtitle?.split('•')[0]?.trim() || 'Custom Operation',
      difficulty: customStage.subtitle?.split('•')[1]?.trim() || 'Medium',
      reward: '8,000 XP & Custom Master Token',
      description: customStage.description,
      roomsCount: Object.values(customStage.selectedRoles || {}).filter(Boolean).length,
      image: FALLBACK_SUBJECT_IMG,
      featured: true,
      customStageData: customStage,
      rooms: []
    };

    setMissions(prev => [newMission, ...prev]);
    setAllStages(prev => [...prev, customStage]);
    triggerAchievementCheck('BLUEPRINT_SAVED');
    heistAudio.playSuccessChime();
    toast.success(`💾 Custom Heist '${customStage.title}' saved to Expeditions!`);
  };

  const handleHeistTimeout = () => {
    localStorage.removeItem('vault_active_session');
    setRecoverySession(null);
    setIsTimerRunning(false);
    setAlarmLevel('BUSTED');
    heistAudio.stopTension();
    heistAudio.playAlarmSiren();
    exitHeistFullscreen();
    setIsMatchVictory(false);
    
    const consolationXp = 200; // 50 XP per discipline
    setLastEarnedXp(consolationXp);
    const nextStandaloneXp = (typeof xp === 'number' ? xp : 1200) + consolationXp;
    setXp(nextStandaloneXp);
    try {
      localStorage.setItem('kh_xp_sylvan', nextStandaloneXp.toString());
    } catch {}

    if (currentUser) {
      const stage = allStages[currentStageIdx] || heistStages[0];
      const roleLabel = activeCockpitRole === 'hacker' ? 'Canopy Hacker' : activeCockpitRole === 'engineer' ? 'Woodland Engineer' : activeCockpitRole === 'scientist' ? 'Flora Scientist' : 'Mist Cryptographer';
      const newRecord = {
        id: `h-${Date.now()}`,
        mission: stage.title || 'Infiltration Op',
        role: roleLabel,
        result: 'LOCKDOWN',
        xp: `+${consolationXp} XP`,
        time: '3m 00s',
        date: 'Just now'
      };
      const updatedXp = (currentUser.xp || 0) + consolationXp;
      const updatedLevel = calculateLevel(updatedXp);
      const optimisticUser = {
        ...currentUser,
        xp: updatedXp,
        level: updatedLevel,
        stats: {
          ...currentUser.stats,
          missionsCompleted: (currentUser.stats?.missionsCompleted || 0) + 1,
          alarmsTripped: (currentUser.stats?.alarmsTripped || 0) + alarmFails + 1
        },
        history: [newRecord, ...(currentUser.history || [])]
      };
      setCurrentUser(optimisticUser);
      try {
        localStorage.setItem('vault_current_user', JSON.stringify(optimisticUser));
      } catch {}
      window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: optimisticUser }));

      heistAPI.completeHeist({
        mission_title: stage.title || 'Infiltration Op',
        role: activeCockpitRole || 'hacker',
        result: 'LOCKDOWN',
        xp_earned: consolationXp,
        time_elapsed: '3m 00s',
        accuracy: '42%',
        alarms_tripped: alarmFails + 1,
        vaults_cracked: 0
      }).then((res) => {
        if (res?.user) {
          setCurrentUser(prev => {
            const reconciled = { ...prev, ...res.user, history: prev?.history || optimisticUser.history };
            try {
              localStorage.setItem('vault_current_user', JSON.stringify(reconciled));
            } catch {}
            return reconciled;
          });
          window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: res.user }));
        }
      }).catch((err) => {
        console.warn('[HEIST] Note: Server completeHeist offline or unauthenticated:', err.message);
      });
    }

    setAnalyticsStats({
      hackerXp: 50,
      engineerXp: 50,
      scientistXp: 50,
      cryptoXp: 50,
      timeElapsed: "EXPIRED (3m 00s)",
      accuracy: "42%",
      alarmsTripped: alarmFails + 1
    });
    setAnalyticsModalOpen(true);
    toast.error("🚨 FACILITY LOCKDOWN TRIPPED! Time limit expired.");
  };

  const handleRolePuzzleSolved = (role, clue) => {
    const stage = allStages[currentStageIdx] || heistStages[0];
    const stageId = stage.stageId;

    // Puzzle-solved celebration: brief screen shake + particle burst,
    // and bump the combo streak (rewards consecutive solves without a miss).
    if (screenShakeEnabled && !(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);
    }
    setBurstTrigger(prev => prev + 1);
    setComboStreak(prev => {
      const next = prev + 1;
      setMaxCombo(m => Math.max(m, next));
      return next;
    });

    setStageSolvedRoles(prev => {
      const current = { ...(prev[stageId] || {}) };
      current[role] = true;
      return { ...prev, [stageId]: current };
    });

    setStageRoleClues(prev => {
      const current = { ...(prev[stageId] || {}) };
      current[role] = clue;
      return { ...prev, [stageId]: current };
    });

    triggerAchievementCheck('ROLE_SOLVED', {
      role,
      solvedRoles: Object.keys(stageSolvedRoles[stageId] || {}).concat(role)
    });

    const roleNames = {
      scientist: "Scientist Rostova",
      engineer: "Engineer Chen",
      hacker: "Hacker Vance",
      cryptographer: "Operator Lin"
    };

    const solverName = currentUser?.username || localStorage.getItem('vault_guest_name') || roleNames[role] || role.toUpperCase();
    const timeStr = `${Math.floor((180 - timeLeft) / 60)}:${((180 - timeLeft) % 60).toString().padStart(2, '0')}`;
    const newMsg = {
      sender: solverName,
      role: role,
      text: `[PASSED] ${clue} — Transmitting across interdependence pipeline!`,
      time: timeStr
    };
    setRadioMessages(prev => [...prev, newMsg]);

    // Play success chime for audio feedback — XP is awarded only on full heist completion
    heistAudio.playSuccessChime();



    const activeRoomCode = lobby?.code || lobby?.roomCode || (typeof recoverySession?.roomCode === 'string' ? recoverySession.roomCode : null);
    if (activeRoomCode) {
      try {
        heistSocket.puzzleSolved(activeRoomCode, role, clue, solverName);
      } catch (e) { /* socket broadcast */ }
    }

    const activeRoles = stage.selectedRoles 
      ? Object.keys(stage.selectedRoles).filter(k => stage.selectedRoles[k])
      : ['hacker', 'engineer', 'scientist', 'cryptographer'];
    const nextSolved = { ...(stageSolvedRoles[stageId] || {}), [role]: true };
    const allRoleSolved = activeRoles.every(r => nextSolved[r]);
    if (allRoleSolved) {
      setIsExtractionActive(true);
      heistAudio.playRadioSquelch();
      if (activeRoomCode) {
        try { heistSocket.startExtraction(activeRoomCode); } catch (e) {}
      }
    }
  };

  const handleRolePuzzleFailed = (role, reason) => {
    setComboStreak(0);
    setTimeLeft(prev => Math.max(5, prev - 12));

    // Track per-role fail count so we can surface micro-hints on 2nd+ failure
    const newRoleFailCount = (roleFailCounts[role] || 0) + 1;
    setRoleFailCounts(prev => ({ ...prev, [role]: newRoleFailCount }));

    // Engineer's "Reinforced Rig" perk forgives their own first alarm trip
    // this heist — the wrong answer still costs time (above), but doesn't
    // count toward the alarm total or escalate the lockdown level.
    const isForgivenTrip = role === 'engineer' && role === activeCockpitRole && engineerAlarmForgiven;
    if (isForgivenTrip) {
      setEngineerAlarmForgiven(false);
      toast.info('🛡️ Reinforced Rig absorbed that alarm trip.');
    }

    const newFails = isForgivenTrip ? alarmFails : alarmFails + 1;
    if (!isForgivenTrip) {
      setAlarmFails(newFails);

      let nextAlert = 'LOW_SECURITY';
      if (newFails >= 4) {
        nextAlert = 'HIGH_LOCKDOWN';
        heistAudio.startTensionBeat('HIGH_LOCKDOWN');
      } else if (newFails >= 2) {
        nextAlert = 'MEDIUM_ALERT';
        heistAudio.startTensionBeat('MEDIUM_ALERT');
      }
      setAlarmLevel(nextAlert);
    }

    // ── Micro-hint flash on 2nd+ failure for this role ──────────────────────
    // Pull the first core concept for this role from remediationData and
    // surface its keyTakeaway as a brief educational toast.
    if (newRoleFailCount >= 2) {
      try {
        const plan = generateRemediationPlan([role]);
        const roleConcepts = plan?.find?.(p => p.role === role)?.concepts
          || plan?.[0]?.concepts
          || [];
        const firstConcept = roleConcepts[0];
        if (firstConcept?.keyTakeaway) {
          const hintLabel = {
            hacker: '💻 Hacker Hint',
            engineer: '⚙️ Engineer Hint',
            scientist: '🧪 Scientist Hint',
            cryptographer: '📜 Cryptographer Hint',
          }[role] || '💡 Hint';
          toast(
            `${hintLabel}: ${firstConcept.title} — ${firstConcept.keyTakeaway}`,
            { duration: 500, icon: '🔍' }
          );
        }
      } catch (_) { /* remediation data unavailable */ }
    }

    const failerName = currentUser?.username || localStorage.getItem('vault_guest_name') || 'Specialist';
    const activeRoomCode = lobby?.code || lobby?.roomCode || (typeof recoverySession?.roomCode === 'string' ? recoverySession.roomCode : null);
    if (activeRoomCode) {
      try {
        heistSocket.puzzleFailed(activeRoomCode, role, reason, failerName);
      } catch (e) { /* socket broadcast */ }
    }

    const timeStr = `${Math.floor((180 - timeLeft) / 60)}:${((180 - timeLeft) % 60).toString().padStart(2, '0')}`;
    setRadioMessages(prev => [
      ...prev,
      {
        sender: "SECURITY SYSTEM",
        role: "alert",
        text: isForgivenTrip
          ? `[ALARM FORGIVEN] ${role.toUpperCase()} misfire by ${failerName} absorbed by Reinforced Rig (-12s Penalty)`
          : `[ALARM +1] ${role.toUpperCase()} trigger fail by ${failerName}: "${reason}" (-12s Penalty)`,
        time: timeStr
      }
    ]);

    if (!isForgivenTrip) {
      heistAudio.playAlarmChime();
      toast.error(`🚨 ALARM ESCALATED! ${role.toUpperCase()} misfire!`);
    }

    if (newFails >= 6) {
      handleHeistTimeout();
    }
  };

  const handleStageVictory = () => {
    localStorage.removeItem('vault_active_session');
    setRecoverySession(null);
    setIsTimerRunning(false);
    heistAudio.stopTension();
    heistAudio.playSuccessChime();
    exitHeistFullscreen();

    const stage = allStages[currentStageIdx] || heistStages[0];
    const totalTimeSpent = (stage.timeLimit || 180) - timeLeft;
    const timeStr = `${Math.floor(totalTimeSpent / 60)}m ${(totalTimeSpent % 60)}s`;

    const comboBonus = maxCombo >= 2 ? maxCombo * 25 : 0;
    const scientistPerkBonus = (activeCockpitRole === 'scientist' && (currentUser?.unlockedPerks || []).includes('scientist_steady_hands')) ? 50 : 0;
    
    const hackerXp = 350 + (currentStageIdx + 1) * 50;
    const engineerXp = 350 + (currentStageIdx + 1) * 50;
    const scientistXp = 350 + (currentStageIdx + 1) * 50 + scientistPerkBonus;
    const cryptoXp = 350 + (currentStageIdx + 1) * 50;
    const totalXpGain = hackerXp + engineerXp + scientistXp + cryptoXp + comboBonus;
    setLastEarnedXp(totalXpGain);

    // Update standalone xp state and persist to local storage for guests
    const nextStandaloneXp = (typeof xp === 'number' ? xp : 1200) + totalXpGain;
    setXp(nextStandaloneXp);
    try {
      localStorage.setItem('kh_xp_sylvan', nextStandaloneXp.toString());
      const nextStreak = (typeof streak === 'number' ? streak : 0) + 1;
      setStreak(nextStreak);
      localStorage.setItem('kh_streak_sylvan', nextStreak.toString());
    } catch {}

    // XP flyout animation into the top-bar ring
    setXpFlyout({ amount: totalXpGain, id: Date.now() });
    setTimeout(() => {
      setXpFlyout(null);
    }, 2800);

    // Update currentUser (the logged-in user's total XP, level, stats, and history)
    if (currentUser) {
      const roleLabel = activeCockpitRole === 'hacker' ? 'Canopy Hacker' : activeCockpitRole === 'engineer' ? 'Woodland Engineer' : activeCockpitRole === 'scientist' ? 'Flora Scientist' : 'Mist Cryptographer';
      const newRecord = {
        id: `h-${Date.now()}`,
        mission: stage.title || 'Infiltration Op',
        role: roleLabel,
        result: 'VICTORY',
        xp: `+${totalXpGain} XP`,
        time: timeStr,
        date: 'Just now'
      };
      const activeRolesCount = stage.selectedRoles 
        ? Object.keys(stage.selectedRoles).filter(k => stage.selectedRoles[k]).length 
        : 4;
      const updatedXp = (currentUser.xp || 0) + totalXpGain;
      const updatedLevel = calculateLevel(updatedXp);
      const optimisticUser = {
        ...currentUser,
        xp: updatedXp,
        level: updatedLevel,
        stats: {
          ...currentUser.stats,
          missionsCompleted: (currentUser.stats?.missionsCompleted || 0) + 1,
          vaultsCracked: (currentUser.stats?.vaultsCracked || 0) + activeRolesCount,
          alarmsTripped: (currentUser.stats?.alarmsTripped || 0) + alarmFails
        },
        history: [newRecord, ...(currentUser.history || [])]
      };
      setCurrentUser(optimisticUser);
      try {
        localStorage.setItem('vault_current_user', JSON.stringify(optimisticUser));
      } catch {}
      window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: optimisticUser }));

      triggerAchievementCheck('HEIST_COMPLETE', {
        timeTaken: totalTimeSpent,
        alarmsTripped: alarmFails,
        isCoop: Boolean(lobby?.code && lobby?.players?.length > 1)
      });

      // Persist to server database
      heistAPI.completeHeist({
        mission_title: stage.title || 'Infiltration Op',
        role: activeCockpitRole || 'hacker',
        result: 'VICTORY',
        xp_earned: totalXpGain,
        time_elapsed: timeStr,
        accuracy: alarmFails === 0 ? "100%" : `${Math.max(65, 100 - alarmFails * 8)}%`,
        alarms_tripped: alarmFails,
        vaults_cracked: activeRolesCount
      }).then((res) => {
        if (res?.user) {
          setCurrentUser(prev => {
            const reconciled = { ...prev, ...res.user, history: prev?.history || optimisticUser.history };
            try {
              localStorage.setItem('vault_current_user', JSON.stringify(reconciled));
            } catch {}
            return reconciled;
          });
          window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: res.user }));
        }
      }).catch((err) => {
        console.warn('[HEIST] Note: Server completeHeist offline or unauthenticated:', err.message);
      });
    }

    // IMPORTANT: capture prevTotal from current closure BEFORE any state update
    // so the XP animation in SkillAnalyticsModal animates from old → new.
    const prevTotal = (currentUser?.xp ?? xp ?? 1200);
    const newTotal = prevTotal + totalXpGain;

    setIsMatchVictory(true);
    setAnalyticsStats({
      hackerXp,
      engineerXp,
      scientistXp,
      cryptoXp,
      timeElapsed: timeStr,
      accuracy: alarmFails === 0 ? "100%" : `${Math.max(65, 100 - alarmFails * 8)}%`,
      alarmsTripped: alarmFails,
      comboBonus,
      maxCombo,
      totalXpGain,
      prevTotalXp: prevTotal,
      newTotalXp: newTotal
    });
    // Increment key to force full remount of SkillAnalyticsModal every time,
    // which resets all internal useState values and ensures animation plays fresh.
    setAnalyticsKey(k => k + 1);
    setAnalyticsModalOpen(true);
  };

  const handleSimulateBotTeammates = () => {
    const stage = allStages[currentStageIdx] || heistStages[0];
    const stageId = stage.stageId;
    const allRoles = ['scientist', 'engineer', 'hacker', 'cryptographer'];
    const activeRoles = stage.selectedRoles 
      ? allRoles.filter(r => stage.selectedRoles[r])
      : allRoles;
    const currentSolved = stageSolvedRoles[stageId] || {};
    const unsolved = activeRoles.filter(r => !currentSolved[r] && r !== activeCockpitRole);

    if (unsolved.length === 0) {
      toast.info("All bot squad roles are already solved for this stage!");
      return;
    }

    const botRole = unsolved[0];
    const puzzle = stage.puzzles[botRole];
    handleRolePuzzleSolved(botRole, puzzle.clueRevealed);
    toast.success(`🤖 Bot Specialist solved ${botRole.toUpperCase()} task!`);
  };

  const handleSendMessage = (text, role) => {
    const timeStr = `${Math.floor((180 - timeLeft) / 60)}:${((180 - timeLeft) % 60).toString().padStart(2, '0')}`;
    const senderName = currentUser?.username || localStorage.getItem('vault_guest_name') || `You (${role.toUpperCase()})`;
    const code = lobby?.code || lobby?.roomCode;

    if (code) {
      try {
        heistSocket.sendRadioMessage(code, text, role, senderName);
      } catch (e) {
        const newMsg = { sender: senderName, role, text, time: timeStr };
        setRadioMessages(prev => [...prev, newMsg]);
      }
    } else {
      const newMsg = { sender: senderName, role, text, time: timeStr };
      setRadioMessages(prev => [...prev, newMsg]);
    }
    triggerAchievementCheck('COMMS_SENT');
  };

  const handleClaimSlot = (slotId) => {
    setTargetSlotId(slotId);
    setIsJoinModalOpen(true);
    heistAudio.playKeyClick();
  };

  const handleJoinLobbySubmit = (e) => {
    e.preventDefault();
    if (!joinPlayerName.trim()) {
      toast.error("Please enter your operative codename!");
      return;
    }

    const mappedRole = normalizeRoleKey(joinRole);

    lobbySocket.join(lobby.code, mappedRole, joinCharacterId, joinPlayerName.trim(), (res) => {
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.lobby) {
        setLobby(res.lobby);
      }
      toast.success(`🌿 Welcome to the squad, ${joinPlayerName}! Slot confirmed.`);
    });

    setIsJoinModalOpen(false);
    setJoinPlayerName('');
    heistAudio.playSuccessChime();
  };

  const handleSaveCustomMission = (e) => {
    e.preventDefault();
    if (!builder.title || !builder.description || !builder.question) {
      toast.error("Please fill in all mission and puzzle fields!");
      return;
    }

    setBuilderSaving(true);
    setTimeout(() => {
      const newMission = {
        id: `custom-${Math.random().toString(36).substring(2, 9)}`,
        title: builder.title,
        category: builder.category,
        difficulty: builder.difficulty,
        reward: builder.reward,
        description: builder.description,
        roomsCount: 1,
        image: FALLBACK_SUBJECT_IMG,
        featured: false,
        rooms: [
          {
            id: 1,
            title: "Custom Security Gate",
            question: builder.question,
            options: [builder.answer || "Correct Solution", "Alternative Decoy A", "Alternative Decoy B", "Alternative Decoy C"],
            correct: 0
          }
        ]
      };

      setMissions([newMission, ...missions]);
      setBuilderSaving(false);
      setBuilder({
        title: '',
        category: 'Forest Botany & Lore',
        difficulty: 'Medium',
        reward: '5,000 XP & Leaf Star',
        description: '',
        question: '',
        answer: ''
      });
      heistAudio.playSuccessChime();
      toast.success("🌳 Custom Sylvan Heist Blueprint Published to Expeditions!");
      setActiveTab('missions');
    }, 600);
  };

  // Only registered users get a unique Agent ID
  const currentAgentId = currentUser?.agentId || (
    currentUser?.id 
      ? `VAULT-${String(currentUser.id).replace(/-/g, '').substring(0, 8).toUpperCase()}`
      : null
  );

  const currentStageData = (allStages && allStages[currentStageIdx]) || heistStages[0] || {};
  const stageId = currentStageData.stageId || 1;
  const currentStageSolved = (stageSolvedRoles && stageSolvedRoles[stageId]) || {};
  const currentStageClues = (stageRoleClues && stageRoleClues[stageId]) || {};
  const currentStagePuzzles = activePuzzleOverrides || currentStageData.puzzles || heistStages[0].puzzles || {};

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen bg-[#06120E] text-[#CFE8DC] selection:bg-[#10B981] selection:text-[#02140D] font-sans antialiased">


      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {bgVideoActive ? (
          <video
            ref={setVideoNode}
            key={selectedBgVideo}
            autoPlay
            loop
            muted
            defaultMuted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            onCanPlay={() => setIsVideoPlaying(true)}
            onPlaying={() => setIsVideoPlaying(true)}
            className={`w-full h-full object-cover scale-105 transition-opacity duration-1000 ${
              isVideoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              filter: 'brightness(1.85) saturate(1.22) contrast(1.02)'
            }}
          >
            <source src={selectedBgVideo === 'cyber' ? bgNewVideo : natureVideo} type="video/mp4" />
            <source src={selectedBgVideo === 'cyber' ? '/backgroundnew.mp4' : '/nature.mp4'} type="video/mp4" />
            <source src={selectedBgVideo === 'cyber' ? './backgroundnew.mp4' : './nature.mp4'} type="video/mp4" />
          </video>
        ) : null}

        {/* Ambient Emerald Gradient (displayed while video buffers or when video is toggled off) */}
        <div 
          className={`absolute inset-0 w-full h-full bg-[#06120E] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A5C43] via-[#0E3526] to-[#081E15] transition-opacity duration-1000 pointer-events-none ${
            isVideoPlaying && bgVideoActive ? 'opacity-0' : 'opacity-100'
          }`} 
        />

        {/* Translucent Tint Overlay: Ultra-light tint (10%) allowing high ambient video brightness */}
        <div 
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            backgroundColor: 'rgba(4, 14, 10, 0.10)',
            backdropFilter: 'blur(0.5px)'
          }}
        />

        {/* 1. Cinematic Vignette: Ultra-subtle edge darkening only, center fully luminous */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(ellipse at 50% 35%, rgba(6, 28, 20, 0.0) 0%, rgba(4, 16, 11, 0.20) 65%, rgba(2, 8, 5, 0.48) 100%)'
          }}
        />

        {/* 6. Calming lower-section gradient: deepens down the page to keep stats & leaderboard clear */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 28%, rgba(6, 18, 14, 0.65) 50%, #06120E 80%, #06120E 100%)'
          }}
        />

        {/* 2. Drifting fireflies and ambient luminous particle field over background */}
        <FireflyField />

        {activeTab === 'liveheist' && alarmLevel === 'HIGH_LOCKDOWN' && (
          <div className="absolute inset-0 bg-red-900/25 pointer-events-none animate-pulse" />
        )}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* PWA & Mobile Optimized Top-Center Toast Stack */}
        <Toaster 
          position="top-center" 
          richColors 
          theme="dark" 
          closeButton={false}
          duration={500}
          toastOptions={{ 
            duration: 500,
            closeButton: false,
            className: 'max-w-md w-[92vw] sm:w-full mt-safe shadow-2xl font-mono text-xs border border-emerald-500/30' 
          }} 
        />

        <header className="sticky top-0 z-50 bg-[#051A12]/92 backdrop-blur-2xl border-b border-emerald-500/25 px-3 sm:px-6 py-2 sm:py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_-1px_0_rgba(255,255,255,0.06)] transition-all">
          <div className="w-full flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto min-h-[38px] sm:min-h-[42px]">
            
            {/* ── Left Cluster: Clean Brand Logo (Back and Home removed as covered by sidebar) ── */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
              <div 
                className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer group flex-shrink-0 select-none" 
                onClick={() => {
                  navigateToTab('home');
                  heistAudio.playKeyClick();
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              >
                <div className="relative flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#14A9CC]/15 blur-sm scale-90 group-hover:scale-110 group-hover:bg-[#14A9CC]/30 transition-all duration-300 pointer-events-none" />
                  <img 
                    src="/favicon.svg" 
                    alt="VAULT" 
                    className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(20,169,204,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(20,169,204,0.7)] group-hover:scale-105 transition-all duration-300" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm sm:text-lg font-black tracking-widest uppercase font-mono bg-[#F59E0B] text-[#02140D] px-2 py-0.5 border-2 border-[#03140C] rounded-lg shadow-[2px_2px_0px_#020C07]">
                      V.A.U.L.T
                    </span>
                    <span className="hidden sm:inline-block bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-bold px-1.5 py-0.5 border border-[#10B981]/40 rounded-full uppercase tracking-wider">
                      CO-OP
                    </span>
                  </div>
                  <span className="hidden xl:block text-[9px] font-medium text-[#6EE7B7]/80 tracking-wide mt-0.5">
                    VIRTUAL ACADEMIC UNDERGROUND LEARNING TEAM
                  </span>
                </div>
              </div>
            </div>

            {/* ── Center Cluster: Mobile Context HUD (Live Heist Timer or Active Room) ── */}
            {activeTab === 'liveheist' ? (
              <div className="flex items-center space-x-1 sm:space-x-2 bg-[#020F08]/90 border border-emerald-500/40 px-2.5 py-1 rounded-lg shadow-inner font-mono flex-shrink-0">
                <Clock className={`w-3.5 h-3.5 ${
                  timeLeft <= 30 ? 'text-red-400 animate-pulse' : timeLeft <= 60 ? 'text-amber-400' : 'text-emerald-400'
                }`} />
                <span className={`font-black text-xs sm:text-sm tracking-wider ${
                  timeLeft <= 30 ? 'text-red-400 animate-pulse' : timeLeft <= 60 ? 'text-amber-300' : 'text-emerald-300'
                }`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className={`hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                  alarmLevel === 'HIGH_LOCKDOWN' 
                    ? 'bg-red-950/80 text-red-300 border-red-500 animate-pulse' 
                    : alarmLevel === 'MEDIUM_ALERT'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500'
                    : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                }`}>
                  {alarmLevel === 'HIGH_LOCKDOWN' ? 'LOCKDOWN' : alarmLevel === 'MEDIUM_ALERT' ? 'ALERT' : 'STEALTH'}
                </span>
              </div>
            ) : (activeTab === 'lobby' && isInSquadRoom && (lobby?.code || lobby?.roomCode)) ? (
              <div className="hidden xs:flex items-center space-x-1 bg-[#020F08]/90 border border-emerald-500/30 px-2 py-1 rounded-lg font-mono text-[10px] text-emerald-400 flex-shrink-0">
                <span className="text-slate-400">ROOM:</span>
                <span className="font-bold text-amber-300">#{lobby?.code || lobby?.roomCode}</span>
              </div>
            ) : null}

            {/* ── Right Cluster: Heist Abort, Sound, Operative Dossier, Auth ── */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
              
              {/* Emergency End Heist Button (During Live Heist) */}
              {activeTab === 'liveheist' && (
                <button
                  onClick={() => setIsEndHeistModalOpen(true)}
                  className="bg-[#EF4444] text-white font-mono font-black text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-lg border-2 border-[#03140C] shadow-[2px_2px_0px_#020C07] hover:bg-red-500 active:scale-95 transition-all flex items-center space-x-1 uppercase touch-manipulation flex-shrink-0"
                  title="Conclude or Abort this operation"
                  aria-label="End Heist"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">END HEIST</span>
                  <span className="sm:hidden text-[10px]">END</span>
                </button>
              )}

              {/* Desktop Find Agent Button */}
              {currentUser && (
                <button 
                  onClick={() => {
                    setIsAgentDirectoryOpen(true);
                    heistAudio.playKeyClick();
                  }}
                  className="hidden md:flex items-center space-x-1.5 h-9 px-3 py-1.5 border-2 border-[#03140C] bg-[#0A2D1F] text-[#10B981] hover:bg-[#10B981] hover:text-[#02140D] font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#020C07] active:scale-95 transition-all rounded-lg touch-manipulation flex-shrink-0"
                  title="Search and identify syndicate operatives by unique Agent ID"
                >
                  <Users className="w-4 h-4 stroke-[2.5]" />
                  <span>FIND AGENT</span>
                </button>
              )}

              {/* Sound Toggle: Tactile and Compact */}
              <button
                onClick={() => {
                  setSoundEnabled(prev => !prev);
                  heistAudio.playKeyClick();
                }}
                className={`w-8 h-8 sm:w-9 sm:h-9 p-1 rounded-lg border-2 border-[#03140C] shadow-[2px_2px_0px_#020C07] transition-all flex items-center justify-center active:scale-95 touch-manipulation flex-shrink-0 ${
                  soundEnabled
                    ? 'bg-[#0A2D1F] text-[#10B981] hover:bg-[#10B981] hover:text-[#02140D]'
                    : 'bg-red-950/80 text-red-400 border-red-800 hover:bg-red-900/80'
                }`}
                title={soundEnabled ? "Sound FX Enabled (Click to Mute)" : "Sound FX Muted (Click to Unmute)"}
                aria-label="Sound Toggle"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 stroke-[2.5]" /> : <VolumeX className="w-4 h-4 stroke-[2.5]" />}
              </button>

              {currentUser ? (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {/* Operative Dossier & XP Button */}
                  <button
                    onClick={() => {
                      navigateToTab('stats');
                      heistAudio.playKeyClick();
                    }}
                    className={`relative flex items-center space-x-1 sm:space-x-1.5 h-8 sm:h-9 px-1.5 sm:px-2.5 py-0.5 border-2 border-[#03140C] font-mono shadow-[2px_2px_0px_#020C07] transition-all rounded-lg touch-manipulation flex-shrink-0 ${
                      activeTab === 'stats' 
                        ? 'bg-[#10B981] text-[#02140D] shadow-[2px_2px_0px_#F59E0B]' 
                        : 'bg-[#0A261B] text-[#F0FDF4] hover:bg-[#10B981]/20'
                    }`}
                    title={`View ${currentUser?.callsign || currentUser?.username || 'Operative'}'s Operative Dossier`}
                    aria-label="Operative Dossier"
                  >
                    <img 
                      src={currentUser?.avatar || FALLBACK_AVATAR_IMG} 
                      alt={currentUser?.callsign || currentUser?.username || 'Operative'} 
                      className="w-5 h-5 object-cover border border-[#03140C] rounded-sm flex-shrink-0" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_AVATAR_IMG;
                      }}
                    />
                    <div className="relative">
                      <XPRing level={currentUser?.level || 1} xp={currentUser?.xp || 0} size={20} color={activeTab === 'stats' ? '#F59E0B' : '#10B981'} />
                      <AnimatePresence>
                        {xpFlyout && (
                          <motion.div
                            key={xpFlyout.id}
                            initial={{ opacity: 0, y: 10, scale: 0.6 }}
                            animate={{ opacity: 1, y: -26, scale: 1.15 }}
                            exit={{ opacity: 0, y: -45, scale: 0.8 }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-[#F59E0B] text-[#02140D] font-black font-game text-[10px] px-2 py-0.5 rounded-full border border-white/25 shadow-lg whitespace-nowrap flex items-center space-x-1"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-[#02140D]" />
                            <span>+{xpFlyout.amount} XP</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="text-left hidden md:block leading-tight">
                      <span className="text-[11px] font-black uppercase block truncate max-w-[85px]">{currentUser?.callsign || currentUser?.username || 'OPERATIVE'}</span>
                    </div>
                  </button>

                  {/* Desktop Custom Heist Button */}
                  <button
                    onClick={() => {
                      setIsCustomHeistModalOpen(true);
                      heistAudio.playKeyClick();
                    }}
                    className="hidden lg:flex bg-[#0A2D1F] hover:bg-[#10B981]/25 text-[#10B981] font-bold h-9 px-3 py-1.5 border border-[#34D399]/40 hover:border-[#34D399] shadow-sm active:translate-y-0.5 transition-all items-center space-x-1.5 text-xs rounded-lg flex-shrink-0"
                    title="Create a custom multi-role heist with selected roles"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Custom Blueprint</span>
                  </button>

                  {/* Desktop Launch Co-op Button: Consistent Orange Gradient (Point 9) */}
                  {activeTab !== 'liveheist' && (
                    <button
                      onClick={() => handleLaunchToLobby(0)}
                      className="hidden sm:flex bg-gradient-to-r from-[#F59E0B] to-[#FB923C] hover:brightness-110 text-[#02140D] font-black h-9 px-3.5 py-1.5 border-2 border-[#FBBF24] shadow-[0_4px_14px_rgba(245,158,11,0.35)] active:translate-y-0.5 transition-all items-center space-x-1.5 text-xs rounded-lg flex-shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>LAUNCH CO-OP</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      heistAudio.playKeyClick();
                    }}
                    className="bg-[#10B981] text-[#02140D] font-black text-xs h-8 sm:h-9 px-2.5 sm:px-4 py-1 border-2 border-[#03140C] shadow-[2px_2px_0px_#020C07] hover:bg-[#10B981] active:translate-x-0.5 transition-all flex items-center space-x-1 rounded-lg flex-shrink-0"
                    title="Sign In with email or username and password"
                    aria-label="Sign In"
                  >
                    <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="text-[11px] sm:text-xs">SIGN IN</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── Session Interruption Recovery Banner ── */}
        {recoverySession && !isHeistLocked && (
          <div className="bg-gradient-to-r from-amber-950/95 via-amber-900/90 to-emerald-950/95 border-b-2 border-amber-500/70 px-4 py-3 text-amber-200 z-40 shadow-lg animate-fade-in">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center space-x-2.5 text-center sm:text-left">
                <span className="text-base sm:text-lg animate-bounce">⚡</span>
                <div>
                  <span className="font-game font-bold text-amber-300 uppercase tracking-wider">
                    Previous Heist Interrupted!
                  </span>
                  <span className="ml-2 text-slate-300 text-xs font-mono">
                    Squad: <strong className="text-white bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">{recoverySession.roomCode}</strong>
                    {recoverySession.role && (
                      <> | Role: <strong className="text-emerald-400 capitalize">{recoverySession.role}</strong></>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 font-game">
                <button
                  onClick={() => {
                    handleJoinSquadOperation(recoverySession.roomCode, recoverySession.role || 'hacker');
                    setActiveTab('lobby');
                    setRecoverySession(null);
                    localStorage.removeItem('vault_active_session');
                    heistAudio.playKeyClick();
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>🔄 Rejoin Squad</span>
                </button>
                <button
                  onClick={() => {
                    setRecoverySession(null);
                    localStorage.removeItem('vault_active_session');
                    heistAudio.playKeyClick();
                  }}
                  className="bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs uppercase active:scale-95 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 relative min-h-[calc(100vh-65px)]">

          {currentUser && (
            <aside className={`
              hidden md:flex sticky top-[58px] sm:top-[65px] z-20
              h-[calc(100vh-58px)] sm:h-[calc(100vh-65px)]
              bg-[#051A12]/65 md:bg-[#061E14]/55 backdrop-blur-2xl
              border-r border-emerald-500/25 shadow-[8px_0_32px_rgba(0,0,0,0.45)]
              flex-col justify-between
              transition-all duration-300 ease-in-out
              overflow-y-auto overflow-x-hidden flex-shrink-0
              ${sidebarCollapsed 
                ? 'w-16' 
                : 'w-60 lg:w-64'
              }
            `}>
            
            {sidebarCollapsed ? (
              /* Collapsed / Minimized Vertical Rail */
              <div className="flex flex-col items-center justify-between h-full py-4 px-2 w-full select-none">
                <div className="flex flex-col items-center w-full space-y-4">
                  {/* Expand Sidebar Toggle Button */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      setSidebarCollapsed(false);
                      heistAudio.playKeyClick();
                    }}
                    className="w-10 h-10 rounded-2xl border border-white/20 bg-[#04160E] hover:bg-[#10B981]/20 flex items-center justify-center text-[#10B981] shadow-[3px_4px_10px_rgba(0,0,0,0.35),inset_1.5px_1.5px_3px_rgba(255,255,255,0.15),inset_-2px_-2px_4px_rgba(0,0,0,0.45)] transition-all"
                    title="Expand Sidebar Menu"
                    aria-label="Expand Sidebar Menu"
                  >
                    <PanelLeftOpen className="w-5 h-5 text-[#10B981]" />
                  </motion.button>

                  {/* Divider Line */}
                  <div className="w-8 border-t border-[#10B981]/20" />

                  {/* Navigation Icon List */}
                  <nav className="flex flex-col items-center space-y-2.5 w-full">
                    {[
                      { id: 'home', label: 'Home HQ', icon: Home },
                      { id: 'missions', label: 'Expeditions', icon: Compass },
                      { id: 'lobby', label: 'Squad Lobby', icon: Users },
                      { id: 'characters', label: '4 Roles', icon: Zap },
                      { id: 'map', label: 'Canopy Map', icon: MapPin },
                      { id: 'topics', label: 'Disciplines', icon: BookOpen },
                      { id: 'builder', label: 'Architect', icon: Terminal },
                      { id: 'waitlist', label: 'Syndicate Pass', icon: Rocket },
                      { id: 'settings', label: 'Settings', icon: Settings },
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;

                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ duration: 0.12 }}
                          onClick={() => {
                            if (isHeistLocked && tab.id !== 'liveheist') {
                              toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
                              return;
                            }
                            navigateToTab(tab.id);
                            heistAudio.playKeyClick();
                            if (tab.id === 'liveheist' && !isTimerRunning) {
                              setIsTimerRunning(true);
                            }
                            if (window.innerWidth < 768) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all nav-pill-btn ${
                            isActive
                              ? 'text-[#10B981] bg-[#10B981]/25 border border-white/20 shadow-[3px_4px_10px_rgba(0,0,0,0.35),inset_1.5px_1.5px_3px_rgba(110,231,183,0.3),inset_-2px_-2px_4px_rgba(1,24,15,0.5)]'
                              : 'text-[#6EE7B7]/70 hover:text-white hover:bg-[#10B981]/15'
                          }`}
                          title={tab.label}
                          aria-label={tab.label}
                        >
                          <Icon className="w-5 h-5 stroke-[2]" />
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>

                {/* Bottom User Profile / Dossier Button */}
                <div className="flex flex-col items-center w-full pt-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      navigateToTab('stats');
                      heistAudio.playKeyClick();
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-11 h-11 rounded-2xl border-2 border-[#10B981] bg-[#04160E] hover:bg-[#10B981]/25 flex items-center justify-center overflow-hidden text-[#10B981] shadow-[4px_6px_14px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(110,231,183,0.25),inset_-3px_-3px_6px_rgba(1,24,15,0.6)] transition-all relative group p-0.5 ${
                      activeTab === 'stats' ? 'bg-[#10B981]/30 ring-2 ring-[#10B981] border-[#10B981]' : ''
                    }`}
                    title={currentUser ? `${currentUser.callsign}'s Dossier & Stats` : "My Stats / Operative Dossier"}
                    aria-label="Operative Dossier"
                  >
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.callsign || "User Profile"}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_AVATAR_IMG;
                        }}
                      />
                    ) : (
                      <BarChart3 className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Expanded Sidebar */
              <>
                <div className="flex-1 w-72 md:w-60 lg:w-64">
                  
                  <div className="p-3.5 border-b-2 border-[#03140C] bg-[#04160E]/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                      <span className="text-[11px] font-black uppercase font-mono tracking-wider text-[#10B981]">
                        SYNDICATE MENU
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-mono bg-[#0A261B] text-[#F59E0B] px-2 py-0.5 border border-[#03140C] font-bold">
                        9 OPS
                      </span>
                      <button
                        onClick={() => {
                          setSidebarCollapsed(true);
                          heistAudio.playKeyClick();
                        }}
                        className="hidden md:flex p-1 text-slate-400 hover:text-white hover:bg-[#0E3526] border border-[#03140C] rounded"
                        title="Minimize Sidebar"
                      >
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <nav className="p-2.5 sm:p-3 space-y-1">
                    {[
                      { id: 'home', label: 'Home HQ', icon: Home },
                      { id: 'stats', label: 'My Stats', icon: BarChart3, highlight: !!currentUser },
                      { id: 'missions', label: 'Expeditions', icon: Compass },
                      { id: 'lobby', label: 'Squad Lobby', icon: Users },
                      { id: 'characters', label: '4 Roles', icon: Zap },
                      { id: 'topics', label: 'Disciplines', icon: BookOpen },
                      { id: 'map', label: 'Canopy Map', icon: MapPin },
                      { id: 'builder', label: 'Architect', icon: Terminal },
                      { id: 'waitlist', label: 'Syndicate Pass', icon: Rocket },
                      { id: 'settings', label: 'Settings', icon: Settings }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;

                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => {
                            if (isHeistLocked && tab.id !== 'liveheist') {
                              toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
                              return;
                            }
                            navigateToTab(tab.id);
                            heistAudio.playKeyClick();
                            if (tab.id === 'liveheist' && !isTimerRunning) {
                              setIsTimerRunning(true);
                            }
                            if (window.innerWidth < 768) {
                              setSidebarOpen(false);
                            }
                          }}
                          className={`w-full flex items-center p-2.5 transition-all text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] ${
                            isHeistLocked && tab.id !== 'liveheist'
                              ? 'text-[#D1FAE5]/30 cursor-not-allowed opacity-40'
                              : isActive
                              ? 'bg-[#10B981]/12 text-[#34D399] font-medium border-l-[3px] border-[#10B981] shadow-sm'
                              : 'text-[#CFE8DC]/85 hover:bg-[#10B981]/8 hover:text-white border-l-[3px] border-transparent font-normal'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                            <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                              isActive ? 'text-[#34D399]' : tab.highlight ? 'text-[#F59E0B]' : 'text-[#10B981]/80'
                            }`} />
                            <span className="text-xs font-medium tracking-normal truncate flex items-center space-x-1.5">
                              <span>{tab.label}</span>
                              {tab.highlight && (
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-[#34D399]' : 'bg-red-500'} animate-pulse`} />
                              )}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </nav>

                </div>

                <div className="p-3 border-t-2 border-[#03140C] bg-[#04160E]/90 space-y-2.5 w-72 md:w-60 lg:w-64">
                  <div className="p-2 bg-[#020B06] border border-[#03140C] flex items-center justify-between text-[11px] font-mono font-medium rounded-lg">
                    <div className="flex items-center space-x-1.5 text-[#10B981]">
                      <Radio className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
                      <span>Radar Active</span>
                    </div>
                    <span className="text-[#F59E0B] text-[10px]">4.8K CO-OP</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setShowTour(true);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                      heistAudio.playKeyClick();
                    }}
                    className="w-full bg-[#0A261B] text-[#6EE7B7] hover:bg-[#10B981]/20 hover:text-white font-mono font-medium text-[11px] py-1.5 px-2 border border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center justify-center space-x-1.5 rounded-lg"
                    title="Replay the Syndicate Mission Briefing Tutorial"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Mission Tutorial</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLaunchToLobby(0);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#F59E0B] to-[#FB923C] hover:brightness-110 text-[#02140D] font-black text-xs py-2.5 px-3 border-2 border-[#FBBF24] shadow-[0_4px_14px_rgba(245,158,11,0.35)] active:translate-y-0.5 transition-all flex items-center justify-center space-x-1.5 uppercase rounded-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>LAUNCH CO-OP</span>
                  </button>
                </div>
              </>
            )}

          </aside>
          )}

          <div className="flex-1 min-w-0 flex flex-col">

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 pb-24 md:pb-8 w-full overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>

          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroPage
                onNavigate={navigateToTab}
                onStartStage={handleLaunchToLobby}
                onOpenCustomHeist={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                    toast.info("🔐 Please sign in with email & password to build custom heist blueprints.");
                  } else {
                    setIsCustomHeistModalOpen(true);
                  }
                }}
                onRequireAuth={() => setIsAuthModalOpen(true)}
                onOpenSoloTraining={() => {
                  setIsSoloTrainingOpen(true);
                  heistAudio.playKeyClick();
                }}
                currentUser={currentUser}
                characters={characters}
                missions={missions}
                heistStages={allStages}
              />
            </motion.div>
          )}

          {activeTab === 'liveheist' && (
            <motion.div
              key="liveheist"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`space-y-3.5 max-w-7xl mx-auto ${screenShake ? 'animate-screen-shake' : ''}`}
            >
              {burstTrigger > 0 && <ParticleBurst key={burstTrigger} />}

              {comboStreak >= 2 && (
                <div
                  key={comboStreak}
                  className="fixed top-20 right-4 sm:right-8 z-[60] bg-[#F59E0B] text-[#02140D] font-black px-4 py-2 border-[3px] border-[#03140C] shadow-[4px_4px_0px_#020C07] animate-combo-pop flex items-center space-x-2"
                >
                  <Flame className="w-5 h-5" />
                  <span className="uppercase text-sm">{comboStreak}x Combo!</span>
                </div>
              )}

              {/* Floating radio notification badge during heist */}
              <AnimatePresence>
                {unreadRadioCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    onClick={() => {
                      document.getElementById('heist-radio-section')?.scrollIntoView({ behavior: 'smooth' });
                      setUnreadRadioCount(0);
                      heistAudio.playRadioSquelch();
                    }}
                    className="fixed bottom-6 right-6 z-50 bg-[#10B981] text-[#02140D] font-mono font-black text-xs px-4 py-2.5 rounded-full border border-white/25 shadow-[6px_10px_24px_rgba(0,0,0,0.45),inset_2px_2px_4px_rgba(167,243,208,0.35),inset_-3px_-3px_6px_rgba(1,24,15,0.6)] flex items-center space-x-2.5 uppercase hover:bg-[#10B981] active:scale-95 transition-all cursor-pointer"
                  >
                    <Radio className="w-4 h-4 animate-pulse text-[#02140D]" />
                    <span>{unreadRadioCount} New Transmission{unreadRadioCount > 1 ? 's' : ''}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="static z-10 bg-[#051C12] border border-emerald-800/40 rounded-xl p-3 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 shadow-lg transition-all">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[var(--vault-primary,#10B981)] text-[#02140D] font-bold text-[10px] px-2.5 py-0.5 rounded uppercase font-mono">
                      Active Mission
                    </span>
                    {isAloneInSquad && (
                      <span className="bg-amber-400 text-[#02140D] font-black text-[10px] px-2 py-0.5 rounded uppercase font-mono shadow-sm flex items-center space-x-1">
                        <Unlock className="w-2.5 h-2.5 stroke-[3]" />
                        <span>Solo Squad: All Questions Unlocked</span>
                      </span>
                    )}
                    <span className="text-xs font-mono text-emerald-300">
                      Target: {currentStageData.targetFacility}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentStageData.title}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-2xl">{currentStageData.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs self-stretch lg:self-auto justify-between lg:justify-end">
                  
                <div className={`px-3 py-2 rounded-lg border text-center flex items-center space-x-2 transition-all duration-500 ${
                    timeLeft <= 30
                      ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                      : timeLeft <= 60
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                      : 'bg-[#020B06] border-emerald-900/60 text-[#F59E0B]'
                  }`}>
                    <Clock className={`w-4 h-4 transition-colors ${
                      timeLeft <= 30 ? 'text-red-400' : timeLeft <= 60 ? 'text-amber-400' : 'text-[#F59E0B]'
                    }`} />
                    <div>
                      <span className="text-[9px] text-slate-400 block leading-none">TIMER</span>
                      <span className={`font-bold text-base leading-none transition-colors ${
                        timeLeft <= 30 ? 'text-red-300' : timeLeft <= 60 ? 'text-amber-300' : 'text-[#F59E0B]'
                      }`}>
                        {Math.floor(timeLeft / 60)}:{((timeLeft % 60)).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className={`px-3 py-2 rounded-lg border text-center flex items-center space-x-2 ${
                    alarmLevel === 'HIGH_LOCKDOWN' 
                      ? 'bg-red-950 border-red-500 text-red-200 animate-pulse' 
                      : alarmLevel === 'MEDIUM_ALERT'
                      ? 'bg-amber-950 border-amber-500 text-amber-200'
                      : 'bg-[#020B06] border-emerald-900/60 text-[#10B981]'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                    <div>
                      <span className="text-[9px] text-slate-400 block leading-none">STATUS</span>
                      <span className="font-bold text-xs leading-none">
                        {alarmLevel === 'LOW_STEALTH' ? 'Normal' : alarmLevel.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex bg-[#020B06] rounded-lg p-1 border border-emerald-900/60">
                    {allStages.map((stg, sIdx) => {
                      // A stage is unlocked if it's the first one, or if every role
                      // puzzle in the PREVIOUS stage has been solved.
                      const prevStage = sIdx > 0 ? allStages[sIdx - 1] : null;
                      const prevStageId = prevStage ? (prevStage.stageId || sIdx) : null;
                      const prevSolved = prevStageId ? (stageSolvedRoles[prevStageId] || {}) : null;
                      const prevRoles = prevStage?.selectedRoles
                        ? Object.keys(prevStage.selectedRoles).filter(r => prevStage.selectedRoles[r])
                        : ['hacker', 'engineer', 'scientist', 'cryptographer'];
                      const isStageUnlocked = sIdx === 0 || isAloneInSquad || (prevSolved && prevRoles.every(r => !!prevSolved[r]));

                      return (
                        <button
                          key={stg.stageId || sIdx}
                          disabled={!isStageUnlocked}
                          onClick={() => {
                            if (!isStageUnlocked) return;
                            handleStartHeistStage(sIdx);
                          }}
                          title={!isStageUnlocked ? `Complete Stage ${sIdx} first to unlock this stage` : (stg.isCustom ? 'Custom Stage' : `Stage ${stg.stageId}`)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center space-x-1 ${
                            !isStageUnlocked
                              ? 'text-slate-700 cursor-not-allowed opacity-50'
                              : currentStageIdx === sIdx
                                ? 'bg-[#10B981] text-[#02140D]'
                                : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {!isStageUnlocked && <Lock className="w-2.5 h-2.5" />}
                          <span>{stg.isCustom ? 'Custom' : `S0${stg.stageId}`}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      handleStartHeistStage(currentStageIdx);
                    }}
                    className="p-2 rounded-lg border border-emerald-900/60 bg-[#020B06] text-[#F59E0B] hover:bg-[#10B981] hover:text-[#02140D] transition-colors"
                    title="Restart Stage"
                    aria-label="Restart Stage"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsEndHeistModalOpen(true)}
                    className="bg-[#EF4444] text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-[#EF4444] transition-colors flex items-center space-x-1.5"
                    title="End or Abort Operation"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>End Heist</span>
                  </button>

                </div>
              </div>

              <InterdependenceMatrix
                stageData={currentStageData}
                solvedRoles={currentStageSolved}
                roleClues={currentStageClues}
                onInitiateExtraction={() => setIsExtractionActive(true)}
                isAlone={isAloneInSquad}
              />

              {/* ── Puzzle unlock chain: scientist → engineer → hacker → cryptographer ── */}
              {(() => {
                const UNLOCK_PREREQ = {
                  scientist: null,
                  engineer: 'scientist',
                  hacker: 'engineer',
                  cryptographer: 'hacker'
                };
                const PREREQ_LABEL = {
                  scientist: null,
                  engineer: 'Scientist',
                  hacker: 'Engineer',
                  cryptographer: 'Hacker'
                };
                const isPuzzleLocked = (roleId) => {
                  if (isAloneInSquad) return false;
                  const prereq = UNLOCK_PREREQ[roleId];
                  return prereq ? !currentStageSolved[prereq] : false;
                };

                const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
                const myName = currentUser?.username || currentUser?.name || '';
                const myLobbySlot = isSquadMultiplayer
                  ? (lobby?.players || []).find(p => (p.userId && p.userId === myId) || (myName && p.username === myName))
                  : null;
                const myAssignedRole = myLobbySlot?.role ? normalizeRoleKey(myLobbySlot.role) : null;

                return (
                  <div className="sticky bottom-[62px] sm:static z-30 bg-[#03140C]/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-1.5 sm:p-0 rounded-2xl border border-emerald-500/30 sm:border-0 shadow-lg sm:shadow-none grid grid-cols-4 gap-1.5 sm:gap-2.5">
                    {[
                      { id: 'hacker', name: 'The Hacker', shortName: 'Hacker', icon: Terminal, color: '#10B981', discipline: 'Data Structures' },
                      { id: 'engineer', name: 'The Engineer', shortName: 'Engineer', icon: Compass, color: '#F59E0B', discipline: 'Physics & Optics' },
                      { id: 'scientist', name: 'The Scientist', shortName: 'Scientist', icon: FlaskConical, color: '#0EA5E9', discipline: 'Chemistry & pH' },
                      { id: 'cryptographer', name: 'The Cryptographer', shortName: 'Crypto', icon: Key, color: '#A855F7', discipline: 'Math & Ciphers' }
                    ].filter(roleItem => !currentStageData.selectedRoles || currentStageData.selectedRoles[roleItem.id]).map(roleItem => {
                      const Icon = roleItem.icon;
                      const isRoleSolved = !!currentStageSolved[roleItem.id];
                      const isActive = activeCockpitRole === roleItem.id;
                      const prereqLocked = isPuzzleLocked(roleItem.id);
                      // In squad mode, lock roles that don't belong to this player (unless alone in squad)
                      const notMyRole = !isAloneInSquad && isSquadMultiplayer && myAssignedRole && roleItem.id !== myAssignedRole;
                      const locked = !isAloneInSquad && (prereqLocked || notMyRole);
                      const lockTitle = isAloneInSquad
                        ? `${roleItem.name} (Unlocked - Solo Operative)`
                        : notMyRole
                          ? `This is another operative's role`
                          : prereqLocked
                            ? `Waiting for ${PREREQ_LABEL[roleItem.id]} to complete their puzzle first`
                            : roleItem.name;

                      return (
                        <button
                          key={roleItem.id}
                          disabled={locked}
                          onClick={() => {
                            if (locked) return;
                            setActiveCockpitRole(roleItem.id);
                            heistAudio.playKeyClick();
                          }}
                          title={lockTitle}
                          className={`p-2 sm:p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden min-h-[50px] sm:min-h-0 ${
                            locked
                              ? 'bg-[#02100A] border-slate-800 opacity-50 cursor-not-allowed'
                              : isActive
                                ? `bg-[#0A2E1E] border-[#10B981] shadow-md ring-1 ring-[#10B981] role-hover-${roleItem.id}`
                                : `bg-[#051C12] border-emerald-900/40 hover:bg-[#072418] role-hover-${roleItem.id} hover-sheen`
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: locked ? '#475569' : roleItem.color }} />
                              <span className={`font-bold text-xs truncate ${locked ? 'text-slate-600' : 'text-white'}`}>
                                <span className="inline sm:hidden">{roleItem.shortName}</span>
                                <span className="hidden sm:inline">{roleItem.name}</span>
                              </span>
                            </div>
                            {isRoleSolved ? (
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981] flex-shrink-0" />
                            ) : locked ? (
                              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600 flex-shrink-0" />
                            ) : isAloneInSquad ? (
                              <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0" />
                            ) : null}
                          </div>
                          <p className={`hidden sm:block text-[10px] font-mono mt-1.5 ${locked ? 'text-slate-700' : 'text-slate-400'}`}>
                            {isAloneInSquad ? 'Solo: Question Unlocked' : notMyRole ? 'Another operative' : prereqLocked ? `Awaiting ${PREREQ_LABEL[roleItem.id]}` : roleItem.discipline}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}


              {/* ── Role Status Bar ─────────────────────────────────────────── */}
              {/* Shows at-a-glance which specialists are done/pending/active   */}
              {(() => {
                const roleItems = [
                  { id: 'hacker',        emoji: '💻', label: 'Hacker',        color: '#10B981' },
                  { id: 'engineer',      emoji: '⚙️', label: 'Engineer',      color: '#F59E0B' },
                  { id: 'scientist',     emoji: '🧪', label: 'Scientist',     color: '#0EA5E9' },
                  { id: 'cryptographer', emoji: '📜', label: 'Cryptographer', color: '#A855F7' },
                ].filter(r =>
                  !currentStageData.selectedRoles || currentStageData.selectedRoles[r.id]
                );

                return (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase font-mono text-slate-500 tracking-widest flex-shrink-0">SQUAD STATUS</span>
                    {roleItems.map(r => {
                      const isSolved  = !!currentStageSolved[r.id];
                      const isActive  = activeCockpitRole === r.id;
                      const failCount = roleFailCounts[r.id] || 0;
                      return (
                        <div
                          key={r.id}
                          title={isSolved ? `${r.label}: ✅ Puzzle cleared` : isActive ? `${r.label}: 🔄 Working...` : `${r.label}: ⏳ Pending`}
                          className={`flex items-center space-x-1.5 px-2.5 py-1.5 border-2 text-xs font-mono font-bold transition-all ${
                            isSolved
                              ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]'
                              : isActive
                              ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B] animate-pulse'
                              : 'border-slate-700 bg-[#020B06] text-slate-500'
                          }`}
                        >
                          <span className="text-sm leading-none">{r.emoji}</span>
                          <span className="hidden sm:inline uppercase tracking-wider text-[10px]">{r.label}</span>
                          {isSolved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                          ) : isActive ? (
                            <RefreshCw className="w-3 h-3 animate-spin flex-shrink-0" style={{ color: r.color }} />
                          ) : (
                            <div className="w-3 h-3 rounded-full border-2 border-slate-600 flex-shrink-0" />
                          )}
                          {/* Fail count badge — shown if ≥1 fail so team can see who needs support */}
                          {failCount > 0 && !isSolved && (
                            <span className="text-[8px] bg-red-900 text-red-300 px-1 border border-red-700 rounded-sm font-black">
                              {failCount}✗
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 lg:grid-cols-12 landscape:max-lg:grid-cols-2 gap-3.5 sm:gap-5">
                
                <div className="lg:col-span-8 landscape:max-lg:col-span-1 space-y-4">
                  {/* ── Locked-puzzle overlay helper ── */}
                  {(() => {
                    const UNLOCK_PREREQ = {
                      scientist: null,
                      engineer: 'scientist',
                      hacker: 'engineer',
                      cryptographer: 'hacker'
                    };
                    const PREREQ_LABEL = {
                      engineer: 'Scientist',
                      hacker: 'Engineer',
                      cryptographer: 'Hacker'
                    };
                    const prereq = UNLOCK_PREREQ[activeCockpitRole];
                    const isLocked = !isAloneInSquad && (prereq ? !currentStageSolved[prereq] : false);

                    if (isLocked) {
                      return (
                        <div className="flex flex-col items-center justify-center min-h-[320px] rounded-2xl border-2 border-dashed border-slate-700 bg-[#02100A]/80 text-center p-8 space-y-4">
                          <div className="w-14 h-14 rounded-full bg-[#051811] border-2 border-slate-700 flex items-center justify-center">
                            <Lock className="w-7 h-7 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-slate-300 font-bold text-sm font-game uppercase tracking-widest mb-1">MODULE LOCKED</p>
                            <p className="text-slate-500 text-xs font-mono">
                              Waiting for <span className="text-[#F59E0B] font-bold">{PREREQ_LABEL[activeCockpitRole]}</span> to complete their puzzle first.
                            </p>
                            <p className="text-slate-600 text-[11px] font-mono mt-2">
                              The interdependence pipeline must be satisfied before this module activates.
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            {[0,1,2].map(i => (
                              <div key={i} className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <>
                        {activeCockpitRole === 'hacker' && (
                          <HackerTerminal
                            puzzle={currentStagePuzzles.hacker || heistStages[0].puzzles.hacker}
                            isSolved={!!currentStageSolved.hacker}
                            onSolved={handleRolePuzzleSolved}
                            onFail={handleRolePuzzleFailed}
                          />
                        )}

                        {activeCockpitRole === 'engineer' && (
                          <EngineerLaserGrid
                            puzzle={currentStagePuzzles.engineer || heistStages[0].puzzles.engineer}
                            isSolved={!!currentStageSolved.engineer}
                            onSolved={handleRolePuzzleSolved}
                            onFail={handleRolePuzzleFailed}
                          />
                        )}

                        {activeCockpitRole === 'scientist' && (
                          <ScientistLab
                            puzzle={currentStagePuzzles.scientist || heistStages[0].puzzles.scientist}
                            isSolved={!!currentStageSolved.scientist}
                            onSolved={handleRolePuzzleSolved}
                            onFail={handleRolePuzzleFailed}
                          />
                        )}

                        {activeCockpitRole === 'cryptographer' && (
                          <CryptographerDeck
                            puzzle={currentStagePuzzles.cryptographer || heistStages[0].puzzles.cryptographer}
                            isSolved={!!currentStageSolved.cryptographer}
                            onSolved={handleRolePuzzleSolved}
                            onFail={handleRolePuzzleFailed}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>

                <div id="heist-radio-section" className="lg:col-span-4 landscape:max-lg:col-span-1 space-y-4" onClick={() => setUnreadRadioCount(0)}>
                  <RadioComms
                    messages={radioMessages}
                    activeRole={activeCockpitRole}
                    onSendMessage={handleSendMessage}
                    voiceConnected={isLobbyVoiceConnected}
                    micMuted={isLobbyMicMuted}
                    isDeafened={isLobbyDeafened}
                    onToggleVoice={handleToggleVoice}
                    onToggleMic={handleToggleMic}
                    onToggleDeafen={handleToggleDeafen}
                    isSpeaking={isUserSpeaking}
                    unreadCount={unreadRadioCount}
                  />

                  <div className="bg-[#051C12] p-4 rounded-xl border border-emerald-800/40 space-y-2.5 shadow-md">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        AI Teammate Assist
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Playing solo or need a squadmate clue? Trigger an AI teammate to solve one of the pending roles.
                    </p>
                    <button
                      onClick={handleSimulateBotTeammates}
                      className="w-full bg-[#10B981] text-[#02140D] font-bold text-xs py-2.5 rounded-lg hover:bg-[#10B981] transition-colors"
                    >
                      🤖 Request AI Teammate Clue
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {activeTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-7xl mx-auto"
            >
              <div className="bg-[#051C12] border border-emerald-800/40 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#10B981] text-[#02140D] font-bold text-[10px] px-2.5 py-0.5 rounded uppercase font-mono">
                      Campaigns
                    </span>
                    <span className="text-xs font-mono text-emerald-300">
                      {missions.length} Operations Ready
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 font-game">
                    STEM Expeditions
                  </h2>
                  <p className="text-xs text-slate-300">
                    Select a collaborative mission target below to start your co-op heist.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setIsCustomHeistModalOpen(true);
                      heistAudio.playKeyClick();
                    }}
                    className="bg-[#10B981] text-[#02140D] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg hover:bg-[#10B981] transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-950 font-game fluid-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom Heist</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.map((mission, mIdx) => (
                  <div
                    key={mission.id || mIdx}
                    className="bg-[#051C12] border border-emerald-800/40 rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:border-[#10B981]/70 hover:bg-[#072418] transition-all group fluid-card"
                  >
                    <div>
                      <div className="relative h-36 sm:h-40 overflow-hidden bg-[#020B06]">
                        <img 
                          src={mission.image} 
                          alt={mission.title} 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_SUBJECT_IMG; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#020B06]/85 backdrop-blur-sm text-[#10B981] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-900/60">
                          {mission.category}
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                            mission.difficulty?.includes('Master') 
                              ? 'bg-red-500/90 text-white' 
                              : 'bg-[#10B981] text-[#02140D]'
                          }`}>
                            {mission.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 space-y-1.5 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#10B981] transition-colors font-game">
                            {mission.title}
                          </h3>
                          <span className="text-[11px] font-mono text-amber-300 font-semibold">
                            🎁 {mission.reward}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 pt-0">
                      <button
                        onClick={() => {
                          if (mission.customStageData) {
                            handleLaunchCustomHeist(mission.customStageData);
                          } else {
                            handleLaunchToLobby(mIdx % allStages.length);
                          }
                        }}
                        className="w-full bg-[#10B981] text-[#02140D] font-bold py-2 rounded-lg hover:bg-[#10B981] transition-all text-xs flex items-center justify-center space-x-2 uppercase font-game shadow-md shadow-emerald-950 fluid-btn"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Launch Expedition</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-7xl mx-auto text-left"
            >
              {!isInSquadRoom ? (
                <SquadRecruitmentBoard
                  socket={activeSocket}
                  currentUser={currentUser}
                  onCreateSquad={() => setIsCreateRoomModalOpen(true)}
                  onOpenJoinModal={() => setIsJoinRoomModalOpen(true)}
                  onOpenAgentDirectory={() => setIsAgentDirectoryOpen(true)}
                  onJoinSquad={handleJoinSquadOperation}
                  onOpenSoloTraining={() => setIsSoloTrainingOpen(true)}
                />
              ) : (
                <div className="space-y-4">
                  
                  {/* Leave Squad Button — routes through loyalty warning */}
                  <button
                    onClick={() => {
                      handleRequestLeaveSquad();
                      heistAudio.playKeyClick();
                    }}
                    className="bg-[#020B06] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-emerald-900/80 hover:border-rose-700/60 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-md group"
                  >
                    <LogOut className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Leave Squad</span>
                  </button>

                  <div className="bg-[#051C12]/50 backdrop-blur-xl border border-emerald-800/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 relative overflow-hidden">
                    {/* Background ambient grid pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#10B98115_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

                    {/* Header Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 border-b border-emerald-900/60 pb-4 sm:pb-5 relative z-10">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="bg-[#10B981] text-[#02140D] font-mono font-bold text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded uppercase tracking-wider">
                            SQUAD ASSEMBLED
                          </span>
                          {isAloneInSquad && (
                            <span className="bg-amber-400 text-[#02140D] font-mono font-bold text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
                              <Unlock className="w-2.5 h-2.5 stroke-[3]" />
                              <span>SOLO SQUAD: ALL QUESTIONS UNLOCKED</span>
                            </span>
                          )}
                          <span className={`text-[10px] sm:text-xs font-mono font-bold px-2 sm:px-2.5 py-0.5 rounded flex items-center space-x-1.5 ${
                            isSocketConnected 
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-[#10B981] animate-ping' : 'bg-amber-400'}`} />
                            <span>{isSocketConnected ? 'LIVE MESH' : 'LOCAL NETWORK'}</span>
                          </span>
                          <span className="text-[10px] sm:text-xs font-mono text-emerald-300">4-OPERATIVE MULTIPLAYER</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-[#F0FDF4] font-game">
                          {lobby?.name || 'Squad Operation'}
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm">
                          Coordinate roles, calibrate voice frequencies, and launch synchronized co-op operations.
                        </p>
                      </div>

                      {/* Room Actions & Launch Button */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
                        {/* Room Code with 1-click copy and 2s subtle green flash */}
                        <div className={`px-3.5 py-2 rounded-xl border flex items-center justify-between sm:justify-start space-x-2 transition-all duration-300 w-full sm:w-auto ${
                          copiedCode || copiedLink
                            ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/50 shadow-[4px_6px_14px_rgba(0,0,0,0.35),inset_1.5px_1.5px_3px_rgba(110,231,183,0.3),inset_-2px_-2px_4px_rgba(1,24,15,0.5)]'
                            : 'bg-[#020B06] border-emerald-800/60'
                        }`}>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[9px] font-mono text-emerald-400 block uppercase font-bold">Room Code</span>
                              {(copiedCode || copiedLink) && (
                                <span className="text-[9px] font-mono font-black text-emerald-300 bg-emerald-900/60 px-1 rounded animate-pulse">
                                  COPIED!
                                </span>
                              )}
                            </div>
                            <span className="text-base sm:text-lg font-mono font-bold text-[#F59E0B] tracking-widest">{lobby?.code || 'HEIST-782'}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={handleCopyRoomCode}
                              className={`p-1.5 rounded-lg transition-all ${
                                copiedCode 
                                  ? 'bg-emerald-500 text-[#02140D] font-bold shadow-md' 
                                  : 'bg-emerald-950/80 text-emerald-300 hover:text-white hover:bg-emerald-800'
                              }`}
                              title="Copy Room Code"
                            >
                              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={handleCopyInviteLink}
                              className={`p-1.5 rounded-lg transition-all ${
                                copiedLink 
                                  ? 'bg-emerald-500 text-[#02140D] font-bold shadow-md' 
                                  : 'bg-emerald-950/80 text-emerald-300 hover:text-white hover:bg-emerald-800'
                              }`}
                              title="Copy Invite Link"
                            >
                              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Secondary Quick Action Buttons (2x2 on mobile, flex on desktop) */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                          {/* Create Room Button */}
                          <button
                            onClick={() => {
                              setIsCreateRoomModalOpen(true);
                              heistAudio.playKeyClick();
                            }}
                            className="bg-[#020B06] text-emerald-300 border border-emerald-700/60 hover:bg-emerald-950/60 font-bold px-3 py-2.5 rounded-xl uppercase flex items-center justify-center space-x-1.5 text-xs font-game transition-all"
                          >
                            <Plus className="w-4 h-4 text-[#10B981]" />
                            <span>New Room</span>
                          </button>

                          {/* Join by Code Button */}
                          <button
                            onClick={() => {
                              setIsJoinRoomModalOpen(true);
                              heistAudio.playKeyClick();
                            }}
                            className="bg-[#020B06] text-amber-300 border border-amber-700/60 hover:bg-amber-950/60 font-bold px-3 py-2.5 rounded-xl uppercase flex items-center justify-center space-x-1.5 text-xs font-game transition-all"
                          >
                            <LogIn className="w-4 h-4 text-amber-400" />
                            <span>Join Room</span>
                          </button>

                          {/* Search & Invite by Agent ID */}
                          <button
                            onClick={() => {
                              setIsAgentDirectoryOpen(true);
                              heistAudio.playKeyClick();
                            }}
                            className="bg-[#020B06] text-[#10B981] border border-[#10B981]/60 hover:bg-[#072418] font-bold px-3 py-2.5 rounded-xl uppercase flex items-center justify-center space-x-1.5 text-xs font-game transition-all"
                            title="Search operatives worldwide by unique Agent ID"
                          >
                            <Users className="w-4 h-4 text-[#10B981]" />
                            <span>Search ID</span>
                          </button>

                          {/* Custom Heist Creator */}
                          <button
                            onClick={() => {
                              setIsCustomHeistModalOpen(true);
                              heistAudio.playKeyClick();
                            }}
                            className="bg-[#020B06] text-[#F59E0B] border border-amber-500/60 hover:bg-amber-950/40 font-bold px-3 py-2.5 rounded-xl uppercase flex items-center justify-center space-x-1.5 text-xs font-game transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Custom</span>
                          </button>
                        </div>

                        {/* Synchronized Squad Launch Button - Full Width on Mobile with High Visibility */}
                        <button
                          onClick={handleStartMultiplayerHeist}
                          className="w-full sm:w-auto bg-[#10B981] hover:bg-[#34D399] text-[#02140D] font-black px-6 py-3.5 sm:py-2.5 rounded-xl uppercase flex items-center justify-center space-x-2 text-sm font-game shadow-lg shadow-emerald-950/80 hover:scale-[1.02] active:scale-[0.98] transition-all hover-sheen"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>LAUNCH SQUAD HEIST</span>
                        </button>
                      </div>
                    </div>


                    {/* ══ ROLE SELECTION & SQUAD ROSTER SECTION ══ */}
                    {(() => {
                      const myId = currentUser?.id || localStorage.getItem('vault_guest_id');
                      const myName = currentUser?.username || localStorage.getItem('vault_guest_name') || 'qwerty';
                      
                      const mySlot = (lobby?.players || []).find(s => {
                        const pName = s.playerName || s.username;
                        return (s.userId && s.userId === myId) || (myName && pName === myName);
                      });

                      const myRoleKey = mySlot?.role ? normalizeRoleKey(mySlot.role) : 'hacker';

                      // Map of all claimed roles by human players
                      const claimedRoles = {};
                      (lobby?.players || []).forEach(s => {
                        const pName = s.playerName || s.username;
                        const isMe = mySlot && s.slotId === mySlot.slotId;
                        if (s.role && pName && !isMe) {
                          claimedRoles[normalizeRoleKey(s.role)] = pName;
                        }
                      });

                      const roleCardsData = [
                        {
                          key: 'hacker',
                          charId: 'c1',
                          title: 'The Hacker',
                          name: "Alex 'Byte' Vance",
                          disciplineLine1: 'Computer Science: Graph',
                          disciplineLine2: 'Theory & Shortest Path',
                          accentColor: '#10B981',
                          nameColor: '#10B981',
                          discColor: '#6EE7B7',
                          challengeTitle: 'The Firewall Graph Traversal (BFS / Shortest Path)',
                          challengeDesc: "The security sub-grid is routing honeypots. Find the lowest-latency unmonitored path from Node 'A' to Node 'F' avoiding compromised trap nodes ('B'...",
                          dependency: 'The',
                          renderIcon: () => (
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#042116] border border-[#10B981]/50 flex items-center justify-center flex-shrink-0 text-[#10B981] font-mono text-xl sm:text-2xl font-black shadow-inner">
                              &gt;_
                            </div>
                          )
                        },
                        {
                          key: 'engineer',
                          charId: 'c2',
                          title: 'The Engineer',
                          name: 'Dr. Marcus Chen',
                          disciplineLine1: "Applied Physics: Snell's Law",
                          disciplineLine2: '& Optics',
                          accentColor: '#F59E0B',
                          nameColor: '#F59E0B',
                          discColor: '#FDE047',
                          challengeTitle: "Laser Optical Refraction Angle (Snell's Law)",
                          challengeDesc: "Light travels from air (n1 = 1.0) into glass/argon (n2 = 1.50) at incident angle 45°. Using Snell's law (n1*sin(45°) = n2*sin(θ2)), calculate refraction angle θ...",
                          dependency: 'The',
                          renderIcon: () => (
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#1d1906] border border-[#F59E0B]/50 flex items-center justify-center flex-shrink-0 text-[#F59E0B] shadow-inner">
                              <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                          )
                        },
                        {
                          key: 'scientist',
                          charId: 'c3',
                          title: 'The Scientist',
                          name: 'Dr. Elena Rostova',
                          disciplineLine1: 'Chemistry: Stoichiometry &',
                          disciplineLine2: 'Neutralization',
                          accentColor: '#0EA5E9',
                          nameColor: '#0EA5E9',
                          discColor: '#22D3EE',
                          challengeTitle: 'Toxic Gas Neutralization (Acid-Base Titration)',
                          challengeDesc: 'Neutralize 2.5L of 0.4M HCl gas (1.0 mol) with aqueous 1.0M NaOH before toxic gas vents. Balance the stoichiometric neutralization reaction: 1 HCl + 1 NaOH ...',
                          dependency: 'Initial',
                          renderIcon: () => (
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#041a22] border border-[#0EA5E9]/50 flex items-center justify-center flex-shrink-0 text-[#0EA5E9] shadow-inner">
                              <FlaskConical className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                          )
                        },
                        {
                          key: 'cryptographer',
                          charId: 'c4',
                          title: 'The Cryptographer',
                          name: "Maya 'Cipher' Lin",
                          disciplineLine1: 'Cryptography: Modular',
                          disciplineLine2: 'Arithmetic & Ciphers',
                          accentColor: '#A855F7',
                          nameColor: '#A855F7',
                          discColor: '#D8B4FE',
                          challengeTitle: 'Polyalphabetic Vigenère Cipher Intercept',
                          challengeDesc: "Tune VHF receiver to 142.6 MHz and decrypt intercepted ciphertext 'LXFOPVEFRNHR' using Keyword 'LEMON' to decode guard pass phrase and detect...",
                          dependency: 'The',
                          renderIcon: () => (
                            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#190822] border border-[#A855F7]/50 flex items-center justify-center flex-shrink-0 text-[#A855F7] shadow-inner">
                              <Key className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                          )
                        }
                      ];

                      const allRoleKeys = ['hacker', 'engineer', 'scientist', 'cryptographer'];

                      const otherRealPlayers = (lobby?.players || []).filter(s => {
                        const pName = s.playerName || s.username;
                        const isMe = (s.userId && s.userId === myId) || (myName && pName === myName) || (mySlot && s.slotId === mySlot.slotId);
                        return !isMe && (s.userId || pName);
                      });
                      const rolesClaimedByOthers = new Set(
                        otherRealPlayers.map(p => normalizeRoleKey(p.role)).filter(Boolean)
                      );
                      const remainingAiRoles = allRoleKeys.filter(k => k !== myRoleKey && !rolesClaimedByOthers.has(k));

                      const getRoleDetails = (rKey) => {
                        return roleCardsData.find(rc => rc.key === rKey) || roleCardsData[0];
                      };

                      const getCharByRoleKey = (rKey) => {
                        const rc = getRoleDetails(rKey);
                        return characters.find(c => c.id === rc.charId) || characters[0];
                      };

                      return (
                        <div className="space-y-5 sm:space-y-6 relative z-10">
                          
                          {/* ══ ROW 1: 4 ROLE SELECTION CARDS ══ */}
                          <div className="space-y-2">
                            {/* Mobile Role Switcher Pill Strip */}
                            <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                              {roleCardsData.map(rc => {
                                const isMyRole = myRoleKey === rc.key;
                                const claimedBy = claimedRoles[rc.key];
                                const isTaken = claimedBy && !isMyRole;
                                return (
                                  <button
                                    key={rc.key}
                                    type="button"
                                    onClick={() => {
                                      if (!isTaken) {
                                        handleSelectRole(rc.key);
                                        heistAudio.playKeyClick();
                                        toast.success('🎯 Switched role to ' + rc.title + '!');
                                      } else {
                                        toast.error('Role claimed by ' + claimedBy);
                                      }
                                    }}
                                    className={`px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-bold shrink-0 flex items-center space-x-1 border transition-all ${
                                      isMyRole
                                        ? 'bg-[#10B981] text-[#02140D] border-[#10B981] shadow-sm'
                                        : isTaken
                                        ? 'bg-[#020b06]/60 text-slate-500 border-slate-800'
                                        : 'bg-[#03150d] text-slate-300 border-[#0d3824]'
                                    }`}
                                  >
                                    <span style={{ color: isMyRole ? '#02140D' : rc.accentColor }}>●</span>
                                    <span>{rc.title.replace('The ', '')}</span>
                                    {isMyRole && <span className="text-[8px] bg-[#02140D] text-[#10B981] px-1 rounded ml-1 font-black">YOU</span>}
                                    {isTaken && <span className="text-[8px] text-slate-500 ml-0.5">🔒</span>}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="sm:hidden text-center text-[10px] font-mono text-emerald-400/80 pb-0.5">
                              ← Swipe cards horizontally or tap tabs above →
                            </div>

                            {/* Responsive Cards: Smooth horizontal snap on mobile, 4-col grid on desktop */}
                            <div className="flex overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar gap-3 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible pt-1 sm:pt-0">
                              {roleCardsData.map(rc => {
                                const isMyRole = myRoleKey === rc.key;
                                const claimedBy = claimedRoles[rc.key];
                                const isTakenByOther = claimedBy && !isMyRole;

                                return (
                                  <motion.div
                                    key={rc.key}
                                    whileHover={!isTakenByOther ? { y: -2 } : {}}
                                    transition={{ duration: 0.15 }}
                                    className={`w-[85vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink relative rounded-2xl p-3.5 sm:p-4.5 flex flex-col justify-between transition-all duration-200 backdrop-blur-md role-hover-${rc.key} ${
                                      isMyRole
                                        ? 'bg-[#03170e]/95 border-2 border-[#10B981] rounded-2xl shadow-[8px_14px_28px_rgba(0,0,0,0.45),inset_2.5px_2.5px_5px_rgba(110,231,183,0.25),inset_-3.5px_-3.5px_8px_rgba(1,24,15,0.6)]'
                                        : isTakenByOther
                                        ? 'bg-[#020b06]/40 border border-slate-800/60 opacity-50 grayscale-[25%] cursor-not-allowed'
                                        : 'bg-[#03150d]/50 border border-[#0d3824]/80 hover:border-[#10B981]/50'
                                    }`}
                                  >
                                    {/* Pill Badge at top border */}
                                    {isMyRole ? (
                                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-mono flex items-center space-x-1.5 shadow-md bg-[#10B981] text-[#02140D] border border-[#10B981] whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#02140D]" />
                                        <span>YOUR ROLE</span>
                                      </div>
                                    ) : isTakenByOther ? (
                                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono flex items-center space-x-1 shadow-md bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                                        <span>🔒 TAKEN BY {claimedBy.toUpperCase().substring(0, 10)}</span>
                                      </div>
                                    ) : null}

                                    <div>
                                      {/* Top Header: Icon + Titles */}
                                      <div className="flex items-start space-x-2.5 sm:space-x-3 pt-1">
                                        {rc.renderIcon()}
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-base sm:text-lg text-white font-game leading-tight truncate">
                                            {rc.title}
                                          </h4>
                                          <p className="text-xs font-mono font-bold mt-0.5 truncate" style={{ color: rc.nameColor }}>
                                            {rc.name}
                                          </p>
                                          <div className="text-[10px] font-mono leading-tight mt-0.5" style={{ color: rc.discColor }}>
                                            <p className="truncate">{rc.disciplineLine1}</p>
                                            <p className="truncate">{rc.disciplineLine2}</p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Challenge Inset Box */}
                                      <div className="bg-[#020d07]/60 backdrop-blur-sm border border-[#0d3824]/70 rounded-xl p-2.5 sm:p-3 my-2.5 sm:my-3.5 space-y-1">
                                        <div className="flex items-start space-x-1.5 text-xs font-mono font-bold text-[#10B981] leading-snug">
                                          <span className="text-[#F59E0B] flex-shrink-0 text-xs mt-0.5">⚡</span>
                                          <span className="truncate">{rc.challengeTitle}</span>
                                        </div>
                                        <p className="text-slate-300 text-[11px] font-mono leading-relaxed opacity-85 line-clamp-2 sm:line-clamp-3">
                                          {rc.challengeDesc}
                                        </p>
                                      </div>

                                      {/* Dependency Row */}
                                      <div className="flex items-center justify-between px-1 mb-2.5 sm:mb-3 text-[11px] sm:text-xs font-mono">
                                        <span className="text-slate-500">Dependency:</span>
                                        <span className="text-slate-300 font-bold">{rc.dependency}</span>
                                      </div>
                                    </div>

                                    {/* Button Row */}
                                    <div>
                                      {isMyRole ? (
                                        <button
                                          onClick={() => {
                                            heistAudio.playKeyClick();
                                            toast.info('Role confirmed: ' + rc.title);
                                          }}
                                          className="w-full bg-[#10B981] hover:bg-[#34D399] text-[#02140D] font-mono font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg transition-all min-h-[38px]"
                                        >
                                          <span>LOCKED IN ✓</span>
                                        </button>
                                      ) : isTakenByOther ? (
                                        <button
                                          disabled
                                          className="w-full bg-[#020b06] text-slate-500 border border-slate-800 font-mono font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center cursor-not-allowed min-h-[38px]"
                                        >
                                          <span>CHOOSE SPECIALIST</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            handleSelectRole(rc.key);
                                            heistAudio.playKeyClick();
                                            toast.success('🎯 Switched role to ' + rc.title + '!');
                                          }}
                                          className="w-full bg-[#02110a]/60 hover:bg-[#062417]/80 backdrop-blur-sm text-white hover:text-[#10B981] border border-[#0d3824] hover:border-[#10B981]/60 font-mono font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center transition-all min-h-[38px] hover-sheen active:scale-95"
                                        >
                                          <span>CHOOSE SPECIALIST</span>
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>

                          {/* ══ ROW 2: SQUAD ROSTER & READINESS (Clean 2x2 Grid on Mobile) ══ */}
                          <div className="space-y-3 pt-1">
                            {/* Section 2 Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                              <div className="flex items-center space-x-2">
                                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F59E0B] text-[#02140D] font-black text-xs sm:text-sm flex items-center justify-center font-mono shadow flex-shrink-0">
                                  2
                                </span>
                                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight font-game">
                                  Squad Roster &amp; Readiness
                                </h2>
                              </div>
                              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#10B981]">
                                {1 + otherRealPlayers.length} Operative{otherRealPlayers.length === 0 ? '' : 's'}
                                {(3 - otherRealPlayers.length) > 0 ? ` + ${3 - otherRealPlayers.length} AI Assigned` : ' — Full Squad'}
                              </span>
                            </div>

                            {/* 4 Operative Slots Grid: 2 columns on mobile, 4 columns on desktop */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                              
                              {/* ── SLOT 01: Logged-in Player ── */}
                              {(() => {
                                const myRoleData = getRoleDetails(myRoleKey);
                                const myChar = getCharByRoleKey(myRoleKey);
                                const isReady = mySlot?.isReady || false;

                                return (
                                  <div className="rounded-2xl sm:rounded-3xl bg-[#03170e]/95 border border-white/20 p-3 sm:p-4 flex flex-col justify-between shadow-[8px_14px_28px_rgba(0,0,0,0.45),inset_2.5px_2.5px_5px_rgba(110,231,183,0.2),inset_-3px_-3px_8px_rgba(1,24,15,0.6)]">
                                    <div>
                                      {/* Slot Header */}
                                      <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                                        <span className="bg-[#02180e] text-[#10B981] border border-[#0d3824] px-1.5 sm:px-2.5 py-0.5 rounded font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                          SLOT 01
                                        </span>
                                        <span className="bg-[#F59E0B] text-[#02140D] px-1.5 sm:px-2 py-0.5 rounded font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider truncate">
                                          ★ LEAD
                                        </span>
                                      </div>

                                      {/* Player Avatar & Details */}
                                      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-1.5 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
                                        <img
                                          src={currentUser?.avatar || myChar?.avatar || FALLBACK_AVATAR_IMG}
                                          alt={myName}
                                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_AVATAR_IMG; }}
                                          className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl border-2 border-[#10B981] object-cover flex-shrink-0"
                                        />
                                        <div className="min-w-0 flex-1 w-full">
                                          <p className="font-bold text-xs sm:text-sm text-white font-game truncate">
                                            {myName} <span className="text-[#10B981] font-mono font-bold text-[10px] sm:text-xs">(YOU)</span>
                                          </p>
                                          <p className="text-slate-400 font-mono text-[10px] sm:text-[11px] truncate mt-0.5">
                                            {myRoleData.name}
                                          </p>
                                          <p className="text-[#10B981] font-mono font-bold text-[10px] sm:text-xs mt-0.5 flex items-center justify-center sm:justify-start space-x-1 truncate">
                                            <span>&gt;_</span>
                                            <span>{myRoleData.title}</span>
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Status Footer */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 sm:pt-3 border-t border-[#0d3824]/60">
                                      <span className="hidden sm:inline text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                                        STATUS:
                                      </span>
                                      <button
                                        onClick={() => handleToggleReady(isReady)}
                                        className="w-full sm:w-auto bg-[#052818] hover:bg-[#083822] border border-[#10B981] text-[#10B981] font-mono text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1 cursor-pointer transition-all"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                        <span>READY TO DEPLOY</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* ── SLOTS 02, 03, 04: Real teammates first, AI fills only empty slots ── */}
                              {(() => {
                                let aiCursor = 0;
                                return [2, 3, 4].map((slotNumber, idx) => {
                                  const realPlayer = otherRealPlayers[idx];

                                  if (realPlayer) {
                                    const pName = realPlayer.playerName || realPlayer.username || 'Operative';
                                    const pRoleKey = realPlayer.role ? normalizeRoleKey(realPlayer.role) : 'hacker';
                                    const pRoleData = getRoleDetails(pRoleKey);
                                    const pChar = getCharByRoleKey(pRoleKey);
                                    const slotPad = '0' + slotNumber;

                                    return (
                                      <div
                                        key={slotNumber}
                                        className="rounded-2xl sm:rounded-3xl bg-[#03170e]/95 border border-white/20 p-3 sm:p-4 flex flex-col justify-between shadow-[8px_14px_28px_rgba(0,0,0,0.45),inset_2.5px_2.5px_5px_rgba(110,231,183,0.18),inset_-3px_-3px_8px_rgba(1,24,15,0.6)]"
                                      >
                                        <div>
                                          <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                                            <span className="bg-[#02180e] text-[#10B981] border border-[#0d3824] px-1.5 sm:px-2.5 py-0.5 rounded font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                              SLOT {slotPad}
                                            </span>
                                            <span className="bg-[#02180e] text-[#10B981] border border-[#0d3824] px-1.5 sm:px-2 py-0.5 rounded font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-wider">
                                              LIVE
                                            </span>
                                          </div>
                                          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-1.5 sm:space-y-0 sm:space-x-3 mb-2 sm:mb-3">
                                            <img
                                              src={pChar?.avatar || FALLBACK_AVATAR_IMG}
                                              alt={pName}
                                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_AVATAR_IMG; }}
                                              className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl border-2 border-[#10B981]/60 object-cover flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1 w-full">
                                              <p className="font-bold text-xs sm:text-sm text-white font-game truncate">{pName}</p>
                                              <p className="text-slate-400 font-mono text-[10px] sm:text-[11px] truncate mt-0.5">{pRoleData.name}</p>
                                              <p className="text-[#10B981] font-mono font-bold text-[10px] sm:text-xs mt-0.5 flex items-center justify-center sm:justify-start space-x-1 truncate">
                                                <span>&gt;_</span>
                                                <span>{pRoleData.title}</span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 sm:pt-3 border-t border-[#0d3824]/60">
                                          <span className="hidden sm:inline text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                                            STATUS:
                                          </span>
                                          <div className={`w-full sm:w-auto font-mono text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1 border ${
                                            realPlayer.isReady
                                              ? 'bg-[#052818] border-[#10B981] text-[#10B981]'
                                              : 'bg-[#2A1608] border-[#F59E0B]/60 text-[#F59E0B]'
                                          }`}>
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                            <span>{realPlayer.isReady ? 'READY' : 'STANDBY'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }

                                  const aiRoleKey = remainingAiRoles[aiCursor] || 'engineer';
                                  aiCursor += 1;
                                  const aiRoleData = getRoleDetails(aiRoleKey);
                                  const aiChar = getCharByRoleKey(aiRoleKey);
                                  const slotPad = '0' + slotNumber;
                                  const aiDisplayTitle = aiRoleKey === 'cryptographer' ? 'AI: The Cryptogr' : `AI: ${aiRoleData.title}`;

                                  return (
                                    <div
                                      key={slotNumber}
                                      className="rounded-2xl sm:rounded-3xl bg-[#03150d]/60 backdrop-blur-md border border-[#0d3824]/80 p-3 sm:p-4 flex flex-col justify-between hover:border-[#10B981]/40 transition-all shadow-md"
                                    >
                                      <div>
                                        {/* Slot Header */}
                                        <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                                          <span className="bg-[#02180e] text-[#10B981] border border-[#0d3824] px-1.5 sm:px-2.5 py-0.5 rounded font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                            SLOT {slotPad}
                                          </span>
                                          <span className="bg-[#07242d] text-[#38bdf8] border border-[#0c4a5e] px-1.5 sm:px-2 py-0.5 rounded font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                                            <span>🤖</span>
                                            <span>BOT</span>
                                          </span>
                                        </div>

                                        {/* AI Avatar & Details */}
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-1.5 sm:space-y-0 sm:space-x-3 mb-2">
                                          <img
                                            src={aiChar?.avatar || FALLBACK_AVATAR_IMG}
                                            alt={aiRoleData.title}
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_AVATAR_IMG; }}
                                            className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl border border-[#0d3824] object-cover flex-shrink-0"
                                          />
                                          <div className="min-w-0 flex-1 w-full">
                                            <p className="font-bold text-xs sm:text-sm text-white font-game truncate leading-tight">
                                              {aiDisplayTitle}
                                            </p>
                                            <p className="text-slate-400 font-mono text-[10px] sm:text-[11px] truncate mt-0.5">
                                              {aiRoleData.name}
                                            </p>
                                            
                                            {/* Role Select Dropdown */}
                                            <div className="mt-1 relative">
                                              <select
                                                value={aiRoleKey}
                                                disabled
                                                className="w-full bg-[#02140d]/60 backdrop-blur-sm border border-[#0d3824] rounded-lg py-0.5 px-2 text-[10px] sm:text-xs font-mono font-bold text-[#10B981] appearance-none cursor-default pr-5 truncate"
                                              >
                                                <option value={aiRoleKey}>{aiRoleData.title}</option>
                                              </select>
                                              <ChevronDown className="w-3 h-3 text-[#10B981] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Status Footer */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 sm:pt-3 border-t border-[#0d3824]/60">
                                        <span className="hidden sm:inline text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                                          STATUS:
                                        </span>
                                        <div className="w-full sm:w-auto bg-[#02180e] border border-[#0d3824] text-[#10B981] font-mono text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                          <span>READY</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}

                            </div>
                          </div>

                          {/* ══ SQUAD RADIO VOICE FREQUENCY BAR (Mobile-Optimized Grid Controls) ══ */}
                          <div className="bg-[#020E08]/60 backdrop-blur-md border border-emerald-800/50 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 relative z-10">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 sm:p-2.5 rounded-xl border transition-all shrink-0 ${
                                isLobbyVoiceConnected
                                  ? 'bg-[#042416] border-[#10B981] text-[#10B981] shadow-[0_0_12px_#10B98144]'
                                  : 'bg-[#020B06] border-slate-700 text-slate-500'
                              }`}>
                                <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5 sm:space-x-2">
                                  <span className="text-xs font-bold text-white font-game truncate">
                                    Radio: <span className="text-amber-300 font-mono text-[11px] sm:text-xs">142.85 MHz</span>
                                  </span>
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${isLobbyVoiceConnected ? 'bg-[#10B981] animate-ping' : 'bg-slate-600'}`} />
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5">
                                  <span className={isLobbyVoiceConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                    {isLobbyVoiceConnected ? '● LIVE' : '○ MUTED'}
                                  </span>
                                  <span>•</span>
                                  <span>{(lobby?.players || []).filter(p => p?.playerName || p?.username).length}/4 Linked</span>
                                </div>
                              </div>
                            </div>

                            {isLobbyVoiceConnected && !isLobbyMicMuted && (
                              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#020B06] rounded-xl border border-emerald-500/40 shadow-inner">
                                <span className="text-[10px] font-mono font-black text-emerald-400 mr-1.5">MIC AUDIO:</span>
                                {micVolumeBars.map((h, i) => (
                                  <span
                                    key={i}
                                    style={{ height: `${h}px` }}
                                    className="w-1 bg-[#10B981] rounded-full transition-all duration-75"
                                  />
                                ))}
                              </div>
                            )}

                            {/* 4 Voice Control Buttons: 4-Column Grid on Mobile, Flex on Desktop */}
                            <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center sm:space-x-2 w-full lg:w-auto">
                              <button
                                onClick={handleToggleMic}
                                className={`px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold font-game flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all min-h-[40px] ${
                                  isLobbyMicMuted
                                    ? 'bg-red-950/80 text-red-300 border border-red-800'
                                    : isUserSpeaking
                                    ? 'bg-[#063520] text-[#10B981] border-[#10B981] ring-1 ring-[#10B981]'
                                    : 'bg-[#042416] text-[#10B981] border border-emerald-700 hover:bg-[#073621]'
                                }`}
                                title={isLobbyMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                              >
                                {isLobbyMicMuted ? <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" /> : <Mic className="w-3.5 h-3.5 text-[#10B981] shrink-0" />}
                                <span className="truncate">{isLobbyMicMuted ? 'Muted' : 'Mic'}</span>
                              </button>

                              <button
                                onClick={handleToggleDeafen}
                                className={`px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold font-game flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all min-h-[40px] ${
                                  isLobbyDeafened
                                    ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                                    : 'bg-[#020B06] text-slate-300 border border-emerald-900/60 hover:text-white'
                                }`}
                                title={isLobbyDeafened ? "Undeafen Audio" : "Deafen Audio"}
                              >
                                {isLobbyDeafened ? <VolumeX className="w-3.5 h-3.5 text-purple-400 shrink-0" /> : <Headphones className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                                <span className="truncate">{isLobbyDeafened ? 'Deaf' : 'Audio'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  heistAudio.playRadioSquelch();
                                  toast.success("📻 Transmitting squad radio ping across all slots!");
                                }}
                                className="px-2 sm:px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold font-game bg-[#020B06] text-amber-300 border border-amber-900/60 hover:bg-amber-950/40 flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all min-h-[40px]"
                                title="Test Voice Channel Ping"
                              >
                                <Radio className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Ping</span>
                              </button>

                              <button
                                onClick={handleToggleVoice}
                                className={`px-2 sm:px-3 py-2 rounded-xl border flex items-center justify-center space-x-1 sm:space-x-1.5 transition-all min-h-[40px] ${
                                  isLobbyVoiceConnected
                                    ? 'bg-red-950/40 border-red-900/80 text-red-400 hover:bg-red-900/60'
                                    : 'bg-emerald-950 border-emerald-700 text-[#10B981]'
                                }`}
                                title={isLobbyVoiceConnected ? "Disconnect Voice Call" : "Connect Voice Call"}
                              >
                                {isLobbyVoiceConnected ? <PhoneOff className="w-3.5 h-3.5 shrink-0" /> : <PhoneCall className="w-3.5 h-3.5 shrink-0" />}
                                <span className="text-[10px] sm:text-xs font-bold font-game truncate">{isLobbyVoiceConnected ? 'End' : 'Join'}</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })()}

                    {/* Live Squad Tactical Radio & Chat Stream */}
                    <div className="bg-[#020B06] border border-emerald-900/60 rounded-2xl p-3.5 sm:p-5 space-y-3 relative z-10 shadow-2xl">
                      {/* Chat Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-emerald-950 pb-2.5 sm:pb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-950/90 border border-emerald-700/60 text-[#10B981] shrink-0">
                            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xs sm:text-sm font-bold text-white font-game uppercase tracking-wider">
                                Squad Tactical Comms &amp; Chat
                              </h3>
                              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                            </div>
                            <p className="text-[9px] sm:text-[10px] font-mono text-emerald-400/80 truncate">
                              ENCRYPTED FREQUENCY • {lobby.code ? `ROOM: ${lobby.code}` : 'SQUAD CHANNEL'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] font-mono">
                          <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border flex items-center space-x-1.5 ${
                            isLobbyVoiceConnected 
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                              : 'bg-[#051C12] text-slate-400 border-emerald-900/50'
                          }`}>
                            <Radio className="w-3 h-3 text-[#10B981]" />
                            <span>{isLobbyVoiceConnected ? 'VOICE LIVE' : 'VOICE STANDBY'}</span>
                          </span>
                          <span className="bg-[#042416] text-[#F59E0B] border border-amber-900/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold">
                            {radioMessages.length} MSGS
                          </span>
                        </div>
                      </div>

                      {/* Messages Feed */}
                      <div className="h-48 sm:h-64 overflow-y-auto space-y-2 bg-[#04160E]/90 p-2.5 sm:p-3.5 rounded-xl border border-emerald-950 font-mono text-xs shadow-inner custom-scrollbar">
                        {(!radioMessages || radioMessages.length === 0) ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-3 space-y-1.5 text-slate-400">
                            <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 animate-pulse" />
                            <p className="text-xs text-emerald-300 font-bold font-game">Tactical Frequency Clear</p>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-xs">
                              Coordinate role specializations, strategy, or test squad communications below.
                            </p>
                          </div>
                        ) : (
                          (radioMessages || []).map((msg, idx) => {
                            const isStringMsg = typeof msg === 'string';
                            const sender = isStringMsg ? 'OPERATIVE' : msg?.sender || 'OPERATIVE';
                            const text = isStringMsg ? msg : msg?.text || '';
                            const time = isStringMsg
                              ? 'NOW'
                              : (msg?.timestamp
                                  ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : msg?.time || 'NOW');
                            const roleKey = (isStringMsg ? 'hacker' : msg?.role || 'hacker').toLowerCase();

                            const roleBadgeStyle = 
                              roleKey.includes('hacker') ? 'text-[#10B981] bg-emerald-950/80 border-emerald-700/60' :
                              roleKey.includes('engineer') ? 'text-[#F59E0B] bg-amber-950/80 border-amber-700/60' :
                              roleKey.includes('scientist') ? 'text-[#0EA5E9] bg-cyan-950/80 border-cyan-700/60' :
                              roleKey.includes('cryptographer') || roleKey.includes('crypto') ? 'text-[#A855F7] bg-purple-950/80 border-purple-700/60' :
                              roleKey.includes('hq') ? 'text-[#F59E0B] bg-[#020B06] border-amber-500/50' :
                              'text-emerald-300 bg-emerald-950/60 border-emerald-800/40';

                            return (
                              <div 
                                key={idx} 
                                className="p-1.5 sm:p-2 rounded-lg bg-[#020B06]/70 border border-emerald-900/30 hover:border-emerald-700/50 transition-colors flex items-start justify-between gap-2"
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap gap-y-0.5">
                                    <span className={`text-[8px] sm:text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border font-mono ${roleBadgeStyle}`}>
                                      {sender}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
                                      [{time}]
                                    </span>
                                  </div>
                                  <p className="text-slate-100 text-[11px] sm:text-xs break-words leading-relaxed pl-0.5 pt-0.5">
                                    {text}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={lobbyChatEndRef} />
                      </div>

                      {/* Quick Tactical Macro Chips - Smooth Horizontal Scroll on Mobile */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1 flex-nowrap">
                        <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase shrink-0">
                          Macros:
                        </span>
                        {[
                          "🎯 Taking Hacker",
                          "🔧 Taking Engineer",
                          "🧪 Taking Scientist",
                          "🔐 Taking Crypto",
                          "🚀 Ready to launch!",
                          "🎙️ Mic check 5x5"
                        ].map((macro, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSendLobbyQuickMacro(macro)}
                            className="bg-[#042416] text-emerald-300 hover:text-white hover:bg-[#10B981] hover:border-emerald-400 border border-emerald-800/60 text-[10px] font-mono px-2.5 py-1 rounded-lg transition-all shrink-0 whitespace-nowrap"
                          >
                            {macro}
                          </button>
                        ))}
                      </div>

                      {/* Message Composer Input Form */}
                      <form onSubmit={handleSendLobbyRadio} className="flex gap-2 pt-1">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={lobbyRadioInput}
                            onChange={(e) => setLobbyRadioInput(e.target.value)}
                            placeholder={`Comms to squad room (${lobby.code || 'Squad'})...`}
                            className="w-full bg-[#051811] border border-emerald-800/80 rounded-xl pl-3 pr-8 sm:pr-10 py-2.5 text-xs font-mono text-emerald-100 placeholder-emerald-800/80 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!lobbyRadioInput.trim()}
                          className="bg-[#10B981] disabled:opacity-40 disabled:cursor-not-allowed text-[#02140D] font-bold px-3.5 sm:px-5 py-2.5 rounded-xl hover:bg-[#34D399] uppercase text-xs font-game flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950 transition-all shrink-0 min-h-[38px]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Transmit</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'characters' && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-7xl mx-auto text-left"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-emerald-800/40 pb-3 bg-[#071E14]/70 p-3.5 rounded-xl backdrop-blur-md">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center space-x-2 text-[#F0FDF4] font-game">
                    <Sparkles className="w-6 h-6 text-[#10B981]" />
                    <span>The 4 Specialized Heist Roles</span>
                  </h2>
                  <p className="text-emerald-200 text-xs sm:text-sm font-medium">Every role commands a crucial academic discipline and puzzle toolkit.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {characters.map(char => (
                  <div 
                    key={char.id}
                    className="forest-card p-3.5 space-y-3 flex flex-col justify-between fluid-card"
                  >
                    <div>
                      <div className="relative h-36 sm:h-40 border-2 border-[#03140C] rounded-lg overflow-hidden bg-[#03140C]">
                        <img 
                          src={char.avatar} 
                          alt={char.name} 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_AVATAR_IMG; }}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-[#10B981] text-[#02140D] font-black text-xs px-2.5 py-0.5 border border-[#03140C] uppercase font-mono rounded">
                          {char.role}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <h3 className="text-lg font-black text-[#F0FDF4] uppercase font-game">{char.name}</h3>
                        <p className="text-xs text-emerald-200/90 font-medium leading-relaxed line-clamp-2">{char.description}</p>
                        
                        <div className="bg-[#03140C] p-2 border border-[#0E3A28] rounded mt-2">
                          <p className="text-[9px] uppercase font-black text-[#F59E0B]">Special Grove Trait</p>
                          <p className="text-xs font-bold text-emerald-300 truncate">{char.specialAbility}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const roleMap = {
                          c1: 'hacker',
                          c2: 'engineer',
                          c3: 'scientist',
                          c4: 'cryptographer'
                        };
                        setActiveCockpitRole(roleMap[char.id] || 'hacker');
                        setActiveTab('liveheist');
                        toast.info(`Selected ${char.name} (${char.role})!`);
                      }}
                      className="w-full bg-[#10B981] text-[#02140D] font-black text-xs py-2.5 rounded-lg hover:bg-[#10B981] uppercase font-game fluid-btn shadow-md shadow-emerald-950 mt-2"
                    >
                      Enter Cockpit
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'topics' && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-7xl mx-auto text-left"
            >
              <GraphicalRoadmap 
                onStartHeist={(idx) => handleLaunchToLobby(idx)}
                onOpenModal={() => setIsRoadmapModalOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-7xl mx-auto text-left"
            >
              <div className="bg-[#051C12] border border-emerald-800/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#10B981] text-[#02140D] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded uppercase">
                      Tactical Map
                    </span>
                    <span className="text-xs font-mono text-emerald-300">
                      4 Sequential Vault Chambers
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-game">
                    Canopy Grove Mind Map
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Unlock and clear sequential security chambers of the World Tree sanctuary by answering tactical STEM checks.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 font-mono text-xs">
                  <div className="bg-[#020B06] px-3.5 py-2 rounded-xl border border-emerald-800/60 flex items-center space-x-1.5">
                    <span className="text-slate-400">Vault XP:</span>
                    <span className="text-[#10B981] font-bold">{currentUser?.xp ?? xp} XP</span>
                  </div>
                  <div className="bg-[#020B06] px-3.5 py-2 rounded-xl border border-amber-900/60 flex items-center space-x-1.5">
                    <span className="text-slate-400">Streak:</span>
                    <span className="text-amber-400 font-bold">{streak} 🔥</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { num: 1, name: "Roots of Logic", discipline: "Computer Science", color: "#10B981" },
                  { num: 2, name: "Prism Canopy", discipline: "Physics & Optics", color: "#F59E0B" },
                  { num: 3, name: "Caustic Bio-Vault", discipline: "Bio-Chemistry", color: "#60A5FA" },
                  { num: 4, name: "Nexus Mastermind", discipline: "Cryptography", color: "#A855F7" }
                ].map(chamber => {
                  const roomNum = chamber.num;
                  const q = triviaQuestions[roomNum];
                  const isUnlocked = isAloneInSquad || unlockedRooms.includes(roomNum);
                  const isDone = !!roomSolved[roomNum];

                  return (
                    <div 
                      key={roomNum}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-md ${
                        isDone 
                          ? 'bg-[#041C12] border-emerald-500/80' 
                          : isUnlocked 
                          ? 'bg-[#051C12] border-amber-400/60' 
                          : 'bg-[#020B06]/70 border-emerald-950 opacity-60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#020B06] border border-emerald-900" style={{ color: chamber.color }}>
                            CHAMBER 0{roomNum}
                          </span>
                          
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                            isDone ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                            isUnlocked ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                            'bg-slate-900 text-slate-500 border border-slate-800'
                          }`}>
                            {isDone ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                                <span>CLEARED</span>
                              </>
                            ) : isUnlocked ? (
                              <>
                                <Unlock className="w-3 h-3 text-[#F59E0B]" />
                                <span>READY</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-slate-500" />
                                <span>LOCKED</span>
                              </>
                            )}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-white font-game">{chamber.name}</h3>
                          <p className="text-[11px] font-mono text-emerald-400">{chamber.discipline}</p>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-sans pt-1">
                          {q?.question}
                        </p>

                        <div className="space-y-1.5 pt-2">
                          {q?.options.map((opt, oIdx) => {
                            const isCorrectOpt = isDone && oIdx === q.correct;
                            return (
                              <button
                                key={oIdx}
                                disabled={!isUnlocked || isDone}
                                onClick={() => {
                                  if (oIdx === q.correct) {
                                    heistAudio.playSuccessChime();
                                    setRoomSolved(prev => ({ ...prev, [roomNum]: true }));
                                    setUnlockedRooms(prev => [...new Set([...prev, roomNum + 1])]);
                                    setXp(prev => {
                                      const next = (typeof prev === 'number' ? prev : 1200) + 250;
                                      try { localStorage.setItem('kh_xp_sylvan', next.toString()); } catch {}
                                      return next;
                                    });
                                    if (currentUser) {
                                      const updatedXp = (currentUser.xp || 0) + 250;
                                      const updatedUser = {
                                        ...currentUser,
                                        xp: updatedXp,
                                        level: calculateLevel(updatedXp)
                                      };
                                      setCurrentUser(updatedUser);
                                      try { localStorage.setItem('vault_current_user', JSON.stringify(updatedUser)); } catch {}
                                      window.dispatchEvent(new CustomEvent('vault:user-updated', { detail: updatedUser }));
                                    }
                                    setXpFlyout({ amount: 250, id: Date.now() });
                                    setTimeout(() => setXpFlyout(null), 2800);

                                  } else {
                                    heistAudio.playAlarmSiren();

                                  }
                                }}
                                className={`w-full text-left p-2.5 rounded-lg text-xs font-mono border transition-all ${
                                  isCorrectOpt
                                    ? 'bg-[#10B981] text-[#02140D] font-bold border-[#10B981]'
                                    : isUnlocked && !isDone
                                    ? 'bg-[#020B06] text-slate-200 border-emerald-800/60 hover:bg-[#10B981] hover:text-[#02140D] hover:border-emerald-400 cursor-pointer'
                                    : 'bg-[#020B06]/50 text-slate-500 border-transparent cursor-not-allowed'
                                }`}
                              >
                                <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-emerald-950 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Bounty: +250 XP</span>
                        {isDone ? (
                          <span className="text-[#10B981] font-bold">✓ Gate Overridden</span>
                        ) : isUnlocked ? (
                          <span className="text-amber-300 font-bold">Select Answer 👆</span>
                        ) : (
                          <span>Requires Ch. 0{roomNum - 1}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="forest-card p-4 sm:p-6 space-y-4 fluid-card"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#03140C] pb-4">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-[#F0FDF4]">Heist Architect Workshop</h2>
                  <p className="text-emerald-200 text-sm">Design custom multi-stage educational heists and configure active squad roles.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomHeistModalOpen(true);
                    heistAudio.playKeyClick();
                  }}
                  className="bg-[#F59E0B] text-[#02140D] font-black px-5 py-2.5 border-[3px] border-[#03140C] shadow-[3px_3px_0px_#020C07] hover:bg-[#F59E0B] active:translate-x-0.5 uppercase flex items-center space-x-2 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Visual Heist Studio</span>
                </button>
              </div>

              <form onSubmit={handleSaveCustomMission} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Expedition Title</label>
                  <input
                    type="text"
                    required
                    value={builder.title}
                    onChange={e => setBuilder({ ...builder, title: e.target.value })}
                    placeholder="e.g. The Quantum Redwood Reactor"
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Discipline Category</label>
                    <select
                      value={builder.category}
                      onChange={e => setBuilder({ ...builder, category: e.target.value })}
                      className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                    >
                      <option>Forest Botany & Lore</option>
                      <option>Ecology & Sunlight</option>
                      <option>Computer Science & Logic</option>
                      <option>Applied Physics & Math</option>
                      <option>Ancient Earth & Archeology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Difficulty Tier</label>
                    <select
                      value={builder.difficulty}
                      onChange={e => setBuilder({ ...builder, difficulty: e.target.value })}
                      className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                    >
                      <option>Easy (Beginner)</option>
                      <option>Medium (Intermediate)</option>
                      <option>Master Expedition (Advanced)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Expedition Lore / Briefing</label>
                  <textarea
                    rows={3}
                    required
                    value={builder.description}
                    onChange={e => setBuilder({ ...builder, description: e.target.value })}
                    placeholder="Describe the target vault, storyline, and stakes..."
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Core Security Gate Question</label>
                  <input
                    type="text"
                    required
                    value={builder.question}
                    onChange={e => setBuilder({ ...builder, question: e.target.value })}
                    placeholder="e.g. Which pigment absorbs blue and red wavelengths of light for photosynthesis?"
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Correct Solution Answer</label>
                  <input
                    type="text"
                    required
                    value={builder.answer}
                    onChange={e => setBuilder({ ...builder, answer: e.target.value })}
                    placeholder="e.g. Chlorophyll a & b"
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={builderSaving}
                  className="bg-[#10B981] text-[#02140D] font-black py-3 px-8 border-[3px] border-[#03140C] shadow-[4px_4px_0px_#020C07] hover:bg-[#10B981] uppercase text-sm"
                >
                  {builderSaving ? "Compiling Blueprint..." : "Publish Expedition Blueprint"}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-7 h-7 text-[#10B981]" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#F0FDF4]">
                  Settings
                </h2>
              </div>

              {/* Sound */}
              <div className="forest-card p-5 space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>Sound</span>
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-200">Sound effects &amp; audio cues</span>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(v => !v)}
                    className={`w-12 h-6 flex items-center p-0.5 rounded-full transition-colors border-2 border-[#03140C] ${
                      soundEnabled ? 'bg-[#10B981]' : 'bg-[#0A261B]'
                    }`}
                    aria-label="Toggle Sound"
                  >
                    <span 
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                        soundEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* Atmospheric Background Video */}
              <div className="forest-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                      <Video className="w-4 h-4 text-[#10B981]" />
                      <span>Atmospheric Background Video</span>
                    </h3>
                    <p className="text-xs text-emerald-300/80 mt-1">
                      Live animated cinematic background (mobile &amp; desktop compatible)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBgVideoActive(v => !v);
                      heistAudio.playKeyClick();
                    }}
                    className={`w-12 h-6 flex items-center p-0.5 rounded-full transition-colors border-2 border-[#03140C] shrink-0 ${
                      bgVideoActive ? 'bg-[#10B981]' : 'bg-[#0A261B]'
                    }`}
                    aria-label="Toggle Background Video"
                  >
                    <span 
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                        bgVideoActive ? 'translate-x-6' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>

                {bgVideoActive && (
                  <div className="space-y-2 pt-2 border-t border-emerald-900/40">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Cinematic Video Feed
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBgVideo('cyber');
                          heistAudio.playKeyClick();
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedBgVideo === 'cyber'
                            ? 'bg-emerald-950/80 border-[#10B981] text-[#6EE7B7] shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                            : 'bg-[#020B06]/70 border-emerald-900/60 text-slate-400 hover:text-emerald-200 hover:border-emerald-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="font-game font-bold text-xs uppercase tracking-wide text-[#F0FDF4]">
                            Cyber Matrix
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          HD Holographic (backgroundnew.mp4)
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBgVideo('nature');
                          heistAudio.playKeyClick();
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedBgVideo === 'nature'
                            ? 'bg-emerald-950/80 border-[#10B981] text-[#6EE7B7] shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                            : 'bg-[#020B06]/70 border-emerald-900/60 text-slate-400 hover:text-emerald-200 hover:border-emerald-700'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <Trees className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="font-game font-bold text-xs uppercase tracking-wide text-[#F0FDF4]">
                            Bio-Reserve
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Atmospheric Foliage (nature.mp4)
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Screen Shake Haptics Setting */}
              <div className="forest-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-[#10B981]" />
                      <span>Screen Shake Tremor (Haptic UI)</span>
                    </h3>
                    <p className="text-xs text-emerald-300/80 mt-1">
                      Dynamic tactical shake on security alarms and puzzle milestones (toggle off for stationary comfort)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenShakeEnabled(v => {
                        const next = !v;
                        try { localStorage.setItem('vault_screen_shake', String(next)); } catch {}
                        return next;
                      });
                      heistAudio.playKeyClick();
                    }}
                    className={`w-12 h-6 flex items-center p-0.5 rounded-full transition-colors border-2 border-[#03140C] shrink-0 ${
                      screenShakeEnabled ? 'bg-[#10B981]' : 'bg-[#0A261B]'
                    }`}
                    aria-label="Toggle Screen Shake"
                  >
                    <span 
                      className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                        screenShakeEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* Replay Tutorial Option */}
              <div className="forest-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#10B981]" />
                    <span>Replay Tutorial</span>
                  </h3>
                  <span className="bg-[#10B981]/20 text-[#6EE7B7] text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-500/30 uppercase">
                    Briefing Tour
                  </span>
                </div>
                <p className="text-sm text-emerald-200/90 leading-relaxed">
                  Restart the interactive 7-step onboarding tutorial. Walks through the 4 specialist roles, interdependence puzzle relays, HUD controls, and game modes.
                </p>
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    Takes ~60 seconds &bull; Can be skipped anytime
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetTour();
                      setActiveTab('home');
                      setTimeout(() => {
                        setShowTour(true);
                      }, 200);
                      heistAudio.playKeyClick();
                      toast.info("🎯 Launching Mission Briefing Tutorial...");
                    }}
                    className="bg-[#10B981] text-[#02140D] font-mono font-black text-xs px-5 py-2.5 border-[2.5px] border-[#03140C] shadow-[3px_3px_0px_#020C07] hover:bg-[#10B981] active:translate-x-0.5 active:translate-y-0.5 uppercase transition-all flex items-center space-x-2 rounded whitespace-nowrap self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Replay Tutorial</span>
                  </button>
                </div>
              </div>

              {/* Account: change password */}
              {currentUser && (
                <div className="forest-card p-5 space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                    <KeyRound className="w-4 h-4" />
                    <span>Change Password</span>
                  </h3>
                  <input
                    type="password"
                    value={currentPasswordInput}
                    onChange={e => setCurrentPasswordInput(e.target.value)}
                    placeholder="Current password"
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-2.5 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none rounded-lg"
                  />
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    placeholder="New password (min. 8 characters)"
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-2.5 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none rounded-lg"
                  />
                  <input
                    type="password"
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-2.5 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none rounded-lg"
                  />
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="w-full bg-[#10B981] text-[#02140D] font-black py-2.5 border-[3px] border-[#03140C] shadow-[3px_3px_0px_#020C07] hover:bg-[#0EA271] uppercase text-xs disabled:opacity-50 rounded-lg"
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              )}

              {/* Notification preferences */}
              {currentUser && (
                <div className="forest-card p-5 space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </h3>
                  {[
                    { key: 'heistInvites', label: 'Heist invites from squadmates' },
                    { key: 'friendRequests', label: 'Friend requests' },
                    { key: 'weeklySummary', label: 'Weekly progress summary email' }
                  ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between">
                      <span className="text-sm text-emerald-200">{pref.label}</span>
                      <button
                        type="button"
                        onClick={() => setNotifPrefs(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                        className={`w-12 h-6 flex items-center p-0.5 rounded-full transition-colors border-2 border-[#03140C] ${
                          notifPrefs[pref.key] ? 'bg-[#10B981]' : 'bg-[#0A261B]'
                        }`}
                        aria-label={`Toggle ${pref.label}`}
                      >
                        <span 
                          className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                            notifPrefs[pref.key] ? 'translate-x-6' : 'translate-x-0'
                          }`} 
                        />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleSaveNotificationPrefs}
                    disabled={isSavingPrefs}
                    className="w-full bg-[#10B981] text-[#02140D] font-black py-2.5 border-[3px] border-[#03140C] shadow-[3px_3px_0px_#020C07] hover:bg-[#0EA271] uppercase text-xs disabled:opacity-50 rounded-lg"
                  >
                    {isSavingPrefs ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}

              {/* Vault Themes — full cosmetic color schemes */}
              <div className="forest-card p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Vault Themes</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[var(--vault-primary)] text-white bg-[var(--vault-theme-bg)] shadow-sm">
                    ACTIVE: {(VAULT_THEMES.find(t => t.id === (currentUser?.equippedTheme || equippedThemeId || 'default'))?.name || 'Forest Ranger').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80">
                  Select an operative syndicate color palette to customize your cockpit, buttons, telemetry, and cyber HUD.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VAULT_THEMES.map(theme => {
                    const currentActiveTheme = currentUser?.equippedTheme || equippedThemeId || 'default';
                    const isEquipped = currentActiveTheme === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleEquipTheme(theme.id)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isEquipped
                            ? 'border-[var(--vault-primary)] bg-[#042416] shadow-lg ring-1 ring-[var(--vault-primary)]'
                            : 'border-[#03140C] bg-[#020B06] hover:border-emerald-600/70 hover:bg-[#03180F]'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="flex space-x-1.5 flex-shrink-0 p-1.5 rounded-xl bg-[#010804] border border-white/10 shadow-inner">
                            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: theme.accent }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase text-white font-game truncate leading-tight">
                              {theme.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{theme.unlockText}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquipTheme(theme.id);
                          }}
                          disabled={isEquipped || isEquippingTheme === theme.id}
                          className={`text-[10px] font-black uppercase px-3.5 py-1.5 rounded-xl border font-mono transition-all flex-shrink-0 shadow-sm ${
                            isEquipped
                              ? 'bg-[#10B981] text-[#02140D] border-[#10B981] font-black cursor-default'
                              : 'bg-[#062417] text-white hover:bg-[#10B981] hover:text-[#02140D] border-emerald-700/60'
                          } disabled:opacity-90`}
                        >
                          {isEquipped ? 'Equipped ✓' : isEquippingTheme === theme.id ? '...' : 'Equip'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skill Tree — spend points earned from leveling up on role perks */}
              {currentUser && (
                <div className="forest-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#F59E0B] flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Skill Tree</span>
                    </h3>
                    <span className="text-xs font-mono font-black text-emerald-300">
                      {currentUser.skillPoints || 0} pt{(currentUser.skillPoints || 0) === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/70">
                    Earn 1 skill point every time you level up. Perks apply while you're playing that role.
                  </p>
                  <div className="space-y-2.5">
                    {PERKS.map(perk => {
                      const isUnlocked = (currentUser.unlockedPerks || []).includes(perk.id);
                      const canAfford = (currentUser.skillPoints || 0) >= perk.cost;
                      const roleConfig = ROLE_CONFIGS.find(r => r.key === perk.role);
                      return (
                        <div key={perk.id} className="flex items-center justify-between p-3 border-2 border-[#03140C] bg-[#020B06]">
                          <div className="flex items-center space-x-3">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: roleConfig?.color || '#10B981' }} />
                            <div>
                              <p className="text-xs font-black uppercase text-emerald-100">{perk.name}</p>
                              <p className="text-[10px] text-emerald-400/70">{perk.desc}</p>
                            </div>
                          </div>
                          {isUnlocked ? (
                            <span className="text-[10px] font-black uppercase text-[#10B981] flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Unlocked</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleUnlockPerk(perk.id)}
                              disabled={!canAfford || isUnlockingPerk === perk.id}
                              className={`text-[10px] font-black uppercase px-3 py-1.5 border-2 border-[#03140C] ${
                                canAfford
                                  ? 'bg-[#F59E0B] text-[#02140D] hover:bg-[#F59E0B]'
                                  : 'bg-[#0A261B] text-emerald-700 cursor-not-allowed'
                              } disabled:opacity-60`}
                            >
                              {isUnlockingPerk === perk.id ? '...' : `${perk.cost} pt`}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Account actions */}
              {currentUser ? (
                <div className="forest-card p-5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-[#3B0D14] text-[#FCA5A5] font-black py-2.5 border-[3px] border-[#03140C] shadow-[3px_3px_0px_#020C07] hover:bg-[#4C0F1A] uppercase text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="forest-card p-5 text-center space-y-2">
                  <p className="text-sm text-emerald-200">Sign in to manage your account settings.</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-[#F59E0B] text-[#02140D] font-black py-2 px-6 border-[3px] border-[#03140C] shadow-[3px_3px_0px_#020C07] hover:bg-[#F59E0B] uppercase text-xs"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'waitlist' && (
            <motion.div 
              key="waitlist"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="forest-card p-6 sm:p-8 space-y-6 max-w-2xl mx-auto text-center"
            >
              <Rocket className="w-12 h-12 text-[#F59E0B] mx-auto animate-bounce" />
              <h2 className="text-3xl font-black uppercase tracking-tight text-[#F0FDF4]">
                The Syndicate Battle Pass
              </h2>
              <p className="text-emerald-200 text-sm">
                Unlock exclusive cosmetic terminal skins, custom laser beam colors, specialized sound packs, and weekly high-stakes raid tournaments!
              </p>

              {waitlistSuccess ? (
                <div className="p-4 bg-[#0A3020] border-2 border-[#10B981] text-[#10B981] font-mono font-black text-sm">
                  🎉 Priority Syndicate Pass Access Reserved! Check your inbox for briefing credentials.
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!emailInput.trim()) return;
                    setWaitlistSuccess(true);
                    heistAudio.playSuccessChime();
                    toast.success("Syndicate Pass reservation confirmed!");
                  }} 
                  className="space-y-3"
                >
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="Enter your student or ranger email..."
                    className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none text-center"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#F59E0B] text-[#02140D] font-black py-3 border-[3px] border-[#03140C] shadow-[4px_4px_0px_#020C07] hover:bg-[#F59E0B] uppercase text-sm"
                  >
                    Claim Syndicate Pass
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <StatsDashboard
                currentUser={currentUser}
                loyaltyPoints={loyaltyPoints}
                onLogout={handleLogout}
                onStartHeist={(idx) => handleLaunchToLobby(idx)}
                onUpdateUser={(updated) => {
                  setCurrentUser(prev => prev ? { ...prev, ...updated } : prev);
                }}
                onNavigate={(dest) => {
                  if (dest === 'login') {
                    setIsAuthModalOpen(true);
                  } else {
                    navigateToTab(dest);
                  }
                }}
              />
            </motion.div>
          )}

          </AnimatePresence>
        </main>
          </div>
        </div>

        {/* ── Mobile Floating Glass Bottom Navigation Dock ── */}
        {currentUser && activeTab !== 'liveheist' && (
          <nav 
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#051811]/92 backdrop-blur-2xl border-t border-emerald-500/30 px-2 py-2 shadow-[0_-8px_32px_rgba(0,0,0,0.7)]"
            style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
            aria-label="Mobile Navigation Dock"
          >
            <div className="flex items-center justify-around max-w-md mx-auto">
              {[
                { id: 'home', label: 'HQ', icon: Home },
                { id: 'missions', label: 'Missions', icon: Compass },
                { id: 'lobby', label: 'Lobby', icon: Users },
                { id: 'characters', label: 'Roles', icon: Zap },
                { id: 'stats', label: 'Dossier', icon: BarChart3 },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isHeistLocked && tab.id !== 'liveheist') {
                        toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
                        return;
                      }
                      navigateToTab(tab.id);
                      heistAudio.playKeyClick();
                    }}
                    className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                      isActive 
                        ? 'text-emerald-400 bg-emerald-500/15 border border-white/20 shadow-[3px_4px_10px_rgba(0,0,0,0.35),inset_1.5px_1.5px_3px_rgba(110,231,183,0.3),inset_-2px_-2px_4px_rgba(1,24,15,0.5)]' 
                        : 'text-slate-400 hover:text-emerald-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                    <span className={`text-[10px] font-mono tracking-wider mt-0.5 ${isActive ? 'font-black text-emerald-300' : 'font-semibold text-slate-400'}`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -bottom-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B06]/80 backdrop-blur-sm animate-fade-in">
          <div className="forest-card max-w-md w-full p-6 space-y-5 border-[4px] border-[#03140C] bg-[#051811] shadow-[8px_8px_0px_#020C07]">
            <div className="flex justify-between items-center border-b-2 border-[#03140C] pb-3">
              <h3 className="text-xl font-black uppercase text-[#F0FDF4]">Claim Ranger Slot 0{targetSlotId}</h3>
              <button onClick={() => setIsJoinModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleJoinLobbySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Ranger Codename</label>
                <input
                  type="text"
                  required
                  value={joinPlayerName}
                  onChange={e => setJoinPlayerName(e.target.value)}
                  placeholder="e.g. Agent Willow"
                  className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-emerald-300 mb-1">Select Role</label>
                <select
                  value={joinRole}
                  onChange={e => {
                    setJoinRole(e.target.value);
                    const charMap = {
                      'Canopy Hacker': 'c1',
                      'Woodland Safecracker': 'c2',
                      'Flora Historian': 'c3',
                      'Mist Infiltrator': 'c4'
                    };
                    setJoinCharacterId(charMap[e.target.value] || 'c1');
                  }}
                  className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none"
                >
                  <option>Canopy Hacker</option>
                  <option>Woodland Safecracker</option>
                  <option>Flora Historian</option>
                  <option>Mist Infiltrator</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#10B981] text-[#02140D] font-black py-3 border-[3px] border-[#03140C] shadow-[4px_4px_0px_#020C07] hover:bg-[#10B981] uppercase text-sm"
              >
                Confirm Squad Slot
              </button>
            </form>
          </div>
        </div>
      )}

      <CreateCustomHeistModal
        isOpen={isCustomHeistModalOpen}
        onClose={() => setIsCustomHeistModalOpen(false)}
        onSaveHeist={handleSaveCustomHeist}
        onLaunchCustomHeist={handleLaunchCustomHeist}
      />

      <SkillAnalyticsModal
        key={analyticsKey}
        isOpen={analyticsModalOpen}
        isVictory={isMatchVictory}
        stageTitle={currentStageData.title}
        stats={analyticsStats}
        stageData={currentStageData}
        solvedRoles={currentStageSolved}
        currentUser={currentUser}
        lobby={lobby}
        activeCockpitRole={activeCockpitRole}
        totalCareerXp={currentUser?.xp ?? xp ?? 1200}
        onOpenRoadmap={() => {
          setIsRoadmapModalOpen(true);
        }}
        onNextStage={() => {
          setAnalyticsModalOpen(false);
          const amount = lastEarnedXp || 1600;
          setXpFlyout({ amount, id: Date.now() });
          setTimeout(() => setXpFlyout(null), 2800);
          heistAudio.playSuccessChime();
          const nextIdx = (currentStageIdx + 1) % allStages.length;
          handleStartHeistStage(nextIdx);
        }}
        onRetry={() => {
          setAnalyticsModalOpen(false);
          handleStartHeistStage(currentStageIdx);
        }}
        onReturnToLobby={() => {
          setAnalyticsModalOpen(false);
          const amount = lastEarnedXp || 1600;
          setXpFlyout({ amount, id: Date.now() });
          setTimeout(() => setXpFlyout(null), 2800);
          heistAudio.playSuccessChime();
          setAlarmLevel('LOW_SECURITY');
          setAlarmFails(0);
          setHeistAttemptSeed('');
          setActivePuzzleOverrides(null);
          setActiveTab('lobby');
        }}
      />

      <RemediationRoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        stageData={currentStageData}
        solvedRoles={currentStageSolved}
        alarmFails={alarmFails}
        onRetryWithHints={() => {
          setIsRoadmapModalOpen(false);
          setAnalyticsModalOpen(false);
          handleStartHeistStage(currentStageIdx);
          setTimeLeft(prev => prev + 60);
          toast.success("💡 Tactical retry initiated with +60s bonus time!");
        }}
      />

      {endHeistVoteState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B06]/75 backdrop-blur-xl animate-fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 space-y-6 border-4 border-[#042416]/90 bg-[#0D4A32]/85 backdrop-blur-2xl rounded-[36px] shadow-[10px_10px_0px_#03140C] text-left relative overflow-hidden text-white animate-cartoon-pop">
            
            <div className="absolute inset-0 bg-[radial-gradient(#10B98125_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none opacity-80" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center space-x-1.5 bg-[#EF4444] text-white font-mono font-black text-xs px-3 py-1 rounded-xl uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] rotate-[1.5deg]">
                <Shield className="w-3.5 h-3.5 fill-current" />
                <span>Squad Vote Required</span>
              </div>
              
              <h2 className="text-2xl font-black uppercase tracking-tight font-game">
                {endHeistVoteState.proposedBy} wants to {endHeistVoteState.directive === 'abort' ? 'Abort' : 'End'} the Heist!
              </h2>
              
              <div className="flex flex-col space-y-1 font-mono text-sm">
                <div className="flex justify-between text-[#A7F3D0]">
                  <span>Majority Required:</span>
                  <span className="font-bold text-[#FDE047]">{endHeistVoteState.requiredVotes} Votes</span>
                </div>
                <div className="flex justify-between text-[#A7F3D0]">
                  <span>Current YES Votes:</span>
                  <span className="font-bold text-[#10B981]">{endHeistVoteState.yesVotes.length}</span>
                </div>
                <div className="flex justify-between text-[#A7F3D0]">
                  <span>Current NO Votes:</span>
                  <span className="font-bold text-[#EF4444]">{endHeistVoteState.noVotes.length}</span>
                </div>
              </div>

              {!endHeistVoteState.yesVotes.includes(activeSocket?.id) && !endHeistVoteState.noVotes.includes(activeSocket?.id) ? (
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => activeSocket?.emit('heist:vote-end', { roomCode: lobby?.code, vote: 'yes' })}
                    className="flex-1 bg-[#10B981] text-[#02140D] font-black py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:bg-[#10B981] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase font-game"
                  >
                    VOTE YES
                  </button>
                  <button
                    onClick={() => activeSocket?.emit('heist:vote-end', { roomCode: lobby?.code, vote: 'no' })}
                    className="flex-1 bg-[#EF4444] text-white font-black py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:bg-[#EF4444] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase font-game"
                  >
                    VOTE NO
                  </button>
                </div>
              ) : (
                <div className="pt-4 text-center text-[#A7F3D0] font-mono font-bold animate-pulse">
                  Waiting for other squad members to vote...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isEndHeistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B06]/75 backdrop-blur-xl animate-fade-in">
          <div className="max-w-xl w-full p-6 sm:p-8 space-y-6 border-4 border-[#042416]/90 bg-[#0D4A32]/55 backdrop-blur-2xl rounded-[36px] shadow-[10px_10px_0px_#03140C] text-left relative overflow-hidden text-white animate-cartoon-pop">
            
            {/* Playful Ambient Background Dots & Frost Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#10B98125_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none opacity-80" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Cartoon Header */}
            <div className="flex items-start justify-between gap-4 border-b-4 border-[#042416]/80 pb-5 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 bg-[#FDE047] text-[#02140D] font-mono font-black text-xs px-3 py-1 rounded-xl uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] rotate-[-1.5deg] animate-badge-bounce">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>HQ Tactical Broadcast</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-game drop-shadow-md">
                  Conclude Mission, Agent?
                </h2>
                <p className="text-[#A7F3D0] text-xs sm:text-sm font-medium leading-relaxed">
                  Currently infiltrating <span className="bg-[#06291B]/90 backdrop-blur-sm text-[#FDE047] px-2.5 py-0.5 rounded-lg border border-[#10B981]/60 font-mono font-bold">{currentStageData.title}</span>. Choose an exit directive:
                </p>
              </div>

              <button 
                onClick={() => setIsEndHeistModalOpen(false)} 
                className="w-10 h-10 rounded-2xl bg-[#06291B]/90 hover:bg-[#EF4444] text-white border-2 border-black font-black text-sm flex items-center justify-center shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all backdrop-blur-sm"
                title="Resume Heist"
              >
                ✕
              </button>
            </div>

            {/* Frosted Cartoon Directive Option Cards */}
            <div className="space-y-4 relative z-10 font-mono">
              {(() => {
                const inSquad = lobby && lobby.players && lobby.players.length > 1;

                return (
                  <React.Fragment key="directives">
                    {/* Option 1: Claim Loot & Debrief (Frosted Jade & Gold) */}
                    <div
                      onClick={() => handleConcludeHeist('debrief')}
                className="p-4 sm:p-5 rounded-3xl border-3 border-[#052817]/90 bg-[#135C3E]/80 hover:bg-[#18704C]/90 backdrop-blur-md shadow-[5px_5px_0px_#03180E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FDE047] border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:animate-icon-wobble transition-transform">
                    🏆
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-base sm:text-lg text-white font-game group-hover:text-[#FDE047] transition-colors">
                        {inSquad ? 'PROPOSE: CLAIM LOOT & DEBRIEF' : 'CLAIM LOOT & DEBRIEF'}
                      </h3>
                      <span className="text-[10px] bg-[#10B981] text-[#02140D] font-black px-2 py-0.5 rounded-md border border-black hidden sm:inline-block">
                        +XP
                      </span>
                    </div>
                    <p className="text-xs text-[#D1FAE5] font-medium mt-0.5">
                      Save stage progress, inspect telemetry & log victory stats!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-[#10B981]/90 hover:bg-[#10B981] text-[#02140D] font-black text-xs px-4 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] uppercase font-game transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 group-hover:shadow-[4px_4px_0px_#000] backdrop-blur-sm"
                >
                  <span>Claim Loot</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Option 2: Emergency Abort (Frosted Crimson & Coral) */}
              <div
                onClick={() => handleConcludeHeist('abort')}
                className="p-4 sm:p-5 rounded-3xl border-3 border-[#2E0B12]/90 bg-[#4D1420]/80 hover:bg-[#631B2B]/90 backdrop-blur-md shadow-[5px_5px_0px_#1B060B] active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#EF4444] border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 group-hover:animate-icon-wobble transition-transform">
                    🚨
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-black text-base sm:text-lg text-white font-game group-hover:text-[#FDA4AF] transition-colors">
                        {inSquad ? 'PROPOSE: EMERGENCY EJECT' : 'EMERGENCY EJECT (ABORT)'}
                      </h3>
                      <span className="text-[10px] bg-[#881337] text-[#FECDD3] font-bold px-2 py-0.5 rounded-md border border-[#BE123C] hidden sm:inline-block">
                        RETREAT
                      </span>
                    </div>
                    <p className="text-xs text-[#FECDD3] font-medium mt-0.5">
                      Hit the emergency exfil button and retreat to HQ base.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-[#EF4444]/90 hover:bg-[#EF4444] text-white font-black text-xs px-4 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] uppercase font-game transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 group-hover:shadow-[4px_4px_0px_#000] backdrop-blur-sm"
                >
                  <span>Abort Mission</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {inSquad && (
                <div
                  onClick={() => {
                    handleRequestLeaveSquad();
                    heistAudio.playKeyClick();
                  }}
                  className="p-4 sm:p-5 rounded-3xl border-3 border-[#2E0B12]/90 bg-[#3B111B]/85 hover:bg-[#4D1420]/95 backdrop-blur-md shadow-[5px_5px_0px_#1B060B] active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#EF4444] border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:animate-icon-wobble transition-transform">
                      🏃
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-base sm:text-lg text-white font-game group-hover:text-[#FDA4AF] transition-colors">
                          LEAVE SQUAD (SOLO EXFIL)
                        </h3>
                        <span className="text-[10px] bg-[#881337] text-[#FECDD3] font-bold px-2 py-0.5 rounded-md border border-[#BE123C] hidden sm:inline-block">
                          −25 LP PENALTY
                        </span>
                      </div>
                      <p className="text-xs text-[#FECDD3] font-medium mt-0.5">
                        Abandon your teammates mid-heist and exit the operation alone (−25 LP).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="bg-[#EF4444]/90 hover:bg-[#EF4444] text-white font-black text-xs px-4 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] uppercase font-game transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 group-hover:shadow-[4px_4px_0px_#000] backdrop-blur-sm"
                  >
                    <span>Leave Heist</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              )}

                </React.Fragment>
              );
            })()}
            </div>

            {/* Frosted Cartoon Footer / Resume Button */}
            <div className="pt-2 relative z-10 font-mono">
              <button
                onClick={() => setIsEndHeistModalOpen(false)}
                className="w-full bg-[#06291B]/85 hover:bg-[#0A3D29]/95 backdrop-blur-md text-[#10B981] hover:text-[#10B981] font-black py-3.5 rounded-2xl border-2 border-[#10B981]/60 shadow-[4px_4px_0px_#03180E] text-xs font-game uppercase transition-all flex items-center justify-center space-x-2 active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>🎮 ← KEEP PLAYING (RESUME MISSION)</span>
              </button>
            </div>

          </div>
        </div>
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Join Multiplayer Squad Room Modal */}
      {isJoinRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#020B06]/85 backdrop-blur-md animate-fade-in">
          <div className="forest-card max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-5 rounded-2xl border-2 sm:border-[4px] border-[#03140C] bg-[#051811] shadow-[8px_8px_0px_#020C07]">
            <div className="flex justify-between items-center border-b-2 border-[#03140C] pb-3">
              <div className="flex items-center space-x-2">
                <LogIn className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-lg sm:text-xl font-black uppercase text-[#F0FDF4]">Join Squad Room</h3>
              </div>
              <button 
                onClick={() => setIsJoinRoomModalOpen(false)} 
                className="text-slate-400 hover:text-white font-bold text-lg p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-emerald-300 mb-1 uppercase">Enter Room Code</label>
                <input
                  type="text"
                  required
                  value={joinRoomCodeInput}
                  onChange={e => setJoinRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. HEIST-782"
                  className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-[#F59E0B] font-mono font-bold text-base tracking-widest uppercase focus:border-[#10B981] outline-none rounded-xl"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                💡 Entering a valid squad room code will instantly link your specialist terminal and calibrate encrypted radio frequencies with all 4 teammates.
              </div>

              <button
                type="submit"
                className="w-full bg-[#10B981] text-[#02140D] font-black py-3 border-[3px] border-[#03140C] shadow-[4px_4px_0px_#020C07] hover:bg-[#34D399] uppercase text-sm font-game flex items-center justify-center space-x-2 transition-all rounded-xl min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Connect to Squad Room</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create New Squad Room Modal */}
      {isCreateRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#020B06]/85 backdrop-blur-md animate-fade-in">
          <div className="forest-card max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-5 rounded-2xl border-2 sm:border-[4px] border-[#03140C] bg-[#051811] shadow-[8px_8px_0px_#020C07]">
            <div className="flex justify-between items-center border-b-2 border-[#03140C] pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-lg sm:text-xl font-black uppercase text-[#F0FDF4]">Create Squad Room</h3>
              </div>
              <button 
                onClick={() => setIsCreateRoomModalOpen(false)} 
                className="text-slate-400 hover:text-white font-bold text-lg p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-emerald-300 mb-1 uppercase">Squad Operation Name</label>
                <input
                  type="text"
                  value={createRoomTitleInput}
                  onChange={e => setCreateRoomTitleInput(e.target.value)}
                  placeholder="e.g. The Quantum Core Strike Squad"
                  className="w-full bg-[#020B06] border-2 border-[#03140C] p-3 text-emerald-100 font-mono text-sm focus:border-[#10B981] outline-none rounded-xl"
                />
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                ⚡ You will be assigned as Host (Squad Leader) with full clearance to manage slots, adjust roles, and initiate synchronized launch.
              </div>

              <button
                type="button"
                onClick={() => handleCreateNewRoom(createRoomTitleInput)}
                className="w-full bg-[#10B981] text-[#02140D] font-black py-3 border-[3px] border-[#03140C] shadow-[4px_4px_0px_#020C07] hover:bg-[#34D399] uppercase text-sm font-game flex items-center justify-center space-x-2 transition-all rounded-xl min-h-[44px]"
              >
                <Rocket className="w-4 h-4" />
                <span>Initialize Multiplayer Room</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Synchronized Squad Launch Countdown HUD Overlay */}
      {isLaunchingCountdown && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020B06]/95 backdrop-blur-lg animate-fade-in select-none">
          <div className="text-center space-y-6 max-w-lg p-8">
            <div className="inline-flex items-center space-x-2 bg-emerald-950 border border-emerald-500/80 px-4 py-1.5 rounded-full text-emerald-300 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span>SYNCHRONIZING SQUAD EXTRACTION</span>
            </div>

            <div className="relative my-6">
              <div className="text-9xl font-black font-game text-[#10B981] drop-shadow-[0_0_35px_#10B981aa] animate-bounce">
                {launchCountdown}
              </div>
              <div className="text-xs font-mono text-emerald-400 mt-2 tracking-wider">
                CALIBRATING COCKPITS IN T-MINUS {launchCountdown}s
              </div>
            </div>

            <div className="space-y-2 text-slate-300 text-sm font-mono">
              <p>Transmitting mission parameters to all 4 squad terminals...</p>
              <div className="w-64 mx-auto bg-[#051C12] h-2 rounded-full overflow-hidden border border-emerald-900">
                <div 
                  className="bg-[#10B981] h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${Math.max(0, Math.min(100, ((4 - launchCountdown) / 3) * 100))}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLaunchingCountdown(false);
                  if (activeTabRef.current !== 'liveheist') {
                    handleStartHeistStage(0, true);
                  }
                }}
                className="text-xs font-mono text-emerald-400/80 hover:text-emerald-300 underline underline-offset-4 cursor-pointer transition-colors"
              >
                Skip Countdown &amp; Enter Cockpit Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operative Directory & Unique ID Search Modal */}
      <OperativeDirectoryModal
        isOpen={isAgentDirectoryOpen}
        onClose={() => setIsAgentDirectoryOpen(false)}
        currentUser={currentUser}
        currentLobbyCode={lobby?.code}
        onInviteToLobby={(op) => {
          if (lobby?.code) {
            lobbySocket.sendRadioMessage(lobby.code, `[DISPATCH] Squad invitation routed to ${op.callsign} (${op.agentId})`, 'hq');
          }
        }}
        onUpdateUser={(updated) => {
          setCurrentUser(prev => prev ? { ...prev, ...updated } : prev);
        }}
      />

      {/* ── Deserter Warning Modal (shown instead of leave modal mid-heist or in lobby) ── */}
      <DeserterWarningModal
        isOpen={isDeserterWarningOpen}
        isHeistActive={deserterWarningIsHeistActive}
        roomCode={lobby?.code || lobby?.roomCode}
        onConfirmLeave={handleConfirmLeaveSquad}
        onCancel={() => {
          setIsDeserterWarningOpen(false);
          heistAudio.playKeyClick();
        }}
      />

      {/* Leave Squad Confirmation Modal (Styled per Tactical Broadcast Blueprint) */}
      <AnimatePresence>
        {isLeaveSquadModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B06]/75 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.8 }}
              className="max-w-xl w-full p-6 sm:p-8 space-y-6 border-4 border-[#042416]/90 bg-[#0D4A32]/55 backdrop-blur-2xl rounded-[36px] shadow-[10px_10px_0px_#03140C] text-left relative overflow-hidden text-white"
            >
              {/* Playful Ambient Background Dots & Frost Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(#10B98125_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none opacity-80" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Cartoon Header */}
              <div className="flex items-start justify-between gap-4 border-b-4 border-[#042416]/80 pb-5 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 bg-[#FDE047] text-[#02140D] font-mono font-black text-xs px-3 py-1 rounded-xl uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] rotate-[-1.5deg] animate-badge-bounce">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>HQ TACTICAL BROADCAST</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-game drop-shadow-md">
                    LEAVE SQUAD, AGENT?
                  </h2>
                  <p className="text-[#A7F3D0] text-xs sm:text-sm font-medium leading-relaxed">
                    Currently assembled in <span className="bg-[#06291B]/90 backdrop-blur-sm text-[#FDE047] px-2.5 py-0.5 rounded-lg border border-[#10B981]/60 font-mono font-bold">Room {lobby?.code || 'SQUAD'}</span>. Choose an exit directive:
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setIsLeaveSquadModalOpen(false);
                    heistAudio.playKeyClick();
                  }}
                  className="w-10 h-10 rounded-2xl bg-[#06291B]/90 hover:bg-[#EF4444] text-white border-2 border-black font-black text-sm flex items-center justify-center shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all backdrop-blur-sm"
                  title="Cancel"
                >
                  ✕
                </button>
              </div>

              {/* Frosted Cartoon Directive Option Cards */}
              <div className="space-y-4 relative z-10 font-mono">
                
                {/* Option 1: Stay in Squad & Sync (Frosted Jade & Gold) */}
                <div
                  onClick={() => {
                    setIsLeaveSquadModalOpen(false);
                    heistAudio.playKeyClick();
                  }}
                  className="p-4 sm:p-5 rounded-3xl border-3 border-[#052817]/90 bg-[#135C3E]/80 hover:bg-[#18704C]/90 backdrop-blur-md shadow-[5px_5px_0px_#03180E] active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FDE047] border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:animate-icon-wobble transition-transform">
                      🏆
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-base sm:text-lg text-white font-game group-hover:text-[#FDE047] transition-colors">
                          STAY IN SQUAD & SYNC
                        </h3>
                        <span className="text-[10px] bg-[#10B981] text-[#02140D] font-black px-2 py-0.5 rounded-md border border-black hidden sm:inline-block">
                          +CO-OP
                        </span>
                      </div>
                      <p className="text-xs text-[#D1FAE5] font-medium mt-0.5">
                        Maintain active voice & radio mesh. Keep your specialist slot reserved!
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="bg-[#10B981]/90 hover:bg-[#10B981] text-[#02140D] font-black text-xs px-4 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] uppercase font-game transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 group-hover:shadow-[4px_4px_0px_#000] backdrop-blur-sm"
                  >
                    <span>Stay in Squad</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Option 2: Leave Squad (Frosted Crimson & Coral) */}
                <div
                  onClick={handleConfirmLeaveSquad}
                  className="p-4 sm:p-5 rounded-3xl border-3 border-[#2E0B12]/90 bg-[#4D1420]/80 hover:bg-[#631B2B]/90 backdrop-blur-md shadow-[5px_5px_0px_#1B060B] active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#EF4444] border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 group-hover:animate-icon-wobble transition-transform">
                      🚨
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-base sm:text-lg text-white font-game group-hover:text-[#FDA4AF] transition-colors">
                          LEAVE SQUAD (DISCONNECT)
                        </h3>
                        <span className="text-[10px] bg-[#881337] text-[#FECDD3] font-bold px-2 py-0.5 rounded-md border border-[#BE123C] hidden sm:inline-block">
                          RETREAT
                        </span>
                      </div>
                      <p className="text-xs text-[#FECDD3] font-medium mt-0.5">
                        Disconnect from squad frequency and return to Recruitment Directory.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="bg-[#EF4444]/90 hover:bg-[#EF4444] text-white font-black text-xs px-4 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] uppercase font-game transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 group-hover:shadow-[4px_4px_0px_#000] backdrop-blur-sm"
                  >
                    <span>Leave Squad</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

              </div>

              {/* Frosted Cartoon Footer / Resume Button */}
              <div className="pt-2 relative z-10 font-mono">
                <button
                  onClick={() => {
                    setIsLeaveSquadModalOpen(false);
                    heistAudio.playKeyClick();
                  }}
                  className="w-full bg-[#06291B]/85 hover:bg-[#0A3D29]/95 backdrop-blur-md text-[#10B981] hover:text-[#10B981] font-black py-3.5 rounded-2xl border-2 border-[#10B981]/60 shadow-[4px_4px_0px_#03180E] text-xs font-game uppercase transition-all flex items-center justify-center space-x-2 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span>🎮 ← KEEP PLAYING (RESUME SQUAD LOBBY)</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Onboarding Spotlight Tour ── */}
      {showTour && (
        <OnboardingTour currentUser={currentUser} onComplete={() => setShowTour(false)} />
      )}

      {/* ── Solo Training Modal ── */}
      <SoloTrainingModal
        isOpen={isSoloTrainingOpen}
        onClose={() => setIsSoloTrainingOpen(false)}
        onNavigate={navigateToTab}
        onComplete={() => triggerAchievementCheck('SOLO_COMPLETE')}
        onRoleSolved={(role) => triggerAchievementCheck('ROLE_SOLVED', { role })}
      />

      {/* ── Syndicate Achievement Unlock Banner ── */}
      {achievementQueue.length > 0 && (
        <AchievementUnlockBanner
          key={achievementQueue[0].id}
          achievement={achievementQueue[0]}
          onClose={() => setAchievementQueue(prev => prev.slice(1))}
        />
      )}

      {/* ── Extraction Protocol Synchronized Vault Core Modal ── */}
      <ExtractionProtocolModal
        isOpen={isExtractionActive}
        activeRole={activeCockpitRole || 'hacker'}
        stageData={allStages[currentStageIdx] || heistStages[0]}
        solvedRoles={currentStageSolved}
        roleClues={currentStageClues}
        currentUser={currentUser}
        lobby={lobby}
        onExtractionSuccess={(bonusXp, timeElapsed) => {
          setIsExtractionActive(false);
          try {
            triggerAchievementCheck('EXTRACTION_COMPLETE');
          } catch (e) {
            console.warn('[ACHIEVEMENT] Extraction check warning:', e);
          }
          try {
            handleStageVictory();
          } catch (e) {
            console.error('[HEIST] handleStageVictory error:', e);
            setIsMatchVictory(true);
            setAnalyticsModalOpen(true);
          }
        }}
        onExtractionFail={(reason) => {
          setIsExtractionActive(false);
          toast.error(`🚨 EXTRACTION FAILED: ${reason}`);
          handleHeistTimeout();
        }}
        onClose={() => setIsExtractionActive(false)}
      />

      {/* ── Mobile Primary Bottom Navigation Bar (Home, Lobby, Heist, Stats, More) ── */}
      {currentUser && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#051A12]/95 backdrop-blur-2xl border-t border-emerald-500/30 shadow-[0_-4px_24px_rgba(0,0,0,0.65)] px-2 pt-1.5 pb-safe"
        >
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'lobby', label: 'Lobby', icon: Users, badge: lobby?.code ? 'LIVE' : null },
              { id: 'liveheist', label: 'Heist', icon: Flame, isHeist: true },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
              { id: 'more', label: 'More', icon: MoreHorizontal, isMore: true },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isHeistActive = isTimerRunning && activeTab === 'liveheist';

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.isMore) {
                      setIsMobileMoreOpen(true);
                      heistAudio.playKeyClick();
                      return;
                    }
                    if (isHeistLocked && tab.id !== 'liveheist') {
                      toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
                      return;
                    }
                    navigateToTab(tab.id);
                    heistAudio.playKeyClick();
                    if (tab.id === 'liveheist' && !isTimerRunning) {
                      setIsTimerRunning(true);
                    }
                  }}
                  className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative min-h-[48px] active:scale-95 ${
                    isActive && !tab.isMore
                      ? 'text-[#10B981]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-label={tab.label}
                >
                  <div className="relative">
                    {tab.isHeist ? (
                      <div className={`p-1.5 rounded-xl transition-all ${
                        isHeistActive 
                          ? 'bg-[#EF4444] text-white shadow-[0_0_14px_rgba(239,68,68,0.8)] animate-pulse' 
                          : isActive 
                          ? 'bg-[#10B981] text-[#02140D]' 
                          : 'bg-[#0E3526]/80 text-[#10B981]'
                      }`}>
                        <Icon className="w-5 h-5 fill-current" />
                      </div>
                    ) : (
                      <div className={`p-1 rounded-lg ${isActive ? 'bg-[#10B981]/20' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}

                    {tab.badge && (
                      <span className="absolute -top-1 -right-2 bg-emerald-500 text-[8px] font-mono font-black text-[#02140D] px-1 rounded-full animate-ping">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-mono tracking-tight font-bold mt-0.5 ${
                    isActive && !tab.isMore ? 'text-[#10B981]' : 'text-slate-400'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── Mobile 'More' Slide-Up Bottom Sheet ── */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMoreOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative z-10 bg-[#051C12] border-t-2 border-emerald-500/40 rounded-t-3xl max-h-[85vh] overflow-y-auto overscroll-contain shadow-2xl p-4 sm:p-6 pb-safe text-left space-y-4"
            >
              {/* Top Drag Handle / Pill */}
              <div className="w-12 h-1.5 bg-emerald-500/30 rounded-full mx-auto" />

              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                  <h3 className="font-game font-bold text-base text-white tracking-wide uppercase">
                    SYNDICATE MENU
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-1.5 rounded-xl bg-[#04160E] border border-emerald-800 text-slate-400 hover:text-white"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of secondary actions and tabs */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: 'missions', label: 'Expeditions', icon: Compass, desc: 'Heist contracts', color: '#10B981' },
                  { id: 'characters', label: '4 Roles', icon: Zap, desc: 'Specialist roster', color: '#F59E0B' },
                  { id: 'map', label: 'Canopy Map', icon: MapPin, desc: 'Global ops network', color: '#0EA5E9' },
                  { id: 'topics', label: 'Disciplines', icon: BookOpen, desc: 'Academic topics', color: '#A855F7' },
                  { id: 'builder', label: 'Architect', icon: Terminal, desc: 'Mission creator', color: '#10B981' },
                  { id: 'settings', label: 'Vault Themes', icon: Palette, desc: 'Color palettes & HUD', color: '#F59E0B' },
                  { 
                    id: 'skills', 
                    label: 'Skill Tree', 
                    icon: Shield, 
                    desc: 'Operative mastery', 
                    color: '#F59E0B', 
                    customAction: () => {
                      setIsMobileMoreOpen(false);
                      setIsRoadmapModalOpen(true);
                      heistAudio.playKeyClick();
                    }
                  },
                  { 
                    id: 'tutorial', 
                    label: 'Tutorial', 
                    icon: Sparkles, 
                    desc: 'Interactive briefing', 
                    color: '#6EE7B7', 
                    customAction: () => {
                      setIsMobileMoreOpen(false);
                      setActiveTab('home');
                      setShowTour(true);
                      heistAudio.playKeyClick();
                    }
                  },
                  { 
                    id: 'solo', 
                    label: 'Solo Drill', 
                    icon: Target, 
                    desc: 'Offline simulator', 
                    color: '#38BDF8', 
                    customAction: () => {
                      setIsMobileMoreOpen(false);
                      setIsSoloTrainingOpen(true);
                      heistAudio.playKeyClick();
                    }
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.customAction) {
                          item.customAction();
                          return;
                        }
                        if (isHeistLocked && item.id !== 'liveheist') {
                          toast.warning("🔒 Navigation locked! Complete or quit the heist to leave.");
                          return;
                        }
                        navigateToTab(item.id);
                        setIsMobileMoreOpen(false);
                        heistAudio.playKeyClick();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[72px] active:scale-95 ${
                        isActive
                          ? 'bg-[#0E3526] border-[#10B981] shadow-lg ring-1 ring-[#10B981]'
                          : 'bg-[#04160E] border-emerald-900/60 hover:border-emerald-700/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className="w-5 h-5 flex-shrink-0" style={{ color: item.color }} />
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="text-xs font-bold text-white block font-game truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Bar: Sound Toggle & Dossier Shortcut */}
              <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setSoundEnabled(prev => !prev);
                    heistAudio.playKeyClick();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#03140C] border border-emerald-900/80 text-slate-300 min-h-[44px]"
                >
                  {!soundEnabled ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      <span>Audio Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#10B981]" />
                      <span>Audio Active</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    navigateToTab('stats');
                    heistAudio.playKeyClick();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] font-bold min-h-[44px]"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Dossier</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
