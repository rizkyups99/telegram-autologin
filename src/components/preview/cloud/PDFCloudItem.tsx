'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Check, Loader, BookOpen } from 'lucide-react';
interface PDFCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface PDFCloudItemProps {
  pdf: PDFCloudFile;
  onViewPDF?: (pdf: PDFCloudFile) => void;
}
export function PDFCloudItem({
  pdf,
  onViewPDF
}: PDFCloudItemProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(pdf.fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdf.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      if (typeof window !== 'undefined') {
        window.open(pdf.fileUrl, '_blank');
      }
    } finally {
      setDownloading(false);
    }
  };
  const handleView = () => {
    if (onViewPDF) {
      onViewPDF(pdf);
    } else {
      // Open in new tab as fallback
      if (typeof window !== 'undefined') {
        window.open(pdf.fileUrl, '_blank');
      }
    }
  };
  return <Card className="group hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 rounded-lg overflow-hidden h-full" data-unique-id="0bea3ea5-e845-46a6-998a-103f3ddfbb75" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
      <CardContent className="p-4 flex flex-col h-full" data-unique-id="0cf3f832-83a9-40bd-a98c-0617d35af98b" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
        {/* PDF Cover - Top Section */}
        <div className="relative mb-4 mx-auto" data-unique-id="38f58c14-451d-443c-a33f-ce55388b27a8" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-sm overflow-hidden flex-shrink-0" data-unique-id="4927cbc5-888a-4ab6-aedd-b64f6e23f479" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            <img src={pdf.coverUrl} alt={`Cover for ${pdf.title}`} className="w-full h-full object-cover" onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                `;
          }} data-unique-id="a144af60-8b3a-4ef1-88f7-dcf78bda37be" data-file-name="components/preview/cloud/PDFCloudItem.tsx" />
          </div>
        </div>

        {/* PDF Info - Center Section */}
        <div className="flex-1 text-center mb-4" data-unique-id="1fedfbb3-212a-4c5d-a500-491d9960b518" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <h4 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 mb-2 leading-tight" data-unique-id="93f910de-af14-428b-a268-6bc0581f6aed" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            {pdf.title}
          </h4>
          
          <div className="space-y-1" data-unique-id="8d153e99-bfb9-4a2c-bf65-e38dea2fdcc0" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            <p className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block" data-unique-id="540eee08-80cb-48fa-b440-aa876fcc5ddc" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="6d0b5641-3f51-48c8-bffc-14f3bc3dd477" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
              PDF DOCUMENT
            </span></p>
            {pdf.categoryName && <p className="text-xs text-gray-600" data-unique-id="16b1e05a-6308-410d-a0bd-058eda775f61" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
                {pdf.categoryName}
              </p>}
          </div>
        </div>

        {/* Action Buttons - Bottom Section */}
        <div className="space-y-2 mt-auto" data-unique-id="3dd66212-ae41-457f-94dd-a6631aaf9f37" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <Button onClick={handleView} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" data-unique-id="586848b0-9228-4333-b126-735abacc69ca" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            <BookOpen className="w-4 h-4" />
            <span data-unique-id="9c517e49-f2ee-464c-963f-d04c3b2a73f7" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="305e7397-aeb3-4de4-9c12-5377f6af956f" data-file-name="components/preview/cloud/PDFCloudItem.tsx">View</span></span>
          </Button>
          
          <Button onClick={handleDownload} variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" disabled={downloading} data-unique-id="2948bf2a-ecc6-46ad-b721-1c9d7744f1d3" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            {downloading ? <Loader className="w-4 h-4 animate-spin" /> : downloadSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Download className="w-4 h-4" />}
            <span data-unique-id="bf7cb99c-fd96-4bcd-af4d-d28097766a14" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
              {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
            </span>
          </Button>
        </div>

        {/* Success Message */}
        {downloadSuccess && <p className="text-xs text-green-600 mt-2 text-center" data-unique-id="2e87d006-6092-4cdf-8c97-b455fc65f1e7" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="b36ece93-f13a-4df8-9442-b750e1a88ff7" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            File downloaded successfully!
          </span></p>}
      </CardContent>
    </Card>;
}