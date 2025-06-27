import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="103a1faa-5516-446c-a3d0-9747a64ba753" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="3ea002d2-57ef-4e17-8d33-f4031aaa1a8b" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="1e371a59-1dec-4f24-8172-d98ca2a69920" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="8afeed6f-5e06-43d5-9d76-110c71d1c451" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="f9c0d302-9046-4144-9f64-05cdc0694faf" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="a2353842-8bf6-4d06-91d4-4575365977db" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="45335f53-7324-4b41-b3d3-a786807ff088" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}