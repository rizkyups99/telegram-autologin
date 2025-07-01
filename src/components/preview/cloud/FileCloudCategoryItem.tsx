'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FileCloudItem } from './FileCloudItem';
interface FileCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  fileType?: string | null;
  categoryId: number;
  categoryName?: string;
}
interface Category {
  id: number;
  name: string;
  description?: string;
  files: FileCloudFile[];
}
interface FileCloudCategoryItemProps {
  category: Category;
  isExpanded: boolean;
  toggleCategory: (categoryId: number) => void;
}
export function FileCloudCategoryItem({
  category,
  isExpanded,
  toggleCategory
}: FileCloudCategoryItemProps) {
  return <div className="border rounded-lg overflow-hidden" data-unique-id="a3450b71-d950-4c1f-81be-671cea66b07a" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="7e9ab989-e59a-4596-873d-d2bf4bf0b09d" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx">
        <div data-unique-id="4bf65f3c-e440-4cba-8c09-9954178de5b8" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="aea7c82a-4436-46c9-a1b2-d10662b4c1f3" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="33ec1494-27a8-4d7b-bbaa-0ca3b1334249" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
          <p className="text-sm text-blue-600" data-unique-id="1abe6b18-4bfc-4ff7-bae5-fdb31c63bfe1" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.files.length}<span className="editable-text" data-unique-id="36ab8643-ebcb-4013-bf59-a2e9a3ae6a52" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx"> files</span></p>
        </div>
        <Button variant="ghost" size="sm" data-unique-id="80131d62-e6da-420a-888a-bf23d600864e" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-unique-id="8ec3b2be-e601-4f5b-b4dc-729b3a727c42" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.map(file => <FileCloudItem key={file.id} file={file} />)}
        </div>}
    </div>;
}