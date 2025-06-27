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
  return <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow" data-unique-id="251f3f9c-7aa8-47ce-95d7-7be357ab2def" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
      <div className="flex flex-col space-y-3" data-unique-id="776f8f0a-6619-4608-894e-6f879133fb1b" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
        {/* Audio Icon */}
        <div className="flex justify-center" data-unique-id="9af83e5b-1096-4c7f-944b-fda7dc61bbe1" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center" data-unique-id="ba20cd74-057b-4761-94bc-053b8c832451" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <Music className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center" data-unique-id="7acb1139-de8d-4d0d-be1f-9f3614b9e201" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <h4 className="font-medium text-sm line-clamp-2 text-gray-800 mb-3" data-unique-id="d84aae03-3b90-4739-ae79-0f8c48d90e49" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
            {audio.title}
          </h4>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2" data-unique-id="f826e4c4-6075-48fd-9917-3f192868c7e4" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <Button onClick={openInNewTab} variant="outline" size="sm" className="w-full flex items-center gap-2 border-green-500 bg-green-50 text-green-600 hover:bg-green-100" data-unique-id="2adbfe7d-8c82-4c8d-9bad-9fc21df55045" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <ExternalLink className="h-4 w-4" />
            <span className="editable-text" data-unique-id="a1ff7a78-e49c-4c8d-8ee9-92f33468aef0" data-file-name="components/preview/cloud/AudioCloudItem.tsx">View</span>
          </Button>
          
          <Button onClick={handleDownload} variant="outline" size="sm" className="w-full flex items-center gap-2 border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100" disabled={downloading} data-unique-id="a40d0eb8-9316-4b62-8a12-64a73640fa68" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
            {downloading ? <Loader className="h-4 w-4 animate-spin" /> : downloadSuccess ? <Check className="h-4 w-4 text-green-500" /> : <Download className="h-4 w-4" />}
            <span className="editable-text" data-unique-id="d29528fe-2ed0-4cc4-b250-df9bd38a1aa7" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
              {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
            </span>
          </Button>
        </div>
        
        {downloadSuccess && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs rounded flex items-center justify-center" data-unique-id="c80e56b6-8b4e-486f-9b92-2992c7df09e3" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <Check className="h-3 w-3 mr-1" />
            <span className="editable-text" data-unique-id="8cf33b8d-1706-4d1f-9ba3-00bd61bac4ec" data-file-name="components/preview/cloud/AudioCloudItem.tsx">Audio downloaded successfully!</span>
          </div>}
      </div>
    </div>;
}