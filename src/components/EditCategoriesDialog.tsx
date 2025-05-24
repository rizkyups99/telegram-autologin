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
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="1607dc43-f262-4118-ade4-febcd91e5781" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="b17b8b07-9cf7-46e2-bbcc-84f42c4fd95e" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori</span></DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4" data-unique-id="7bedb607-4965-4064-ac22-06a4cdd9f1b7" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
          {/* Audio Categories */}
          <div className="border rounded-md p-3" data-unique-id="8a420d24-5acc-4102-a6b0-4c6b2e746bab" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="23bf6f9c-5d14-4391-889d-8d8f0405307a" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="9a832e25-7cce-400f-bc1a-91120c3cda66" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="a87f824f-df17-4eeb-80cd-97549a8843b9" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="9357ef63-8802-451f-900f-3bfb0cc4c828" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => onCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="62eb45bc-af86-437d-b239-4dc5b3c9145a" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="3f7858ee-7f90-4f66-8445-02cbce5741fc" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="4ef3c025-cc98-4ab2-a3f9-d9c0535243ec" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="b29f273c-fd8f-4e71-92af-98969fd3799b" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* PDF Categories */}
          <div className="border rounded-md p-3" data-unique-id="60438f03-3c9c-487e-925a-f65abe74321f" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="ffa497f3-6ac5-417f-ac29-82a66ba5f2f5" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="1b3d505a-debb-43ce-9ef1-72714d869dfe" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="d023f51d-33ab-4895-b56c-4097dbc05454" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => {
              const upperName = category.name.toUpperCase();
              return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
            }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="fa88a193-8bb4-4393-8015-81435ef22dde" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => onCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="f17b32e4-5275-4d32-8ee7-b2dfb996ea66" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="932af808-bea6-4b44-bc94-b9ed9ad871ec" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="615116dc-40d2-4bff-b355-d9451f3862c8" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="a27c37cb-ea80-4f7d-a3f2-11addfe6b744" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* Video Categories */}
          <div className="border rounded-md p-3" data-unique-id="dc83237f-f2fa-459a-9c3d-3fb8ad43f83f" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="061231d3-bda2-4cdf-a627-3e7198d1efd3" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="ac87b4c9-6c2a-4d6d-87bf-9b478f2f2597" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="80b08fae-b499-4de3-9e02-c6a662cbabe5" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="6860f859-8218-40d1-b57e-d47dedd449ec" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => onCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="ab82e188-c4f2-48ed-8120-6d22599b457f" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="20367e80-068f-4b1c-b56d-14fcbdc6d7f4" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="4326ffca-0780-4750-ac38-14d5c2c48ae0" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="3a9ed9af-ccff-4c78-84ca-1dc649d3b5f8" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="7cf01288-3958-498d-bac1-89756f77e0b6" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="aa68eff0-c7e4-48cf-b2b0-35e723f97488" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={onSave} disabled={isLoading} data-unique-id="853f5a65-87b6-47f6-8d03-ad3c25156d4b" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="6750281a-6138-4146-8260-f558db9b4f2e" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="51e2e057-adc6-4968-afb6-91bd55481cc2" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="4e957f0b-4e84-47f8-bf55-e1c14f7e2211" data-file-name="components/EditCategoriesDialog.tsx">
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