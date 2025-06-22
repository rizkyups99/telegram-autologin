'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AudioCloudCategoryItem } from './AudioCloudCategoryItem';
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
interface AudioCloudPreviewProps {
  filterCategoryIds?: number[];
}
export default function AudioCloudPreview({
  filterCategoryIds
}: AudioCloudPreviewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  useEffect(() => {
    fetchAudioCloudFiles();
  }, [filterCategoryIds]);
  const fetchAudioCloudFiles = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const catResponse = await fetch('/api/categories');
      const categoriesData = await catResponse.json();

      // Filter categories if filterCategoryIds is provided
      const filteredCategories = filterCategoryIds ? categoriesData.filter((category: any) => filterCategoryIds.includes(category.id)) : categoriesData;

      // Fetch audio cloud files
      const audioResponse = await fetch('/api/audio-cloud?sort=asc');
      const audioData = await audioResponse.json();
      const audioFiles = audioData.files || [];

      // Group files by category
      const audiosByCategory = filteredCategories.map((category: any) => {
        const categoryFiles = audioFiles.filter((file: AudioCloudFile) => file.categoryId === category.id) || [];

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
      setCategories(audiosByCategory);
    } catch (error) {
      console.error('Error fetching audio cloud files:', error);
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
    return <div className="flex justify-center py-8" data-unique-id="b497f178-d7f7-4c39-b56f-13184fed4a8b" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="8fade503-ac2d-45d4-8cea-cc44c415b4a0" data-file-name="components/preview/cloud/AudioCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="591362b5-e511-4fb3-a513-6f5da5a9dfc0" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <span className="editable-text" data-unique-id="c5cba4a4-996d-4892-bf79-b1bec8e7e931" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">Tidak ada audio cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="396e2377-860f-4cd1-bec6-1ee869a0b9ea" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="c9e7ad8f-c04d-4ad8-a1c6-b24744d2e0d4" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="2639c3ba-b47a-4fa5-a33f-8a6918abd23f" data-file-name="components/preview/cloud/AudioCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <AudioCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}