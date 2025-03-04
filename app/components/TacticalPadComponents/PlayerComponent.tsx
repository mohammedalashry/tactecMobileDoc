import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface PlayerComponentProps {
  player: {
    id: number;
    shirtNumber: number;
    team: string;
    x: number;
    y: number;
  };
}

const PlayerComponent: React.FC<PlayerComponentProps> = ({player}) => {
  const translateX = useSharedValue(player.x);
  const translateY = useSharedValue(player.y);

  const panGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startX: number; startY: number}
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {},
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.View
        style={[
          styles.player,
          animatedStyle,
          {backgroundColor: player.team === 'home' ? 'red' : 'yellow'},
        ]}>
        <Text style={styles.playerNumber}>{player.shirtNumber}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumber: {
    fontWeight: 'bold',
  },
});

export default PlayerComponent;
