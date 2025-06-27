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
  return <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm" data-unique-id="7e8b72a8-1a03-43b6-b192-8250b1753bcf" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
      {/* Category Header - Optimized for Mobile */}
      <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-slate-100 border-b border-slate-200" data-unique-id="5275cca1-2de2-4d1f-a780-c7ea3cf3ebb9" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
        <div className="w-full p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-slate-100/60 transition-colors duration-200" onClick={() => toggleCategory(category.id)} data-unique-id="1356c6ab-1052-4769-8788-4a21618bff5e" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
          <div className="flex items-start justify-between gap-3" data-unique-id="ff5b2af8-a517-4f65-b734-8fd7ce51dace" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
            {/* Content Section - Full Width on Mobile */}
            <div className="flex-1 min-w-0 pr-2" data-unique-id="6ce05173-f59b-4432-85b5-c044fd3a5910" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
              {/* Icon and Title Row */}
              <div className="flex items-start space-x-3 mb-2" data-unique-id="d75e5a9e-cf68-4f4f-ad19-552da942e103" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0" data-unique-id="a6d5458f-cccc-4bde-b517-6c3e02042559" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="610c9787-883e-4667-b3cb-e8bf30a2a5b9" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0" data-unique-id="7f4ace99-8e7a-4534-bd41-de6b8200831b" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black leading-tight break-words word-wrap" data-unique-id="b6d229f9-a76a-401f-bff7-4305747ca794" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                    {category.name}
                  </h3>
                </div>
              </div>
              
              {/* File Count */}
              <div className="mb-2" data-unique-id="91850b23-d183-4251-af0c-9bcc18cc0f9a" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800" data-unique-id="c3e9ff86-1fbe-492f-8606-c4d76b93a82e" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                  {category.files.length}<span className="editable-text" data-unique-id="2c7afa61-13f8-4db0-970c-2dd0a200cf5b" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"> PDFs tersedia</span>
                </span>
              </div>
              
              {/* Description - Full Display with Proper Wrapping */}
              {category.description && <div className="mt-2" data-unique-id="1107caf5-1b32-4366-b020-34f6a3347493" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <p className="text-sm sm:text-base text-black font-normal leading-relaxed break-words whitespace-pre-wrap word-wrap" data-unique-id="970c031c-fbed-46b6-b7c5-c0a2bead01d4" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                    {category.description}
                  </p>
                </div>}
            </div>
            
            {/* Toggle Button - Fixed Position */}
            <div className="flex-shrink-0 mt-1" data-unique-id="7d7f7efa-9569-4e33-bd9a-6a2d1d49fa49" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
              <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors" data-unique-id="e20d721e-77e9-4783-9999-275619d9b734" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
                {isExpanded ? <ChevronDown className="h-5 w-5 text-red-600" /> : <ChevronRight className="h-5 w-5 text-red-600" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      {isExpanded && <div className="p-4 sm:p-6 bg-gradient-to-br from-red-25 via-pink-25 to-orange-25" data-unique-id="12037e7f-4ac0-45d0-acf3-f6f8e6bfe6d6" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
          {category.files.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" data-unique-id="c4ed3e44-27a5-48a2-82b6-aa045556d36e" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx" data-dynamic-text="true">
              {category.files.map(file => <PDFCloudItem key={file.id} pdf={file} />)}
            </div> : <div className="text-center py-12" data-unique-id="e1ffbf43-f09d-4da0-b80e-59b176553fc6" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center" data-unique-id="81c34b84-390c-4b31-b5a6-cb33c627a1f0" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="f2c68ff5-87c4-432d-be86-69313ca7c7fd" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-700 mb-2" data-unique-id="e5c47536-7a9d-4aa9-b57e-539aa3edb1b7" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"><span className="editable-text" data-unique-id="05260644-6900-4a53-8b3e-ba5bf85963dd" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">No PDFs Available</span></h3>
              <p className="text-red-600/70 text-sm" data-unique-id="c3e4393e-78ca-4b04-af20-dec3a0b7156c" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx"><span className="editable-text" data-unique-id="cba78fd0-5031-430b-ad99-6764b064e381" data-file-name="components/preview/cloud/PDFCloudCategoryItem.tsx">
                This category doesn't have any PDF files yet.
              </span></p>
            </div>}
        </div>}
    </div>;
}