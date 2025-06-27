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
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="224245e4-d49b-44d3-ada0-55de56947252" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="8cbdb670-052d-41a5-871b-b6f32a39a572" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori - </span>{user.username}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4" data-unique-id="b07b6114-0ab1-4815-9ad4-7f6c92e2e085" data-file-name="components/EditCategoriesDialog.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="e1f3f49e-a987-4213-9704-dab7f830d3c4" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {/* Regular Categories Section */}
            <div className="space-y-6" data-unique-id="2088d4cd-d66a-4dbf-b125-4017f9cff795" data-file-name="components/EditCategoriesDialog.tsx">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2" data-unique-id="60b38e6e-9db2-469f-bceb-5dc5f680e567" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="10f0548f-3ad2-4bc8-a25e-c23e61ace9fb" data-file-name="components/EditCategoriesDialog.tsx">
                Kategori Regular
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="75e59ee1-944d-4996-b484-8fa2070c8830" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                {/* Audio Categories */}
                <div className="border rounded-md p-3 bg-blue-50" data-unique-id="15724b01-9c40-4270-acb5-d8ad861793e6" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-blue-800" data-unique-id="5171bb46-2be5-4d84-9331-1eabe0993a08" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="b901bcd1-d620-4bdf-a962-81ba42629e9c" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="654ba4a6-15dc-44c4-8a47-564cd19ce7a0" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('audio').map(category => <div key={`audio-${category.id}`} className="flex items-center" data-unique-id="5127ec26-e694-4d9c-a0e9-86b59caebc83" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" data-unique-id="916e10a1-934b-4508-8e59-b92a9004be8a" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-unique-id="fddd5bad-c4d6-4d61-9132-69bca3a83713" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('audio').length === 0 && <p className="text-sm text-gray-500" data-unique-id="f0873092-4b95-4dc4-8a8e-6fe151521a9a" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="d6dec832-cb19-471d-96ea-f7aaeafdf5ec" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori audio</span></p>}
                  </div>
                </div>
                
                {/* PDF Categories */}
                <div className="border rounded-md p-3 bg-green-50" data-unique-id="2df175dd-47b5-49da-955a-adfb8c2a61c3" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-green-800" data-unique-id="285ede1c-d0c9-46c9-b313-a3264041a07d" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="3a2c7c8a-98d6-4f07-8506-2e294311d20e" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="d4592cbe-ad0e-44cc-adba-4b648109cd3b" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('pdf').map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-unique-id="6a54f93a-0910-457f-9cea-e6a30a377b68" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" data-unique-id="0088dd9a-61d2-4d51-a33e-242bae44d1c9" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-unique-id="da5b408e-faf1-49ee-87f0-00249f4e34a5" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('pdf').length === 0 && <p className="text-sm text-gray-500" data-unique-id="c7a7ba1f-1a4f-4a15-afb4-61b72bf7e025" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="fe8d67ee-9a3a-4b23-a08e-93ba6a4b6697" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori PDF</span></p>}
                  </div>
                </div>
                
                {/* Video Categories */}
                <div className="border rounded-md p-3 bg-purple-50" data-unique-id="bad06643-c008-458e-b5a0-33c3c755f2de" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-purple-800" data-unique-id="1f070797-b327-418a-bf42-cb2f3af0c295" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="37205c8c-43d2-43c8-82d2-afff7e4b8efe" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="656d73b0-28bd-4ceb-ad79-7ea7dc201191" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('video').map(category => <div key={`video-${category.id}`} className="flex items-center" data-unique-id="265fc68a-d351-48b0-9cdb-00867643e2f1" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2" data-unique-id="8ceb4e78-39fb-424e-a346-d390508f346c" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-unique-id="eb202cc2-bce7-4c29-9a82-aa9232819026" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('video').length === 0 && <p className="text-sm text-gray-500" data-unique-id="fd8194ec-7d61-46a3-9e28-069c7333437f" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="6d8d2cb1-6892-48d4-bcfe-24d7c0591586" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori video</span></p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Categories Section */}
            <div className="space-y-6" data-unique-id="13475df7-c477-4695-ac80-aab30231c938" data-file-name="components/EditCategoriesDialog.tsx">
              <h3 className="text-lg font-semibold text-cyan-700 border-b border-cyan-200 pb-2" data-unique-id="fa31020f-e9b4-4fd5-a475-975454d5da24" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="d4a471e7-6092-4d62-95b2-d1cb3db250b3" data-file-name="components/EditCategoriesDialog.tsx">
                Kategori Cloud
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="e1bf5e28-9ffb-4c0a-9e36-3e297557564b" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                {/* Audio Cloud Categories */}
                <div className="border rounded-md p-3 bg-cyan-50" data-unique-id="72c9e25c-e8e0-4cae-ab12-7eb0a9a71ee1" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-cyan-800" data-unique-id="86e97119-6a51-46b0-a00f-772b9ce10d47" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="5159e5fe-ba0b-4310-b31d-b192168650a3" data-file-name="components/EditCategoriesDialog.tsx">Audio Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="6e258517-1857-4e74-965d-f4dbdf696562" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('audioCloud').map(category => <div key={`audioCloud-${category.id}`} className="flex items-center" data-unique-id="39be2068-1ed7-4320-a40d-46258cc4f821" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-audiocloud-cat-${category.id}`} checked={audioCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('audioCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mr-2" data-unique-id="31f5f19d-d412-4c4c-aecb-9643ee2e2cb2" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-audiocloud-cat-${category.id}`} className="text-sm" data-unique-id="5b459901-a090-4716-80fd-16adb5943d53" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('audioCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="64431f4b-50df-4a07-8c1f-8f93a66c356d" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="f0e4c0d9-9f5c-4211-862d-31bc38ec4d1d" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori audio cloud</span></p>}
                  </div>
                </div>
                
                {/* PDF Cloud Categories */}
                <div className="border rounded-md p-3 bg-teal-50" data-unique-id="c8323b40-e2bc-457e-9560-cef21f70583f" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-teal-800" data-unique-id="1a49ef07-03cc-4030-a366-4ea31772f7e1" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="4d41699f-4fc7-4682-a6f4-95e44454f06a" data-file-name="components/EditCategoriesDialog.tsx">PDF Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="c60ca646-954e-4c08-be1c-bad1277d6118" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('pdfCloud').map(category => <div key={`pdfCloud-${category.id}`} className="flex items-center" data-unique-id="66f4195e-e26a-4b9e-83d8-5f3161e891a7" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-pdfcloud-cat-${category.id}`} checked={pdfCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('pdfCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2" data-unique-id="09231fc7-18a2-4a64-8d67-5cff1057d7dd" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-pdfcloud-cat-${category.id}`} className="text-sm" data-unique-id="31e41b38-0b3e-40c0-8812-0bdb643484e3" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('pdfCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="8ea5888a-3903-4dd7-9e14-4480bc191f1c" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="47c02028-6fe6-4ffc-8369-f803bdf4b00e" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori PDF cloud</span></p>}
                  </div>
                </div>
                
                {/* File Cloud Categories */}
                <div className="border rounded-md p-3 bg-amber-50" data-unique-id="55407773-cb8e-46b0-81f6-2ab0d3b5f0e7" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-amber-800" data-unique-id="0e955f6e-afa4-4f21-aa1a-39d397255f66" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="46528397-9d8f-44f2-a08c-22223fd9054d" data-file-name="components/EditCategoriesDialog.tsx">File Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="c27e3856-0cd9-47a8-a493-451817e8198a" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('fileCloud').map(category => <div key={`fileCloud-${category.id}`} className="flex items-center" data-unique-id="8765743b-b561-449a-b385-6425e2effbd5" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-filecloud-cat-${category.id}`} checked={fileCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('fileCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mr-2" data-unique-id="9dc8128e-5bf2-475f-8d1f-2870ce09ee08" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-filecloud-cat-${category.id}`} className="text-sm" data-unique-id="584ed3f5-4273-4f1e-86ed-87f1f5fd0649" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('fileCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="ccf0cacd-81f5-4038-8605-329040b44101" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="68638ba4-7d80-41e6-83ca-92e373f749e7" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori file cloud</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="46ff067c-a36f-4b68-bddb-c2cbb319e1da" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="778cba5f-0178-40bc-ad8f-0e14c7ff43e6" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={handleSave} disabled={isLoading} data-unique-id="18d08097-9cd9-4714-9041-8006af2a0ee3" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="3153b60a-c68c-461f-a4ac-6220601dedb4" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="c0ff5694-acb8-4f5b-bb0f-aca0481c135d" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="2f1701b7-959f-4480-848a-d183d8a1e900" data-file-name="components/EditCategoriesDialog.tsx">
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