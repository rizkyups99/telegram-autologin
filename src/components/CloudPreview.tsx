'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AudioCloudPreview from './preview/cloud/AudioCloudPreview';
import PDFCloudPreview from './preview/cloud/PDFCloudPreview';
import FileCloudPreview from './preview/cloud/FileCloudPreview';
export default function CloudPreview() {
  return <div className="space-y-6" data-unique-id="9cbc0162-4862-4c7a-b472-876553efdaf4" data-file-name="components/CloudPreview.tsx">
      <Card data-unique-id="16242847-52fb-4c1c-ac9c-e5cdedcb5a8f" data-file-name="components/CloudPreview.tsx">
        <CardHeader data-unique-id="13e9d074-d6cd-4581-aef6-0b8fe37dfb6c" data-file-name="components/CloudPreview.tsx">
          <CardTitle data-unique-id="112fc86f-0a0b-47bb-aecc-53fb805aed38" data-file-name="components/CloudPreview.tsx">
            <span className="editable-text" data-unique-id="b3c92319-1acb-431b-976a-4e8cc4dc778b" data-file-name="components/CloudPreview.tsx">Preview Konten Cloud</span>
          </CardTitle>
          <CardDescription>
            <span className="editable-text" data-unique-id="d5340226-eb94-42b6-84a8-e6ff1ac8a026" data-file-name="components/CloudPreview.tsx">
              Preview dan akses file audio, PDF, dan dokumen dari cloud storage
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent data-unique-id="a897a100-6878-40ee-aae4-6fe432e89b68" data-file-name="components/CloudPreview.tsx">
          <Tabs defaultValue="audio" className="w-full" data-unique-id="f8bfdf1f-bfaf-49f4-b982-2f53ffdb9a6f" data-file-name="components/CloudPreview.tsx">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="audio" className="flex-1">
                <span className="editable-text" data-unique-id="826ecb05-a1b4-4ac2-bcf7-df366a367f7d" data-file-name="components/CloudPreview.tsx">Audio Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex-1">
                <span className="editable-text" data-unique-id="d14d718b-d1ac-4388-8763-115808db11b5" data-file-name="components/CloudPreview.tsx">PDF Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1">
                <span className="editable-text" data-unique-id="894b7c89-df34-4112-8b59-1194c72d2c75" data-file-name="components/CloudPreview.tsx">File Cloud</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="audio" className="space-y-4">
              <AudioCloudPreview />
            </TabsContent>
            
            <TabsContent value="pdf" className="space-y-4">
              <PDFCloudPreview />
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <FileCloudPreview />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
}