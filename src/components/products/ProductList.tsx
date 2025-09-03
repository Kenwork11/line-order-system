import Image from 'next/image';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.image_url || '/placeholder-food.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-red-600">
            ¥{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.is_available}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {product.is_available ? 'カートに追加' : '売り切れ'}
          </button>
        </div>
      </div>
    </div>
  );
};
