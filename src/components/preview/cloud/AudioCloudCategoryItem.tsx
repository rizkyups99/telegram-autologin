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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="18b686d6-867c-4bb8-9bb1-0e7eb111c1a4" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => toggleCategory(category.id)} data-unique-id="59fbf4cf-1e89-4595-80f8-8a704fc29f1f" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx">
        <div data-unique-id="a44536dd-e73b-4520-ae58-153e09d2b5b0" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="b30be8fa-2ed8-42c2-b3a3-a0db985e888f" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="ef4f2f41-296f-40e4-8350-03cb4ec5840b" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
          <p className="text-sm text-blue-600" data-unique-id="f47d88e9-ac3e-4551-a2db-5a50296e03c2" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">{category.files.length}<span className="editable-text" data-unique-id="6f38918b-b069-463e-848c-db97fbbc21cc" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx"> audio files</span></p>
        </div>
        <Button variant="ghost" size="sm" data-unique-id="addfc3b1-f95e-4767-bcc5-9ddd5d07c811" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-unique-id="527ff6a5-3cf2-4f8d-a45a-3eb84c954c2d" data-file-name="components/preview/cloud/AudioCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.map(file => <AudioCloudItem key={file.id} audio={file} />)}
        </div>}
    </div>;
}