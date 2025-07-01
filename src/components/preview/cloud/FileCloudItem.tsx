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
  return <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 flex flex-col h-full" data-unique-id="b962ab7c-ad16-4a12-8544-282ba0c65344" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
      {/* File Cover/Icon - Top */}
      <div className="w-full aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100 mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-unique-id="47e4ee64-1169-4ecf-a4c2-ea9d90b0ae09" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
        {file.coverUrl && file.coverUrl !== '' ? <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" onError={e => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-50', 'to-gray-100');
      }} data-unique-id="95b7975c-d3b5-4555-9c0e-d2ea6baf6985" data-file-name="components/preview/cloud/FileCloudItem.tsx" /> : <div className="text-blue-600" data-unique-id="59edad6f-5f92-4290-8c6b-4b329ae9a6e1" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
            {getFileTypeIcon(file.fileType)}
          </div>}
      </div>

      {/* Title and File Type - Center */}
      <div className="flex-1 mb-4" data-unique-id="3ebcdc6e-4fad-4dc3-93e0-76590328a528" data-file-name="components/preview/cloud/FileCloudItem.tsx">
        <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight mb-1" data-unique-id="fc4ef1ee-c8a1-47c9-8e79-c4c9b7378257" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {file.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500" data-unique-id="dab772d0-5f82-4ee5-a5f7-6ca32c78c571" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {file.categoryName && <span className="truncate" data-unique-id="6bd063af-f3b8-4761-b498-f54d7428cce7" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">{file.categoryName}</span>}
          {file.fileType && <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium uppercase" data-unique-id="339159b6-35a4-4143-90a9-34472d92babe" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
              {file.fileType}
            </span>}
        </div>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="space-y-2" data-unique-id="6e18a043-71ce-4a9c-a477-e757ca8b281f" data-file-name="components/preview/cloud/FileCloudItem.tsx">
        <Button onClick={openInNewTab} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-9 text-sm font-medium" data-unique-id="2f099cbe-690c-4e49-bc58-cab0fcbcf541" data-file-name="components/preview/cloud/FileCloudItem.tsx">
          <ExternalLink className="h-4 w-4 mr-2" />
          <span className="editable-text" data-unique-id="7dccb268-5307-4266-9ae9-9c9da5fbfcf5" data-file-name="components/preview/cloud/FileCloudItem.tsx">Open</span>
        </Button>

        <Button onClick={handleDownload} variant="outline" className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 h-9 text-sm font-medium" disabled={downloading} data-unique-id="a4708b21-c9d1-4ca4-9b9b-828127eef5fd" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {downloading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : downloadSuccess ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Download className="h-4 w-4 mr-2" />}
          <span className="editable-text" data-unique-id="0ff5e7fe-1444-48a0-b860-39075c64b350" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
            {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
          </span>
        </Button>
      </div>

      {/* Success Message */}
      {downloadSuccess && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg" data-unique-id="ffbac2d5-d168-490a-afa6-1b77f3b34faa" data-file-name="components/preview/cloud/FileCloudItem.tsx">
          <p className="text-xs text-green-700 text-center flex items-center justify-center" data-unique-id="eba370b8-703d-49bc-9a7d-7807e25da4cd" data-file-name="components/preview/cloud/FileCloudItem.tsx">
            <Check className="h-3 w-3 mr-1" />
            <span className="editable-text" data-unique-id="b93da037-d532-43b8-b396-d9c706bd4620" data-file-name="components/preview/cloud/FileCloudItem.tsx">File downloaded successfully!</span>
          </p>
        </div>}
    </div>;
}