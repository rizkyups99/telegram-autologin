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
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="d882a1e3-b7cb-499b-8e3f-e578db36b0a0" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="0be591ac-0fd2-4105-a272-04db6978adfc" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="57625cfc-c177-40e6-b79c-6233eac93c63" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="aed5b7ba-4eff-4250-92fb-39905f885b10" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className={`font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2 ${isCurrentlyReading ? 'font-bold text-red-600' : ''}`} data-unique-id="4d260a81-1c5f-483a-91d9-588aecd35c19" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto space-y-2" data-unique-id="153688ca-98fc-46b9-95c5-194222d66122" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onReadPDF(pdf)} className={`w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 ${isCurrentlyReading ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'bg-green-600 hover:bg-green-700 text-white border-green-600'}`} data-unique-id="8316a697-f580-4e75-bd32-76c4c848a67d" data-file-name="components/preview/pdf/PDFItem.tsx">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1" data-unique-id="f7077fc3-0197-484f-bcb6-d903966927b2" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="f3ae4034-c0ae-43d3-a839-7c24f8074ecf" data-file-name="components/preview/pdf/PDFItem.tsx">Baca PDF</span></span>
          </Button>
          
          <Button onClick={() => onDownloadPDF(pdf)} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600" disabled={isDownloading} data-unique-id="5cd852ea-fd8b-48dd-9e07-01d9c2a68335" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="a03fa04d-a1d3-4b8b-bfc8-8a744f6066d7" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="58e6dbb2-935e-4967-8cc3-1bfc009dc07d" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="03ed8ddc-444b-44cb-ac07-f12443cae76c" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="9a308d86-d345-452b-8887-62dd7c7fcf7b" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="9a11301e-8ff5-46b8-9c73-2e7255b78e24" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="ed79709a-4ad7-4b3f-aec2-85f31b3bd64d" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="58c29ba1-0260-4206-b4c3-7fb7f072060d" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="275b42ac-c597-4917-9205-69db86cdaa26" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}