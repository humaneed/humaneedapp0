import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import { Dimension } from '../constants/dimensions';

interface Props {
  dimension: Dimension;
  score: number;
  completedToday: number;
  onPress: () => void;
}

export const DimensionCard: React.FC<Props> = ({ dimension, score, completedToday, onPress }) => {
  const getScoreColor = () => {
    if (score >= 70) return Colors.teal;
    if (score >= 40) return Colors.amber;
    return Colors.coral;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{dimension.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{dimension.name}</Text>
          <Text style={styles.skills}>{completedToday} Skills heute</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: `${getScoreColor()}22` }]}>
          <Text style={[styles.scoreText, { color: getScoreColor() }]}>{score}%</Text>
        </View>
      </View>
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${score}%`, backgroundColor: dimension.color },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 26,
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  skills: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  scoreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  scoreText: {
    fontSize: Typography.sm,
    fontWeight: '700',
  },
  barBg: {
    height: 4,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
