import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { color } from "theme";
import { StoryScreen } from "../../../../../storybook/views";
import ScreenShots from "@assets/images/Screenshot1.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button } from "components/shared";
import I18n from "i18n-js";
import { WellnessQuestion } from "components/shared/forms/WellnessQuestion";
import { useWellnessCheck } from "hooks/wellness/useWellnessCheck";

/**
 * WellnessCheckScreen for players to complete wellness forms
 */
const WellnessCheckScreen = ({ navigation }) => {
  const {
    isLoading,
    isSubmitting,
    forms,
    answerState,
    onSelectAnswer,
    onTextAnswerChange,
    submitForm,
  } = useWellnessCheck(navigation);

  return (
    <StoryScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={ScreenShots} />
          <View style={styles.headerCard}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.back}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={20}
                  color={color.text}
                />
                <Text style={styles.text}>{I18n.t("Medical.Back")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <ScrollView style={styles.scrollView}>
            {/* Form title card */}
            {forms && (
              <View style={styles.TitleCard}>
                <Text style={styles.titlehead}>
                  {forms.type === "morning"
                    ? "Morning Wellness Check"
                    : "Evening Wellness Check"}
                </Text>
                <Text style={styles.title}>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            )}

            {/* Questions */}
            {forms?.questions?.map((question, index) => (
              <WellnessQuestion
                key={question._id}
                question={question}
                index={index}
                answerState={answerState}
                onSelectAnswer={onSelectAnswer}
                onTextAnswerChange={onTextAnswerChange}
              />
            ))}

            {/* Submit button */}
            <View style={styles.buttonsView}>
              <Button
                style={styles.Button}
                text={I18n.t("Home.Confirm")}
                loading={isSubmitting}
                onPress={submitForm}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </StoryScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.blackbg,
  },
  headerCard: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
  },
  back: {
    flexDirection: "row",
    width: "35%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: color.text,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  TitleCard: {
    backgroundColor: color.background,
    width: "97%",
    height: 72,
    marginVertical: 15,
    paddingVertical: 15,
    alignSelf: "center",
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  titlehead: {
    fontSize: 13,
    fontWeight: "400",
    color: color.text,
    textAlign: "left",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: color.text,
    textAlign: "left",
    marginBottom: 10,
  },
  buttonsView: {
    flexDirection: "row",
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    right: "2%",
  },
  Button: {
    width: 100,
    height: 40,
    borderRadius: 25,
  },
});

export default WellnessCheckScreen;
