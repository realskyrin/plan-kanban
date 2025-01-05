import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { InitOptions } from "i18next";

// 导入语言文件
import en from '@/public/locales/en.json';
import zhCN from '@/public/locales/zh-CN.json';
import zhTW from '@/public/locales/zh-TW.json';

const resources = {
  en: { translation: en },
  'zh-CN': { translation: zhCN },
  'zh-TW': { translation: zhTW },
};

const i18nConfig: InitOptions = {
  resources,
  // 默认语言
  fallbackLng: "zh-CN",
  // 支持的语言列表
  supportedLngs: ["en", "zh-CN", "zh-TW"],
  // 命名空间
  ns: ["translation"],
  defaultNS: "translation",
  // 开发环境下开启调试模式
  debug: process.env.NODE_ENV === "development",
  // 插值设置
  interpolation: {
    escapeValue: false,
  },
  // 语言检测配置
  detection: {
    // 检测顺序：1.localStorage 2.浏览器语言 3.URL参数
    order: ["localStorage", "navigator", "querystring"],
    // URL参数名
    lookupQuerystring: "lng",
    lookupCookie: "i18next",
    lookupLocalStorage: "preferredLanguage",
    // 缓存配置
    caches: ["localStorage"],
  },
  // React 配置
  react: {
    useSuspense: true,
  },
};

// 初始化i18n
const initI18n = async () => {
  if (!i18n.isInitialized) {
    try {
      // 获取存储的首选语言
      const storedLang = typeof window !== 'undefined' 
        ? localStorage.getItem("preferredLanguage")
        : null;
      const defaultLang = storedLang || "zh-CN";

      await i18n
        .use(initReactI18next)
        .init({
          ...i18nConfig,
          lng: defaultLang, // 强制使用默认语言
        });

      // 添加语言变更监听和处理
      i18n.on("initialized", () => {
        console.log("i18n initialized with language:", i18n.language);
      });

      i18n.on("languageChanged", (lng) => {
        console.log("Language changed to:", lng);
        // 处理中文变体
        if (lng.startsWith("zh")) {
          const mappedLng = lng.includes("TW") || lng.includes("HK") ? "zh-TW" : "zh-CN";
          if (lng !== mappedLng) {
            i18n.changeLanguage(mappedLng);
          }
        }
      });

    } catch (error) {
      console.error("Failed to initialize i18n:", error);
      throw error;
    }
  }
  return i18n;
};

export { initI18n };
export default i18n;