'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';
import ProductForm from './ProductForm';
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
  createdAt: string;
}
interface Category {
  id: number;
  name: string;
}
export default function AdminSellerPage() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StorefrontProduct | null>(null);
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/storefront/all');
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
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const handleEditProduct = (product: StorefrontProduct) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const response = await fetch(`/api/storefront/products?id=${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const handleFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };
  const handleFormSuccess = () => {
    fetchProducts();
    handleFormClose();
  };
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseFloat(price));
  };
  return <div className="min-h-screen bg-gray-50" data-unique-id="2ef393ff-e049-481a-90e7-f473fc952c0e" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-unique-id="dd784c18-3ade-4b26-a4e4-1b4f6f63523d" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="mb-8" data-unique-id="14763d37-367e-457f-8ea2-e9cbd65d4a2f" data-file-name="components/AdminSellerPage.tsx">
          <div className="flex justify-between items-center" data-unique-id="14abe3e2-85cf-4d0e-8d62-b3827afc94a0" data-file-name="components/AdminSellerPage.tsx">
            <div data-unique-id="c7c5f6c1-5e95-4847-99cf-0688dbc9d165" data-file-name="components/AdminSellerPage.tsx">
              <h1 className="text-3xl font-bold text-gray-900" data-unique-id="f3a1c8f4-6bd8-4811-a7f9-b71240021351" data-file-name="components/AdminSellerPage.tsx"><span className="editable-text" data-unique-id="f6edc6ce-684c-441a-86ea-4734897eacdb" data-file-name="components/AdminSellerPage.tsx">Kelola Produk Etalase</span></h1>
              <p className="text-gray-600 mt-2" data-unique-id="2a853ba3-5307-4344-b0e1-8599d253ffda" data-file-name="components/AdminSellerPage.tsx"><span className="editable-text" data-unique-id="9bc23425-e726-4bd9-9ff3-1ba3e54987cf" data-file-name="components/AdminSellerPage.tsx">Tambah dan kelola produk yang akan dijual di etalase</span></p>
            </div>
            
            <div className="flex gap-3" data-unique-id="05d8d06f-cdac-4266-87bd-776dbb03e6b1" data-file-name="components/AdminSellerPage.tsx">
              <a href="/etalase" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" data-unique-id="f09c48b4-aafc-4fdd-8035-1924fdf01ac6" data-file-name="components/AdminSellerPage.tsx">
                <Eye className="h-4 w-4" /><span className="editable-text" data-unique-id="b9ed2076-618e-4410-82b3-d3a71187c1cd" data-file-name="components/AdminSellerPage.tsx">
                Lihat Etalase
              </span></a>
              
              <button onClick={() => setShowProductForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" data-unique-id="4e775019-755b-485f-beec-40498c13166b" data-file-name="components/AdminSellerPage.tsx">
                <Plus className="h-4 w-4" /><span className="editable-text" data-unique-id="f6be00a4-2572-42a5-834e-514cba14430c" data-file-name="components/AdminSellerPage.tsx">
                Tambah Produk
              </span></button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-unique-id="6d63dbbe-e557-4fd0-82b3-687e2331cb68" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
            {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse" data-unique-id="92bee04f-4189-4c44-9bc6-96ab4af1f08c" data-file-name="components/AdminSellerPage.tsx">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4" data-unique-id="cb398f07-6dec-4bde-99af-fb6e0bec36c4" data-file-name="components/AdminSellerPage.tsx"></div>
                <div className="h-4 bg-gray-200 rounded mb-2" data-unique-id="8cda4127-12e0-4832-886e-ac60d4c00c2e" data-file-name="components/AdminSellerPage.tsx"></div>
                <div className="h-3 bg-gray-200 rounded mb-4" data-unique-id="30dd5353-1830-4f6a-82f5-3ac455daae7d" data-file-name="components/AdminSellerPage.tsx"></div>
                <div className="flex gap-2" data-unique-id="8562bcf7-5abc-4c26-b89f-4c4d459ff76f" data-file-name="components/AdminSellerPage.tsx">
                  <div className="h-8 bg-gray-200 rounded flex-1" data-unique-id="084002f4-b98f-4d5d-9166-7de47765a3df" data-file-name="components/AdminSellerPage.tsx"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1" data-unique-id="c27b9921-54bb-4f5b-8254-bec95a8e1564" data-file-name="components/AdminSellerPage.tsx"></div>
                </div>
              </div>)}
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-unique-id="413aaed4-c692-4f8a-9bf8-ad6f440b29aa" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
            {products.map(product => <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow" data-unique-id="4b585efd-b51b-499e-b59f-d6bf10f9033c" data-file-name="components/AdminSellerPage.tsx">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg" data-unique-id="543ddfb8-4785-4710-a9fb-4c645808b426" data-file-name="components/AdminSellerPage.tsx">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" data-unique-id="11284beb-5c58-4359-a898-520dca09c47d" data-file-name="components/AdminSellerPage.tsx" />
                </div>
                
                <div className="p-4" data-unique-id="326cb970-ae4b-48c7-b966-cf84109b777e" data-file-name="components/AdminSellerPage.tsx">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" data-unique-id="83cd5392-b721-4d0d-b0d3-dae4520e3dc8" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
                    {product.name}
                  </h3>
                  
                  <p className="text-blue-600 font-bold mb-2" data-unique-id="2bcbd303-cb22-4e62-a162-a9962664f224" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
                    {formatPrice(product.price)}
                  </p>
                  
                  <div className="flex gap-2 mb-3" data-unique-id="adcb14f7-0475-412a-83f7-089d878c6622" data-file-name="components/AdminSellerPage.tsx">
                    <span className={`text-xs px-2 py-1 rounded ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} data-unique-id="1ca11998-b4c2-45c9-ab63-3fd358688c1c" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
                      {product.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded" data-unique-id="f6d9eec5-3e9b-401a-bdbe-03a77d999db8" data-file-name="components/AdminSellerPage.tsx" data-dynamic-text="true">
                      {product.sourceType === 'regular' ? 'Regular' : 'Cloud'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2" data-unique-id="8923ee81-6273-455d-bbdc-a1245a955104" data-file-name="components/AdminSellerPage.tsx">
                    <button onClick={() => handleEditProduct(product)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors" data-unique-id="727afc1d-1239-4376-9cdd-84e73a65e52a" data-file-name="components/AdminSellerPage.tsx">
                      <Edit className="h-3 w-3" /><span className="editable-text" data-unique-id="57b4aadc-eb91-4ee6-a1c8-b9c701d35f81" data-file-name="components/AdminSellerPage.tsx">
                      Edit
                    </span></button>
                    
                    <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors" data-unique-id="e16b88ce-0128-4e44-835d-06bae93610ea" data-file-name="components/AdminSellerPage.tsx">
                      <Trash2 className="h-3 w-3" /><span className="editable-text" data-unique-id="4d947f8c-2fcc-4f58-ac20-123f1de8fead" data-file-name="components/AdminSellerPage.tsx">
                      Hapus
                    </span></button>
                  </div>
                </div>
              </div>)}
          </div>}

        {!isLoading && products.length === 0 && <div className="text-center py-12" data-unique-id="0d97483a-b907-40cc-a9ec-d8cbccc79930" data-file-name="components/AdminSellerPage.tsx">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" data-unique-id="72d7eb38-f353-488a-bda8-fd55e3f7a500" data-file-name="components/AdminSellerPage.tsx">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-unique-id="a3ec956c-055a-4b16-8da8-30f211b6f66f" data-file-name="components/AdminSellerPage.tsx"><span className="editable-text" data-unique-id="c7475638-0673-4411-afc5-936998b6b02e" data-file-name="components/AdminSellerPage.tsx">
              Belum ada produk
            </span></h3>
            <p className="text-gray-600 mb-4" data-unique-id="78bf07f2-833e-4e49-b6bd-fe353a78f812" data-file-name="components/AdminSellerPage.tsx"><span className="editable-text" data-unique-id="7491783d-b817-47f3-a8a2-15fe2cc3c12c" data-file-name="components/AdminSellerPage.tsx">
              Mulai dengan menambahkan produk pertama untuk etalase Anda
            </span></p>
            <button onClick={() => setShowProductForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors" data-unique-id="f07909e8-56f6-4e3b-811a-1c524cb896af" data-file-name="components/AdminSellerPage.tsx"><span className="editable-text" data-unique-id="949bae4c-55a6-4fe1-a142-a0dbb31b7b1d" data-file-name="components/AdminSellerPage.tsx">
              Tambah Produk Pertama
            </span></button>
          </div>}
      </div>

      {/* Product Form Modal */}
      {showProductForm && <ProductForm product={editingProduct} categories={categories} onClose={handleFormClose} onSuccess={handleFormSuccess} />}
    </div>;
}