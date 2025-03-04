import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { color } from "theme";
import { DetailScreen } from "components/shared/layout/DetailScreen";
import { useTaskDetail } from "hooks/tasks/useTaskDetail";
import { ImageCarousel } from "components/shared/media/ImageCarousel";
import I18n from "i18n-js";
import { formatAMPM } from "utils/dates/date";

const PlayerTaskDetailScreen = ({ route, navigation }) => {
  const {
    task,
    isLoading,
    activeSlide,
    setActiveSlide,
    error,
    updateImageDescription,
  } = useTaskDetail(route);

  // Format date if task is available
  const formattedDate = task?.date
    ? new Date(task.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const formattedTime = task?.date ? formatAMPM(new Date(task.date)) : "";

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <DetailScreen
      title={task?.title || I18n.t("common.taskDetails")}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      scrollable={true}
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {task && (
            <>
              <Text style={styles.title}>{task.title}</Text>

              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTime}>{formattedDate}</Text>
                <Text style={styles.dateTime}>{formattedTime}</Text>
              </View>

              {task.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>
                    {I18n.t("common.description")}
                  </Text>
                  <Text style={styles.description}>{task.description}</Text>
                </View>
              )}

              {task.images && task.images.length > 0 && (
                <View style={styles.carouselContainer}>
                  <ImageCarousel
                    images={task.images}
                    activeSlide={activeSlide}
                    setActiveSlide={setActiveSlide}
                    editable={false}
                    onDescriptionChange={updateImageDescription}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 16,
    textAlign: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  dateTime: {
    fontSize: 14,
    color: color.primary,
  },
  descriptionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: color.blackbg,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: color.text,
    lineHeight: 20,
  },
  carouselContainer: {
    marginVertical: 20,
  },
});

export default PlayerTaskDetailScreen;
