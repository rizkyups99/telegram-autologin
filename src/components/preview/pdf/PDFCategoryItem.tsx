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
  return <div key={category.id} className="border rounded-lg overflow-hidden" data-unique-id="e98c68f7-88ae-42e2-8e75-aefb049dc3e9" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="d105d4a7-c25f-4e2b-9390-bd3e9ddbaf2a" data-file-name="components/preview/pdf/PDFCategoryItem.tsx">
        <div data-unique-id="e4e24c26-9861-4ddd-be5c-992bdc17d34d" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="864b3c47-08f5-440d-8527-7a3e6cdad5ce" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="abed3dfe-9864-40d3-ac0d-93346f4bd7fc" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="14d5c887-78ab-490d-8710-43e2dd0fa18e" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" data-unique-id="3effa1d3-66a5-4db1-89c7-bd4deb5f3098" data-file-name="components/preview/pdf/PDFCategoryItem.tsx" data-dynamic-text="true">
          {category.pdfs.map(pdf => <PDFItem key={pdf.id} pdf={pdf} onDownloadPDF={onDownloadPDF} onReadPDF={onReadPDF} downloadStatus={downloadStatus} />)}
        </div>}
    </div>;
}