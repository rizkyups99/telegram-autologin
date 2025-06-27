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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="af275cdf-8491-4c8c-8d3c-504926c2d563" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="3982f0ce-20fc-4566-b15e-061cfce9ee3f" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx">
        <div data-unique-id="177b1a19-d005-438e-9252-b7f8151aaeb1" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="82bc05ed-4b2a-4112-9b74-9e1251fc42e5" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="b5820f84-ca22-4d4d-a631-e44cab8ba45d" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
          <p className="text-sm text-blue-600" data-unique-id="96c1a745-d4fa-4cb5-b19a-b7316b28e1cd" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.files.length}<span className="editable-text" data-unique-id="1595b53a-221d-41bb-af29-37332c720cec" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx"> files</span></p>
        </div>
        <Button variant="ghost" size="sm" data-unique-id="0145118c-3638-4c40-8281-a6a183b9d6c1" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-unique-id="9311aee3-0fa1-4414-8787-345a93fde5e1" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.map(file => <FileCloudItem key={file.id} file={file} />)}
        </div>}
    </div>;
}