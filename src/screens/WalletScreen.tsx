import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius } from '../theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window'); // screen width for card sizing
const CARD_W = width - 40; // card is full width minus side padding

const TOP_UP_METHODS: Array<{
  id: string; name: string; icon: keyof typeof Ionicons.glyphMap; color: string;
}> = [ // all supported recharge methods
  { id: 'orange',   name: 'Orange Money',    icon: 'phone-portrait-outline', color: '#FF6B00' },
  { id: 'wave',     name: 'Wave',            icon: 'water-outline',          color: '#1DC7FF' },
  { id: 'card',     name: 'Carte bancaire',  icon: 'card-outline',           color: Colors.blue },
  { id: 'apple',    name: 'Apple Pay',       icon: 'logo-apple',             color: '#fff'     },
  { id: 'transfer', name: 'Virement bancaire',icon: 'swap-horizontal-outline',color: Colors.teal },
];

const QUICK_ACTIONS: Array<{
  id: string; icon: keyof typeof Ionicons.glyphMap; label: string; color: string;
}> = [ // shortcut buttons below the card
  { id: 'top-up',  icon: 'add-outline',       label: 'Recharger', color: Colors.gold  },
  { id: 'send',    icon: 'arrow-up-outline',   label: 'Envoyer',   color: Colors.teal  },
  { id: 'pay',     icon: 'qr-code-outline',    label: 'Payer',     color: Colors.brand },
  { id: 'receive', icon: 'arrow-down-outline', label: 'Recevoir',  color: Colors.blue  },
];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { state, topUp } = useApp(); // topUp triggers context action
  const [showTopUp, setShowTopUp]       = useState(false); // top-up modal toggle
  const [showCardInfo, setShowCardInfo] = useState(false); // card info modal toggle

  const user = state.user;
  const cardLastFour = user?.accreditation.slice(-4) ?? '0000'; // last 4 chars of accreditation ID

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={[Colors.bg, Colors.bgElevated, Colors.bg]} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Mon Wallet</Text>
          <Pressable style={styles.iconBtn}> {/* history / receipts button */}
            <Ionicons name="receipt-outline" size={20} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>

        {/* Physical-style card */}
        <View style={styles.card}>
          <LinearGradient colors={[Colors.gold, '#A88A2C', Colors.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /> {/* gold gradient */}
          <View style={styles.cardPattern}> {/* decorative circles overlay */}
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.cardCircle, { width: 100 + i * 50, height: 100 + i * 50, borderRadius: (100 + i * 50) / 2, right: -30 - i * 20, top: -20 - i * 10 }]} /> // concentric rings
            ))}
          </View>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardLabel}>JOJ WALLET</Text>
              <Text style={styles.cardName}>{user?.name ?? ''}</Text> {/* cardholder name */}
            </View>
            <Ionicons name="card" size={26} color="rgba(255,255,255,0.6)" />
          </View>
          <View>
            <Text style={styles.cardBalanceLabel}>Solde disponible</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={styles.cardBalance}>{state.walletBalance.toLocaleString('fr-FR')}</Text> {/* French number format */}
              <Text style={styles.cardCcy}>XOF</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardNum}>•••• •••• ••••  {cardLastFour}</Text> {/* masked card number */}
            <View style={styles.cardNfc}>
              <Ionicons name="wifi-outline" size={18} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} /> {/* rotated wifi = NFC icon */}
            </View>
          </View>
        </View>

        {/* Points strip */}
        <Pressable style={styles.pointsStrip} onPress={() => setShowCardInfo(true)}> {/* tap to learn more */}
          <Ionicons name="star" size={18} color={Colors.gold} />
          <Text style={styles.pointsText}>
            <Text style={{ color: Colors.gold, fontWeight: '800' }}>{state.jojPoints.toLocaleString('fr-FR')} JOJ Points</Text>
            {'  ·  '}100 XOF dépensés = 1 pt {/* points conversion rate */}
          </Text>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textTertiary} />
        </Pressable>

        {/* Quick actions */}
        <View style={styles.actions}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable key={a.id} style={styles.actionItem} onPress={() => a.id === 'top-up' && setShowTopUp(true)}> {/* only top-up is wired up */}
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
            <Text style={styles.qrPayTitle}>Paiement sans contact</Text>
            <Text style={styles.qrPaySub}>QR code ou NFC dans toutes les zones JOJ</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
        </Pressable>

        {/* How card works info banner */}
        <Pressable style={styles.infoBanner} onPress={() => setShowCardInfo(true)}>
          <LinearGradient colors={[Colors.brand + '25', Colors.teal + '15']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} /> {/* horizontal gradient */}
          <Ionicons name="card-outline" size={24} color={Colors.brand} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoBannerTitle}>Comment fonctionne la JOJ Card ?</Text>
            <Text style={styles.infoBannerSub}>Paiements cashless · Points fidélité · Recharge partout</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.brand} />
        </Pressable>

        {/* Payment methods */}
        <Text style={styles.sectionLabel}>MOYENS DE RECHARGE</Text>
        <View style={styles.methodsList}>
          {TOP_UP_METHODS.map((m, i) => (
            <View key={m.id}>
              <Pressable style={styles.methodRow} onPress={() => setShowTopUp(true)}>
                <View style={[styles.methodIconBox, { backgroundColor: m.color + '20', borderColor: m.color + '30' }]}>
                  <Ionicons name={m.icon} size={20} color={m.color === '#fff' ? Colors.text : m.color} /> {/* Apple Pay icon is white so use text color */}
                </View>
                <Text style={styles.methodName}>{m.name}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
              </Pressable>
              {i < TOP_UP_METHODS.length - 1 && <View style={styles.methodDivider} />} {/* no divider after last item */}
            </View>
          ))}
        </View>

        {/* Transaction history */}
        <View style={styles.txHeader}>
          <Text style={styles.sectionLabel}>HISTORIQUE</Text>
        </View>
        {state.transactions.length === 0 ? ( // empty state
          <View style={styles.emptyTx}>
            <Ionicons name="receipt-outline" size={32} color={Colors.textTertiary} />
            <Text style={styles.emptyTxText}>Aucune transaction</Text>
          </View>
        ) : (
          state.transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
        )}
      </ScrollView>

      {/* Top-up modal */}
      <Modal visible={showTopUp} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowTopUp(false)}>
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onConfirm={async (amount, method) => {
            await topUp(amount, method); // call context action
            setShowTopUp(false);
          }}
        />
      </Modal>

      {/* Card info modal */}
      <Modal visible={showCardInfo} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCardInfo(false)}>
        <CardInfoModal onClose={() => setShowCardInfo(false)} />
      </Modal>
    </View>
  );
}

function TransactionRow({ tx }: { tx: { id: string; type: 'credit' | 'debit'; label: string; amount: number; date: string; icon: string } }) {
  const isCredit = tx.type === 'credit'; // true = money in
  return (
    <View style={styles.tx}>
      <View style={[styles.txIcon, { backgroundColor: isCredit ? Colors.success + '15' : Colors.surface3 }]}> {/* green bg for credits */}
        <Ionicons name={tx.icon as any} size={18} color={isCredit ? Colors.success : Colors.textSecondary} />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txLabel}>{tx.label}</Text>
        <Text style={styles.txDate}>{tx.date}</Text>
      </View>
      <Text style={[styles.txAmount, isCredit ? styles.txCredit : styles.txDebit]}>
        {isCredit ? '+' : '−'}{tx.amount.toLocaleString('fr-FR')}  XOF {/* sign prefix based on direction */}
      </Text>
    </View>
  );
}

function TopUpModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (amount: number, method: string) => Promise<void> }) {
  const [amount, setAmount] = useState(10000); // default preset amount
  const [method, setMethod] = useState('orange'); // default payment method
  const [loading, setLoading] = useState(false);
  const PRESETS = [5000, 10000, 25000, 50000]; // quick-select amounts

  const methodLabel = TOP_UP_METHODS.find((m) => m.id === method)?.name ?? ''; // human-readable method name

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(amount, methodLabel); // pass amount and label to parent
    setLoading(false);
  };

  return (
    <View style={styles.modal}>
      <LinearGradient colors={[Colors.bg, Colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.modalHandle} /> {/* drag handle at top */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Recharger le Wallet</Text>
        <Pressable onPress={onClose} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.modalScroll}>
        <Text style={styles.sectionLabel}>MONTANT</Text>
        <View style={styles.amountDisplay}>
          <Text style={styles.amountValue}>{amount.toLocaleString('fr-FR')}</Text> {/* big amount display */}
          <Text style={styles.amountCcy}>XOF</Text>
        </View>

        <View style={styles.presetGrid}> {/* 2x2 grid of preset amounts */}
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
          {TOP_UP_METHODS.map((m, i) => (
            <View key={m.id}>
              <Pressable onPress={() => setMethod(m.id)} style={[styles.methodRow, method === m.id && styles.methodRowActive]}>
                <View style={[styles.methodIconBox, { backgroundColor: m.color + '20', borderColor: m.color + '30' }]}>
                  <Ionicons name={m.icon} size={20} color={m.color === '#fff' ? Colors.text : m.color} />
                </View>
                <Text style={styles.methodName}>{m.name}</Text>
                {method === m.id
                  ? <Ionicons name="checkmark-circle" size={20} color={Colors.brand} /> // selected
                  : <View style={styles.methodCheck} /> // empty radio circle
                }
              </Pressable>
              {i < TOP_UP_METHODS.length - 1 && <View style={styles.methodDivider} />}
            </View>
          ))}
        </View>

        {method === 'transfer' && ( // show bank details only for wire transfer
          <View style={styles.transferInfo}>
            <Text style={styles.transferTitle}>Virement bancaire</Text>
            <Text style={styles.transferLine}>Banque : BIS — Banque de l'Infrastructure du Sport</Text>
            <Text style={styles.transferLine}>IBAN : SN86 0010 6200 0012 3456 7890 189</Text>
            <Text style={styles.transferLine}>BIC : BISNSNDA</Text>
            <Text style={styles.transferLine}>Référence : {`JOJ-${Date.now().toString().slice(-6)}`}</Text> {/* unique ref per session */}
            <Text style={styles.transferNote}>Le solde est crédité sous 30 min après réception du virement.</Text>
          </View>
        )}
      </ScrollView>

      {method !== 'transfer' && ( // no confirm button for wire — user just reads bank details
        <View style={styles.modalFooter}>
          <Pressable style={[styles.confirmBtn, loading && { opacity: 0.7 }]} onPress={handleConfirm} disabled={loading}>
            <LinearGradient colors={[Colors.gold, '#A88A2C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text style={styles.confirmText}>
              {loading ? 'Traitement...' : `Recharger ${amount.toLocaleString('fr-FR')} XOF`}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const CARD_INFO_SECTIONS = [ // FAQ-style content for the card explainer modal
  {
    icon: 'card-outline' as const,
    color: Colors.gold,
    title: 'C\'est quoi la JOJ Card ?',
    body: 'La JOJ Card est votre carte prépayée officielle pour les Jeux de la Francophonie Dakar 2026. Elle remplace entièrement le cash dans toutes les zones — restaurants, boutiques, transport, activités.',
  },
  {
    icon: 'wifi-outline' as const,
    color: Colors.brand,
    title: 'Paiement sans contact',
    body: 'Payez en approchant votre téléphone (NFC) ou en présentant votre QR code personnel. Rapide, sécurisé, sans file d\'attente aux caisses.',
  },
  {
    icon: 'add-circle-outline' as const,
    color: Colors.teal,
    title: 'Recharger votre solde',
    body: 'Rechargez à tout moment via Orange Money, Wave, carte bancaire Visa/Mastercard, Apple Pay, ou par virement bancaire depuis n\'importe quelle banque dans le monde.',
  },
  {
    icon: 'star-outline' as const,
    color: Colors.gold,
    title: 'Système de points JOJ',
    body: 'Chaque dépense génère des points : 100 XOF dépensés = 1 JOJ Point. Échangez vos points contre des goodies officiels, des accès VIP ou des rencontres avec les athlètes.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    color: Colors.success,
    title: 'Sécurité & protection',
    body: 'Votre solde est protégé par votre mot de passe et vos données biométriques. En cas de perte du téléphone, le solde reste intact et récupérable via votre compte.',
  },
  {
    icon: 'wallet-outline' as const,
    color: Colors.purple,
    title: 'Solde après les Jeux',
    body: 'Le solde non utilisé est remboursable sur votre moyen de paiement d\'origine dans les 30 jours suivant la clôture des Jeux (06 août 2026).',
  },
];

function CardInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.modal}>
      <LinearGradient colors={[Colors.bg, Colors.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={styles.modalHandle} />
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>La JOJ Card</Text>
        <Pressable onPress={onClose} style={styles.iconBtn}>
          <Ionicons name="close" size={20} color={Colors.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.modalScroll, { gap: 12 }]}>

        <View style={styles.cardInfoHero}> {/* hero banner at top of explainer */}
          <LinearGradient colors={[Colors.brand, Colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <Ionicons name="card" size={40} color="rgba(255,255,255,0.9)" />
          <Text style={styles.cardInfoHeroTitle}>JOJ Dakar 2026</Text>
          <Text style={styles.cardInfoHeroSub}>Paiements 100% cashless aux Jeux de la Francophonie</Text>
        </View>

        {CARD_INFO_SECTIONS.map((s) => ( // render each FAQ section
          <View key={s.title} style={styles.cardInfoRow}>
            <View style={[styles.cardInfoIcon, { backgroundColor: s.color + '18', borderColor: s.color + '30' }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardInfoTitle}>{s.title}</Text>
              <Text style={styles.cardInfoBody}>{s.body}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
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

  card: { width: CARD_W, height: CARD_W * 0.58, borderRadius: Radius.xl, padding: 22, justifyContent: 'space-between', overflow: 'hidden' }, // credit card proportions
  cardPattern: { position: 'absolute', right: 0, top: 0 },
  cardCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }, // subtle decorative ring
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.6, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardBalanceLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 4 },
  cardBalance: { fontSize: 30, fontWeight: '900', color: '#fff' },
  cardCcy: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardNum: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace', letterSpacing: 1 }, // monospace for card digits
  cardNfc: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },

  pointsStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.gold + '30', borderRadius: Radius.lg, padding: 12 },
  pointsText: { flex: 1, fontSize: 12, color: Colors.textSecondary },

  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { flex: 1, alignItems: 'center', gap: 8 },
  actionIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  actionLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },

  qrPay: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.brand + '15', borderWidth: 1, borderColor: Colors.brand + '30', borderRadius: Radius.lg, padding: 16, gap: 14 },
  qrPayIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.brand + '20', alignItems: 'center', justifyContent: 'center' },
  qrPayTitle: { ...Typography.callout, fontWeight: '700' },
  qrPaySub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.brand + '30', borderRadius: Radius.lg, padding: 16, overflow: 'hidden' },
  infoBannerTitle: { ...Typography.callout, fontWeight: '700' },
  infoBannerSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  sectionLabel: { ...Typography.label, marginTop: 6, marginBottom: 4 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },

  emptyTx: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyTxText: { ...Typography.callout, color: Colors.textTertiary },

  methodsList: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, overflow: 'hidden' },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  methodRowActive: { backgroundColor: Colors.surface3 }, // selected method highlight
  methodDivider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1, marginHorizontal: 14 },
  methodIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  methodName: { ...Typography.callout, fontWeight: '600', flex: 1 },
  methodCheck: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border2 }, // unselected radio circle

  tx: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface1, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.md, padding: 14, gap: 12, marginBottom: 6 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txLabel: { ...Typography.callout, fontWeight: '600' },
  txDate: { ...Typography.caption, color: Colors.textTertiary },
  txAmount: { ...Typography.callout, fontWeight: '700' },
  txCredit: { color: Colors.success }, // green for money in
  txDebit: { color: Colors.text }, // normal color for money out

  modal: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border2, alignSelf: 'center', marginBottom: 14 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { ...Typography.title2, fontWeight: '800' },
  modalScroll: { paddingBottom: 120 }, // space for fixed footer button
  amountDisplay: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', paddingVertical: 24, gap: 6 },
  amountValue: { fontSize: 48, fontWeight: '900', color: Colors.text, letterSpacing: -1 }, // big bold amount
  amountCcy: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetBtn: { flex: 1, minWidth: '47%', height: 50, borderRadius: Radius.md, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, alignItems: 'center', justifyContent: 'center' },
  presetBtnActive: { backgroundColor: Colors.gold + '20', borderColor: Colors.gold + '50' }, // gold tint when selected
  presetText: { ...Typography.callout, fontWeight: '700' },
  presetTextActive: { color: Colors.gold },
  modalFooter: { paddingVertical: 16 },
  confirmBtn: { height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  confirmText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  transferInfo: { backgroundColor: Colors.teal + '12', borderWidth: 1, borderColor: Colors.teal + '30', borderRadius: Radius.lg, padding: 16, gap: 6, marginTop: 8 },
  transferTitle: { fontSize: 14, fontWeight: '800', color: Colors.teal, marginBottom: 4 },
  transferLine: { fontSize: 13, color: Colors.text, fontFamily: 'monospace' }, // bank details in monospace
  transferNote: { fontSize: 12, color: Colors.textTertiary, marginTop: 8, lineHeight: 17 },

  cardInfoHero: { borderRadius: Radius.xl, padding: 28, alignItems: 'center', gap: 10, overflow: 'hidden', marginBottom: 4 },
  cardInfoHeroTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.4 },
  cardInfoHeroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 18 },

  cardInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border1, borderRadius: Radius.lg, padding: 16 },
  cardInfoIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0 }, // icon doesn't shrink
  cardInfoTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  cardInfoBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

});
