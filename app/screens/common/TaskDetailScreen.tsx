// screens/common/TaskDetailScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { DetailScreen } from "../../components/shared/layout/DetailScreen";
import { DateTimePicker } from "../../components/shared/date-time/DateTimePicker";
import { ImageUploader } from "../../components/shared/media/ImageUploader";
import { FormField } from "../../components/shared/forms/FormField";
import { Button } from "../../components/shared";
import { color, padding, palette, margin } from "theme";
import I18n from "i18n-js";
import { Alert } from "../../components/shared/alerts/Alert";
import { parseFormDateTime } from "../../utils/dateTime";
import { ImageCarousel } from "components/shared/media/ImageCarousel";

interface TaskDetailScreenProps {
  task: any;
  isLoading: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (taskData: any) => void;
  onDelete: () => void;
  onAssign: () => void;
  onImageUpload: (image: any) => void;
  onUpdateImages: (index: number, desc: string) => void;
  formValues: any;
  handleChange: (field: string, value: string) => void;
  handleDateChange: (field: string, value: string) => void;
  handleTimeChange: (field: string, value: string) => void;
  errors: any;
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  isDeleteDialogVisible: boolean;
  setDeleteDialogVisible: (visible: boolean) => void;
  userRole: string;
}

export const TaskDetailScreen = ({
  task,
  isLoading,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onAssign,
  onImageUpload,
  onUpdateImages,
  formValues,
  handleChange,
  handleDateChange,
  handleTimeChange,
  errors,
  activeSlide,
  setActiveSlide,
  isDeleteDialogVisible,
  setDeleteDialogVisible,
  userRole,
}: TaskDetailScreenProps) => {
  const canEdit = ["tactical", "management", "medical"].includes(userRole);
  const canAssign = ["tactical", "management", "medical"].includes(userRole);

  const headerRight = canEdit ? (
    <View style={styles.headerButtons}>
      <Button
        text={isEditing ? I18n.t("common.cancel") : I18n.t("common.edit")}
        onPress={isEditing ? () => onEdit() : () => onEdit()}
        preset="small"
      />
      {!isEditing && (
        <Button
          text={I18n.t("common.delete")}
          onPress={() => setDeleteDialogVisible(true)}
          preset="small"
          style={styles.deleteButton}
        />
      )}
    </View>
  ) : undefined;

  const handleSave = () => {
    try {
      // Validate and prepare form data
      const date = parseFormDateTime(
        formValues.day,
        formValues.month,
        formValues.year,
        formValues.hours,
        formValues.minutes,
        formValues.ampm
      );

      const updatedTask = {
        ...task,
        title: formValues.title,
        date,
        images: task.images.map((img, index) => ({
          url: img.url,
          description: img.description,
        })),
      };

      onSave(updatedTask);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <DetailScreen
      title={task?.title || I18n.t("tasks.taskDetails")}
      loading={isLoading}
      headerRight={headerRight}
    >
      <View style={styles.container}>
        {isEditing ? (
          <FormField
            label={I18n.t("tasks.title")}
            value={formValues.title}
            onChangeText={(text) => handleChange("title", text)}
            placeholder={I18n.t("tasks.titlePlaceholder")}
            error={errors.title}
            touched={true}
          />
        ) : (
          <View style={styles.spacer} />
        )}

        {task?.images?.length > 0 && (
          <View style={styles.imageContainer}>
            {isEditing ? (
              <ImageUploader
                imageUrl={task.images[activeSlide]?.url}
                onImageSelected={(image) => {
                  /* Handle image selection */
                }}
                description={task.images[activeSlide]?.description}
                onDescriptionChange={(text) =>
                  onUpdateImages(activeSlide, text)
                }
                showDescription={true}
                imageHeight={200}
                imageWidth={300}
              />
            ) : (
              <ImageCarousel
                images={task.images}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                editable={false}
              />
            )}
          </View>
        )}

        {isEditing && (
          <View style={styles.uploadContainer}>
            <Button
              text={I18n.t("common.uploadImage")}
              onPress={() => onImageUpload(null)}
              preset="secondary"
            />
          </View>
        )}

        {isEditing && (
          <DateTimePicker
            dateValue={{
              day: formValues.day,
              month: formValues.month,
              year: formValues.year,
            }}
            timeValue={{
              hours: formValues.hours,
              minutes: formValues.minutes,
              ampm: formValues.ampm,
            }}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
        )}

        {isEditing && (
          <Button
            text={I18n.t("common.save")}
            onPress={handleSave}
            style={styles.saveButton}
          />
        )}

        {canAssign && !isEditing && (
          <Button
            text={I18n.t("tasks.assignTo")}
            onPress={onAssign}
            style={styles.assignButton}
          />
        )}

        <Alert
          isVisible={isDeleteDialogVisible}
          title={I18n.t("tasks.deleteTask")}
          message={I18n.t("tasks.deleteTaskConfirmation")}
          primaryButtonText={I18n.t("common.delete")}
          secondaryButtonText={I18n.t("common.cancel")}
          onPrimaryAction={onDelete}
          onSecondaryAction={() => setDeleteDialogVisible(false)}
          onDismiss={() => setDeleteDialogVisible(false)}
          type="warning"
        />
      </View>
    </DetailScreen>
  );
};
// screens/common/TaskDetailScreen.tsx (updated styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  headerButtons: {
    flexDirection: "row",
  },
  deleteButton: {
    marginLeft: margin.small,
    backgroundColor: palette.angry,
  },
  spacer: {
    height: margin.base,
  },
  imageContainer: {
    marginVertical: margin.base,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.uploadImgbg,
  },
  uploadContainer: {
    alignItems: "center",
    marginVertical: margin.base,
  },
  saveButton: {
    marginTop: margin.large,
    alignSelf: "center",
    backgroundColor: color.primary,
  },
  assignButton: {
    position: "absolute",
    bottom: padding.large,
    right: padding.large,
    height: 48,
    width: 120,
    borderRadius: 24,
    backgroundColor: color.primary,
  },
});
