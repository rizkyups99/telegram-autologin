'use client';

import { Star, ShoppingCart } from 'lucide-react';
interface StorefrontProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  sourceType: string;
  sourceCategoryIds: string;
  paymentMethods: string;
  isActive: boolean;
}
interface ProductCardProps {
  product: StorefrontProduct;
  onAddToCart: () => void;
}
export default function ProductCard({
  product,
  onAddToCart
}: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseFloat(price));
  };
  const parsePaymentMethods = (methods: string) => {
    try {
      return JSON.parse(methods);
    } catch {
      return ['transfer'];
    }
  };
  return <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group" data-unique-id="da579fd4-ca45-44ca-b516-216b0c3e9e03" data-file-name="components/ProductCard.tsx">
      <div className="aspect-[3/4] overflow-hidden" data-unique-id="fac0f63c-ec8f-4b0c-b9c8-ba56f8e98c66" data-file-name="components/ProductCard.tsx">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" data-unique-id="3a78efb6-f0cf-4a9e-b333-87dc13623b4b" data-file-name="components/ProductCard.tsx" />
      </div>
      
      <div className="p-4" data-unique-id="a2d417a7-3c17-4bf9-8073-635d64674701" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2" data-unique-id="dcf49003-3b94-4b66-bc47-6b2d85a8b2a5" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
          {product.name}
        </h3>
        
        {product.description && <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-unique-id="82053865-50e6-4196-962a-b5605fa4be9f" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
            {product.description}
          </p>}
        
        <div className="flex items-center mb-3" data-unique-id="f8c0bf46-83c1-40d9-9b9d-488c6345b9e0" data-file-name="components/ProductCard.tsx">
          <div className="flex text-yellow-400" data-unique-id="89283d42-2a1a-4ae7-91a1-459f6b404bc6" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" data-unique-id="2bc3e068-6323-4d43-b1c1-eb92ae0469e4" data-file-name="components/ProductCard.tsx" data-dynamic-text="true" />)}
          </div>
          <span className="text-gray-500 text-sm ml-2" data-unique-id="0bf3c0c9-c1ae-45c4-8881-8b8c95afdf16" data-file-name="components/ProductCard.tsx"><span className="editable-text" data-unique-id="fe2d2246-99a1-413a-8434-097f0e5507ea" data-file-name="components/ProductCard.tsx">(4.8)</span></span>
        </div>
        
        <div className="flex items-center justify-between" data-unique-id="cb310cb3-00ad-4db0-9290-f8a1c3989009" data-file-name="components/ProductCard.tsx">
          <div className="text-xl font-bold text-blue-600" data-unique-id="c39e749e-6bc8-48f9-b642-515e50a9da92" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
            {formatPrice(product.price)}
          </div>
          
          <button onClick={onAddToCart} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium" data-unique-id="4c56ba72-b439-4e64-8c94-a804f654cfd0" data-file-name="components/ProductCard.tsx">
            <ShoppingCart className="h-4 w-4" /><span className="editable-text" data-unique-id="2cec6855-4b4a-49fa-b742-ea645b3ffa96" data-file-name="components/ProductCard.tsx">
            Beli Sekarang
          </span></button>
        </div>
        
        <div className="mt-3 flex gap-2" data-unique-id="d349a1ec-d817-4514-ba19-4b19478dbe27" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
          {parsePaymentMethods(product.paymentMethods).map((method: string) => <span key={method} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded" data-unique-id="b9a8f5e8-5f8c-4739-b476-4b7d1952e174" data-file-name="components/ProductCard.tsx" data-dynamic-text="true">
              {method === 'transfer' ? 'Transfer' : 'Virtual Account'}
            </span>)}
        </div>
      </div>
    </div>;
}