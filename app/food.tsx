import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { useTranslation } from '../src/i18n';
import { getColors, Radius } from '../src/theme';

const CATEGORIES: Array<{
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { id: 'all', label: 'Tous', icon: 'apps-outline' },
  { id: 'plats', label: 'Plats', icon: 'restaurant-outline' },
  { id: 'snacks', label: 'Snacks', icon: 'fast-food-outline' },
  { id: 'boissons', label: 'Boissons', icon: 'cafe-outline' },
  { id: 'desserts', label: 'Desserts', icon: 'ice-cream-outline' },
  { id: 'boutique', label: 'Boutique', icon: 'shirt-outline' },
];

const ITEMS: Array<{
  id: string;
  name: string;
  price: number;
  cat: string;
  icon: keyof typeof Ionicons.glyphMap;
  prep: string;
  popular: boolean;
  desc: string;
}> = [
  { id: '1', name: 'Thiéboudienne', price: 3500, cat: 'plats', icon: 'restaurant-outline', prep: '15 min', popular: true, desc: 'Riz au poisson sénégalais' },
  { id: '2', name: 'Yassa Poulet', price: 3000, cat: 'plats', icon: 'restaurant-outline', prep: '12 min', popular: false, desc: 'Poulet aux oignons et citron' },
  { id: '3', name: 'Mafé', price: 2800, cat: 'plats', icon: 'restaurant-outline', prep: '10 min', popular: false, desc: 'Sauce arachide et viande' },
  { id: '4', name: 'Accra', price: 800, cat: 'snacks', icon: 'fast-food-outline', prep: '5 min', popular: true, desc: 'Beignets de haricot blanc' },
  { id: '5', name: 'Pastels', price: 1200, cat: 'snacks', icon: 'fast-food-outline', prep: '6 min', popular: false, desc: 'Empanadas au poisson' },
  { id: '6', name: 'Bissap Glacé', price: 500, cat: 'boissons', icon: 'cafe-outline', prep: '2 min', popular: true, desc: 'Hibiscus rafraîchissant' },
  { id: '7', name: 'Bouye', price: 600, cat: 'boissons', icon: 'cafe-outline', prep: '2 min', popular: false, desc: 'Jus de baobab traditionnel' },
  { id: '8', name: 'Gâteau Yakar', price: 1200, cat: 'desserts', icon: 'ice-cream-outline', prep: '8 min', popular: false, desc: 'Pâtisserie locale' },
  { id: '9', name: 'Maillot Officiel JOJ', price: 18000, cat: 'boutique', icon: 'shirt-outline', prep: 'En stock', popular: false, desc: 'Édition limitée Dakar 2026' },
  { id: '10', name: 'Casquette JOJ', price: 7500, cat: 'boutique', icon: 'shirt-outline', prep: 'En stock', popular: true, desc: 'Brodée logo officiel' },
];

type CheckoutStep = 'method' | 'phone' | 'otp' | 'processing' | 'success';

const PAYMENT_METHODS = [
  { id: 'orange', name: 'Orange Money', icon: 'phone-portrait-outline' as const, color: '#FF6B00' },
  { id: 'wave', name: 'Wave', icon: 'water-outline' as const, color: '#1DC7FF' },
];

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, dispatch, debit } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);

  const [cat, setCat] = useState('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('method');
  const [payMethod, setPayMethod] = useState('orange');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = ITEMS.find((i) => i.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const filtered = ITEMS.filter((i) => {
    const matchCat = cat === 'all' || i.cat === cat;
    const matchSearch = search.trim() === '' || i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => {
    if (checkoutStep === 'otp') {
      setCountdown(30);
      const timer = setTimeout(() => setOtp('123456'), 3000);
      const interval = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
      return () => { clearTimeout(timer); clearInterval(interval); };
    }
  }, [checkoutStep]);

  const handleCheckoutPay = () => {
    if (!phone.trim()) { Alert.alert('Erreur', 'Veuillez entrer votre numéro.'); return; }
    setCheckoutStep('otp');
  };

  const handleOtpVerify = () => {
    if (otp.length < 4) { Alert.alert('Erreur', 'Code OTP invalide.'); return; }
    setCheckoutStep('processing');
    setTimeout(() => setCheckoutStep('success'), 2000);
  };

  const handleOrderComplete = () => {
    const orderNum = Math.floor(Math.random() * 9000) + 1000;
    debit(total, `Commande JOJ #${orderNum}`, 'restaurant-outline');
    setCart({});
    setShowCheckout(false);
    setCheckoutStep('method');
    setPhone('');
    setOtp('');
    Alert.alert(t.orderPlaced, `Commande #JOJ-${orderNum} confirmée !`);
  };

  const resetCheckout = () => {
    setShowCheckout(false);
    setCheckoutStep('method');
    setPhone('');
    setOtp('');
  };

  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1 }]}>
        <Pressable onPress={() => router.back()} style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
          <Ionicons name="chevron-back" size={20} color={C.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: C.text }]}>Commander</Text>
        <View style={[s.iconBtn, { backgroundColor: 'transparent', borderColor: 'transparent' }]}>
          {cartCount > 0 && (
            <View style={[s.cartBadge, { backgroundColor: C.brand, borderColor: C.bg }]}>
              <Text style={s.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <View style={[s.searchBar, { backgroundColor: C.surface2, borderColor: C.border2 }]}>
          <Ionicons name="search-outline" size={16} color={C.textTertiary} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: C.text }}
            placeholder="Rechercher un plat..."
            placeholderTextColor={C.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-outline" size={16} color={C.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={s.deliveryWrap}>
        <View style={[s.delivery, { backgroundColor: C.brand + '10', borderColor: C.brand + '25' }]}>
          <View style={[s.deliveryIcon, { backgroundColor: C.brand + '20' }]}>
            <Ionicons name="location" size={18} color={C.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.deliveryLabel, { color: C.brand }]}>LIVRAISON À VOTRE SIÈGE</Text>
            <Text style={[s.deliverySeat, { color: C.text }]}>Section A · Rangée 12 · Siège 34</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={C.textTertiary} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catList}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCat(c.id)}
            style={[s.catPill, { backgroundColor: C.surface2, borderColor: C.border1 }, c.id === cat && { backgroundColor: C.brand, borderColor: C.brand }]}
          >
            <Ionicons name={c.icon} size={14} color={c.id === cat ? '#fff' : C.textTertiary} />
            <Text style={[s.catText, { color: C.textTertiary }, c.id === cat && { color: '#fff' }]}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[s.itemList, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
            <Ionicons name="search-outline" size={40} color={C.textTertiary} />
            <Text style={{ fontSize: 15, color: C.textTertiary, fontWeight: '600' }}>Aucun résultat</Text>
          </View>
        )}
        {filtered.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <View key={item.id} style={[s.item, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <View style={[s.itemIconWrap, { backgroundColor: C.brand + '12', borderColor: C.brand + '25' }]}>
                <Ionicons name={item.icon} size={26} color={C.brand} />
                {item.popular && (
                  <View style={[s.popularBadge, { backgroundColor: C.bg, borderColor: C.gold + '50' }]}>
                    <Ionicons name="star" size={10} color={C.gold} />
                  </View>
                )}
              </View>
              <View style={s.itemInfo}>
                <Text style={[s.itemName, { color: C.text }]}>{item.name}</Text>
                <Text style={[s.itemDesc, { color: C.textTertiary }]}>{item.desc}</Text>
                <View style={s.itemMeta}>
                  <Text style={[s.itemPrice, { color: C.brand }]}>{item.price.toLocaleString('fr-FR')} XOF</Text>
                  <View style={[s.itemPrepBadge, { backgroundColor: C.surface3 }]}>
                    <Ionicons name="time-outline" size={10} color={C.textTertiary} />
                    <Text style={[s.itemPrep, { color: C.textTertiary }]}>{item.prep}</Text>
                  </View>
                </View>
              </View>
              <View style={s.qtyCol}>
                {qty > 0 ? (
                  <View style={s.qtyRow}>
                    <Pressable
                      onPress={() => setCart((c) => { const n = { ...c }; if (qty <= 1) delete n[item.id]; else n[item.id] = qty - 1; return n; })}
                      style={[s.qtyBtn, { backgroundColor: C.surface3, borderColor: C.border1 }]}
                    >
                      <Ionicons name="remove" size={14} color={C.text} />
                    </Pressable>
                    <Text style={[s.qtyNum, { color: C.text }]}>{qty}</Text>
                    <Pressable
                      onPress={() => setCart((c) => ({ ...c, [item.id]: qty + 1 }))}
                      style={[s.qtyBtnAdd, { backgroundColor: C.brand }]}
                    >
                      <Ionicons name="add" size={14} color="#fff" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setCart((c) => ({ ...c, [item.id]: 1 }))}
                    style={[s.addBtn, { backgroundColor: C.brand + '15', borderColor: C.brand + '30' }]}
                  >
                    <Ionicons name="add" size={16} color={C.brand} />
                    <Text style={[s.addBtnText, { color: C.brand }]}>{t.addToCart}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {cartCount > 0 && (
        <View style={[s.checkout, { paddingBottom: insets.bottom + 14, backgroundColor: C.bg + 'F0', borderTopColor: C.border1 }]}>
          <Pressable style={s.checkoutBtn} onPress={() => setShowCheckout(true)}>
            <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={s.checkoutBadge}>
              <Text style={s.checkoutBadgeText}>{cartCount}</Text>
            </View>
            <Text style={s.checkoutText}>{t.checkout}</Text>
            <Text style={s.checkoutTotal}>{total.toLocaleString('fr-FR')} XOF</Text>
          </Pressable>
        </View>
      )}

      {/* Checkout Modal */}
      <Modal visible={showCheckout} animationType="slide" presentationStyle="pageSheet" onRequestClose={resetCheckout}>
        <View style={[s.modal, { backgroundColor: C.bg }]}>
          <LinearGradient colors={[C.bg, C.bgDeep]} style={StyleSheet.absoluteFill} />
          <View style={[s.modalHandle, { backgroundColor: C.border2 }]} />
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: C.text }]}>{t.checkout}</Text>
            <Pressable onPress={resetCheckout} style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="close-outline" size={20} color={C.text} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, gap: 16 }}>
            {checkoutStep === 'method' && (
              <>
                <View style={[{ backgroundColor: C.brand + '10', borderWidth: 1, borderColor: C.brand + '25', borderRadius: Radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                  <Ionicons name="cart-outline" size={22} color={C.brand} />
                  <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: C.text }}>{t.total}</Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: C.brand }}>{total.toLocaleString('fr-FR')} XOF</Text>
                </View>

                <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1, color: C.textTertiary }}>MÉTHODE DE PAIEMENT</Text>
                {PAYMENT_METHODS.map((m) => (
                  <Pressable
                    key={m.id}
                    onPress={() => setPayMethod(m.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: Radius.lg, backgroundColor: payMethod === m.id ? C.brand + '12' : C.surface2, borderWidth: 1.5, borderColor: payMethod === m.id ? C.brand + '60' : C.border1, gap: 12 }}
                  >
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: m.color + '20', borderWidth: 1, borderColor: m.color + '30', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={m.icon} size={22} color={m.color} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.text }}>{m.name}</Text>
                    {payMethod === m.id ? (
                      <Ionicons name="checkmark-circle" size={22} color={C.brand} />
                    ) : (
                      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: C.border2 }} />
                    )}
                  </Pressable>
                ))}

                <Pressable onPress={() => setCheckoutStep('phone')} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Continuer</Text>
                </Pressable>
              </>
            )}

            {checkoutStep === 'phone' && (
              <>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6 }}>Numéro de téléphone</Text>
                <TextInput
                  placeholder="+221 77 000 0000"
                  placeholderTextColor={C.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, borderRadius: Radius.md, paddingHorizontal: 16, height: 52, fontSize: 15, color: C.text, marginBottom: 20 }}
                />
                <Pressable onPress={handleCheckoutPay} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Envoyer le code OTP</Text>
                </Pressable>
              </>
            )}

            {checkoutStep === 'otp' && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 16, gap: 8 }}>
                  <Ionicons name="phone-portrait-outline" size={36} color={C.brand} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, textAlign: 'center' }}>Code envoyé au {phone}</Text>
                  {countdown > 0 && <Text style={{ fontSize: 12, color: C.textTertiary }}>Renvoi dans {countdown}s</Text>}
                </View>
                <TextInput
                  placeholder="123456"
                  placeholderTextColor={C.textTertiary}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, borderRadius: Radius.md, paddingHorizontal: 16, height: 52, fontSize: 22, color: C.text, textAlign: 'center', letterSpacing: 8, marginBottom: 20, fontWeight: '800' }}
                />
                <Pressable onPress={handleOtpVerify} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Confirmer</Text>
                </Pressable>
              </>
            )}

            {checkoutStep === 'processing' && (
              <View style={{ alignItems: 'center', paddingVertical: 60, gap: 20 }}>
                <ActivityIndicator size="large" color={C.brand} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>Traitement en cours...</Text>
              </View>
            )}

            {checkoutStep === 'success' && (
              <View style={{ alignItems: 'center', paddingVertical: 40, gap: 16 }}>
                <View style={{ width: 80, height: 80, borderRadius: 28, backgroundColor: C.success + '20', borderWidth: 2, borderColor: C.success + '40', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="checkmark-circle" size={48} color={C.success} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '900', color: C.text }}>{t.orderPlaced}</Text>
                <Text style={{ fontSize: 32, fontWeight: '900', color: C.brand, letterSpacing: -0.5 }}>{total.toLocaleString('fr-FR')} XOF</Text>
                <Text style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>Votre commande sera livrée à votre siège dans ~20 minutes</Text>
                <Pressable onPress={handleOrderComplete} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', marginTop: 8 }}>
                  <LinearGradient colors={[C.success, C.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Terminer</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth },
    iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    headerTitle: { fontSize: 21, fontWeight: '800', flex: 1, marginLeft: 4 },
    cartBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, borderWidth: 1.5 },
    cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

    searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
    searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: Radius.lg, paddingHorizontal: 12, height: 42, gap: 8 },

    deliveryWrap: { paddingHorizontal: 20, paddingTop: 12 },
    delivery: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: Radius.lg, padding: 12, gap: 12 },
    deliveryIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    deliveryLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
    deliverySeat: { fontSize: 15, fontWeight: '600', marginTop: 2 },

    catList: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
    catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.full, borderWidth: 1 },
    catText: { fontSize: 13, fontWeight: '600' },

    itemList: { paddingHorizontal: 20, gap: 10 },
    item: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: Radius.lg, padding: 14, gap: 12 },
    itemIconWrap: { width: 56, height: 56, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    popularBadge: { position: 'absolute', top: -3, right: -3, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    itemInfo: { flex: 1, gap: 3 },
    itemName: { fontSize: 15, fontWeight: '700' },
    itemDesc: { fontSize: 12 },
    itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    itemPrice: { fontSize: 16, fontWeight: '800' },
    itemPrepBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
    itemPrep: { fontSize: 10, fontWeight: '600' },

    qtyCol: { gap: 6 },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
    addBtnText: { fontSize: 12, fontWeight: '700' },
    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    qtyBtn: { width: 26, height: 26, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    qtyNum: { fontSize: 14, fontWeight: '800', minWidth: 18, textAlign: 'center' },
    qtyBtnAdd: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

    checkout: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
    checkoutBtn: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: Radius.lg, paddingHorizontal: 16, gap: 12, overflow: 'hidden' },
    checkoutBadge: { width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.20)', alignItems: 'center', justifyContent: 'center' },
    checkoutBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },
    checkoutText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#fff' },
    checkoutTotal: { fontSize: 15, fontWeight: '800', color: '#fff' },

    modal: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 21, fontWeight: '800' },
  });
}
