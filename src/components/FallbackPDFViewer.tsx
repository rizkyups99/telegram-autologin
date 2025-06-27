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
      return <div className="flex flex-col items-center justify-center h-96 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300" data-unique-id="6ebabe5c-dbe6-4827-9a66-584b76fc9c22" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="text-center max-w-md" data-unique-id="e23ab405-f290-44bf-924e-b14730946c26" data-file-name="components/FallbackPDFViewer.tsx">
            <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2" data-unique-id="f5672e02-bdcb-4f6a-8935-334d7a1f6d31" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="2d7065a7-6343-4f02-bab3-b27b595b8b92" data-file-name="components/FallbackPDFViewer.tsx">
              PDF Ready for Download
            </span></h3>
            <p className="text-blue-700 mb-6" data-unique-id="a1e1067b-1960-425e-81e5-d0429acdafcd" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="aa9a28dd-8db1-4de8-a62c-26cbc10a6071" data-file-name="components/FallbackPDFViewer.tsx">
              Your browser doesn't support inline PDF viewing. Download the file to view it with your device's PDF reader.
            </span></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center" data-unique-id="58ed6091-ab1b-442f-8b91-84e0b681f3ac" data-file-name="components/FallbackPDFViewer.tsx">
              <Button onClick={handleDownload} className="flex items-center gap-2" data-unique-id="a0cd7d67-6ca7-497d-aa8c-1724284ba6c5" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="ef337915-46a2-4dbf-80a8-9754ca7a9a61" data-file-name="components/FallbackPDFViewer.tsx">
                Download PDF
              </span></Button>
              <Button variant="outline" onClick={openInNewTab} className="flex items-center gap-2" data-unique-id="4dfd72ee-117f-4e00-bc81-ceb498c19aa8" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="e8cb8751-33d3-4407-81a5-38ddc5f556fd" data-file-name="components/FallbackPDFViewer.tsx">
                Open in New Tab
              </span></Button>
            </div>
          </div>
        </div>;
    }
    if (renderMethod === 'iframe') {
      return <div className="relative" data-unique-id="befd918e-673d-4ac2-b1d0-61cd3de7c443" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
          <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} className="w-full h-96 border rounded-lg" title={title || 'PDF Document'} onError={() => setHasError(true)} onLoad={() => setHasError(false)} data-unique-id="74aee43b-233d-4fae-86cf-aed630698d58" data-file-name="components/FallbackPDFViewer.tsx" />
          
          {/* Overlay controls for mobile */}
          <div className="absolute top-2 right-2 flex gap-2" data-unique-id="8a678221-3718-42f6-a879-b7b3a69f1418" data-file-name="components/FallbackPDFViewer.tsx">
            <Button size="sm" variant="outline" onClick={handleDownload} className="bg-white/90 backdrop-blur-sm" data-unique-id="71ee56d4-37f9-478f-bc2a-0c428a7a92f9" data-file-name="components/FallbackPDFViewer.tsx">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openInNewTab} className="bg-white/90 backdrop-blur-sm" data-unique-id="2d0aeacd-2d0a-4440-bf01-8931e2568441" data-file-name="components/FallbackPDFViewer.tsx">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>;
    }

    // Default embed method
    return <div className="relative" data-unique-id="7b231c68-13dc-48e2-8fd7-0f87afc1b761" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        <embed src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" className="w-full h-96 border rounded-lg" onError={() => setHasError(true)} data-unique-id="4efa2c65-5941-47ea-aa8b-1a50faf48281" data-file-name="components/FallbackPDFViewer.tsx" />
        
        {/* Fallback for when embed fails */}
        {hasError && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border rounded-lg" data-unique-id="a0e36d76-6f8f-426a-a6a0-6f1b1afacfe1" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="text-center" data-unique-id="29385e3c-bb2a-4069-8f71-acb6e8cf1744" data-file-name="components/FallbackPDFViewer.tsx">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4" data-unique-id="024ac8e0-0977-49e6-b309-0ec1e8c2ca2d" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="2b5bb9df-fbea-4e32-9eba-61340a15847a" data-file-name="components/FallbackPDFViewer.tsx">
                Unable to display PDF in browser
              </span></p>
              <div className="flex gap-2 justify-center" data-unique-id="05ac7cc7-55e8-4f83-8216-5b2f98da1c98" data-file-name="components/FallbackPDFViewer.tsx">
                <Button onClick={handleDownload} data-unique-id="75902b2a-5045-4784-9905-02850e393107" data-file-name="components/FallbackPDFViewer.tsx">
                  <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e25e0763-19f5-4b5b-8e4b-4ba340490503" data-file-name="components/FallbackPDFViewer.tsx">
                  Download PDF
                </span></Button>
                <Button variant="outline" onClick={openInNewTab} data-unique-id="db2d2f56-7a51-4c1a-aa83-e5c435ed9d43" data-file-name="components/FallbackPDFViewer.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4873eee6-9b27-403d-b73d-7f6185da2249" data-file-name="components/FallbackPDFViewer.tsx">
                  Open in New Tab
                </span></Button>
              </div>
            </div>
          </div>}
      </div>;
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="554eb214-87a7-48d0-ba76-08457f92d7e0" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="text-center" data-unique-id="47db5f85-9d6c-43b1-947f-3f02415b4001" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="f3723509-0cae-4eac-a6a5-3649ec35b61e" data-file-name="components/FallbackPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="bcac967c-ebb9-4a2a-a9dc-5b879490349b" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="880d96a6-471c-4a1a-8be7-532f606d9222" data-file-name="components/FallbackPDFViewer.tsx">Preparing PDF viewer...</span></p>
        </div>
      </div>;
  }
  return <div className="bg-white" data-unique-id="413b5a68-2485-4a58-9612-d9880ebc33b9" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
      {/* Header with title and actions */}
      {title && <div className="border-b bg-gray-50 px-4 py-3 rounded-t-lg" data-unique-id="6243f445-e0df-4664-9572-19db2c94433d" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-center justify-between" data-unique-id="4972f828-7899-442e-8ea6-acd731b7c015" data-file-name="components/FallbackPDFViewer.tsx">
            <h3 className="font-medium text-gray-900" data-unique-id="b6fb5d49-86cd-43e5-8822-b66931243413" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">{title}</h3>
            <div className="flex gap-2" data-unique-id="d0527057-abef-40f9-9e3d-c78811acbe67" data-file-name="components/FallbackPDFViewer.tsx">
              <Button size="sm" variant="outline" onClick={handleDownload} data-unique-id="5d348439-2cfe-42e0-be70-75a6de50e5e0" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="f0c0e21a-be59-4793-9baa-354c9e59db69" data-file-name="components/FallbackPDFViewer.tsx">
                Download
              </span></Button>
              <Button size="sm" variant="outline" onClick={openInNewTab} data-unique-id="2f797e33-d04b-49c7-9e60-ed57553cfe2f" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="1375569e-db94-428c-9bfd-b534d997ba05" data-file-name="components/FallbackPDFViewer.tsx">
                Open in Tab
              </span></Button>
            </div>
          </div>
        </div>}

      {/* PDF Content */}
      <div className="p-4" data-unique-id="b8ad28c1-5f2f-4478-8c94-863c0ded3a41" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>

      {/* Browser compatibility info */}
      <div className="px-4 pb-4" data-unique-id="72c3fb57-a63d-49f4-b721-84c0383b09d2" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" data-unique-id="65c3b5d2-fca7-4c68-8c46-d5d032f8d573" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-start gap-2" data-unique-id="caa3ba38-8b1a-4f31-9b27-6929c16a4635" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="flex-shrink-0 mt-0.5" data-unique-id="a4155d00-a0f3-462e-8ebf-5e3add34b5ff" data-file-name="components/FallbackPDFViewer.tsx">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="022a5407-587a-492f-9bd7-83c4c385a0a6" data-file-name="components/FallbackPDFViewer.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800" data-unique-id="92b728fc-8928-4d54-be4d-7a24506ee44b" data-file-name="components/FallbackPDFViewer.tsx">
              <p className="font-medium" data-unique-id="99b8c96d-c5a3-4a26-b3da-ff2f221ebdc5" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="561a0b6e-4015-4b19-8d44-5e21b515b239" data-file-name="components/FallbackPDFViewer.tsx">Browser Compatibility Notice</span></p>
              <p className="mt-1" data-unique-id="cee6ec98-a57a-4527-98d9-3e5aa9fda174" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="264ed6f4-2cfc-4b75-a055-21955f2340e7" data-file-name="components/FallbackPDFViewer.tsx">
                This is a fallback PDF viewer. For the best experience, consider downloading the PDF or opening it in a new tab.
              </span></p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}