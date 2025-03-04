// hooks/language/useLanguage.ts
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import { setLang } from "redux/slices/lang/langSlice";
import { languageService, LANGUAGES } from "services/language/languageService";

export const useLanguage = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state: RootState) => state.lang.currentLang
  );
  const isRTL = useSelector((state: RootState) => state.lang.isRTL);

  /**
   * Change the application language
   */
  const changeLanguage = useCallback(
    async (language: string) => {
      try {
        await languageService.setLanguage(language);
        dispatch(setLang(language));
        return true;
      } catch (error) {
        console.error("Error changing language:", error);
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Get the direction style based on RTL setting
   */
  const getDirectionStyle = useCallback(
    (additionalStyles = {}) => {
      return {
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        ...additionalStyles,
      };
    },
    [isRTL]
  );

  /**
   * Get the flex direction style based on RTL setting
   */
  const getFlexDirection = useCallback(
    (defaultDirection = "row") => {
      if (defaultDirection === "row") {
        return { flexDirection: isRTL ? "row-reverse" : "row" };
      }
      if (defaultDirection === "row-reverse") {
        return { flexDirection: isRTL ? "row" : "row-reverse" };
      }
      return { flexDirection: defaultDirection };
    },
    [isRTL]
  );

  /**
   * Check if the current language is Arabic
   */
  const isArabic = useCallback(() => {
    return currentLanguage === LANGUAGES.ARABIC;
  }, [currentLanguage]);

  /**
   * Get a text style object with the appropriate font family based on language
   */
  const getTextStyle = useCallback(
    (style = {}) => {
      return {
        textAlign: isRTL ? "right" : "left",
        ...style,
      };
    },
    [isRTL]
  );

  /**
   * Translates text using i18n
   */
  const translate = useCallback((key: string, options?: any) => {
    return languageService.translate(key, options);
  }, []);

  return {
    currentLanguage,
    isRTL,
    changeLanguage,
    getDirectionStyle,
    getFlexDirection,
    isArabic,
    getTextStyle,
    translate,
    LANGUAGES,
  };
};
