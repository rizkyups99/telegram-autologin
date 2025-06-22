'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';
interface FallbackPDFViewerProps {
  pdfUrl: string;
  title?: string;
  onDownload?: () => void;
}
export default function FallbackPDFViewer({
  pdfUrl,
  title,
  onDownload
}: FallbackPDFViewerProps) {
  const [renderMethod, setRenderMethod] = useState<'embed' | 'iframe' | 'download'>('embed');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Detect browser capabilities
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);

    // Determine best rendering method based on browser
    if (isMobile && (isChrome || isSafari)) {
      setRenderMethod('iframe');
    } else if (isMobile) {
      setRenderMethod('download');
    } else {
      setRenderMethod('embed');
    }
    setIsLoading(false);
  }, []);
  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title ? `${title}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(pdfUrl, '_blank');
    }
  };
  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };
  const renderPDFContent = () => {
    if (renderMethod === 'download') {
      return <div className="flex flex-col items-center justify-center h-96 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300" data-unique-id="949d5477-78c0-44d4-b332-358a1de76384" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="text-center max-w-md" data-unique-id="93ba0d42-ab38-41c5-af84-21f1521bec8a" data-file-name="components/FallbackPDFViewer.tsx">
            <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2" data-unique-id="0d9840ca-5fd5-479c-a20f-c6a3d62596bc" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="99e5055c-e69b-44fd-9f85-b25d39383ed9" data-file-name="components/FallbackPDFViewer.tsx">
              PDF Ready for Download
            </span></h3>
            <p className="text-blue-700 mb-6" data-unique-id="4c7602b1-809e-45a4-ae49-915c6f833a97" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="305dfc50-848e-40f4-9b3f-1800a23d5b3a" data-file-name="components/FallbackPDFViewer.tsx">
              Your browser doesn't support inline PDF viewing. Download the file to view it with your device's PDF reader.
            </span></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center" data-unique-id="f105e888-677b-4201-9d02-477337286f5d" data-file-name="components/FallbackPDFViewer.tsx">
              <Button onClick={handleDownload} className="flex items-center gap-2" data-unique-id="33c417ae-5d29-4211-8dda-3a18705ef906" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="8a344010-3e2c-4ad6-90bc-a524f34b2ba0" data-file-name="components/FallbackPDFViewer.tsx">
                Download PDF
              </span></Button>
              <Button variant="outline" onClick={openInNewTab} className="flex items-center gap-2" data-unique-id="798491f3-4a9a-4dc1-8780-59b2994405e3" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="fd044250-2e0b-4b6e-89c6-6b1f64d189a0" data-file-name="components/FallbackPDFViewer.tsx">
                Open in New Tab
              </span></Button>
            </div>
          </div>
        </div>;
    }
    if (renderMethod === 'iframe') {
      return <div className="relative" data-unique-id="da692026-7cc8-4c1f-a2ee-21f8c7dda89c" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
          <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} className="w-full h-96 border rounded-lg" title={title || 'PDF Document'} onError={() => setHasError(true)} onLoad={() => setHasError(false)} data-unique-id="50c0d418-42b7-45c2-9827-999c289c0701" data-file-name="components/FallbackPDFViewer.tsx" />
          
          {/* Overlay controls for mobile */}
          <div className="absolute top-2 right-2 flex gap-2" data-unique-id="fb63fc7a-f97d-4411-9e72-b66b4f5db1c9" data-file-name="components/FallbackPDFViewer.tsx">
            <Button size="sm" variant="outline" onClick={handleDownload} className="bg-white/90 backdrop-blur-sm" data-unique-id="06d7eea6-6d49-4393-b24f-745f65e152e3" data-file-name="components/FallbackPDFViewer.tsx">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openInNewTab} className="bg-white/90 backdrop-blur-sm" data-unique-id="3b706cf2-4151-4743-88a0-380899e36a5f" data-file-name="components/FallbackPDFViewer.tsx">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>;
    }

    // Default embed method
    return <div className="relative" data-unique-id="76894f40-4511-406a-acab-bb097ea62216" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        <embed src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" className="w-full h-96 border rounded-lg" onError={() => setHasError(true)} data-unique-id="ec95d752-5cef-43bc-8b87-41c5d697dc8d" data-file-name="components/FallbackPDFViewer.tsx" />
        
        {/* Fallback for when embed fails */}
        {hasError && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border rounded-lg" data-unique-id="32caee83-30ea-494b-8cf1-9d8e2e75b3fd" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="text-center" data-unique-id="f114164a-6a16-48ed-82f3-3b04951b8158" data-file-name="components/FallbackPDFViewer.tsx">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4" data-unique-id="490d560c-91fd-4e2a-9a5d-19b4290654c2" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="b9210d9b-d87e-4c24-88f8-0957af8dd579" data-file-name="components/FallbackPDFViewer.tsx">
                Unable to display PDF in browser
              </span></p>
              <div className="flex gap-2 justify-center" data-unique-id="57a09630-97f8-4e94-92de-dd59b9dd6bbc" data-file-name="components/FallbackPDFViewer.tsx">
                <Button onClick={handleDownload} data-unique-id="31ef8bf8-8c87-4313-bbd0-6a8f4c88a711" data-file-name="components/FallbackPDFViewer.tsx">
                  <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="c3bf48e9-83c3-4380-9f7f-e460008745c4" data-file-name="components/FallbackPDFViewer.tsx">
                  Download PDF
                </span></Button>
                <Button variant="outline" onClick={openInNewTab} data-unique-id="3f821a6a-db3b-4734-8c8e-9790e811b7eb" data-file-name="components/FallbackPDFViewer.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="534c8e20-a922-4711-a450-42e3b9e6351d" data-file-name="components/FallbackPDFViewer.tsx">
                  Open in New Tab
                </span></Button>
              </div>
            </div>
          </div>}
      </div>;
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="dc1c6b82-db4f-4690-a3f2-dc14aed117d4" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="text-center" data-unique-id="bb343e4a-7fd8-43ee-a257-a18f6fc56100" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="f3b07a95-14b0-49c4-9263-9e7fca738cae" data-file-name="components/FallbackPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="30bd3086-b4da-4a47-8f06-692cabb7d5ac" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="b8121c15-bbe9-443f-89a2-9d4311e6299c" data-file-name="components/FallbackPDFViewer.tsx">Preparing PDF viewer...</span></p>
        </div>
      </div>;
  }
  return <div className="bg-white" data-unique-id="9d908ce2-1e38-4948-bd06-71b0b35de94b" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
      {/* Header with title and actions */}
      {title && <div className="border-b bg-gray-50 px-4 py-3 rounded-t-lg" data-unique-id="8f309aeb-73d9-4182-af82-747122e76dd3" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-center justify-between" data-unique-id="b14b8a21-c255-4160-b116-65695fd3b498" data-file-name="components/FallbackPDFViewer.tsx">
            <h3 className="font-medium text-gray-900" data-unique-id="ba7765d3-869e-48d4-8b6e-b0fd70261e13" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">{title}</h3>
            <div className="flex gap-2" data-unique-id="1a906009-f458-45ff-af75-5f16d934f97f" data-file-name="components/FallbackPDFViewer.tsx">
              <Button size="sm" variant="outline" onClick={handleDownload} data-unique-id="2ea0b5eb-364e-45f3-ab81-73eb2e55bfc4" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="fd0c07fe-de1f-4061-ae8b-d767791816fd" data-file-name="components/FallbackPDFViewer.tsx">
                Download
              </span></Button>
              <Button size="sm" variant="outline" onClick={openInNewTab} data-unique-id="903f116d-b2b0-477e-b71f-db770b17cf69" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="22753986-0bd9-451b-ad64-c6ce823e88f6" data-file-name="components/FallbackPDFViewer.tsx">
                Open in Tab
              </span></Button>
            </div>
          </div>
        </div>}

      {/* PDF Content */}
      <div className="p-4" data-unique-id="0d7eb5c0-457e-4669-a355-6df29198f253" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>

      {/* Browser compatibility info */}
      <div className="px-4 pb-4" data-unique-id="d9d69fb9-d4e2-4d38-b15b-4ceb296e7607" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" data-unique-id="77f461f7-ec5a-4580-b544-6d7c1f8a832c" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-start gap-2" data-unique-id="edb7ee71-d8b8-4240-b40b-682e706009a7" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="flex-shrink-0 mt-0.5" data-unique-id="de0e2461-5c13-471a-82c9-8049727ad5bd" data-file-name="components/FallbackPDFViewer.tsx">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="108d31c7-811f-42fb-94de-7e2f40a0742b" data-file-name="components/FallbackPDFViewer.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800" data-unique-id="8fe331a1-1d3b-4033-89b0-8824de3887a2" data-file-name="components/FallbackPDFViewer.tsx">
              <p className="font-medium" data-unique-id="23d74aca-f1b4-4af4-8468-278346bd4643" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="97066c61-36ea-41e0-bbf6-d46202fd16b9" data-file-name="components/FallbackPDFViewer.tsx">Browser Compatibility Notice</span></p>
              <p className="mt-1" data-unique-id="28ff1047-dc9f-4dab-a3bf-d8be2539f20c" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="488dfd0e-9df7-446b-8296-5542ed979a8d" data-file-name="components/FallbackPDFViewer.tsx">
                This is a fallback PDF viewer. For the best experience, consider downloading the PDF or opening it in a new tab.
              </span></p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}