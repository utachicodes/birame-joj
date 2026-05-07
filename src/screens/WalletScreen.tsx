import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius } from '../theme';
import { USER, TRANSACTIONS } from '../data/mock';

const { width } = Dimensions.get('window');
const CARD_W = width - 40;

const TOP_UP_METHODS: Array<{
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}> = [
  { id: 'orange', name: 'Orange Money', icon: 'phone-portrait-outline', color: '#FF6B00' },
  { id: 'wave', name: 'Wave', icon: 'water-outline', color: '#1DC7FF' },
  { id: 'card', name: 'Carte bancaire', icon: 'card-outline', color: Colors.blue },
  { id: 'apple', name: 'Apple Pay', icon: 'logo-apple', color: '#fff' },
];

const QUICK_ACTIONS: Array<{
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}> = [
  { id: 'top-up', icon: 'add-outline', label: 'Recharger', color: Colors.gold },
  { id: 'send', icon: 'arrow-up-outline', label: 'Envoyer', color: Colors.teal },
  { id: 'pay', icon: 'qr-code-outline', label: 'Payer', color: Colors.brand },
  { id: 'receive', icon: 'arrow-down-outline', label: 'Recevoir', color: Colors.blue },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [showTopUp, setShowTopUp] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mon Wallet</Text>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="receipt-outline" size={20} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.card}>
          <LinearGradient colors={[Colors.gold, '#A88A2C', Colors.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.cardPattern}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.cardCircle, { width: 100 + i * 50, height: 100 + i * 50, borderRadius: (100 + i * 50) / 2, right: -30 - i * 20, top: -20 - i * 10 }]} />
            ))}
          </View>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardLabel}>JOJ WALLET</Text>
              <Text style={styles.cardName}>{USER.name}</Text>
            </View>
            <Ionicons name="card" size={26} color="rgba(255,255,255,0.6)" />
          </View>
          <View>
            <Text style={styles.cardBalanceLabel}>Solde disponible</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={styles.cardBalance}>{USER.walletBalance.toLocaleString('fr-FR')}</Text>
              <Text style={styles.cardCcy}>XOF</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardNum}>•••• •••• ••••  8421</Text>
            <View style={styles.cardNfc}>
              <Ionicons name="wifi-outline" size={18} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.actions}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.id}
              style={styles.actionItem}
              onPress={() => a.id === 'top-up' && setShowTopUp(true)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: a.color + '18', borderColor: a.color + '30' }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* QR pay */}
        <Pressable style={styles.qrPay}>
          <View style={styles.qrPayIcon}>
            <Ionicons name="qr-code-outline" size={28} color={Colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.qrPayTitle}>Paiement par QR code</Text>
            <Text style={styles.qrPaySub}>Scannez pour payer dans toutes les zones JOJ</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
        </Pressable>

        <Text style={styles.sectionLabel}>MOYENS DE PAIEMENT</Text>
        <View style={styles.methodsList}>
          {TOP_UP_METHODS.map((m) => (
            <Pressable key={m.id} style={styles.methodRow}>
              <View style={[styles.methodIconBox, { backgroundColor: m.color + '20', borderColor: m.color + '30' }]}>
                <Ionicons name={m.icon} size={20} color={m.color === '#fff' ? Colors.text : m.color} />
              </View>
              <Text style={styles.methodName}>{m.name}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        <View style={styles.txHeader}>
          <Text style={styles.sectionLabel}>HISTORIQUE</Text>
          <Pressable>
            <Text style={styles.txAll}>Voir tout</Text>
          </Pressable>
        </View>
        {TRANSACTIONS.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
      </ScrollView>

      <Modal visible={showTopUp} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowTopUp(false)}>
        <TopUpModal onClose={() => setShowTopUp(false)} />
      </Modal>
    </View>
  );
}

function TransactionRow({ tx }: { tx: (typeof TRANSACTIONS)[0] }) {
  const isCredit = tx.type === 'credit';
  return (
    <View style={styles.tx}>
      <View style={[styles.txIcon, { backgroundColor: isCredit ? Colors.success + '15' : Colors.surface3 }]}>
        <Ionicons name={tx.icon} size={18} color={isCredit ? Colors.success : Colors.textSecondary} />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txLabel}>{tx.label}</Text>
        <Text style={styles.txDate}>{tx.date}</Text>
      </View>
      <Text style={[styles.txAmount, isCredit ? styles.txCredit : styles.txDebit]}>
        {isCredit ? '+' : '−'}
        {tx.amount.toLocaleString('fr-FR')}  XOF
      </Text>
    </View>
  );
}

function TopUpModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState(10000);
  const [method, setMethod] = useState('orange');
  const PRESETS = [5000, 10000, 25000, 50000];

  return (
    <View style={styles.modal}>
      <LinearGradient colors={[Colors.bg, Colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.modalHandle} />
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Recharger le Wallet</Text>
        <Pressable onPress={onClose} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.modalScroll}>
        <Text style={styles.sectionLabel}>MONTANT</Text>
        <View style={styles.amountDisplay}>
          <Text style={styles.amountValue}>{amount.toLocaleString('fr-FR')}</Text>
          <Text style={styles.amountCcy}>XOF</Text>
        </View>

        <View style={styles.presetGrid}>
          {PRESETS.map((p) => (
            <Pressable key={p} onPress={() => setAmount(p)} style={[styles.presetBtn, amount === p && styles.presetBtnActive]}>
              <Text style={[styles.presetText, amount === p && styles.presetTextActive]}>
                {p.toLocaleString('fr-FR')}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>MÉTHODE DE PAIEMENT</Text>
        <View style={styles.methodsList}>
          {TOP_UP_METHODS.map((m) => (
            <Pressable key={m.id} onPress={() => setMethod(m.id)} style={[styles.methodRow, method === m.id && styles.methodRowActive]}>
              <View style={[styles.methodIconBox, { backgroundColor: m.color + '20', borderColor: m.color + '30' }]}>
                <Ionicons name={m.icon} size={20} color={m.color === '#fff' ? Colors.text : m.color} />
              </View>
              <Text style={styles.methodName}>{m.name}</Text>
              {method === m.id ? (
                <Ionicons name="checkmark-circle" size={20} color={Colors.brand} />
              ) : (
                <View style={styles.methodCheck} />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.modalFooter}>
        <Pressable style={styles.confirmBtn} onPress={onClose}>
          <LinearGradient colors={[Colors.gold, '#A88A2C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Text style={styles.confirmText}>Recharger {amount.toLocaleString('fr-FR')} XOF</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  iconBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, gap: 14 },

  // Card
  card: { width: CARD_W, height: CARD_W * 0.58, borderRadius: Radius.xl, padding: 22, justifyContent: 'space-between', overflow: 'hidden' },
  cardPattern: { position: 'absolute', right: 0, top: 0 },
  cardCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardBalanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 4 },
  cardBalance: { fontSize: 30, fontWeight: '900', color: '#fff' },
  cardCcy: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardNum: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace', letterSpacing: 1 },
  cardNfc: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },

  // Actions
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  actionItem: { flex: 1, alignItems: 'center', gap: 8 },
  actionIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  actionLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },

  // QR pay
  qrPay: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '30', borderRadius: Radius.lg, padding: 16, gap: 14 },
  qrPayIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.brand + '20', alignItems: 'center', justifyContent: 'center' },
  qrPayTitle: { ...Typography.callout, fontWeight: '700' },
  qrPaySub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  sectionLabel: { ...Typography.label, marginTop: 6, marginBottom: 4 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  txAll: { ...Typography.footnote, color: Colors.brand, fontWeight: '600' },

  methodsList: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, overflow: 'hidden' },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border1 },
  methodRowActive: { backgroundColor: Colors.surface3 },
  methodIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  methodName: { ...Typography.callout, fontWeight: '600', flex: 1 },
  methodCheck: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border2 },

  // Tx
  tx: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.md, padding: 14, gap: 12, marginBottom: 6 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txLabel: { ...Typography.callout, fontWeight: '600' },
  txDate: { ...Typography.caption, color: Colors.textTertiary },
  txAmount: { ...Typography.callout, fontWeight: '700' },
  txCredit: { color: Colors.success },
  txDebit: { color: Colors.text },

  // Modal
  modal: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border2, alignSelf: 'center', marginBottom: 14 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { ...Typography.title2, fontWeight: '800' },
  modalScroll: { paddingBottom: 100, gap: 6 },
  amountDisplay: { alignItems: 'center', paddingVertical: 24, gap: 4, flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline' },
  amountValue: { fontSize: 48, fontWeight: '900', color: Colors.text, letterSpacing: -1 },
  amountCcy: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary, marginLeft: 4 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetBtn: { flex: 1, minWidth: '47%', height: 50, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  presetBtnActive: { backgroundColor: Colors.gold + '20', borderColor: Colors.gold + '50' },
  presetText: { ...Typography.callout, fontWeight: '700' },
  presetTextActive: { color: Colors.gold },
  modalFooter: { paddingVertical: 16 },
  confirmBtn: { height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  confirmText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
