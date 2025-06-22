'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Loader, File, ExternalLink, FileSpreadsheet, FileText, Presentation } from 'lucide-react';
interface FileCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  fileType?: string | null;
  categoryId: number;
  categoryName?: string;
}
interface FileCloudItemProps {
  file: FileCloudFile;
}
export function FileCloudItem({
  file
}: FileCloudItemProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(file.fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Determine file extension based on file type
      let extension = '';
      if (file.fileType) {
        const type = file.fileType.toLowerCase();
        if (type.includes('excel') || type.includes('spreadsheet')) {
          extension = '.xlsx';
        } else if (type.includes('word') || type.includes('doc')) {
          extension = '.docx';
        } else if (type.includes('powerpoint') || type.includes('presentation')) {
          extension = '.pptx';
        }
      }
      link.download = `${file.title}${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: open in new tab
      window.open(file.fileUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };
  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(file.fileUrl, '_blank');
    }
  };
  const getFileTypeIcon = (fileType: string | null | undefined) => {
    if (!fileType) return <File className="h-12 w-12" />;
    const type = fileType.toLowerCase();
    if (type.includes('excel') || type.includes('spreadsheet')) {
      return <FileSpreadsheet className="h-12 w-12 text-green-600" />;
    } else if (type.includes('word') || type.includes('doc')) {
      return <FileText className="h-12 w-12 text-blue-600" />;
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
      return <Presentation className="h-12 w-12 text-orange-500" />;
    } else {
      return <File className="h-12 w-12" />;
    }
  };
  const getFileTypeColor = (fileType: string | null | undefined) => {
    if (!fileType) return 'border-gray-500 bg-gray-50 text-gray-600';
    const type = fileType.toLowerCase();
    if (type.includes('excel') || type.includes('spreadsheet')) {
      return 'border-green-500 bg-green-50 text-green-600';
    } else if (type.includes('word') || type.includes('doc')) {
      return 'border-blue-500 bg-blue-50 text-blue-600';
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
      return 'border-orange-500 bg-orange-50 text-orange-600';
    } else {
      return 'border-gray-500 bg-gray-50 text-gray-600';
    }
  };
  return <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 flex flex-col h-full" data-unique-id="3216081d-f1cd-4c85-b7f6-7d49373b2683" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
      {/* File Cover/Icon - Top */}
      <div className="w-full aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100 mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-unique-id="8956c66b-9eaf-4be2-b799-5c4e84baed2d" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
        {file.coverUrl && file.coverUrl !== '' ? <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" onError={e => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-50', 'to-gray-100');
      }} data-unique-id="a1bb141e-94c6-41e0-9452-47d7a180a275" data-file-name="components/preview/cloud/FileCloudItem.tsx" /> : <div className="text-blue-600" data-unique-id="6bb99c94-f821-4547-97e1-687f53a43f24" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
            {getFileTypeIcon(file.fileType)}
          </div>}
      </div>

      {/* Title and File Type - Center */}
      <div className="flex-1 mb-4" data-unique-id="a22cb1ee-2b20-48e3-b961-9e8d155bb530" data-file-name="components/preview/cloud/FileCloudItem.tsx">
        <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight mb-1" data-unique-id="f25fd47c-5440-46da-a6e4-43d22e1e76a0" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {file.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500" data-unique-id="ed2eee7e-a179-4227-b365-ec8ee168f1f7" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {file.categoryName && <span className="truncate" data-unique-id="3383538d-2d3b-4685-b3f3-cc95500116db" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">{file.categoryName}</span>}
          {file.fileType && <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium uppercase" data-unique-id="9f817067-d76b-441a-8a7f-3e3f7ef60f95" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
              {file.fileType}
            </span>}
        </div>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="space-y-2" data-unique-id="02f76aa1-b31e-4698-a6a6-acd5a3257f49" data-file-name="components/preview/cloud/FileCloudItem.tsx">
        <Button onClick={openInNewTab} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-9 text-sm font-medium" data-unique-id="3a914fe4-48a2-4b30-b53f-b2c08aacd92f" data-file-name="components/preview/cloud/FileCloudItem.tsx">
          <ExternalLink className="h-4 w-4 mr-2" />
          <span className="editable-text" data-unique-id="4a1db285-0e38-4d06-8b8d-aae520ed4f69" data-file-name="components/preview/cloud/FileCloudItem.tsx">Open</span>
        </Button>

        <Button onClick={handleDownload} variant="outline" className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 h-9 text-sm font-medium" disabled={downloading} data-unique-id="9605fbb2-a2bc-45a1-a7e2-fbf5923173b5" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {downloading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : downloadSuccess ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Download className="h-4 w-4 mr-2" />}
          <span className="editable-text" data-unique-id="b18a1a67-6d56-4f60-832b-0b053a4b25e0" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
            {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
          </span>
        </Button>
      </div>

      {/* Success Message */}
      {downloadSuccess && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg" data-unique-id="1bca8a63-e80f-435f-b382-11e95f5333b9" data-file-name="components/preview/cloud/FileCloudItem.tsx">
          <p className="text-xs text-green-700 text-center flex items-center justify-center" data-unique-id="fe9d1505-ab71-4e42-b7ed-cf5cd8388850" data-file-name="components/preview/cloud/FileCloudItem.tsx">
            <Check className="h-3 w-3 mr-1" />
            <span className="editable-text" data-unique-id="55b9c7b4-23a9-47d4-b665-be350e9ada5f" data-file-name="components/preview/cloud/FileCloudItem.tsx">File downloaded successfully!</span>
          </p>
        </div>}
    </div>;
}