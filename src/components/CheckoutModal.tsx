'use client';

import { useState } from 'react';
import { X, CreditCard, Banknote } from 'lucide-react';
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
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  sessionId: string;
  onOrderComplete: () => void;
}
export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  sessionId,
  onOrderComplete
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    paymentMethod: 'transfer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseFloat(price));
  };
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.cartItem.quantity;
    }, 0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          ...formData
        })
      });
      if (response.ok) {
        const order = await response.json();
        setOrderNumber(order.orderNumber);
        setOrderComplete(true);
        onOrderComplete();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (orderComplete) {
      setOrderComplete(false);
      setOrderNumber('');
      setFormData({
        buyerName: '',
        buyerPhone: '',
        buyerEmail: '',
        paymentMethod: 'transfer'
      });
    }
    onClose();
  };
  if (!isOpen) return null;
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} data-unique-id="c10fdd6f-7472-42e6-8bab-f5bc3ebc4887" data-file-name="components/CheckoutModal.tsx" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" data-unique-id="f03d8fa3-989e-4176-ba17-432c83498738" data-file-name="components/CheckoutModal.tsx">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-unique-id="28e56e21-cded-47d8-ad6f-a6ed12cf2d0a" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">
          {orderComplete ?
        // Order Success
        <div className="p-8 text-center" data-unique-id="a1b9d023-e9e8-4b64-a25d-0be6285931cd" data-file-name="components/CheckoutModal.tsx">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" data-unique-id="628a7d9d-f55b-4e09-9bbd-aa1cf21dbdce" data-file-name="components/CheckoutModal.tsx">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="87a92b29-983c-46c8-bb39-30c2a07716bd" data-file-name="components/CheckoutModal.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="8f0a1aab-ca6f-4848-b75a-1a48b585aaeb" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="c902b15a-6cb2-42cc-8023-002a6e505389" data-file-name="components/CheckoutModal.tsx">Pesanan Berhasil!</span></h2>
              <p className="text-gray-600 mb-4" data-unique-id="19226c3c-3f64-482e-953b-8f8b2a6399f7" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="6387d7c8-f304-4d1a-bbdb-51f25d012b81" data-file-name="components/CheckoutModal.tsx">
                Terima kasih atas pesanan Anda. Nomor pesanan: </span><strong data-unique-id="f83e348a-2509-45c9-841e-acb95e61c7e9" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">{orderNumber}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6" data-unique-id="602face8-2620-4c2d-92f1-d9c11f64e0c7" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="75bd0891-95ed-4c13-82f1-cbe368959bf5" data-file-name="components/CheckoutModal.tsx">
                Silakan lakukan pembayaran sesuai metode yang dipilih. 
                Setelah pembayaran dikonfirmasi, akun Anda akan otomatis didaftarkan dan mendapat akses ke produk.
              </span></p>
              
              <button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors" data-unique-id="5a00a70f-8026-4076-a74a-08cfe4dddc3e" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="348a3b81-7ea4-4607-b313-4723c43c0e42" data-file-name="components/CheckoutModal.tsx">
                Tutup
              </span></button>
            </div> :
        // Checkout Form
        <>
              <div className="flex items-center justify-between p-6 border-b" data-unique-id="19a13b48-5314-4c07-8928-76c414a221d4" data-file-name="components/CheckoutModal.tsx">
                <h2 className="text-xl font-semibold" data-unique-id="f1cec0ba-2937-4686-9ead-54c969a56205" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="72204afb-e129-4fc9-a0d8-239bd6389dca" data-file-name="components/CheckoutModal.tsx">Checkout</span></h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-unique-id="0d6f379f-87c1-4e86-820b-ca50c081c598" data-file-name="components/CheckoutModal.tsx">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6" data-unique-id="0eecda3d-b4a5-4f14-8b55-8b58941d7166" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">
                {/* Order Summary */}
                <div className="mb-6" data-unique-id="0343a264-1ce5-4055-927a-b5c6a9aa933d" data-file-name="components/CheckoutModal.tsx">
                  <h3 className="font-semibold mb-3" data-unique-id="f0f41fb1-1b86-4df1-a78e-4169a94cce44" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="5e9fecd6-2bf8-4ca8-b87c-bbd532f949d9" data-file-name="components/CheckoutModal.tsx">Ringkasan Pesanan</span></h3>
                  <div className="space-y-2" data-unique-id="73190fe3-816b-4d83-99f2-f2247a7b77f1" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">
                    {cartItems.map(item => <div key={item.cartItem.id} className="flex justify-between text-sm" data-unique-id="b37a8e24-cdb0-4240-abd2-2d81ef75e5e6" data-file-name="components/CheckoutModal.tsx">
                        <span data-unique-id="13988abf-9643-4d75-a6b6-83ed8a2d468e" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">{item.product.name}<span className="editable-text" data-unique-id="aa927401-daed-4341-bc51-2700dc910f45" data-file-name="components/CheckoutModal.tsx"> x</span>{item.cartItem.quantity}</span>
                        <span data-unique-id="45abf22a-df7a-42d1-8364-afe95afc9a35" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">{formatPrice((parseFloat(item.product.price) * item.cartItem.quantity).toString())}</span>
                      </div>)}
                  </div>
                  <div className="border-t pt-2 mt-2" data-unique-id="2a4eef03-a833-4cec-9925-89e14757514a" data-file-name="components/CheckoutModal.tsx">
                    <div className="flex justify-between font-semibold" data-unique-id="d856829c-7450-4d07-9201-09fee944b5d9" data-file-name="components/CheckoutModal.tsx">
                      <span data-unique-id="c5e8121f-13e0-43e2-9624-5e4c1c4ee638" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="9f1fb65f-9c08-46c6-afaf-3f0391495b9f" data-file-name="components/CheckoutModal.tsx">Total:</span></span>
                      <span className="text-blue-600" data-unique-id="6d228e1f-91b1-440f-bfe2-0b4f542dea19" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">{formatPrice(calculateTotal().toString())}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="space-y-4" data-unique-id="91eb2b44-23b9-408d-a6b3-8621afa237de" data-file-name="components/CheckoutModal.tsx">
                  <div data-unique-id="3f965027-357d-40ea-ab51-12b26363c0de" data-file-name="components/CheckoutModal.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="a9755fa9-c3b6-48df-8ad9-d09636c54882" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="0609ff64-128f-472e-b926-6fca47d9569d" data-file-name="components/CheckoutModal.tsx">
                      Nama Lengkap *
                    </span></label>
                    <input type="text" required value={formData.buyerName} onChange={e => setFormData({
                  ...formData,
                  buyerName: e.target.value
                })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="581ae317-4886-42a3-bae4-43561b9cf218" data-file-name="components/CheckoutModal.tsx" />
                  </div>

                  <div data-unique-id="ee30122d-3514-49e3-bf01-1d9efe82a315" data-file-name="components/CheckoutModal.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="04ceac4c-301e-4dd7-afca-712b1c0db045" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="b9bb0a65-9b78-4b47-b305-f7eb49c82b84" data-file-name="components/CheckoutModal.tsx">
                      Nomor HP *
                    </span></label>
                    <input type="tel" required value={formData.buyerPhone} onChange={e => setFormData({
                  ...formData,
                  buyerPhone: e.target.value
                })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="80ee5213-5378-40ce-a405-82b304fda16d" data-file-name="components/CheckoutModal.tsx" />
                  </div>

                  <div data-unique-id="d3ce661c-c7cf-4fce-a3f3-8efc7a0b760b" data-file-name="components/CheckoutModal.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="68b6c5e9-bb02-4955-92da-a0f60a6c8e9f" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="6a431448-489a-417f-a7ed-f8ab9aa2a8b0" data-file-name="components/CheckoutModal.tsx">
                      Email *
                    </span></label>
                    <input type="email" required value={formData.buyerEmail} onChange={e => setFormData({
                  ...formData,
                  buyerEmail: e.target.value
                })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="4e2f7e93-74f4-40e5-b9b7-3ef0cc848582" data-file-name="components/CheckoutModal.tsx" />
                  </div>

                  <div data-unique-id="6525fc81-35d2-495f-a726-aef356352a4b" data-file-name="components/CheckoutModal.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="88523e12-84ce-476a-bbd8-a63513993b46" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="52ed183e-0829-4328-91a0-989457da86d2" data-file-name="components/CheckoutModal.tsx">
                      Metode Pembayaran *
                    </span></label>
                    <div className="space-y-2" data-unique-id="0efb4c62-07f0-42ad-bf74-58d20dca26f8" data-file-name="components/CheckoutModal.tsx">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-unique-id="8efee4ee-ba63-4b3a-8d9a-db7635ad8310" data-file-name="components/CheckoutModal.tsx">
                        <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={e => setFormData({
                      ...formData,
                      paymentMethod: e.target.value
                    })} className="mr-3" data-unique-id="3bbf9d53-52b3-4598-80d7-7da7581305ae" data-file-name="components/CheckoutModal.tsx" />
                        <Banknote className="h-5 w-5 mr-2" />
                        <span data-unique-id="36812583-b5af-4baa-8d23-28ceb0531939" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="7c1a9df4-e957-46fc-b8c7-1ac0d1758493" data-file-name="components/CheckoutModal.tsx">Transfer Bank</span></span>
                      </label>
                      
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" data-unique-id="15fc0872-21d5-4178-a184-6befb583372b" data-file-name="components/CheckoutModal.tsx">
                        <input type="radio" name="paymentMethod" value="virtual_account" checked={formData.paymentMethod === 'virtual_account'} onChange={e => setFormData({
                      ...formData,
                      paymentMethod: e.target.value
                    })} className="mr-3" data-unique-id="556aefff-7946-49d2-9588-b6d604a6ad56" data-file-name="components/CheckoutModal.tsx" />
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span data-unique-id="6bfda773-bee8-45a9-bb40-ca03afb4ae0f" data-file-name="components/CheckoutModal.tsx"><span className="editable-text" data-unique-id="918307fc-c668-422a-9bd4-f979072cdde7" data-file-name="components/CheckoutModal.tsx">Virtual Account</span></span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors" data-unique-id="176e68f2-01ab-4ad0-9199-0a0ef62c957c" data-file-name="components/CheckoutModal.tsx" data-dynamic-text="true">
                    {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                  </button>
                </form>
              </div>
            </>}
        </div>
      </div>
    </>;
}