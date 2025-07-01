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
  return <Card className="group hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 rounded-lg overflow-hidden h-full" data-unique-id="31c083fc-ecbd-4cce-83af-6e40cc08266e" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
      <CardContent className="p-4 flex flex-col h-full" data-unique-id="3af89f61-5566-4243-8572-f721a69dd6ad" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
        {/* PDF Cover - Top Section */}
        <div className="relative mb-4 mx-auto" data-unique-id="4e54eaa0-8b1b-4d25-a7d0-fc5d89a9a706" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <div className="w-24 h-32 sm:w-28 sm:h-36 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-sm overflow-hidden flex-shrink-0" data-unique-id="1c8cbb33-10e4-415d-998c-41c8a495410f" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
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
          }} data-unique-id="9404cbd8-5682-46a5-bd6c-c1a156932113" data-file-name="components/preview/cloud/PDFCloudItem.tsx" />
          </div>
        </div>

        {/* PDF Info - Center Section */}
        <div className="flex-1 text-center mb-4" data-unique-id="5cabf0b9-d291-4f07-b37c-646c1b11cc0d" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <h4 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 mb-2 leading-tight" data-unique-id="65b42d45-d424-47e1-b954-1761532a4df5" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            {pdf.title}
          </h4>
          
          <div className="space-y-1" data-unique-id="7a878bde-735b-4443-be76-bba2d5d3caf3" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            <p className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block" data-unique-id="9ed5b3d8-098c-431d-8522-92148a15c1c3" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="474befbf-6d35-4c66-9c14-193d50970859" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
              PDF DOCUMENT
            </span></p>
            {pdf.categoryName && <p className="text-xs text-gray-600" data-unique-id="86699248-e65f-4df3-b94d-b935470a6362" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
                {pdf.categoryName}
              </p>}
          </div>
        </div>

        {/* Action Buttons - Bottom Section */}
        <div className="space-y-2 mt-auto" data-unique-id="2886b2aa-e457-447f-8c81-95cacc8a9eeb" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
          <Button onClick={handleView} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" data-unique-id="a673ef77-0223-4b1b-b54b-7c49c4268ac2" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            <BookOpen className="w-4 h-4" />
            <span data-unique-id="a7d09924-956e-417d-82e4-033e6afb21ab" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="a202f3cb-9da2-49b2-8871-a50d4fb10e8e" data-file-name="components/preview/cloud/PDFCloudItem.tsx">View</span></span>
          </Button>
          
          <Button onClick={handleDownload} variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" disabled={downloading} data-unique-id="dd0a8f5c-12aa-46d4-9038-dfb45586e375" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
            {downloading ? <Loader className="w-4 h-4 animate-spin" /> : downloadSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Download className="w-4 h-4" />}
            <span data-unique-id="6940ee2c-5780-4821-900d-024da668c1d7" data-file-name="components/preview/cloud/PDFCloudItem.tsx" data-dynamic-text="true">
              {downloading ? 'Downloading...' : downloadSuccess ? 'Downloaded!' : 'Download'}
            </span>
          </Button>
        </div>

        {/* Success Message */}
        {downloadSuccess && <p className="text-xs text-green-600 mt-2 text-center" data-unique-id="e427ebf8-baa0-4ea5-84b9-afb0b1657676" data-file-name="components/preview/cloud/PDFCloudItem.tsx"><span className="editable-text" data-unique-id="516fba6b-7024-4bd2-93fa-9eb2b8b26db8" data-file-name="components/preview/cloud/PDFCloudItem.tsx">
            File downloaded successfully!
          </span></p>}
      </CardContent>
    </Card>;
}