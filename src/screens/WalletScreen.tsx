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
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { Colors, Typography, Radius, Shadows } from '../theme';
import { USER, TRANSACTIONS } from '../data/mock';

const { width } = Dimensions.get('window');
const CARD_W = width - 48;

const TOP_UP_METHODS = [
  { id: 'orange', name: 'Orange Money', icon: '🟠', color: '#FF6B00' },
  { id: 'wave', name: 'Wave', icon: '🌊', color: '#1DC7FF' },
  { id: 'card', name: 'Carte bancaire', icon: '💳', color: Colors.blue },
  { id: 'apple', name: 'Apple Pay', icon: '🍎', color: '#fff' },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('orange');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050A18', '#1A1200', '#050A18']}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.5, 1]}
      />
      <View style={styles.blobGold} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,10,24,0.5)' }]} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mon Wallet</Text>
          <Pressable style={styles.historyBtn}>
            <Ionicons name="document-text-outline" size={20} color={Colors.text} />
          </Pressable>
        </View>
        <View style={styles.headerBorder} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance card */}
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={['#C9A84C', '#8B6914', '#C9A84C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            {/* Card pattern overlay */}
            <View style={styles.cardPattern}>
              {[...Array(6)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.cardCircle,
                    {
                      width: 80 + i * 40,
                      height: 80 + i * 40,
                      borderRadius: (80 + i * 40) / 2,
                      borderColor: 'rgba(255,255,255,0.08)',
                      right: -20 - i * 20,
                      top: -20 - i * 10,
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardLabel}>JOJ WALLET</Text>
                <Text style={styles.cardName}>{USER.name}</Text>
              </View>
              <Text style={styles.cardChip}>◉</Text>
            </View>

            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.balanceLabel}>Solde disponible</Text>
                <Text style={styles.balance}>
                  {USER.walletBalance.toLocaleString('fr-FR')}
                  <Text style={styles.balanceCurrency}> XOF</Text>
                </Text>
              </View>
              <View style={styles.cardNfc}>
                <Ionicons name="wifi-outline" size={22} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: '90deg' }] }} />
              </View>
            </View>
          </LinearGradient>

          {/* Card glow */}
          <View style={styles.cardGlow} />
        </View>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          {[
            { icon: 'add-circle-outline', label: 'Recharger', action: () => setShowTopUp(true), color: Colors.gold },
            { icon: 'send-outline', label: 'Envoyer', action: () => {}, color: Colors.teal },
            { icon: 'qr-code-outline', label: 'Payer', action: () => {}, color: Colors.orange },
            { icon: 'download-outline', label: 'Retrait', action: () => {}, color: Colors.blue },
          ].map((a) => (
            <Pressable key={a.label} style={styles.actionItem} onPress={a.action}>
              <LinearGradient
                colors={[a.color + '30', a.color + '10']}
                style={styles.actionIcon}
              >
                <Ionicons name={a.icon as any} size={24} color={a.color} />
              </LinearGradient>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* QR Pay */}
        <GlassCard style={styles.qrPayCard} variant="strong" onPress={() => {}}>
          <LinearGradient
            colors={['rgba(255,107,53,0.2)', 'rgba(255,107,53,0.05)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.qrPayContent}>
            <Ionicons name="qr-code-outline" size={36} color={Colors.orange} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.qrPayTitle}>Paiement QR</Text>
              <Text style={styles.qrPaySub}>Scannez pour payer dans toutes les zones JOJ</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
          </View>
        </GlassCard>

        {/* Top-up methods */}
        <Text style={styles.sectionLabel}>MOYENS DE PAIEMENT</Text>
        <View style={styles.methodsGrid}>
          {TOP_UP_METHODS.map((m) => (
            <Pressable
              key={m.id}
              style={[styles.methodCard, selectedMethod === m.id && styles.methodCardActive]}
              onPress={() => setSelectedMethod(m.id)}
            >
              
              <View style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: selectedMethod === m.id ? m.color + '20' : Colors.glass1,
                  borderRadius: Radius.md,
                  borderWidth: 1,
                  borderColor: selectedMethod === m.id ? m.color + '50' : Colors.border1,
                }
              ]} />
              <Text style={styles.methodIcon}>{m.icon}</Text>
              <Text style={styles.methodName}>{m.name}</Text>
            </Pressable>
          ))}
        </View>

        {/* Transactions */}
        <Text style={styles.sectionLabel}>HISTORIQUE</Text>
        {TRANSACTIONS.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </ScrollView>

      {/* Top up modal */}
      <Modal
        visible={showTopUp}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTopUp(false)}
      >
        <TopUpModal onClose={() => setShowTopUp(false)} />
      </Modal>
    </View>
  );
}

function TransactionRow({ tx }: { tx: (typeof TRANSACTIONS)[0] }) {
  const isCredit = tx.type === 'credit';
  return (
    <GlassCard style={styles.txCard} variant="subtle">
      <View style={styles.txContent}>
        <View style={styles.txIconWrap}>
          <Text style={styles.txEmoji}>{tx.icon}</Text>
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txLabel}>{tx.label}</Text>
          <Text style={styles.txDate}>{tx.date}</Text>
        </View>
        <Text style={[styles.txAmount, isCredit ? styles.txCredit : styles.txDebit]}>
          {isCredit ? '+' : '-'}
          {tx.amount.toLocaleString('fr-FR')} XOF
        </Text>
      </View>
    </GlassCard>
  );
}

function TopUpModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('10000');
  const PRESETS = ['5 000', '10 000', '25 000', '50 000'];

  return (
    <LinearGradient colors={['#050A18', '#0D0B2E']} style={styles.modal}>
      <View style={styles.modalHandle} />
      <View style={styles.modalHeaderRow}>
        <Text style={styles.modalTitle}>Recharger le Wallet</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={Colors.text} />
        </Pressable>
      </View>

      {/* Amount presets */}
      <Text style={styles.modalLabel}>MONTANT</Text>
      <View style={styles.presetGrid}>
        {PRESETS.map((p) => (
          <Pressable
            key={p}
            style={[styles.presetBtn, amount === p.replace(' ', '') && styles.presetBtnActive]}
            onPress={() => setAmount(p.replace(' ', ''))}
          >
            
            <View style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: Radius.md,
                borderWidth: 1,
                backgroundColor: amount === p.replace(' ', '') ? Colors.gold + '25' : Colors.glass1,
                borderColor: amount === p.replace(' ', '') ? Colors.gold + '50' : Colors.border1,
              }
            ]} />
            <Text style={[styles.presetText, amount === p.replace(' ', '') && { color: Colors.gold }]}>
              {p} XOF
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Method selection */}
      <Text style={styles.modalLabel}>MÉTHODE</Text>
      {TOP_UP_METHODS.map((m) => (
        <Pressable key={m.id} style={styles.methodRow}>
          
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.glass1, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border1 }]} />
          <Text style={styles.methodRowIcon}>{m.icon}</Text>
          <Text style={styles.methodRowName}>{m.name}</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
        </Pressable>
      ))}

      <View style={styles.modalFooter}>
        <GlassButton
          title={`Recharger ${Number(amount).toLocaleString('fr-FR')} XOF`}
          onPress={onClose}
          fullWidth
          size="lg"
          gradient={[Colors.gold, Colors.goldLight]}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  blobGold: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Colors.gold + '08',
    top: 80,
    right: -100,
  },
  header: { overflow: 'hidden' },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  headerTitle: { ...Typography.title2, fontWeight: '800' },
  historyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  headerBorder: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
  scroll: { padding: 20, gap: 12 },
  cardWrap: { alignItems: 'center', marginVertical: 8 },
  balanceCard: {
    width: CARD_W,
    height: CARD_W * 0.6,
    borderRadius: Radius.xl,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardPattern: { position: 'absolute', right: 0, top: 0 },
  cardCircle: { position: 'absolute', borderWidth: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  cardName: { ...Typography.callout, fontWeight: '700', color: '#fff' },
  cardChip: { fontSize: 28, color: 'rgba(255,255,255,0.4)' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  balanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4, letterSpacing: 0.5 },
  balance: { fontSize: 32, fontWeight: '900', color: '#fff' },
  balanceCurrency: { fontSize: 16, fontWeight: '500' },
  cardNfc: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10 },
  cardGlow: {
    position: 'absolute',
    bottom: -16,
    left: '10%',
    right: '10%',
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gold,
    opacity: 0.25,
    ...Shadows.glow(Colors.gold),
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionItem: { flex: 1, alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border1 },
  actionLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  qrPayCard: { overflow: 'hidden' },
  qrPayContent: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  qrPayTitle: { ...Typography.callout, fontWeight: '700' },
  qrPaySub: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 16 },
  sectionLabel: { ...Typography.label, color: Colors.textTertiary, marginTop: 4 },
  methodsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  methodCard: {
    width: (width - 40 - 10) / 2,
    height: 72,
    borderRadius: Radius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  methodCardActive: {},
  methodIcon: { fontSize: 22 },
  methodName: { ...Typography.callout, fontWeight: '600', flex: 1 },
  txCard: { marginBottom: 6 },
  txContent: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  txIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.glass2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  txEmoji: { fontSize: 20 },
  txInfo: { flex: 1, gap: 3 },
  txLabel: { ...Typography.callout, fontWeight: '600' },
  txDate: { ...Typography.caption, color: Colors.textTertiary },
  txAmount: { ...Typography.callout, fontWeight: '700' },
  txCredit: { color: Colors.success },
  txDebit: { color: Colors.text },
  // Modal
  modal: { flex: 1, padding: 24, gap: 16 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border2, alignSelf: 'center', marginBottom: 8 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { ...Typography.title2, fontWeight: '800' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glass2, alignItems: 'center', justifyContent: 'center' },
  modalLabel: { ...Typography.label, color: Colors.textTertiary },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  presetBtn: {
    width: (width - 48 - 10) / 2,
    height: 52,
    borderRadius: Radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetBtnActive: {},
  presetText: { ...Typography.callout, fontWeight: '700', color: Colors.text },
  methodRow: { height: 56, borderRadius: Radius.md, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  methodRowIcon: { fontSize: 22 },
  methodRowName: { ...Typography.callout, fontWeight: '600', flex: 1 },
  modalFooter: { position: 'absolute', bottom: 40, left: 24, right: 24 },
});
