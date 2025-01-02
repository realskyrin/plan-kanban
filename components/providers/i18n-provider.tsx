"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from "@/lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupI18n = async () => {
      try {
        await initI18n();
        const savedLanguage = localStorage.getItem("preferredLanguage");
        if (savedLanguage && ["en", "zh-CN", "zh-TW"].includes(savedLanguage)) {
          await i18n.changeLanguage(savedLanguage);
        } else {
          const browserLang = navigator.language;
          const lang = browserLang.startsWith("zh") 
            ? browserLang.includes("TW") || browserLang.includes("HK") ? "zh-TW" : "zh-CN"
            : "en";
          await i18n.changeLanguage(lang);
          localStorage.setItem("preferredLanguage", lang);
        }
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
        // 如果出错，使用英文作为后备语言
        await i18n.changeLanguage("en");
      } finally {
        setIsLoading(false);
      }
    };

    setupI18n();
  }, []);

  if (isLoading) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 