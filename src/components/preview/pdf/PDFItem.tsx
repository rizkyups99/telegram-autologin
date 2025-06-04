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
}
export function PDFItem({
  pdf,
  onDownloadPDF,
  onReadPDF,
  downloadStatus
}: PDFItemProps) {
  const isDownloading = downloadStatus.id === pdf.id && downloadStatus.status === 'downloading';
  const isCompleted = downloadStatus.id === pdf.id && downloadStatus.status === 'completed';
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="a8813b5b-e796-495c-be3c-d6f991b2af45" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="7e54c0e0-2a4b-4e5c-86ba-767b5e5ffff5" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="78aca292-536e-49ee-bdc0-098c81b90aaf" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="34eec66e-cf5f-4c91-942b-ab9bb173d15b" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2" data-unique-id="02d5492e-7bce-4855-8971-65050624337c" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto space-y-2" data-unique-id="41c30d14-fe95-4fe0-9ed2-717f3c11f67c" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onReadPDF(pdf)} variant="outline" className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9" data-unique-id="37a1f638-9204-4063-8b02-34cc9256d953" data-file-name="components/preview/pdf/PDFItem.tsx">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1" data-unique-id="a814e0d6-65df-4803-ab51-c063e056be61" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="6ddaa6c1-6acf-4e23-b6f0-5cc851f5fa93" data-file-name="components/preview/pdf/PDFItem.tsx">Baca PDF</span></span>
          </Button>
          
          <Button onClick={() => onDownloadPDF(pdf)} variant={isCompleted ? "default" : "outline"} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9" disabled={isDownloading} data-unique-id="9a1288b5-16b7-4ed8-b94f-6929a9873e6a" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="cb6c4cf5-f72f-4652-ae94-34a33bbff2ba" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="1658bae4-9b55-496b-9654-9a47f92e567a" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="c32711f5-d473-4a72-83e7-b960acccc193" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="cda783fa-f48d-4b99-ba9b-f341708af66a" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="5979fd36-ffef-410e-a270-c4cbda162eea" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="3bd68713-1fb6-4e3f-9ce3-a3e78f510d5c" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="4fb1c0ac-f374-4188-b109-d3fd47f82fd5" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="c0a7647f-8c35-49fe-8ec2-d717c5005007" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}