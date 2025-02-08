import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Edit2, Globe, Check } from "lucide-react";

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

interface MenuPreviewGridProps {
  originalMenu?: MenuItem[];
  selectedLanguages?: string[];
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

const defaultLanguages = ["es", "fr"];

const MenuPreviewGrid = ({
  originalMenu = defaultMenu,
  selectedLanguages = defaultLanguages,
  onEditTranslation = () => {},
  onApproveTranslation = () => {},
}: MenuPreviewGridProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold">Menu Translations Preview</h2>
      </div>

      <ScrollArea className="h-[600px] w-full rounded-md border">
        <div className="p-4">
          {originalMenu.map((item) => (
            <Card key={item.id} className="mb-4 p-4">
              <div className="grid grid-cols-[1fr,repeat(auto-fit,minmax(250px,1fr))] gap-4">
                {/* Original Menu Item */}
                <div className="space-y-2">
                  <div className="font-semibold text-lg">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.description}
                  </div>
                  <div className="font-medium">{item.price}</div>
                </div>

                {/* Translations */}
                {selectedLanguages.map((lang) => (
                  <div key={lang} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-sm font-medium text-gray-500">
                        {lang}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditTranslation(item.id, lang)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApproveTranslation(item.id, lang)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="font-semibold">
                      {item.translations?.[lang]?.name || "Pending translation"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.translations?.[lang]?.description ||
                        "Pending translation"}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuPreviewGrid;
