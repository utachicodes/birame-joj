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
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: 16, borderRadius: Radius.sm },
    md: { height: 52, paddingHorizontal: 24, borderRadius: Radius.md },
    lg: { height: 60, paddingHorizontal: 32, borderRadius: Radius.lg },
  };

  const textSizes = { sm: 14, md: 16, lg: 18 };

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
        !isPrimary && !isDanger && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {(isPrimary || isDanger) && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: sizeStyles[size].borderRadius }]}
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
  },
  fullWidth: { width: '100%' },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { marginRight: 2 },
  text: { ...Typography.headline, color: '#fff', fontWeight: '700' },
  textGhost: { color: Colors.textSecondary, fontWeight: '500' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
});
