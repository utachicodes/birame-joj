import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { useTranslation } from '../../src/i18n';
import { getColors, Radius } from '../../src/theme';

type Tab      = 'yango' | 'navettes' | 'carte';
type RideStep = 0 | 1 | 2 | 3 | 4;

const LOCATIONS = [
  'Aéroport AIBD',
  'Stade Léopold Sédar Senghor',
  'Dakar Arena',
  'Village JOJ',
  'Centre-Ville Dakar',
  'Piscine Olympique',
  'Palais des Sports',
  'Centre des Médias',
];

// Deterministic fake price based on route string — same pair always gives same price
function getPrice(from: string, to: string): number {
  const hash = (from + to).length * 317 + from.charCodeAt(0) * 13;
  return Math.round(((hash % 6000) + 2500) / 100) * 100;
}

const SHUTTLE_ROUTES = [
  {
    id: 'S1',
    name: 'Route A — Centre',
    from: 'AIBD',
    to: 'Dakar Centre',
    available: 24,
    departures: ['14:35', '15:05', '15:35', '16:05'],
    nextIn: '8 min',
  },
  {
    id: 'S2',
    name: 'Route B — Stade LSS',
    from: 'Village JOJ',
    to: 'Stade Léopold Sédar Senghor',
    available: 8,
    departures: ['15:00', '15:30', '16:00', '16:30'],
    nextIn: '22 min',
  },
  {
    id: 'S3',
    name: 'Route C — Arena',
    from: 'Hôtel Roi du Lac',
    to: 'Dakar Arena',
    available: 18,
    departures: ['13:45', '14:15', '14:45', '15:15'],
    nextIn: '5 min',
  },
  {
    id: 'S4',
    name: 'Route D — Village',
    from: 'Centre-Ville Dakar',
    to: 'Village JOJ',
    available: 3,
    departures: ['14:50', '15:20', '15:50'],
    nextIn: '12 min',
  },
];

export default function TransportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);
  const [tab, setTab] = useState<Tab>('yango');
  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1 }]}>
        <Text style={[s.headerTitle, { color: C.text }]}>{t.transport}</Text>
        <View style={s.tabs}>
          <TabBtn active={tab === 'yango'}    onPress={() => setTab('yango')}    icon="car-outline"  label="Yango" C={C} />
          <TabBtn active={tab === 'navettes'} onPress={() => setTab('navettes')} icon="bus-outline"  label={t.shuttles} C={C} />
          <TabBtn active={tab === 'carte'}    onPress={() => setTab('carte')}    icon="map-outline"  label="Carte" C={C} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'yango'    && <YangoTab C={C} t={t} />}
        {tab === 'navettes' && <NavettesTab C={C} t={t} />}
        {tab === 'carte'    && <CarteTab C={C} t={t} router={router} />}
      </ScrollView>
    </View>
  );
}

// Shared tab pill button
function TabBtn({
  active,
  onPress,
  icon,
  label,
  C,
}: {
  active: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: Radius.full,
        backgroundColor: active ? C.surface3 : C.surface1,
        borderWidth: 1,
        borderColor: active ? C.border2 : C.border1,
      }}
    >
      <Ionicons name={icon} size={15} color={active ? C.text : C.textTertiary} />
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? C.text : C.textTertiary }}>{label}</Text>
    </Pressable>
  );
}

// Yango ride booking flow
function YangoTab({ C, t }: { C: ReturnType<typeof getColors>; t: ReturnType<typeof useTranslation> }) {
  const [rideStep, setRideStep]         = useState<RideStep>(0);
  const [fromIdx, setFromIdx]           = useState(0);
  const [toIdx, setToIdx]               = useState(2);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker]     = useState(false);
  const [eta, setEta]                   = useState(12);
  const progressAnim                    = useRef(new Animated.Value(0)).current;

  const fromLoc = LOCATIONS[fromIdx];
  const toLoc   = LOCATIONS[toIdx];
  const price   = getPrice(fromLoc, toLoc);

  useEffect(() => {
    if (rideStep === 3) {
      setEta(12);
      const interval = setInterval(() => setEta((e) => Math.max(0, e - 1)), 1000);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: false,
      }).start(() => setRideStep(4)); // auto-advance to "arrived"
      return () => clearInterval(interval);
    }
  }, [rideStep]);

  const handleCommand = () => {
    setRideStep(1);
    setTimeout(() => setRideStep(2), 3000);
  };

  const handleConfirm = () => setRideStep(3);
  const handleCancel  = () => { setRideStep(0); progressAnim.setValue(0); };
  const handleFinish  = () => { setRideStep(0); progressAnim.setValue(0); };

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

 
  if (showFromPicker || showToPicker) {
    const current = showFromPicker ? fromIdx : toIdx;
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 16 }}>
          {showFromPicker ? t.from : t.to}
        </Text>
        {LOCATIONS.map((loc, idx) => (
          <Pressable
            key={loc}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: Radius.lg, backgroundColor: C.surface2, borderWidth: 1, borderColor: idx === current ? C.brand + '60' : C.border1, marginBottom: 8, gap: 12 }}
            onPress={() => {
              if (showFromPicker) setFromIdx(idx);
              else setToIdx(idx);
              setShowFromPicker(false);
              setShowToPicker(false);
            }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.brand + '15', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="location-outline" size={18} color={C.brand} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.text }}>{loc}</Text>
            {idx === current && <Ionicons name="checkmark-circle" size={20} color={C.brand} />} {/* mark current selection */}
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <>
      {/* Yango partner banner */}
      <View style={{ borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 4 }}>
        <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 }}>
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="car-sport" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>Yango Ride</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Partenaire officiel JOJ 2026</Text>
            </View>
            {/* "ACTIF" status pill */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.20)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3FBA7A' }} />
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.5 }}>ACTIF</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Step 0: route picker + request button */}
      {rideStep === 0 && (
        <>
          {/* From / To route selector */}
          <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 16, gap: 0 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Route line dots */}
              <View style={{ alignItems: 'center', paddingTop: 18 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.brand, borderWidth: 2, borderColor: C.brand + '50' }} />
                <View style={{ width: 2, flex: 1, backgroundColor: C.border2, marginVertical: 4 }} />
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal, borderWidth: 2, borderColor: C.teal + '50' }} />
              </View>
              <View style={{ flex: 1 }}>
                <Pressable onPress={() => setShowFromPicker(true)} style={{ paddingVertical: 14, gap: 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border1 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: C.textTertiary, textTransform: 'uppercase' }}>{t.from}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{fromLoc}</Text>
                </Pressable>
                <Pressable onPress={() => setShowToPicker(true)} style={{ paddingVertical: 14, gap: 2 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: C.textTertiary, textTransform: 'uppercase' }}>{t.to}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{toLoc}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Price / wait / availability summary */}
          <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: C.text }}>~8 min</Text>
                <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '600' }}>Attente</Text>
              </View>
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: C.border1 }} />
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: C.brand }}>{price.toLocaleString('fr-FR')} XOF</Text>
                <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '600' }}>{t.estimate}</Text>
              </View>
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: C.border1 }} />
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: C.text }}>3</Text>
                <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '600' }}>Disponibles</Text>
              </View>
            </View>
            <Pressable
              onPress={handleCommand}
              style={{ height: 52, borderRadius: Radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
            >
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Ionicons name="car-outline" size={18} color="#fff" />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>{t.requestRide}</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Step 1: searching for a driver */}
      {rideStep === 1 && (
        <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 28, alignItems: 'center', gap: 20 }}>
          <ActivityIndicator size="large" color={C.brand} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>{t.findingDriver}</Text>
          <Text style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>{fromLoc} → {toLoc}</Text>
          <Pressable
            onPress={handleCancel}
            style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.full, backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border2 }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{t.cancel}</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: driver matched, waiting for user confirmation */}
      {rideStep === 2 && (
        <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.success }} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.success }}>{t.driverFound.toUpperCase()}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            {/* Driver avatar placeholder */}
            <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: C.teal + '20', borderWidth: 2, borderColor: C.teal + '40', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: C.teal }}>ID</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: C.text }}>Ibrahima Diallo</Text>
              <Text style={{ fontSize: 13, color: C.textSecondary }}>Toyota Corolla Blanc · DK 4521 XA</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="star" size={14} color={C.gold} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.text }}>4.8</Text>
                <Text style={{ fontSize: 12, color: C.textTertiary }}>· 800m · 4 min</Text>
              </View>
            </View>
          </View>
          {/* Route + price summary strip */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.brand + '12', borderRadius: Radius.md, padding: 12, gap: 8 }}>
            <Ionicons name="navigate-outline" size={16} color={C.brand} />
            <Text style={{ flex: 1, fontSize: 13, color: C.text }}>{fromLoc} → {toLoc}</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: C.brand }}>{price.toLocaleString('fr-FR')} XOF</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={handleCancel}
              style={{ flex: 1, height: 48, borderRadius: Radius.md, backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border2, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{t.cancel}</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={{ flex: 2, height: 48, borderRadius: Radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}
            >
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff' }}>{t.confirm}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Step 3: driver en route, animated ETA progress bar */}
      {rideStep === 3 && (
        <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange }} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.orange }}>{t.arriving.toUpperCase()}</Text>
            <Text style={{ flex: 1 }} />
            <Text style={{ fontSize: 24, fontWeight: '900', color: C.text }}>{eta} min</Text>
          </View>
          {/* Progress bar shrinks as ETA counts down */}
          <View style={{ height: 6, backgroundColor: C.surface3, borderRadius: 3, overflow: 'hidden' }}>
            <Animated.View style={{ height: '100%', width: progressWidth, backgroundColor: C.brand, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>Ibrahima est en route · DK 4521 XA</Text>
          <Pressable
            onPress={handleCancel}
            style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.full, backgroundColor: C.error + '15', borderWidth: 1, borderColor: C.error + '30', alignSelf: 'center' }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.error }}>{t.cancel}</Text>
          </Pressable>
        </View>
      )}

      {/* Step 4: driver arrived */}
      {rideStep === 4 && (
        <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 24, alignItems: 'center', gap: 16 }}>
          <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: C.success + '20', borderWidth: 2, borderColor: C.success + '40', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark-circle" size={42} color={C.success} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, textAlign: 'center' }}>Votre chauffeur est arrivé !</Text>
          <Text style={{ fontSize: 14, color: C.textSecondary, textAlign: 'center' }}>Ibrahima Diallo vous attend</Text>
          <Pressable
            onPress={handleFinish}
            style={{ height: 52, borderRadius: Radius.md, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', width: '100%' }}
          >
            <LinearGradient colors={[C.success, C.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Terminer</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

// Official shuttle routes list
function NavettesTab({ C, t }: { C: ReturnType<typeof getColors>; t: ReturnType<typeof useTranslation> }) {
  return (
    <>
      {/* Info banner: free for all accredited people */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.teal + '10', borderWidth: 1, borderColor: C.teal + '25', borderRadius: Radius.lg, padding: 14, gap: 12, marginBottom: 4 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.teal + '20', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="information-circle-outline" size={20} color={C.teal} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{t.officialShuttle}</Text>
          <Text style={{ fontSize: 13, color: C.textSecondary, lineHeight: 18, marginTop: 2 }}>Service gratuit pour tous les accrédités. Fréquence renforcée lors des finales.</Text>
        </View>
      </View>

      {SHUTTLE_ROUTES.map((route) => (
        <ShuttleCard key={route.id} route={route} C={C} />
      ))}
    </>
  );
}

// Single shuttle route card with seat availability and departure times
function ShuttleCard({ route, C }: { route: (typeof SHUTTLE_ROUTES)[0]; C: ReturnType<typeof getColors> }) {
 
  const seats     = route.available > 10 ? 'good' : route.available > 4 ? 'low' : 'critical';
  const seatColor = seats === 'good' ? C.success : seats === 'low' ? C.warning : C.error;

  return (
    <View style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 16, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.brand + '15', borderWidth: 1, borderColor: C.brand + '25', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="bus-outline" size={20} color={C.brand} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.text }}>{route.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <Text style={{ fontSize: 12, color: C.textSecondary }}>{route.from}</Text>
            <Ionicons name="arrow-forward" size={10} color={C.textTertiary} />
            <Text style={{ fontSize: 12, color: C.textSecondary }}>{route.to}</Text>
          </View>
        </View>
        {/* Seats remaining pill */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, backgroundColor: seatColor + '15', borderColor: seatColor + '30' }}>
          <Ionicons name="people-outline" size={11} color={seatColor} />
          <Text style={{ fontSize: 11, fontWeight: '800', color: seatColor }}>{route.available}</Text>
        </View>
      </View>
      {/* Next departure highlight */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.brand + '10', borderRadius: Radius.md, padding: 10 }}>
        <Ionicons name="time-outline" size={14} color={C.brand} />
        <Text style={{ fontSize: 13, color: C.text, fontWeight: '600' }}>Prochain départ: <Text style={{ color: C.brand }}>{route.departures[0]}</Text></Text>
        <Text style={{ flex: 1 }} />
        <Text style={{ fontSize: 11, color: C.textTertiary }}>dans {route.nextIn}</Text>
      </View>
      {/* Tappable departure time buttons */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {route.departures.map((d, i) => (
          <Pressable
            key={i}
            style={{ flex: 1, height: 50, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: i === 0 ? C.brand : C.surface1, borderWidth: 1, borderColor: i === 0 ? C.brand : C.border1, gap: 2 }}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: i === 0 ? '#fff' : C.text }}>{d}</Text>
            {i === 0 && <Text style={{ fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 }}>PROCHAIN</Text>}
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => Alert.alert('Réservation confirmée !', `Navette ${route.name} · ${route.departures[0]}`)}
        style={{ height: 44, borderRadius: Radius.md, backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
      >
        <Ionicons name="checkmark-circle-outline" size={16} color={C.text} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>Réserver</Text>
      </Pressable>
    </View>
  );
}

// Placeholder tab that links to the full map screen
function CarteTab({
  C,
  t,
  router,
}: {
  C: ReturnType<typeof getColors>;
  t: ReturnType<typeof useTranslation>;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <View style={{ gap: 16, alignItems: 'center', paddingTop: 20 }}>
      <View style={{ width: 80, height: 80, borderRadius: 26, backgroundColor: C.teal + '15', borderWidth: 1, borderColor: C.teal + '30', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="map-outline" size={40} color={C.teal} />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '800', color: C.text }}>Carte des sites</Text>
      <Text style={{ fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 20 }}>
        Accédez à la carte interactive des sites officiels des JOJ 2026 à Dakar avec des itinéraires en temps réel.
      </Text>
      <Pressable
        onPress={() => router.push('/map' as any)}
        style={{ height: 56, paddingHorizontal: 28, borderRadius: Radius.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
      >
        <LinearGradient colors={[C.teal, C.tealDark ?? C.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Ionicons name="navigate-outline" size={20} color="#fff" />
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Ouvrir la carte</Text>
      </Pressable>

      {/* Nearby venues list */}
      <View style={{ width: '100%', gap: 10, marginTop: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1, color: C.textTertiary }}>SITES PROCHES</Text>
        {[
          { name: 'Stade Léopold Sédar Senghor', dist: '7.8 km', icon: 'football-outline' as const },
          { name: 'Dakar Arena',                  dist: '4.2 km', icon: 'basketball-outline' as const },
          { name: 'Village JOJ',                  dist: '2.1 km', icon: 'home-outline' as const },
        ].map((v) => (
          <Pressable
            key={v.name}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 14, gap: 12 }}
            onPress={() => router.push('/map' as any)}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.brand + '15', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={v.icon} size={20} color={C.brand} />
            </View>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.text }}>{v.name}</Text>
            <Text style={{ fontSize: 12, color: C.textTertiary, fontWeight: '600' }}>{v.dist}</Text>
            <Ionicons name="chevron-forward" size={16} color={C.textTertiary} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
    headerTitle: { fontSize: 21, fontWeight: '800', letterSpacing: -0.3 },
    tabs: { flexDirection: 'row', gap: 6 },
    scroll: { padding: 16, gap: 12 },
  });
}
