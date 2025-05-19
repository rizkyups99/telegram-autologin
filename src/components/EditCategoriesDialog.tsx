'use client';

import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Akses Kategori</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Audio Categories */}
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2 text-sm">Kategori Audio</h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories
                .filter(category => category.name.toUpperCase().startsWith('AUDIO'))
                .map((category) => (
                  <div key={`audio-${category.id}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dialog-audio-cat-${category.id}`}
                      checked={audioCategoryIds.includes(category.id)}
                      onChange={(e) => onCategoryChange('audio', category.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <label htmlFor={`dialog-audio-cat-${category.id}`} className="text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada kategori</p>
              )}
            </div>
          </div>
          
          {/* PDF Categories */}
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2 text-sm">Kategori PDF</h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories
                .filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
                })
                .map((category) => (
                  <div key={`pdf-${category.id}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dialog-pdf-cat-${category.id}`}
                      checked={pdfCategoryIds.includes(category.id)}
                      onChange={(e) => onCategoryChange('pdf', category.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <label htmlFor={`dialog-pdf-cat-${category.id}`} className="text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada kategori</p>
              )}
            </div>
          </div>
          
          {/* Video Categories */}
          <div className="border rounded-md p-3">
            <h5 className="font-medium mb-2 text-sm">Kategori Video</h5>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories
                .filter(category => category.name.toUpperCase().startsWith('VIDEO'))
                .map((category) => (
                  <div key={`video-${category.id}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dialog-video-cat-${category.id}`}
                      checked={videoCategoryIds.includes(category.id)}
                      onChange={(e) => onCategoryChange('video', category.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <label htmlFor={`dialog-video-cat-${category.id}`} className="text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada kategori</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
