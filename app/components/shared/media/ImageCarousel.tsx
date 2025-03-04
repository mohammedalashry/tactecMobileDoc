// components/shared/media/ImageCarousel.tsx
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {color} from 'theme';
import {padding, margin} from 'theme/spacing';
import {typography} from 'theme/typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import I18n from 'i18n-js';

export interface ImageObject {
  url: string;
  description?: string;
}

interface ImageCarouselProps {
  images: ImageObject[];
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  editable?: boolean;
  onDescriptionChange?: (index: number, description: string) => void;
}

interface RenderItemProps {
  item: ImageObject;
  index: number;
}

const {width: screenWidth} = Dimensions.get('window');

export const ImageCarousel = ({
  images,
  activeSlide,
  setActiveSlide,
  editable = false,
  onDescriptionChange,
}: ImageCarouselProps) => {
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');

  if (!images || images.length === 0) {
    return null;
  }

  const startEditing = (description: string = '') => {
    setTempDescription(description);
    setEditingDescription(true);
  };

  const saveDescription = () => {
    if (onDescriptionChange) {
      onDescriptionChange(activeSlide, tempDescription);
    }
    setEditingDescription(false);
  };

  const cancelEditing = () => {
    setEditingDescription(false);
  };

  const renderItem = ({item, index}: RenderItemProps) => {
    const isActive = index === activeSlide;
    const showEditControls = editable && isActive;

    return (
      <View style={styles.slide}>
        <Image
          source={{uri: item.url}}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.descriptionContainer}>
          {editingDescription && isActive ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.descriptionInput}
                value={tempDescription}
                onChangeText={setTempDescription}
                placeholder={I18n.t('common.addDescription')}
                placeholderTextColor={color.placeholder}
                multiline
                autoFocus
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  onPress={cancelEditing}
                  style={styles.editButton}>
                  <Icon name="close" size={24} color={color.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveDescription}
                  style={styles.editButton}>
                  <Icon name="check" size={24} color={color.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : showEditControls ? (
                <Text style={styles.noDescription}>
                  {I18n.t('common.noDescription')}
                </Text>
              ) : null}

              {showEditControls && !editingDescription && (
                <TouchableOpacity
                  onPress={() => startEditing(item.description)}
                  style={styles.editIconContainer}>
                  <Icon
                    name={item.description ? 'edit' : 'add'}
                    size={20}
                    color={color.primary}
                  />
                  <Text style={styles.editText}>
                    {item.description
                      ? I18n.t('common.edit')
                      : I18n.t('common.addDescription')}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={images}
        renderItem={renderItem}
        sliderWidth={screenWidth - padding.large * 2}
        itemWidth={screenWidth - padding.large * 2}
        onSnapToItem={index => setActiveSlide(index)}
        activeSlideAlignment="center"
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
        vertical={false}
        layout={'default'}
        useScrollView={true}
      />
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.inactivePaginationDot}
        inactiveDotOpacity={0.6}
        inactiveDotScale={0.8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slide: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  descriptionContainer: {
    width: '100%',
    minHeight: 60,
    paddingHorizontal: padding.small,
    paddingVertical: padding.small,
    marginTop: margin.small,
  },
  description: {
    color: color.text,
    fontSize: 14,
    fontFamily: typography.primary,
    textAlign: 'center',
  },
  noDescription: {
    color: color.placeholder,
    fontSize: 14,
    fontFamily: typography.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  editIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: margin.small,
  },
  editText: {
    color: color.primary,
    fontSize: 14,
    fontFamily: typography.primary,
    marginLeft: margin.tiny,
  },
  editContainer: {
    width: '100%',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 8,
    padding: padding.small,
    color: color.text,
    backgroundColor: color.primarybg,
    textAlignVertical: 'top',
    minHeight: 80,
    fontFamily: typography.primary,
    fontSize: 14,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: margin.small,
  },
  editButton: {
    padding: padding.small,
    marginLeft: margin.small,
  },
  paginationContainer: {
    paddingVertical: padding.small,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.primary,
    marginHorizontal: margin.tiny,
  },
  inactivePaginationDot: {
    backgroundColor: color.border,
  },
});
