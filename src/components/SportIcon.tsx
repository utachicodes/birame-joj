import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

export const SPORT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  basketball: 'basketball-outline',
  football: 'football-outline',
  natation: 'water-outline',
  athletisme: 'walk-outline',
  judo: 'body-outline',
  handball: 'hand-right-outline',
  volleyball: 'baseball-outline',
  tennis: 'tennisball-outline',
  default: 'trophy-outline',
};

interface Props {
  sport: string;
  size?: number;
  color?: string;
  bg?: string;
  style?: ViewStyle;
}

export default function SportIcon({ sport, size = 24, color, bg, style }: Props) {
  const key = sport.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const iconName = SPORT_ICONS[key] || SPORT_ICONS.default;
  const wrapSize = size + 18;

  return (
    <View
      style={[
        {
          width: wrapSize,
          height: wrapSize,
          borderRadius: 14,
          backgroundColor: bg || Colors.glass2,
          borderWidth: 1,
          borderColor: Colors.border1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Ionicons name={iconName} size={size} color={color || Colors.text} />
    </View>
  );
}
