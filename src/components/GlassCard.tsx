import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Radius, Shadows } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void; // if provided, wraps in Pressable
  intensity?: number; // reserved for blur intensity (not used yet)
  variant?: 'default' | 'strong' | 'subtle' | 'accent';
  borderGlow?: string; // hex color for a glowing border tint
  disabled?: boolean;
}

export default function GlassCard({
  children,
  style,
  onPress,
  variant = 'default',
  borderGlow,
  disabled,
}: GlassCardProps) {
  const cardStyle = [
    styles.card,
    variant === 'strong' && styles.cardStrong, // more opaque white
    variant === 'subtle' && styles.cardSubtle, // barely visible
    variant === 'accent' && styles.cardAccent, // orange tint
    borderGlow && { borderColor: borderGlow + '40' }, // apply glow color at 25% opacity
    style,
  ];

  // pressable variant — wraps children in a touchable with scale feedback
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>; // static card, no press handler
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)', // default frosted glass fill
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden', // clip children to rounded corners
  },
  cardStrong: {
    backgroundColor: 'rgba(255,255,255,0.13)', // noticeably more opaque
    borderColor: 'rgba(255,255,255,0.18)',
  },
  cardSubtle: {
    backgroundColor: 'rgba(255,255,255,0.05)', // barely there
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardAccent: {
    backgroundColor: 'rgba(255,107,53,0.12)', // brand orange tint
    borderColor: 'rgba(255,107,53,0.30)',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }], // slight shrink when tapped
  },
});
