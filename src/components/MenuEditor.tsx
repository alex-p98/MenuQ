import React, { useState, useEffect } from "react";
import { useMenu } from "../context/MenuContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: string;
  category: string;
}

interface MenuEditorProps {
  initialItems?: MenuItem[];
  // Optionally, you can pass a menu name if you want to customize it
  menuName?: string;
  primaryColor?: string;
}

const MenuEditor = ({ initialItems = [], menuName = "Today's Menu", primaryColor }: MenuEditorProps) => {
  const { setMenuItems } = useMenu();
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>(
    initialItems.length > 0
      ? initialItems
      : [{ name: "", description: "", price: "", category: "" }]
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchMenu = async () => {
      const { data: existingMenu, error: menuFetchError } = await supabase
        .from("menus")
        .select("id")
        .eq("restaurant_id", user.id)
        .eq("name", menuName)
        .single();
      if (existingMenu) {
        const { data: menuItems, error: menuItemsError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("menu_id", existingMenu.id);
        if (menuItemsError) {
          toast({
            variant: "destructive",
            title: "Error fetching menu items",
            description: menuItemsError.message
          });
        } else if (menuItems) {
          const fetchedItems = menuItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: `$${parseFloat(item.price).toFixed(2)}`,
            category: item.category
          }));
          setItems(fetchedItems);
          setMenuItems(fetchedItems);
        }
      }
      setLoading(false);
    };
    fetchMenu();
  }, [user, menuName, toast, setMenuItems]);

  useEffect(() => {
    const previewItems = items.map((item) => ({
      ...item,
      price: isNaN(parseFloat(item.price.replace("$", "")))
        ? item.price
        : `$${parseFloat(item.price.replace("$", "")).toFixed(2)}`
    }));
    setMenuItems(previewItems);
  }, [items, setMenuItems]);

  const addItem = () => {
    setItems([...items, { name: "", description: "", price: "", category: "" }]);
  };

  const removeItem = async (index: number) => {
    const deletedItem = items[index];
    if(deletedItem.id) {
      const { error } = await supabase.from("menu_items").delete().eq("id", deletedItem.id);
      if(error) {
        toast({
          variant: "destructive",
          title: "Error deleting item",
          description: error.message
        });
        return;
      }
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof MenuItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = async () => {
    // Ensure at least one item has the required fields.
    const validItems = items.filter((item) => item.name && item.price && item.category);

    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one menu item with name, price and category."
      });
      return;
    }

    // Format items: remove any "$" and convert price to a number.
    const formattedItems = validItems.map((item) => ({
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.replace("$", "")),
      category: item.category
    }));

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated."
      });
      return;
    }

    // Check if a menu already exists for this user with the given name
    const { data: existingMenu, error: existingMenuError } = await supabase
      .from("menus")
      .select("id")
      .eq("restaurant_id", user.id)
      .eq("name", menuName)
      .single();

    let menuId;
    if (existingMenuError || !existingMenu) {
      // Create a new menu record
      const { data: menuData, error: menuError } = await supabase
        .from("menus")
        .insert({
          name: menuName,
          restaurant_id: user.id
        })
        .select("id")
        .single();

      if (menuError) {
        toast({
          variant: "destructive",
          title: "Error creating menu",
          description: menuError.message
        });
        return;
      }
      menuId = menuData.id;
    } else {
      menuId = existingMenu.id;
      // Delete existing menu items so we can update them
      const { error: deleteError } = await supabase
        .from("menu_items")
        .delete()
        .eq("menu_id", menuId);
      if (deleteError) {
        toast({
          variant: "destructive",
          title: "Error updating menu items",
          description: deleteError.message
        });
        return;
      }
    }

    // Insert the menu items with the correct menu_id
    const itemsToInsert = formattedItems.map((item) => ({
      menu_id: menuId,
      ...item
    }));

    const { error: itemsError } = await supabase
      .from("menu_items")
      .insert(itemsToInsert);

    if (itemsError) {
      toast({
        variant: "destructive",
        title: "Error saving menu items",
        description: itemsError.message
      });
      return;
    }

    // Update local context for display (adding back "$" for proper formatting)
    setMenuItems(
      itemsToInsert.map((item) => ({
        ...item,
        price: `$${item.price.toFixed(2)}`
      }))
    );

    // Generate a unique mobile page token and update the menu record
    const mobileToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const { error: tokenError } = await supabase
      .from("menus")
      .update({ mobile_token: mobileToken })
      .eq("id", menuId);
    if (tokenError) {
      toast({
        variant: "destructive",
        title: "Error updating mobile page",
        description: tokenError.message
      });
      return;
    }

    const mobileMenuUrl = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/mobile/${mobileToken}` : `/mobile/${mobileToken}`;

    toast({
      title: "Success",
      description: `Saved ${itemsToInsert.length} menu items successfully! Mobile Menu URL: ${mobileMenuUrl}`
    });
  };

  return (
    <>
      <Card className="w-full bg-white p-6 space-y-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Menu Item {index + 1}</h3>
                <Button variant="ghost" size="icon" onClick={async () => await removeItem(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Category"
                  value={item.category}
                  onChange={(e) => updateItem(index, "category", e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                className="min-h-[80px]"
              />
              <Input
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                className="w-1/3"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={addItem} className="w-full mr-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          <Button onClick={handleSave} className="w-full ml-2">
            Save Menu
          </Button>
        </div>
      </Card>
      {/* Mobile Preview: Visible only on mobile devices, using the primaryColor for background if provided */}
      <Card style={{ backgroundColor: primaryColor || '#f3f4f6' }} className="w-full p-4 mt-4 block md:hidden">
        <h2 className="text-lg font-bold mb-2">Mobile Preview</h2>
        {loading ? (
          <p>Loading menu...</p>
        ) : items && items.length > 0 && items.some(item => item.name || item.description || item.price || item.category) ? (
          items.map((item, index) => (
            <div key={index} className="border-b pb-2 mb-2">
              <h3 className="font-medium">{item.name || 'Unnamed Item'}</h3>
              <p className="text-black">{item.description}</p>
              <p>{item.price}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          ))
        ) : (
          <p>No menu created yet.</p>
        )}
      </Card>
    </>
  );
};

export default MenuEditor;
