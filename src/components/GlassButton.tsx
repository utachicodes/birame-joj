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
import { BlurView } from 'expo-blur';
import { Colors, Radius, Typography, Shadows } from '../theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: readonly [string, string, ...string[]];
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
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: 16, borderRadius: Radius.sm },
    md: { height: 52, paddingHorizontal: 24, borderRadius: Radius.md },
    lg: { height: 60, paddingHorizontal: 32, borderRadius: Radius.lg },
  };

  const textSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const gradientColors =
    gradient ||
    (isDanger
      ? ([Colors.error, '#CC2244'] as const)
      : ([Colors.orange, Colors.orangeLight] as const));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isPrimary || isDanger ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: sizeStyles[size].borderRadius }]}
        />
      ) : (
        <BlurView
          intensity={isGhost ? 10 : 20}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}

      {!isPrimary && !isDanger && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isGhost ? 'transparent' : Colors.glass2,
              borderRadius: sizeStyles[size].borderRadius,
              borderWidth: 1,
              borderColor: Colors.border2,
            },
          ]}
        />
      )}

      <View style={styles.row}>
        {icon && !loading && <View style={styles.icon}>{icon}</View>}
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: textSizes[size] },
              isGhost && styles.textGhost,
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
    overflow: 'hidden',
    ...Shadows.md,
  },
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    ...Typography.headline,
    color: '#fff',
    fontWeight: '700',
  },
  textGhost: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
});
