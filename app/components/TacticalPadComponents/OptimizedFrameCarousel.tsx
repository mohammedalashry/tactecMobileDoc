// components/TacticalPadComponents/OptimizedFrameCarousel.tsx
import React, {memo, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import {color} from 'theme/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface FrameCarouselProps {
  frames: string[];
  onDeleteFrame: (index: number) => void;
  isDeleteFrame: boolean;
  onFrameSelect?: (index: number) => void;
  selectedFrame?: number;
}

/**
 * Optimized carousel component for displaying captured frames
 * Uses FlatList for efficient rendering of large numbers of frames
 */
const OptimizedFrameCarousel: React.FC<FrameCarouselProps> = ({
  frames,
  onDeleteFrame,
  isDeleteFrame,
  onFrameSelect,
  selectedFrame = -1,
}) => {
  // Calculate optimal frame dimensions based on screen size
  const screenWidth = Dimensions.get('window').width;
  const FRAME_WIDTH = Math.min(80, screenWidth * 0.15);
  const FRAME_HEIGHT = FRAME_WIDTH * 0.75;

  // For empty state animation
  const emptyOpacity = useSharedValue(frames.length === 0 ? 1 : 0);

  // Update empty state opacity when frames change
  React.useEffect(() => {
    emptyOpacity.value = withTiming(frames.length === 0 ? 1 : 0, {
      duration: 300,
    });
  }, [frames.length]);

  // Memoize render function for optimal performance
  const renderFrame = useCallback(
    ({item, index}) => {
      const isSelected = index === selectedFrame;
      const scale = useSharedValue(1);

      // Spring animation when selected
      React.useEffect(() => {
        scale.value = withSpring(isSelected ? 1.1 : 1);
      }, [isSelected]);

      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
        borderColor: isSelected ? '#3498db' : 'transparent',
      }));

      return (
        <Animated.View style={[styles.frameContainer, animatedStyle]}>
          <TouchableOpacity
            onPress={() => onFrameSelect && onFrameSelect(index)}
            activeOpacity={0.7}>
            <Image
              source={{uri: item}}
              style={[
                styles.frameImage,
                {width: FRAME_WIDTH, height: FRAME_HEIGHT},
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {isDeleteFrame && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteFrame(index)}>
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    },
    [
      isDeleteFrame,
      selectedFrame,
      onDeleteFrame,
      onFrameSelect,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    ],
  );

  // Create key extractor for FlatList
  const keyExtractor = useCallback((_, index) => `frame-${index}`, []);

  // Empty state animation style
  const emptyStateStyle = useAnimatedStyle(() => ({
    opacity: emptyOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {frames.length > 0 ? (
        <FlatList
          data={frames}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderFrame}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={3}
        />
      ) : (
        <Animated.View style={[styles.emptyState, emptyStateStyle]}>
          <Text style={styles.emptyText}>No frames captured yet</Text>
          <Text style={styles.emptySubtext}>
            Use the Add Frame button to capture the current field state
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '15%',
    backgroundColor: color.black,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  frameContainer: {
    marginHorizontal: 5,
    position: 'relative',
    backgroundColor: color.background,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frameImage: {
    borderRadius: 3,
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: color.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    color: color.line,
    fontSize: 12,
    textAlign: 'center',
  },
});

// Use memo to prevent unnecessary re-renders
export default memo(OptimizedFrameCarousel);
