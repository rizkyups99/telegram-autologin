'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Save } from 'lucide-react';
interface Category {
  id: number;
  name: string;
}
interface EditCategoriesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
  audioCategoryIds: number[];
  pdfCategoryIds: number[];
  videoCategoryIds: number[];
  onCategoryChange: (type: 'audio' | 'pdf' | 'video', categoryId: number, checked: boolean) => void;
  isLoading: boolean;
}
export default function EditCategoriesDialog({
  isOpen,
  onClose,
  onSave,
  categories,
  audioCategoryIds,
  pdfCategoryIds,
  videoCategoryIds,
  onCategoryChange,
  isLoading
}: EditCategoriesDialogProps) {
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="d3c8de44-9b2f-4203-95f1-c63a72adefae" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="f38e8a02-84e5-4c70-a19b-c9d6f5781d57" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori</span></DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4" data-unique-id="ddd3afd3-d59f-478e-9471-0658f2898cb1" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
          {/* Audio Categories */}
          <div className="border rounded-md p-3" data-unique-id="395dbab7-d0f1-4f15-b2c0-a20111826927" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="6544d140-9b3f-4732-bf01-83f2d339f8fe" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="9aba87b1-8acb-4776-b1bb-1beb40b1f094" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="4043cf03-b583-4a0c-a97a-dd4b3a33b7d5" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="e01939b8-c541-4351-b2b1-de24d1eb09d0" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => onCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="1123ce58-c25a-4ce0-ad4f-078eb353e210" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="1622d9d7-6f6e-4a75-988b-2fe8a333a21a" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="9f7d4f3a-d2da-4fd5-8179-2cfa9c06d882" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="d4ce251b-f2a9-4119-8a6c-4b8dfb47cf08" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* PDF Categories */}
          <div className="border rounded-md p-3" data-unique-id="813346b0-9139-41e0-9e58-1bd98f1c1021" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="a326610a-62a8-4604-8117-0039870eaa0c" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="7ad928a2-ed9e-4511-a96e-c1aae65c58c8" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="d57901d1-beb7-415a-aa7b-62070382b614" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => {
              const upperName = category.name.toUpperCase();
              return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
            }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="eb557ffc-9278-4850-8205-b88fd1bda044" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => onCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="c98f5b3d-2b3c-4aae-85f4-9034e172f8c0" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="70429148-680f-40f9-a7ed-0fd39d52b647" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="0132cfdc-7446-4186-a89e-2a3477fa2acf" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="e56296e5-7555-4202-8ad0-0b8faad6b609" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* Video Categories */}
          <div className="border rounded-md p-3" data-unique-id="d2e06718-2210-4667-94b0-102c43bca1c1" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="92d45756-8191-4cbb-ad5b-f542676de926" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="08ef9f12-5625-4db8-932c-29758e9a8ee6" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="d22af707-8af5-49cd-bcdf-b0432c5565b9" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="dc482a88-2685-4d31-90ad-f253941fa030" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => onCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="3483e935-a014-414b-bb85-df11cd4033de" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="830c32b0-6e92-48a7-bbbf-c642e1b6d944" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="5210e213-c0ee-4683-9c34-5844a4707860" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="c45d3e5d-e209-4d8b-9945-9bbd3bf91a6a" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="b9832b1b-2faf-4e34-82bb-ac45673ab278" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="904df5d9-10e9-4cbd-8d21-85e2f8981c86" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={onSave} disabled={isLoading} data-unique-id="257c6613-f4f3-4de1-bba5-d60d3a3245de" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="3b5b07b0-c9b3-4218-992c-c6e17774a6ee" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="a93d88da-c6dc-40a2-bdf0-d3c2e1e9d253" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="8313426c-238f-43d9-b4d1-2339e05cf9c1" data-file-name="components/EditCategoriesDialog.tsx">
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