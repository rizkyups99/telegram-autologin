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
      return <div className="flex flex-col items-center justify-center h-96 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300" data-unique-id="5966b7cb-8aca-4b6d-88eb-297ab72ba394" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="text-center max-w-md" data-unique-id="678cb7c6-8d30-43cd-8946-e19a3a33b3be" data-file-name="components/FallbackPDFViewer.tsx">
            <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2" data-unique-id="14fc8f93-9962-485f-bc87-e5d80675d5f5" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="c39d12cc-e730-442c-b679-8efd90b58752" data-file-name="components/FallbackPDFViewer.tsx">
              PDF Ready for Download
            </span></h3>
            <p className="text-blue-700 mb-6" data-unique-id="36423e5b-cd4a-4a8c-980f-f1dadd82444c" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="7fcc0cea-0923-4c20-aa7a-5a25e81dd10c" data-file-name="components/FallbackPDFViewer.tsx">
              Your browser doesn't support inline PDF viewing. Download the file to view it with your device's PDF reader.
            </span></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center" data-unique-id="793ddd99-f54d-4d9c-bde0-493572c16791" data-file-name="components/FallbackPDFViewer.tsx">
              <Button onClick={handleDownload} className="flex items-center gap-2" data-unique-id="a0a5e4a2-3f7a-48b9-b5f9-bc7b6fc5d178" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="50a3d73e-3507-45d6-b4f0-9185c573fc74" data-file-name="components/FallbackPDFViewer.tsx">
                Download PDF
              </span></Button>
              <Button variant="outline" onClick={openInNewTab} className="flex items-center gap-2" data-unique-id="3cb1c239-e9b6-452f-8025-9d3b9f123e74" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="9815b67a-5070-4387-932e-ac09314bdbf6" data-file-name="components/FallbackPDFViewer.tsx">
                Open in New Tab
              </span></Button>
            </div>
          </div>
        </div>;
    }
    if (renderMethod === 'iframe') {
      return <div className="relative" data-unique-id="dc90f631-558f-466d-b731-d1fb5a7d2865" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
          <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} className="w-full h-96 border rounded-lg" title={title || 'PDF Document'} onError={() => setHasError(true)} onLoad={() => setHasError(false)} data-unique-id="fb4cbac1-c84d-40e4-b2b6-e9f6b838b2b0" data-file-name="components/FallbackPDFViewer.tsx" />
          
          {/* Overlay controls for mobile */}
          <div className="absolute top-2 right-2 flex gap-2" data-unique-id="431f888f-060c-4727-9bda-2cc6c9460475" data-file-name="components/FallbackPDFViewer.tsx">
            <Button size="sm" variant="outline" onClick={handleDownload} className="bg-white/90 backdrop-blur-sm" data-unique-id="29ec72b4-dc3e-4ba7-b2ac-89fd2115c4a0" data-file-name="components/FallbackPDFViewer.tsx">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openInNewTab} className="bg-white/90 backdrop-blur-sm" data-unique-id="ddd7894a-f72a-43bc-bed6-771b70c91225" data-file-name="components/FallbackPDFViewer.tsx">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>;
    }

    // Default embed method
    return <div className="relative" data-unique-id="3c0528a0-3586-4d20-b6ea-2f9b5c45632a" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        <embed src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" className="w-full h-96 border rounded-lg" onError={() => setHasError(true)} data-unique-id="084efc93-a861-4567-bbb3-2808a746f3ef" data-file-name="components/FallbackPDFViewer.tsx" />
        
        {/* Fallback for when embed fails */}
        {hasError && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border rounded-lg" data-unique-id="7a26c7d3-8bcc-49ae-b531-a31663336216" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="text-center" data-unique-id="2bd9a39d-eec7-4851-9956-08807a623883" data-file-name="components/FallbackPDFViewer.tsx">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4" data-unique-id="9542475e-18fa-42d3-b83b-604c1c738db8" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="57b22255-1066-4172-850a-3092d8e49e7c" data-file-name="components/FallbackPDFViewer.tsx">
                Unable to display PDF in browser
              </span></p>
              <div className="flex gap-2 justify-center" data-unique-id="430e673e-0818-4bc5-b0d8-188bc12d9e36" data-file-name="components/FallbackPDFViewer.tsx">
                <Button onClick={handleDownload} data-unique-id="b32274aa-69d2-440f-8812-16f473bf5409" data-file-name="components/FallbackPDFViewer.tsx">
                  <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4ea25f34-ac92-4b62-a457-eee28a334d39" data-file-name="components/FallbackPDFViewer.tsx">
                  Download PDF
                </span></Button>
                <Button variant="outline" onClick={openInNewTab} data-unique-id="64109344-5946-4bff-94c8-395ca3d1c7a2" data-file-name="components/FallbackPDFViewer.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="0d0d3363-066e-4537-80c7-fa47c6675dff" data-file-name="components/FallbackPDFViewer.tsx">
                  Open in New Tab
                </span></Button>
              </div>
            </div>
          </div>}
      </div>;
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="10276bbd-ea17-482d-a92a-417b39bfefc5" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="text-center" data-unique-id="61f7f5cd-ad9b-40ea-a713-83f7a38b765e" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="a28ee262-b1c2-4729-aef4-6402d76c655b" data-file-name="components/FallbackPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="06bdfa2b-62bf-4701-956a-550531429402" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="3da4395d-6fb1-45c1-aaab-cc0ad430916c" data-file-name="components/FallbackPDFViewer.tsx">Preparing PDF viewer...</span></p>
        </div>
      </div>;
  }
  return <div className="bg-white" data-unique-id="e213ed19-86ce-44e5-bc35-da4627d6cc60" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
      {/* Header with title and actions */}
      {title && <div className="border-b bg-gray-50 px-4 py-3 rounded-t-lg" data-unique-id="bb9592be-5a39-47d8-bd7d-6330c67c1d21" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-center justify-between" data-unique-id="9bde8ce6-1ee9-4d9e-ac00-6f0d48e91908" data-file-name="components/FallbackPDFViewer.tsx">
            <h3 className="font-medium text-gray-900" data-unique-id="f08e6dc7-5d38-4330-9f0d-5c8d488f2ee6" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">{title}</h3>
            <div className="flex gap-2" data-unique-id="a323f706-1bf3-4622-b2eb-a2305c65a6f0" data-file-name="components/FallbackPDFViewer.tsx">
              <Button size="sm" variant="outline" onClick={handleDownload} data-unique-id="fd219e10-e25a-453b-ac6d-3ecf25e39f38" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="46d76a7b-80c9-4394-8df7-21f272b935c8" data-file-name="components/FallbackPDFViewer.tsx">
                Download
              </span></Button>
              <Button size="sm" variant="outline" onClick={openInNewTab} data-unique-id="1a4e296f-3cba-4eb7-bf4b-bd5093328ade" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="fcbbeb9c-36f9-4b15-ba97-7bbc20f6462c" data-file-name="components/FallbackPDFViewer.tsx">
                Open in Tab
              </span></Button>
            </div>
          </div>
        </div>}

      {/* PDF Content */}
      <div className="p-4" data-unique-id="2a1437f0-cddd-45d8-99af-21abe77e3859" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>

      {/* Browser compatibility info */}
      <div className="px-4 pb-4" data-unique-id="a5eb0213-f4ed-4a6e-9dfa-ccdd499a1de0" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" data-unique-id="6e1d6fe0-f934-4c90-843f-f9bbf03dbe13" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-start gap-2" data-unique-id="34e3105e-5ea0-4703-969b-5e0070e1ed87" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="flex-shrink-0 mt-0.5" data-unique-id="1b5bc76c-d795-48a4-8590-c2332c141c7c" data-file-name="components/FallbackPDFViewer.tsx">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="224534e3-cbcc-4a21-8878-2c864fbbd1d8" data-file-name="components/FallbackPDFViewer.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800" data-unique-id="47101a8c-b1df-49f4-bd95-06acc40acc15" data-file-name="components/FallbackPDFViewer.tsx">
              <p className="font-medium" data-unique-id="24f14c3e-bce5-46d5-a9b8-4c1ad773cf0c" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="bb359146-51d4-4a5d-a1d5-0041b72fdad8" data-file-name="components/FallbackPDFViewer.tsx">Browser Compatibility Notice</span></p>
              <p className="mt-1" data-unique-id="638bf3e3-efbf-4964-95e2-a8a525d059d7" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="795a932b-e080-4c16-91f3-f95fcec0c2d6" data-file-name="components/FallbackPDFViewer.tsx">
                This is a fallback PDF viewer. For the best experience, consider downloading the PDF or opening it in a new tab.
              </span></p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}