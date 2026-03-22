import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import { DIMENSIONS } from '../constants/dimensions';
import { TIER_LOGIC } from '../constants/philosophy';
import { useStore } from '../store/useStore';
import { SkillCard } from '../components/SkillCard';

export function DimensionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { dimensionId } = route.params;
  const { todayLog, completeSkill, undoSkill } = useStore();

  const dim = DIMENSIONS[dimensionId];
  const tierInfo = TIER_LOGIC[dimensionId];

  const score = todayLog.dimensionScores[dimensionId] || 0;
  const doneCount = todayLog.completedSkills.filter(id =>
    id.startsWith(dim.key.slice(0, 3))
  ).length;

  const handleToggle = (skillId: string, xp: number) => {
    const done = todayLog.completedSkills.includes(skillId);
    if (done) undoSkill(skillId, xp);
    else completeSkill(skillId, xp);
  };

  const getScoreColor = () => {
    if (score >= 70) return Colors.teal;
    if (score >= 40) return Colors.amber;
    return Colors.coral;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Zurück</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { borderLeftColor: dim.color }]}>
          <Text style={styles.heroEmoji}>{dim.emoji}</Text>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTier} style={{ color: dim.color }}>Tier {dim.id}</Text>
            <Text style={styles.heroName}>{dim.name}</Text>
            <Text style={styles.heroDesc}>{dim.description}</Text>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreBlock}>
            <Text style={[styles.scoreNum, { color: getScoreColor() }]}>{score}%</Text>
            <Text style={styles.scoreLabel}>Heute</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreNum}>{doneCount}</Text>
            <Text style={styles.scoreLabel}>Skills erledigt</Text>
          </View>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreNum}>{dim.skills.length}</Text>
            <Text style={styles.scoreLabel}>Skills total</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${score}%`, backgroundColor: dim.color },
              ]}
            />
          </View>
        </View>

        {/* Tier Logic */}
        <View style={[styles.tierCard, { borderLeftColor: dim.color }]}>
          <Text style={[styles.tierLabel, { color: dim.color }]}>Warum Tier {dim.id}?</Text>
          <Text style={styles.tierNote}>{tierInfo.note}</Text>
        </View>

        {/* Skills */}
        <Text style={styles.sectionTitle}>SKILLS</Text>
        {dim.skills.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            dimensionColor={dim.color}
            isCompleted={todayLog.completedSkills.includes(skill.id)}
            onToggle={() => handleToggle(skill.id, skill.xp)}
          />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backIcon: {
    fontSize: 20,
    color: Colors.teal,
    fontWeight: '700',
  },
  backText: {
    fontSize: Typography.base,
    color: Colors.teal,
    fontWeight: '600',
  },
  scroll: { flex: 1, paddingHorizontal: Spacing.lg },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingLeft: Spacing.lg,
    borderLeftWidth: 3,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  heroEmoji: { fontSize: 44 },
  heroInfo: { flex: 1 },
  heroTier: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroName: {
    fontSize: Typography.xxxl,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  scoreRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreBlock: {
    flex: 1,
    alignItems: 'center',
  },
  scoreNum: {
    fontSize: Typography.xl,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressWrap: { marginBottom: Spacing.lg },
  progressBg: {
    height: 6,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  tierCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    marginBottom: Spacing.lg,
  },
  tierLabel: {
    fontSize: Typography.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tierNote: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
});
