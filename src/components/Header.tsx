import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string; // smaller text below the title
  showBack?: boolean; // show back chevron on the left
  onBack?: () => void;
  right?: React.ReactNode; // slot for a right-side action button
  transparent?: boolean; // skip background fill and border
}

export default function Header({ title, subtitle, showBack, onBack, right, transparent }: HeaderProps) {
  const insets = useSafeAreaInsets(); // push content below status bar

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }, !transparent && styles.bg]}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}> {/* larger tap target */}
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </Pressable>
          )}
        </View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        <View style={styles.right}>{right}</View> {/* right slot, e.g. icon button */}
      </View>
      {!transparent && <View style={styles.border} />} {/* hairline divider unless transparent */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { zIndex: 100 }, // sits above scroll content
  bg: { backgroundColor: 'rgba(5,10,24,0.85)' }, // semi-transparent dark bg
  content: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  left: { width: 44, alignItems: 'flex-start' }, // fixed width keeps title centered
  center: { flex: 1, alignItems: 'center' },
  right: { width: 44, alignItems: 'flex-end' }, // mirrors left side width
  backBtn: { padding: 4 },
  title: { ...Typography.headline, fontWeight: '700' },
  subtitle: { ...Typography.caption, marginTop: 1 },
  border: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border1 },
});
