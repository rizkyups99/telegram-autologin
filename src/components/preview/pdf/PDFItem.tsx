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

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <div className="aspect-[3/4] relative">
        <img 
          src={pdf.coverUrl} 
          alt={pdf.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <h4 className="font-medium text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2">{pdf.title}</h4>
        <div className="mt-auto">
          <Button 
            onClick={() => onDownloadPDF(pdf)}
            variant={isCompleted ? "default" : "outline"}
            className="w-full flex items-center justify-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="line-clamp-1">Download...</span>
              </>
            ) : isCompleted ? (
              <>
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1">Selesai</span>
              </>
            ) : (
              <>
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="line-clamp-1">Download PDF</span>
              </>
            )}
          </Button>
          
          {isCompleted && (
            <p className="text-[10px] sm:text-xs text-center text-green-600 mt-1 sm:mt-2 line-clamp-2">
              Silahkan cek penyimpanan lokal HP atau PC anda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
