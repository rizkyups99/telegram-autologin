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
  return <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 flex flex-col h-full" data-unique-id="4bb1c78a-6615-4500-9cf2-447be984a916" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
      {/* File Cover/Icon - Top */}
      <div className="w-full aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100 mb-3 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-unique-id="d5c96d6a-b0d0-498d-aaf0-7bf1718867df" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
        {file.coverUrl && file.coverUrl !== '' ? <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" onError={e => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement?.classList.add('bg-gradient-to-br', 'from-gray-50', 'to-gray-100');
      }} data-unique-id="15518f97-bc27-4d17-996c-aeb5c1ccc585" data-file-name="components/preview/cloud/FileCloudItem.tsx" /> : <div className="text-blue-600" data-unique-id="4725fa76-ccfe-46bd-a11d-56ecdedde139" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
            {getFileTypeIcon(file.fileType)}
          </div>}
      </div>

      {/* Title and File Type - Center */}
      <div className="flex-1 mb-4" data-unique-id="fa0a315a-0149-4dbb-9361-743b1e862696" data-file-name="components/preview/cloud/FileCloudItem.tsx">
        <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight mb-1" data-unique-id="2c55c002-0432-4433-9336-8e4e45d305bd" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {file.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500" data-unique-id="a2b7c9d5-fd43-4bd4-be90-e576308d86ce" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {file.categoryName && <span className="truncate" data-unique-id="b1c30f31-aaf2-41f4-a87d-52a08fec735f" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">{file.categoryName}</span>}
          {file.fileType && <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium uppercase" data-unique-id="408a5d96-de57-483b-891d-333a9b29f29d" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
              {file.fileType}
            </span>}
        </div>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="space-y-2" data-unique-id="4d9d106c-af1d-43a3-a881-8ffb469f4cd1" data-file-name="components/preview/cloud/FileCloudItem.tsx">
        <Button onClick={openInNewTab} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-9 text-sm font-medium" data-unique-id="ff3651a0-84eb-4f64-92b0-79f6dde63871" data-file-name="components/preview/cloud/FileCloudItem.tsx">
          <ExternalLink className="h-4 w-4 mr-2" />
          <span className="editable-text" data-unique-id="5b38af5d-93e8-427d-9a8c-dca521f0c680" data-file-name="components/preview/cloud/FileCloudItem.tsx">Open</span>
        </Button>

        <Button onClick={handleDownload} variant="outline" className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 h-9 text-sm font-medium" disabled={downloading} data-unique-id="b10105de-8e34-441c-b21b-efae6c2d21b4" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
          {downloading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : downloadSuccess ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Download className="h-4 w-4 mr-2" />}
          <span className="editable-text" data-unique-id="0083a60b-35db-46b2-a78f-c7b8fd39ea80" data-file-name="components/preview/cloud/FileCloudItem.tsx" data-dynamic-text="true">
            {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
          </span>
        </Button>
      </div>

      {/* Success Message */}
      {downloadSuccess && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg" data-unique-id="a81085d1-0c24-47ea-be5e-b5dc644f32ec" data-file-name="components/preview/cloud/FileCloudItem.tsx">
          <p className="text-xs text-green-700 text-center flex items-center justify-center" data-unique-id="76c36c55-28b2-4dee-abb2-639fe7a3c504" data-file-name="components/preview/cloud/FileCloudItem.tsx">
            <Check className="h-3 w-3 mr-1" />
            <span className="editable-text" data-unique-id="c91b2580-eff1-41de-b890-07bf957b64a3" data-file-name="components/preview/cloud/FileCloudItem.tsx">File downloaded successfully!</span>
          </p>
        </div>}
    </div>;
}