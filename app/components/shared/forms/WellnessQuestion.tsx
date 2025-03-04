import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { color } from "theme";
import { CustomInput } from "components/Input/CustomInput";
import { WellnessAnswer } from "hooks/wellness/useWellnessCheck";
import { Checkboxes } from "screens/Player/Profile/Screens/components/CheckBoxes";
import { MultiChoose } from "screens/Player/Profile/Screens/components/MultiChoose";

interface WellnessQuestionProps {
  question: {
    _id: string;
    question: string;
    type: string;
    options: { _id: string; text: string; score?: number }[];
  };
  index: number;
  answerState: {
    formId: string;
    answers: WellnessAnswer[];
    type: string;
  };
  onSelectAnswer: (questionId: string, answer: any) => void;
  onTextAnswerChange: (questionId: string, text: string) => void;
}

/**
 * Component for rendering different types of wellness check questions
 */
export const WellnessQuestion: React.FC<WellnessQuestionProps> = ({
  question,
  index,
  answerState,
  onSelectAnswer,
  onTextAnswerChange,
}) => {
  return (
    <View style={styles.questionCard} key={index}>
      <CustomInput
        style={styles.questionText}
        placeholder={"Write your question ?"}
        value={question.question}
        editable={false}
        touched={true}
        errors={
          question.question?.length < 2 ? "must have at least 2 characters" : ""
        }
      />

      <View style={styles.optionsContainer}>
        {/* Multiple choice question */}
        {(question?.type === "Multiple choice" ||
          question.type === "multiple") && (
          <MultiChoose
            question={question}
            onSelectAnswer={onSelectAnswer}
            answerState={answerState}
            questionIndex={index}
          />
        )}

        {/* Checkbox question */}
        {(question?.type === "Check boxes" || question.type === "checkbox") && (
          <Checkboxes
            question={question}
            onSelectAnswer={onSelectAnswer}
            answerState={answerState}
            questionIndex={index}
          />
        )}

        {/* Short answer / text question */}
        {(question?.type === "Description box" ||
          question.type === "shortAnswer") && (
          <TextInput
            style={styles.input}
            placeholderTextColor={color.primaryLight}
            placeholder={question?.options[0]?.text || "Enter your answer"}
            onChangeText={(text) => onTextAnswerChange(question._id, text)}
            multiline={true}
            value={
              answerState.answers.find(
                (answer) => answer.question === question._id
              )?.answers[0] || ""
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    flex: 1,
    width: "97%",
    paddingVertical: 25,
    alignSelf: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: color.background,
    justifyContent: "space-around",
    borderBottomColor: "#fff",
    borderWidth: 1,
    marginHorizontal: 20,
  },
  questionText: {
    fontSize: 13,
    fontWeight: "700",
    color: color.text,
    textAlign: "left",
  },
  optionsContainer: {
    marginLeft: 6,
    marginTop: 10,
  },
  input: {
    color: color.text,
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "italic",
    textAlign: "left",
    padding: 15,
    minHeight: 53,
    width: "70%",
    borderRadius: 5,
    borderColor: color.text,
    borderWidth: 1,
    marginTop: 10,
  },
});
