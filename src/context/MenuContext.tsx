import React, { createContext, useContext, useState } from "react";

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

export interface Language {
  code: string;
  name: string;
  enabled: boolean;
}

interface MobilePreviewStyles {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  lineHeight: number;
  padding: number;
  borderRadius: number;
  headerImage?: string;
}

interface MenuContextType {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  languages: Language[];
  toggleLanguage: (code: string) => void;
  translations: Record<string, Record<string, string>>;
  setTranslations: (
    translations: Record<string, Record<string, string>>,
  ) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  mobileStyles: MobilePreviewStyles;
  setMobileStyles: (styles: MobilePreviewStyles) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  console.log("MenuContext state updated:", menuItems); // Debug log
  const [languages, setLanguages] = useState<Language[]>([
    { code: "en", name: "English", enabled: true },
    { code: "es", name: "Spanish", enabled: false },
    { code: "fr", name: "French", enabled: false },
    { code: "de", name: "German", enabled: false },
    { code: "zh", name: "Chinese", enabled: false },
  ]);
  const [translations, setTranslations] = useState<
    Record<string, Record<string, string>>
  >({});
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [mobileStyles, setMobileStyles] = useState<MobilePreviewStyles>({
    primaryColor: "#000000",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontSize: 16,
    lineHeight: 1.5,
    padding: 16,
    borderRadius: 8,
  });

  const toggleLanguage = (code: string) => {
    setLanguages(
      languages.map((lang) =>
        lang.code === code ? { ...lang, enabled: !lang.enabled } : lang,
      ),
    );
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        setMenuItems,
        languages,
        toggleLanguage,
        translations,
        setTranslations,
        selectedLanguage,
        setSelectedLanguage,
        mobileStyles,
        setMobileStyles,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
