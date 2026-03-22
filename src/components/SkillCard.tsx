import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import { Skill } from '../constants/dimensions';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  skill: Skill;
  dimensionColor: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const SkillCard: React.FC<Props> = ({ skill, dimensionColor, isCompleted, onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardDone]}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.8}>
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{skill.emoji}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, isCompleted && styles.nameDone]}>{skill.name}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>⏱ {skill.time}</Text>
            <View style={[styles.xpBadge, { backgroundColor: `${dimensionColor}22` }]}>
              <Text style={[styles.xpText, { color: dimensionColor }]}>+{skill.xp} XP</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.checkBtn, isCompleted && { backgroundColor: dimensionColor }]}
          onPress={onToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.checkIcon, isCompleted && styles.checkIconDone]}>
            {isCompleted ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.desc}>{skill.description}</Text>

          <Text style={styles.sectionLabel}>WIE ES GEHT</Text>
          {skill.howTo.map((step, i) => (
            <View key={i} style={styles.step}>
              <Text style={[styles.stepNum, { color: dimensionColor }]}>{i + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>BIOLOGISCHER EFFEKT</Text>
          {skill.bio.map((b, i) => (
            <Text key={i} style={styles.bioItem}>{b}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardDone: {
    borderColor: Colors.borderAccent,
    backgroundColor: 'rgba(78,204,163,0.04)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  emojiWrap: {
    width: 44,
    height: 44,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  nameDone: {
    color: Colors.teal,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  xpBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  xpText: {
    fontSize: Typography.xs,
    fontWeight: '700',
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  checkIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  checkIconDone: {
    color: Colors.bg,
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  desc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stepNum: {
    fontSize: Typography.sm,
    fontWeight: '800',
    marginRight: 8,
    width: 18,
  },
  stepText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 19,
  },
  bioItem: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
});
