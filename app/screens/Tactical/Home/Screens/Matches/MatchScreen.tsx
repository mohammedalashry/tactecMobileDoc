// screens/Tactical/Home/Screens/Matches/MatchScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DetailScreen } from "components/shared/layout/DetailScreen";
import { color } from "theme";
import { ImageCarousel } from "components/shared/media/ImageCarousel";
import { ImageUploader } from "components/shared/media/ImageUploader";
import { DateTimePicker } from "components/shared/date-time/DateTimePicker";
import { Alert } from "components/shared/alerts/Alert";
import { useTacticalMatchDetail } from "hooks/tactical/matches/useTacticalMatchDetail";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatDate, formatTime } from "utils/dateTime";
import { TacticalRouteParams } from "navigation/types/route-params";

type MatchScreenProps = NativeStackScreenProps<
  TacticalRouteParams,
  "MatchScreen"
>;

/**
 * Match details screen for tactical role
 */
const MatchScreen = ({ route, navigation }: MatchScreenProps) => {
  const {
    match,
    isLoading,
    isEditing,
    canEdit,
    activeSlide,
    setActiveSlide,
    updatedImages,
    dateTimeValues,
    setDateTimeValues,
    isDeleteDialogVisible,
    setIsDeleteDialogVisible,
    isUpdateLoading,
    isDeleteLoading,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleCancel,
    handleImageUpdate,
  } = useTacticalMatchDetail(route, navigation);

  // Header right component for edit/save buttons
  const renderHeaderRight = () => {
    if (!canEdit) return null;

    if (isEditing) {
      return (
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleCancel}>
            <Text style={styles.headerButtonText}>
              {I18n.t("common.cancel")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.saveButton]}
            onPress={handleUpdate}
            disabled={isUpdateLoading}
          >
            {isUpdateLoading ? (
              <ActivityIndicator size="small" color={color.text} />
            ) : (
              <Text style={styles.headerButtonText}>
                {I18n.t("common.save")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <MaterialIcons name="edit" size={24} color={color.text} />
      </TouchableOpacity>
    );
  };

  // Handle date and time changes
  const handleDateChange = (field: string, value: string) => {
    setDateTimeValues({
      ...dateTimeValues,
      [field]: value,
    });
  };

  const handleTimeChange = (field: string, value: string) => {
    setDateTimeValues({
      ...dateTimeValues,
      [field]: value,
    });
  };

  return (
    <DetailScreen
      title={match?.title || I18n.t("match.details")}
      loading={isLoading}
      headerRight={renderHeaderRight()}
    >
      {match && (
        <ScrollView>
          {/* Date and Time */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {I18n.t("common.dateTime")}
              </Text>
            </View>
            {isEditing ? (
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
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
              />
            ) : (
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>
                  {formatDate(match.date)} - {formatTime(match.date)}
                </Text>
              </View>
            )}
          </View>

          {/* Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {I18n.t("common.details")}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              {match.opponent && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {I18n.t("match.opponent")}:
                  </Text>
                  <Text style={styles.detailValue}>{match.opponent}</Text>
                </View>
              )}

              {match.venue && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {I18n.t("match.venue")}:
                  </Text>
                  <Text style={styles.detailValue}>{match.venue}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Images */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{I18n.t("common.images")}</Text>
            </View>

            {updatedImages && updatedImages.length > 0 ? (
              <ImageCarousel
                images={updatedImages}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                editable={isEditing}
                onDescriptionChange={handleImageUpdate}
              />
            ) : (
              <View style={styles.noImagesContainer}>
                <Text style={styles.noImagesText}>
                  {I18n.t("common.noImages")}
                </Text>
              </View>
            )}

            {isEditing && (
              <View style={styles.uploadContainer}>
                <Text style={styles.uploadTitle}>
                  {I18n.t("common.addNewImage")}
                </Text>
                <ImageUploader
                  onImageSelected={() => {}}
                  placeholder={
                    <View style={styles.uploadPlaceholder}>
                      <MaterialIcons
                        name="add-photo-alternate"
                        size={32}
                        color={color.text}
                      />
                      <Text style={styles.uploadText}>
                        {I18n.t("common.uploadImage")}
                      </Text>
                    </View>
                  }
                />
              </View>
            )}
          </View>

          {/* Delete Button (when editing) */}
          {isEditing && canEdit && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setIsDeleteDialogVisible(true)}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <ActivityIndicator size="small" color={color.text} />
              ) : (
                <>
                  <MaterialIcons
                    name="delete"
                    size={18}
                    color={color.text}
                    style={styles.deleteIcon}
                  />
                  <Text style={styles.deleteButtonText}>
                    {I18n.t("common.delete")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Delete Confirmation Dialog */}
          <Alert
            isVisible={isDeleteDialogVisible}
            title={I18n.t("match.deleteMatch")}
            message={I18n.t("match.deleteConfirmation")}
            primaryButtonText={I18n.t("common.delete")}
            secondaryButtonText={I18n.t("common.cancel")}
            onPrimaryAction={handleDelete}
            onSecondaryAction={() => setIsDeleteDialogVisible(false)}
            onDismiss={() => setIsDeleteDialogVisible(false)}
            type="error"
          />
        </ScrollView>
      )}
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: color.blackbg,
  },
  saveButton: {
    backgroundColor: color.primary,
  },
  headerButtonText: {
    color: color.text,
    fontWeight: "500",
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.primary,
  },
  dateTimeContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: color.blackbg,
    borderRadius: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: color.text,
  },
  detailsContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: color.primary,
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: color.text,
  },
  noImagesContainer: {
    height: 150,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noImagesText: {
    color: color.primaryLight,
    fontSize: 14,
    fontStyle: "italic",
  },
  uploadContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  uploadTitle: {
    color: color.text,
    fontSize: 14,
    marginBottom: 8,
  },
  uploadPlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.border,
    borderStyle: "dashed",
  },
  uploadText: {
    color: color.text,
    fontSize: 14,
    marginTop: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.blackbg,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 24,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    color: "red",
    fontSize: 16,
  },
});

export default MatchScreen;
