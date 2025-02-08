// @ts-ignore
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

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
  
  useEffect(() => {
    if (!mobileToken) return;
    const fetchMenu = async () => {
      // Fetch the menu based on mobile token
      const { data: menuData, error: menuError } = await supabase
        .from('menus')
        .select('id, name')
        .eq('mobile_token', mobileToken)
        .single();
      if (menuError || !menuData) {
        setLoading(false);
        return;
      }
      setMenuName(menuData.name);
      
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{menuName}</h1>
      {loading ? (
        <p>Loading menu...</p>
      ) : menuItems.length > 0 ? (
        menuItems.map((item, index) => (
          <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Category: {item.category}</p>
          </div>
        ))
      ) : (
        <p>No menu items found.</p>
      )}
    </div>
  );
};

export default MobileMenuPage; 