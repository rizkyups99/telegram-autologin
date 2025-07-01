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
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="0fdc1b3d-8254-488a-b3c7-49223a4af0a5" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="369bbec9-a2af-4d16-b011-fda99f107978" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori - </span>{user.username}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4" data-unique-id="c9de251f-19cd-4dce-9faa-abc2a9814c54" data-file-name="components/EditCategoriesDialog.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="7ed5187c-55a0-4bce-855b-ec486b01249f" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {/* Regular Categories Section */}
            <div className="space-y-6" data-unique-id="f0dc6c7c-72c8-4e9d-bb12-d4dad7a57e9e" data-file-name="components/EditCategoriesDialog.tsx">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2" data-unique-id="63c009a6-5835-4e9f-ab05-ec0295c64fc4" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="4fbd35bc-5c04-4db4-be35-2a467a8de2ab" data-file-name="components/EditCategoriesDialog.tsx">
                Kategori Regular
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="d53ec25f-fd4b-420e-9abe-0fb064019460" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                {/* Audio Categories */}
                <div className="border rounded-md p-3 bg-blue-50" data-unique-id="63c71985-efbb-414a-ad8e-4c4287d43923" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-blue-800" data-unique-id="9162a4a0-bd0f-4cac-8a90-3efeeb1a9b1c" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="878bda77-b286-4133-ae6d-5d1aacaee084" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="9909787d-89a0-4955-850f-a85b72f2dd06" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('audio').map(category => <div key={`audio-${category.id}`} className="flex items-center" data-unique-id="581f2d57-1fe9-42dd-8081-b7c747fbbaea" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" data-unique-id="c6e66def-307e-4053-a973-e37e110d6004" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-unique-id="d632510e-c948-4195-8c37-16ecb5cdab96" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('audio').length === 0 && <p className="text-sm text-gray-500" data-unique-id="874468e8-898a-47bc-8450-bc34fcf90772" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="cb08f4cc-d61b-4e47-b1cc-d108b6bc7ecf" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori audio</span></p>}
                  </div>
                </div>
                
                {/* PDF Categories */}
                <div className="border rounded-md p-3 bg-green-50" data-unique-id="22e4ddf9-ca98-4c7a-8eba-9006c4d78a5d" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-green-800" data-unique-id="2aee7924-2836-4294-b43f-e5b2a5ed24e8" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="01294ce1-2786-46ea-8a0b-4ff948a9cbdf" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="52c966ee-03ef-484f-b492-bf073ebc6e9b" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('pdf').map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-unique-id="0ee72dc3-8814-45ae-9893-0ea2fc3d9c5c" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" data-unique-id="6e6afcb7-2e76-4137-8ac0-9598dbc50d4c" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-unique-id="30c81a17-c841-4ec9-9ee4-e5d00e375786" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('pdf').length === 0 && <p className="text-sm text-gray-500" data-unique-id="2a1f4834-d8fd-49f6-b994-16c516d1763b" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="b7641ecd-0941-405a-8fa1-fde376270327" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori PDF</span></p>}
                  </div>
                </div>
                
                {/* Video Categories */}
                <div className="border rounded-md p-3 bg-purple-50" data-unique-id="3bd27e85-e8ea-4886-8c50-68c58a55bdc8" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-purple-800" data-unique-id="2137ae41-7fe8-467b-a109-21e8e0fb5141" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="283bbc19-e462-4c82-aef0-b1852a9f536b" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="fe800c3f-9a45-4a01-b719-00ba7380ddb1" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getRegularCategoriesByType('video').map(category => <div key={`video-${category.id}`} className="flex items-center" data-unique-id="420d498d-c839-40c7-831c-d5610cdfdbba" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => handleRegularCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2" data-unique-id="b933921c-9fe6-4111-9579-39503046978b" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-unique-id="b2a24a13-4abf-4fd8-a032-837fdd14dc27" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getRegularCategoriesByType('video').length === 0 && <p className="text-sm text-gray-500" data-unique-id="407f23fa-6a42-4f62-a3e0-90cff31bcd75" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="6c86ca5e-241d-4437-a13c-7186e741b2ff" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori video</span></p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Categories Section */}
            <div className="space-y-6" data-unique-id="b45a4fc3-1da8-4217-a616-01e25beb5989" data-file-name="components/EditCategoriesDialog.tsx">
              <h3 className="text-lg font-semibold text-cyan-700 border-b border-cyan-200 pb-2" data-unique-id="ec0bc43d-2305-4024-ba4c-711778d801ad" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="2cba7145-6257-4394-aa51-388b0b09cf11" data-file-name="components/EditCategoriesDialog.tsx">
                Kategori Cloud
              </span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="fb0a01c1-88ee-4b7f-9437-d102d086935e" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                {/* Audio Cloud Categories */}
                <div className="border rounded-md p-3 bg-cyan-50" data-unique-id="5400544c-86a0-432e-af61-a5c1f56ef0dd" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-cyan-800" data-unique-id="42345be1-166d-47d9-9180-7a6ebcf7413d" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="b58b0419-81e9-4cab-941c-7727c6c37df1" data-file-name="components/EditCategoriesDialog.tsx">Audio Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="ba313037-55b1-4329-8b92-f2569af76f14" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('audioCloud').map(category => <div key={`audioCloud-${category.id}`} className="flex items-center" data-unique-id="3d4c43e2-6063-474d-9fc6-efe8594ddac1" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-audiocloud-cat-${category.id}`} checked={audioCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('audioCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 mr-2" data-unique-id="81128e5c-058f-4e8e-88b4-4ef6affcb6fb" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-audiocloud-cat-${category.id}`} className="text-sm" data-unique-id="6a766c45-8477-4fb7-88ad-904c015f1bac" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('audioCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="fa8f47bd-697c-4734-b585-f84bf19f75fc" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="7ebef7ec-6813-48eb-8f45-293e4a109981" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori audio cloud</span></p>}
                  </div>
                </div>
                
                {/* PDF Cloud Categories */}
                <div className="border rounded-md p-3 bg-teal-50" data-unique-id="7a21afd3-c7e6-4b02-b518-86159ba23408" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-teal-800" data-unique-id="6f3a7745-406b-45a2-ae23-2d88a82b0974" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="c6969ab0-99c1-45c5-89d1-0afcf28a4711" data-file-name="components/EditCategoriesDialog.tsx">PDF Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="a3e3343f-7e50-4767-bf10-294cf6245e90" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('pdfCloud').map(category => <div key={`pdfCloud-${category.id}`} className="flex items-center" data-unique-id="1afa155a-65d1-4a1a-8217-3a54778f7a69" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-pdfcloud-cat-${category.id}`} checked={pdfCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('pdfCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2" data-unique-id="752c1e97-e2be-49f8-875e-e3717c528b66" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-pdfcloud-cat-${category.id}`} className="text-sm" data-unique-id="b9e26474-0c88-4996-87cf-69a04575d6d1" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('pdfCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="da1680e6-6aa5-4418-a261-68647d33a43d" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="0a599e49-b8b7-4a36-b51b-e6f2f8f98ed8" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori PDF cloud</span></p>}
                  </div>
                </div>
                
                {/* File Cloud Categories */}
                <div className="border rounded-md p-3 bg-amber-50" data-unique-id="190e1f5e-5499-43dc-a47e-88bdded2a745" data-file-name="components/EditCategoriesDialog.tsx">
                  <h5 className="font-medium mb-2 text-sm text-amber-800" data-unique-id="aa2de7f6-0a08-4037-8452-b4dd7518a3bd" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="07076e80-4878-4a13-8841-b199bbb07446" data-file-name="components/EditCategoriesDialog.tsx">File Cloud</span></h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto" data-unique-id="aa65f77c-35ef-46dd-9ae9-756ad4bdb684" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                    {getCloudCategoriesByType('fileCloud').map(category => <div key={`fileCloud-${category.id}`} className="flex items-center" data-unique-id="ad96ff55-2b16-4a3e-95d4-c4e74af4fbe5" data-file-name="components/EditCategoriesDialog.tsx">
                        <input type="checkbox" id={`dialog-filecloud-cat-${category.id}`} checked={fileCloudCategoryIds.includes(category.id)} onChange={e => handleCloudCategoryChange('fileCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mr-2" data-unique-id="2687668e-cc4a-4910-89dc-ac9279395a59" data-file-name="components/EditCategoriesDialog.tsx" />
                        <label htmlFor={`dialog-filecloud-cat-${category.id}`} className="text-sm" data-unique-id="b4ae3669-d0d4-4e04-8ef7-85aa5c8f688c" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {getCloudCategoriesByType('fileCloud').length === 0 && <p className="text-sm text-gray-500" data-unique-id="7349ab40-7608-4fca-b27f-c09df85b6c61" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="9f4d3154-9409-47b0-b027-edf001d01bfe" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori file cloud</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="dedb78ca-b2fd-419c-9992-174cc8b206c3" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="33ba9f0b-bf8d-4c89-b98c-5b71de7a7bdb" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={handleSave} disabled={isLoading} data-unique-id="dedd1058-97ef-446b-9d27-794a5a2895d7" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="2ad74d8c-0419-4a04-9d55-c4068a8afe56" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="54a23377-8b49-43d1-94b5-785a9ad098c8" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="a5bc0b3f-b111-4846-a93e-f7e341138f46" data-file-name="components/EditCategoriesDialog.tsx">
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