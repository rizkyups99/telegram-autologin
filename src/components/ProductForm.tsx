'use client';

import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
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
interface Category {
  id: number;
  name: string;
}
interface ProductFormProps {
  product?: StorefrontProduct | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}
export default function ProductForm({
  product,
  categories,
  onClose,
  onSuccess
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    imageUrl: product?.imageUrl || '',
    sourceType: product?.sourceType || 'regular',
    sourceCategoryIds: product ? JSON.parse(product.sourceCategoryIds || '[]') : [],
    paymentMethods: product ? JSON.parse(product.paymentMethods || '["transfer"]') : ['transfer'],
    isActive: product?.isActive ?? true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    const data = await response.json();
    return data.url;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }
      const submitData = {
        ...formData,
        imageUrl,
        price: parseFloat(formData.price).toString(),
        sourceCategoryIds: formData.sourceCategoryIds,
        paymentMethods: formData.paymentMethods
      };
      const url = '/api/storefront/products';
      const method = product ? 'PUT' : 'POST';
      if (product) {
        (submitData as any).id = product.id;
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan saat menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sourceCategoryIds: checked ? [...prev.sourceCategoryIds, categoryId] : prev.sourceCategoryIds.filter(id => id !== categoryId)
    }));
  };
  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: checked ? [...prev.paymentMethods, method] : prev.paymentMethods.filter(m => m !== method)
    }));
  };
  const regularCategories = categories.filter(cat => !cat.name.toLowerCase().includes('cloud'));
  const cloudCategories = categories.filter(cat => cat.name.toLowerCase().includes('cloud'));
  return <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" data-unique-id="3a16e892-492c-430c-975b-4a4cd7958750" data-file-name="components/ProductForm.tsx" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" data-unique-id="19d562d5-ec9a-455c-8dea-da60414f8fb7" data-file-name="components/ProductForm.tsx">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-unique-id="a7d8dcfc-d263-4fe4-8517-70ca8755c26c" data-file-name="components/ProductForm.tsx">
          <div className="flex items-center justify-between p-6 border-b" data-unique-id="0f889602-ad65-45f9-aa47-9c951e810192" data-file-name="components/ProductForm.tsx">
            <h2 className="text-xl font-semibold" data-unique-id="caf4ccab-5219-4e67-9296-8af0ed8d1fad" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
              {product ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-unique-id="321afd1f-610d-4890-93be-610e1736e937" data-file-name="components/ProductForm.tsx">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6" data-unique-id="17a3e257-7587-4f00-930e-ec35d5d743d4" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
            {/* Basic Info */}
            <div className="space-y-4" data-unique-id="79d56a92-8e39-4e6c-8b2b-302027e76d88" data-file-name="components/ProductForm.tsx">
              <div data-unique-id="7d64cae2-7b2e-4ad5-9be5-5d0a565cffee" data-file-name="components/ProductForm.tsx">
                <label className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="e91c6be3-2374-4752-8bdd-83f8d443d7c9" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="a8900b87-5175-4a65-ad96-3c4557a03f94" data-file-name="components/ProductForm.tsx">
                  Nama Produk *
                </span></label>
                <input type="text" required value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="8cb524aa-10ae-4bc5-b17c-270006a7346a" data-file-name="components/ProductForm.tsx" />
              </div>

              <div data-unique-id="f05c323d-1ecc-482b-b292-5d9238d3e0ee" data-file-name="components/ProductForm.tsx">
                <label className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="4a4031e4-e4e8-401b-be0a-4a72acf2437c" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="91d7f6d6-3bc5-47c5-bfa5-14826f58c3e2" data-file-name="components/ProductForm.tsx">
                  Deskripsi
                </span></label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="44b8545a-e439-4ef5-b12e-39bc3e09454c" data-file-name="components/ProductForm.tsx" />
              </div>

              <div data-unique-id="c971e9c8-31ac-4820-aae0-fc997fbfbe8d" data-file-name="components/ProductForm.tsx">
                <label className="block text-sm font-medium text-gray-700 mb-1" data-unique-id="0eefa461-6055-420f-8461-92b1fcf84375" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="cd0d5e5c-08d5-495f-b20d-fb4275566950" data-file-name="components/ProductForm.tsx">
                  Harga (IDR) *
                </span></label>
                <input type="number" required min="0" step="1000" value={formData.price} onChange={e => setFormData({
                ...formData,
                price: e.target.value
              })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="b47f76a2-dab5-417e-93f4-97dff31206e5" data-file-name="components/ProductForm.tsx" />
              </div>
            </div>

            {/* Image Upload */}
            <div data-unique-id="fc061eb7-be72-41fd-856e-edb7aa933d3e" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="16eb8741-a92d-4515-8041-b705038359e8" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="92a9bc8b-72b7-48ef-8d0d-c338d51053d2" data-file-name="components/ProductForm.tsx">
                Gambar Produk *
              </span></label>
              
              {(formData.imageUrl || imageFile) && <div className="mb-4" data-unique-id="d082075f-398a-4492-9d6a-de098000b2da" data-file-name="components/ProductForm.tsx">
                  <img src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} alt="Preview" className="w-32 h-40 object-cover rounded-lg border" data-unique-id="cda791da-e82d-4581-b9f0-91a22871bdbd" data-file-name="components/ProductForm.tsx" />
                </div>}
              
              <div className="flex gap-2" data-unique-id="4f77d8bb-8cf5-4276-b7e7-22179332a06d" data-file-name="components/ProductForm.tsx">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" data-unique-id="020db491-a359-42fd-b503-534b881b2ac5" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
                  <Upload className="h-4 w-4" />
                  {imageFile || formData.imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
                </button>
                
                <input type="url" placeholder="Atau masukkan URL gambar" value={formData.imageUrl} onChange={e => setFormData({
                ...formData,
                imageUrl: e.target.value
              })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-unique-id="479db804-57bb-4ba3-845c-804d85c6d09f" data-file-name="components/ProductForm.tsx" />
              </div>
              
              <input ref={fileInputRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" data-unique-id="63345e6e-6a97-4f29-a1ee-5f514cd9e4c9" data-file-name="components/ProductForm.tsx" />
            </div>

            {/* Source Type */}
            <div data-unique-id="11c1a215-19ed-4fa3-8f5f-91e9e82cd690" data-file-name="components/ProductForm.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="c44ad428-cf6c-44e6-8bac-1d11be2140d4" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="0b6ac3f3-3e9b-45c0-bc5a-08c9e1d4a287" data-file-name="components/ProductForm.tsx">
                Tipe Sumber *
              </span></label>
              <div className="flex gap-4" data-unique-id="46ef83e1-21d5-4f2a-a3a8-2afdf58935a5" data-file-name="components/ProductForm.tsx">
                <label className="flex items-center" data-unique-id="c927f022-65ce-48f7-8ebe-1507bceb2e48" data-file-name="components/ProductForm.tsx">
                  <input type="radio" name="sourceType" value="regular" checked={formData.sourceType === 'regular'} onChange={e => setFormData({
                  ...formData,
                  sourceType: e.target.value
                })} className="mr-2" data-unique-id="52393e55-3c42-45f1-98a5-71308bc3a36f" data-file-name="components/ProductForm.tsx" /><span className="editable-text" data-unique-id="3c35444a-eba8-4ca4-b5ee-d94326ea0d04" data-file-name="components/ProductForm.tsx">
                  Kategori Regular
                </span></label>
                <label className="flex items-center" data-unique-id="1f11e31d-7bca-483d-8117-6d6cc6656f6c" data-file-name="components/ProductForm.tsx">
                  <input type="radio" name="sourceType" value="cloud" checked={formData.sourceType === 'cloud'} onChange={e => setFormData({
                  ...formData,
                  sourceType: e.target.value
                })} className="mr-2" data-unique-id="3d8ad72a-f8c2-4e5e-9f40-ac37f0132d8b" data-file-name="components/ProductForm.tsx" /><span className="editable-text" data-unique-id="85fd5286-8eda-466a-8495-9a93ed6d2db6" data-file-name="components/ProductForm.tsx">
                  Kategori Cloud
                </span></label>
              </div>
            </div>

            {/* Categories */}
            <div data-unique-id="38336b13-e54b-41a6-9f7e-392857dee733" data-file-name="components/ProductForm.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="818c8e60-06b2-4c9b-a513-4f234b48b6c7" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="c8f3b627-9fce-4dde-8062-76d164e167af" data-file-name="components/ProductForm.tsx">
                Pilih Kategori *
              </span></label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3" data-unique-id="9eae4a7b-d1a8-45f6-8e7f-e8972d7b3d15" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
                {(formData.sourceType === 'regular' ? regularCategories : cloudCategories).map(category => <label key={category.id} className="flex items-center py-1" data-unique-id="b9da7794-6bfc-40f4-84e8-587ea5de816a" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
                    <input type="checkbox" checked={formData.sourceCategoryIds.includes(category.id)} onChange={e => handleCategoryChange(category.id, e.target.checked)} className="mr-2" data-unique-id="fb0205f8-1930-4835-b997-5512e0f83067" data-file-name="components/ProductForm.tsx" />
                    {category.name}
                  </label>)}
              </div>
            </div>

            {/* Payment Methods */}
            <div data-unique-id="52181858-63fb-4840-92d9-e1ad872c2b82" data-file-name="components/ProductForm.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="5ae35f32-5ba1-4059-bd8e-a469f6f60419" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="03a17139-8787-450b-8231-a4149fc5d79b" data-file-name="components/ProductForm.tsx">
                Metode Pembayaran *
              </span></label>
              <div className="space-y-2" data-unique-id="dab0b8e9-e6f0-4181-9179-c437b3f9bdd6" data-file-name="components/ProductForm.tsx">
                <label className="flex items-center" data-unique-id="a04911db-fe7a-4e36-bfeb-75547dc1151e" data-file-name="components/ProductForm.tsx">
                  <input type="checkbox" checked={formData.paymentMethods.includes('transfer')} onChange={e => handlePaymentMethodChange('transfer', e.target.checked)} className="mr-2" data-unique-id="133c4e17-03a1-4eab-8248-fe934bfebd5c" data-file-name="components/ProductForm.tsx" /><span className="editable-text" data-unique-id="83b6317e-f058-4dba-bec7-f76fbce1b03e" data-file-name="components/ProductForm.tsx">
                  Transfer Bank
                </span></label>
                <label className="flex items-center" data-unique-id="80308e67-f561-4f3f-a7dd-e63d95bedce0" data-file-name="components/ProductForm.tsx">
                  <input type="checkbox" checked={formData.paymentMethods.includes('virtual_account')} onChange={e => handlePaymentMethodChange('virtual_account', e.target.checked)} className="mr-2" data-unique-id="23c9ca51-4cdf-4b46-82fc-de40479d6dcc" data-file-name="components/ProductForm.tsx" /><span className="editable-text" data-unique-id="6e0f59c7-3654-4bc1-8094-caf03841d0a0" data-file-name="components/ProductForm.tsx">
                  Virtual Account
                </span></label>
              </div>
            </div>

            {/* Status */}
            <div data-unique-id="166a92bd-7fd3-4f18-9c17-bf1783a2b397" data-file-name="components/ProductForm.tsx">
              <label className="flex items-center" data-unique-id="e0998d62-701c-40f0-aff1-488806d2abbf" data-file-name="components/ProductForm.tsx">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({
                ...formData,
                isActive: e.target.checked
              })} className="mr-2" data-unique-id="ba8cab00-502c-437a-9acc-bc1b5cafa446" data-file-name="components/ProductForm.tsx" /><span className="editable-text" data-unique-id="693ce5c6-2cf7-441e-9b3e-b33fd8025f44" data-file-name="components/ProductForm.tsx">
                Produk Aktif (tampil di etalase)
              </span></label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t" data-unique-id="86c5d8f4-c162-46fb-b20d-ea680372815e" data-file-name="components/ProductForm.tsx">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors" data-unique-id="70a95809-ef1e-40dd-b1fe-9931d5f433f8" data-file-name="components/ProductForm.tsx"><span className="editable-text" data-unique-id="b730bd15-185b-473c-9fe8-b0746f444c24" data-file-name="components/ProductForm.tsx">
                Batal
              </span></button>
              <button type="submit" disabled={isSubmitting || !formData.name || !formData.price || !formData.imageUrl && !imageFile || formData.sourceCategoryIds.length === 0 || formData.paymentMethods.length === 0} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors" data-unique-id="c3e3c457-3dc7-4a81-a2aa-c7e87dfbb826" data-file-name="components/ProductForm.tsx" data-dynamic-text="true">
                {isSubmitting ? 'Menyimpan...' : product ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>;
}