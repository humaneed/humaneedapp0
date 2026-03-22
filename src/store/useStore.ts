import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DIMENSIONS, getLevelForXP } from '../constants/dimensions';

const STORAGE_KEY = '@humaneed_v1';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedSkills: string[]; // skill IDs
  xpEarned: number;
  dimensionScores: number[]; // 0-100 per dimension
}

export interface AppState {
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  history: DailyLog[];
  onboardingDone: boolean;
}

const DEFAULT_STATE: AppState = {
  totalXP: 0,
  streak: 0,
  lastActiveDate: '',
  history: [],
  onboardingDone: false,
};

const getTodayStr = () => new Date().toISOString().split('T')[0];

const calcDimensionScores = (completedSkills: string[]): number[] => {
  return DIMENSIONS.map(dim => {
    const dimSkills = dim.skills.map(s => s.id);
    const done = completedSkills.filter(id => dimSkills.includes(id)).length;
    const max = dimSkills.length;
    return max > 0 ? Math.min(100, Math.round((done / max) * 100 * 2.5)) : 0;
  });
};

// Simple global store using React state + AsyncStorage
let _state: AppState = DEFAULT_STATE;
let _listeners: Array<() => void> = [];

const notify = () => _listeners.forEach(fn => fn());

const persist = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const loadStore = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      _state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Load error:', e);
  }
};

export const getTodayLog = (): DailyLog => {
  const today = getTodayStr();
  return _state.history.find(h => h.date === today) || {
    date: today,
    completedSkills: [],
    xpEarned: 0,
    dimensionScores: [0, 0, 0, 0, 0, 0],
  };
};

export const completeSkill = async (skillId: string, xp: number) => {
  const today = getTodayStr();
  const existing = _state.history.find(h => h.date === today);

  if (existing && existing.completedSkills.includes(skillId)) return; // already done

  let todayLog: DailyLog;
  if (existing) {
    todayLog = {
      ...existing,
      completedSkills: [...existing.completedSkills, skillId],
      xpEarned: existing.xpEarned + xp,
    };
    todayLog.dimensionScores = calcDimensionScores(todayLog.completedSkills);
    _state = {
      ..._state,
      totalXP: _state.totalXP + xp,
      history: _state.history.map(h => h.date === today ? todayLog : h),
    };
  } else {
    todayLog = {
      date: today,
      completedSkills: [skillId],
      xpEarned: xp,
      dimensionScores: calcDimensionScores([skillId]),
    };
    _state = {
      ..._state,
      totalXP: _state.totalXP + xp,
      history: [..._state.history, todayLog],
    };
  }

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (_state.lastActiveDate === today) {
    // already counted
  } else if (_state.lastActiveDate === yesterdayStr) {
    _state = { ..._state, streak: _state.streak + 1, lastActiveDate: today };
  } else {
    _state = { ..._state, streak: 1, lastActiveDate: today };
  }

  notify();
  await persist();
};

export const undoSkill = async (skillId: string, xp: number) => {
  const today = getTodayStr();
  const existing = _state.history.find(h => h.date === today);
  if (!existing || !existing.completedSkills.includes(skillId)) return;

  const updated: DailyLog = {
    ...existing,
    completedSkills: existing.completedSkills.filter(id => id !== skillId),
    xpEarned: Math.max(0, existing.xpEarned - xp),
  };
  updated.dimensionScores = calcDimensionScores(updated.completedSkills);

  _state = {
    ..._state,
    totalXP: Math.max(0, _state.totalXP - xp),
    history: _state.history.map(h => h.date === today ? updated : h),
  };

  notify();
  await persist();
};

export const getWeeklyScores = (): DailyLog[] => {
  const days: DailyLog[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = _state.history.find(h => h.date === dateStr);
    days.push(log || {
      date: dateStr,
      completedSkills: [],
      xpEarned: 0,
      dimensionScores: [0, 0, 0, 0, 0, 0],
    });
  }
  return days;
};

export const getState = () => _state;

// React hook
export const useStore = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate(n => n + 1);
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter(fn => fn !== listener);
    };
  }, []);

  const todayLog = getTodayLog();
  const level = getLevelForXP(_state.totalXP);

  return {
    state: _state,
    todayLog,
    level,
    completeSkill: useCallback(completeSkill, []),
    undoSkill: useCallback(undoSkill, []),
    getWeeklyScores,
  };
};
