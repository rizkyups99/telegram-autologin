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

      // Fetch PDF cloud files
      const pdfResponse = await fetch('/api/pdf-cloud?sort=asc');
      const pdfData = await pdfResponse.json();
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
    return <div className="flex justify-center py-8" data-unique-id="40ab1e1b-22a6-465b-8336-02e7dd6dfa8b" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="4816498b-8586-4800-bdef-953ad5559417" data-file-name="components/preview/cloud/PDFCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="3ddf7ce6-0611-46e0-b720-c4232b9b62bb" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <span className="editable-text" data-unique-id="d4999daa-ed72-4416-a652-1c8e1da1f0ba" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">Tidak ada PDF cloud yang tersedia.</span>
      </p>;
  }
  return <div className="w-full" data-unique-id="0e854729-dc66-4663-a211-e90afb64313d" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
      <Card className="border-0 shadow-none" data-unique-id="8c7c5921-8a05-4383-a770-2b616c0f7242" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <CardContent className="p-2 sm:p-4 md:p-6" data-unique-id="0170ba18-39a0-4558-9f01-c0851c6b7593" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
          <div className="space-y-3 sm:space-y-4 md:space-y-6" data-unique-id="3af9e7cb-8058-46be-8cef-eb0a02bfdc95" data-file-name="components/preview/cloud/PDFCloudPreview.tsx" data-dynamic-text="true">
            {categories.map(category => <PDFCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
          </div>
        </CardContent>
      </Card>
    </div>;
}