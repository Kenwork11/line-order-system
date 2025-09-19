import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Supabase Admin Client (Service Role)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${environment}`);
  console.log('Seeding database...');

  const userData = [
    // 管理者用テストアカウント
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: 'admin@example.com',
      name: '管理者ユーザー',
      password: 'password123', // ログイン用パスワード
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123', // ログイン用パスワード
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: 'password123',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'bob@example.com',
      name: 'Bob Johnson',
      password: 'password123',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date('2024-01-03T00:00:00.000Z'),
      updatedAt: new Date('2024-01-03T00:00:00.000Z'),
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      email: 'alice@example.com',
      name: 'Alice Brown',
      password: 'password123',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      createdAt: new Date('2024-01-04T00:00:00.000Z'),
      updatedAt: new Date('2024-01-04T00:00:00.000Z'),
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      email: 'charlie@example.com',
      name: 'Charlie Wilson',
      password: 'password123',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      createdAt: new Date('2024-01-05T00:00:00.000Z'),
      updatedAt: new Date('2024-01-05T00:00:00.000Z'),
    },
  ];

  let upsertedCount = 0;
  for (const user of userData) {
    try {
      console.log(`Processing user: ${user.email}`);

      // 1. 既存のAuthユーザーを確認
      const { data: existingUsers, error: listError } =
        await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        console.error(`Error listing users:`, listError);
        continue;
      }

      const existingAuthUser = existingUsers.users.find(
        (u) => u.email === user.email
      );
      let authUserId = user.id;

      if (existingAuthUser) {
        console.log(`Auth user already exists: ${user.email}`);
        authUserId = existingAuthUser.id;

        // 既存ユーザーのパスワードを更新
        const { error: updateError } =
          await supabaseAdmin.auth.admin.updateUserById(existingAuthUser.id, {
            password: user.password,
          });

        if (updateError) {
          console.error(
            `Error updating password for ${user.email}:`,
            updateError
          );
        } else {
          console.log(`Password updated for: ${user.email}`);
        }
      } else {
        // 新しいAuthユーザーを作成
        console.log(`Creating new auth user: ${user.email}`);
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              name: user.name,
            },
          });

        if (authError) {
          console.error(`Auth creation error for ${user.email}:`, authError);
          continue;
        }

        authUserId = authData.user.id;
        console.log(`Auth user created: ${user.email}`);
      }

      // 2. Prismaでプロフィールテーブルにユーザー情報をupsert
      const { password, ...userWithoutPassword } = user;
      await prisma.user.upsert({
        where: { id: authUserId }, // AuthのIDを使用
        update: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          updatedAt: new Date(),
        },
        create: {
          ...userWithoutPassword,
          id: authUserId, // AuthのIDを使用
        },
      });

      upsertedCount++;
      console.log(`✅ User processed: ${user.email}`);
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }

  console.log(`\n✅ Successfully upserted ${upsertedCount} users`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
