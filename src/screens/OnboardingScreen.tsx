import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlassButton from '../components/GlassButton';
import { Colors, Typography, Radius } from '../theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🏆',
    title: 'Bienvenue aux\nJeux de la\nFrancophonie',
    subtitle: 'Votre compagnon officiel pour vivre l\'événement sportif et culturel de l\'année.',
    gradient: ['#0D0B2E', '#1A0E3D', '#0E1F45'] as const,
    accent: Colors.orange,
  },
  {
    id: '2',
    emoji: '🎫',
    title: 'Tous vos titres\nen un seul\nendroit',
    subtitle: 'Billets, accréditations, pass transport — tout dans votre wallet numérique sécurisé.',
    gradient: ['#051A2E', '#0A2E45', '#051A2E'] as const,
    accent: Colors.teal,
  },
  {
    id: '3',
    emoji: '⚡',
    title: 'Scores en direct\net résultats\ninstantanés',
    subtitle: 'Suivez tous les sports JOJ en temps réel avec statistiques et tableau des médailles.',
    gradient: ['#1A0A0E', '#2E0F1A', '#1A0A0E'] as const,
    accent: Colors.pink,
  },
  {
    id: '4',
    emoji: '💳',
    title: 'Paiement\ncashless dans\ntout le site',
    subtitle: 'Rechargez avec Orange Money, Wave, carte ou Apple Pay. Payez partout en XOF.',
    gradient: ['#0D1A0A', '#152E12', '#0D1A0A'] as const,
    accent: Colors.gold,
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(idx);
      },
    }
  );

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      router.replace('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Pressable
                key={i}
                onPress={() => flatListRef.current?.scrollToIndex({ index: i, animated: true })}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: SLIDES[activeIndex].accent,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buttons}>
          <GlassButton
            title={activeIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
            onPress={handleNext}
            fullWidth
            size="lg"
            gradient={[SLIDES[activeIndex].accent, SLIDES[activeIndex].accent + 'CC'] as any}
          />
          {activeIndex < SLIDES.length - 1 && (
            <GlassButton
              title="Passer"
              onPress={() => router.replace('/auth')}
              variant="ghost"
              fullWidth
              size="md"
            />
          )}
        </View>
      </View>
    </View>
  );
}

function SlideItem({
  item,
  index,
  scrollX,
}: {
  item: (typeof SLIDES)[0];
  index: number;
  scrollX: Animated.Value;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, 40],
    extrapolate: 'clamp',
  });

  return (
    <LinearGradient colors={item.gradient} style={styles.slide}>
      <View style={[styles.blob1, { backgroundColor: item.accent + '20' }]} />
      <View style={[styles.blob2, { backgroundColor: item.accent + '15' }]} />

      <Animated.View style={[styles.slideContent, { opacity, transform: [{ translateY }] }]}>
        <View style={[styles.emojiContainer, { borderColor: item.accent + '40' }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>

        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

        <View style={[styles.accentLine, { backgroundColor: item.accent }]} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 200,
  },
  blob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '10%',
    right: -80,
  },
  blob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: '20%',
    left: -60,
  },
  slideContent: {
    alignItems: 'center',
    gap: 20,
  },
  emojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 52,
  },
  slideTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1,
  },
  slideSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  accentLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttons: {
    gap: 8,
  },
});
