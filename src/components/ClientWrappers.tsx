'use client';

import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';
export const PDFViewerClientWrapper = dynamic(() => import('@/components/PDFViewerClient'), {
  ssr: false,
  loading: () => <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="2a743923-e849-4ecd-91dd-b7c6c4868fba" data-file-name="components/ClientWrappers.tsx">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
});