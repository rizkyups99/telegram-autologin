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
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="60358d25-2cf8-44e7-adfe-4f6183737b78" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="2849867f-814c-454d-b0d6-7758fbe2f918" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="58f7440c-ac68-479d-9e55-ebeed5764969" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="a5daf641-050f-4447-9b10-7cf8e7ecde22" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className={`font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2 ${isCurrentlyReading ? 'font-bold text-red-600' : ''}`} data-unique-id="ee28d7bf-74f8-4094-9a01-842a13b77d25" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto space-y-2" data-unique-id="5a25fa70-7adb-4c88-a799-8fc6479ca81b" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onReadPDF(pdf)} className={`w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 ${isCurrentlyReading ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' : 'bg-green-600 hover:bg-green-700 text-white border-green-600'}`} data-unique-id="54a0ba80-09b7-4290-8bcc-6d97d6c734e8" data-file-name="components/preview/pdf/PDFItem.tsx">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1" data-unique-id="1eb80cb0-b68c-44e5-a75c-1bc46b887fa0" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="eebc268a-951b-4cc0-bb61-7140d3bae40e" data-file-name="components/preview/pdf/PDFItem.tsx">Baca PDF</span></span>
          </Button>
          
          <Button onClick={() => onDownloadPDF(pdf)} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600" disabled={isDownloading} data-unique-id="ab72927d-85cc-4332-8694-684707fd13e3" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="c984c06b-6c0f-4d77-883c-a2848f5f9dd4" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="d5a33056-020b-4998-b5d2-dbdd19c78950" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="a363180a-c474-40ed-8bfd-902167ff80e8" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="f47daddc-4217-4128-b021-926fa6d51e34" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="45970e42-36d4-4b06-8744-ffcfaa3eadba" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="88f4aaf9-71b4-4f91-a25b-09a8eba84d2e" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="d19862fa-7fbb-4c34-b8a5-a3829796bfe0" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="5697c191-dbec-4b28-a230-00dedf676bf5" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}