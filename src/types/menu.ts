export interface MenuItem {
  id: string;
  menu_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  menu_item_id: string;
  language: string;
  translated_name: string;
  translated_description: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  items?: MenuItem[];
  translations?: Translation[];
}
