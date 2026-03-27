"use client";

import SearchBox from "@/components/search";
import { Typewriter } from "react-simple-typewriter";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-semibold mb-2">{t("welcome")}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {t("intro_before")}
        <span className="text-black dark:text-white font-medium">
          <Typewriter
            words={t("typewriter_words", { returnObjects: true }) as string[]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>{" "}
        {t("intro_after")}
      </p>

      <SearchBox defaultValue="" />
    </main>
  );
}
