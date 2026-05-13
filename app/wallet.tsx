import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { useTranslation } from '../src/i18n';
import { getColors, Radius } from '../src/theme';

const { width } = Dimensions.get('window');
const CARD_W = width - 40;

type PaymentMethod = { id: string; name: string; icon: keyof typeof Ionicons.glyphMap; color: string };
const METHODS: PaymentMethod[] = [
  { id: 'orange', name: 'Orange Money', icon: 'phone-portrait-outline', color: '#FF6B00' },
  { id: 'wave', name: 'Wave', icon: 'water-outline', color: '#1DC7FF' },
  { id: 'card', name: 'Carte bancaire', icon: 'card-outline', color: '#4A90E2' },
];

type TopUpStep = 'method' | 'phone' | 'otp' | 'processing' | 'success';
type FlowType = 'topup' | 'pay';

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);

  const [showTopUp, setShowTopUp] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const user = state.user ?? { name: 'Visiteur', accreditation: 'JOJ-2026-VIS-00000', avatar: 'VT' };
  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1 }]}>
        <View style={s.headerRow}>
          <Pressable onPress={() => router.back()} style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
            <Ionicons name="arrow-back-outline" size={20} color={C.text} />
          </Pressable>
          <Text style={[s.headerTitle, { color: C.text }]}>Mon Wallet</Text>
          <View style={[s.iconBtn, { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <View style={[s.card, { width: CARD_W }]}>
          <LinearGradient colors={[C.gold, C.gold + 'CC', C.goldLight ?? C.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={s.cardPattern}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[s.cardCircle, { width: 100 + i * 50, height: 100 + i * 50, borderRadius: (100 + i * 50) / 2, right: -30 - i * 20, top: -20 - i * 10 }]} />
            ))}
          </View>
          <View style={s.cardTop}>
            <View>
              <Text style={s.cardLabel}>JOJ WALLET</Text>
              <Text style={s.cardName}>{user.name}</Text>
            </View>
            <Ionicons name="card" size={26} color="rgba(255,255,255,0.6)" />
          </View>
          <View>
            <Text style={s.cardBalanceLabel}>Solde disponible</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Text style={s.cardBalance}>{state.walletBalance.toLocaleString('fr-FR')}</Text>
              <Text style={s.cardCcy}>XOF</Text>
            </View>
          </View>
          <View style={s.cardFooter}>
            <Text style={s.cardNum}>•••• •••• ••••  8421</Text>
            <View style={s.cardNfc}>
              <Ionicons name="wifi-outline" size={18} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={s.actions}>
          <ActionItem icon="add-outline" label={t.topUp} color={C.gold} onPress={() => setShowTopUp(true)} C={C} />
          <ActionItem icon="arrow-up-outline" label={t.send} color={C.teal} onPress={() => Alert.alert(t.send, t.comingSoon)} C={C} />
          <ActionItem icon="qr-code-outline" label={t.pay} color={C.brand} onPress={() => setShowPay(true)} C={C} />
          <ActionItem icon="arrow-down-outline" label={t.receive} color={C.blue} onPress={() => Alert.alert(t.receive, t.comingSoon)} C={C} />
        </View>

        {/* QR Pay */}
        <Pressable style={[s.qrPay, { backgroundColor: C.brand + '15', borderColor: C.brand + '30' }]} onPress={() => setShowQR(true)}>
          <View style={[s.qrPayIcon, { backgroundColor: C.brand + '20' }]}>
            <Ionicons name="qr-code-outline" size={28} color={C.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.qrPayTitle, { color: C.text }]}>Paiement par QR code</Text>
            <Text style={[s.qrPaySub, { color: C.textSecondary }]}>Scannez pour payer dans toutes les zones JOJ</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
        </Pressable>

        {/* Transactions */}
        <View style={s.txHeader}>
          <Text style={[s.sectionLabel, { color: C.textTertiary }]}>HISTORIQUE</Text>
          <Text style={[s.txAll, { color: C.brand }]}>Voir tout</Text>
        </View>
        {state.transactions.slice(0, 10).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} C={C} />
        ))}
      </ScrollView>

      {/* Top-up modal */}
      <Modal visible={showTopUp} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowTopUp(false)}>
        <PaymentFlow
          type="topup"
          onClose={() => setShowTopUp(false)}
          onSuccess={(amount) => {
            dispatch({ type: 'TOP_UP', payload: amount });
            setShowTopUp(false);
          }}
          C={C}
          t={t}
        />
      </Modal>

      {/* Pay modal */}
      <Modal visible={showPay} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPay(false)}>
        <PaymentFlow
          type="pay"
          onClose={() => setShowPay(false)}
          onSuccess={(amount) => {
            dispatch({ type: 'DEBIT_WALLET', payload: { amount, label: 'Paiement JOJ' } });
            setShowPay(false);
          }}
          C={C}
          t={t}
          maxAmount={state.walletBalance}
        />
      </Modal>

      {/* QR Modal */}
      <Modal visible={showQR} animationType="fade" transparent onRequestClose={() => setShowQR(false)}>
        <View style={s.qrOverlay}>
          <View style={[s.qrModal, { backgroundColor: C.bgElevated }]}>
            <Text style={[s.qrTitle, { color: C.text }]}>Mon QR Code</Text>
            <View style={[s.qrBox, { backgroundColor: '#fff' }]}>
              <Ionicons name="qr-code" size={160} color={C.bg} />
            </View>
            <Text style={[s.qrAccred, { color: C.textSecondary }]}>{user.accreditation ?? 'JOJ-2026'}</Text>
            <Pressable style={[s.closeQrBtn, { backgroundColor: C.brand }]} onPress={() => setShowQR(false)}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{t.close}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PaymentFlow({
  type,
  onClose,
  onSuccess,
  C,
  t,
  maxAmount,
}: {
  type: FlowType;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  C: ReturnType<typeof getColors>;
  t: ReturnType<typeof useTranslation>;
  maxAmount?: number;
}) {
  const [step, setStep] = useState<TopUpStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('orange');
  const [amount, setAmount] = useState(10000);
  const [customAmount, setCustomAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const PRESETS = [5000, 10000, 25000, 50000];

  useEffect(() => {
    if (step === 'otp') {
      setCountdown(30);
      const timer = setTimeout(() => setOtp('123456'), 3000);
      const interval = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [step]);

  const handleMethodNext = () => {
    const m = METHODS.find((m) => m.id === selectedMethod);
    if (m?.id === 'card') {
      setStep('phone');
    } else {
      setStep('phone');
    }
  };

  const handlePhoneNext = () => {
    if (!phone.trim() && selectedMethod !== 'card') {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone.');
      return;
    }
    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      Alert.alert('Erreur', 'Montant invalide.');
      return;
    }
    if (type === 'pay' && maxAmount !== undefined && finalAmount > maxAmount) {
      Alert.alert('Erreur', 'Solde insuffisant.');
      return;
    }
    setStep('otp');
  };

  const handleOtpNext = () => {
    if (otp.length < 4) {
      Alert.alert('Erreur', 'Veuillez entrer le code OTP complet.');
      return;
    }
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleFinish = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    onSuccess(finalAmount);
  };

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;
  const methodObj = METHODS.find((m) => m.id === selectedMethod);
  const isTopup = type === 'topup';

  return (
    <View style={[{ flex: 1, paddingHorizontal: 20, paddingTop: 12, backgroundColor: C.bg }]}>
      <LinearGradient colors={[C.bg, C.bgDeep]} style={StyleSheet.absoluteFill} />
      <View style={[{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border2, alignSelf: 'center', marginBottom: 14 }]} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 21, fontWeight: '800', color: C.text }}>
          {isTopup ? t.topUp : t.pay}
        </Text>
        <Pressable onPress={onClose} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close-outline" size={20} color={C.text} />
        </Pressable>
      </View>

      {/* Step indicator */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}>
        {(['method', 'phone', 'otp', 'processing', 'success'] as TopUpStep[]).map((s, i) => (
          <View key={s} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: ['method', 'phone', 'otp', 'processing', 'success'].indexOf(step) >= i ? C.brand : C.border2 }} />
        ))}
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 'method' && (
          <>
            <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1, color: C.textTertiary, marginBottom: 12 }}>MÉTHODE DE PAIEMENT</Text>
            <View style={{ gap: 10, marginBottom: 20 }}>
              {METHODS.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedMethod(m.id)}
                  style={{
                    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: Radius.lg,
                    backgroundColor: selectedMethod === m.id ? C.brand + '12' : C.surface2,
                    borderWidth: 1.5,
                    borderColor: selectedMethod === m.id ? C.brand + '60' : C.border1,
                    gap: 12,
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: m.color + '20', borderWidth: 1, borderColor: m.color + '30', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={m.icon} size={22} color={m.color} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.text }}>{m.name}</Text>
                  {selectedMethod === m.id ? (
                    <Ionicons name="checkmark-circle" size={22} color={C.brand} />
                  ) : (
                    <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: C.border2 }} />
                  )}
                </Pressable>
              ))}
            </View>
            <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1, color: C.textTertiary, marginBottom: 12 }}>MONTANT</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', paddingVertical: 16, gap: 8 }}>
              <Text style={{ fontSize: 44, fontWeight: '900', color: C.text, letterSpacing: -1 }}>{finalAmount.toLocaleString('fr-FR')}</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: C.textSecondary }}>XOF</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {PRESETS.map((p) => (
                <Pressable key={p} onPress={() => { setAmount(p); setCustomAmount(''); }} style={{
                  flex: 1, minWidth: '47%', height: 50, borderRadius: Radius.md,
                  backgroundColor: amount === p && !customAmount ? C.gold + '20' : C.surface2,
                  borderWidth: 1,
                  borderColor: amount === p && !customAmount ? C.gold + '50' : C.border1,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: amount === p && !customAmount ? C.gold : C.text }}>{p.toLocaleString('fr-FR')}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              placeholder="Autre montant..."
              placeholderTextColor={C.textTertiary}
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="number-pad"
              style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, borderRadius: Radius.md, paddingHorizontal: 16, height: 50, fontSize: 15, color: C.text, marginBottom: 20 }}
            />
            <Pressable onPress={handleMethodNext} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Continuer</Text>
            </Pressable>
          </>
        )}

        {step === 'phone' && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 6 }}>
              {methodObj?.name}
            </Text>
            <Text style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>
              Montant: <Text style={{ fontWeight: '800', color: C.brand }}>{finalAmount.toLocaleString('fr-FR')} XOF</Text>
            </Text>
            {selectedMethod !== 'card' ? (
              <>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6 }}>{t.enterPhone}</Text>
                <TextInput
                  placeholder="+221 77 000 0000"
                  placeholderTextColor={C.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, borderRadius: Radius.md, paddingHorizontal: 16, height: 52, fontSize: 15, color: C.text, marginBottom: 20 }}
                />
              </>
            ) : (
              <>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6 }}>Numéro de carte</Text>
                <TextInput
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={C.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="number-pad"
                  style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, borderRadius: Radius.md, paddingHorizontal: 16, height: 52, fontSize: 15, color: C.text, marginBottom: 20 }}
                />
              </>
            )}
            <Pressable onPress={handlePhoneNext} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Envoyer le code OTP</Text>
            </Pressable>
          </>
        )}

        {step === 'otp' && (
          <>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: C.brand + '15', borderWidth: 1, borderColor: C.brand + '30', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="phone-portrait-outline" size={28} color={C.brand} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.text, textAlign: 'center' }}>Code envoyé</Text>
              <Text style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center', marginTop: 4 }}>
                {selectedMethod !== 'card' ? `Au ${phone || '+221 XX XXX XXXX'}` : 'À votre carte enregistrée'}
              </Text>
              {countdown > 0 && (
                <Text style={{ fontSize: 12, color: C.textTertiary, marginTop: 8 }}>Renvoi disponible dans {countdown}s</Text>
              )}
            </View>
            <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary, marginBottom: 6 }}>{t.otpCode}</Text>
            <TextInput
              placeholder="123456"
              placeholderTextColor={C.textTertiary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={{ backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border2, borderRadius: Radius.md, paddingHorizontal: 16, height: 52, fontSize: 22, color: C.text, textAlign: 'center', letterSpacing: 8, marginBottom: 20, fontWeight: '800' }}
            />
            <Pressable onPress={handleOtpNext} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Vérifier</Text>
            </Pressable>
          </>
        )}

        {step === 'processing' && (
          <View style={{ alignItems: 'center', paddingVertical: 60, gap: 20 }}>
            <ActivityIndicator size="large" color={C.brand} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: C.text }}>{t.verifying}</Text>
            <Text style={{ fontSize: 13, color: C.textSecondary }}>Transaction en cours...</Text>
          </View>
        )}

        {step === 'success' && (
          <View style={{ alignItems: 'center', paddingVertical: 40, gap: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 28, backgroundColor: C.success + '20', borderWidth: 2, borderColor: C.success + '40', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark-circle" size={48} color={C.success} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '900', color: C.text }}>{isTopup ? t.topUpSuccess : t.success}</Text>
            <Text style={{ fontSize: 36, fontWeight: '900', color: C.brand, letterSpacing: -1 }}>
              {isTopup ? '+' : '-'}{finalAmount.toLocaleString('fr-FR')} XOF
            </Text>
            <Text style={{ fontSize: 13, color: C.textSecondary }}>via {methodObj?.name}</Text>
            <Pressable onPress={handleFinish} style={{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', marginTop: 16 }}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Terminer</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ActionItem({
  icon,
  label,
  color,
  onPress,
  C,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable style={{ flex: 1, alignItems: 'center', gap: 8 }} onPress={onPress}>
      <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: color + '18', borderWidth: 1, borderColor: color + '30', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>{label}</Text>
    </Pressable>
  );
}

function TransactionRow({ tx, C }: { tx: any; C: ReturnType<typeof getColors> }) {
  const isCredit = tx.type === 'credit';
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface1,
      borderWidth: 1, borderColor: C.border1, borderRadius: Radius.md, padding: 14, gap: 12, marginBottom: 6,
    }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isCredit ? C.success + '15' : C.surface3, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={tx.icon as any} size={18} color={isCredit ? C.success : C.textSecondary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{tx.label}</Text>
        <Text style={{ fontSize: 12, color: C.textTertiary }}>{tx.date}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '700', color: isCredit ? C.success : C.text }}>
        {isCredit ? '+' : '−'}{tx.amount.toLocaleString('fr-FR')} XOF
      </Text>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 21, fontWeight: '800' },
    iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    scroll: { padding: 20, gap: 14 },
    card: { height: CARD_W * 0.58, borderRadius: Radius.xl, padding: 22, justifyContent: 'space-between', overflow: 'hidden' },
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
    actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    qrPay: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: Radius.lg, padding: 16, gap: 14 },
    qrPayIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    qrPayTitle: { fontSize: 15, fontWeight: '700' },
    qrPaySub: { fontSize: 12, marginTop: 2 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    txAll: { fontSize: 13, fontWeight: '600' },
    qrOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
    qrModal: { width: width - 60, borderRadius: Radius.xl, padding: 28, alignItems: 'center', gap: 16 },
    qrTitle: { fontSize: 20, fontWeight: '800' },
    qrBox: { width: 180, height: 180, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    qrAccred: { fontSize: 12, fontFamily: 'monospace' },
    closeQrBtn: { width: '100%', height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  });
}
