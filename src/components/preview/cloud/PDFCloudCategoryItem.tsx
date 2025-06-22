'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { PDFCloudItem } from './PDFCloudItem';
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
interface PDFCloudCategoryItemProps {
  category: Category;
  isExpanded: boolean;
  toggleCategory: (categoryId: number) => void;
}
export function PDFCloudCategoryItem({
  category,
  isExpanded,
  toggleCategory
}: PDFCloudCategoryItemProps) {
  return <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm" data-unique-id="295094f5-7e90-4fbe-a043-35a63a8c3ac4" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-red-50 via-pink-50 to-orange-50 border-b border-red-100" data-unique-id="ff1e2a9e-b984-4e86-ad54-ff547d31189c" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
        <Button variant="ghost" onClick={() => toggleCategory(category.id)} className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-red-50/50 rounded-none h-auto" data-unique-id="7ced1e8c-3b6e-46f2-b229-c16e5c2aea53" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
          <div className="flex items-center space-x-3" data-unique-id="472c2746-4113-4679-8b33-f366682f2642" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0" data-unique-id="423a037a-f418-438b-b8e6-4bfb4a41225d" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="ebb46389-6f95-4cac-80ee-fd617aa2cc75" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="text-left" data-unique-id="dd91baa0-16a7-4d90-90a5-85b6bf5e3c98" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
              <h3 className="text-lg sm:text-xl font-bold text-red-900 leading-tight" data-unique-id="f4699c58-f47d-409b-ba38-586c1ead08ef" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                {category.name}
              </h3>
              <p className="text-sm text-red-700/80 mt-1" data-unique-id="e98172f5-e183-42aa-916c-2edc1cde58bb" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                {category.files.length}<span className="editable-text" data-unique-id="6a9ddb8a-db5e-464d-9120-90c711418072" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"> PDFs available
              </span></p>
              {category.description && <p className="text-xs text-red-600/70 mt-1 line-clamp-1" data-unique-id="8709a5da-eb2a-4cae-8be2-724afb332567" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                  {category.description}
                </p>}
            </div>
          </div>
          <div className="flex-shrink-0 ml-4" data-unique-id="9ddd8a34-c6d9-44f4-a631-5da45746b63e" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
            {isExpanded ? <ChevronDown className="h-5 w-5 text-red-600" /> : <ChevronRight className="h-5 w-5 text-red-600" />}
          </div>
        </Button>
      </div>
      
      {/* Expandable Content */}
      {isExpanded && <div className="p-4 sm:p-6 bg-gradient-to-br from-red-25 via-pink-25 to-orange-25" data-unique-id="adc1bf2c-86d6-49fe-b09d-86879a56b854" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" data-unique-id="56754806-6132-4e78-9a3c-735d51087e95" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
              {category.files.map(file => <PDFCloudItem key={file.id} pdf={file} />)}
            </div> : <div className="text-center py-12" data-unique-id="3309f0c7-0e9c-4605-86f5-532db54e6c5a" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center" data-unique-id="6a352c11-95e5-40e9-a601-5f6a9e234f7c" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="de5caf14-88d1-4bea-8b01-c3751a4629b7" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-700 mb-2" data-unique-id="f0cc498d-e43b-4c17-b337-c47e05373170" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"><span className="editable-text" data-unique-id="7c05e733-9106-4249-b05b-68cabeaf615b" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">No PDFs Available</span></h3>
              <p className="text-red-600/70 text-sm" data-unique-id="d930b5e1-bff4-4516-8e4d-ab82de5e19b8" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"><span className="editable-text" data-unique-id="4df83f05-fad0-46b3-bbcf-513eb29dd14c" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                This category doesn't have any PDF files yet.
              </span></p>
            </div>}
        </div>}
    </div>;
}