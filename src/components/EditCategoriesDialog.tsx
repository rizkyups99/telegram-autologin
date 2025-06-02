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
  return <Dialog open={isOpen} onOpenChange={onClose} data-unique-id="5ed27a21-6060-462f-b68e-1e0ac42542b2" data-file-name="components/EditCategoriesDialog.tsx">
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle><span className="editable-text" data-unique-id="ccaa5607-8e12-40b8-9109-8a466080275b" data-file-name="components/EditCategoriesDialog.tsx">Edit Akses Kategori</span></DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4" data-unique-id="b4d7d47d-a113-4cb9-851c-c095aad6fd10" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
          {/* Audio Categories */}
          <div className="border rounded-md p-3" data-unique-id="8a0a5d03-4e2b-4be3-b40a-219d9d6001ff" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="b623ecef-2991-4f6e-a98b-73274680b847" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="2e9c9aac-0118-487e-b141-529a21d42b02" data-file-name="components/EditCategoriesDialog.tsx">Kategori Audio</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="54676aba-51fa-494f-8224-59645e0bb785" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="39542c0c-4381-4831-adb0-3aab4b988598" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-audio-cat-${category.id}`} checked={audioCategoryIds.includes(category.id)} onChange={e => onCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="1bf50c65-eaad-4b5a-9da8-99e7c39134b0" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="3a179fc0-64c2-4d9d-8e72-a3d58ced360e" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="f66f439d-fab3-430e-905e-ed9106b248a5" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="9deef276-c9ab-43c0-9967-05e5b5dceb82" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* PDF Categories */}
          <div className="border rounded-md p-3" data-unique-id="581fdaed-cc16-4504-9bbd-3d8ee1791d84" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="f7d46252-7bf6-4cd8-b65c-c098f8ae387e" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="80d7e261-bcee-41c5-850e-f26fcfabd6d3" data-file-name="components/EditCategoriesDialog.tsx">Kategori PDF</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="3e17b420-aa27-45ec-8a8c-b43303596e6d" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => {
              const upperName = category.name.toUpperCase();
              return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
            }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="f79f3cdd-d126-4c54-9e40-941d70d78c11" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-pdf-cat-${category.id}`} checked={pdfCategoryIds.includes(category.id)} onChange={e => onCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="e3f1d986-ab8a-4619-9226-c419283a42e0" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="01826260-696c-4101-9d95-653d5a19c953" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="4258be7f-9cdb-45c0-bf93-46fe69131ff1" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="53611762-9aee-45a9-b547-690560d43ce2" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
          
          {/* Video Categories */}
          <div className="border rounded-md p-3" data-unique-id="3bbf532f-dea7-44ef-a71d-3549d735e440" data-file-name="components/EditCategoriesDialog.tsx">
            <h5 className="font-medium mb-2 text-sm" data-unique-id="04e4f34b-0eaf-49d9-8d21-8e2e3a9bf61f" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="85882003-e40e-4988-b7bb-fd7dcf4c2b2e" data-file-name="components/EditCategoriesDialog.tsx">Kategori Video</span></h5>
            <div className="space-y-2 max-h-60 overflow-y-auto" data-unique-id="b441c674-cc41-4b50-9472-be3c322d6c23" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
              {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="ac593b37-89cf-4f19-8685-ecfa4cb82c93" data-file-name="components/EditCategoriesDialog.tsx">
                    <input type="checkbox" id={`dialog-video-cat-${category.id}`} checked={videoCategoryIds.includes(category.id)} onChange={e => onCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="ba5de48c-1c49-4a1d-92c8-fadd29078b9e" data-file-name="components/EditCategoriesDialog.tsx" />
                    <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="d3b01097-a90b-42d4-8d38-843a50093bc9" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
                      {category.name}
                    </label>
                  </div>)}
              {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="c9449606-a408-4e1b-b5f6-c84f71f01bec" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="5b670430-de07-4b62-8a1f-49fe71b9c7d9" data-file-name="components/EditCategoriesDialog.tsx">Tidak ada kategori</span></p>}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-unique-id="19f0baf3-1c6e-436a-9590-0389122e7528" data-file-name="components/EditCategoriesDialog.tsx"><span className="editable-text" data-unique-id="6dcb699e-92ac-49a1-982b-857aca51146f" data-file-name="components/EditCategoriesDialog.tsx">
            Batal
          </span></Button>
          <Button onClick={onSave} disabled={isLoading} data-unique-id="33602cf2-3e43-46f3-8afb-f617b695fc79" data-file-name="components/EditCategoriesDialog.tsx" data-dynamic-text="true">
            {isLoading ? <span className="flex items-center" data-unique-id="6750438f-f92f-4ee8-94d6-cfc98b701b08" data-file-name="components/EditCategoriesDialog.tsx">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="315f6957-e176-40f4-b5f5-6530d38109c8" data-file-name="components/EditCategoriesDialog.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg><span className="editable-text" data-unique-id="70113764-9318-4998-986d-58dec855a141" data-file-name="components/EditCategoriesDialog.tsx">
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