import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useApp } from '../../src/context/AppContext';
import { useTranslation } from '../../src/i18n';
import { getColors, Radius } from '../../src/theme';
import CountryBadge from '../../src/components/CountryBadge';
import { TICKETS } from '../../src/data/mock';

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const t = useTranslation(state.language);
  const C = getColors(state.theme);

  const [selected, setSelected]         = useState<(typeof TICKETS)[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ticketCode, setTicketCode]     = useState('');

 
  const user = state.user ?? {
    name: 'Visiteur',
    role: 'Visiteur',
    country: 'Sénégal',
    countryCode: 'SN',
    accreditation: 'JOJ-2026-VIS-00000',
  };

  const handleAddTicket = () => {
    if (!ticketCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un code de billet.');
      return;
    }
    setTicketCode('');      
    setShowAddModal(false);
   
    Alert.alert('Billet ajouté !', `Le billet ${ticketCode.toUpperCase()} a été ajouté à votre compte.`);
  };

 
  const accredQrValue = `JOJ:ACCRED:${user.accreditation}:${user.name.replace(/\s+/g, '_').toUpperCase()}`;

  const s = makeStyles(C);

  return (
    <View style={[s.container, { backgroundColor: C.bg }]}>
      <StatusBar style={state.theme === 'dark' ? 'light' : 'dark'} />
      <LinearGradient colors={[C.bg, C.bgElevated, C.bg]} style={StyleSheet.absoluteFill} />

      {/* Screen header */}
      <View style={[s.header, { paddingTop: insets.top + 8, borderBottomColor: C.border1 }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={[s.headerTitle, { color: C.text }]}>{t.myTickets}</Text>
            <Text style={[s.headerSub, { color: C.textSecondary }]}>{TICKETS.length} pass actifs</Text>
          </View>
          <Pressable
            style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-outline" size={22} color={C.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Official accreditation card */}
        <View style={s.accred}>
          <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

          {/* Decorative concentric circles */}
          <View style={s.accredPattern}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[s.accredCircle, { width: 160 + i * 60, height: 160 + i * 60, borderRadius: (160 + i * 60) / 2, right: -50 - i * 20, top: -30 - i * 15 }]} />
            ))}
          </View>

          <View style={s.accredHead}>
            <Ionicons name="shield-checkmark" size={18} color="#fff" />
            <Text style={s.accredHeadText}>ACCRÉDITATION OFFICIELLE</Text>
          </View>

          <Text style={s.accredName}>{user.name}</Text>

          <View style={s.accredMeta}>
            <CountryBadge code={user.countryCode} size="md" />
            <View>
              <Text style={s.accredRole}>{user.role}</Text>
              <Text style={s.accredCountry}>{user.country}</Text>
            </View>
          </View>

          {/* Card footer: accreditation number + mini QR */}
          <View style={s.accredFooter}>
            <View>
              <Text style={s.accredFooterLabel}>N° ACCRÉDITATION</Text>
              <Text style={s.accredNum}>{user.accreditation}</Text>
            </View>
            {/* QR on a transparent background — sits on the gradient */}
            <View style={s.accredQr}>
              <QRCode
                value={accredQrValue}
                size={42}
                color="#fff"
                backgroundColor="transparent"
              />
            </View>
          </View>
        </View>

        <Text style={[s.sectionLabel, { color: C.textTertiary }]}>BILLETS &amp; PASS</Text>

        {TICKETS.map((tkt) => (
          <TicketCard key={tkt.id} ticket={tkt} onPress={() => setSelected(tkt)} C={C} />
        ))}

        {/* "Add ticket" card with dashed border */}
        <Pressable style={[s.addCard, { backgroundColor: C.surface1, borderColor: C.border1 }]} onPress={() => setShowAddModal(true)}>
          <View style={[s.addIconRing, { borderColor: C.border2 }]}>
            <Ionicons name="add-outline" size={26} color={C.textSecondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.addTitle, { color: C.text }]}>Ajouter un billet</Text>
            <Text style={[s.addSub, { color: C.textTertiary }]}>Scanner un QR ou saisir un code</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
        </Pressable>
      </ScrollView>

      {/* Ticket detail modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && <TicketModal ticket={selected} onClose={() => setSelected(null)} C={C} t={t} />}
      </Modal>

      {/* Add ticket modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAddModal(false)}>
        <View style={[s.modal, { backgroundColor: C.bg }]}>
          <LinearGradient colors={[C.bg, C.bgDeep]} style={StyleSheet.absoluteFill} />
          <View style={[s.modalHandle, { backgroundColor: C.border2 }]} />
          <View style={s.modalHeader}>
            <Text style={[s.modalTitle, { color: C.text }]}>Ajouter un billet</Text>
            <Pressable onPress={() => setShowAddModal(false)} style={[s.iconBtn, { backgroundColor: C.surface2, borderColor: C.border1 }]}>
              <Ionicons name="close-outline" size={20} color={C.text} />
            </Pressable>
          </View>
          <View style={{ gap: 14, paddingTop: 8 }}>
            <Text style={{ fontSize: 13, color: C.textSecondary, lineHeight: 18 }}>
              Entrez votre code de billet ou scannez le QR code reçu par email.
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>Code de billet</Text>
            {/* Force uppercase so codes are always formatted correctly */}
            <TextInput
              placeholder="ex: JOJ-T-2026-XXXXX"
              placeholderTextColor={C.textTertiary}
              value={ticketCode}
              onChangeText={(v) => setTicketCode(v.toUpperCase())}
              autoCapitalize="characters"
              style={{
                backgroundColor: C.surface2,
                borderWidth: 1,
                borderColor: C.border2,
                borderRadius: Radius.md,
                paddingHorizontal: 16,
                height: 52,
                fontSize: 16,
                color: C.text,
                fontFamily: 'monospace',
                letterSpacing: 1,
              }}
            />
            <Pressable style={[{ height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }]} onPress={handleAddTicket}>
              <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>Ajouter</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Compact ticket row shown in the main list
function TicketCard({
  ticket,
  onPress,
  C,
}: {
  ticket: (typeof TICKETS)[0];
  onPress: () => void;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <Pressable style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, borderRadius: Radius.lg, padding: 14, gap: 12, marginBottom: 8 }]} onPress={onPress}>
      {/* Sport icon + ticket type */}
      <View style={{ alignItems: 'center', gap: 8, width: 60 }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.brand + '15', borderWidth: 1, borderColor: C.brand + '30', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={ticket.icon} size={22} color={C.brand} />
        </View>
        <Text style={{ fontSize: 9, fontWeight: '800', letterSpacing: 1, color: C.brand }}>{ticket.type.toUpperCase()}</Text>
      </View>

      {/* Vertical perforated divider */}
      <View style={{ width: StyleSheet.hairlineWidth, height: 60, backgroundColor: C.border1 }} />

      {/* Event info */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.text, lineHeight: 19 }} numberOfLines={2}>{ticket.event}</Text>
        <Text style={{ fontSize: 12, color: C.textSecondary }} numberOfLines={1}>{ticket.venue}</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="calendar-outline" size={11} color={C.textTertiary} />
            <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '500' }}>{ticket.date}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="time-outline" size={11} color={C.textTertiary} />
            <Text style={{ fontSize: 11, color: C.textTertiary, fontWeight: '500' }}>{ticket.time}</Text>
          </View>
        </View>
        {/* Active (green) or upcoming (orange) status pill */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
          borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2, marginTop: 4,
          backgroundColor: ticket.status === 'active' ? C.success + '18' : C.warning + '18',
        }}>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: ticket.status === 'active' ? C.success : C.warning }} />
          <Text style={{ fontSize: 10, fontWeight: '700', color: ticket.status === 'active' ? C.success : C.warning }}>
            {ticket.status === 'active' ? 'Actif' : 'À venir'}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
    </Pressable>
  );
}

// Full-screen ticket detail shown inside a pageSheet modal
function TicketModal({
  ticket,
  onClose,
  C,
  t,
}: {
  ticket: (typeof TICKETS)[0];
  onClose: () => void;
  C: ReturnType<typeof getColors>;
  t: ReturnType<typeof useTranslation>;
}) {
  const handleShare = () => {
   
    Alert.alert(t.share, 'Billet partagé !');
  };

  const handleDownload = () => {
   
    Alert.alert(t.download, 'Billet téléchargé dans vos photos.');
  };

  const handleNFC = () => {
   
    Alert.alert(t.nfc, 'Approchez votre téléphone du lecteur NFC.');
  };

 
  const qrValue = `JOJ:TICKET:${ticket.id}:${ticket.event.replace(/\s+/g, '_').toUpperCase()}:${ticket.date}:${ticket.seat}`;

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12, backgroundColor: C.bg }}>
      <LinearGradient colors={[C.bg, C.bgDeep]} style={StyleSheet.absoluteFill} />

      {/* Drag handle */}
      <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border2, alignSelf: 'center', marginBottom: 14 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 21, fontWeight: '800', color: C.text }}>Billet</Text>
        <Pressable onPress={onClose} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close-outline" size={20} color={C.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 14 }} showsVerticalScrollIndicator={false}>

        {/* Visual ticket card */}
        <View style={{ borderRadius: Radius.xl, padding: 24, gap: 14, overflow: 'hidden' }}>
          <LinearGradient colors={[C.brand, C.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

          {/* Icon + ticket type */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={ticket.icon} size={26} color="#fff" />
            </View>
            <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: 'rgba(255,255,255,0.85)' }}>{ticket.type.toUpperCase()}</Text>
          </View>

          <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 26 }}>{ticket.event}</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{ticket.venue}</Text>

          {/* Date / time / seat strip */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: Radius.md, padding: 12, marginTop: 4 }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>Date</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }} numberOfLines={1}>{ticket.date}</Text>
            </View>
            <View style={{ width: StyleSheet.hairlineWidth, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>Heure</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }} numberOfLines={1}>{ticket.time}</Text>
            </View>
            <View style={{ width: StyleSheet.hairlineWidth, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' }}>Place</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }} numberOfLines={1}>{ticket.seat}</Text>
            </View>
          </View>

          {/* Perforation dots row — mimics a real paper ticket */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -24, paddingHorizontal: 16, paddingVertical: 8 }}>
            {[...Array(20)].map((_, i) => (
              <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.18)' }} />
            ))}
          </View>

          {/* Real QR code */}
          <View style={{ alignItems: 'center', gap: 8 }}>
            {/* White bg required for scanner contrast */}
            <View style={{ width: 172, height: 172, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
              <QRCode
                value={qrValue}
                size={152}
                color="#000000"
                backgroundColor="#fff"
              />
            </View>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>Présentez ce QR à l'entrée</Text>
            <Text style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }}>{ticket.id}</Text>
          </View>
        </View>

        {/* Action buttons: share / download / NFC */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={handleShare}
            style={{ flex: 1, height: 56, borderRadius: Radius.lg, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
          >
            <Ionicons name="share-social-outline" size={20} color={C.text} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>{t.share}</Text>
          </Pressable>
          <Pressable
            onPress={handleDownload}
            style={{ flex: 1, height: 56, borderRadius: Radius.lg, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
          >
            <Ionicons name="download-outline" size={20} color={C.text} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>{t.download}</Text>
          </Pressable>
          <Pressable
            onPress={handleNFC}
            style={{ flex: 1, height: 56, borderRadius: Radius.lg, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
          >
            <Ionicons name="wifi-outline" size={20} color={C.text} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: C.textSecondary }}>{t.nfc}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 21, fontWeight: '800' },
    headerSub: { fontSize: 13, marginTop: 2 },
    iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    scroll: { padding: 20, gap: 12 },
    accred: { borderRadius: Radius.xl, padding: 22, overflow: 'hidden', gap: 14, marginBottom: 8 },
    accredPattern: { position: 'absolute', right: 0, top: 0 },
    accredCircle: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
    accredHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    accredHeadText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: 'rgba(255,255,255,0.85)' },
    accredName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
    accredMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    accredRole: { fontSize: 14, fontWeight: '700', color: '#fff' },
    accredCountry: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
    accredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
    accredFooterLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.7)' },
    accredNum: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: 'monospace', marginTop: 2 },
    accredQr: { width: 58, height: 58, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', padding: 8 },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 8, marginBottom: 4 },
    addCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderStyle: 'dashed', borderRadius: Radius.lg, padding: 16, marginTop: 4 },
    addIconRing: { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
    addTitle: { fontSize: 15, fontWeight: '600' },
    addSub: { fontSize: 12 },
    modal: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 21, fontWeight: '800' },
  });
}
