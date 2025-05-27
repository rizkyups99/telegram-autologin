'use client';

import { Button } from '@/components/ui/button';
import { Download, Check, Loader } from 'lucide-react';
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
  downloadStatus: {
    id: number | null;
    status: 'downloading' | 'completed' | null;
  };
}
export function PDFItem({
  pdf,
  onDownloadPDF,
  downloadStatus
}: PDFItemProps) {
  const isDownloading = downloadStatus.id === pdf.id && downloadStatus.status === 'downloading';
  const isCompleted = downloadStatus.id === pdf.id && downloadStatus.status === 'completed';
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="cdd0849c-c1a5-45dd-83c4-df4ac46411ba" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="a0a9654a-8fc2-42b9-b38d-764e8f43efe5" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="b687e266-e82c-4d08-862a-444c083287dd" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="28a028d7-70d3-4356-a3d1-b88adb763a96" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2" data-unique-id="43ed0f71-cd21-441f-86b5-4cb1ae85108d" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto" data-unique-id="7e4076a7-291d-40ea-81b1-d086cf1cddee" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onDownloadPDF(pdf)} variant={isCompleted ? "default" : "outline"} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9" disabled={isDownloading} data-unique-id="f91e1dfa-9828-4ddd-bcdf-52da08e1caca" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="64b500c2-7e08-4152-9806-dd5dfc370c3d" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="8cf88e93-da79-431d-8a45-e482f18a3af6" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="9f5fa1b3-ee7a-43a8-a08f-12cc683764c6" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="143c3e8b-7c18-4764-8f66-413f77b20ffd" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="682445be-f007-4913-8574-7c5aa5e22827" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="84bfaccd-a599-47a4-9830-14332a8f3f83" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="21336180-cba1-42eb-94c9-42ae7ff08db6" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="0c3f18df-cdfc-442a-8861-f95c630e03cc" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}