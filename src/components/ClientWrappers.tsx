'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="69205a1c-b393-40e9-8396-0e80ee22296c" data-file-name="components/ClientWrappers.tsx">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
});
export const UniversalPDFViewerWrapper = dynamic(() => import('@/components/UniversalPDFViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="77262e44-f84b-4028-89fe-0b03cb1da38a" data-file-name="components/ClientWrappers.tsx">
      <div className="text-center" data-unique-id="25fe77f9-2063-4021-ba42-2bbe5402a2d2" data-file-name="components/ClientWrappers.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600" data-unique-id="19ae7051-1b6b-426f-a6c7-e9e800f08a7f" data-file-name="components/ClientWrappers.tsx"><span className="editable-text" data-unique-id="14010851-00e7-423e-b07a-941354b9ca79" data-file-name="components/ClientWrappers.tsx">Loading PDF viewer...</span></p>
      </div>
    </div>
});