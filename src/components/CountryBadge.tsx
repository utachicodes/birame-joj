import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme';

// representative color per country ISO code
const COUNTRY_COLORS: Record<string, string> = {
  SN: '#00853F', // Senegal green
  CI: '#F77F00', // Côte d'Ivoire orange
  ML: '#14B53A', // Mali green
  CM: '#007A5E', // Cameroon green
  NG: '#008751', // Nigeria green
  GN: '#CE1126', // Guinea red
  BJ: '#008751', // Benin green
  MA: '#C1272D', // Morocco red
  TN: '#E70013', // Tunisia red
  DZ: '#006233', // Algeria green
  FR: '#0055A4', // France blue
  CA: '#FF0000', // Canada red
  BE: '#FAE042', // Belgium yellow
  CH: '#FF0000', // Swiss red
  default: Colors.glass3, // fallback when code is unknown
};

interface Props {
  code: string; // ISO 3166-1 alpha-2 country code
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function CountryBadge({ code, size = 'md', style }: Props) {
  const dim = size === 'sm' ? 22 : size === 'md' ? 28 : 40; // pixel size for the circle
  const bg = COUNTRY_COLORS[code] || COUNTRY_COLORS.default; // use fallback if unknown

  return (
    <View
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2, // perfect circle
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.2)', // subtle white ring
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: dim * 0.36, // scale text to badge size
          fontWeight: '800',
          color: '#fff',
          letterSpacing: 0.5,
        }}
      >
        {code}
      </Text>
    </View>
  );
}
