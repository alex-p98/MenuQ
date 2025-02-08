import React from "react";
import LanguageSelector from "./LanguageSelector";
import MenuPreviewGrid from "./MenuPreviewGrid";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  translations?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
}

interface TranslationManagerProps {
  menu?: MenuItem[];
  selectedLanguages?: string[];
  onLanguageToggle?: (language: string) => void;
  onTranslate?: () => void;
  onEditTranslation?: (itemId: string, language: string) => void;
  onApproveTranslation?: (itemId: string, language: string) => void;
}

const defaultMenu: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, basil, and olive oil",
    price: "$14.99",
    translations: {
      es: {
        name: "Pizza Margherita",
        description: "Tomates frescos, mozzarella, albahaca y aceite de oliva",
      },
      fr: {
        name: "Pizza Margherita",
        description: "Tomates fraîches, mozzarella, basilic et huile d'olive",
      },
    },
  },
  {
    id: "2",
    name: "Caesar Salad",
    description:
      "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    price: "$10.99",
    translations: {
      es: {
        name: "Ensalada César",
        description:
          "Lechuga romana, crotones, queso parmesano con aderezo César",
      },
      fr: {
        name: "Salade César",
        description:
          "Laitue romaine, croûtons, parmesan avec vinaigrette César",
      },
    },
  },
];

export default function TranslationManager({
  menu = defaultMenu,
  selectedLanguages = ["es", "fr"],
  onLanguageToggle = () => {},
  onTranslate = () => {},
  onEditTranslation = () => {},
  onApproveTranslation = () => {},
}: TranslationManagerProps) {
  return (
    <div className="flex flex-col gap-6 w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-auto">
          <h2 className="text-2xl font-semibold mb-4">Translation Manager</h2>
          <LanguageSelector
            selectedLanguages={selectedLanguages}
            onLanguageToggle={onLanguageToggle}
            onTranslate={onTranslate}
          />
        </div>

        <div className="flex-1 w-full">
          <MenuPreviewGrid
            originalMenu={menu}
            selectedLanguages={selectedLanguages}
            onEditTranslation={onEditTranslation}
            onApproveTranslation={onApproveTranslation}
          />
        </div>
      </div>
    </div>
  );
}
