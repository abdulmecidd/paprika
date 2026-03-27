"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "@/locales/en.json";
import trTranslations from "@/locales/tr.json";

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en"; // Server-side rendering default
  
  try {
    const stored = window.localStorage.getItem("i18nextLng");
    if (stored) return stored.startsWith("tr") ? "tr" : "en";
    
    const browserLang = window.navigator.language;
    if (browserLang.startsWith("tr")) return "tr";
  } catch {
    // Ignore permissions or undefined window properties
  }
  
  return "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      tr: { translation: trTranslations },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

if (typeof window !== "undefined") {
  i18n.on('languageChanged', (lng) => {
    try {
      window.localStorage.setItem("i18nextLng", lng);
    } catch {}
  });
}

export default i18n;
