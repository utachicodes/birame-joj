import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Radius } from '../src/theme';

const CATEGORIES: Array<{
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
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

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [cat, setCat] = useState('plats');
  const [cart, setCart] = useState<Record<string, number>>({});

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = ITEMS.find((i) => i.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const filtered = ITEMS.filter((i) => i.cat === cat);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Commander</Text>
        <Pressable style={styles.iconBtn}>
          <Ionicons name="search-outline" size={20} color={Colors.text} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.deliveryWrap}>
        <View style={styles.delivery}>
          <View style={styles.deliveryIcon}>
            <Ionicons name="location" size={18} color={Colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryLabel}>LIVRAISON À VOTRE SIÈGE</Text>
            <Text style={styles.deliverySeat}>Section A · Rangée 12 · Siège 34</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
        {CATEGORIES.map((c) => (
          <Pressable key={c.id} onPress={() => setCat(c.id)} style={[styles.catPill, c.id === cat && styles.catPillActive]}>
            <Ionicons name={c.icon} size={14} color={c.id === cat ? '#fff' : Colors.textTertiary} />
            <Text style={[styles.catText, c.id === cat && styles.catTextActive]}>{c.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.itemList, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemIconWrap}>
                <Ionicons name={item.icon} size={26} color={Colors.brand} />
                {item.popular && (
                  <View style={styles.popularBadge}>
                    <Ionicons name="star" size={10} color={Colors.gold} />
                  </View>
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString('fr-FR')} XOF</Text>
                  <View style={styles.itemPrepBadge}>
                    <Ionicons name="time-outline" size={10} color={Colors.textTertiary} />
                    <Text style={styles.itemPrep}>{item.prep}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.qtyCol}>
                {qty > 0 ? (
                  <View style={styles.qtyRow}>
                    <Pressable onPress={() => setCart((c) => ({ ...c, [item.id]: Math.max(0, qty - 1) }))} style={styles.qtyBtn}>
                      <Ionicons name="remove" size={14} color={Colors.text} />
                    </Pressable>
                    <Text style={styles.qtyNum}>{qty}</Text>
                    <Pressable onPress={() => setCart((c) => ({ ...c, [item.id]: qty + 1 }))} style={styles.qtyBtnAdd}>
                      <Ionicons name="add" size={14} color="#fff" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={() => setCart((c) => ({ ...c, [item.id]: 1 }))} style={styles.addBtn}>
                    <Ionicons name="add" size={16} color={Colors.brand} />
                    <Text style={styles.addBtnText}>Ajouter</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {cartCount > 0 && (
        <View style={[styles.checkout, { paddingBottom: insets.bottom + 14 }]}>
          <Pressable style={styles.checkoutBtn}>
            <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.checkoutBadge}>
              <Text style={styles.checkoutBadgeText}>{cartCount}</Text>
            </View>
            <Text style={styles.checkoutText}>Voir le panier</Text>
            <Text style={styles.checkoutTotal}>{total.toLocaleString('fr-FR')} XOF</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...Typography.title2, fontWeight: '800', flex: 1, marginLeft: 4 },
  cartBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, borderWidth: 1.5, borderColor: Colors.bg },
  cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  deliveryWrap: { paddingHorizontal: 20, paddingTop: 14 },
  delivery: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.brand + '10', borderWidth: 1, borderColor: Colors.brand + '25', borderRadius: Radius.lg, padding: 12, gap: 12 },
  deliveryIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.brand + '20', alignItems: 'center', justifyContent: 'center' },
  deliveryLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: Colors.brand },
  deliverySeat: { ...Typography.callout, fontWeight: '600', marginTop: 2 },

  catList: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.full, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1 },
  catPillActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  catText: { fontSize: 13, color: Colors.textTertiary, fontWeight: '600' },
  catTextActive: { color: '#fff', fontWeight: '700' },

  itemList: { paddingHorizontal: 20, gap: 10 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 14, gap: 12 },
  itemIconWrap: { width: 56, height: 56, borderRadius: 14, backgroundColor: Colors.brand + '12', borderWidth: 1, borderColor: Colors.brand + '25', alignItems: 'center', justifyContent: 'center' },
  popularBadge: { position: 'absolute', top: -3, right: -3, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.gold + '50' },
  itemInfo: { flex: 1, gap: 3 },
  itemName: { ...Typography.callout, fontWeight: '700' },
  itemDesc: { ...Typography.caption, color: Colors.textTertiary },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  itemPrice: { ...Typography.headline, fontWeight: '800', color: Colors.brand },
  itemPrepBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full, backgroundColor: Colors.surface3 },
  itemPrep: { fontSize: 10, color: Colors.textTertiary, fontWeight: '600' },

  qtyCol: { gap: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '30' },
  addBtnText: { fontSize: 12, fontWeight: '700', color: Colors.brand },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: { width: 26, height: 26, borderRadius: 8, backgroundColor: Colors.surface3, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: 14, fontWeight: '800', color: Colors.text, minWidth: 18, textAlign: 'center' },
  qtyBtnAdd: { width: 26, height: 26, borderRadius: 8, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },

  checkout: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.bg + 'F0', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border1 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: Radius.lg, paddingHorizontal: 16, gap: 12, overflow: 'hidden' },
  checkoutBadge: { width: 24, height: 24, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.20)', alignItems: 'center', justifyContent: 'center' },
  checkoutBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  checkoutText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#fff' },
  checkoutTotal: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
