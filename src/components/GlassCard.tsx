import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius, Shadows } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  intensity?: number;
  variant?: 'default' | 'strong' | 'subtle' | 'accent';
  borderGlow?: string;
  disabled?: boolean;
}

export default function GlassCard({
  children,
  style,
  onPress,
  intensity = 20,
  variant = 'default',
  borderGlow,
  disabled,
}: GlassCardProps) {
  const glassStyle = [
    styles.card,
    variant === 'strong' && styles.cardStrong,
    variant === 'subtle' && styles.cardSubtle,
    variant === 'accent' && styles.cardAccent,
    borderGlow && { borderColor: borderGlow + '40', ...Shadows.glow(borderGlow) },
    style,
  ];

  const Inner = (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          ...glassStyle,
          pressed && styles.pressed,
        ]}
      >
        {Platform.OS === 'ios' && Inner}
        <View style={styles.content}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View style={glassStyle}>
      {Platform.OS === 'ios' && Inner}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glass2,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardStrong: {
    backgroundColor: Colors.glass3,
    borderColor: Colors.border2,
  },
  cardSubtle: {
    backgroundColor: Colors.glass1,
    borderColor: Colors.border1,
  },
  cardAccent: {
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderColor: 'rgba(255,107,53,0.3)',
  },
  content: {
    // Ensures content sits above BlurView
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
