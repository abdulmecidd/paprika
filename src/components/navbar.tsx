"use client";

import Link from "next/link";
import { ModeToggle } from "./modeToggle";
import { LanguageSwitcher } from "./languageSwitcher";
import { HowItWorks } from "./howItWorks";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
          Paprika
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <HowItWorks />
        <LanguageSwitcher />
        <ModeToggle />
      </div>
    </nav>
  );
};
