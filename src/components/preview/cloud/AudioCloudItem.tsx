'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Loader, ExternalLink, Music } from 'lucide-react';
interface AudioCloudFile {
  id: number;
  title: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface AudioCloudItemProps {
  audio: AudioCloudFile;
}
export function AudioCloudItem({
  audio
}: AudioCloudItemProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(audio.fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${audio.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error downloading audio:', error);
      // Fallback: open in new tab
      window.open(audio.fileUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };
  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(audio.fileUrl, '_blank');
    }
  };
  return <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow" data-unique-id="06b33a77-a8c3-472d-b0b8-508196e107b6" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
      <div className="flex flex-col space-y-3" data-unique-id="ac84ee93-30f9-4034-89be-db7084bd6a87" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
        {/* Audio Icon */}
        <div className="flex justify-center" data-unique-id="b9e12b3f-e8a2-4fbe-90b7-9ba8c2e40a26" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center" data-unique-id="3dc7a42e-2fa8-4e0c-8390-17b36e857245" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <Music className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center" data-unique-id="bd3f7a87-c755-4bd4-b099-6cb5095976ca" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <h4 className="font-medium text-sm line-clamp-2 text-gray-800 mb-3" data-unique-id="dcc11f74-ccea-45c7-ab5e-5134fc558329" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
            {audio.title}
          </h4>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2" data-unique-id="a56f5ed6-53ee-493a-b08c-c429aaa6c221" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <Button onClick={openInNewTab} variant="outline" size="sm" className="w-full flex items-center gap-2 border-green-500 bg-green-50 text-green-600 hover:bg-green-100" data-unique-id="ce8fd363-3f32-4242-a0a0-bc0574f83317" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <ExternalLink className="h-4 w-4" />
            <span className="editable-text" data-unique-id="d0bf7921-d4b7-4a4f-85db-bd29fcc0cfd1" data-file-name="components/preview/cloud/AudioCloudItem.tsx">View</span>
          </Button>
          
          <Button onClick={handleDownload} variant="outline" size="sm" className="w-full flex items-center gap-2 border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100" disabled={downloading} data-unique-id="e0422855-2711-44b8-8b65-0c91ee537f09" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
            {downloading ? <Loader className="h-4 w-4 animate-spin" /> : downloadSuccess ? <Check className="h-4 w-4 text-green-500" /> : <Download className="h-4 w-4" />}
            <span className="editable-text" data-unique-id="351ef7de-4a7a-4bff-98ef-40ece4c5d63d" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
              {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
            </span>
          </Button>
        </div>
        
        {downloadSuccess && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs rounded flex items-center justify-center" data-unique-id="1ec1e844-a963-4b72-9f0d-0804071289ed" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <Check className="h-3 w-3 mr-1" />
            <span className="editable-text" data-unique-id="aa1b93a2-1b41-4bb4-b3c3-3cfafd6a89aa" data-file-name="components/preview/cloud/AudioCloudItem.tsx">Audio downloaded successfully!</span>
          </div>}
      </div>
    </div>;
}