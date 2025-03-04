import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { color } from "theme";
import { DetailScreen } from "components/shared/layout/DetailScreen";
import { ImageCarousel } from "components/shared/media/ImageCarousel";
import { DateTimePicker } from "components/shared/date-time/DateTimePicker";
import { Button } from "components/shared";
import { Alert } from "components/shared/alerts/Alert";
import I18n from "i18n-js";
import Assign from "@assets/images/tactec/Assign.png";
import { useTacticalTrainingDetail } from "hooks/tactical/trainings/useTacticalTrainingDetail";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TrainingScreen = ({ route, navigation }) => {
  const {
    training,
    isLoading,
    isEditing,
    canEdit,
    activeSlide,
    setActiveSlide,
    dateTimeValues,
    setDateTimeValues,
    isDeleteDialogVisible,
    setIsDeleteDialogVisible,
    showAssignConfirmation,
    setShowAssignConfirmation,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleCancel,
    handleImageUpdate,
    handleAssign,
    isUpdateLoading,
  } = useTacticalTrainingDetail(route, navigation);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Right header component with edit/delete buttons
  const headerRight = canEdit ? (
    <View style={styles.headerButtons}>
      <TouchableOpacity
        style={[
          styles.iconButton,
          { borderColor: isDeleteDialogVisible ? color.primary : color.text },
        ]}
        onPress={() => setIsDeleteDialogVisible(true)}
      >
        <MaterialCommunityIcons
          name="delete"
          size={25}
          color={isDeleteDialogVisible ? color.primary : color.text}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.iconButton,
          { borderColor: isEditing ? color.primary : color.text },
        ]}
        onPress={handleEdit}
      >
        <MaterialIcons
          name="edit"
          size={25}
          color={isEditing ? color.primary : color.text}
        />
      </TouchableOpacity>
    </View>
  ) : undefined;

  return (
    <DetailScreen
      title={training?.title || I18n.t("trainings.trainingDetails")}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      headerRight={headerRight}
      scrollable={true}
    >
      <View style={styles.container}>
        {training && (
          <>
            <Text style={styles.title}>{training.title}</Text>

            <ImageCarousel
              images={training.images || []}
              activeSlide={activeSlide}
              setActiveSlide={setActiveSlide}
              editable={isEditing}
              onDescriptionChange={handleImageUpdate}
            />

            {isEditing && (
              <>
                <View style={styles.editorContainer}>
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
                      setDateTimeValues({ ...dateTimeValues, [field]: value })
                    }
                    onTimeChange={(field, value) =>
                      setDateTimeValues({ ...dateTimeValues, [field]: value })
                    }
                  />

                  <View style={styles.buttonContainer}>
                    <Button
                      text={I18n.t("common.cancel")}
                      onPress={handleCancel}
                      style={styles.cancelButton}
                    />
                    <Button
                      text={I18n.t("common.save")}
                      onPress={handleUpdate}
                      style={styles.saveButton}
                      loading={isUpdateLoading}
                    />
                  </View>
                </View>
              </>
            )}

            <Alert
              isVisible={isDeleteDialogVisible}
              title={I18n.t("trainings.deleteTraining")}
              message={I18n.t("trainings.deleteTrainingConfirmation")}
              primaryButtonText={I18n.t("common.delete")}
              secondaryButtonText={I18n.t("common.cancel")}
              onPrimaryAction={handleDelete}
              onSecondaryAction={() => setIsDeleteDialogVisible(false)}
              onDismiss={() => setIsDeleteDialogVisible(false)}
              type="warning"
            />

            <Alert
              isVisible={showAssignConfirmation}
              title={I18n.t("trainings.trainingSent")}
              message={I18n.t("trainings.trainingSentMessage")}
              primaryButtonText={I18n.t("common.ok")}
              onPrimaryAction={() => setShowAssignConfirmation(false)}
              onDismiss={() => setShowAssignConfirmation(false)}
              type="success"
            />
          </>
        )}
      </View>

      {!isEditing && canEdit && (
        <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
          <Image source={Assign} style={styles.assignIcon} />
          <Text style={styles.assignText}>{I18n.t("trainings.assignTo")}</Text>
        </TouchableOpacity>
      )}
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: color.line,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.text,
    marginVertical: 16,
    textAlign: "center",
  },
  editorContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  saveButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
  },
  cancelButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.blackbg,
    borderColor: color.line,
    borderWidth: 1,
  },
  assignButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: color.blackbg,
    width: 120,
    height: 48,
    borderRadius: 25,
    borderColor: color.line,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  assignIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  assignText: {
    fontSize: 14,
    color: color.text,
    fontWeight: "700",
  },
});

export default TrainingScreen;
