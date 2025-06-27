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
  return <div key={category.id} className="border rounded-lg overflow-hidden" data-unique-id="e8aea4d5-f06a-47f5-996d-e263f0bf99ec" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="367515f9-ea4c-491d-8e69-7a918979e460" data-file-name="components/preview/pdf/PDFCategoryItem.tsx">
        <div data-unique-id="0c5fe337-866e-43c7-b888-b0c1c996eb58" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="329ce078-1bbd-4b8c-acc8-f068cbe65ae5" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="ca4209ef-d40b-4e59-9853-54f91fd53565" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="5b3c56d8-b9e0-4216-8ced-14176498602b" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-unique-id="67e0c552-ae9a-482b-8953-cb1e2980e065" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {category.pdfs.map(pdf => <PDFItem key={pdf.id} pdf={pdf} onDownloadPDF={onDownloadPDF} onReadPDF={onReadPDF} downloadStatus={downloadStatus} currentReadingPDF={currentReadingPDF} />)}
        </div>}
    </div>;
}