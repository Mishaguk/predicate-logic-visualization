import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import ukCommon from "./locales/uk/common.json";
import skCommon from "./locales/sk/common.json";

export const resources = {
  en: { common: enCommon },
  uk: { common: ukCommon },
  sk: { common: skCommon },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
