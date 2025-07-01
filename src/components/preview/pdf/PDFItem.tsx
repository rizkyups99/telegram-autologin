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
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="ba3e6c5e-d209-4551-a723-a89078036b0b" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="1053ce1a-e83f-47f9-b511-39e5e38bc07c" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="e20cef13-f153-4397-9a91-3f9064500d23" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="272dd6de-9d2f-4043-97be-962d4a0959f6" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className={`font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2 ${isCurrentlyReading ? 'font-bold text-red-600' : ''}`} data-unique-id="a6d31ec1-680e-46bb-b82a-1cfc420dbd0d" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto space-y-2" data-unique-id="5eaa4bce-5981-47fe-bea8-a22cfb7e68e4" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onReadPDF(pdf)} className={`w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 ${isCurrentlyReading ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'bg-green-600 hover:bg-green-700 text-white border-green-600'}`} data-unique-id="54976519-2c22-40dc-a25a-49aa5511140d" data-file-name="components/preview/pdf/PDFItem.tsx">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1" data-unique-id="dc70f666-35e1-4558-bd33-2098c63ce609" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="d30cf943-b990-4d30-bc98-ef9c5b76b3d1" data-file-name="components/preview/pdf/PDFItem.tsx">Baca PDF</span></span>
          </Button>
          
          <Button onClick={() => onDownloadPDF(pdf)} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600" disabled={isDownloading} data-unique-id="b1806978-db3f-4cdf-92ea-c3a71bfe4720" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="7d59a6da-7243-4e19-884e-4c48d07180e8" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="5afd3cea-6bc5-4194-9120-ddac2a49fa54" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="e9d6d469-81df-493b-94fb-65992ba4c3d6" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="56a65fb8-f30a-48ab-bb60-19764b5923ee" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="fb03a345-c917-4775-807a-cd36bce4a630" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="cf126a16-092e-4c7a-adec-d351bf307e58" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="fe525aa1-6ca6-4c31-837f-c6b080fcd311" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="b640336e-0642-48f5-8e27-a7889e35d1a4" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}