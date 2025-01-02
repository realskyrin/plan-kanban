import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { InitOptions } from "i18next";

const i18nConfig: InitOptions = {
  fallbackLng: "en",
  supportedLngs: ["en", "zh-CN", "zh-TW"],
  ns: ["translation"],
  defaultNS: "translation",
  debug: process.env.NODE_ENV === "development",
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: "/locales/{{lng}}.json",
  },
  detection: {
    order: ["querystring", "localStorage", "navigator"],
    lookupQuerystring: "lang",
    caches: ["localStorage"],
  },
  react: {
    useSuspense: false
  }
};

// 初始化i18n
const initI18n = async () => {
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);

  // 添加语言检测和映射逻辑
  i18n.on("languageChanged", (lng) => {
    if (lng.startsWith("zh")) {
      const mappedLng = lng.includes("TW") || lng.includes("HK") ? "zh-TW" : "zh-CN";
      if (lng !== mappedLng) {
        i18n.changeLanguage(mappedLng);
      }
    }
  });

  return i18n;
};

// 导出初始化函数和i18n实例
export { initI18n };
export default i18n; 