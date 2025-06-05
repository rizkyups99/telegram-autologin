import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="7bea9323-1d39-4ed0-a338-0682b57a47bb" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="23f2fa6f-2bc5-44f6-9f1a-f41d1c91bf87" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="c99b0086-d180-495b-8d8a-77df820364b6" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="e7c6d50b-463a-4316-8806-54dfc18dbb87" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="13bbca3c-33b1-4551-b93e-b6fa8d26baed" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="f933146e-2110-46a1-af5b-ae8aeb00a0ea" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="ec0b253e-e92d-4c6f-b045-3e5cb4bf2477" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}