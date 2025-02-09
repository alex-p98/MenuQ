import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

const PublicMenu = () => {
  console.log("PublicMenu component mounted");
  const { menuId } = useParams<{ menuId: string }>();
  console.log("Menu ID from params:", menuId); // Debug log
  console.log("Current URL:", window.location.href); // Debug log
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [translations, setTranslations] = useState<Translation>({});
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileStyles, setMobileStyles] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontSize: 16,
    lineHeight: 1.5,
    padding: 16,
    borderRadius: 8,
  });

  useEffect(() => {
    const fetchMenu = async () => {
      if (!menuId) {
        setError("No menu token provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching menu with token:", menuId);

        // First, get the menu ID using the mobile token
        const { data: menuData, error: menuError } = await supabase
          .from("menus")
          .select("id, name")
          .eq("mobile_token", menuId)
          .single();

        if (menuError) {
          console.error("Menu fetch error:", menuError); // Debug log
          throw menuError;
        }
        if (!menuData) throw new Error("Menu not found");

        console.log("Found menu:", menuData);

        // Fetch menu items
        const { data: items, error: itemsError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("menu_id", menuData.id);

        if (itemsError) {
          console.error("Items fetch error:", itemsError); // Debug log
          throw itemsError;
        }

        console.log("Found menu items:", items);

        if (items) {
          // Format prices consistently
          const formattedItems = items.map((item) => ({
            ...item,
            price: item.price
              ? `$${parseFloat(item.price).toFixed(2)}`
              : "$0.00",
          }));
          setMenuItems(formattedItems);
        }

        // Fetch mobile styles
        const { data: styleData } = await supabase
          .from("mobile_view_styles")
          .select("*")
          .eq("menu_id", menuData.id)
          .single();

        if (styleData) {
          setMobileStyles({
            backgroundColor: styleData.background_color || "#ffffff",
            textColor: styleData.text_color || "#000000",
            fontSize: styleData.font_size || 16,
            lineHeight: styleData.line_height || 1.5,
            padding: styleData.padding || 16,
            borderRadius: styleData.border_radius || 8,
          });
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="w-[375px] h-[812px] border border-gray-200 rounded-[40px] shadow-lg overflow-hidden"
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
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <SelectValue placeholder="Select Language" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              {Object.keys(translations).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Menu Items */}
        <div className="h-[calc(100%-144px)] overflow-y-auto p-4">
          {menuItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No menu items available.</p>
            </div>
          ) : (
            Object.entries(
              menuItems.reduce(
                (acc, item) => {
                  const category = item.category || "Uncategorized";
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(item);
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
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="h-16 border-t border-gray-200 flex items-center justify-around bg-white">
          <Button variant="ghost" className="flex flex-col items-center">
            <Menu className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicMenu;
