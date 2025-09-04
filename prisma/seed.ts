import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`Environment: ${environment}`);
  console.log('Seeding database...');

  const productData = [
    {
      id: 'prod1',
      name: 'Classic Burger',
      price: 1200,
      imageUrl: 'https://example.com/burger1.jpg',
      description:
        'ジューシーなビーフパティにフレッシュな野菜をたっぷり挟んだクラシックバーガー',
      isAvailable: true,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'prod2',
      name: 'Cheeseburger',
      price: 1400,
      imageUrl: 'https://example.com/burger2.jpg',
      description: 'とろけるチーズがたまらないチーズバーガー',
      isAvailable: true,
      createdAt: new Date('2024-01-02'),
    },
    {
      id: 'prod3',
      name: 'Fish Burger',
      price: 1300,
      imageUrl: 'https://example.com/burger3.jpg',
      description: 'サクサクの白身魚フライと特製タルタルソースのハーモニー',
      isAvailable: true,
      createdAt: new Date('2024-01-03'),
    },
    {
      id: 'prod4',
      name: 'Veggie Burger',
      price: 1100,
      imageUrl: 'https://example.com/burger4.jpg',
      description: '野菜たっぷりヘルシーなベジタリアンバーガー',
      isAvailable: false,
      createdAt: new Date('2024-01-04'),
    },
    {
      id: 'prod5',
      name: 'BBQ Bacon Burger',
      price: 1600,
      imageUrl: 'https://example.com/burger5.jpg',
      description: 'スモーキーなBBQソースとクリスピーベーコンの贅沢バーガー',
      isAvailable: true,
      createdAt: new Date('2024-01-05'),
    },
    {
      id: 'prod6',
      name: 'Double Cheeseburger',
      price: 1800,
      imageUrl: 'https://example.com/burger6.jpg',
      description: 'ダブルパティとダブルチーズの満足感抜群バーガー',
      isAvailable: true,
      createdAt: new Date('2024-01-06'),
    },
    {
      id: 'prod7',
      name: 'Spicy Chicken Burger',
      price: 1350,
      imageUrl: 'https://example.com/burger7.jpg',
      description: 'ピリ辛チキンパティとクールなマヨネーズの絶妙なバランス',
      isAvailable: true,
      createdAt: new Date('2024-01-07'),
    },
    {
      id: 'prod8',
      name: 'Mushroom Swiss Burger',
      price: 1500,
      imageUrl: 'https://example.com/burger8.jpg',
      description: 'ソテーしたマッシュルームとスイスチーズの上品な味わい',
      isAvailable: false,
      createdAt: new Date('2024-01-08'),
    },
  ];

  let productUpsertedCount = 0;
  for (const product of productData) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        isAvailable: product.isAvailable,
      },
      create: product,
    });
    productUpsertedCount++;
  }

  console.log(`✓ Upserted ${productUpsertedCount} products`);
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
