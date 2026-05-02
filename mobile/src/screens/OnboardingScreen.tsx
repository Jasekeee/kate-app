import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Spacing, FontSize } from "../theme";
import { ConnectButton } from "../components/connect-button/ConnectButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "welcome",
    title: "Welcome to Käte",
    subtitle: "Use Solana without SOL",
    description:
      "Käte lets you use any Solana app and pay transaction fees in USDC — no SOL required.",
    emoji: "👜",
    showButton: false,
  },
  {
    key: "connect",
    title: "Connect your wallet",
    subtitle: "No SOL needed. All fees in USDC.",
    description:
      "Connect your Seeker wallet via Mobile Wallet Adapter. Your keys stay secure in the Seed Vault.",
    emoji: "🔗",
    showButton: true,
  },
  {
    key: "gas",
    title: "Add USDC for gas",
    subtitle: "Charge your gas battery",
    description:
      "Deposit USDC once and use it to pay for all your Solana transactions. $1 USDC = ~4,000 transactions.",
    emoji: "⚡",
    showButton: false,
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("kate_onboarded", "true");
    navigation.replace("Dashboard");
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.key} style={styles.slide}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            {slide.showButton && (
              <View style={styles.connectWrapper}>
                <ConnectButton onConnected={goNext} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Bottom button */}
      {!slides[currentIndex].showButton && (
        <TouchableOpacity style={styles.button} onPress={goNext}>
          <Text style={styles.buttonText}>
            {isLast ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      )}

      {!isLast && (
        <TouchableOpacity style={styles.skipButton} onPress={finishOnboarding}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: 140,
  },
  emoji: {
    fontSize: 72,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.accent,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  connectWrapper: {
    marginTop: Spacing.xl,
    width: "100%",
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 14,
    marginBottom: Spacing.md,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  skipButton: {
    marginBottom: Spacing.xl,
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
