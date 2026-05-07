import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
}

export default function Header({
  title,
  subtitle,
  showBack,
  onBack,
  right,
  transparent,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      {!transparent && (
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      {!transparent && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />
      )}
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors.text}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.right}>{right}</View>
      </View>
      {!transparent && <View style={styles.border} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  overlay: {
    backgroundColor: 'rgba(5,10,24,0.6)',
  },
  content: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
  backBtn: {
    padding: 4,
  },
  title: {
    ...Typography.headline,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 1,
  },
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border1,
    marginHorizontal: 0,
  },
});
