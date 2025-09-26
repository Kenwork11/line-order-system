import { PrismaClient } from '@prisma/client';

const productData = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'クラシックバーガー',
    description: 'ビーフパティ、レタス、トマト、オニオンの定番バーガー',
    price: 580,
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'バーガー',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'チーズバーガー',
    description: 'とろけるチェダーチーズが決め手のバーガー',
    price: 650,
    imageUrl:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    category: 'バーガー',
    isActive: true,
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'ベーコンバーガー',
    description: 'カリカリベーコンが香ばしいボリューム満点バーガー',
    price: 720,
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400',
    category: 'バーガー',
    isActive: true,
    createdAt: new Date('2024-01-03T00:00:00.000Z'),
    updatedAt: new Date('2024-01-03T00:00:00.000Z'),
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'フライドポテト',
    description: 'サクサクの黄金フライドポテト（Mサイズ）',
    price: 280,
    imageUrl:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    category: 'サイド',
    isActive: true,
    createdAt: new Date('2024-01-04T00:00:00.000Z'),
    updatedAt: new Date('2024-01-04T00:00:00.000Z'),
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    name: 'チキンナゲット',
    description: 'ジューシーなチキンナゲット6個入り',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    category: 'サイド',
    isActive: true,
    createdAt: new Date('2024-01-05T00:00:00.000Z'),
    updatedAt: new Date('2024-01-05T00:00:00.000Z'),
  },
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    name: 'オニオンリング',
    description: '甘くてサクサクのオニオンリング5個入り',
    price: 320,
    imageUrl:
      'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
    category: 'サイド',
    isActive: true,
    createdAt: new Date('2024-01-06T00:00:00.000Z'),
    updatedAt: new Date('2024-01-06T00:00:00.000Z'),
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    name: 'コーラ',
    description: '氷入りコーラ（Mサイズ）',
    price: 220,
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400',
    category: '飲み物',
    isActive: true,
    createdAt: new Date('2024-01-07T00:00:00.000Z'),
    updatedAt: new Date('2024-01-07T00:00:00.000Z'),
  },
  {
    id: 'b8888888-8888-8888-8888-888888888888',
    name: 'アイスコーヒー',
    description: '香り豊かなアイスコーヒー（Mサイズ）',
    price: 250,
    imageUrl:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    category: '飲み物',
    isActive: true,
    createdAt: new Date('2024-01-08T00:00:00.000Z'),
    updatedAt: new Date('2024-01-08T00:00:00.000Z'),
  },
];

export async function seedProducts(prisma: PrismaClient) {
  let productUpsertedCount = 0;
  for (const product of productData) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        isActive: product.isActive,
        updatedAt: new Date(),
      },
      create: product,
    });
    productUpsertedCount++;
  }

  console.log(`Upserted ${productUpsertedCount} products`);
}
