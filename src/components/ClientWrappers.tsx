'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="a8f01c5a-92d8-4d7e-9162-fb35d7b16f05" data-file-name="components/ClientWrappers.tsx">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
});