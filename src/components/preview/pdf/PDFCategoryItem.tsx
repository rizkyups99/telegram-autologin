'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PDFItem } from './PDFItem';
interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface Category {
  id: number;
  name: string;
  description?: string;
  pdfs: PDF[];
}
interface PDFCategoryItemProps {
  category: Category;
  isExpanded: boolean;
  toggleCategory: (categoryId: number) => void;
  onDownloadPDF: (pdf: PDF) => void;
  downloadStatus: {
    id: number | null;
    status: 'downloading' | 'completed' | null;
  };
}
export function PDFCategoryItem({
  category,
  isExpanded,
  toggleCategory,
  onDownloadPDF,
  downloadStatus
}: PDFCategoryItemProps) {
  return <div key={category.id} className="border rounded-lg overflow-hidden" data-unique-id="3afdb5da-4400-4b1c-80bf-7639fdbcfcf9" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="71c97e04-c966-4e37-8f1c-40e282cd2196" data-file-name="components/preview/pdf/PDFCategoryItem.tsx">
        <div data-unique-id="62eda9de-70d9-4935-9729-37e7ec041888" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="2788a9df-3436-4298-94f3-016665cc2d54" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="1733a30a-2b74-4022-955c-a687d7c033b5" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="91ab2b90-b70d-421b-a7f9-bfe423d77d39" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-unique-id="9ce23c84-5353-4a16-a826-8fb453e7bc26" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {category.pdfs.map(pdf => <PDFItem key={pdf.id} pdf={pdf} onDownloadPDF={onDownloadPDF} downloadStatus={downloadStatus} />)}
        </div>}
    </div>;
}