'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { uploadToStorage } from '@/lib/storage';
import { AlertCircle, CheckCircle, Image, Upload } from 'lucide-react';
export default function CoverUploadForm() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        setStatusMessage({
          type: 'error',
          message: 'File harus berupa gambar (JPG, PNG, dll)'
        });
        return;
      }
      setCoverFile(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Clean up previous status message
      setStatusMessage(null);
      return () => {
        // Clean up the object URL when component unmounts
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }
  };
  const handleUpload = async () => {
    if (!coverFile) {
      setStatusMessage({
        type: 'error',
        message: 'Silakan pilih file gambar terlebih dahulu'
      });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      setStatusMessage({
        type: 'success',
        message: `Mengupload cover "${coverFile.name}"... 0%`
      });

      // Upload the cover to Supabase Storage 'pdf-covers' bucket
      const coverUpload = await uploadToStorage(coverFile, 'pdf-covers', progress => {
        setUploadProgress(progress);
        setStatusMessage({
          type: 'success',
          message: `Mengupload cover "${coverFile.name}"... ${progress}%`
        });
      });
      console.log("Cover uploaded successfully:", coverUpload);
      setStatusMessage({
        type: 'success',
        message: `Cover berhasil diupload ke bucket pdf-covers!`
      });

      // Reset the form after successful upload
      setCoverFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Cover upload error:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Terjadi kesalahan saat upload cover"
      });
    } finally {
      setIsUploading(false);
    }
  };
  return <Card data-unique-id="d782dd90-47ac-4f7e-b0cd-72d6e92e675f" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="a9e446b7-115d-4a99-a56a-f100899de014" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="837f0ec5-e854-408c-9a83-9d35abd55968" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="fed72486-e11d-4085-9a78-cb640712eb03" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="73e52cb7-001c-4d15-bc4b-2df06d1f6991" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="11a7734c-d219-48ac-9d46-04acc7b36762" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="e420fc73-2461-4676-8116-95359933610e" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="ce0a8766-5784-473d-a818-62d9ffa17fc4" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="fb122dcb-2bd3-4929-ae07-812ff9a3a506" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="cc585fca-a010-46f3-b7d5-a98e5a0eaece" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="272e810f-87ca-4224-8ed1-1f3735859edf" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="5c949f75-71af-423f-906e-b76e45acde69" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="dea333ec-b456-4129-825e-efff36ebb2f9" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="38c1d472-82d3-4232-a65f-3519659a931e" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="86e5097a-6235-4c1a-b56c-3ffd44221d7b" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="5da8c6c5-5684-4422-8c4a-182d4e7e4c2a" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="156b4f78-1505-4019-91d1-21ef5c8345df" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="f41a7c93-ccfa-4fa8-ae77-09796c8110fe" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="8c679415-5d92-4ae1-bf50-b562cfde3737" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="18fbdab8-7558-4bfd-be67-0aa36e6080cd" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="be3f6887-2363-47ad-ae18-e88f142dbb72" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="e94c2cf9-6286-4270-8cbe-9fd97eeb90db" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="16f00e2c-f3a1-45fc-81f7-fe0ec61791eb" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="7bd9323e-ec25-456c-91d5-a894ae8ef768" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="e218910e-acb5-4e67-980b-297efd562ed4" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="1f00d86d-1ac8-4bf1-81f4-67da9e3cdedc" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="790f4b0d-c6c3-487f-b818-2815a2fa0a88" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="6e30ee8d-7453-45fd-b6fe-5af8edd729f9" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="4dbbf812-bae7-40fd-94a4-35281b2336e4" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="45edec03-1935-4963-8297-0201c23fc577" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="add6d7f2-1893-4ebf-ad7d-d81dbc8b7dd9" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="a156169d-c588-4adb-aa2c-8f736bb5e22b" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2ccd56b5-e1cb-4fdc-964e-534deb255620" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="b55b3585-3625-4528-88cc-e9a716f1f6c1" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="a7b37a8e-373d-4644-97da-ad04c4fb3da4" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="eb20fc83-3a45-4352-a480-1ebcdcb088c3" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="c9b46387-40a5-497f-85df-b1a5695d7ae1" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="7100168e-cf46-4d66-bcb2-25f9d8ff3349" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="147f618b-bc15-42cd-96f9-f02080218688" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="8ee2c581-cf9c-4a36-818d-b8630e9d2935" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="8b539318-baca-4497-bba2-d78923151744" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="8f597e7f-420d-4dae-8f3a-c8fd345d6b39" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="a311c51d-3563-47e6-9cd0-35d447a4991c" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="86af1699-43de-4f9e-bfb9-4c7d00847f31" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="9e85e058-697b-4a5f-b954-d0d1c676cae9" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="accacf73-2247-4007-82aa-9a405062bb31" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="2fd867a7-36cc-4fbd-a566-84a1c1317a90" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="68ee5ddd-4411-44e4-9a6d-705392037797" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="21dc1105-3085-4826-b1a2-d5c2b0c3da35" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="349b073c-c67b-4fef-aad5-500ad8bc32e0" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="88e6f16c-94a9-4ee3-946a-ac0f474afd89" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}