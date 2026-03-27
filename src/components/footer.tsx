"use client";

import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full px-4 py-6 border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-3xl mx-auto space-y-4 text-center">
        <Alert
          variant="default"
          className="justify-center dark:bg-gray-800 dark:text-gray-200"
        >
          <AlertTitle>{t("footer.warning")}</AlertTitle>
          <AlertDescription>
            {t("footer.disclaimer")}
          </AlertDescription>
        </Alert>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Made with <span className="text-pink-500">♥</span> by{" "}
          <a
            href="https://github.com/abdulmecidd/paprika"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Abdulmecid
          </a>
        </p>
      </div>
    </footer>
  );
}
