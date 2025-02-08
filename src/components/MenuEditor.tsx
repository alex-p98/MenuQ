import React, { useState } from "react";
import { useMenu } from "../context/MenuContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

interface MenuEditorProps {
  initialItems?: MenuItem[];
  onSave?: (items: MenuItem[]) => void;
}

const MenuEditor = ({ initialItems = [] }: MenuEditorProps) => {
  const { setMenuItems } = useMenu();
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>(
    initialItems.length > 0
      ? initialItems
      : [{ name: "", description: "", price: "", category: "" }],
  );

  const addItem = () => {
    setItems([
      ...items,
      { name: "", description: "", price: "", category: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof MenuItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = () => {
    const validItems = items.filter(
      (item) => item.name && item.price && item.category,
    );

    if (validItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Please add at least one menu item with name, price and category.",
      });
      return;
    }

    // Format the items to ensure proper display
    const formattedItems = validItems.map((item) => ({
      ...item,
      price: item.price.startsWith("$") ? item.price : `$${item.price}`,
    }));

    setMenuItems(formattedItems);
    toast({
      title: "Success",
      description: `Saved ${formattedItems.length} menu items`,
    });
  };

  return (
    <Card className="w-full bg-white p-6 space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Menu Item {index + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
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
  );
};

export default MenuEditor;
