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
    return <div className="flex justify-center py-8" data-unique-id="7943ce8a-536a-4849-8ab0-0e16ea2cb512" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7828957b-025f-49f3-afe6-c3e2a507359e" data-file-name="components/preview/cloud/AudioCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="02fee6b1-e856-417a-ae43-de7bea131b43" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <span className="editable-text" data-unique-id="216aecb8-c93c-44b5-8cb9-a5df8ba160f2" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">Tidak ada audio cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="8593aa51-56fc-4432-8c2b-289cfb7e2216" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="09ce909d-49c4-4f6d-931e-df0b5fea96b1" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="4a27ea1c-be0e-449b-aea8-76494f033a7b" data-file-name="components/preview/cloud/AudioCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <AudioCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}