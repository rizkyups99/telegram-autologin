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
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="8936b301-13d0-49d3-bd26-d3d7c08c753c" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="e59e948e-e3e6-4053-a4f2-746c76a17886" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="03c09f35-253d-40b5-a321-9c3c5f8cd3ef" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="702de3c7-c610-4eee-8f83-2f7165a8b680" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2" data-unique-id="a1bf984e-aa75-4277-9d68-6e2036725089" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto space-y-2" data-unique-id="5039a4ed-53a6-4e95-b25d-87e372533699" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onReadPDF(pdf)} variant="outline" className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9" data-unique-id="bb4b383b-cc1f-4dbc-81b4-0c1b08d9f7ff" data-file-name="components/preview/pdf/PDFItem.tsx">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="line-clamp-1" data-unique-id="51802506-734f-4653-a5e3-bef9d5776060" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="562cd658-315a-4d64-b847-09ba979aeefb" data-file-name="components/preview/pdf/PDFItem.tsx">Baca PDF</span></span>
          </Button>
          
          <Button onClick={() => onDownloadPDF(pdf)} variant={isCompleted ? "default" : "outline"} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9" disabled={isDownloading} data-unique-id="4156708e-2ce5-429a-9d34-1132b8b1836a" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="b74086cb-57da-400e-8689-fa97a620fdac" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="48db0828-3e4b-41c8-aaa9-adfe61923ce4" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="2fc3285c-7d11-4395-b2e1-16bace8e52cd" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="1d80c813-fe0b-44c9-a388-58d51fa2ac99" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="2f716686-505e-43eb-afb0-5142a4d513e1" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="4695a394-18db-453e-a13c-d9194d59ba55" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="231d5a33-c01a-473e-886c-7d956fd2ee87" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="fc654d22-21e6-45b6-943d-ace48b81030b" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}