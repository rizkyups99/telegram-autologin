'use client';

import { Button } from '@/components/ui/button';
import { Download, Check, Loader, BookOpen } from 'lucide-react';
interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface PDFItemProps {
  pdf: PDF;
  onDownloadPDF: (pdf: PDF) => void;
  onReadPDF: (pdf: PDF) => void;
  downloadStatus: {
    id: number | null;
    status: 'downloading' | 'completed' | null;
  };
  currentReadingPDF: PDF | null;
}
export function PDFItem({
  pdf,
  onDownloadPDF,
  onReadPDF,
  downloadStatus,
  currentReadingPDF
}: PDFItemProps) {
  const isCurrentlyReading = currentReadingPDF?.id === pdf.id;
  const isDownloading = downloadStatus.id === pdf.id && downloadStatus.status === 'downloading';
  const isCompleted = downloadStatus.id === pdf.id && downloadStatus.status === 'completed';
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="e9a33389-4257-4eed-ae37-c5f1ab9e4c24" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="4570693a-a408-44db-90e6-a3436900b58d" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="aceaeae2-0885-45f3-a821-53ee98a1a063" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="80cf4a94-c59e-426c-8927-5e8d6d2bc011" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className={`font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2 ${isCurrentlyReading ? 'font-bold text-red-600' : ''}`} data-unique-id="4452b247-3a67-4190-aa64-8ceea290401b" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto space-y-2" data-unique-id="37ac9754-e403-4ed9-b492-6896f60428ab" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onReadPDF(pdf)} className={`w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 ${isCurrentlyReading ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'bg-green-600 hover:bg-green-700 text-white border-green-600'}`} data-unique-id="86fc9090-46dd-4cab-95e1-d7c705e61c38" data-file-name="components/preview/pdf/PDFItem.tsx">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1" data-unique-id="7be0a7b5-2f20-4cb5-b94c-bb1bee0abaa4" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="a2f6f2e9-433f-42e1-b927-bf0ea2b3ce24" data-file-name="components/preview/pdf/PDFItem.tsx">Baca PDF</span></span>
          </Button>
          
          <Button onClick={() => onDownloadPDF(pdf)} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600" disabled={isDownloading} data-unique-id="9042b496-370d-40ec-8d75-3ba5488ab08f" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="6ff1278a-4a75-4f7a-b4fb-ec6bb353ac7a" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="51f75313-37bc-4193-84f3-59e9c2eef87f" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="5594dd50-b650-4dbb-b710-7002d07a1697" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="f506a23b-d21e-4c9e-b6b0-3042b868b6df" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="0d79b999-3b96-4277-9400-bca6ebf77738" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="dea8a828-5dbf-41e6-b1a1-e9bc309813d2" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="45a3bb24-3348-44b2-8708-8191fce73377" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="eb92f4da-d8a8-49ee-837f-9a7318f3cb14" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}