"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {home: {
      welcome: "Welcome to",
    },
      welcome: "Welcome to our site!",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur notre site!",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
