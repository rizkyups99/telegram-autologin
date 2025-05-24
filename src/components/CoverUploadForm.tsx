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
  return <Card data-unique-id="745c9e12-7727-4a7d-89a6-5dc097995d8d" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="7cc04019-b2cc-4532-b63e-eecb585587a3" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="f2ef61eb-7126-458e-b13e-482cf868166f" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="ff9be63f-3fc5-4e88-9e28-b66786705028" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="a5741025-c82d-47ff-b94d-d883bc29ae51" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="ce7197bb-2ab9-4424-95ef-6c99406cb14a" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="5b449dd2-818d-4320-89ac-3db3760c857e" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="9bda91ab-9cf3-49d0-a78f-b5e1c5a50b74" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="8746e6eb-2b10-44b8-994f-8fbaf60ccb59" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="f9369aa9-6f16-4189-b9a2-920109a84505" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="fbc0b87f-26d5-4a65-bcb2-32be8580c038" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="e4eb6b99-638e-4279-a17f-f566ab3fbedd" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="05337870-d796-483a-8a25-5ea5413341b2" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="a7d09b93-5dc6-4c11-b766-0884858cd8bf" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="b3aeec1b-7974-43d3-9c8c-09b7562caf4a" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="0cb00b89-2d9a-45bb-9cfd-ae706f9cb7cc" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="c7fd8134-5659-47b3-b2a6-f20e069ba994" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="b6ff86a0-886a-484e-965c-c9554be6bdb4" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="95210fe3-9340-4c58-afb8-fca8436f9066" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="b52a7d34-c8f5-47a9-906e-ca452f4bc8b3" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="f931f012-ad64-4a7b-a6b4-8ecc5e1e9b92" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="18cd0399-de7d-4de1-9cf7-667de68bde2d" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="65217949-b0e8-4cf8-aa16-e1424d218932" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="cb6daa81-4424-4e14-848c-143b40ce36fb" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="75da7aa4-b404-4958-ae03-12a836d18246" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="1f1def16-59af-49a6-b0e2-ac86e434d4c0" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="5d4704e7-4b25-43c8-b5ad-c94dc5d81154" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="ffabacd5-9923-4f3b-9cb1-03dd95d0b162" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="75cbf26f-285a-497d-b6a6-b2c9ea8f6e67" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="d8276d12-1a19-418f-967b-4be4b925cd01" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="b4c524f8-f86f-4bb1-b50d-69f665cdf8e0" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="e646ec08-1f9c-4bec-8e9e-507af419d52a" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0dfec26b-e34a-4337-aa6a-b9694ac60a50" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="45a3e263-5d5a-4699-88c4-037352784fae" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="6e4307b1-dec9-45f0-a201-0682fa7abd02" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="bfdbdbc9-8f44-480b-abb9-5a843a95e549" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="43698b19-b2d6-41bb-9357-3797af02d469" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="1f72ff56-d4bc-43e3-bb7e-c966984a1d95" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="2825adeb-a3f1-4e66-98da-781e9a7ba703" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="170f865b-ca49-4f05-a86c-6b9172ef9717" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="47c17c00-7a13-401b-ba7a-4743bb264aa3" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="c25c4c87-86cf-43f1-8aca-d1002799bbaa" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="a17b93df-7356-45a2-b94c-4e493553d7ee" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="273092e7-6aaf-4a8a-93b1-a36b89c52d0c" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="34faed08-e473-4ab7-b2b9-6fd044e5fbbf" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="28253656-73a0-44eb-87ea-aea7bc3f4a0a" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="25f0b264-3389-474b-af1b-7a8e0891d6a8" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="3ca347bf-b5c3-417b-ac05-54c3665b2482" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="2b817f14-fd20-49ea-a413-f696a16809dc" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="372d8206-bb55-4bb1-94e1-1b0d4582bbf3" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="0dba053e-60a1-47dc-8bb8-05ea35208141" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}