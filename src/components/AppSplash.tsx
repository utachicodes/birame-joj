import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // used to size logo relative to screen

interface Props {
  onAnimDone: () => void; // called when the splash fades out
}

export default function AppSplash({ onAnimDone }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current; // logo starts invisible
  const logoScale = useRef(new Animated.Value(0.8)).current; // logo starts slightly small
  const textOpacity = useRef(new Animated.Value(0)).current; // text fades in after logo
  const screenOpacity = useRef(new Animated.Value(1)).current; // whole screen fades to 0 at end

  useEffect(() => {
    Animated.sequence([
      // logo pops in with a spring scale + opacity fade
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }), // then text fades in
      Animated.delay(800), // hold for a moment before exiting
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }), // fade out entire splash
    ]).start(() => onAnimDone()); // notify parent when done
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <View style={styles.logoBg}>
          <Image
            source={require('../../assets/dakarlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.textRow, { opacity: textOpacity }]}>
        <Text style={styles.title}>JOJ Dakar 2026</Text>
        <Text style={styles.subtitle}>Jeux de la Francophonie</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // covers everything underneath
    backgroundColor: '#050A18',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // always on top
  },
  logoBg: {
    width: width * 0.45, // 45% of screen width
    height: width * 0.45,
    borderRadius: width * 0.12, // rounded square
    backgroundColor: '#FFFFFF', // white bg so logo reads on dark screen
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)', // muted so it doesn't compete with title
    fontSize: 13,
    fontWeight: '400',
    marginTop: 6,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
