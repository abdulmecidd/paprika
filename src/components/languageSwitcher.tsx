"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2 font-medium">
      <Languages size={16} />
      <span>{i18n.language === "tr" ? "EN" : "TR"}</span>
    </Button>
  );
};
