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
}
export function PDFCategoryItem({
  category,
  isExpanded,
  toggleCategory,
  onDownloadPDF,
  onReadPDF,
  downloadStatus
}: PDFCategoryItemProps) {
  return <div key={category.id} className="border rounded-lg overflow-hidden" data-unique-id="447a3146-dc50-446f-bfa2-b3e14e82cc84" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="429ab66b-c3a1-4590-85a1-29136666a57f" data-file-name="components/preview/pdf/PDFCategoryItem.tsx">
        <div data-unique-id="047bee9e-23d8-4bd5-870b-ec43030e8b58" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="3cef7d70-c745-4143-9857-c9875b05a25b" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="2e418a36-4819-401f-a337-46cf57e471fb" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="a383d95f-02cf-45c7-8797-361f30a5c923" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-unique-id="6dbcda4c-900b-4e50-aa9a-52165c863a1c" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {category.pdfs.map(pdf => <PDFItem key={pdf.id} pdf={pdf} onDownloadPDF={onDownloadPDF} onReadPDF={onReadPDF} downloadStatus={downloadStatus} />)}
        </div>}
    </div>;
}