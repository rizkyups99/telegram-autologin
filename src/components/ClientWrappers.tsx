'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="1f01e088-714b-40cf-9940-838b1deb007e" data-file-name="components/ClientWrappers.tsx">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
});
export const UniversalPDFViewerWrapper = dynamic(() => import('@/components/UniversalPDFViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="de97a4f6-3e18-427b-9dde-26098a6ecbf1" data-file-name="components/ClientWrappers.tsx">
      <div className="text-center" data-unique-id="c557bc73-8361-4b2b-85de-fa2b6b8f9801" data-file-name="components/ClientWrappers.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600" data-unique-id="c901ce69-1df8-448c-b491-df0a7dd36f6b" data-file-name="components/ClientWrappers.tsx"><span className="editable-text" data-unique-id="38308311-cf9e-4c31-9e19-ae5c8369880b" data-file-name="components/ClientWrappers.tsx">Loading PDF viewer...</span></p>
      </div>
    </div>
});