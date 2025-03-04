import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { color } from "theme";
import { StoryScreen } from "storybook/views";
import { Button } from "components/shared";
import I18n from "i18n-js";
import Assign from "@assets/images/tactec/Assign.png";
import { Alert } from "components/shared/alerts/Alert";
import { useTacticalNewProject } from "hooks/tactical/projects/useTacticalNewProject";

// Import the shared components
import { EventTypeSelector } from "components/shared/project/EventTypeSelector";
import { LeagueSelector } from "components/shared/project/LeagueSelector";
import { TitleInput } from "components/shared/project/TitleInput";
import { ImageCarousel } from "components/shared/media/ImageCarousel";
import { DateTimePicker } from "components/shared/date-time/DateTimePicker";

const NewProjectScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();

  const {
    eventType,
    setEventType,
    leagueData,
    selectedLeague,
    setSelectedLeague,
    title,
    setTitle,
    images,
    setImages,
    dateTimeValues,
    setDateTimeValues,
    activeSlide,
    setActiveSlide,
    uploadModalVisible,
    setUploadModalVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    compressionVisible,
    compressionProgress,
    isLoading,
    isSubmitting,
    errorMessage,
    handleImageUpload,
    handleDeleteImage,
    handleImageDescriptionChange,
    handleCancel,
    handleSubmit,
    handleOpenTacticalPad,
    handleAssign,
  } = useTacticalNewProject(route, navigation);

  return (
    <View style={styles.container}>
      <StoryScreen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Event Type Selector */}
          <EventTypeSelector
            selectedType={eventType}
            onTypeChange={setEventType}
          />

          {/* League Selector or Title Input based on event type */}
          {eventType === I18n.t("Tactec.Match") ? (
            <LeagueSelector
              leagues={leagueData}
              selectedLeague={selectedLeague}
              onLeagueChange={setSelectedLeague}
            />
          ) : (
            <TitleInput
              value={title}
              onChangeText={setTitle}
              placeholder={I18n.t(`Tactec.${eventType}Title`)}
            />
          )}

          {/* Image Carousel */}
          {images.length > 0 && (
            <ImageCarousel
              images={images}
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
              editable={true}
              onDescriptionChange={handleImageDescriptionChange}
            />
          )}

          {/* Image Actions */}
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setDeleteModalVisible(true)}
              disabled={images.length === 0}
            >
              <Text
                style={[
                  styles.actionText,
                  images.length === 0 && styles.disabledText,
                ]}
              >
                {I18n.t("common.deleteImage")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setUploadModalVisible(true)}
            >
              <Text style={styles.actionText}>
                {I18n.t("common.uploadImage")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tactical Pad Button */}
          <TouchableOpacity
            onPress={handleOpenTacticalPad}
            style={styles.tacticalPadButton}
          >
            <Text style={styles.tacticalPadText}>
              {I18n.t("Tactec.OpenFormationMaker")}
            </Text>
          </TouchableOpacity>

          {/* Date Time Picker */}
          <DateTimePicker
            dateValue={{
              day: dateTimeValues.day,
              month: dateTimeValues.month,
              year: dateTimeValues.year,
            }}
            timeValue={{
              hours: dateTimeValues.hours,
              minutes: dateTimeValues.minutes,
              ampm: dateTimeValues.ampm,
            }}
            onDateChange={(field, value) =>
              setDateTimeValues((prev) => ({ ...prev, [field]: value }))
            }
            onTimeChange={(field, value) =>
              setDateTimeValues((prev) => ({ ...prev, [field]: value }))
            }
          />

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            {eventType !== I18n.t("Tactec.Match") && (
              <TouchableOpacity
                style={styles.assignButton}
                onPress={handleAssign}
                disabled={isSubmitting}
              >
                <Image source={Assign} style={styles.assignIcon} />
                <Text style={styles.assignText}>
                  {I18n.t("Tactec.AssignTo")}
                </Text>
              </TouchableOpacity>
            )}

            <Button
              text={I18n.t("common.confirm")}
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelText}>{I18n.t("common.cancel")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </StoryScreen>

      {/* Upload Image Alert/Modal */}
      <Alert
        isVisible={uploadModalVisible}
        title={I18n.t("common.uploadImage")}
        message={I18n.t("common.selectImageToUpload")}
        primaryButtonText={I18n.t("common.upload")}
        secondaryButtonText={I18n.t("common.cancel")}
        onPrimaryAction={handleImageUpload}
        onSecondaryAction={() => setUploadModalVisible(false)}
        onDismiss={() => setUploadModalVisible(false)}
        type="default"
      />

      {/* Delete Image Alert/Modal */}
      <Alert
        isVisible={deleteModalVisible}
        title={I18n.t("common.deleteImage")}
        message={I18n.t("common.deleteImageConfirmation")}
        primaryButtonText={I18n.t("common.delete")}
        secondaryButtonText={I18n.t("common.cancel")}
        onPrimaryAction={handleDeleteImage}
        onSecondaryAction={() => setDeleteModalVisible(false)}
        onDismiss={() => setDeleteModalVisible(false)}
        type="warning"
      />

      {/* Compression Progress Alert */}
      <Alert
        isVisible={compressionVisible}
        title={I18n.t("common.processingImage")}
        message={I18n.t("common.optimizingImageForUpload")}
        primaryButtonText=""
        secondaryButtonText=""
        onDismiss={() => {}}
        type="default"
      >
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${compressionProgress * 100}%` },
            ]}
          />
          <Text style={styles.progressText}>
            {`${Math.round(compressionProgress * 100)}%`}
          </Text>
        </View>
      </Alert>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primarybg,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: color.blackbg,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: color.line,
    borderWidth: 1,
    minWidth: 120,
    alignItems: "center",
  },
  actionText: {
    color: color.text,
    fontSize: 14,
    fontWeight: "500",
  },
  disabledText: {
    color: color.line,
  },
  tacticalPadButton: {
    backgroundColor: color.black,
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  tacticalPadText: {
    fontSize: 14,
    fontWeight: "700",
    color: color.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  submitButton: {
    width: 130,
    height: 46,
    borderRadius: 23,
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.blackbg,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 20,
    borderColor: color.line,
    borderWidth: 1,
  },
  assignIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  assignText: {
    fontSize: 14,
    color: color.text,
    fontWeight: "500",
  },
  cancelButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: color.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    height: 20,
    backgroundColor: color.blackbg,
    borderRadius: 10,
    marginTop: 16,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: color.primary,
    borderRadius: 10,
  },
  progressText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: "center",
    lineHeight: 20,
    color: color.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default NewProjectScreen;
