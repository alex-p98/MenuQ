import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Menu as MenuType, MenuItem, Translation } from "@/types/menu";

export default function Menu() {
  const { menuId } = useParams();
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const fetchMenu = async () => {
      if (!menuId) return;

      const { data: menuData, error: menuError } = await supabase
        .from("menus")
        .select("*")
        .eq("id", menuId)
        .single();

      if (menuError) {
        console.error("Error fetching menu:", menuError);
        return;
      }

      setMenu(menuData);

      // Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("menu_id", menuId);

      if (itemsError) {
        console.error("Error fetching menu items:", itemsError);
        return;
      }

      setItems(itemsData);

      // Fetch translations
      const { data: translationsData, error: translationsError } =
        await supabase
          .from("translations")
          .select("*")
          .in(
            "menu_item_id",
            itemsData.map((item) => item.id),
          );

      if (translationsError) {
        console.error("Error fetching translations:", translationsError);
        return;
      }

      setTranslations(translationsData);
    };

    fetchMenu();
  }, [menuId]);

  const getTranslation = (itemId: string, field: "name" | "description") => {
    const translation = translations.find(
      (t) => t.menu_item_id === itemId && t.language === selectedLanguage,
    );
    return translation
      ? field === "name"
        ? translation.translated_name
        : translation.translated_description
      : null;
  };

  const itemsByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  if (!menu) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6 text-center">{menu.name}</h1>

      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          {categoryItems.map((item) => (
            <Card key={item.id} className="mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {getTranslation(item.id, "name") || item.name}
                  </h3>
                  <p className="text-sm mt-1 text-muted-foreground">
                    {getTranslation(item.id, "description") || item.description}
                  </p>
                </div>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
