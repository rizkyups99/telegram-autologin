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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="21329d66-fe93-473c-9846-274353d1442d" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="5453bab4-2264-4390-8227-f27177edb116" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx">
        <div data-unique-id="49066b78-ccac-48d4-a781-35ec1cac3734" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="44a30eee-4bd1-4cbf-861f-fbd974bf40e8" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="4e9e3247-1401-417d-853d-2030279f810a" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
          <p className="text-sm text-blue-600" data-unique-id="348c78ae-9c8b-4a7c-bbed-a4da7bd8f440" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">{category.files.length}<span className="editable-text" data-unique-id="2074a249-d801-4989-a99d-1340857d7483" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx"> files</span></p>
        </div>
        <Button variant="ghost" size="sm" data-unique-id="717d92bf-176c-40b1-9232-aad29a678dee" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-unique-id="b2c02090-b8e1-4b98-9ae8-fc8ce2b79e79" data-file-name="components/preview/cloud/FileCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.map(file => <FileCloudItem key={file.id} file={file} />)}
        </div>}
    </div>;
}