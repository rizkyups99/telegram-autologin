'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AudioCloudItem } from './AudioCloudItem';
interface AudioCloudFile {
  id: number;
  title: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface Category {
  id: number;
  name: string;
  description?: string;
  files: AudioCloudFile[];
}
interface AudioCloudCategoryItemProps {
  category: Category;
  isExpanded: boolean;
  toggleCategory: (categoryId: number) => void;
}
export function AudioCloudCategoryItem({
  category,
  isExpanded,
  toggleCategory
}: AudioCloudCategoryItemProps) {
  return <div className="border rounded-lg overflow-hidden" data-unique-id="ca2212e6-08e0-4f21-8e31-9c2b8903e479" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => toggleCategory(category.id)} data-unique-id="5808a1c8-8791-44c3-ac65-d67bf8c97e33" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx">
        <div data-unique-id="a3719c7c-6f26-4a6f-a917-c7695b0b5e4b" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="83b97315-a2f4-4345-97b0-3ed4b2f1cd16" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="0c6e1265-bab9-4f7e-9a5e-b28fec83d20c" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
          <p className="text-sm text-blue-600" data-unique-id="df1d2cc2-d2c5-4c97-87cb-9272ab8a4820" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.files.length}<span className="editable-text" data-unique-id="56a09992-0186-476c-a9dd-1588f6c4d3ba" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx"> audio files</span></p>
        </div>
        <Button variant="ghost" size="sm" data-unique-id="3b256054-f4a8-4975-bf11-2120c60ef5a0" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-unique-id="67bdb3dc-7d72-4acd-9025-61ceb930d12a" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.map(file => <AudioCloudItem key={file.id} audio={file} />)}
        </div>}
    </div>;
}