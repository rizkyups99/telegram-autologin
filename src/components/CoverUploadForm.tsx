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
  return <Card data-unique-id="8a04db3d-71c2-4123-9530-d13f8c64da65" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="10de15cb-6927-4d76-8e75-58158a5f8e95" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="c24a9767-78d6-4430-997e-5447fd6625bc" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="5cd6bfb8-943a-46ea-a4e9-87df7784cb38" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="3b26cd24-0abd-45b6-9e19-7bc9a2809598" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="a65a7919-192e-4736-bfb6-94f73ac8bb51" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="8c61d75d-3202-450e-85ec-52c7d2ab7ddb" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="4f16e758-e8ed-4261-b774-472e542e476e" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="622b2615-0ba0-4c3b-aad9-4b9dd7eda2c8" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="609458dd-19a9-49ed-bdc1-402ee91f1247" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="7eb0f4df-ae91-48c3-afcd-962aec46f33a" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="da57f6ec-6e06-49dd-8b19-37c9d8b47895" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="380ce26b-11e7-40e9-9d0c-4d62b4621efa" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="b18464e9-29f2-4d55-9cf0-4ea7bb529039" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="d5cab8fe-0e93-4aad-9b40-9e933a83fd9e" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="434e6b1f-8ca7-49d0-948e-951b0e182d1d" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="e31c2539-2658-459a-881c-5c7f58b37c89" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="bbf7089e-cd0f-4fcf-9d41-8bcfa7b1aced" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="d0320eb6-5f3f-4199-a60f-441c5d7676f9" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="fdc37e9d-fa4e-4a91-bf85-ce0e08297a06" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="202d0c2a-be79-4219-8997-ca84f0485595" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="c19fb28d-e8c6-4372-bef2-99eba574235a" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="dd455ab6-c163-4ded-b04e-9eeb8de54909" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="160c5474-a1ff-49aa-9f1c-64230e3a3293" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="c3989c11-2e1a-484c-9a81-e95a864439e9" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="c6d02d35-34a6-4572-9682-ef661650f546" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="79b01559-e425-4359-928d-f11168f06309" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="3787ff0c-706a-486d-9da4-44991c833826" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="322cec2e-6e6f-4d27-a70e-e8081c421884" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="42aeee71-01ed-4f74-a229-4f7599061cc1" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="b7bdb968-9d73-4c1a-85ca-3265a463f494" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="905c6265-33b0-45c7-9cab-b06f8c429b2a" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="424c58ab-3ae8-44ec-b8c7-28c88871cdbd" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="724f5ccc-2175-477b-97d8-13fd06d2b9fe" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="2a135749-1dae-42df-9bb1-fdd02eea49e8" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="cc8371ce-9551-4afd-8703-c4d1b70dcc3f" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="c640b654-bd01-4d95-9447-f341e678d3b8" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="1cc88cf6-37ef-48d5-9dd7-f3f28ed7d1f1" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="1d5fce3c-85e3-4da3-98b0-68c6d2dd15f9" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="67c3e2a9-ba8d-4c94-8813-97bedc940b1c" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="631dbfaf-e66a-4d03-8a4d-65052cf3241e" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="21d4d8d6-4676-457c-8051-e3124e606eb7" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="ddf9b2a0-9f8e-44a8-951c-e6f9970026e0" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="e864740e-58e6-42e2-b577-2ddecd06f0eb" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="c8bf147c-1f65-4e01-bcce-56e6bf4e2922" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="e7094162-cfc2-48ff-b0a0-e8c2b8f86faa" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="7a7afa18-bb03-4c57-823b-da877eeddf51" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="d6daf743-c4bb-4bab-9d9f-6a9fba6af220" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="0d1ab196-ea9a-461c-bc78-d996542a554c" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="0f2be4ed-7eef-4b1e-95af-1055d3f257c2" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="0c833148-94a4-49d8-bb05-ce7279869475" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}