// ============================================================
// V.A.U.L.T — Socket.io Client Service
// Singleton Socket.io connection with event handlers
// ============================================================

import { io } from 'socket.io-client';
import { authAPI } from './api.js';

// Resolve socket URL dynamically (local dev vs production)
const getDefaultSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    // When running locally on dev server ports, connect directly to backend port 5001
    if (window.location.port === '3000' || window.location.port === '5173') {
      return `${protocol}//${host}:5001`;
    }
    return window.location.origin;
  }
  return 'http://localhost:5001';
};

const SOCKET_URL = getDefaultSocketUrl();

let socket = null;
let eventHandlers = {};

// ─────────────────────────────────────────────────────────────
// Connection Management
// ─────────────────────────────────────────────────────────────

/**
 * Connect to the Socket.io server with JWT auth or Guest profile.
 * @param {object} [overrideAuth]
 * @returns {import('socket.io-client').Socket} the socket instance
 */
export function connectSocket(overrideAuth = {}) {
  if (socket?.connected) {
    return socket;
  }

  const token = authAPI.getToken();
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('vault_current_user') || 'null');
  } catch (e) {
    currentUser = null;
  }

  let guestId = localStorage.getItem('vault_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('vault_guest_id', guestId);
  }

  let guestName = localStorage.getItem('vault_guest_name');
  if (!guestName) {
    guestName = `Ranger_${Math.floor(100 + Math.random() * 900)}`;
    localStorage.setItem('vault_guest_name', guestName);
  }

  const authPayload = {
    token: token || undefined,
    userId: currentUser?.id || overrideAuth.userId || guestId,
    username: currentUser?.username || currentUser?.callsign || overrideAuth.username || guestName,
    ...overrideAuth
  };

  socket = io(SOCKET_URL, {
    auth: authPayload,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1500,
    timeout: 10000
  });

  // ─── Connection Events ──────────────────────────────────
  socket.on('connect', () => {
    console.log(`[SOCKET] Connected to V.A.U.L.T server (ID: ${socket.id})`);
    triggerHandler('connected', { socketId: socket.id });
  });

  socket.on('disconnect', (reason) => {
    console.log('[SOCKET] Disconnected:', reason);
    triggerHandler('disconnected', { reason });
  });

  socket.on('connect_error', (err) => {
    console.error('[SOCKET] Connection error:', err.message);
    triggerHandler('error', { message: err.message });
  });

  // ─── Lobby Events ──────────────────────────────────────
  socket.on('lobby:state', (data) => triggerHandler('lobbyState', data));
  socket.on('lobby:player-joined', (data) => triggerHandler('lobbyPlayerJoined', data));
  socket.on('lobby:player-left', (data) => triggerHandler('lobbyPlayerLeft', data));
  socket.on('lobby:player-ready', (data) => triggerHandler('lobbyPlayerReady', data));
  socket.on('lobby:role-changed', (data) => triggerHandler('lobbyRoleChanged', data));
  socket.on('lobby:host-changed', (data) => triggerHandler('lobbyHostChanged', data));
  socket.on('lobby:kicked', (data) => triggerHandler('lobbyKicked', data));
  socket.on('lobby:starting', (data) => triggerHandler('lobbyStarting', data));
  socket.on('lobby:voice-update', (data) => triggerHandler('lobbyVoiceUpdate', data));
  socket.on('lobby:radio-message', (data) => triggerHandler('lobbyRadioMessage', data));
  socket.on('lobby:error', (data) => triggerHandler('lobbyError', data));

  // ─── Heist Events ──────────────────────────────────────
  socket.on('heist:started', (data) => triggerHandler('heistStarted', data));
  socket.on('heist:state', (data) => triggerHandler('heistState', data));
  socket.on('heist:stage-synced', (data) => triggerHandler('heistStageSynced', data));
  socket.on('heist:timer-tick', (data) => triggerHandler('heistTimerTick', data));
  socket.on('heist:alarm-update', (data) => triggerHandler('heistAlarmUpdate', data));
  socket.on('heist:puzzle-solved', (data) => triggerHandler('heistPuzzleSolved', data));
  socket.on('heist:puzzle-failed', (data) => triggerHandler('heistPuzzleFailed', data));
  socket.on('heist:radio-message', (data) => triggerHandler('heistRadioMessage', data));
  socket.on('heist:stage-complete', (data) => triggerHandler('heistStageComplete', data));
  socket.on('heist:timeout', (data) => triggerHandler('heistTimeout', data));
  socket.on('heist:aborted', (data) => triggerHandler('heistAborted', data));
  socket.on('heist:concluded', (data) => triggerHandler('heistConcluded', data));
  
  socket.on('heist:vote-state', (data) => triggerHandler('heistVoteState', data));
  socket.on('heist:end-voted', (data) => triggerHandler('heistEndVoted', data));
  socket.on('heist:vote-failed', (data) => triggerHandler('heistVoteFailed', data));

  // ─── Extraction Protocol Events ────────────────────────
  socket.on('heist:extraction-start', (data) => triggerHandler('heistExtractionStart', data));
  socket.on('heist:extraction-ring-update', (data) => triggerHandler('heistExtractionRingUpdate', data));
  socket.on('heist:extraction-pin-locked', (data) => triggerHandler('heistExtractionPinLocked', data));
  socket.on('heist:extraction-breached', (data) => triggerHandler('heistExtractionBreached', data));
  socket.on('heist:extraction-desync', (data) => triggerHandler('heistExtractionDesync', data));
  // ─── Presence Events ───────────────────────────────────
  socket.on('presence:friend-update', (data) => triggerHandler('presenceFriendUpdate', data));

  return socket;
}

/**
 * Disconnect from the Socket.io server.
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Get the current socket instance (may be null).
 */
export function getSocket() {
  return socket;
}

// ─────────────────────────────────────────────────────────────
// Event Handler Registry
// ─────────────────────────────────────────────────────────────

/**
 * Register an event handler callback.
 * @param {string} event - Event name (e.g., 'lobbyState', 'heistTimerTick')
 * @param {Function} handler - Callback function
 */
export function onSocketEvent(event, handler) {
  if (!eventHandlers[event]) {
    eventHandlers[event] = [];
  }
  eventHandlers[event].push(handler);
}

/**
 * Remove an event handler callback.
 */
export function offSocketEvent(event, handler) {
  if (eventHandlers[event]) {
    eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
  }
}

/**
 * Remove all handlers for an event (or all events).
 */
export function clearSocketHandlers(event) {
  if (event) {
    delete eventHandlers[event];
  } else {
    eventHandlers = {};
  }
}

function triggerHandler(event, data) {
  if (eventHandlers[event]) {
    eventHandlers[event].forEach(handler => {
      try {
        handler(data);
      } catch (err) {
        console.error(`[SOCKET] Handler error for ${event}:`, err);
      }
    });
  }
}

// Local in-memory lobby state cache (guarantees offline & standalone functionality)
const localLobbies = new Map();

function getLocalLobby(code) {
  const norm = (code || '').toUpperCase();
  if (localLobbies.has(norm)) return localLobbies.get(norm);
  try {
    const raw = localStorage.getItem(`vault_lobby_${norm}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      localLobbies.set(norm, parsed);
      return parsed;
    }
  } catch (e) {}
  return null;
}

function saveLocalLobby(lobby) {
  if (!lobby?.code) return;
  const norm = lobby.code.toUpperCase();
  localLobbies.set(norm, lobby);
  try {
    localStorage.setItem(`vault_lobby_${norm}`, JSON.stringify(lobby));
    localStorage.setItem('vault_active_lobby_code', norm);
  } catch (e) {}
}

export function createLocalLobbyState(roomCode, missionTitle, role = 'hacker', characterId = 'c1', playerName) {
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('vault_current_user') || 'null');
  } catch (e) {}
  const myName = playerName || currentUser?.callsign || currentUser?.username || localStorage.getItem('vault_guest_name') || 'Operative';
  const myId = currentUser?.id || localStorage.getItem('vault_guest_id') || 'host_op';
  const code = (roomCode || `HEIST-${Math.floor(100 + Math.random() * 900)}`).toUpperCase();

  const newLobby = {
    id: `lobby-${code}`,
    heistId: 'm1',
    missionId: 'm1',
    roomCode: code,
    code: code,
    name: missionTitle || `Squad Delta ${code}`,
    hostId: myId,
    players: [
      {
        userId: myId,
        username: myName,
        playerName: myName,
        socketId: 'local-socket-1',
        slotId: 1,
        role: role || 'hacker',
        characterId: characterId || 'c1',
        isHost: true,
        isReady: true,
        voiceState: { connected: true, muted: false, deafened: false }
      },
      {
        userId: 'ai-2',
        username: 'Operative Chen',
        playerName: 'Operative Chen',
        socketId: 'ai-2',
        slotId: 2,
        role: 'engineer',
        characterId: 'c2',
        isHost: false,
        isReady: true,
        isAi: true,
        voiceState: { connected: false, muted: false, deafened: false }
      },
      {
        userId: 'ai-3',
        username: 'Operative Rostova',
        playerName: 'Operative Rostova',
        socketId: 'ai-3',
        slotId: 3,
        role: 'scientist',
        characterId: 'c3',
        isHost: false,
        isReady: true,
        isAi: true,
        voiceState: { connected: false, muted: false, deafened: false }
      },
      {
        userId: 'ai-4',
        username: 'Operative Cipher',
        playerName: 'Operative Cipher',
        socketId: 'ai-4',
        slotId: 4,
        role: 'cryptographer',
        characterId: 'c4',
        isHost: false,
        isReady: true,
        isAi: true,
        voiceState: { connected: false, muted: false, deafened: false }
      }
    ],
    status: 'waiting',
    createdAt: Date.now()
  };

  saveLocalLobby(newLobby);
  return newLobby;
}

// ─────────────────────────────────────────────────────────────
// Lobby Emitters
// ─────────────────────────────────────────────────────────────
export const lobbySocket = {
  create(heistId, roomCode, missionTitle, role, characterId, callback) {
    let responded = false;
    const fallback = () => {
      if (responded) return;
      responded = true;
      const local = createLocalLobbyState(roomCode, missionTitle, role, characterId);
      triggerHandler('lobbyState', local);
      callback?.({ success: true, lobby: local, roomCode: local.code });
    };

    if (socket?.connected) {
      socket.emit('lobby:create', { heistId, roomCode, missionTitle, role, characterId }, (res) => {
        if (!responded) {
          responded = true;
          if (res?.lobby) saveLocalLobby(res.lobby);
          callback?.(res);
        }
      });
      setTimeout(fallback, 1000);
    } else {
      fallback();
    }
  },

  join(roomCode, role, characterId, playerName, callback) {
    let responded = false;
    const norm = (roomCode || '').toUpperCase();
    const fallback = () => {
      if (responded) return;
      responded = true;
      let existing = getLocalLobby(norm);
      if (!existing) {
        existing = createLocalLobbyState(norm, `Squad Strike ${norm}`, role, characterId, playerName);
      } else {
        const myName = playerName || localStorage.getItem('vault_guest_name') || 'Operative';
        const myId = localStorage.getItem('vault_guest_id') || 'joined_op';
        const targetSlot = existing.players.find(p => p.role === role) || existing.players[1];
        if (targetSlot) {
          targetSlot.userId = myId;
          targetSlot.username = myName;
          targetSlot.playerName = myName;
          targetSlot.isAi = false;
          targetSlot.isReady = true;
        }
        saveLocalLobby(existing);
      }
      triggerHandler('lobbyState', existing);
      callback?.({ success: true, lobby: existing, roomCode: existing.code });
    };

    if (socket?.connected) {
      socket.emit('lobby:join', { roomCode, role, characterId, playerName }, (res) => {
        if (!responded) {
          responded = true;
          if (res?.lobby) saveLocalLobby(res.lobby);
          callback?.(res);
        }
      });
      setTimeout(fallback, 1000);
    } else {
      fallback();
    }
  },

  get(roomCode, callback) {
    const norm = (roomCode || '').toUpperCase();
    if (socket?.connected) {
      socket.emit('lobby:get', { roomCode: norm }, callback);
    } else {
      const local = getLocalLobby(norm);
      callback?.({ success: true, lobby: local });
    }
  },

  setReady(roomCode, isReady) {
    const norm = (roomCode || '').toUpperCase();
    if (socket?.connected) {
      socket.emit('lobby:ready', { roomCode: norm, isReady });
    }
    const local = getLocalLobby(norm);
    if (local) {
      const myId = localStorage.getItem('vault_guest_id');
      const p = local.players.find(x => x.userId === myId || x.isHost);
      if (p) p.isReady = isReady;
      saveLocalLobby(local);
      triggerHandler('lobbyState', local);
    }
  },

  selectRole(roomCode, role) {
    const norm = (roomCode || '').toUpperCase();
    if (socket?.connected) {
      socket.emit('lobby:select-role', { roomCode: norm, role });
    }
    const local = getLocalLobby(norm);
    if (local) {
      const p = local.players[0];
      if (p) p.role = role;
      saveLocalLobby(local);
      triggerHandler('lobbyState', local);
    }
  },

  kick(roomCode, targetSlotId) {
    const norm = (roomCode || '').toUpperCase();
    if (socket?.connected) {
      socket.emit('lobby:kick', { roomCode: norm, targetSlotId });
    }
  },

  start(roomCode, callback) {
    const norm = (roomCode || '').toUpperCase();
    if (socket?.connected) {
      socket.emit('lobby:start', { roomCode: norm }, callback);
    } else {
      const local = getLocalLobby(norm);
      if (local) {
        local.status = 'active';
        saveLocalLobby(local);
      }
      triggerHandler('lobbyStarting', { roomCode: norm, stageIdx: 0, countdown: 3, lobby: local });
      callback?.({ success: true });
    }
  },

  updateVoiceState(roomCode, connected, muted, deafened) {
    socket?.emit('lobby:voice-state', { roomCode, connected, muted, deafened });
  },

  sendRadioMessage(roomCode, text, role) {
    if (socket?.connected) {
      socket.emit('lobby:radio-message', { roomCode, text, role });
    } else {
      triggerHandler('lobbyRadioMessage', {
        text,
        role: role || 'hq',
        sender: localStorage.getItem('vault_guest_name') || 'HQ Dispatch',
        timestamp: Date.now()
      });
    }
  },

  leave(roomCode) {
    socket?.emit('lobby:leave', { roomCode });
  }
};

// ─────────────────────────────────────────────────────────────
// Heist Emitters
// ─────────────────────────────────────────────────────────────
export const heistSocket = {
  start(roomCode, stageIdx, timeLimit, puzzles, selectedRoles, callback) {
    socket?.emit('heist:start', { roomCode, stageIdx, timeLimit, puzzles, selectedRoles }, callback);
  },

  joinRoom(roomCode) {
    socket?.emit('heist:join-room', { roomCode });
  },

  leave(roomCode) {
    socket?.emit('heist:leave', { roomCode });
  },

  submitAnswer(roomCode, role, answer, expected, puzzleType, clue, reason, solvedBy, callback) {
    socket?.emit('heist:submit-answer', { roomCode, role, answer, expected, puzzleType, clue, reason, solvedBy }, callback);
  },

  puzzleSolved(roomCode, role, clue, solvedBy) {
    socket?.emit('heist:puzzle-solved', { roomCode, role, clue, solvedBy });
  },

  puzzleFailed(roomCode, role, reason, failedBy) {
    socket?.emit('heist:puzzle-failed', { roomCode, role, reason, failedBy });
  },

  sendRadioMessage(roomCode, text, role, sender) {
    socket?.emit('heist:radio-message', { roomCode, text, role, sender });
  },

  syncStage(roomCode, stageIdx, timeLimit, selectedRoles) {
    socket?.emit('heist:sync-stage', { roomCode, stageIdx, timeLimit, selectedRoles });
  },

  abort(roomCode) {
    socket?.emit('heist:abort', { roomCode });
  },

  conclude(roomCode) {
    socket?.emit('heist:conclude', { roomCode });
  },

  // Extraction Protocol Emitters
  startExtraction(roomCode) {
    socket?.emit('heist:extraction-start', { roomCode });
  },

  updateExtractionRing(roomCode, role, angle, isAligned) {
    socket?.emit('heist:extraction-ring-update', { roomCode, role, angle, isAligned });
  },

  lockExtractionPin(roomCode, role) {
    socket?.emit('heist:extraction-pin-locked', { roomCode, role });
  },

  completeExtraction(roomCode) {
    socket?.emit('heist:extraction-breached', { roomCode });
  }
};

// ─────────────────────────────────────────────────────────────
// Presence Emitters
// ─────────────────────────────────────────────────────────────
export const presenceSocket = {
  updateStatus(status, activity) {
    socket?.emit('presence:update', { status, activity });
  },

  getFriends(callback) {
    socket?.emit('presence:get-friends', {}, callback);
  }
};
