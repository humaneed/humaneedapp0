import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import { DIMENSIONS, getLevelForXP, getNextLevel, XP_LEVELS } from '../constants/dimensions';
import { useStore, getState } from '../store/useStore';

export function ProfileScreen() {
  const { state, todayLog } = useStore();
  const level = getLevelForXP(state.totalXP);
  const nextLevel = getNextLevel(state.totalXP);

  const xpProgress = nextLevel
    ? ((state.totalXP - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100
    : 100;

  const totalDays = state.history.filter(h => h.completedSkills.length > 0).length;
  const totalSkills = state.history.reduce((sum, h) => sum + h.completedSkills.length, 0);

  // Dimension mastery: how many skills done per dimension (all-time)
  const dimMastery = DIMENSIONS.map(dim => {
    const prefix = dim.key.slice(0, 3);
    const allDone = state.history.flatMap(h => h.completedSkills).filter(id => id.startsWith(prefix));
    const unique = new Set(allDone).size;
    return { dim, unique, total: dim.skills.length };
  });

  const handleReset = () => {
    Alert.alert(
      'Alle Daten löschen?',
      'XP, Streak und Verlauf werden unwiderruflich gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Erledigt', 'Bitte App neu starten.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Profil</Text>

        {/* Level Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelEmoji}>🏆</Text>
            <Text style={styles.levelNum}>{level.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>{level.name}</Text>
            <Text style={styles.levelXP}>{state.totalXP} XP gesamt</Text>
            {nextLevel && (
              <>
                <View style={styles.xpBarBg}>
                  <View style={[styles.xpBarFill, { width: `${xpProgress}%` }]} />
                </View>
                <Text style={styles.xpNext}>
                  Noch {nextLevel.xpRequired - state.totalXP} XP bis „{nextLevel.name}"
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>STATISTIK</Text>
        <View style={styles.statsGrid}>
          {[
            { emoji: '🔥', value: state.streak, label: 'Tage Streak' },
            { emoji: '📅', value: totalDays, label: 'Aktive Tage' },
            { emoji: '✅', value: totalSkills, label: 'Skills absolviert' },
            { emoji: '⚡', value: todayLog.xpEarned, label: 'XP heute' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statNum}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Level Roadmap */}
        <Text style={styles.sectionTitle}>LEVEL-PFAD</Text>
        <View style={styles.card}>
          {XP_LEVELS.map(lvl => {
            const isReached = state.totalXP >= lvl.xpRequired;
            const isCurrent = level.level === lvl.level;
            return (
              <View key={lvl.level} style={styles.levelRow}>
                <View style={[
                  styles.levelDot,
                  isReached && styles.levelDotReached,
                  isCurrent && styles.levelDotCurrent,
                ]}>
                  <Text style={[styles.levelDotNum, isReached && styles.levelDotNumReached]}>
                    {lvl.level}
                  </Text>
                </View>
                <View style={styles.levelRowInfo}>
                  <Text style={[styles.levelRowName, isReached && { color: Colors.textPrimary }]}>
                    {lvl.name}
                    {isCurrent && <Text style={styles.currentBadge}> ← Du</Text>}
                  </Text>
                  <Text style={styles.levelRowXP}>{lvl.xpRequired} XP</Text>
                </View>
                {isReached && <Text style={styles.checkMark}>✓</Text>}
              </View>
            );
          })}
        </View>

        {/* Dimension Mastery */}
        <Text style={styles.sectionTitle}>DIMENSION-MASTERY</Text>
        <View style={styles.card}>
          {dimMastery.map(({ dim, unique, total }) => {
            const pct = Math.round((unique / total) * 100);
            return (
              <View key={dim.id} style={styles.masteryRow}>
                <Text style={styles.masteryEmoji}>{dim.emoji}</Text>
                <Text style={styles.masteryName}>{dim.name}</Text>
                <View style={styles.masteryBarBg}>
                  <View
                    style={[
                      styles.masteryBarFill,
                      { width: `${pct}%`, backgroundColor: dim.color },
                    ]}
                  />
                </View>
                <Text style={[styles.masteryPct, { color: dim.color }]}>
                  {unique}/{total}
                </Text>
              </View>
            );
          })}
        </View>

        {/* App Info */}
        <Text style={styles.sectionTitle}>APP</Text>
        <View style={styles.card}>
          <Text style={styles.appName}>HUMANEED</Text>
          <Text style={styles.appVersion}>Version 1.0.0 · React Native (Expo)</Text>
          <Text style={styles.appTagline}>
            „Pflege die Form, in der Welt durch dich bewusst wird."
          </Text>
          <View style={styles.divider} />
          <Text style={styles.appPhilosophy}>
            Basiert auf „Bewusstsein, Struktur und das gelebte Leben" — einer Synthese aus Philosophie, Neurowissenschaft, Epigenetik und gelebter Praxis.
          </Text>
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>Alle Daten zurücksetzen</Text>
        </TouchableOpacity>

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
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    gap: Spacing.lg,
    ...Shadow.md,
  },
  levelBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(78,204,163,0.12)',
    borderWidth: 2,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelEmoji: { fontSize: 24 },
  levelNum: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.teal,
    marginTop: -2,
  },
  levelInfo: { flex: 1 },
  levelName: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  levelXP: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  xpBarBg: {
    height: 5,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 4,
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
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statNum: {
    fontSize: Typography.xl,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
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
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  levelDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelDotReached: {
    borderColor: Colors.teal,
    backgroundColor: 'rgba(78,204,163,0.1)',
  },
  levelDotCurrent: {
    borderColor: Colors.teal,
    backgroundColor: Colors.teal,
  },
  levelDotNum: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  levelDotNumReached: { color: Colors.teal },
  levelRowInfo: { flex: 1 },
  levelRowName: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  currentBadge: {
    color: Colors.teal,
    fontSize: Typography.xs,
    fontWeight: '700',
  },
  levelRowXP: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  checkMark: {
    fontSize: 16,
    color: Colors.teal,
    fontWeight: '800',
  },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  masteryEmoji: { fontSize: 16, width: 24 },
  masteryName: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    width: 80,
    fontWeight: '600',
  },
  masteryBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  masteryBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  masteryPct: {
    fontSize: Typography.xs,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
  appName: {
    fontSize: Typography.xl,
    fontWeight: '900',
    color: Colors.teal,
    letterSpacing: 2,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  appTagline: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  appPhilosophy: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  resetBtn: {
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  resetText: {
    fontSize: Typography.sm,
    color: Colors.coral,
    fontWeight: '600',
  },
});
