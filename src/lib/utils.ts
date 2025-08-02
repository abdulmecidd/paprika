import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isIOS = (): boolean => {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
};

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const isInStandaloneMode = (): boolean => {
  if (typeof window === "undefined") return false;

  const navigatorExtended = window.navigator as NavigatorStandalone;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorExtended.standalone === true
  );
};
