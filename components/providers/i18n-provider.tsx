"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        setError(error as Error);
        await i18n.changeLanguage("en");
      } finally {
        setIsLoading(false);
      }
    };

    setupI18n();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading translations: {error.message}</div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 