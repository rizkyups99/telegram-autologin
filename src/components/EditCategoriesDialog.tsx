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
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="d9bf0f97-8267-4a5c-984d-55865386777c" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="bd7c4653-68cc-407e-92e5-7cfe3b8e5e24" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori</span></DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4" data-unique-id="bf53c49d-7d71-46f1-b311-c018cbdc7b9d" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
          {/* Audio Categories */}
          <div className="border rounded-md p-3" data-unique-id="87f7d3f6-ba8b-46bd-bf23-0251eac84701" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="4b115d1c-ec3c-420e-8db5-0760625abad0" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="1254129d-1605-4c40-be47-c98884922602" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="5fc6d6bc-4beb-469c-9760-5afdb66dbe52" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="09990624-f7ec-4b88-aacb-76816fb2d6c3" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => onCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="9f5e91c4-6716-4f00-9b85-a160471899ca" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="25947b5f-0420-4bde-853b-9c884ab0ee92" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="b483b10b-871b-47f3-ab4e-8d4e0104be5c" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="30f77c3a-94e6-4d31-a7b6-47703fb0d7ef" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* PDF Categories */}
          <div className="border rounded-md p-3" data-unique-id="d5eea9d0-4514-4c93-a644-3bf3a444798a" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="0e769a85-518b-4b8e-8273-bdaa40023601" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="0277fa88-99cc-421c-9156-8fba235b9f1c" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="2bb08352-38e7-4d89-b088-8b542e26d0b3" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => {
              const upperName = category.name.toUpperCase();
              return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
            }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="5bb0afad-14c7-4dd0-8302-4dfaf23365b9" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => onCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="8ecb619d-dc53-4f07-a253-05d003628dec" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="b1368e46-2523-4e26-993d-d9b33255db54" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="272c5751-6865-431d-a857-983e8d3611ec" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="1443f5ab-486a-416e-9d27-848d56c7ea83" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* Video Categories */}
          <div className="border rounded-md p-3" data-unique-id="fc26d720-b4e4-4376-856e-eff1d10931b1" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="94836c92-2475-49d4-b3ce-f8371ea8dea9" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="f11805ce-a0b1-4d1d-8b99-c122bde5e2d2" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="7d8a3add-fb34-47ba-bd88-30e0385f74fe" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="17787aca-be09-4fb5-870c-1619ec5dc422" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => onCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="b67f9396-a779-4939-8d88-c189b8cb522c" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="bc2b6331-cd02-4fc1-8625-93cc540dfbc3" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="8db0d374-349c-48b0-a42d-78436b4b960b" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="6ace2434-cbc7-48a3-9efb-ad2a4e9407c5" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="c83468e2-8d08-4d91-83dd-bf3ef75df247" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="aadc0b39-b582-449c-8e8e-24952c476bae" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={onSave} disabled={isLoading} data-unique-id="82de46e0-301d-4dc9-96fa-77f3921a7c54" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="2e6a5bb4-7c76-4c63-93e3-aea9a1cf8737" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="73581034-3fc7-46d3-bd62-a59b2bbf7584" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="047f0236-7891-4a08-9fb7-4669faeb3d7b" data-file-name="components/EditCategoriesDialog.tsx">
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