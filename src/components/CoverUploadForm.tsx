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
  return <Card data-unique-id="f0ab3fac-ab5a-492f-925f-af803d1b5f62" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="5c1dcea2-9568-4813-9888-5937c765b94d" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="effb7751-053e-45af-9237-78e538d62fe8" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="87bf3449-ac76-4691-8e4a-ff77a7f70647" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="f88ff541-430e-4ffb-a015-2ca09b8a6e95" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="5284ec7d-ca63-4055-84b1-2f6d7b0e27ab" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="ca57dac8-4676-4f3d-b0e1-2879c5a3e18f" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="f27eae65-de8d-4335-8ace-6e95c6d3133a" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="c3333ae6-ece8-4070-af1c-32370dd11bbc" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="9f916bf4-a4e2-4536-810b-378c4b5ff5e0" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="ca0c2c88-432f-413d-8031-a56f3d11584c" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="ec46e642-6beb-496d-be86-b4b2ca4eec8d" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="bc88a606-05aa-4624-85c6-63a7756ca935" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="5c4bbf24-fc6c-4213-a051-9b63d62b1547" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="d0933ed8-be2b-4e44-850c-c406533b6293" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="f480c15e-6eed-474a-b2f2-fd88b4dad41a" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="33b3c30a-9dd8-4b1d-871c-d9f651f84594" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="0f6b8d59-8244-4e14-a9a6-6e767d9da808" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="f3202ecf-0842-45f7-91e8-cbd891b52096" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="8f4b93de-f994-4cbe-b268-887c592426c2" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="ee2dcd1b-3934-42fa-b82c-cf5b746c3d1f" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="80d7a065-98e2-4685-8f3c-85994d8438cb" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="c5764584-4aac-4556-9ead-807f72de5e2a" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="c8e38126-e7cc-421e-abbd-70ab5820e945" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="97e2d9e2-4177-4a11-a001-5cf5dae3565b" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="d723edf2-1e3d-4aba-9513-340db4974068" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="5dd24228-dea1-4f74-a7bd-05f8357effc6" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="23497191-c4e6-4234-a84b-8f9e2535a85b" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="bde12fc8-2fa9-4f09-be00-c548630f9890" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="d33b5c28-348e-485f-8e50-6c2f83639e2b" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="1157aed8-e8f2-4103-a42e-20726e147c65" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="29a23259-81aa-492c-9171-6bad3d608e3e" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="db565559-35c7-4a4c-8fba-cd5d13f9abe4" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="3495d0ca-c2be-42b9-ad2b-b0088d4c2fdb" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="ec0c1294-1756-4f3b-98c0-acf8b48453e7" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="d4cb35a7-ca44-4f1a-90bb-f247519a24e2" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="7fc903b4-792d-4dc1-85fa-5d34022ef6cb" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="dfd8dff1-99ec-4a6c-9ec7-78d36c22385c" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="ced4eb5c-f5f1-4cb0-bb13-3ce9cc64caf3" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="e4a4e065-1db4-49ab-a527-e1f4c945527a" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="d142ad96-dc09-4c82-bf2f-9bc0c967df89" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="5c112da4-bb75-4727-8181-32a2265d80b2" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="b071cd5c-e3bf-4d11-978c-1374141db7c6" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="f65ead76-9f47-41a5-8907-8659bf0a14ac" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="0ec9683f-536f-4070-a28b-d833533aa5c0" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="068cfe34-46d1-49f3-9e81-405ad145d86b" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="5638bc50-33b1-4e44-8bd6-ff67ea035e8b" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="b7ba4e27-b1b6-4b39-93fd-97eab2ef9e1a" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="83d5600b-1458-40e3-8806-f3603884a9fd" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="061811c7-7333-40e8-98e4-76272be74ede" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="43fa8bf3-d8cd-4888-858b-3e7a3fcae855" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}