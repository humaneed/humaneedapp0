import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography, Shadow } from '../constants/theme';
import {
  APHORISMS, FIVE_PRINCIPLES, MINI_SETUPS, CORE_INSIGHT, TIER_LOGIC,
} from '../constants/philosophy';

type Tab = 'prinzipien' | 'aphorismen' | 'setups' | 'theorie';

export function WisdomScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('prinzipien');

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'prinzipien', label: '5 Prinzipien', emoji: '🏛️' },
    { key: 'aphorismen', label: 'Gedanken', emoji: '💬' },
    { key: 'setups', label: '15 Setups', emoji: '⚙️' },
    { key: 'theorie', label: 'Theorie', emoji: '🧠' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <Text style={styles.title}>Warum</Text>
        <Text style={styles.subtitle}>Das philosophische Fundament</Text>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabEmoji}>{t.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* PRINZIPIEN */}
        {activeTab === 'prinzipien' && (
          <View style={styles.section}>
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>{CORE_INSIGHT}</Text>
            </View>
            <Text style={styles.sectionTitle}>DIE FÜNF PRINZIPIEN BEWUSSTEN LEBENS</Text>
            {FIVE_PRINCIPLES.map(p => (
              <View key={p.number} style={styles.principleCard}>
                <View style={styles.principleHeader}>
                  <View style={styles.principleNumBadge}>
                    <Text style={styles.principleNum}>{p.number}</Text>
                  </View>
                  <Text style={styles.principleEmoji}>{p.emoji}</Text>
                  <View style={styles.principleTitleWrap}>
                    <Text style={styles.principleTitle}>{p.title}</Text>
                    <Text style={styles.principleDim}>{p.dimension}</Text>
                  </View>
                </View>
                <Text style={styles.principleDesc}>{p.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* APHORISMEN */}
        {activeTab === 'aphorismen' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>APHORISMEN — DER AUSGANGSPUNKT IM ERLEBEN</Text>
            {APHORISMS.map((aph, i) => (
              <View key={i} style={styles.aphorismCard}>
                <Text style={styles.aphorismQuote}>❝</Text>
                <Text style={styles.aphorismText}>{aph}</Text>
              </View>
            ))}
            <View style={styles.sourceCard}>
              <Text style={styles.sourceTitle}>Quelle</Text>
              <Text style={styles.sourceText}>
                Aus: „Bewusstsein, Struktur und das gelebte Leben" (2026) — eine Synthese aus Philosophie, Neurowissenschaft, Quantenphysik, Epigenetik und gelebter Praxis.
              </Text>
            </View>
          </View>
        )}

        {/* MINI-SETUPS */}
        {activeTab === 'setups' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>15 MINI-SETUPS — STRUKTURINTERVENTIONEN</Text>
            <View style={styles.setupIntro}>
              <Text style={styles.setupIntroText}>
                Diese Interventionen folgen der Logik:{'\n'}
                <Text style={styles.setupIntroHighlight}>Kleine Wiederholung × Zeit = strukturelle Transformation</Text>
              </Text>
            </View>
            {MINI_SETUPS.map(s => (
              <View key={s.id} style={styles.setupCard}>
                <View style={styles.setupHeader}>
                  <View style={styles.setupNumBadge}>
                    <Text style={styles.setupNum}>{s.number}</Text>
                  </View>
                  <Text style={styles.setupEmoji}>{s.emoji}</Text>
                  <View style={styles.setupTitleWrap}>
                    <Text style={styles.setupTitle}>{s.title}</Text>
                    <View style={styles.setupMeta}>
                      <Text style={styles.setupTime}>⏱ {s.time}</Text>
                      <View style={styles.setupPrinciple}>
                        <Text style={styles.setupPrincipleText}>{s.principle}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.setupDesc}>{s.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* THEORIE */}
        {activeTab === 'theorie' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DIE TIER-LOGIK DER 6 DIMENSIONEN</Text>
            <View style={styles.theoryIntro}>
              <Text style={styles.theoryIntroText}>
                Die 6 Dimensionen sind keine gleichwertigen Kategorien — sie sind eine Hierarchie. Niedrigere Tiers sind Voraussetzung für höhere.
              </Text>
            </View>
            {TIER_LOGIC.map(t => (
              <View key={t.tier} style={styles.tierCard}>
                <View style={styles.tierLeft}>
                  <Text style={styles.tierNum}>Tier {t.tier}</Text>
                  <Text style={styles.tierName}>{t.name}</Text>
                </View>
                <Text style={styles.tierNote}>{t.note}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>SYNERGIE-LOGIK</Text>
            {[
              { from: 'Biologie kritisch (<30%)', effect: 'kognitive Effektivität −30%', emoji: '🫀→🧠' },
              { from: 'Soziale Verbindung fehlt', effect: 'Sinnfindung erschwert', emoji: '🤝→🌟' },
              { from: 'Emotionale Regulation niedrig', effect: 'Fokus leidet', emoji: '🎭→🧠' },
            ].map((s, i) => (
              <View key={i} style={styles.synergyCard}>
                <Text style={styles.synergyEmoji}>{s.emoji}</Text>
                <View style={styles.synergyText}>
                  <Text style={styles.synergyFrom}>Wenn: {s.from}</Text>
                  <Text style={styles.synergyEffect}>→ {s.effect}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>KERNFORMEL</Text>
            <View style={styles.formulaCard}>
              <Text style={styles.formulaText}>
                Realität ist strukturiert.{'\n'}
                Bewusstsein ist die Innenseite dieser Struktur.{'\n'}
                Das Ich ist endlich. Die Wirkung nicht.{'\n'}
                Handle entsprechend.
              </Text>
              <View style={styles.formulaDivider} />
              <Text style={styles.formulaCoaching}>
                „Pflege die Form, in der Welt durch dich bewusst wird."
              </Text>
            </View>

            <View style={styles.sourceCard}>
              <Text style={styles.sourceTitle}>Quellen & Denker</Text>
              <Text style={styles.sourceText}>
                Philosophie: Descartes, Spinoza, Kant, Wittgenstein, Husserl, Heidegger, Merleau-Ponty, Nagarjuna, Marc Aurel, Laozi{'\n\n'}
                Neurowissenschaft: Tononi (IIT), Friston (Predictive Processing), Porges (Polyvagal), Walker (Schlaf), Libet{'\n\n'}
                Epigenetik: BDNF, HPA-Achse, Oxytocin-System, Telomere, transgenerationale Prägung
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tabScroll: { maxHeight: 56 },
  tabContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  tabActive: {
    borderColor: Colors.teal,
    backgroundColor: 'rgba(78,204,163,0.1)',
  },
  tabEmoji: { fontSize: 15 },
  tabLabel: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabLabelActive: { color: Colors.teal },
  scroll: { flex: 1 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  insightCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.teal,
    marginBottom: Spacing.xl,
  },
  insightText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  principleCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
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
  principleNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(78,204,163,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  principleNum: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.teal,
  },
  principleEmoji: { fontSize: 22 },
  principleTitleWrap: { flex: 1 },
  principleTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  principleDim: {
    fontSize: Typography.xs,
    color: Colors.teal,
    fontWeight: '600',
    marginTop: 1,
  },
  principleDesc: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  aphorismCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aphorismQuote: {
    fontSize: 22,
    color: Colors.teal,
    marginBottom: 4,
  },
  aphorismText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 23,
    fontStyle: 'italic',
  },
  sourceCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sourceTitle: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sourceText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  setupIntro: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  setupIntroText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  setupIntroHighlight: {
    color: Colors.teal,
    fontWeight: '700',
  },
  setupCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  setupNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupNum: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textMuted,
  },
  setupEmoji: { fontSize: 20 },
  setupTitleWrap: { flex: 1 },
  setupTitle: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  setupMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setupTime: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  setupPrinciple: {
    backgroundColor: 'rgba(78,204,163,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.sm,
  },
  setupPrincipleText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.teal,
  },
  setupDesc: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  theoryIntro: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  theoryIntroText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  tierLeft: { minWidth: 72 },
  tierNum: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.teal,
    letterSpacing: 0.5,
  },
  tierName: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  tierNote: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 17,
    paddingTop: 2,
  },
  synergyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  synergyEmoji: { fontSize: 20, minWidth: 40 },
  synergyText: { flex: 1 },
  synergyFrom: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  synergyEffect: {
    fontSize: Typography.sm,
    color: Colors.coral,
    fontWeight: '600',
  },
  formulaCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.teal,
  },
  formulaText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  formulaDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  formulaCoaching: {
    fontSize: Typography.base,
    color: Colors.teal,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 22,
  },
});
