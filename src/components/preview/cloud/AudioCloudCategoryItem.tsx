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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="2b4de979-477b-4b86-9223-966769c11843" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => toggleCategory(category.id)} data-unique-id="762608e5-1061-483c-b149-213de6d86035" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx">
        <div data-unique-id="d9796c9f-31e5-4973-9cf1-50120b36647d" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="2dd7edab-46c3-450f-afbf-2aef4c7d4840" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="6f962c16-ffac-4f9d-876d-d311b8907a36" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
          <p className="text-sm text-blue-600" data-unique-id="5406f592-c0d3-4eae-b312-4aba01294a6c" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.files.length}<span className="editable-text" data-unique-id="2f448b41-985b-441b-aeb2-9d88bbdf2f21" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx"> audio files</span></p>
        </div>
        <Button variant="ghost" size="sm" data-unique-id="8efaa3ea-648b-4412-8369-d8159606707a" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-unique-id="41b1649d-caf4-442b-b8a1-73f8c6f92ddf" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.map(file => <AudioCloudItem key={file.id} audio={file} />)}
        </div>}
    </div>;
}