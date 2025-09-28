"use client";

import { useState } from "react";
import SearchBox from "@/components/search";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-52px)] px-4 text-center bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-semibold mb-2">Paprika’ya Hoşgeldin</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Aradığın{" "}
        <span className="text-black dark:text-white font-medium">
          <Typewriter
            words={[
              "psikoloji",
              "yapay zeka",
              "bilişsel bilim",
              "eğitim",
              "nörobilim",
            ]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>{" "}
        makalesini bulmana yardımcı olalım. (umarız)
      </p>

      <SearchBox defaultValue="" />
    </main>
  );
}
