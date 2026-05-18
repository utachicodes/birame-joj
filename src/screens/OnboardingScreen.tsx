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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Radius } from '../theme';

// full screen dimensions for paginated FlatList
const { width, height } = Dimensions.get('window');

// four intro slides explaining the app's key features
const SLIDES: Array<{
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}> = [
  {
    id: '1',
    icon: 'trophy-outline',
    title: 'Bienvenue aux\nJeux de la Francophonie',
    subtitle: "Votre compagnon officiel pour vivre l'événement sportif et culturel de l'année à Dakar.",
  },
  {
    id: '2',
    icon: 'ticket-outline',
    title: 'Tous vos titres\nen un seul endroit',
    subtitle: 'Billets, accréditations, pass transport — tout dans votre wallet numérique sécurisé.',
  },
  {
    id: '3',
    icon: 'pulse-outline',
    title: 'Scores en direct\net résultats instantanés',
    subtitle: "Suivez tous les sports JOJ en temps réel avec statistiques détaillées et tableau des médailles.",
  },
  {
    id: '4',
    icon: 'wallet-outline',
    title: 'Paiement cashless\ndans tout le site',
    subtitle: 'Rechargez avec Orange Money, Wave, carte ou Apple Pay. Payez partout en XOF.',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null); // ref to programmatically scroll slides
  const [activeIndex, setActiveIndex] = useState(0); // tracks which slide is visible
  const scrollX = useRef(new Animated.Value(0)).current; // drives dot and slide animations

  // listen to scroll to update activeIndex and drive animated values
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width); // snap to nearest slide
        setActiveIndex(idx);
      },
    }
  );

  // advance slide or navigate to auth on last slide
  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      router.replace('/auth'); // done with onboarding, go to login
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.glow1} /> {/* decorative top-right glow blob */}
      <View style={styles.glow2} /> {/* decorative bottom-left glow blob */}

      <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandLogo}>
            <Ionicons name="trophy" size={16} color={Colors.brand} />
          </View>
          <Text style={styles.brandText}>JOJ Dakar 2026</Text>
        </View>
        <Pressable onPress={() => router.replace('/auth')} style={styles.skipBtn}> {/* jump straight to auth */}
          <Text style={styles.skipText}>Passer</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled // full-page snapping
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} // smooth animation updates
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <Slide item={item} index={index} scrollX={scrollX} />}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        {/* animated dot indicators that stretch when active */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8], // active dot is wider
              extrapolate: 'clamp',
            });
            return <Animated.View key={i} style={[styles.dot, { width: dotWidth }]} />;
          })}
        </View>

        <Pressable style={styles.cta} onPress={handleNext}>
          <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Text style={styles.ctaText}>
            {activeIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'} {/* label changes on last slide */}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

// individual slide with parallax-like opacity and translateY driven by scrollX
function Slide({ item, index, scrollX }: { item: (typeof SLIDES)[0]; index: number; scrollX: Animated.Value }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' }); // fade neighboring slides
  const translateY = scrollX.interpolate({ inputRange, outputRange: [40, 0, 40], extrapolate: 'clamp' }); // slide content up when active
  const iconScale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1, 0.8], extrapolate: 'clamp' }); // icon pops on active slide

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.slideContent, { opacity, transform: [{ translateY }] }]}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScale }] }]}>
          <View style={styles.iconRingOuter}> {/* outer faint ring */}
            <View style={styles.iconRingInner}> {/* inner slightly brighter ring */}
              <Ionicons name={item.icon} size={48} color={Colors.brand} />
            </View>
          </View>
        </Animated.View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  glow1: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: Colors.brand + '12', top: -100, right: -100 }, // top-right ambient glow
  glow2: { position: 'absolute', width: 350, height: 350, borderRadius: 175, backgroundColor: Colors.brand + '08', bottom: 100, left: -100 }, // bottom-left ambient glow

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandLogo: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '30', alignItems: 'center', justifyContent: 'center' },
  brandText: { ...Typography.callout, fontWeight: '700' },
  skipBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  skipText: { ...Typography.footnote, color: Colors.textSecondary, fontWeight: '600' },

  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }, // exactly one screen wide for paging
  slideContent: { alignItems: 'center', gap: 28 },
  iconContainer: { padding: 8 },
  iconRingOuter: { width: 160, height: 160, borderRadius: 50, backgroundColor: Colors.brand + '08', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.brand + '15' },
  iconRingInner: { width: 120, height: 120, borderRadius: 38, backgroundColor: Colors.brand + '12', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.brand + '30' },
  title: { fontSize: 30, fontWeight: '900', color: Colors.text, textAlign: 'center', lineHeight: 36, letterSpacing: -0.6 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 23, maxWidth: 320 },

  footer: { paddingHorizontal: 24, gap: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4, backgroundColor: Colors.brand }, // width is animated

  cta: { height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, overflow: 'hidden' },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
});
