'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="f5b8f627-6d31-41b7-992a-7289e15b0e54" data-file-name="components/ClientWrappers.tsx">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
});
export const UniversalPDFViewerWrapper = dynamic(() => import('@/components/UniversalPDFViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="fce3b72d-3f48-4d40-b0ea-7731f90dd32c" data-file-name="components/ClientWrappers.tsx">
      <div className="text-center" data-unique-id="f2ccf1fc-2bdf-4fc3-b6ec-663924eb5043" data-file-name="components/ClientWrappers.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600" data-unique-id="0c63aa17-ac5c-4382-8bf4-b05c86e56ce4" data-file-name="components/ClientWrappers.tsx"><span className="editable-text" data-unique-id="7f393f71-8f3b-4eb5-a75c-4c2c2b7e902e" data-file-name="components/ClientWrappers.tsx">Loading PDF viewer...</span></p>
      </div>
    </div>
});