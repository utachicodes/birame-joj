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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Typography } from '../theme';

interface GlassInputProps extends TextInputProps {
  label?: string; // optional label above the field
  icon?: keyof typeof Ionicons.glyphMap; // left icon inside the input
  rightIcon?: keyof typeof Ionicons.glyphMap; // right icon, e.g. eye toggle
  onRightIconPress?: () => void;
  error?: string; // validation error shown below
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
  ...props // spread remaining TextInput props
}: GlassInputProps) {
  const [focused, setFocused] = useState(false); // track focus to change border color

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>} {/* only render label if given */}
      <View style={[styles.container, focused && styles.focused, !!error && styles.errored]}>
        <View style={styles.inner}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={focused ? Colors.orange : Colors.textTertiary} // icon turns brand color on focus
              style={styles.leftIcon}
            />
          )}
          <TextInput
            {...props}
            style={[styles.input, style]}
            placeholderTextColor={Colors.textDim}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }} // chain external onFocus
            onBlur={(e) => { setFocused(false); props.onBlur?.(e); }} // chain external onBlur
          />
          {rightIcon && (
            <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
              <Ionicons name={rightIcon} size={20} color={Colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>} {/* show error message below */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
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
    borderColor: 'rgba(255,255,255,0.12)', // default glass border
    backgroundColor: 'rgba(255,255,255,0.07)', // glass fill
    overflow: 'hidden',
  },
  focused: { borderColor: Colors.orange + '80' }, // orange ring on focus
  errored: { borderColor: Colors.error + '80' }, // red ring on error
  inner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52 },
  leftIcon: { marginRight: 12 },
  rightIcon: { padding: 4, marginLeft: 8 }, // extra tap area for right icon
  input: { flex: 1, color: Colors.text, fontSize: 16 },
  error: { ...Typography.caption, color: Colors.error, marginLeft: 4 },
});
