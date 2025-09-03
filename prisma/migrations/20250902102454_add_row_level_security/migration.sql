-- Enable Row Level Security for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone (read-only access)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Enable Row Level Security for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders (using current_user for now - to be implemented with proper auth)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (current_user = user_id);

-- Users can create orders (with their own user_id)
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (current_user = user_id);