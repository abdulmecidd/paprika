"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, Sparkles, CheckCircle2, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowStep {
  version: string;
  date: string;
  title: string;
  badge: string;
  changes: string[];
}

export const WhatChanged = () => {
  const { t } = useTranslation();
  const steps = (t("what_changed.steps", { returnObjects: true }) || []) as WorkflowStep[];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50">
          <History size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline font-medium">{t("what_changed.button")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Sparkles className="text-amber-500" size={20} />
            {t("what_changed.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("what_changed.description")}
          </p>

          {/* Step Workflow Timeline */}
          <div className="relative pl-6 border-l-2 border-blue-200 dark:border-blue-900/60 space-y-8 my-4">
            {Array.isArray(steps) && steps.map((step, idx) => {
              const isLatest = idx === 0;
              return (
                <div key={step.version} className="relative group">
                  {/* Step Timeline Indicator Node */}
                  <div
                    className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white dark:bg-gray-900 transition-all ${
                      isLatest
                        ? "border-blue-600 dark:border-blue-400 ring-4 ring-blue-100 dark:ring-blue-950 text-blue-600 dark:text-blue-400"
                        : "border-gray-300 dark:border-gray-700 text-gray-400"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isLatest ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-400"}`} />
                  </div>

                  {/* Step Card Content */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700/70 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-gray-900 dark:text-gray-100">
                          {step.version}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center gap-1">
                          <Tag size={11} /> {step.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={13} />
                        {step.date}
                      </div>
                    </div>

                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">
                      {step.title}
                    </h4>

                    <ul className="space-y-2">
                      {step.changes.map((change, cIdx) => (
                        <li key={cIdx} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
