import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';

const { width: W } = Dimensions.get('window');

export default function GreetingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();

  const firstName = state.user?.name?.split(' ')[0] ?? 'Athlete';

  // ── Animation values ──────────────────────────────────────────────────────
  const screenOpacity = useRef(new Animated.Value(0)).current;

  const ringScale1 = useRef(new Animated.Value(0.5)).current;
  const ringScale2 = useRef(new Animated.Value(0.3)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;

  const iconScale = useRef(new Animated.Value(0.3)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  const greetY = useRef(new Animated.Value(28)).current;
  const greetO = useRef(new Animated.Value(0)).current;
  const nameY = useRef(new Animated.Value(36)).current;
  const nameO = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(20)).current;
  const tagO = useRef(new Animated.Value(0)).current;

  const btnY = useRef(new Animated.Value(24)).current;
  const btnO = useRef(new Animated.Value(0)).current;

  const spring = (val: Animated.Value, toValue: number, delay = 0) =>
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(val, { toValue, tension: 90, friction: 12, useNativeDriver: true }),
    ]);

  const fade = (val: Animated.Value, toValue: number, delay = 0, dur = 380) =>
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(val, { toValue, duration: dur, useNativeDriver: true }),
    ]);

  useEffect(() => {
    Animated.parallel([
      // Screen fade in
      fade(screenOpacity, 1, 0, 250),

      // Rings expand
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.spring(ringScale1, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
          fade(ringOpacity1, 1, 0, 300),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(160),
        Animated.parallel([
          Animated.spring(ringScale2, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }),
          fade(ringOpacity2, 1, 0, 350),
        ]),
      ]),

      // Icon pop in
      spring(iconScale, 1, 120),
      fade(iconOpacity, 1, 120, 280),

      // Text stagger
      Animated.parallel([spring(greetY, 0, 300), fade(greetO, 1, 300, 400)]),
      Animated.parallel([spring(nameY, 0, 400), fade(nameO, 1, 400, 400)]),
      Animated.parallel([spring(tagY, 0, 520), fade(tagO, 1, 520, 400)]),

      // Button
      Animated.parallel([spring(btnY, 0, 680), fade(btnO, 1, 680, 400)]),
    ]).start();
  }, []);

  const handleEnter = () => {
    Animated.parallel([
      Animated.timing(screenOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start(() => {
      router.replace('/(tabs)' as any);
    });
  };

  return (
    <Animated.View style={[s.root, { opacity: screenOpacity }]}>
      <StatusBar style="light" />

      {/* Deep background */}
      <LinearGradient
        colors={['#060810', '#0C1126', '#060810']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial glow behind icon */}
      <View style={s.glowWrap} pointerEvents="none">
        <Animated.View
          style={[
            s.ring2,
            { transform: [{ scale: ringScale2 }], opacity: ringOpacity2 },
          ]}
        />
        <Animated.View
          style={[
            s.ring1,
            { transform: [{ scale: ringScale1 }], opacity: ringOpacity1 },
          ]}
        />
      </View>

      {/* ── Content ── */}
      <View style={[s.content, { paddingTop: insets.top + 80 }]}>
        {/* Icon */}
        <Animated.View
          style={[
            s.iconWrap,
            { opacity: iconOpacity, transform: [{ scale: iconScale }] },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,107,53,0.18)', 'rgba(255,107,53,0.04)']}
            style={s.iconBg}
          >
            <View style={s.iconInner}>
              <Ionicons name="trophy" size={44} color="#FF6B35" />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Text block */}
        <View style={s.textBlock}>
          <Animated.Text
            style={[s.greeting, { opacity: greetO, transform: [{ translateY: greetY }] }]}
          >
            Welcome,
          </Animated.Text>

          <Animated.Text
            style={[s.name, { opacity: nameO, transform: [{ translateY: nameY }] }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {firstName}.
          </Animated.Text>

          <Animated.Text
            style={[s.tagline, { opacity: tagO, transform: [{ translateY: tagY }] }]}
          >
            Ready for JOJ Dakar 2026?
          </Animated.Text>
        </View>
      </View>

      {/* ── Enter button ── */}
      <Animated.View
        style={[
          s.btnWrap,
          { paddingBottom: insets.bottom + 40, opacity: btnO, transform: [{ translateY: btnY }] },
        ]}
      >
        <EnterButton onPress={handleEnter} />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Enter button with press animation ───────────────────────────────────────

function EnterButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View style={[eS.wrap, { transform: [{ scale }] }]}>
      <Pressable onPress={handlePress} style={eS.btn}>
        <LinearGradient
          colors={['#FF8450', '#E6461C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={eS.label}>Enter the Games</Text>
        <View style={eS.arrow}>
          <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.85)" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const eS = StyleSheet.create({
  wrap: {
    marginHorizontal: 28,
    borderRadius: 18,
    overflow: 'hidden',
  },
  btn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const RING_SIZE = W * 0.72;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#060810',
  },
  glowWrap: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    marginLeft: -(RING_SIZE / 2),
    marginTop: -(RING_SIZE / 2),
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: 'rgba(255,107,53,0.065)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.12)',
  },
  ring2: {
    position: 'absolute',
    width: RING_SIZE * 1.55,
    height: RING_SIZE * 1.55,
    borderRadius: (RING_SIZE * 1.55) / 2,
    backgroundColor: 'rgba(255,107,53,0.025)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.06)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 48,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    width: 110,
    height: 110,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.20)',
  },
  iconInner: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255,107,53,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    alignItems: 'center',
    gap: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: -0.2,
  },
  name: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textAlign: 'center',
    maxWidth: W - 64,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.36)',
    letterSpacing: -0.1,
    marginTop: 4,
  },
  btnWrap: {
    paddingHorizontal: 0,
  },
});
