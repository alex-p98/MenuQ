import React from "react";
import { useMenu } from "../context/MenuContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Globe, Menu } from "lucide-react";

interface MobilePreviewProps {
  selectedLanguage?: string;
  menuData?: {
    items: Array<{
      name: string;
      description: string;
      price: string;
      category: string;
    }>;
  };
}

const MobilePreview = () => {
  const { menuItems, selectedLanguage, translations, mobileStyles } = useMenu();

  const getTranslatedText = (text: string) => {
    return translations[selectedLanguage]?.[text] || text;
  };
  return (
    <div
      className="w-[375px] h-[812px] border border-gray-200 rounded-[40px] shadow-lg overflow-hidden mx-auto"
      style={{
        backgroundColor: mobileStyles.backgroundColor,
        color: mobileStyles.textColor,
        fontSize: `${mobileStyles.fontSize}px`,
        lineHeight: mobileStyles.lineHeight,
      }}
    >
      {/* Mobile Status Bar */}
      <div className="h-12 bg-black text-white flex items-center justify-between px-6">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Restaurant Menu Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Menu className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Restaurant Menu</h1>
          <div className="w-6 h-6" />
        </div>

        {/* Language Selector */}
        <Select defaultValue={selectedLanguage}>
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <SelectValue placeholder="Select Language" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Español</SelectItem>
            <SelectItem value="French">Français</SelectItem>
            <SelectItem value="Chinese">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items */}
      <div className="h-[calc(100%-144px)] overflow-y-auto p-4">
        {Object.entries(
          menuItems.reduce(
            (acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            },
            {} as Record<string, typeof menuItems>,
          ),
        ).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{category}</h2>
            {items.map((item, index) => (
              <Card
                key={index}
                className="mb-3"
                style={{
                  padding: `${mobileStyles.padding}px`,
                  borderRadius: `${mobileStyles.borderRadius}px`,
                  backgroundColor: mobileStyles.backgroundColor,
                  color: mobileStyles.textColor,
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-medium">{item.price}</span>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="h-16 border-t border-gray-200 flex items-center justify-around bg-white">
        <Button variant="ghost" className="flex flex-col items-center">
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </Button>
      </div>
    </div>
  );
};

export default MobilePreview;
