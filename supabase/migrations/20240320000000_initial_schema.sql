-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create menus table
create table if not exists menus (
    id uuid primary key default uuid_generate_v4(),
    restaurant_id uuid references auth.users(id) on delete cascade,
    name text not null,
    mobile_token text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create menu_items table
create table if not exists menu_items (
    id uuid primary key default uuid_generate_v4(),
    menu_id uuid references menus(id) on delete cascade,
    name text not null,
    description text,
    price decimal(10,2) not null,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create mobile_view_styles table
create table if not exists mobile_view_styles (
    id uuid primary key default uuid_generate_v4(),
    menu_id uuid references menus(id) on delete cascade,
    background_color text default '#ffffff',
    text_color text default '#000000',
    font_size integer default 16,
    line_height numeric(3,1) default 1.5,
    padding integer default 16,
    border_radius integer default 8,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table menus enable row level security;
alter table menu_items enable row level security;
alter table mobile_view_styles enable row level security;

-- Create policies for public access to menus and items
create policy "Public read access to menus"
    on menus for select
    using (true);

create policy "Public read access to menu items"
    on menu_items for select
    using (true);

create policy "Public read access to mobile styles"
    on mobile_view_styles for select
    using (true);

-- Create policies for authenticated users
create policy "Users can manage their own menus"
    on menus for all
    using (auth.uid() = restaurant_id)
    with check (auth.uid() = restaurant_id);

create policy "Users can manage their menu items"
    on menu_items for all
    using (exists (
        select 1 from menus
        where menus.id = menu_items.menu_id
        and menus.restaurant_id = auth.uid()
    ))
    with check (exists (
        select 1 from menus
        where menus.id = menu_items.menu_id
        and menus.restaurant_id = auth.uid()
    ));

create policy "Users can manage their mobile styles"
    on mobile_view_styles for all
    using (exists (
        select 1 from menus
        where menus.id = mobile_view_styles.menu_id
        and menus.restaurant_id = auth.uid()
    ))
    with check (exists (
        select 1 from menus
        where menus.id = mobile_view_styles.menu_id
        and menus.restaurant_id = auth.uid()
    ));