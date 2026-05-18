import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

// map sport slugs to Ionicons names
export const SPORT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  basketball: 'basketball-outline',
  football: 'football-outline',
  natation: 'water-outline',
  athletisme: 'walk-outline',
  judo: 'body-outline',
  handball: 'hand-right-outline',
  volleyball: 'baseball-outline',
  tennis: 'tennisball-outline',
  default: 'trophy-outline', // fallback for unknown sports
};

interface Props {
  sport: string; // slug like "basketball" or "natation"
  size?: number; // icon size in dp, wrapper grows by 18
  color?: string;
  bg?: string; // background color for the wrapper box
  style?: ViewStyle;
}

export default function SportIcon({ sport, size = 24, color, bg, style }: Props) {
  const key = sport.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); // strip accents for lookup
  const iconName = SPORT_ICONS[key] || SPORT_ICONS.default; // fall back gracefully
  const wrapSize = size + 18; // wrapper is always 18px bigger than icon

  return (
    <View
      style={[
        {
          width: wrapSize,
          height: wrapSize,
          borderRadius: 14,
          backgroundColor: bg || Colors.glass2, // allow custom bg per usage
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
