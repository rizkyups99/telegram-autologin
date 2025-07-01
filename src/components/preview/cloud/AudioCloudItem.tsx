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
  return <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow" data-unique-id="db6d4774-d956-4f89-8baa-2f662e5811ac" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
      <div className="flex flex-col space-y-3" data-unique-id="66444fb4-17a7-49bd-85b2-c87c29abcddb" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
        {/* Audio Icon */}
        <div className="flex justify-center" data-unique-id="5f775211-af02-4c32-8109-e7cb830ce786" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center" data-unique-id="27228c92-18b3-444f-ab8f-e42be0a392e3" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <Music className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center" data-unique-id="10d1a5fc-236c-4e59-ac43-13bedbfe3ed2" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <h4 className="font-medium text-sm line-clamp-2 text-gray-800 mb-3" data-unique-id="ab941c13-6299-4788-b487-c3ebe5200dfe" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
            {audio.title}
          </h4>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2" data-unique-id="e0b09ba2-1339-4405-9a56-14836e7db195" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
          <Button onClick={openInNewTab} variant="outline" size="sm" className="w-full flex items-center gap-2 border-green-500 bg-green-50 text-green-600 hover:bg-green-100" data-unique-id="f6df5984-80ab-4b6f-aa41-ccaff501d978" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <ExternalLink className="h-4 w-4" />
            <span className="editable-text" data-unique-id="3fbe6cb9-92c1-4c1a-977c-c0ae10ec90d1" data-file-name="components/preview/cloud/AudioCloudItem.tsx">View</span>
          </Button>
          
          <Button onClick={handleDownload} variant="outline" size="sm" className="w-full flex items-center gap-2 border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100" disabled={downloading} data-unique-id="59e2972a-5e2b-4d7e-91ef-d442813b6c3b" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
            {downloading ? <Loader className="h-4 w-4 animate-spin" /> : downloadSuccess ? <Check className="h-4 w-4 text-green-500" /> : <Download className="h-4 w-4" />}
            <span className="editable-text" data-unique-id="7f2624ee-7f4b-4bef-b281-3b8aafd99c45" data-file-name="components/preview/cloud/AudioCloudItem.tsx" data-dynamic-text="true">
              {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
            </span>
          </Button>
        </div>
        
        {downloadSuccess && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs rounded flex items-center justify-center" data-unique-id="72185c25-e1f3-43ec-944a-8968d46592a3" data-file-name="components/preview/cloud/AudioCloudItem.tsx">
            <Check className="h-3 w-3 mr-1" />
            <span className="editable-text" data-unique-id="dc5990e3-77e4-4c78-a703-10314cba8e1d" data-file-name="components/preview/cloud/AudioCloudItem.tsx">Audio downloaded successfully!</span>
          </div>}
      </div>
    </div>;
}