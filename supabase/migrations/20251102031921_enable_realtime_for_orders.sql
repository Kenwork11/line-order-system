-- Enable Realtime for orders and order_items tables

-- 1. Set REPLICA IDENTITY for orders table
ALTER TABLE orders REPLICA IDENTITY FULL;

-- 2. Set REPLICA IDENTITY for order_items table
ALTER TABLE order_items REPLICA IDENTITY FULL;

-- 3. Add tables to supabase_realtime publication
DO $$
BEGIN
  -- Add orders table
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL; -- Table already in publication
  END;

  -- Add order_items table
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL; -- Table already in publication
  END;
END $$;
