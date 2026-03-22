import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import { DIMENSIONS, XP_LEVELS, getLevelForXP, getNextLevel } from '../constants/dimensions';
import { useStore } from '../store/useStore';

const SCREEN_W = Dimensions.get('window').width;
const BAR_MAX_H = 80;

const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const getDayLabel = (dateStr: string) => {
  const d = new Date(dateStr);
  return DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
};

export function InsightsScreen() {
  const { state, getWeeklyScores } = useStore();
  const weeklyLogs = getWeeklyScores();

  const level = getLevelForXP(state.totalXP);
  const nextLevel = getNextLevel(state.totalXP);
  const xpProgress = nextLevel
    ? ((state.totalXP - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100
    : 100;

  // Weekly XP chart data
  const maxXP = Math.max(...weeklyLogs.map(l => l.xpEarned), 1);

  // Total skills completed all-time
  const totalSkillsDone = state.history.reduce((sum, l) => sum + l.completedSkills.length, 0);

  // Best dimension today
  const todayLog = weeklyLogs[weeklyLogs.length - 1];
  const bestDimIdx = todayLog.dimensionScores.indexOf(Math.max(...todayLog.dimensionScores));
  const bestDim = DIMENSIONS[bestDimIdx];

  // Avg scores across last 7 days
  const avgDimScores = DIMENSIONS.map((_, i) => {
    const values = weeklyLogs.map(l => l.dimensionScores[i] || 0);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Verlauf</Text>

        {/* XP & Level Card */}
        <View style={styles.card}>
          <View style={styles.levelRow}>
            <View>
              <Text style={styles.levelLabel}>LEVEL {level.level}</Text>
              <Text style={styles.levelName}>{level.name}</Text>
            </View>
            <View style={styles.xpBubble}>
              <Text style={styles.xpNum}>{state.totalXP}</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>
          </View>
          {nextLevel && (
            <>
              <View style={styles.xpBarBg}>
                <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
              </View>
              <Text style={styles.xpNext}>
                {nextLevel.xpRequired - state.totalXP} XP bis Level {nextLevel.level} · {nextLevel.name}
              </Text>
            </>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNum}>{state.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statNum}>{totalSkillsDone}</Text>
            <Text style={styles.statLabel}>Skills gesamt</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>{bestDim?.emoji || '—'}</Text>
            <Text style={styles.statNum}>{bestDim?.name || '—'}</Text>
            <Text style={styles.statLabel}>Stärke heute</Text>
          </View>
        </View>

        {/* Weekly XP Chart */}
        <Text style={styles.sectionTitle}>XP DIESE WOCHE</Text>
        <View style={styles.card}>
          <View style={styles.barChart}>
            {weeklyLogs.map((log, i) => {
              const barH = maxXP > 0 ? (log.xpEarned / maxXP) * BAR_MAX_H : 0;
              const isToday = i === weeklyLogs.length - 1;
              return (
                <View key={log.date} style={styles.barCol}>
                  <Text style={styles.barXP}>{log.xpEarned > 0 ? log.xpEarned : ''}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: Math.max(barH, log.xpEarned > 0 ? 4 : 0),
                          backgroundColor: isToday ? Colors.teal : Colors.bgSurface,
                          opacity: isToday ? 1 : 0.7,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isToday && { color: Colors.teal }]}>
                    {getDayLabel(log.date)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 7-Day Avg Dimensions */}
        <Text style={styles.sectionTitle}>Ø 7 TAGE NACH DIMENSION</Text>
        <View style={styles.card}>
          {DIMENSIONS.map((dim, i) => (
            <View key={dim.id} style={styles.dimRow}>
              <Text style={styles.dimEmoji}>{dim.emoji}</Text>
              <Text style={styles.dimName}>{dim.name}</Text>
              <View style={styles.dimBarBg}>
                <View
                  style={[
                    styles.dimBarFill,
                    { width: `${avgDimScores[i]}%`, backgroundColor: dim.color },
                  ]}
                />
              </View>
              <Text style={[styles.dimScore, { color: dim.color }]}>{avgDimScores[i]}%</Text>
            </View>
          ))}
        </View>

        {/* History Log */}
        <Text style={styles.sectionTitle}>TAGESPROTOKOLL</Text>
        {[...weeklyLogs].reverse().map(log => {
          const totalXP = log.xpEarned;
          const skillCount = log.completedSkills.length;
          const dateObj = new Date(log.date);
          const dateLabel = dateObj.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
          return (
            <View key={log.date} style={styles.logRow}>
              <View style={styles.logLeft}>
                <Text style={styles.logDate}>{dateLabel}</Text>
                <Text style={styles.logStats}>
                  {skillCount} Skills · {totalXP} XP
                </Text>
              </View>
              <View style={styles.logDots}>
                {DIMENSIONS.map((dim, i) => (
                  <View
                    key={dim.id}
                    style={[
                      styles.logDot,
                      {
                        backgroundColor: log.dimensionScores[i] > 0 ? dim.color : Colors.bgSurface,
                        opacity: log.dimensionScores[i] > 0 ? 1 : 0.3,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  title: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.teal,
    marginBottom: 4,
  },
  levelName: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  xpBubble: {
    backgroundColor: 'rgba(78,204,163,0.12)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 72,
  },
  xpNum: {
    fontSize: Typography.xl,
    fontWeight: '900',
    color: Colors.teal,
  },
  xpLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  xpBarBg: {
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: Colors.teal,
    borderRadius: Radius.full,
  },
  xpNext: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statNum: {
    fontSize: Typography.base,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: BAR_MAX_H + 48,
    paddingTop: 16,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barXP: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
    height: 14,
  },
  barTrack: {
    width: '60%',
    height: BAR_MAX_H,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 6,
  },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dimEmoji: { fontSize: 16, width: 24 },
  dimName: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    width: 80,
    fontWeight: '600',
  },
  dimBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  dimBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  dimScore: {
    fontSize: Typography.sm,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logLeft: {},
  logDate: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  logStats: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  logDots: {
    flexDirection: 'row',
    gap: 4,
  },
  logDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
