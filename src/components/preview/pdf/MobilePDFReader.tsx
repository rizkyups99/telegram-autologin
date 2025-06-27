'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface MobilePDFReaderProps {
  selectedPDF: PDF;
  onDownloadPDF: (pdf: PDF) => void;
  categoryName?: string;
}
export function MobilePDFReader({
  selectedPDF,
  onDownloadPDF,
  categoryName
}: MobilePDFReaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [renderMethod, setRenderMethod] = useState<'embed' | 'iframe' | 'object'>('embed');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(mobile);

      // For mobile Chrome, prefer iframe method
      if (mobile && /chrome/i.test(userAgent)) {
        setRenderMethod('iframe');
      }
    }
  }, []);
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };
  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(selectedPDF.fileUrl, '_blank');
    }
  };
  const renderPDFContent = () => {
    const pdfUrl = `${selectedPDF.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=${zoom}`;
    if (renderMethod === 'iframe') {
      return <iframe src={pdfUrl} className="w-full h-full border-0" title={selectedPDF.title} style={{
        minHeight: '600px'
      }} onError={() => {
        console.log('Iframe failed, trying object method');
        setRenderMethod('object');
      }} data-unique-id="3b72f90e-b4fd-4a1e-810b-f95b10b75eb9" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
    }
    if (renderMethod === 'object') {
      return <object data={pdfUrl} type="application/pdf" className="w-full h-full" style={{
        minHeight: '600px'
      }} data-unique-id="8fa16ca6-0495-42a5-a3a4-057ee1b3db29" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8" data-unique-id="6b06717b-171e-4290-a6c3-a6a2ec07dcdb" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <p className="text-center text-muted-foreground" data-unique-id="d168d9d7-ca9a-427e-9623-01a2641f438e" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="b01843d0-c5a1-4c68-8384-f0f5540616da" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              PDF cannot be displayed in this browser. Please download or open in a new tab.
            </span></p>
            <div className="flex gap-2" data-unique-id="32fbd491-ad25-436b-8af9-d06588ab49c5" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              <Button onClick={openInNewTab} variant="outline" data-unique-id="4c6df8d7-84ce-4407-9e6d-8754784847dc" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="585c56b8-80f2-4d0b-bd9f-d9fbf86089af" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                Open in New Tab
              </span></Button>
              <Button onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="029edb79-608f-4752-b1c5-08d4f113f275" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="21518935-1f37-417d-9d80-653c7e29c7e8" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                Download PDF
              </span></Button>
            </div>
          </div>
        </object>;
    }

    // Default embed method
    return <embed src={pdfUrl} type="application/pdf" className="w-full h-full" style={{
      minHeight: '600px'
    }} onError={() => {
      console.log('Embed failed, trying iframe method');
      setRenderMethod('iframe');
    }} data-unique-id="63a15bba-02bb-42b1-9831-a80c81e74c27" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
  };
  return <div className="flex flex-col h-full" data-unique-id="589e15fb-e0b9-421a-bf9e-c7a99bd349b4" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="mb-4 p-4 bg-white border-b" data-unique-id="b810010a-616d-4c52-8a10-7a7db690249c" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <h2 className="text-xl font-semibold mb-1" data-unique-id="790ab6c6-f10b-4ce5-ae1d-4eae30baf5f7" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-sm text-muted-foreground" data-unique-id="af98cb92-11a5-4905-87f0-ef35e270c189" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b" data-unique-id="74ea1bfd-90d7-44fa-b55b-6c9858ef7c7d" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <div className="flex items-center gap-2" data-unique-id="ee8ced96-a126-4e40-b3a3-8bb904f7cb01" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50} data-unique-id="0ace4713-f55d-4938-96c1-5092013817ce" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center" data-unique-id="c720d554-f461-4bf1-9444-1447be1ccb24" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
            {zoom}<span className="editable-text" data-unique-id="2cda9244-b3dd-40c0-8bf8-04c776490110" data-file-name="components/preview/pdf/MobilePDFReader.tsx">%
          </span></span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} data-unique-id="cae90275-5c10-4923-bf9a-c3a398df2c3e" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2" data-unique-id="ade64486-79f8-4ba4-b44e-38f4aca469ef" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={openInNewTab} data-unique-id="6fb4c43c-e9a2-474a-80ba-0eb19425cd44" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="0bb4be51-85cd-412d-83c5-30c8921640ab" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100" data-unique-id="589f3dc7-a2ca-4a1f-8e5e-daa285247b83" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>
    </div>;
}