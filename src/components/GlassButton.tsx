import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Typography } from '../theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode; // optional icon shown left of label
  loading?: boolean; // replaces label with spinner when true
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: readonly [string, string, ...string[]]; // custom gradient override
  fullWidth?: boolean;
}

export default function GlassButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
  textStyle,
  gradient,
  fullWidth,
}: GlassButtonProps) {
  const isPrimary = variant === 'primary'; // primary gets gradient fill
  const isDanger = variant === 'danger'; // danger gets red gradient
  const isGhost = variant === 'ghost'; // ghost has muted text, no fill

  // height, padding, and radius per size
  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: 16, borderRadius: Radius.sm },
    md: { height: 52, paddingHorizontal: 24, borderRadius: Radius.md },
    lg: { height: 60, paddingHorizontal: 32, borderRadius: Radius.lg },
  };

  const textSizes = { sm: 14, md: 16, lg: 18 }; // font size matches button size

  // pick gradient: explicit prop > danger > default orange
  const gradientColors =
    gradient ||
    (isDanger
      ? ([Colors.error, '#CC2244'] as const)
      : ([Colors.orange, Colors.orangeLight] as const));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading} // block presses while loading
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        !isPrimary && !isDanger && styles.secondary, // glass look for non-primary
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed, // slight shrink on tap
        style,
      ]}
    >
      {(isPrimary || isDanger) && ( // gradient only for these two variants
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: sizeStyles[size].borderRadius }]}
        />
      )}
      <View style={styles.row}>
        {icon && !loading && <View style={styles.icon}>{icon}</View>} {/* hide icon while loading */}
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: textSizes[size] },
              isGhost && styles.textGhost, // dimmer text for ghost variant
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // gradient must not bleed outside radius
  },
  fullWidth: { width: '100%' },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.10)', // frosted glass look
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { marginRight: 2 },
  text: { ...Typography.headline, color: '#fff', fontWeight: '700' },
  textGhost: { color: Colors.textSecondary, fontWeight: '500' }, // ghost tone
  disabled: { opacity: 0.45 }, // visually indicates not interactable
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] }, // subtle press feedback
});
