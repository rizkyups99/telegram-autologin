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
    return <div className="flex justify-center py-8" data-unique-id="f10de8ba-cf68-4ba5-832c-988c6e1ec966" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="4aeff479-b7de-47ed-8156-75a73b4c18b5" data-file-name="components/preview/cloud/FileCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="fef9fb6c-4b26-49e8-ae05-794cb6951d51" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <span className="editable-text" data-unique-id="85279a06-0394-44d3-baa5-8f1fed32d594" data-file-name="components/preview/cloud/FileCloudPreview.tsx">Tidak ada file cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="8cdabe4b-3a5f-4c90-a014-4c53e64c9730" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="021f20ef-adef-48b3-8f4f-263189c25b99" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="39513d68-8409-4e2c-aa8a-e7744cc661da" data-file-name="components/preview/cloud/FileCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <FileCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}