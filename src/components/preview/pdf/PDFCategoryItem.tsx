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
  onReadPDF: (pdf: PDF) => void;
  downloadStatus: {
    id: number | null;
    status: 'downloading' | 'completed' | null;
  };
  currentReadingPDF: PDF | null;
}
export function PDFCategoryItem({
  category,
  isExpanded,
  toggleCategory,
  onDownloadPDF,
  onReadPDF,
  downloadStatus,
  currentReadingPDF
}: PDFCategoryItemProps) {
  return <div key={category.id} className="border rounded-lg overflow-hidden" data-unique-id="72c933a8-6743-40e7-9331-41027484dba4" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="d5bf3ab2-04df-4ea7-a28b-7782510534cf" data-file-name="components/preview/pdf/PDFCategoryItem.tsx">
        <div data-unique-id="d8b4ca1c-0c17-4465-ad8d-4bc1e7c94962" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="1a5546d0-369f-42d0-a7d3-ad5fefc381dd" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="392ca034-7ed0-4fa8-8ba6-ea370dd7e12d" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="60fffbb7-33ab-41e2-bc68-ddfc0b43496b" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-unique-id="38d6a559-0638-4eaf-941f-6aa0d53a9ffa" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {category.pdfs.map(pdf => <PDFItem key={pdf.id} pdf={pdf} onDownloadPDF={onDownloadPDF} onReadPDF={onReadPDF} downloadStatus={downloadStatus} currentReadingPDF={currentReadingPDF} />)}
        </div>}
    </div>;
}