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
  return <Card data-unique-id="ba51f6a5-2738-4170-8ea7-6dfc56a7bad4" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="56f894df-b747-4e5b-a002-10c2f867a522" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="42cfb11e-7013-49b4-be38-33651331e9f1" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="0efb0c49-3a4b-40b2-a372-e4a7af0ceaca" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="3ef4c9f9-402a-42c3-bd04-4e24085da06a" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="5184c1e6-540b-47b8-9051-6754628904ce" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="07a35372-8059-4466-b165-0e9b2d2d5fc3" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="976841a1-ad71-46c5-8fb7-545bd8074582" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="bca7e5c1-a931-47a6-b4e4-e6b30fed761f" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="713c72c8-a832-4f04-8155-851de9c6030b" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="ada1e516-fe1b-4635-b692-f9f9c479d291" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="9e1b3251-fe1c-4474-947e-3557cb518a2a" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="e5f89a2d-c34b-464c-9054-4fc9328c213c" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="668598a5-7ea0-4eac-a307-6750960b380a" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="33b4768c-7b65-4a4e-aec0-c1c0414e6290" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="6c33e31e-2104-4e76-97d5-1f92119b8309" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="ba5fb05c-d615-431a-990f-7da9f113b730" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="960b89d6-38d6-444f-a3fc-e65b16fc7cad" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="b373de81-745e-443e-bcb7-aaf3a3301090" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="0d475439-1979-4b56-b037-b883f70c9243" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="6d9268fc-81d3-41a7-b21c-551138eb6f99" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="a0d43221-1be2-4aaa-9025-015ecebf4040" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="5b5cb58d-ab0c-47d5-940c-9a4551f1045b" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="a354b1ac-4eeb-4d8f-afbb-79bf6238bcda" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="bb9072c0-9350-49c1-9dfc-db9bd9046918" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="c8b54f0b-f482-45c5-9280-aff9e064d82e" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="3b34a2a0-a96e-4fef-b078-442e303dbef4" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="dad47c6f-9c33-4feb-a777-e17d957e3017" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="35057bb0-864f-4e06-97d3-46e7d1e0beed" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="69169963-1dce-4cf8-91fd-5cef0490d63b" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="41b9613f-d58a-497a-9367-b8f74a84cdb5" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="f4d955ed-697a-4128-964d-a3d94fd49900" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2ed43be1-3408-4c6a-82c5-642a54e71330" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="f9bed2f9-1265-4ef8-88ac-14c10028bce3" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="51546e6a-5f48-44f2-8000-dc9f0b833330" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="113dd65e-16ba-4310-894d-3ea9bcc18fdb" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="6900437e-1e24-4276-932f-b28e6d2a64aa" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="66fd7767-1733-4272-b4be-39429c5a8474" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="d0af7fd5-dc1c-4850-8361-882450d98469" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="09cc7fb9-b0ff-4144-9663-cd8ba0a9669c" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="242b9b0e-64bf-40d3-b30a-1e16d0a76a37" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="630aebad-bd13-4233-9ddb-e44a50e6d6a1" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="fce171ea-5bf3-4475-b609-d6fbc185fe7b" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="f8bd1d11-b8f6-4aa8-96c4-7e8d884babd6" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="f894a9c3-4376-4f07-84b9-3a1f0d5e6a9f" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="5ab96fad-b343-4715-841a-357257355de6" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="11c8b12b-9fdb-4e8c-8084-d2d94dd41462" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="d46e5df9-975c-4cf7-96df-2500961695f0" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="59aa6cb2-a5b2-476d-aa02-c1f8ed7d408b" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="7e8de85b-3fe8-4277-b799-c669d8aead87" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="c8342aa0-aa20-4cae-a213-2c05a2b1e238" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}