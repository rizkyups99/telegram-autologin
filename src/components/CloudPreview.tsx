'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AudioCloudPreview from './preview/cloud/AudioCloudPreview';
import PDFCloudPreview from './preview/cloud/PDFCloudPreview';
import FileCloudPreview from './preview/cloud/FileCloudPreview';
export default function CloudPreview() {
  return <div className="space-y-6" data-unique-id="5d8a2334-2405-4ceb-a39a-66df70d33b95" data-file-name="components/CloudPreview.tsx">
      <Card data-unique-id="f2c3922e-d031-4a4a-986e-38a8976451fb" data-file-name="components/CloudPreview.tsx">
        <CardHeader data-unique-id="b0d3061a-a273-43c6-a50e-c429986cb3d6" data-file-name="components/CloudPreview.tsx">
          <CardTitle data-unique-id="9dcfcd51-da2d-4735-8c0a-712a3f61173b" data-file-name="components/CloudPreview.tsx">
            <span className="editable-text" data-unique-id="acbfcb28-4796-40bc-a3f7-5e1c3cfa65e3" data-file-name="components/CloudPreview.tsx">Preview Konten Cloud</span>
          </CardTitle>
          <CardDescription>
            <span className="editable-text" data-unique-id="df67b3ac-7333-48eb-8b34-994f511f12ee" data-file-name="components/CloudPreview.tsx">
              Preview dan akses file audio, PDF, dan dokumen dari cloud storage
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent data-unique-id="a121612e-c1dd-4d27-8ee2-c536d75dc41a" data-file-name="components/CloudPreview.tsx">
          <Tabs defaultValue="audio" className="w-full" data-unique-id="e791248c-2c47-4c16-823c-974f3746f3e8" data-file-name="components/CloudPreview.tsx">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="audio" className="flex-1">
                <span className="editable-text" data-unique-id="c127e185-d685-40d1-9905-6832ceac38c2" data-file-name="components/CloudPreview.tsx">Audio Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex-1">
                <span className="editable-text" data-unique-id="d30ac339-aac0-48fb-a835-8a73f385a1a8" data-file-name="components/CloudPreview.tsx">PDF Cloud</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex-1">
                <span className="editable-text" data-unique-id="9903e889-f189-4f8e-9705-afdbc39f0293" data-file-name="components/CloudPreview.tsx">File Cloud</span>
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