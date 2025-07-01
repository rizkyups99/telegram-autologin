'use client';

import { X, Plus, Minus, Trash2 } from 'lucide-react';
interface CartItem {
  cartItem: {
    id: number;
    sessionId: string;
    productId: number;
    quantity: number;
  };
  product: {
    id: number;
    name: string;
    price: string;
    imageUrl: string;
  };
}
interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateCart: () => void;
  onCheckout: () => void;
}
export default function ShoppingCartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateCart,
  onCheckout
}: ShoppingCartSidebarProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseFloat(price));
  };
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(cartItemId);
      return;
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: cartItemId,
          quantity: newQuantity
        })
      });
      if (response.ok) {
        onUpdateCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  const removeItem = async (cartItemId: number) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onUpdateCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.cartItem.quantity;
    }, 0);
  };
  if (!isOpen) return null;
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} data-unique-id="2272958a-bbef-41ed-a729-3795f50c9118" data-file-name="components/ShoppingCartSidebar.tsx" />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-xl transform transition-transform duration-300" data-unique-id="def54174-3620-4360-89d1-3930bb698fe2" data-file-name="components/ShoppingCartSidebar.tsx">
        <div className="flex flex-col h-full" data-unique-id="553c5da0-5cc5-4ba4-a0b5-df224e68bfcf" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" data-unique-id="8a9d2110-ec50-43ec-be88-a357a0e5a9d1" data-file-name="components/ShoppingCartSidebar.tsx">
            <h2 className="text-xl font-semibold" data-unique-id="48c1b8be-383d-450f-912f-43bdf71062f1" data-file-name="components/ShoppingCartSidebar.tsx"><span className="editable-text" data-unique-id="df55a6ac-0b46-4832-80da-6a6c770748f4" data-file-name="components/ShoppingCartSidebar.tsx">Keranjang Belanja</span></h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-unique-id="28812b68-50e1-4777-9fb3-7bb3e0452826" data-file-name="components/ShoppingCartSidebar.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6" data-unique-id="2d465e05-fa36-40d8-a6a1-ef49119556f7" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">
            {cartItems.length === 0 ? <div className="text-center py-12" data-unique-id="5e5ec3fb-ef24-40b9-9b81-34cab9507bd3" data-file-name="components/ShoppingCartSidebar.tsx">
                <p className="text-gray-500" data-unique-id="6ff873e4-ea05-498b-8e0e-12449d41ab21" data-file-name="components/ShoppingCartSidebar.tsx"><span className="editable-text" data-unique-id="6191cb27-9fa2-451a-8415-ac2e9416b74c" data-file-name="components/ShoppingCartSidebar.tsx">Keranjang belanja kosong</span></p>
              </div> : <div className="space-y-4" data-unique-id="0becbe74-8a27-4c0d-8bd5-60ef998c5170" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">
                {cartItems.map(item => <div key={item.cartItem.id} className="flex items-center gap-4 p-4 border rounded-lg" data-unique-id="6899cb49-9004-47b3-8105-edc6032061f3" data-file-name="components/ShoppingCartSidebar.tsx">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-20 object-cover rounded" data-unique-id="02606015-f29b-4810-9886-8f1d3285f39b" data-file-name="components/ShoppingCartSidebar.tsx" />
                    
                    <div className="flex-1" data-unique-id="0806e712-b9a5-4805-b73c-901136163e65" data-file-name="components/ShoppingCartSidebar.tsx">
                      <h3 className="font-medium text-sm" data-unique-id="593707a9-b5b4-4f89-bb39-572db1b37a15" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">{item.product.name}</h3>
                      <p className="text-blue-600 font-semibold" data-unique-id="b6f085a2-cb8f-43f0-bdd5-e453207bfd98" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">
                        {formatPrice(item.product.price)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2" data-unique-id="2c799717-bbc8-4e49-ac9e-6c8d0f112180" data-file-name="components/ShoppingCartSidebar.tsx">
                        <button onClick={() => updateQuantity(item.cartItem.id, item.cartItem.quantity - 1)} className="p-1 hover:bg-gray-100 rounded" data-unique-id="a3e13253-059b-48b5-a698-dbb4d5cffa5a" data-file-name="components/ShoppingCartSidebar.tsx">
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-8 text-center" data-unique-id="edcfb031-c2bf-4959-ae40-56ccbd757c31" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">{item.cartItem.quantity}</span>
                        
                        <button onClick={() => updateQuantity(item.cartItem.id, item.cartItem.quantity + 1)} className="p-1 hover:bg-gray-100 rounded" data-unique-id="ba65db68-418a-4e4b-93a1-1b025382bc59" data-file-name="components/ShoppingCartSidebar.tsx">
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        <button onClick={() => removeItem(item.cartItem.id)} className="p-1 hover:bg-red-100 text-red-600 rounded ml-2" data-unique-id="3d0205d8-30ef-4e28-8d6f-a1e8e12a659a" data-file-name="components/ShoppingCartSidebar.tsx">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && <div className="p-6 border-t" data-unique-id="15aebf57-3ce4-4cdb-a2de-36cdca3ac65f" data-file-name="components/ShoppingCartSidebar.tsx">
              <div className="flex justify-between items-center mb-4" data-unique-id="795bab0c-4c78-45df-acb2-56d438edb1e6" data-file-name="components/ShoppingCartSidebar.tsx">
                <span className="font-semibold" data-unique-id="3dfe5de9-7a94-4007-b397-1dfc4763fab1" data-file-name="components/ShoppingCartSidebar.tsx"><span className="editable-text" data-unique-id="bf7e62e7-e3d1-4289-a844-50a44781b30e" data-file-name="components/ShoppingCartSidebar.tsx">Total:</span></span>
                <span className="text-xl font-bold text-blue-600" data-unique-id="7da6b1ff-8eb3-4a4b-9663-a317a5e3ec80" data-file-name="components/ShoppingCartSidebar.tsx" data-dynamic-text="true">
                  {formatPrice(calculateTotal().toString())}
                </span>
              </div>
              
              <button onClick={onCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors" data-unique-id="bc73ff5e-4740-4da8-8bd4-600d021bc94e" data-file-name="components/ShoppingCartSidebar.tsx"><span className="editable-text" data-unique-id="c578f51a-6263-4ce5-a229-a13718ae112d" data-file-name="components/ShoppingCartSidebar.tsx">
                Checkout
              </span></button>
            </div>}
        </div>
      </div>
    </>;
}