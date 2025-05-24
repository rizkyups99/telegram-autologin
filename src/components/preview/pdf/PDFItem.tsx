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
  return <div className="border rounded-lg overflow-hidden flex flex-col" data-unique-id="12ed4c2b-aac1-4c90-9a3f-822aa32d15dd" data-file-name="components/preview/pdf/PDFItem.tsx">
      <div className="aspect-[3/4] relative" data-unique-id="aa14148e-ddf8-4a3e-8a35-c5ce023d6e92" data-file-name="components/preview/pdf/PDFItem.tsx">
        <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-unique-id="b1120275-0822-4a94-a44c-1befc6c4a6ba" data-file-name="components/preview/pdf/PDFItem.tsx" />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1" data-unique-id="84435da9-3d6a-4513-850b-c4351de8ea06" data-file-name="components/preview/pdf/PDFItem.tsx">
        <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2" data-unique-id="109eed2f-9fdc-46f7-85ea-b474284503c4" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">{pdf.title}</h4>
        <div className="mt-auto" data-unique-id="3da4dc3f-d4e1-4fba-b2bd-7c6361ea47ff" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
          <Button onClick={() => onDownloadPDF(pdf)} variant={isCompleted ? "default" : "outline"} className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9" disabled={isDownloading} data-unique-id="5e24a51b-e795-4161-a310-47772fe55cf1" data-file-name="components/preview/pdf/PDFItem.tsx" data-dynamic-text="true">
            {isDownloading ? <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1" data-unique-id="fc05fd6e-fc0a-4901-818a-2586ccf15fb1" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="f7177d24-1bf2-41dd-aeff-c7442783bc85" data-file-name="components/preview/pdf/PDFItem.tsx">Download...</span></span>
              </> : isCompleted ? <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="0f10e976-e2e1-4635-8964-fb10e9fd283e" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="608fe337-1bdc-4404-8279-dee4994f3cab" data-file-name="components/preview/pdf/PDFItem.tsx">Selesai</span></span>
              </> : <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1" data-unique-id="0d013d44-3bf3-495b-872f-d56d897269d6" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="0481bec8-3d8b-4014-9f1c-90fe6b761533" data-file-name="components/preview/pdf/PDFItem.tsx">Download PDF</span></span>
              </>}
          </Button>
          
          {isCompleted && <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2" data-unique-id="ad0da802-353f-49cb-838b-cbf297cef672" data-file-name="components/preview/pdf/PDFItem.tsx"><span className="editable-text" data-unique-id="8779430c-ed71-4fbd-a1d2-ee8d81a4507e" data-file-name="components/preview/pdf/PDFItem.tsx">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </span></p>}
        </div>
      </div>
    </div>;
}