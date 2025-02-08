// @ts-ignore
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/card';

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const MobileMenuPage = () => {
  const router = useRouter();
  const { mobileToken } = router.query;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuName, setMenuName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>('#f3f4f6');
  
  useEffect(() => {
    if (!mobileToken) return;
    const fetchMenu = async () => {
      // Fetch the menu based on mobile token, including primary_color if available
      const { data: menuData, error: menuError } = await supabase
        .from('menus')
        .select('id, name, primary_color')
        .eq('mobile_token', mobileToken)
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
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('menu_id', menuData.id);
      if (itemsError || !items) {
        setLoading(false);
        return;
      }
      const formattedItems = items.map((item: any) => ({
        ...item,
        price: parseFloat(item.price).toFixed(2)
      }));
      setMenuItems(formattedItems);
      setLoading(false);
    };
    
    fetchMenu();
  }, [mobileToken]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card style={{ backgroundColor: primaryColor }} className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{menuName}</h1>
        {loading ? (
          <p className="text-center">Loading menu...</p>
        ) : menuItems.length > 0 ? (
          menuItems.map((item, index) => (
            <div key={index} className="border-b pb-2 mb-2">
              <h3 className="font-semibold">{item.name || 'Unnamed Item'}</h3>
              <p className="text-sm">{item.description}</p>
              <p className="text-sm">Price: ${item.price}</p>
              <p className="text-xs text-gray-500">{item.category}</p>
            </div>
          ))
        ) : (
          <p className="text-center">No menu items found.</p>
        )}
      </Card>
    </div>
  );
};

export default MobileMenuPage; 