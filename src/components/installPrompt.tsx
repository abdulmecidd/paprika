"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { isInStandaloneMode } from "@/lib/utils";

const INSTALL_PROMPT_KEY = "paprika_install_prompt_shown";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPrompt = () => {
  const { t } = useTranslation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<
    "ios" | "android" | "desktop" | null
  >(null);

  useEffect(() => {
    const installed = isInStandaloneMode();
    const alreadyShown = localStorage.getItem(INSTALL_PROMPT_KEY);

    if (installed || alreadyShown) return;

    let timer: ReturnType<typeof setTimeout>;

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
      timer = setTimeout(() => setShowDrawer(true), 5000);
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    const handler = (e: Event) => {
      if (installed || localStorage.getItem(INSTALL_PROMPT_KEY)) return;

      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      timer = setTimeout(() => setShowDrawer(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => {
        setShowDrawer(false);
        localStorage.setItem(INSTALL_PROMPT_KEY, "true");
        setDeferredPrompt(null);
      });
    }
  };

  const handleDismiss = () => {
    setShowDrawer(false);
    localStorage.setItem(INSTALL_PROMPT_KEY, "true");
  };

  return (
    <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>{t("install_prompt.title")}</DrawerTitle>
          <DrawerDescription>
            {platform === "ios" ? (
              <>
                {t("install_prompt.ios_1")}
                <span className="font-semibold">{t("install_prompt.share")}</span>
                {t("install_prompt.ios_2")}
                <span className="font-semibold">{t("install_prompt.add_to_home")}</span>
                {t("install_prompt.ios_3")}
              </>
            ) : platform === "desktop" ? (
              <>{t("install_prompt.desktop")}</>
            ) : (
              <>{t("install_prompt.default")}</>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          {platform !== "ios" && deferredPrompt && (
            <Button onClick={handleInstallClick}>{t("install_prompt.install")}</Button>
          )}
          <Button variant="ghost" onClick={handleDismiss}>
            {t("install_prompt.later")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
