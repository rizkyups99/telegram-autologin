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
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="d4604493-f573-4526-904e-038070634ab5" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="4f71f37b-fa74-4db8-9d91-6a8cf1edd01a" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori</span></DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4" data-unique-id="968a1f5d-c2cd-4c2a-9f70-d38d9d2bb3c3" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
          {/* Audio Categories */}
          <div className="border rounded-md p-3" data-unique-id="ff2db825-c71a-4a4c-9514-ef0ae99cdae5" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="b3ad89db-f53d-49ce-9217-42482f6ea900" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="f874d3d8-e43a-468b-b38d-315009cdce3e" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="d89850e7-76eb-4762-b4b8-c911bafb02c7" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="fad99260-d1ac-44ea-baef-4613f0828c00" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => onCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="779f5c02-336d-4140-8af8-1c222424e046" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="51c4396e-0049-470c-a4b3-24de5e2b85c0" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="42accbeb-36a4-496c-99f7-b49ed728b49a" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="ee43a916-0df6-4272-9580-a5c1006bc69a" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* PDF Categories */}
          <div className="border rounded-md p-3" data-unique-id="ec4b0d9a-4b59-418e-955c-4fb6af9baf07" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="a3bc50a2-a208-4c91-b833-3810a693315f" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="79ac09b4-6770-4899-8d3e-50e291772f6e" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="6a93c38b-ddd2-4c55-ac24-bab0c1d023dd" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => {
              const upperName = category.name.toUpperCase();
              return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
            }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="2697ff35-9aa2-4c70-ad82-5080ca65d3f0" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => onCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="cc0c14db-f0d1-4367-9566-ecaddcb32faa" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="2240e731-cf9d-4716-9e3f-e8444a090eac" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="f8d74e85-3a68-47e1-b371-7029cdf3c8ca" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="c4355f0a-99be-4e47-9d31-8814ef8517a4" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* Video Categories */}
          <div className="border rounded-md p-3" data-unique-id="28cf5f49-345b-4b75-af72-a5e8edbba2d4" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="b1317ddb-0f97-45bb-9e17-2b7298aef55b" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="a36ad4c2-122f-4c5c-bb51-e72f05ff2cc6" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="0697bfbe-284e-4ccf-a403-3f0e09ea5d49" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="b9c34490-2154-4449-baf8-5b65a21a693c" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => onCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="5523e1a3-863a-44a5-b020-6f99b98723ef" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="cb5e0054-7224-4b9d-aafe-33d56c93c634" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="ba75e51d-8fce-4259-aa9e-cc47a3637cd6" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="78688ca1-cc5c-4bef-83e1-b0329226a0d8" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="298873ab-c1bd-4a22-b2d3-ade15a73aa47" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="1e7245ae-25e5-4b29-9f44-929c23e180e8" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={onSave} disabled={isLoading} data-unique-id="e807af63-c55d-4a9c-9b01-14011c445a36" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="dabad9eb-6b0b-4ca8-9c75-377713d9af76" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="29908fcd-6280-4c40-8bd7-5a02e062b325" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="a725dbbd-ec8b-46d0-bbcc-376231b454ff" data-file-name="components/EditCategoriesDialog.tsx">
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