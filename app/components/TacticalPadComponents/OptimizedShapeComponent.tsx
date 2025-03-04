// components/TacticalPadComponents/OptimizedShapeComponent.tsx
import React, {memo, useEffect} from 'react';
import {Image, StyleSheet, ImageSourcePropType} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ShapeProps {
  shape: {
    id: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    counterId: number;
  };
  toolImage: ImageSourcePropType;
  isEraseMode: boolean;
  deleteShape: (id: number) => void;
  selectedMode: 'draw' | 'erase' | 'move' | 'none';
  updateShape?: (
    id: number,
    x: number,
    y: number,
    scale: number,
    rotation: number,
  ) => void;
}

/**
 * Optimized shape component for tactical tools
 * Handles translation, scaling, and rotation with gesture handlers
 */
const OptimizedShapeComponent: React.FC<ShapeProps> = ({
  shape,
  toolImage,
  isEraseMode,
  deleteShape,
  selectedMode,
  updateShape,
}) => {
  // Use shared values for better performance
  const translateX = useSharedValue(shape.x);
  const translateY = useSharedValue(shape.y);
  const scale = useSharedValue(shape.scaleX);
  const rotation = useSharedValue(shape.rotation);
  const opacity = useSharedValue(1);

  // Update values if shape props change
  useEffect(() => {
    translateX.value = shape.x;
    translateY.value = shape.y;
    scale.value = shape.scaleX;
    rotation.value = shape.rotation;
  }, [shape.x, shape.y, shape.scaleX, shape.rotation]);

  // Handle erase mode changes
  useEffect(() => {
    opacity.value = withSpring(isEraseMode ? 0.6 : 1);
  }, [isEraseMode]);

  // Configure spring animations
  const springConfig = {
    damping: 15,
    stiffness: 100,
    mass: 0.5,
  };

  // Pan gesture handler for moving shapes
  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      if (selectedMode === 'move' || selectedMode === 'none') {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;
      }
    },
    onEnd: () => {
      if (updateShape && (selectedMode === 'move' || selectedMode === 'none')) {
        runOnJS(updateShape)(
          shape.counterId,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value,
        );
      }
    },
  });

  // Pinch gesture handler for scaling shapes
  const pinchGesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      if (selectedMode === 'move' || selectedMode === 'none') {
        const newScale = ctx.startScale * event.scale;
        // Limit scaling between reasonable bounds
        if (newScale > 0.25 && newScale < 3) {
          scale.value = newScale;
        }
      }
    },
    onEnd: () => {
      if (updateShape && (selectedMode === 'move' || selectedMode === 'none')) {
        runOnJS(updateShape)(
          shape.counterId,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value,
        );
      }
    },
  });

  // Rotation gesture handler
  const rotationGesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      if (selectedMode === 'move' || selectedMode === 'none') {
        rotation.value = ctx.startRotation + event.rotation;
      }
    },
    onEnd: () => {
      if (updateShape && (selectedMode === 'move' || selectedMode === 'none')) {
        runOnJS(updateShape)(
          shape.counterId,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value,
        );
      }
    },
  });

  // Create animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
        {rotate: `${rotation.value}rad`},
      ],
      opacity: opacity.value,
    };
  });

  // Handle shape tap in erase mode
  const handleShapePress = () => {
    if (isEraseMode) {
      deleteShape(shape.counterId);
    }
  };

  // If in erase mode, only show shape without controls
  if (isEraseMode) {
    return (
      <Animated.View
        style={[styles.shape, animatedStyle]}
        onTouchStart={handleShapePress}>
        <Image source={toolImage} style={styles.image} />
      </Animated.View>
    );
  }

  // In normal mode, show shape with gesture handlers
  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={styles.container}>
          <PinchGestureHandler onGestureEvent={pinchGesture}>
            <Animated.View style={styles.container}>
              <RotationGestureHandler onGestureEvent={rotationGesture}>
                <Animated.View style={[styles.shape, animatedStyle]}>
                  <Image source={toolImage} style={styles.image} />
                </Animated.View>
              </RotationGestureHandler>
            </Animated.View>
          </PinchGestureHandler>

          {/* Control handles - only show when in move mode or default mode */}
          {(selectedMode === 'move' || selectedMode === 'none') && (
            <>
              {/* Scale handle */}
              <Animated.View
                style={[
                  animatedStyle,
                  styles.controlHandle,
                  {right: -10, bottom: -10},
                ]}>
                <Icon name="expand" size={12} color="#fff" />
              </Animated.View>

              {/* Rotation handle */}
              <Animated.View
                style={[
                  animatedStyle,
                  styles.controlHandle,
                  {left: -10, bottom: -10},
                ]}>
                <Icon name="rotate-right" size={12} color="#fff" />
              </Animated.View>
            </>
          )}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  shape: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  controlHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
});

// Use memo to prevent unnecessary re-renders
export default memo(OptimizedShapeComponent, (prevProps, nextProps) => {
  return (
    prevProps.shape.x === nextProps.shape.x &&
    prevProps.shape.y === nextProps.shape.y &&
    prevProps.shape.scaleX === nextProps.shape.scaleX &&
    prevProps.shape.rotation === nextProps.shape.rotation &&
    prevProps.isEraseMode === nextProps.isEraseMode &&
    prevProps.selectedMode === nextProps.selectedMode
  );
});
