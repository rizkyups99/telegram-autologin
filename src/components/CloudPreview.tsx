'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AudioCloudPreview from './preview/cloud/AudioCloudPreview';
import PDFCloudPreview from './preview/cloud/PDFCloudPreview';
import FileCloudPreview from './preview/cloud/FileCloudPreview';
export default function CloudPreview() {
  return <div className="space-y-6" data-unique-id="17400624-e8f3-46ad-a388-17098bb8e2e6" data-file-name="components/CloudPreview.tsx">
      <Card data-unique-id="4dd9675a-d445-4d0f-aed5-1b7aa03e2e23" data-file-name="components/CloudPreview.tsx">
        <CardHeader data-unique-id="d1771be6-fce2-4fbb-bdbb-c5164900f1e7" data-file-name="components/CloudPreview.tsx">
          <CardTitle data-unique-id="1ace4272-38c4-4cdd-b878-f30b8c03dee4" data-file-name="components/CloudPreview.tsx">
            <span className="editable-text" data-unique-id="9406633a-a466-4272-90bb-691c1126bfc1" data-file-name="components/CloudPreview.tsx">Preview Konten Cloud</span>
          </CardTitle>
          <CardDescription>
            <span className="editable-text" data-unique-id="70e1f6d2-4c13-4d72-989d-2adf5c0ed957" data-file-name="components/CloudPreview.tsx">
              Preview dan akses file audio, PDF, dan dokumen dari cloud storage
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent data-unique-id="af47486d-94c3-469f-99ab-27c81db8d4f9" data-file-name="components/CloudPreview.tsx">
          <Tabs defaultValue="audio" className="w-full" data-unique-id="5d5e68f6-18ff-4df0-8acc-dd84c5289513" data-file-name="components/CloudPreview.tsx">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="audio" className="flex-1">
                <span className="editable-text" data-unique-id="3b84771f-b36f-4555-b4e1-5e842a171721" data-file-name="components/CloudPreview.tsx">Audio Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex-1">
                <span className="editable-text" data-unique-id="c6ba179e-8b33-4291-8e53-a83d88e8d83a" data-file-name="components/CloudPreview.tsx">PDF Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1">
                <span className="editable-text" data-unique-id="8daf18bc-9d46-401e-8053-85b1a8098c34" data-file-name="components/CloudPreview.tsx">File Cloud</span>
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