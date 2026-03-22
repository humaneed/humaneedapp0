import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../constants/theme';
import { DIMENSIONS } from '../constants/dimensions';
import { useStore } from '../store/useStore';
import { SkillCard } from '../components/SkillCard';

export function CheckInScreen() {
  const { todayLog, completeSkill, undoSkill } = useStore();
  const [activeDim, setActiveDim] = useState(0);

  const dim = DIMENSIONS[activeDim];

  const handleToggle = (skillId: string, xp: number) => {
    const done = todayLog.completedSkills.includes(skillId);
    if (done) {
      undoSkill(skillId, xp);
    } else {
      completeSkill(skillId, xp);
    }
  };

  const doneCountForDim = (dimIndex: number) => {
    const prefix = DIMENSIONS[dimIndex].key.slice(0, 3);
    return todayLog.completedSkills.filter(id => id.startsWith(prefix)).length;
  };

  const totalDone = todayLog.completedSkills.length;
  const totalSkills = DIMENSIONS.reduce((sum, d) => sum + d.skills.length, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Skills</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{totalDone}/{totalSkills} heute</Text>
        </View>
      </View>

      {/* Dimension Tab Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dimTabScroll}
        contentContainerStyle={styles.dimTabContent}
      >
        {DIMENSIONS.map((d, i) => {
          const done = doneCountForDim(i);
          const isActive = activeDim === i;
          return (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.dimTab,
                isActive && { borderColor: d.color, backgroundColor: `${d.color}15` },
              ]}
              onPress={() => setActiveDim(i)}
              activeOpacity={0.7}
            >
              <Text style={styles.dimTabEmoji}>{d.emoji}</Text>
              <Text style={[styles.dimTabName, isActive && { color: d.color }]}>
                {d.name}
              </Text>
              {done > 0 && (
                <View style={[styles.dimBadge, { backgroundColor: d.color }]}>
                  <Text style={styles.dimBadgeText}>{done}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Skills List */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dim Header */}
        <View style={[styles.dimHeader, { borderLeftColor: dim.color }]}>
          <Text style={styles.dimHeaderEmoji}>{dim.emoji}</Text>
          <View>
            <Text style={styles.dimHeaderName}>{dim.name}</Text>
            <Text style={styles.dimHeaderDesc}>{dim.description}</Text>
          </View>
        </View>

        {/* Tier Info */}
        <View style={styles.tierBadge}>
          <Text style={[styles.tierText, { color: dim.color }]}>Tier {dim.id}</Text>
          <Text style={styles.tierNote}>
            {dim.id === 0 && 'Fundament — ohne Basis trägt nichts darüber'}
            {dim.id === 1 && 'Regulation — emotionale Stabilität vor Kognition'}
            {dim.id === 2 && 'Verbindung — Co-Regulation ist biologische Notwendigkeit'}
            {dim.id === 3 && 'Klarheit — wirkt nur bei stabiler Basis'}
            {dim.id === 4 && 'Meisterschaft — durch bewusste Wiederholung'}
            {dim.id === 5 && 'Sinn — die Spitze, die nur trägt wenn unten alles stabil ist'}
          </Text>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  progressBadge: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  progressText: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.teal,
  },
  dimTabScroll: {
    maxHeight: 70,
  },
  dimTabContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  dimTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
    position: 'relative',
  },
  dimTabEmoji: { fontSize: 16 },
  dimTabName: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  dimBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  dimBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.bg,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  dimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 3,
  },
  dimHeaderEmoji: { fontSize: 32 },
  dimHeaderName: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dimHeaderDesc: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierText: {
    fontSize: Typography.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
    minWidth: 40,
  },
  tierNote: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
  },
});
