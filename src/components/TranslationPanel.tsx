import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Globe, Check, X } from "lucide-react";

interface Language {
  code: string;
  name: string;
  enabled: boolean;
}

interface TranslationItem {
  original: string;
  translated: string;
  category: string;
}

interface TranslationPanelProps {
  languages?: Language[];
  translations?: TranslationItem[];
  onLanguageToggle?: (code: string) => void;
  onTranslationApprove?: (item: TranslationItem) => void;
}

const defaultLanguages: Language[] = [
  { code: "es", name: "Spanish", enabled: true },
  { code: "fr", name: "French", enabled: false },
  { code: "de", name: "German", enabled: false },
  { code: "it", name: "Italian", enabled: false },
  { code: "zh", name: "Chinese", enabled: false },
];

const defaultTranslations: TranslationItem[] = [
  {
    original: "Grilled Chicken",
    translated: "Pollo a la Parrilla",
    category: "Main Course",
  },
  {
    original: "Caesar Salad",
    translated: "Ensalada César",
    category: "Starters",
  },
  {
    original: "Chocolate Cake",
    translated: "Pastel de Chocolate",
    category: "Desserts",
  },
];

const TranslationPanel = () => {
  const {
    languages,
    toggleLanguage,
    menuItems,
    translations,
    setTranslations,
  } = useMenu();
  const [activeTab, setActiveTab] = useState("languages");

  return (
    <Card className="w-full max-w-[720px] h-[640px] bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-6 h-6" />
        <h2 className="text-2xl font-semibold">Translation Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="h-[480px]">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Label htmlFor={`language-${language.code}`}>
                      {language.name}
                    </Label>
                  </div>
                  <Switch
                    id={`language-${language.code}`}
                    checked={language.enabled}
                    onCheckedChange={() => toggleLanguage(language.code)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="translations" className="h-[480px]">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {item.category}
                    </span>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Original</p>
                      <p>{item.name}</p>
                      <p className="text-sm mt-2">{item.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Translation</p>
                      <p>
                        {translations[selectedLanguage]?.[item.name] ||
                          "Not translated"}
                      </p>
                      <p className="text-sm mt-2">
                        {translations[selectedLanguage]?.[item.description] ||
                          "Not translated"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TranslationPanel;
