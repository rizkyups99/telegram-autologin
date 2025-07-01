'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star } from 'lucide-react';
import ProductCard from './ProductCard';
import ShoppingCartSidebar from './ShoppingCartSidebar';
import CheckoutModal from './CheckoutModal';
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
interface CartItem {
  cartItem: {
    id: number;
    sessionId: string;
    productId: number;
    quantity: number;
  };
  product: StorefrontProduct;
}
export default function StorefrontPage() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');

  // Generate session ID for guest cart
  useEffect(() => {
    let storedSessionId = '';
    if (typeof window !== 'undefined') {
      storedSessionId = localStorage.getItem('etalase_session_id') || '';
    }
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('etalase_session_id', newSessionId);
      }
      setSessionId(newSessionId);
    }
  }, []);
  useEffect(() => {
    if (sessionId) {
      fetchProducts();
      fetchCartItems();
    }
  }, [sessionId]);
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/storefront/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  const addToCart = async (productId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          productId,
          quantity: 1
        })
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  const cartCount = cartItems.reduce((total, item) => total + item.cartItem.quantity, 0);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" data-unique-id="936741dd-732b-4f41-b1e2-e8cbbdb92efc" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" data-unique-id="b0696538-c995-41d7-b5d7-d8a1438fe982" data-file-name="components/StorefrontPage.tsx">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-unique-id="fc9620dc-1921-4c18-a4df-9ffc4574a8c9" data-file-name="components/StorefrontPage.tsx">
          <div className="flex items-center justify-between h-16" data-unique-id="2a55c24f-54cc-4f85-806d-47952bb7fe4d" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
            {/* Logo */}
            <div className="flex items-center" data-unique-id="4149300d-75fd-4339-a3b5-cfcc2bca9050" data-file-name="components/StorefrontPage.tsx">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xl" data-unique-id="028dddc8-be12-42dd-92e3-bdff7bc6f0eb" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="4602dac0-0866-4fd4-b0b7-be014de1783d" data-file-name="components/StorefrontPage.tsx">
                SAUDAGAR
              </span></div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8" data-unique-id="c8eee383-9f5e-4c65-94da-480c65d05c1a" data-file-name="components/StorefrontPage.tsx">
              <div className="relative" data-unique-id="11434453-8f98-42a9-b5ed-9b27c359a7db" data-file-name="components/StorefrontPage.tsx">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input type="text" placeholder="Cari produk..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="dd9be8e9-c6ef-40ef-b69a-3508cf24651e" data-file-name="components/StorefrontPage.tsx" />
              </div>
            </div>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" data-unique-id="5334d042-5f00-400a-aa04-3e8c7d6d364f" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-unique-id="c2362ab5-f0c1-4d66-9709-e3d266e12e83" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
                  {cartCount}
                </span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white" data-unique-id="060e494c-0eb9-4be8-9f60-9944a7e605ee" data-file-name="components/StorefrontPage.tsx">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-unique-id="12988e64-34b6-4d2f-b0c7-d6b8974c87a3" data-file-name="components/StorefrontPage.tsx">
          <div className="text-center" data-unique-id="184c9069-9932-4ea8-b621-39160fd92d97" data-file-name="components/StorefrontPage.tsx">
            <h1 className="text-4xl font-bold mb-4" data-unique-id="feaf3478-167d-4cac-9e7b-2d1a65d356c0" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="40afd1e6-7e70-4fcd-a573-eaf09d2d7f90" data-file-name="components/StorefrontPage.tsx">Beli 2 Dapat 3</span></h1>
            <p className="text-xl text-blue-100 mb-8" data-unique-id="0b89224f-5c36-41f6-b8ec-b27269c78dfe" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="1ad1b9c2-a033-4b11-ad4b-f0f8c8ef0ab6" data-file-name="components/StorefrontPage.tsx">PROMO TERBATAS</span></p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors" data-unique-id="3cd50cdd-2ddf-491e-bf02-4796b1fcb073" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="0392badf-7dd1-46af-9b73-f77b72862dab" data-file-name="components/StorefrontPage.tsx">
              Belanja Sekarang
            </span></button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-unique-id="74aeaa30-48ca-4bca-beee-e7f19a2c8413" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
        <div className="mb-8" data-unique-id="6f3a0343-0842-4865-b6da-fef0a48e65e8" data-file-name="components/StorefrontPage.tsx">
          <h2 className="text-3xl font-bold text-gray-900 mb-2" data-unique-id="4069e8d9-ae44-4943-977a-7bcb0bff45f7" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="73d5eb14-bc75-4486-9022-a02b040b1582" data-file-name="components/StorefrontPage.tsx">Produk Terbaru</span></h2>
          <p className="text-gray-600" data-unique-id="dc78415e-0ee2-4c7a-9c9b-042075d2d3dc" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="1e0881f3-7253-4943-81a9-a1c705641260" data-file-name="components/StorefrontPage.tsx">Temukan produk digital terbaik untuk kebutuhan Anda</span></p>
        </div>

        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-unique-id="ebb000db-bfea-42af-af6a-158cdd4fa4e3" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
            {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse" data-unique-id="41a8d239-7547-401e-86e2-481eae685c22" data-file-name="components/StorefrontPage.tsx">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4" data-unique-id="827f9793-3e6e-4418-95e9-767dbd9a50fb" data-file-name="components/StorefrontPage.tsx"></div>
                <div className="h-4 bg-gray-200 rounded mb-2" data-unique-id="98dedf16-b15b-418c-a451-56c1647a7bb3" data-file-name="components/StorefrontPage.tsx"></div>
                <div className="h-3 bg-gray-200 rounded mb-4" data-unique-id="3eecc44e-06bf-4ca7-99a7-f8c1ae1f20d8" data-file-name="components/StorefrontPage.tsx"></div>
                <div className="h-10 bg-gray-200 rounded" data-unique-id="c5e78557-32be-4105-98e2-422c079fecd7" data-file-name="components/StorefrontPage.tsx"></div>
              </div>)}
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-unique-id="768f637d-ff92-4bda-9e0a-323f84ef8635" data-file-name="components/StorefrontPage.tsx" data-dynamic-text="true">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product.id)} />)}
          </div>}

        {!isLoading && filteredProducts.length === 0 && <div className="text-center py-12" data-unique-id="bca312b5-76be-4912-bede-2e96218ae3fe" data-file-name="components/StorefrontPage.tsx">
            <p className="text-gray-500 text-lg" data-unique-id="bdc96553-03b8-4efd-b0dd-de090fa4248d" data-file-name="components/StorefrontPage.tsx"><span className="editable-text" data-unique-id="c76da2e4-435f-42a4-906f-c22a52d8bd12" data-file-name="components/StorefrontPage.tsx">Tidak ada produk yang ditemukan</span></p>
          </div>}
      </div>

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateCart={fetchCartItems} onCheckout={() => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }} />

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cartItems} sessionId={sessionId} onOrderComplete={() => {
      fetchCartItems();
      setIsCheckoutOpen(false);
    }} />
    </div>;
}