import { createClient } from '@supabase/supabase-js';

// Supabase Admin Client (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${environment}`);
  console.log('Creating test authentication users...');
  console.log('Note: User profiles will be auto-created by database triggers.');

  const testUsers = [
    {
      email: 'admin@example.com',
      password: 'password123',
      name: '管理者ユーザー',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Smith',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    },
    {
      email: 'bob@example.com',
      password: 'password123',
      name: 'Bob Johnson',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice Brown',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  ];

  let createdCount = 0;

  for (const user of testUsers) {
    try {
      console.log(`Processing user: ${user.email}`);

      // 既存のAuthユーザーを確認
      const { data: existingUsers, error: listError } =
        await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        console.error(`Error listing users:`, listError);
        continue;
      }

      const existingAuthUser = existingUsers.users.find(
        (u) => u.email === user.email
      );

      if (existingAuthUser) {
        console.log(`✅ Auth user already exists: ${user.email}`);

        // 既存ユーザーのパスワードとメタデータを更新
        const { error: updateError } =
          await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, {
            password: user.password,
            user_metadata: {
              name: user.name,
              avatar_url: user.avatar,
            },
          });

        if (updateError) {
          console.error(`Error updating ${user.email}:`, updateError);
        } else {
          console.log(`✅ Updated metadata for: ${user.email}`);
        }
      } else {
        // 新しいAuthユーザーを作成
        // プロフィールは自動的にトリガーで作成される
        console.log(`Creating new auth user: ${user.email}`);
        const { error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
            avatar_url: user.avatar,
          },
        });

        if (authError) {
          console.error(`Auth creation error for ${user.email}:`, authError);
          continue;
        }

        createdCount++;
        console.log(`✅ Auth user created: ${user.email}`);
        console.log(`✅ Profile auto-created by trigger for: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }

  console.log(`\n🎉 Successfully processed test users!`);
  console.log(`📊 New users created: ${createdCount}`);
  console.log(`🔑 All users have password: password123`);
  console.log(`📝 User profiles are auto-managed by database triggers`);
}

main().catch((e) => {
  console.error('Seed script failed:', e);
  process.exit(1);
});
