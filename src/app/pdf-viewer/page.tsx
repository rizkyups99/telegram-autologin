import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="8dde95e2-1763-4934-9f8b-f452c1d3a0be" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="e0195ccf-6b02-4bba-aa94-8820822158f8" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="6d378f45-1d48-4577-abac-9abd15476c2a" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="8bbaf754-7f98-494e-b5a7-c481a6759367" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="bc5e943c-bb7a-4aef-82b4-a2ac1af5ee22" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="6c942066-4f94-45dc-aef3-68669764ec54" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="4d972539-e98c-43e4-9de4-c88e81c26260" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}