# JOJ SuperApp — Jeux de la Francophonie Dakar 2026

<p align="left">
  <img src="https://img.shields.io/badge/Expo-54.0.0-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-iOS_%26_Android-FF6B35?style=for-the-badge&logo=apple&logoColor=white" />
  <img src="https://img.shields.io/badge/i18n-FR_%7C_EN_%7C_AR_%7C_WO-C9A84C?style=for-the-badge&logoColor=white" />
</p>

<p align="left">
  <img src="https://img.shields.io/github/last-commit/utachicodes/birame-joj?style=for-the-badge&color=C9A84C&labelColor=050A18" />
  <img src="https://img.shields.io/github/languages/top/utachicodes/birame-joj?style=for-the-badge&color=3178C6&labelColor=050A18" />
  <img src="https://img.shields.io/github/repo-size/utachicodes/birame-joj?style=for-the-badge&color=4ECDC4&labelColor=050A18" />
</p>

A unified travel and event management mobile application built for the Jeux de la Francophonie, Dakar 2026. The app consolidates digital ticketing, live sports scores, cashless payments, transportation booking, venue navigation, and food ordering into a single platform for every attendee, athlete, media personnel, and official guest.

---

## Overview

The JOJ SuperApp is the sole digital companion for the Jeux de la Francophonie. It eliminates the fragmentation that defines large international events by replacing physical tickets, paper schedules, cash transactions, and disconnected transport apps with a single, offline-resilient mobile experience.

Built for iOS and Android using React Native and Expo, the app features a full glassmorphism design system inspired by the iOS 26 liquid glass aesthetic, paired with the JOJ brand identity of warm accent tones, bold typography, and deep navy backgrounds.

---

## Screens

**Onboarding**
Four-slide animated introduction with language selection across French, English, Arabic, and Wolof. Parallax scroll transitions and per-slide accent theming.

**Authentication**
Email and phone login, full registration flow, biometric authentication via Face ID and fingerprint, and social login. Multi-language toggle available from the auth screen.

**Home Dashboard**
Live score cards with real-time data, event countdown banner, six-item quick-action grid, next ticket preview with QR placeholder, programme list for the current day, and a wallet balance widget.

**Digital Tickets**
Full-screen accreditation QR card, stacked ticket list with perforation design, dynamic QR modal with NFC and share actions. Supports general admission, VIP, athlete accreditation, staff, media, and transport passes.

**Events and Live Scores**
Three-tab layout covering the full programme with day selector and sport filter, live match scores with period tracking, and a medal table with country standings.

**Transport**
Three-tab layout for the transport overview, Yango ride booking with route input and fare estimation, and official shuttle schedules with real-time departure times and seat availability.

**Wallet**
Gold credit card interface with animated balance display. Top-up modal supporting Orange Money, Wave, card, and Apple Pay. QR payment flow, full transaction history, and PDF receipt export.

**Map**
Interactive venue directory covering all six official JOJ sites with capacity, discipline, and GPS navigation support.

**Food and Merchandise**
Category-filtered ordering with cart management, seat delivery option, and checkout flow billed to the in-app wallet.

**Profile**
Digital identity card with accreditation number, language switcher, notification preferences, accessibility settings, and account management.

---

## Design System

The app uses a custom glassmorphism design system built on top of native primitives.

Glass surfaces are rendered using expo-blur BlurView with translucent rgba overlays ranging from 7 to 22 percent opacity. Specular borders at 10 to 28 percent white opacity simulate the liquid glass effect introduced in iOS 26. Decorative gradient blobs sit behind all surfaces to create depth without performance cost.

**Brand tokens**

| Token | Value | Usage |
|---|---|---|
| Orange | #FF6B35 | Primary actions, active states, accents |
| Gold | #C9A84C | Wallet, premium surfaces, highlights |
| Navy | #050A18 | Background, deep surfaces |
| Teal | #4ECDC4 | Transport, secondary accents |
| Purple | #7B5EA7 | Profile, accreditation |

**Typography** follows the iOS SF Pro hierarchy using the system font with seven defined levels from Large Title at 34pt bold down to Caption 2 at 11pt.

**Animation** uses React Native's built-in Animated API with spring physics for tab bar interactions, scroll-driven parallax on the onboarding slides, and spring scale feedback on all interactive elements.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81.5 |
| Runtime | Expo SDK 54 |
| Navigation | Expo Router 6 with file-based routing |
| Blur and glass | expo-blur with native BlurView |
| Gradients | expo-linear-gradient |
| Animation | React Native Animated API |
| Icons | Ionicons via @expo/vector-icons |
| Safe areas | react-native-safe-area-context |
| Internationalisation | Custom i18n with French, English, Arabic, Wolof |
| State management | React Context API |
| Type safety | TypeScript 5.3 strict mode |

---

## Getting Started

Clone the repository and install dependencies.

```bash
git clone https://github.com/utachicodes/birame-joj.git
cd birame-joj
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with Expo Go on iOS or Android. Ensure Expo Go is version 54 to match the SDK.

For iOS Simulator, open Simulator.app first then press `i` in the terminal.

---

## Project Structure

```
app/                    Expo Router file-based routes
  (tabs)/               Tab navigator screens
    events.tsx
    profile.tsx
    tickets.tsx
    transport.tsx
  _layout.tsx
  auth.tsx
  food.tsx
  map.tsx
  onboarding.tsx
  wallet.tsx

src/
  components/           Shared UI components
  context/              App-wide state (AppContext.tsx)
  data/                 Mock data and type definitions
  i18n/                 Internationalisation strings (FR/EN/AR/WO)
  screens/              Screen implementations
  theme/                Color tokens, typography, spacing

assets/                 App icons and splash screen
```

---

## Author

Abdoullah Ndao
Jeux de la Francophonie Dakar 2026
