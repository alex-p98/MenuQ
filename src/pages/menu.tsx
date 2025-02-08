import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const MenuPage = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuName, setMenuName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>('#ffffff');

  useEffect(() => {
    if (!menuId) return;

    const fetchMenu = async () => {
      // Fetch the menu details based on menuId
      const { data: menuData, error: menuError } = await supabase
        .from('menus')
        .select('id, name, primary_color')
        .eq('id', menuId)
        .single();
      if (menuError || !menuData) {
        setLoading(false);
        return;
      }
      setMenuName(menuData.name);
      if (menuData.primary_color) {
        setPrimaryColor(menuData.primary_color);
      }

      // Fetch menu items using the menu id
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('menu_id', menuData.id);
      if (itemsError || !itemsData) {
        setLoading(false);
        return;
      }
      const formattedItems = itemsData.map((item: any) => ({
        ...item,
        price: parseFloat(item.price).toFixed(2)
      }));
      setMenuItems(formattedItems);
      setLoading(false);
    };

    fetchMenu();
  }, [menuId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold mb-6" style={{ color: primaryColor }}>{menuName}</h1>
      {loading ? (
        <p>Loading menu...</p>
      ) : menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {menuItems.map((item, index) => (
            <Card key={index} className="p-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-700">{item.description}</p>
              <p className="mt-2 font-bold">Price: ${item.price}</p>
              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p>No menu items to display.</p>
      )}
    </div>
  );
};

export default MenuPage;
