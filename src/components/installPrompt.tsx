"use client";

import { useEffect, useState } from "react";
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

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
      setShowDrawer(true);
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    const handler = (e: Event) => {
      if (installed || localStorage.getItem(INSTALL_PROMPT_KEY)) return;

      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowDrawer(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
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
          <DrawerTitle>Uygulamayı Yükle</DrawerTitle>
          <DrawerDescription>
            {platform === "ios" ? (
              <>
                iOS cihazlarda bu uygulamayı yüklemek için Safari’de{" "}
                <span className="font-semibold">Paylaş</span> butonuna dokunun
                ve <span className="font-semibold">Ana Ekrana Ekle</span>{" "}
                seçeneğini seçin. 📱
              </>
            ) : platform === "desktop" ? (
              <>Bu web uygulamasını masaüstüne yükleyebilirsiniz.</>
            ) : (
              <>Bu uygulamayı cihazınıza yüklemek ister misiniz?</>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          {platform !== "ios" && deferredPrompt && (
            <Button onClick={handleInstallClick}>Yükle</Button>
          )}
          <Button variant="ghost" onClick={handleDismiss}>
            Daha sonra
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
