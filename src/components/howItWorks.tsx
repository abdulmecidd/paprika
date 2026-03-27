"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Info size={16} />
          <span className="hidden sm:inline">{t("how_it_works.button")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("how_it_works.title")}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            {t("how_it_works.description")}
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t("how_it_works.subtitle_1")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("how_it_works.content_1")}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t("how_it_works.subtitle_2")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("how_it_works.content_2")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t("how_it_works.subtitle_3")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("how_it_works.content_3")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
