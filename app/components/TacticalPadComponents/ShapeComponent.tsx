import React, {useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
const ShapeComponent = ({
  shape,
  index,
  deleteShape,
  isEraseMode,
  toolImage,
  selectedMode,
}) => {
  const translateX = useSharedValue(shape?.x ?? 50);
  const translateY = useSharedValue(shape?.y ?? 50);
  const scale = useSharedValue(shape?.scale ?? 1);
  const rotation = useSharedValue(shape?.rotation ?? 0);

  const initialSize = useSharedValue({width: 40, height: 40});
  const [absoluteY, setAbsoluteY] = useState(0);
  // Pan Gesture
  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    },
  });

  // Pinch Gesture
  const pinchGesture = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      runOnJS(setAbsoluteY)(event.absoluteY);
    },
    onActive: (event: any) => {
      const diagonalTranslation = Math.sqrt(
        Math.pow(event.translationX, 2) + Math.pow(event.translationY, 2),
      );
      const shapeDiagonal = Math.sqrt(
        Math.pow(initialSize.value.width, 2) +
          Math.pow(initialSize.value.height, 2),
      );
      const newDiagonal =
        event.absoluteY > absoluteY
          ? diagonalTranslation + shapeDiagonal
          : shapeDiagonal - diagonalTranslation;
      const diagonalScale = newDiagonal / shapeDiagonal;
      if (diagonalScale < 2 && diagonalScale > 0.25) {
        scale.value = diagonalScale;
      } else if (diagonalScale > 2) {
        scale.value = 2;
      } else {
        scale.value = 0.25;
      }
      initialSize.value = {width: 40 * scale.value, height: 40 * scale.value};
    },
    onEnd: () => {
      scale.value = withSpring(scale.value);
      runOnJS(setAbsoluteY)(0);
    },
  });

  const rotationGesture = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event: any, ctx) => {
      const angle = Math.tan(event.translationY / event.translationX);
      rotation.value = shape.rotation + angle / 2;
    },
    onEnd: () => {
      rotation.value = withSpring(rotation.value);
    },
  });

  // Animated Style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
        {rotate: `${rotation.value}rad`},
      ],
    };
  });
  const animatedStyleIcon = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });
  return !isEraseMode ? (
    <Animated.View>
      <PanGestureHandler onGestureEvent={rotationGesture}>
        <Animated.View
          style={[animatedStyleIcon, styles.icon, {bottom: 0, left: 0}]}>
          <Icon name="rotate-right" size={15} />
        </Animated.View>
      </PanGestureHandler>

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.shape, animatedStyle]}>
          <Image source={toolImage} style={styles.image} />
        </Animated.View>
      </PanGestureHandler>
      <PanGestureHandler onGestureEvent={pinchGesture}>
        <Animated.View
          style={[animatedStyleIcon, styles.icon, {top: 40, left: 25}]}>
          <Icon
            name="expand"
            size={15}
            style={{transform: [{rotateX: '180deg'}]}}
          />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  ) : (
    <Animated.View>
      <Animated.View
        style={[styles.shape, animatedStyle]}
        onTouchStart={() => {
          deleteShape(index);
        }}>
        <Image source={toolImage} style={styles.image} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shape: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transformOrigin: 'bottom',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  icon: {
    zIndex: 15,
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 5,
  },
});

export default ShapeComponent;
