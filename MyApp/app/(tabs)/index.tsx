import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const glow  = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] });

  return (
    <View style={styles.root}>
      {/* Gradient background */}
      <LinearGradient
        colors={['#0f1021', '#1f2a44', '#4f46e5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Shooting stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ShootingStar key={i} delay={i * 1500} />
      ))}

      {/* Floating sparkles */}
      {Array.from({ length: 15 }).map((_, i) => (
      <Sparkle
        key={i}
        top={Math.random() * height}       // anywhere vertically
        left={Math.random() * width}       // anywhere horizontally
        size={Math.floor(Math.random() * 4) + 3} // random size 3–6  // random speed 2–4s
      
      />
))}

      <SafeAreaView style={styles.safe}>
        {/* Center Card */}
        <Animated.View style={[styles.cardWrap, { transform: [{ scale }] }]}>
          <BlurView intensity={75} tint="dark" style={styles.card}>
            <Text style={styles.kicker}>WELCOME TO</Text>
            <Text style={styles.title}>JustPlan</Text>
            <Text style={styles.subtitle}>
              Map ideas. Connect works. Visualize your creative journey.
            </Text>

            {/* Glowing effect under button */}
            <Animated.View style={{ opacity: glow }}>
              <LinearGradient
                colors={['#a78bfa', '#60a5fa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGlow}
              />
            </Animated.View>

            {/* Start button */}
            <Link href="../(tabs)/landpage" asChild>
              <Pressable style={({ pressed }) => [
                styles.startBtn,
                pressed && { transform: [{ scale: 0.98 }] }
              ]}>
                <Text style={styles.startTxt}>Start</Text>
              </Pressable>
            </Link>

            {/* Credits */}
            <Text style={styles.credits}>made by Kazu, Steven, Gabriel, Safywan</Text>
          </BlurView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

/* ========== Shooting Star Component ========== */
function ShootingStar({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      anim.setValue(0);
      Animated.sequence([
        Animated.delay(delay), // wait before starting
        Animated.timing(anim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
      ]).start(() => loop());
    };
    loop();
  }, [anim, delay]);

  const randomXStart = useRef(-Math.random() * 800 - 200).current;  // -200 to -1000
  const randomXEnd   = useRef(width + Math.random() * 300).current; // width to width+300

  const randomYStart = useRef(-Math.random() * 600 - 100).current;  // -100 to -700
  const randomYEnd   = useRef(height + Math.random() * 300).current;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [randomXStart, randomXEnd],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [randomYStart, randomYEnd],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.1, 0.8, 1],
    outputRange: [0, 1, 0.4, 0],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 80,
        height: 2,
        backgroundColor: 'white',
        opacity,
        transform: [
          { translateX },
          { translateY },
          { rotateZ: '30deg' },
        ],
        shadowColor: '#fff',
        shadowOpacity: 0.8,
        shadowRadius: 4,
      }}
    />
  );
}

/* ========== Sparkle Component ========== */
function Sparkle({ top, left, size }: { top: number; left: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2800, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.9] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ffffff',
        transform: [{ translateY }],
        opacity,
        shadowColor: '#fff',
        shadowOpacity: 0.9,
        shadowRadius: 6,
      }}
    />
  );
}

/* ========== Styles ========== */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f1021' },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  /* Center card */
  cardWrap: {
    width: Math.min(width - 40, 460),
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  card: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    alignItems: 'center',
    gap: 10,
  },
  kicker: {
    color: '#c7d2fe',
    letterSpacing: 2,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 6,
  },
  buttonGlow: {
    position: 'absolute',
    bottom: 92,
    left: 22,
    right: 22,
    height: 54,
    borderRadius: 14,
    opacity: 0.35,
    filter: 'blur(20px)' as any,
  },
  startBtn: {
    marginTop: 18,
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  startTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  credits: { color: 'rgba(255,255,255,0.7)', marginTop: 16, fontSize: 12 },
});
