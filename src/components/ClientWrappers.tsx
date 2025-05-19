'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  ),
});
