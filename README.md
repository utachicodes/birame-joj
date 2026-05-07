# JOJ SuperApp — Jeux de la Francophonie 🏆

A beautiful React Native + Expo super-app for the Jeux de la Francophonie, featuring iOS 26 glassmorphism design.

## Getting started

```bash
npm install
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator.

## Screens

| Screen | Description |
|--------|-------------|
| Onboarding | 4-slide animated intro in FR/EN/AR/WO |
| Auth | Login + Register with biometric |
| Home | Dashboard: live scores, next ticket, quick actions |
| Tickets | Digital wallet: QR codes, NFC, accreditation |
| Events | Programme, Live scores, Médailles |
| Transport | Yango rides, official shuttles, route map |
| Wallet | Cashless payments, top-up, transactions |
| Profile | Identity card, settings, language, accessibility |

## Design system

- **Glassmorphism**: `expo-blur` BlurView + translucent overlays
- **iOS 26 liquid glass**: specular borders, gradient blobs, frosted surfaces
- **Brand**: JOJ orange `#FF6B35`, gold `#C9A84C`, deep navy `#050A18`
- **Typography**: SF Pro system font hierarchy
- **Animations**: `react-native-reanimated` spring & interpolation

## Stack

- **Expo 53** + Expo Router (file-based navigation)
- **expo-blur** — native blur/frosted glass
- **expo-linear-gradient** — gradient backgrounds & cards
- **react-native-reanimated** — spring animations
- **@expo/vector-icons** — Ionicons
- **react-native-safe-area-context** — safe insets
