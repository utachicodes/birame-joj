import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GlassCard from '../src/components/GlassCard';
import GlassButton from '../src/components/GlassButton';
import { Colors, Typography, Radius } from '../src/theme';

const CATEGORIES = ['🍔 Plats', '🍕 Snacks', '🥤 Boissons', '🍰 Desserts', '👕 Boutique'];
const ITEMS = [
  { id: '1', name: 'Thiéboudienne', price: 3500, cat: '🍔 Plats', emoji: '🍚', prep: '15 min', popular: true },
  { id: '2', name: 'Yassa Poulet', price: 3000, cat: '🍔 Plats', emoji: '🍗', prep: '12 min', popular: false },
  { id: '3', name: 'Accra', price: 800, cat: '🍕 Snacks', emoji: '🥞', prep: '5 min', popular: true },
  { id: '4', name: 'Bissap Glacé', price: 500, cat: '🥤 Boissons', emoji: '🧃', prep: '2 min', popular: true },
  { id: '5', name: 'Maillot JOJ Officiel', price: 18000, cat: '👕 Boutique', emoji: '👕', prep: 'Stock', popular: false },
  { id: '6', name: 'Gâteau Yakar', price: 1200, cat: '🍰 Desserts', emoji: '🎂', prep: '8 min', popular: false },
];

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [cat, setCat] = useState('🍔 Plats');
  const [cart, setCart] = useState<Record<string, number>>({});

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = ITEMS.find((i) => i.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <LinearGradient colors={['#050A18', '#1A0D00', '#050A18']} style={{ flex: 1 }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
          <Text style={[Typography.title2, { fontWeight: '800', flex: 1 }]}>Commander</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartCount}>{cartCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Delivery option */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <GlassCard style={{ overflow: 'hidden' }} variant="accent">
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
            <Ionicons name="location-outline" size={20} color={Colors.orange} />
            <Text style={[Typography.callout, { fontWeight: '600', flex: 1 }]}>Livraison à votre siège</Text>
            <Text style={[Typography.footnote, { color: Colors.textSecondary }]}>Section A · R.12 · S.34</Text>
          </View>
        </GlassCard>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} onPress={() => setCat(c)} style={[styles.catPill, c === cat && styles.catPillActive]}>
            <Text style={[styles.catText, c === cat && styles.catTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 120, gap: 10 }}>
        {ITEMS.filter((i) => i.cat === cat).map((item) => (
          <GlassCard key={item.id} style={{ overflow: 'hidden' }} variant="subtle">
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
              <View style={styles.itemEmoji}>
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                {item.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>⭐</Text></View>}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[Typography.callout, { fontWeight: '700' }]}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[Typography.headline, { fontWeight: '800', color: Colors.orange }]}>{item.price.toLocaleString('fr-FR')} XOF</Text>
                  <Text style={[Typography.caption, { color: Colors.textTertiary }]}>· {item.prep}</Text>
                </View>
              </View>
              <View style={styles.qtyRow}>
                {cart[item.id] > 0 && (
                  <>
                    <Pressable onPress={() => setCart(c => ({ ...c, [item.id]: Math.max(0, (c[item.id] || 0) - 1) }))} style={styles.qtyBtn}>
                      <Ionicons name="remove" size={16} color={Colors.text} />
                    </Pressable>
                    <Text style={styles.qtyNum}>{cart[item.id]}</Text>
                  </>
                )}
                <Pressable onPress={() => setCart(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }))} style={[styles.qtyBtn, styles.qtyBtnAdd]}>
                  <LinearGradient colors={[Colors.orange, Colors.orangeLight]} style={StyleSheet.absoluteFill} />
                  <Ionicons name="add" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      {cartCount > 0 && (
        <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + 12 }]}>
          <GlassButton
            title={`Commander · ${total.toLocaleString('fr-FR')} XOF`}
            onPress={() => {}}
            fullWidth
            size="lg"
            gradient={[Colors.orange, Colors.orangeLight]}
            icon={<Ionicons name="bag-check-outline" size={18} color="#fff" />}
          />
        </View>
      )}
    </LinearGradient>
  );
}

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cartBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.orange, alignItems: 'center', justifyContent: 'center' },
  cartCount: { fontSize: 13, fontWeight: '800', color: '#fff' },
  catPill: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border1, backgroundColor: Colors.glass1 },
  catPillActive: { backgroundColor: Colors.glass3, borderColor: Colors.border2 },
  catText: { ...Typography.footnote, color: Colors.textTertiary, fontWeight: '600' },
  catTextActive: { color: Colors.text },
  itemEmoji: { width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  popularBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  popularText: { fontSize: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 30, height: 30, borderRadius: 10, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  qtyBtnAdd: { borderWidth: 0 },
  qtyNum: { ...Typography.callout, fontWeight: '800', minWidth: 20, textAlign: 'center' },
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(5,10,24,0.9)' },
});
