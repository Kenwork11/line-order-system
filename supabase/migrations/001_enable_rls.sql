-- Enable Row Level Security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and modify their own data
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
USING (auth.uid() = id::uuid);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
USING (auth.uid() = id::uuid);

-- Policy: Allow insert for new user registration (via authenticated users)
CREATE POLICY "Users can insert own profile"
ON users
FOR INSERT
WITH CHECK (auth.uid() = id::uuid);

-- Policy: Prevent users from deleting their profile (optional - remove if deletion is needed)
CREATE POLICY "Prevent profile deletion"
ON users
FOR DELETE
USING (false);

-- Create an index on users.id for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(id);

-- Function to handle new user creation via trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- ユーザープロフィールを自動作成
  INSERT INTO users (id, email, name, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
EXCEPTION
  -- 既存ユーザーの場合は無視（重複エラーを防ぐ）
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();