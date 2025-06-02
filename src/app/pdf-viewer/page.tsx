import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="ebbedb74-fb09-4128-a014-8ea5780c07f4" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="cecfd730-a83d-43b2-a33f-df41ecb3d99c" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="aa689e44-c640-468d-b7b2-3da6b9f4c9a4" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="51a58d02-b667-41ad-8022-c66d312c378b" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="07b86060-32e2-4d29-a8c2-842e418cc67d" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="3f1a8e8f-f02d-48f7-a96c-2a904c2073ac" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="7e4d8e1c-c39d-446f-84e9-f505b938f2fe" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}