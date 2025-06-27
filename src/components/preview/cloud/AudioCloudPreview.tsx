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
    return <div className="flex justify-center py-8" data-unique-id="dbe6b70e-a0e2-4915-a6ac-64a5e8d0ff62" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="4b7c9a58-5542-4762-90e8-2eb3e24ba6f5" data-file-name="components/preview/cloud/AudioCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="6b8de18c-907f-442b-b03a-16d1462a16e7" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <span className="editable-text" data-unique-id="b1959fb5-00d5-4d1b-8bca-f7c963485a20" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">Tidak ada audio cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="36c62893-107e-4418-91b5-ea5a498b0e1e" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="d0ba141c-7bb6-4af5-8341-639c39cfc041" data-file-name="components/preview/cloud/AudioCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="1b7df079-78a7-42c4-b990-0317d8a5f5a3" data-file-name="components/preview/cloud/AudioCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <AudioCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}