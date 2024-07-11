import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationZhTw from "./assets/locales/zh-tw/translation.json";
import translationEn from "./assets/locales/en/translation.json";
import translationZhCn from "./assets/locales/zh-cn/translation.json";

const resources = {
  en: {
    translation: translationEn,
  },
  "zh-TW": {
    translation: translationZhTw,
  },
  "zh-CN": {
    translation: translationZhCn,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh-CN",
    fallbackLng: "zh-TW",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    // debug: true, // Enable debug mode to see logs
  });

export default i18n;
