'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileCloudCategoryItem } from './FileCloudCategoryItem';
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
interface FileCloudPreviewProps {
  filterCategoryIds?: number[];
}
export default function FileCloudPreview({
  filterCategoryIds
}: FileCloudPreviewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  useEffect(() => {
    fetchFileCloudFiles();
  }, [filterCategoryIds]);
  const fetchFileCloudFiles = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const catResponse = await fetch('/api/categories');
      const categoriesData = await catResponse.json();

      // Filter categories if filterCategoryIds is provided
      const filteredCategories = filterCategoryIds ? categoriesData.filter((category: any) => filterCategoryIds.includes(category.id)) : categoriesData;

      // Fetch file cloud files
      const fileResponse = await fetch('/api/file-cloud?sort=asc');
      const fileData = await fileResponse.json();
      const cloudFiles = fileData.files || [];

      // Group files by category
      const filesByCategory = filteredCategories.map((category: any) => {
        const categoryFiles = cloudFiles.filter((file: FileCloudFile) => file.categoryId === category.id) || [];

        // Initialize categories as expanded if they have files
        if (categoryFiles.length > 0) {
          setExpandedCategories(prev => ({
            ...prev,
            [category.id]: true
          }));
        }
        return {
          ...category,
          files: categoryFiles
        };
      }).filter((category: Category) => category.files.length > 0);
      setCategories(filesByCategory);
    } catch (error) {
      console.error('Error fetching file cloud files:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  if (isLoading) {
    return <div className="flex justify-center py-8" data-unique-id="0db3ef7a-0b2a-4778-8f80-e32e86fef788" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="5ad41283-1d00-4b21-97a6-274077e659bf" data-file-name="components/preview/cloud/FileCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="d7bc790d-c888-41d3-b945-9f0ccabff55b" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <span className="editable-text" data-unique-id="c3ff98c1-020f-491d-b0f4-88ae1fe5b5fa" data-file-name="components/preview/cloud/FileCloudPreview.tsx">Tidak ada file cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="0714bdba-5b05-42f8-aaf3-658d2531b7b3" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="6a092518-fdcf-4a3b-8fc3-665e68d975c7" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="bbc24f00-71e0-4f32-a505-1b12621266d7" data-file-name="components/preview/cloud/FileCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <FileCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}