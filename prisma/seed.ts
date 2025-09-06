import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${environment}`);
  console.log('Seeding database...');

 feat/remove-users-orders-tables
  // データベースはクリーンアップされました
  console.log('Database cleanup completed - no data to seed');

  const productData = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'ハンバーガー',
      price: 500,
      image_url:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      description: '定番のハンバーガーです',
      is_available: true,
      created_at: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'チーズバーガー',
      price: 600,
      image_url:
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300',
      description: 'チーズが入ったハンバーガーです',
      is_available: true,
      created_at: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'フライドポテト',
      price: 300,
      image_url:
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
      description: 'サクサクのフライドポテトです',
      is_available: true,
      created_at: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'コーラ',
      price: 200,
      image_url:
        'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300',
      description: '冷たいコーラです',
      is_available: true,
      created_at: new Date('2024-01-01T00:00:00.000Z'),
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'アイスクリーム',
      price: 250,
      image_url:
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300',
      description: 'バニラアイスクリームです',
      is_available: true,
      created_at: new Date('2024-01-01T00:00:00.000Z'),
    },
  ];

  let upsertedCount = 0;
  for (const product of productData) {
    await prisma.products.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        description: product.description,
        is_available: product.is_available,
      },
      create: product,
    });
    upsertedCount++;
  }

  console.log(`Upserted ${upsertedCount} products`);
 main
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
