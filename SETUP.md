# HUMANEED — React Native App

**Dein täglicher Kompass für biologische Balance**

---

## Voraussetzungen

- **Node.js** (v18 oder neuer) → https://nodejs.org
- **Expo Go** App auf deinem iPhone (kostenlos im App Store)
- Terminal / Kommandozeile

---

## Starten (3 Schritte)

### Schritt 1 — In den App-Ordner wechseln
```bash
cd humaneed-app
```

### Schritt 2 — Dependencies installieren
```bash
npm install
```
> Das dauert beim ersten Mal 1–2 Minuten.

### Schritt 3 — App starten
```bash
npx expo start
```

Ein **QR-Code** erscheint im Terminal.

### Schritt 4 — Auf iPhone öffnen
1. Öffne die **Expo Go** App auf deinem iPhone
2. Tippe auf **„Scan QR Code"**
3. Scanne den QR-Code aus dem Terminal
4. Die App startet auf deinem Handy ✅

> iPhone und Computer müssen im **gleichen WLAN** sein!

---

## App-Struktur

```
humaneed-app/
├── App.tsx                    ← Entry Point
├── src/
│   ├── constants/
│   │   ├── theme.ts           ← Farben, Abstände, Schriften
│   │   ├── dimensions.ts      ← 6 Dimensionen + 30 Skills
│   │   └── philosophy.ts      ← 5 Prinzipien, Aphorismen, 15 Setups
│   ├── store/
│   │   └── useStore.ts        ← State + AsyncStorage Persistenz
│   ├── navigation/
│   │   └── AppNavigator.tsx   ← Tab- & Stack-Navigation
│   ├── screens/
│   │   ├── HomeScreen.tsx     ← Tages-Dashboard
│   │   ├── CheckInScreen.tsx  ← Skill-Tracking
│   │   ├── InsightsScreen.tsx ← Verlauf & Charts
│   │   ├── WisdomScreen.tsx   ← Philosophisches Fundament
│   │   ├── ProfileScreen.tsx  ← Level, Stats, Mastery
│   │   └── DimensionDetailScreen.tsx
│   └── components/
│       ├── DimensionCard.tsx  ← Dimension-Karte mit Score
│       └── SkillCard.tsx      ← Skill mit ausklappbarer Anleitung
```

---

## Features

| Feature | Beschreibung |
|---------|-------------|
| 🏠 **Heute** | Tages-Score, 6 Dimensionen, Aphorismus, Tagesprinzip |
| ✅ **Skills** | 30 Skills in 6 Dimensionen, ausklappbar mit Anleitung |
| 📊 **Verlauf** | XP-Level, Wochendiagramm, Ø-Dimensionsscores |
| 🌟 **Warum** | 5 Prinzipien, Aphorismen, 15 Mini-Setups, Theorie |
| 👤 **Profil** | Level-Pfad, Statistik, Dimension-Mastery |

---

## Philosophisches Fundament

Die App basiert auf **„Bewusstsein, Struktur und das gelebte Leben"** —
einer Synthese aus Philosophie, Neurowissenschaft, Epigenetik und gelebter Praxis.

**Die 6 Dimensionen sind eine Hierarchie (Tier 0–5):**
- Tier 0 · Biologie — Das physische Fundament
- Tier 1 · Emotion — Regulation vor Kognition
- Tier 2 · Sozial — Co-Regulation als biologische Notwendigkeit
- Tier 3 · Kognition — Wirkt nur bei stabiler Basis
- Tier 4 · Kompetenz — Meisterschaft durch Wiederholung
- Tier 5 · Bedeutung — Die Spitze, die nur trägt wenn unten alles stabil ist

**Coaching-Kernsatz:**
> *„Pflege die Form, in der Welt durch dich bewusst wird."*

---

## Für den App Store (späterer Schritt)

Um die App im App Store zu veröffentlichen:
1. Apple Developer Account erstellen ($99/Jahr)
2. `npx expo build:ios` oder EAS Build verwenden
3. In Xcode auf Mac signieren und einreichen

Für jetzt: **Expo Go** ist der schnellste Weg zum Testen auf deinem iPhone!
