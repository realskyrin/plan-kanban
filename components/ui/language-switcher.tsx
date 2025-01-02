"use client";

import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const languages = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { toast } = useToast();

  const handleLanguageChange = async (languageCode: typeof languages[number]["code"]) => {
    try {
      if (!languages.some(lang => lang.code === languageCode)) {
        throw new Error(`Unsupported language code: ${languageCode}`);
      }
      await i18n.changeLanguage(languageCode);
      localStorage.setItem("preferredLanguage", languageCode);
    } catch (error) {
      console.error("Failed to change language:", error);
      toast({
        title: t('error.languageSwitch'),
        description: t('error.tryAgain'),
        variant: "destructive",
      });
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label={t('common.switchLanguage')}>
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage.code === language.code ? "bg-accent" : ""}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 