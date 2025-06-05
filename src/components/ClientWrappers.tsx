'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="1b63812e-5309-41d9-842c-f11d12744eac" data-file-name="components/ClientWrappers.tsx">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
});
export const UniversalPDFViewerWrapper = dynamic(() => import('@/components/UniversalPDFViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="4f0a6d13-bc43-4f88-8670-5a5c30bdb834" data-file-name="components/ClientWrappers.tsx">
      <div className="text-center" data-unique-id="05f94021-7c88-407c-97ab-5f89a7875ba1" data-file-name="components/ClientWrappers.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600" data-unique-id="e3888a70-678d-42be-831f-abec76737f78" data-file-name="components/ClientWrappers.tsx"><span className="editable-text" data-unique-id="92bcb737-c44b-4534-a400-8027057ae78a" data-file-name="components/ClientWrappers.tsx">Loading PDF viewer...</span></p>
      </div>
    </div>
});