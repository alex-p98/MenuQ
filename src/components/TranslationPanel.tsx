import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Globe, Check, X } from "lucide-react";
import { useToast } from "./ui/use-toast";

const TranslationPanel = () => {
  const [activeTab, setActiveTab] = useState("languages");
  const { toast } = useToast();
  const {
    languages,
    toggleLanguage,
    menuItems,
    translations,
    setTranslations,
    selectedLanguage,
    setSelectedLanguage,
  } = useMenu();

  const handleApproveTranslation = (
    itemId: string,
    text: string,
    type: "name" | "description",
  ) => {
    const newTranslations = { ...translations };
    if (!newTranslations[selectedLanguage]) {
      newTranslations[selectedLanguage] = {};
    }
    newTranslations[selectedLanguage][`${itemId}_${type}`] = text;
    setTranslations(newTranslations);
    toast({
      title: "Translation approved",
      description: `Approved ${type} translation for ${selectedLanguage}`,
    });
  };

  const handleRejectTranslation = (
    itemId: string,
    type: "name" | "description",
  ) => {
    const newTranslations = { ...translations };
    if (newTranslations[selectedLanguage]) {
      delete newTranslations[selectedLanguage][`${itemId}_${type}`];
      setTranslations(newTranslations);
      toast({
        title: "Translation rejected",
        description: `Rejected ${type} translation for ${selectedLanguage}`,
      });
    }
  };

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
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          handleApproveTranslation(
                            item.id || index.toString(),
                            item.name,
                            "name",
                          );
                          handleApproveTranslation(
                            item.id || index.toString(),
                            item.description,
                            "description",
                          );
                        }}
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          handleRejectTranslation(
                            item.id || index.toString(),
                            "name",
                          );
                          handleRejectTranslation(
                            item.id || index.toString(),
                            "description",
                          );
                        }}
                      >
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
                        {translations[selectedLanguage]?.[
                          `${item.id || index.toString()}_name`
                        ] || item.name}
                      </p>
                      <p className="text-sm mt-2">
                        {translations[selectedLanguage]?.[
                          `${item.id || index.toString()}_description`
                        ] || item.description}
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
