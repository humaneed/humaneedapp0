import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import { DIMENSIONS } from '../constants/dimensions';
import { APHORISMS, FIVE_PRINCIPLES } from '../constants/philosophy';
import { useStore } from '../store/useStore';
import { DimensionCard } from '../components/DimensionCard';

const getTodayGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Guten Morgen';
  if (h < 17) return 'Guten Tag';
  return 'Guten Abend';
};

const getDayName = () => {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return days[new Date().getDay()];
};

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { state, todayLog, level } = useStore();
  const [aphorismIdx] = useState(() => new Date().getDay() % APHORISMS.length);

  const totalScore = todayLog.dimensionScores.length
    ? Math.round(todayLog.dimensionScores.reduce((a, b) => a + b, 0) / 6)
    : 0;

  const completedPerDim = (dimId: number) =>
    todayLog.completedSkills.filter(id => id.startsWith(DIMENSIONS[dimId].key.slice(0, 3))).length;

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: 'Stark', color: Colors.teal };
    if (score >= 40) return { label: 'Aktiv', color: Colors.amber };
    if (score > 0) return { label: 'Im Aufbau', color: Colors.coral };
    return { label: 'Beginne heute', color: Colors.textMuted };
  };

  const scoreInfo = getScoreLabel(totalScore);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTodayGreeting()}</Text>
            <Text style={styles.day}>{getDayName()}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakCount}>{state.streak}</Text>
          </View>
        </View>

        {/* Daily Score Ring */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreRingOuter}>
            <View style={[styles.scoreRingInner, { borderColor: scoreInfo.color }]}>
              <Text style={[styles.scoreNum, { color: scoreInfo.color }]}>{totalScore}</Text>
              <Text style={styles.scorePercent}>%</Text>
            </View>
          </View>
          <View style={styles.scoreInfo}>
            <Text style={[styles.scoreLabel, { color: scoreInfo.color }]}>{scoreInfo.label}</Text>
            <Text style={styles.scoreSkills}>
              {todayLog.completedSkills.length} Skills heute
            </Text>
            <Text style={styles.scoreXP}>+{todayLog.xpEarned} XP · Level {level.level}</Text>
          </View>
        </View>

        {/* Aphorism */}
        <View style={styles.aphorismCard}>
          <Text style={styles.aphorismQuote}>❝</Text>
          <Text style={styles.aphorismText}>{APHORISMS[aphorismIdx]}</Text>
        </View>

        {/* Dimensions */}
        <Text style={styles.sectionTitle}>DEINE 6 DIMENSIONEN</Text>
        {DIMENSIONS.map((dim, i) => (
          <DimensionCard
            key={dim.id}
            dimension={dim}
            score={todayLog.dimensionScores[i] || 0}
            completedToday={completedPerDim(i)}
            onPress={() => navigation.navigate('DimensionDetail', { dimensionId: dim.id })}
          />
        ))}

        {/* Quick Principle */}
        <Text style={styles.sectionTitle}>PRINZIP DES TAGES</Text>
        <View style={styles.principleCard}>
          {(() => {
            const p = FIVE_PRINCIPLES[new Date().getDay() % 5];
            return (
              <>
                <View style={styles.principleHeader}>
                  <Text style={styles.principleEmoji}>{p.emoji}</Text>
                  <View>
                    <Text style={styles.principleNum}>{p.number}</Text>
                    <Text style={styles.principleTitle}>{p.title}</Text>
                  </View>
                </View>
                <Text style={styles.principleDesc}>{p.description}</Text>
              </>
            );
          })()}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  day: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  streakFire: { fontSize: 18 },
  streakCount: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.amber,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    ...Shadow.md,
  },
  scoreRingOuter: {
    width: 80,
    height: 80,
    marginRight: Spacing.xl,
  },
  scoreRingInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  scoreNum: {
    fontSize: 28,
    fontWeight: '900',
  },
  scorePercent: {
    fontSize: 14,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  scoreInfo: { flex: 1 },
  scoreLabel: {
    fontSize: Typography.xl,
    fontWeight: '800',
    marginBottom: 4,
  },
  scoreSkills: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  scoreXP: {
    fontSize: Typography.xs,
    color: Colors.teal,
    fontWeight: '600',
  },
  aphorismCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.teal,
  },
  aphorismQuote: {
    fontSize: 24,
    color: Colors.teal,
    lineHeight: 24,
    marginBottom: 4,
  },
  aphorismText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  principleCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  principleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  principleEmoji: { fontSize: 28 },
  principleNum: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.teal,
    letterSpacing: 1,
  },
  principleTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  principleDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
