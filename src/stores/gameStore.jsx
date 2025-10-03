import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  phase: "menu", // menu | countdown | playing | finished
  selection: null, // "timon" | "pumbaa"
  startTime: 0,
  elapsed: 0,
  winner: null,
  totalInsects: 12,
  boost: 0,
  boostTimeout: null,
  difficulty: "medium",

  setDifficulty: (level) => set({ difficulty: level }),

  // music state
  musicOn: true,
  toggleMusic: () => set((s) => ({ musicOn: !s.musicOn })),

  setSelection: (sel) => set(() => ({ selection: sel })),

  // Score
  scorePlayer: 0,
  scoreEnemy: 0,

  addPlayerScore: (v = 1) => set((s) => ({ scorePlayer: s.scorePlayer + v })),
  addEnemyScore: (v = 1) => set((s) => ({ scoreEnemy: s.scoreEnemy + v })),
  resetScores: () => set({ scorePlayer: 0, scoreEnemy: 0 }),

  addBoost: (v = 2, duration = 1000) => {
    const { boostTimeout } = get();
    if (boostTimeout) clearTimeout(boostTimeout);
    set((s) => ({ boost: s.boost + v }));
    const timeout = setTimeout(() => {
      set((s) => ({ boost: Math.max(0, s.boost - v), boostTimeout: null }));
    }, duration);
    set({ boostTimeout: timeout });
  },

  resetBoost: () => {
    const { boostTimeout } = get();
    if (boostTimeout) clearTimeout(boostTimeout);
    set({ boost: 0, boostTimeout: null });
  },

  startCountdown: () =>
    set({
      phase: "countdown",
      scorePlayer: 0,
      scoreEnemy: 0,
      elapsed: 0,
      winner: null,
      boost: 0,
      boostTimeout: null,
    }),

  startRace: () =>
    set({
      phase: "playing",
      startTime: performance.now(),
    }),

  tick: () => {
    const { phase, startTime } = get();
    if (phase !== "playing") return;
    set({ elapsed: (performance.now() - startTime) / 1000 });
  },

  finish: (winner) => set({ phase: "finished", winner }),

  reset: () =>
    set({
      phase: "menu",
      selection: null,
      scorePlayer: 0,
      scoreEnemy: 0,
      startTime: 0,
      elapsed: 0,
      winner: null,
      boost: 0,
      boostTimeout: null,
      musicOn: true,
      difficulty: "medium",
      mobileInput: { forward: 0, side: 0, jump: false },
    }),

  // mobile input
  mobileInput: { forward: 0, side: 0, jump: false },
  setMobileInput: (input) =>
    set((s) => ({ mobileInput: { ...s.mobileInput, ...input } })),

  jump: () =>
    set((s) => ({
      mobileInput: { ...s.mobileInput, jump: true },
    })),

  resetJump: () =>
    set((s) => ({
      mobileInput: { ...s.mobileInput, jump: false },
    })),
}));
