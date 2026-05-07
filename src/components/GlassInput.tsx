import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Typography } from '../theme';

interface GlassInputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function GlassInput({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  containerStyle,
  style,
  ...props
}: GlassInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          focused && styles.focused,
          !!error && styles.errored,
        ]}
      >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.inner}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={focused ? Colors.orange : Colors.textTertiary}
              style={styles.leftIcon}
            />
          )}
          <TextInput
            {...props}
            style={[styles.input, style]}
            placeholderTextColor={Colors.textDim}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
          />
          {rightIcon && (
            <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
              <Ionicons
                name={rightIcon}
                size={20}
                color={Colors.textTertiary}
              />
            </Pressable>
          )}
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    ...Typography.footnote,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    backgroundColor: Colors.glass1,
  },
  focused: {
    borderColor: Colors.orange + '80',
  },
  errored: {
    borderColor: Colors.error + '80',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '400',
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginLeft: 4,
  },
});
