import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../theme';

// maps route names to icon/label config
type TabConfig = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap; // outline icon when inactive
  iconActive: keyof typeof Ionicons.glyphMap; // filled icon when active
  label: string;
};

// order and config for all five tabs
const TAB_CONFIG: TabConfig[] = [
  { name: 'index', icon: 'home-outline', iconActive: 'home', label: 'Home' },
  { name: 'tickets', icon: 'ticket-outline', iconActive: 'ticket', label: 'Tickets' },
  { name: 'events', icon: 'calendar-outline', iconActive: 'calendar', label: 'Events' },
  { name: 'transport', icon: 'car-outline', iconActive: 'car', label: 'Transport' },
  { name: 'profile', icon: 'person-outline', iconActive: 'person', label: 'Profile' },
];

// individual tab button with bounce animation on press
function TabItem({
  config,
  isFocused,
  onPress,
}: {
  config: TabConfig;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current; // each tab has its own scale anim

  const handlePress = () => {
    // quick squish then spring back
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Pressable style={styles.tab} onPress={handlePress}>
      <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
        {isFocused && <View style={styles.activePill} />} {/* orange top accent bar */}
        <Ionicons
          name={isFocused ? config.iconActive : config.icon} // filled vs outline
          size={24}
          color={isFocused ? Colors.orange : Colors.textTertiary}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {config.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// custom tab bar wired into React Navigation
export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets(); // adds home indicator clearance on iPhone

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={[StyleSheet.absoluteFill, styles.overlay]} /> {/* frosted dark overlay */}
      <View style={styles.border} /> {/* hairline separator at the top */}
      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG.find((t) => t.name === route.name) || TAB_CONFIG[0]; // match by route name
          const isFocused = state.index === index; // active tab check
          return (
            <TabItem
              key={route.key}
              config={config}
              isFocused={isFocused}
              onPress={() => {
                if (!isFocused) navigation.navigate(route.name); // skip re-navigate on same tab
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute', // floats over screen content
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  overlay: {
    backgroundColor: 'rgba(5,10,24,0.75)', // semi-transparent dark blur replacement
  },
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border1,
  },
  content: {
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  activePill: {
    position: 'absolute',
    top: -8, // sits above the icon
    left: '50%',
    marginLeft: -16, // center it over the icon
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.orange,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textTertiary,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.orange,
    fontWeight: '600',
  },
});
