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
  return <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm" data-unique-id="37a26231-8773-4ac4-bd63-f03fb4cd251f" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
      {/* Category Header - Optimized for Mobile */}
      <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-100 border-b border-slate-200" data-unique-id="442f5bd4-ef37-4210-860e-fe3d9bcbfb50" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
        <div className="w-full p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-slate-100/60 transition-colors duration-200" onClick={() => toggleCategory(category.id)} data-unique-id="00d5f83c-d59e-4fa9-acc3-d9d2470011e1" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
          <div className="flex items-start justify-between gap-3" data-unique-id="7450ec67-93df-4b8a-8b2d-128cc5407e4f" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
            {/* Content Section - Full Width on Mobile */}
            <div className="flex-1 min-w-0 pr-2" data-unique-id="4172683d-501f-43b5-976d-d54c40d1eb37" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
              {/* Icon and Title Row */}
              <div className="flex items-start space-x-3 mb-2" data-unique-id="8f8d5222-a092-446f-b2c7-0e7c7ff6b2fe" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0" data-unique-id="be6a51ea-5052-4b08-ae04-10aaefd6abd9" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="e6689e55-9cbb-47a7-87f5-4563113864d6" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0" data-unique-id="a3090520-2f1c-4fab-9350-da10bc5e038b" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black leading-tight break-words word-wrap" data-unique-id="60481ced-175c-48db-abbf-a53f5c3cba24" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                    {category.name}
                  </h3>
                </div>
              </div>
              
              {/* File Count */}
              <div className="mb-2" data-unique-id="92578de9-6435-42af-b6c7-639a8e2fac9b" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" data-unique-id="ee068729-3aa2-4c31-899c-c25fd5ba92f5" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                  {category.files.length}<span className="editable-text" data-unique-id="8d27d297-f23e-4ec9-b873-f365e74f1b34" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"> PDFs tersedia</span>
                </span>
              </div>
              
              {/* Description - Full Display with Proper Wrapping */}
              {category.description && <div className="mt-2" data-unique-id="9892d209-cc3a-477b-8aaa-5b675870f3a3" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <p className="text-sm sm:text-base text-black font-normal leading-relaxed break-words whitespace-pre-wrap word-wrap" data-unique-id="7c6297b3-a2c4-44d8-956c-284331453f74" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                    {category.description}
                  </p>
                </div>}
            </div>
            
            {/* Toggle Button - Fixed Position */}
            <div className="flex-shrink-0 mt-1" data-unique-id="b2d01a36-3600-4ba9-b49a-111ce2ff24dc" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors" data-unique-id="cc1b22d9-3d66-4782-9c08-bfd6134256b1" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                {isExpanded ? <ChevronDown className="h-5 w-5 text-red-600" /> : <ChevronRight className="h-5 w-5 text-red-600" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      {isExpanded && <div className="p-4 sm:p-6 bg-gradient-to-br from-red-25 via-pink-25 to-orange-25" data-unique-id="8beb9a04-c0ac-46bd-a36e-2f99b3b8e246" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" data-unique-id="75dfc55c-b4c2-4c63-8962-b429d08b3857" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
              {category.files.map(file => <PDFCloudItem key={file.id} pdf={file} />)}
            </div> : <div className="text-center py-12" data-unique-id="e00f14e7-0475-4148-bf0a-4b60fb726655" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center" data-unique-id="d6a9d414-e914-41c3-b461-743100a65881" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="77876766-98f1-4229-8c20-bd70d6a32fd3" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-700 mb-2" data-unique-id="34c6f659-75a2-4893-8217-43d22ffcc7a6" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"><span className="editable-text" data-unique-id="0543bf4b-90dd-475f-930c-cccce8ec67eb" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">No PDFs Available</span></h3>
              <p className="text-red-600/70 text-sm" data-unique-id="357a5a6c-9f41-4193-aae0-fc4a611b4e9f" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"><span className="editable-text" data-unique-id="722746d4-3a07-4a14-b746-a9134c8374e0" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                This category doesn't have any PDF files yet.
              </span></p>
            </div>}
        </div>}
    </div>;
}