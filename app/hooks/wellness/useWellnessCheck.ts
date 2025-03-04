import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";

interface QuestionOption {
  _id: string;
  text: string;
  score?: number;
}

interface WellnessQuestion {
  _id: string;
  question: string;
  type: "multiple" | "checkbox" | "shortAnswer";
  options: QuestionOption[];
}

export interface WellnessForm {
  _id: string;
  type: string;
  primary: boolean;
  questions: WellnessQuestion[];
}

export interface WellnessAnswer {
  question: string;
  answers: any[];
}

export interface WellnessFormData {
  formId: string;
  answers: WellnessAnswer[];
  type: string;
}

/**
 * Custom hook to handle wellness check forms
 */
export const useWellnessCheck = (navigation: any) => {
  const toast = useToast();
  const token = useSelector((state: RootState) => state.login.accessToken);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forms, setForms] = useState<WellnessForm | null>(null);
  const [answerState, setAnswerState] = useState<WellnessFormData>({
    formId: "",
    answers: [],
    type: "",
  });

  // Fetch wellness questions from API
  const fetchWellnessQuestions = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await axiosInterceptor({
        url: `/v1/wellnesschecks`,
        method: "GET",
        token,
      });

      const records = response?.data?.records || [];
      const durationToday = new Date().getHours();

      // Find the appropriate form based on time of day
      let selectedForm: WellnessForm | null = null;
      records.forEach((form: WellnessForm) => {
        if (
          form.primary &&
          ((durationToday >= 21 &&
            durationToday <= 22.5 &&
            form.type === "evening") ||
            (durationToday >= 9 &&
              durationToday <= 10.5 &&
              form.type === "morning"))
        ) {
          selectedForm = form;
        }
      });

      if (selectedForm) {
        setForms(selectedForm);
        setAnswerState((prev) => ({
          ...prev,
          formId: selectedForm!._id,
          type: selectedForm!.type,
        }));
      }
    } catch (error) {
      console.error("Error fetching wellness questions:", error);
      toast.show({
        message: "Failed to load wellness questions",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  // Handle answer selection
  const onSelectAnswer = useCallback((questionId: string, answer: any) => {
    setAnswerState((prevState) => {
      const selectedQuestionIndex = prevState.answers.findIndex(
        (question) => question.question === questionId
      );

      if (selectedQuestionIndex === -1) {
        // Question not answered yet, add it
        return {
          ...prevState,
          answers: [
            ...prevState.answers,
            { question: questionId, answers: [answer] },
          ],
        };
      } else {
        // Question already has answers
        const answerIndex = prevState.answers[
          selectedQuestionIndex
        ].answers.findIndex((answerStr) => answerStr === answer);

        if (answerIndex === -1) {
          // Answer not selected yet, add it
          const answersArr = [...prevState.answers];
          answersArr[selectedQuestionIndex].answers.push(answer);
          return { ...prevState, answers: answersArr };
        } else {
          // Answer already selected, remove it
          const answerStateCopy = [
            ...prevState.answers[selectedQuestionIndex].answers,
          ];

          answerStateCopy.splice(answerIndex, 1);

          const updatedAnswers = [...prevState.answers];
          updatedAnswers[selectedQuestionIndex].answers = answerStateCopy;

          return {
            ...prevState,
            answers: updatedAnswers,
          };
        }
      }
    });
  }, []);

  // Handle text answer change
  const onTextAnswerChange = useCallback((questionId: string, text: string) => {
    setAnswerState((prevState) => {
      const selectedQuestionIndex = prevState.answers.findIndex(
        (questionObj) => questionObj.question === questionId
      );

      const answersCopy = [...prevState.answers];

      if (selectedQuestionIndex === -1) {
        // Question not answered yet, add it
        answersCopy.push({
          question: questionId,
          answers: [text],
        });
      } else {
        // Update existing answer
        answersCopy[selectedQuestionIndex] = {
          question: questionId,
          answers: [text],
        };
      }

      return {
        ...prevState,
        answers: answersCopy,
      };
    });
  }, []);

  // Submit wellness form
  const submitForm = useCallback(async () => {
    if (!token || !forms || !forms._id) {
      toast.show({
        message: "Unable to submit form",
        preset: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInterceptor({
        url: "/v1/wellnessscores",
        method: "POST",
        data: {
          ...answerState,
          formId: forms._id,
          type: forms.type,
        },
        token,
      });

      if (response?.status === 200 || response?.status === 201) {
        toast.show({ message: "Answers sent successfully." });
        navigation.goBack();
      } else {
        const responseData = response?.response?.data;
        if (responseData?.message) {
          toast.show({
            message: responseData.message,
            preset: "error",
          });
        } else {
          toast.show({
            message: "Failed to submit answers",
            preset: "error",
          });
        }
      }
    } catch (error: any) {
      console.error("Error submitting wellness form:", error);
      toast.show({
        message: error.response?.data?.message || "Failed to submit answers",
        preset: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [token, forms, answerState, navigation, toast]);

  // Fetch data on mount
  useEffect(() => {
    fetchWellnessQuestions();
  }, [fetchWellnessQuestions]);

  return {
    isLoading,
    isSubmitting,
    forms,
    answerState,
    onSelectAnswer,
    onTextAnswerChange,
    submitForm,
  };
};
