import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Colors } from "@/constants";

interface SkeletonPulseProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  marginBottom?: number;
}

/**
 * Animated skeleton placeholder that pulses between
 * two opacity values. Used as a loading indicator.
 */
export function SkeletonPulse({
  width,
  height,
  borderRadius = 8,
  marginBottom = 0,
}: SkeletonPulseProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        opacity,
        width: width as any,
        height,
        borderRadius,
        backgroundColor: Colors.border,
        marginBottom,
      }}
    />
  );
}
