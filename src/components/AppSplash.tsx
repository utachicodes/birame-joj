import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  onAnimDone: () => void;
}

export default function AppSplash({ onAnimDone }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
     
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => onAnimDone());
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050A18',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  logoBg: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.12,
    backgroundColor: '#FFFFFF',
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
