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
    return <div className="flex justify-center py-8" data-unique-id="fa4a5b72-117c-4f00-b71c-5cf445e9e094" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="67dfb741-fbaf-4aff-b37f-8bb91376f967" data-file-name="components/preview/cloud/FileCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="3802fa4e-15ce-45ab-977b-ed0b4697ead7" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <span className="editable-text" data-unique-id="490184da-f5d3-4237-96a7-571e1868f890" data-file-name="components/preview/cloud/FileCloudPreview.tsx">Tidak ada file cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="04ec3c04-966f-43a5-877c-650b8f6422cb" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="f5433b44-3043-49dd-a5b7-a82225d45085" data-file-name="components/preview/cloud/FileCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="4d839636-00fd-4a79-9a5e-3eefd3731781" data-file-name="components/preview/cloud/FileCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <FileCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}