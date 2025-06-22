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
    return <div className="flex justify-center py-8" data-unique-id="943645fa-64c8-4c35-aeae-5bf2833a51bc" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="074fd826-f306-45fc-a36a-d20324c9524c" data-file-name="components/preview/cloud/PDFCloudPreview.tsx"></div>
      </div>;
  }
  if (categories.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="f546ad34-1594-46ac-9fb2-f0101b3994b0" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <span className="editable-text" data-unique-id="e19b71c5-e5cc-4834-b026-2df47d1aed23" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">Tidak ada PDF cloud yang tersedia.</span>
      </p>;
  }
  return <Card data-unique-id="cdb69f6d-cfee-4f33-81a9-b5e5252a64f4" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
      <CardContent className="p-6" data-unique-id="7a1dd8f0-50a0-4b1a-9a23-a326720e4918" data-file-name="components/preview/cloud/PDFCloudPreview.tsx">
        <div className="space-y-6" data-unique-id="60225768-a733-4d30-a645-00a6017385f5" data-file-name="components/preview/cloud/PDFCloudPreview.tsx" data-dynamic-text="true">
          {categories.map(category => <PDFCloudCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} />)}
        </div>
      </CardContent>
    </Card>;
}