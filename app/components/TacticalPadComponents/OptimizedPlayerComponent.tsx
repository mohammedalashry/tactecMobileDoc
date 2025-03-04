// components/TacticalPadComponents/OptimizedPlayerComponent.tsx
import React, {memo} from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export interface PlayerProps {
  player: {
    id: string;
    shirtNumber?: number | string;
    team: 'home' | 'away';
    x: number;
    y: number;
    position: string;
  };
  onPlayerMove?: (id: string, x: number, y: number) => void;
  disabled?: boolean;
}

/**
 * Optimized player component for the tactical pad
 * Uses Reanimated for smooth animations and gesture handling
 */
const OptimizedPlayerComponent: React.FC<PlayerProps> = ({
  player,
  onPlayerMove,
  disabled = false,
}) => {
  // Use shared values for better performance
  const translateX = useSharedValue(player.x);
  const translateY = useSharedValue(player.y);
  const scale = useSharedValue(1);

  // Configure spring animations
  const springConfig = {
    damping: 15,
    stiffness: 100,
    mass: 0.5,
  };

  // Handle pan gesture with worklets for better performance
  const panGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startX: number; startY: number}
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
      scale.value = withSpring(1.2, springConfig);
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      scale.value = withSpring(1, springConfig);

      // Notify parent component of position change if callback is provided
      if (onPlayerMove) {
        onPlayerMove(player.id, translateX.value, translateY.value);
      }
    },
  });

  // Create animated style using worklet
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  // Determine player color based on team
  const getPlayerColor = () => {
    return player.team === 'home' ? '#e74c3c' : '#f1c40f';
  };

  // Determine text color for optimal contrast
  const getTextColor = () => {
    return player.team === 'home' ? '#fff' : '#000';
  };

  return (
    <PanGestureHandler onGestureEvent={panGesture} enabled={!disabled}>
      <Animated.View
        style={[
          styles.player,
          {backgroundColor: getPlayerColor()},
          animatedStyle,
        ]}>
        <Text style={[styles.playerNumber, {color: getTextColor()}]}>
          {player.shirtNumber || player.position}
        </Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  playerNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Use memo to prevent unnecessary re-renders
export default memo(OptimizedPlayerComponent, (prevProps, nextProps) => {
  // Only re-render if position or team changes
  return (
    prevProps.player.x === nextProps.player.x &&
    prevProps.player.y === nextProps.player.y &&
    prevProps.player.team === nextProps.player.team &&
    prevProps.player.shirtNumber === nextProps.player.shirtNumber &&
    prevProps.disabled === nextProps.disabled
  );
});
