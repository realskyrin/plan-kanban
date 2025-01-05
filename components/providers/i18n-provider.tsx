"use client";

import { Suspense, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { initI18n } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

function I18nProviderContent({ children }: { children: React.ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window !== "undefined") {
          await initI18n();
          setIsI18nInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
        setError(error instanceof Error ? error : new Error("Failed to initialize i18n"));
      }
    };

    if (!i18n.isInitialized) {
      init();
    } else {
      setIsI18nInitialized(true);
    }

    return () => {
      if (i18n.isInitialized) {
        i18n.off("initialized");
        i18n.off("languageChanged");
        i18n.off("loaded");
        i18n.off("failedLoading");
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error initializing translations: {error.message}
      </div>
    );
  }

  if (!isI18nInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return children;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }>
        <I18nProviderContent>{children}</I18nProviderContent>
      </Suspense>
    </I18nextProvider>
  );
}