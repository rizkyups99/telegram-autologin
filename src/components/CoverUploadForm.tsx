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
  return <Card data-unique-id="dad37629-7ad7-4e54-8e90-a0d5420c2ae7" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="56e04252-e97b-4c4b-9432-cfa96327424d" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="c1c46119-111b-48da-ae80-f8997dadff22" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="6ebb9346-1f7e-47e8-a2fc-7df0b7f54e80" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="198c6f05-87d7-4761-87ab-5bd6fef244d4" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="c466397b-921e-495d-bf7e-19bb4a455612" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="bccf0494-451e-4755-81a2-a07294a5f557" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="1d4b608b-97c2-4ee0-b2a1-280debe506ee" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="ce1277bc-435b-44e5-8071-8ca90c2f673e" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="c55565bf-cb1d-45e2-ac09-7ff825d1698c" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="377490ef-6c14-4043-91c3-c753dffb8300" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="573a0f30-9c4d-41be-8081-499d9ebe5a4e" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="ec8f7973-98fe-406d-97d4-7b1acd4e690d" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="ce570f5d-4aae-4352-9c51-0ca51e736f37" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="cd2ef073-2194-48bd-a21d-19b47619f3f5" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="1eb3b4d6-469d-4573-a476-0e7a3e7af854" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="faa6ad49-6217-43fa-8e91-3d7ea2d79c86" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="11fd824c-bf3a-489b-a9f3-a105e23f9b17" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="64972cad-f2a8-4d19-ba07-3d2ed6dd75e1" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="e58bf569-1246-452e-bd18-a9a67c290df5" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="dfb912ff-6d3f-4524-b685-5ffd8a576b20" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="9845b840-6c14-4fde-a7ad-6883b2914110" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="d16eb743-5276-48da-aebf-3bfdf67f30c1" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="be2efafc-b192-4fad-bbe4-7b986413941a" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="484a061d-02a2-46bb-a39e-50f0a2f550ee" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="7a52e0eb-b0d3-442c-b93b-c270a5f44c0e" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="b8618865-6b4c-44f7-8c3e-85714eafd08a" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="07f1671b-088a-48fe-9df6-f2ce77218bb1" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="ab1bf57a-5989-4b09-bd8d-43f312c07c22" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="fdd4d709-5382-4991-8b5e-fe60e4884d43" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="90d03124-b4ce-48de-bcac-cb49e566940b" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="ec7e2219-27b2-45a5-925d-cd600af6c6da" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="df8f6874-50ab-405c-81d2-ab0c0d97da11" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="a7259885-1d15-4015-bb18-5222ed4c5474" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="552d717f-e59f-4e8f-a3be-a91c1a5e9487" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="506ba5f8-2a1c-46b7-bc14-09de21f9b9bf" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="87a419fb-a8e7-428e-a274-65ce1a8fb9ac" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="54af476b-f128-4631-9f28-a5f6dc618079" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="6cb4bc27-5005-477a-a23a-4f1443e603c3" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="20dcd458-ace6-4dcf-b4c0-b751bd2be92e" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="fc3a4697-ee92-4f65-849d-4634f06e6fde" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="0430f8dd-f1b3-4561-8f6d-fff39460fb91" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="3d90cd49-be7d-46fc-b5d9-e2f64d9f70f4" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="f85a6590-71e2-4fc4-b3c0-9a01ee406b67" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="fc5a4ee4-f8ef-4325-94b4-ea6066571747" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="cde0791b-67ab-4c61-95e9-9e435cc45ee0" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="fdeca133-c099-4589-97ae-50329bf1ef06" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="1658adc7-a130-446c-b535-d46a137295ca" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="15066e35-e633-4ad3-9407-33041c87693d" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="9eca30cf-5190-46ec-bcb9-bcbf1f848f98" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="7f3df955-5b16-4d09-a29c-8b43c7911fc9" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}