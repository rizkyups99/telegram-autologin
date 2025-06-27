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
  return <Card className="group hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 rounded-lg overflow-hidden h-full" data-unique-id="cf1338ec-8dd6-4cfb-b88e-1cedd71173e5" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
      <CardContent className="p-4 flex flex-col h-full" data-unique-id="efc93898-eced-423a-9562-7c2bb48f881a" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
        {/* PDF Cover - Top Section */}
        <div className="relative mb-4 mx-auto" data-unique-id="a892070d-fce3-40ba-a50f-1b19632b62bd" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-sm overflow-hidden flex-shrink-0" data-unique-id="3522ce09-c0c6-46c1-8b3c-62986b9a6b4f" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
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
          }} data-unique-id="38e0889e-2fce-4dd1-ac03-4756cfc518f8" data-file-name="components/preview/cloud/PDFCloudItem.tsx" />
          </div>
        </div>

        {/* PDF Info - Center Section */}
        <div className="flex-1 text-center mb-4" data-unique-id="427a4565-e349-48ff-ad83-b5541b200289" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <h4 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 mb-2 leading-tight" data-unique-id="d99fc920-56c1-409a-81a5-253f49896b5f" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            {pdf.title}
          </h4>
          
          <div className="space-y-1" data-unique-id="5c69282f-4969-4701-93b3-e0a8818775f8" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            <p className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block" data-unique-id="9e00f2a3-d695-4455-8c74-5e2c4aac6eb9" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="eb5410ff-1038-421c-99c7-56ff0a917061" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
              PDF DOCUMENT
            </span></p>
            {pdf.categoryName && <p className="text-xs text-gray-600" data-unique-id="2683465f-b2b5-405f-b142-55b69690c57f" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
                {pdf.categoryName}
              </p>}
          </div>
        </div>

        {/* Action Buttons - Bottom Section */}
        <div className="space-y-2 mt-auto" data-unique-id="d8dcbc47-d3aa-416a-9b2d-be9795199ad0" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <Button onClick={handleView} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" data-unique-id="279d6faa-28bd-41d5-91dc-cc749bacc7df" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            <BookOpen className="w-4 h-4" />
            <span data-unique-id="fc035824-0438-4d16-8adc-4aea8a91b54e" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="8f1ea96a-fae7-4c80-86ba-9bf16049437d" data-file-name="components/preview/cloud/PDFCloudItem.tsx">View</span></span>
          </Button>
          
          <Button onClick={handleDownload} variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" disabled={downloading} data-unique-id="93518112-7752-4ac6-96e9-2e87c6c959e0" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            {downloading ? <Loader className="w-4 h-4 animate-spin" /> : downloadSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Download className="w-4 h-4" />}
            <span data-unique-id="83948918-3746-4bc3-873d-84f6a697550e" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
              {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
            </span>
          </Button>
        </div>

        {/* Success Message */}
        {downloadSuccess && <p className="text-xs text-green-600 mt-2 text-center" data-unique-id="4d6a640b-c266-452a-a572-faf46d2cb88e" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="e4aedd7b-0b13-4696-b6ec-f63a2d5945fa" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            File downloaded successfully!
          </span></p>}
      </CardContent>
    </Card>;
}