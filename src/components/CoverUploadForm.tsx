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
  return <Card data-unique-id="b0c990c1-d88a-4af5-9d6e-662ab2cab95b" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="794efc69-c391-449a-a956-a7f1ea238f85" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="c8003d69-7cc9-470d-b7cc-83f1b46bef33" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="634b5d83-79f9-4785-b9e3-8d7ed0330254" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="463e5738-c4db-4414-b7cd-5964abd776a8" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="fb910a86-22a4-430a-9c45-954ce9b94a87" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="d9dd7541-a86d-4686-8634-7e414c398049" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="2cd3ec1e-e599-42f9-b6f3-79ed6bde3f40" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="d06d7e24-c6b0-4d8c-be7b-e9bc1865f060" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="180ff43f-05d6-4169-ba74-b209f969bce2" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="589ae595-0802-40ba-b87b-ed82191f427f" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="3b49037a-7fa4-4414-9d65-cce285f46feb" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="79b53662-e343-4207-8437-c47ae69f379c" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="31f8b6b1-ee23-4038-81d3-67b57da13f6c" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="856382ff-6451-4566-91fd-dacb04636f99" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="d847e87e-8bad-4c09-afac-1fe776f67ac5" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="b43c591b-54cf-4f6c-a6b8-e1f0d7bcf551" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="2d429c1a-35b7-4e86-974c-58904ac3c642" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="1d2fcb91-9bf5-4927-967d-698517e18dfa" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="710720f1-c856-4c22-9b9a-111615a64e79" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="fc2ca3ba-53ed-4215-bc1c-7601da270cb4" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="8e3b75b6-5904-4069-8fef-be1abb19e05b" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="30f77627-83b0-4596-a55c-fad02290563c" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="0ae8c5dd-4772-45c8-ac09-1ace17db8e70" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="fd49b93e-c1d5-41fb-959d-8b76b494e3e9" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="25f6b6d9-112f-4b08-b9f7-d58b5a4a6e3e" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="89bebe2c-df96-4392-8dce-c33c63a9db0f" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="2d56043c-e2b2-48b4-8525-15b5c78010a5" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="c939f5cd-f6a9-446e-9f57-94377f707709" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="374ce35e-f92b-4de0-a776-c2811b4d8d2e" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="350d2956-e22b-4bf3-92e5-5526e51166f0" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="f569c9ca-8b53-42ce-84ef-05e970529058" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1854a2dc-8339-41d4-9640-8a8456e3a3c2" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="591f9ae7-0450-4b43-9506-7d5ba678f0f1" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="b75cd0e4-4356-41f2-899c-c17937a21122" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="dd7c96cb-434b-4990-8474-9a91e684ee71" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="b0c2d8af-950f-4ec6-8dc4-f58bd538b71d" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="87904473-69b6-4c1d-a607-c4dafe1f7e49" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="34e9f598-bc3f-49cb-b214-a8d600778816" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="6f428188-6ef5-4f6f-8519-7dcaf13a3256" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="d805febe-d9d7-4942-9987-fb4e9f212733" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="9339baa9-c214-4e99-9620-f3bbfc64a4b3" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="a2edc6c6-1b4b-49fb-8c33-6e9247355aa5" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="80476ffe-ed14-47a4-becd-4ee611e0ac9f" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="2fee0dec-0368-49b6-b3f3-317cd7b1b791" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="fd524bf1-f23f-4ac3-aa05-1e42dd2ee770" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="545ccd2f-f6f6-4f5d-9310-884a59464f09" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="dfe6c858-cbfd-405a-8227-e40ed7128bf6" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="57b357ee-8cd2-4e32-ba9a-c0f596aeedf7" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="2e6183fb-7ebc-4803-aee1-c728158be317" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="1f2771b2-551f-4840-88dd-e264624a2fbd" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}