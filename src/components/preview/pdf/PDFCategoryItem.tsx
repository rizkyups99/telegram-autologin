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
  return (
    <div key={category.id} className="border rounded-lg overflow-hidden">
      <div 
        className="bg-muted p-4 flex items-center justify-between cursor-pointer"
        onClick={() => toggleCategory(category.id)}
      >
        <div>
          <h3 className="font-semibold text-lg">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {category.pdfs.map(pdf => (
            <PDFItem 
              key={pdf.id}
              pdf={pdf}
              onDownloadPDF={onDownloadPDF}
              downloadStatus={downloadStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
