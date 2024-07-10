import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationZhTw from "./assets/locales/zh-tw/translation.json";
import translationEn from "./assets/locales/en/translation.json";

const resources = {
  en: {
    translation: translationEn,
  },
  zh: {
    translation: translationZhTw,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "zh",
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
