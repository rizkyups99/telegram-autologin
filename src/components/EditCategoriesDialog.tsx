'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Save } from 'lucide-react';
interface User {
  id: number;
  username: string;
  name?: string;
  // Regular category access
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
  // Cloud category access
  audioCloudCategoryIds?: number[];
  pdfCloudCategoryIds?: number[];
  fileCloudCategoryIds?: number[];
}
interface Category {
  id: number;
  name: string;
}
interface EditCategoriesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User;
  categories: {
    regularCategories: Category[];
    cloudCategories: Category[];
  };
}
export default function EditCategoriesDialog({
  isOpen,
  onClose,
  onSave,
  user,
  categories
}: EditCategoriesDialogProps) {
  // Regular categories state
  const [audioCategoryIds, setAudioCategoryIds] = useState<number[]>([]);
  const [pdfCategoryIds, setPdfCategoryIds] = useState<number[]>([]);
  const [videoCategoryIds, setVideoCategoryIds] = useState<number[]>([]);

  // Cloud categories state
  const [audioCloudCategoryIds, setAudioCloudCategoryIds] = useState<number[]>([]);
  const [pdfCloudCategoryIds, setPdfCloudCategoryIds] = useState<number[]>([]);
  const [fileCloudCategoryIds, setFileCloudCategoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state with user's current categories
  useEffect(() => {
    if (user) {
      setAudioCategoryIds(user.audioCategoryIds || []);
      setPdfCategoryIds(user.pdfCategoryIds || []);
      setVideoCategoryIds(user.videoCategoryIds || []);
      setAudioCloudCategoryIds(user.audioCloudCategoryIds || []);
      setPdfCloudCategoryIds(user.pdfCloudCategoryIds || []);
      setFileCloudCategoryIds(user.fileCloudCategoryIds || []);
    }
  }, [user]);
  const handleRegularCategoryChange = (type: 'audio' | 'pdf' | 'video', categoryId: number, checked: boolean) => {
    const setterMap = {
      audio: setAudioCategoryIds,
      pdf: setPdfCategoryIds,
      video: setVideoCategoryIds
    };
    const setter = setterMap[type];
    setter(prev => checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId));
  };
  const handleCloudCategoryChange = (type: 'audioCloud' | 'pdfCloud' | 'fileCloud', categoryId: number, checked: boolean) => {
    const setterMap = {
      audioCloud: setAudioCloudCategoryIds,
      pdfCloud: setPdfCloudCategoryIds,
      fileCloud: setFileCloudCategoryIds
    };
    const setter = setterMap[type];
    setter(prev => checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId));
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          // Regular categories
          audioCategories: audioCategoryIds,
          pdfCategories: pdfCategoryIds,
          videoCategories: videoCategoryIds,
          // Cloud categories
          audioCloudCategories: audioCloudCategoryIds,
          pdfCloudCategories: pdfCloudCategoryIds,
          fileCloudCategories: fileCloudCategoryIds
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update user categories');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating user categories:', error);
      alert('Gagal memperbarui kategori user');
    } finally {
      setIsLoading(false);
    }
  };
  const getRegularCategoriesByType = (type: string) => {
    return categories.regularCategories.filter(category => {
      const upperName = category.name.toUpperCase();
      switch (type) {
        case 'audio':
          return upperName.startsWith('AUDIO');
        case 'pdf':
          return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
        case 'video':
          return upperName.startsWith('VIDEO');
        default:
          return false;
      }
    });
  };
  const getCloudCategoriesByType = (type: string) => {
    return categories.cloudCategories.filter(category => {
      const upperName = category.name.toUpperCase();
      switch (type) {
        case 'audioCloud':
          return upperName.includes('AUDIO');
        case 'pdfCloud':
          return upperName.includes('PDF') || upperName.includes('EBOOK');
        case 'fileCloud':
          return upperName.includes('FILE');
        default:
          return false;
      }
    });
  };
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="f1d6ee52-862c-4f1c-803e-bb8e28d37d99" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="c6b79a1a-98e7-43b5-83b7-a20dc785da54" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori - </span>{user.username}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4" data-unique-id="a6c135d4-9cdd-40ce-a6fe-c3df3c9bf1c0" data-file-name="components/EditCategoriesDialog.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="e3da508c-f585-48e9-8ae1-93ca77a96efc" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {/* Regular Categories Section */}
            <div className="space-y-6" data-unique-id="d5f88f30-2787-42c8-bbf2-d5162c989660" data-file-name="components/EditCategoriesDialog.tsx">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2" data-unique-id="19dec123-2d9c-4fa8-b7ee-c80e1bc5c61a" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="eaad60e5-417d-4cfa-94f2-7a2c539b1795" data-file-name="components/EditCategoriesDialog.tsx">
                Kategori Regular
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="3bcaabe0-2272-4965-a2d1-76ebe321ac88" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                {/* Audio Categories */}
                <div className="border rounded-md p-3 bg-blue-50" data-unique-id="ddc05ccc-97ff-4dfd-a0f1-de6cb33ca3dc" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-blue-800" data-unique-id="de0b27c2-3b77-41bd-a6f6-94aca2cdc9c5" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="de72228e-337e-4e5f-8962-98bcc05814bf" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="639724d5-5cea-446c-9006-c923efb058fb" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('audio').map(category => <div key={`audio-${category.id}`} className="flex items-center" data-unique-id="153643cc-aeb2-4429-ad42-1ec22cbdf7aa" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" data-unique-id="364cac49-66d3-4c0f-85d4-32f3d8216e18" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-unique-id="6b41d063-95aa-4f7a-b03f-87b264ccc7c7" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('audio').length === 0 && <p className="text-sm text-gray-500" data-unique-id="328de943-e330-4c40-8f09-e9bf4443ff95" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="909be394-a6e4-4989-b40e-ce0036e12a36" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori audio</span></p>}
                  </div>
                </div>
                
                {/* PDF Categories */}
                <div className="border rounded-md p-3 bg-green-50" data-unique-id="1ac091b3-8c63-4b21-a4f6-e919a6afe36f" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-green-800" data-unique-id="8ba39b37-175e-4455-b2c8-fb1437c935f1" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="0f80a903-d104-4cd5-9af6-dcc3316f141f" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="87b91509-14ca-4d3c-a37b-3a37e9e44a3f" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('pdf').map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-unique-id="7107f445-1e46-4398-9900-5a61f8831d64" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" data-unique-id="1c026796-125c-49a5-b030-6fde595d519b" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-unique-id="9eafe328-4d3f-4d33-bd6b-f7bc9d9f0f8e" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('pdf').length === 0 && <p className="text-sm text-gray-500" data-unique-id="6354a76b-8671-4821-8943-613d2c81f127" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="78fdc93f-e56d-429a-b670-e2b35defd2ac" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori PDF</span></p>}
                  </div>
                </div>
                
                {/* Video Categories */}
                <div className="border rounded-md p-3 bg-purple-50" data-unique-id="139c8bb3-6f28-49be-985e-618e675423f4" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-purple-800" data-unique-id="ffe39461-164d-41e5-81d8-17ed955d6274" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="976f6cb2-5e3f-4c3d-b67e-1d6addd56beb" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="810be340-536d-4650-8394-7da5e0e2fdba" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('video').map(category => <div key={`video-${category.id}`} className="flex items-center" data-unique-id="c56389ae-e00b-45e4-bd50-6491c0984191" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2" data-unique-id="861483ec-497e-4f62-9674-3b2856c989b8" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-unique-id="5fbac481-64e8-4fea-af75-a94de0ba215d" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('video').length === 0 && <p className="text-sm text-gray-500" data-unique-id="65c62ddf-1fce-4de1-af0a-2a81a04265c5" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="9e9eb7f0-c9d6-40a2-87e2-11e141060766" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori video</span></p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Categories Section */}
            <div className="space-y-6" data-unique-id="c304796d-12dd-4f3a-85bc-e52d9f10bbde" data-file-name="components/EditCategoriesDialog.tsx">
              <h3 className="text-lg font-semibold text-cyan-700 border-b border-cyan-200 pb-2" data-unique-id="c75e1cc0-d2a8-4e41-b6af-d7812213cbe9" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="f6a6bb01-4209-498b-a1ee-9ed38bea6616" data-file-name="components/EditCategoriesDialog.tsx">
                Kategori Cloud
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="fb88b2f2-f649-4cdb-8e83-ef5823d835f7" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                {/* Audio Cloud Categories */}
                <div className="border rounded-md p-3 bg-cyan-50" data-unique-id="ccd8d33e-eb43-497d-9eca-a786e8021ff8" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-cyan-800" data-unique-id="cba9b83f-9e22-408a-842b-9061cb6c47b5" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="070e54c0-d775-4451-b0e6-dd4b738dcbde" data-file-name="components/EditCategoriesDialog.tsx">Audio Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="b7e53626-90c4-410e-aad0-f087438a442a" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('audioCloud').map(category => <div key={`audioCloud-${category.id}`} className="flex items-center" data-unique-id="780e4ae0-08d6-457b-81ec-641cba53ba8d" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-audiocloud-cat-${category.id}`} checked={audioCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('audioCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mr-2" data-unique-id="129339d7-6acf-4211-b480-fff3caf50f37" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-audiocloud-cat-${category.id}`} className="text-sm" data-unique-id="3214eb57-5f94-427a-93c9-1aa4fadddeb7" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('audioCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="d4bd9c85-cd7a-473a-a971-1151f9418a9d" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="8815e78a-6162-4b00-94e6-af28df8cc0be" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori audio cloud</span></p>}
                  </div>
                </div>
                
                {/* PDF Cloud Categories */}
                <div className="border rounded-md p-3 bg-teal-50" data-unique-id="15a4bb58-72de-49de-bb4a-f75108b91213" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-teal-800" data-unique-id="c6ec1339-bddf-4b84-985a-9f3796f3503c" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="5c9deed3-5489-42c7-91a6-c9ed5b32b1f3" data-file-name="components/EditCategoriesDialog.tsx">PDF Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="3d84dc16-c625-4d87-bcc6-1a1e55068270" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('pdfCloud').map(category => <div key={`pdfCloud-${category.id}`} className="flex items-center" data-unique-id="1ff8db52-a79c-4c7e-a612-333bbf1dcf48" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-pdfcloud-cat-${category.id}`} checked={pdfCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('pdfCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2" data-unique-id="c4a88413-73f3-4166-abaf-1b1ab767ceda" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-pdfcloud-cat-${category.id}`} className="text-sm" data-unique-id="6dc7d40a-c777-461d-bb66-85b04cd872bb" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('pdfCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="29b8c5c0-16d7-4c63-88dc-5401e9c6acff" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="c28a9146-f574-42af-8b1d-cfc55888af6f" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori PDF cloud</span></p>}
                  </div>
                </div>
                
                {/* File Cloud Categories */}
                <div className="border rounded-md p-3 bg-amber-50" data-unique-id="e6973985-fde7-4c47-b9aa-599dfaa46592" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-amber-800" data-unique-id="ba2a2537-82a6-45dc-958a-885c81deb2c2" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="1b29c7f8-1ead-4505-9586-ced8aff5f4a4" data-file-name="components/EditCategoriesDialog.tsx">File Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="c810175d-c1c6-40db-a3aa-a94fbed6ee06" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('fileCloud').map(category => <div key={`fileCloud-${category.id}`} className="flex items-center" data-unique-id="058f3f53-a4cb-4185-8f84-1d0b58a04a4b" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-filecloud-cat-${category.id}`} checked={fileCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('fileCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mr-2" data-unique-id="7c3c2b5d-9ab6-40b7-b407-c2651b6fd1fc" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-filecloud-cat-${category.id}`} className="text-sm" data-unique-id="5eadaca5-f217-4b0e-9319-e8f067fbb942" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('fileCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="fbb2dc44-9be3-44ae-9a07-1e0ea9c8e08e" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="3ec3cc71-1365-4363-abff-acef0ec0d9bc" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori file cloud</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="a2515bed-2f82-42d0-a26f-e10e9f3ca236" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="ea6073fd-bc6a-4928-8d85-7abde70db69f" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={handleSave} disabled={isLoading} data-unique-id="243d10fc-7104-43fd-b947-9583ceaa4db1" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="baa20f65-ce8c-4edf-9e64-7199ea4c29da" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="951e60fa-8de5-48e4-916b-c3eeba291e26" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="300741c7-4ec1-4681-a241-7f59ec72f6a0" data-file-name="components/EditCategoriesDialog.tsx">
                Menyimpan...
              </span></span> : <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}