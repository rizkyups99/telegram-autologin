'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PDFCloudCategoryItem } from './PDFCloudCategoryItem';
interface PDFCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface Category {
  id: number;
  name: string;
  description?: string;
  files: PDFCloudFile[];
}
interface PDFCloudPreviewProps {
  filterCategoryIds?: number[];
}
export default function PDFCloudPreview({
  filterCategoryIds
}: PDFCloudPreviewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  useEffect(() => {
    fetchPDFCloudFiles();
  }, [filterCategoryIds]);
  const fetchPDFCloudFiles = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const catResponse = await fetch('/api/categories');
      const categoriesData = await catResponse.json();

      // Filter categories if filterCategoryIds is provided
      const filteredCategories = filterCategoryIds ? categoriesData.filter((category: any) => filterCategoryIds.includes(category.id)) : categoriesData;

      // Fetch ALL PDF cloud files with high limit to ensure we get everything
      const pdfResponse = await fetch('/api/pdf-cloud?limit=1000&sort=asc');
      const pdfData = await pdfResponse.json();
      console.log('PDF Cloud API Response:', pdfData);
      console.log('Total PDF files fetched:', pdfData.files?.length || 0);
      const pdfFiles = pdfData.files || [];

      // Group files by category
      const pdfsByCategory = filteredCategories.map((category: any) => {
        const categoryFiles = pdfFiles.filter((file: PDFCloudFile) => file.categoryId === category.id) || [];

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
      console.log('Final categories with files:', pdfsByCategory);
      console.log('Total categories with files:', pdfsByCategory.length);
      setCategories(pdfsByCategory);
    } catch (error) {
      console.error('Error fetching PDF cloud files:', error);
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
    return <div className="flex justify-center py-8" data-unique-id="428c0657-e16d-4ea5-a198-ed73dc8871ff" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="1e3ad9ef-0ea0-4fa3-a23d-519d880c46d7" data-file-name="components/preview/cloud/PDFCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="371e7d01-2358-4616-a871-a0f3c9271609" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <span className="editable-text" data-unique-id="03caad84-81fc-4212-994b-9a6c33fb0ceb" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">Tidak ada PDF cloud yang tersedia.</span>
      </p>;
  }
  return <div className="w-full" data-unique-id="38933bcc-9249-47f8-922b-fee0bf26c420" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
      <Card className="border-0 shadow-none" data-unique-id="b1d6134f-9061-4e86-add0-280961d495ea" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <CardContent className="p-2 sm:p-4 md:p-6" data-unique-id="8a4db5d8-96b0-4651-850c-61cf379233d7" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
          <div className="space-y-3 sm:space-y-4 md:space-y-6" data-unique-id="03ed0b80-c82a-4022-9127-8e9717b378c2" data-file-name="components/preview/cloud/PDFCloudPreview.tsx" data-dynamic-text="true">
            {categories.map(category => <PDFCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
          </div>
        </CardContent>
      </Card>
    </div>;
}