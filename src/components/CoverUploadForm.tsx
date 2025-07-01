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
  return <Card data-unique-id="0ba580e3-05c8-4b79-9fba-d2ca182c769c" data-file-name="components/CoverUploadForm.tsx">
      <CardHeader data-unique-id="fcbe15bd-19e0-4429-9316-83b19154a39f" data-file-name="components/CoverUploadForm.tsx">
        <CardTitle data-unique-id="441ce142-1338-4ccb-8e96-baf346830e36" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="9916b97b-e854-4342-ad1d-75b9a0046dde" data-file-name="components/CoverUploadForm.tsx">Upload Cover PDF</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="537f9d73-ab66-4e20-a027-d21e08be1531" data-file-name="components/CoverUploadForm.tsx">
          Upload gambar cover untuk buku PDF anda
        </span></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" data-unique-id="7f917d5b-05ef-4620-9e64-dea8e633335a" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
        <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="cd324331-ab11-464a-90a6-cfcc89daa71c" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-lg font-medium mb-4" data-unique-id="47e21a47-6771-4780-8324-e857320e8b09" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="de3859aa-3694-4705-a9e2-d38ac21e0804" data-file-name="components/CoverUploadForm.tsx">Upload Cover Baru</span></h3>
          <div className="space-y-4" data-unique-id="52e57a9b-05a0-48c8-b5f3-f41ea79cad98" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            <div data-unique-id="4602c11a-8d32-4922-8d7d-dd0951fd8bda" data-file-name="components/CoverUploadForm.tsx">
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="6f85ad54-d765-48fe-bea1-2b452bad05bd" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="f21231aa-f822-4e04-8665-12348ae0fcca" data-file-name="components/CoverUploadForm.tsx">File Cover</span></Label>
              <div className="flex items-center space-x-2" data-unique-id="cff235bf-d7ae-491b-9926-1c0cf409371e" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center" data-unique-id="05ddf50a-66c4-41f8-a91d-f01cfeb7e4dd" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                  <Image className="h-4 w-4 mr-2" data-unique-id="9d178fb0-77f9-43e1-8228-e4142a42dd15" data-file-name="components/CoverUploadForm.tsx" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="9fb941fe-9c23-4ae0-9884-8ab145a5a474" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600" data-unique-id="899955a2-0e9a-4d28-bd67-088f96a0c8f0" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="fc0c08f0-855a-4d6d-8c5d-a706d97e3d19" data-file-name="components/CoverUploadForm.tsx">(Akan diupload dengan nama unik)</span></span>
                  </span>}
              </div>
              <input ref={fileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleFileChange} className="hidden" data-unique-id="18305d07-cc02-4823-9c90-e2ca3e1d3f41" data-file-name="components/CoverUploadForm.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="feb61ab4-c4b5-493d-a17e-9676ba6d47ae" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="925129ad-f637-43b9-a54e-c4d9c31b1d01" data-file-name="components/CoverUploadForm.tsx">
                Format gambar: JPG, PNG, atau GIF
              </span></p>
            </div>
            
            {previewUrl && <div className="mt-4" data-unique-id="1356dbcf-1f12-4aab-85e8-fcb95919fbee" data-file-name="components/CoverUploadForm.tsx">
                <Label className="block text-sm font-medium mb-1" data-unique-id="50e0302e-7554-4a07-9904-f2c7baac7ece" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="77a92960-61d1-4ad9-bb97-91d126e702da" data-file-name="components/CoverUploadForm.tsx">Preview</span></Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="b0560332-e393-415b-a4f6-230eb3b1c22f" data-file-name="components/CoverUploadForm.tsx">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="f50a991a-7cae-44a5-95ee-6564e3dcc501" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
            
            <div className="flex justify-end" data-unique-id="bf79050c-78f7-4f90-a023-d7c491dfe250" data-file-name="components/CoverUploadForm.tsx">
              <Button onClick={handleUpload} disabled={isUploading || !coverFile} className="flex items-center gap-1" data-unique-id="0bb0ed31-8534-41ab-a3cd-eb6225f6faad" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center" data-unique-id="4a0eff73-bccc-4673-b666-d76aceba57d3" data-file-name="components/CoverUploadForm.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="464db825-b5e8-4e19-9a3e-1660fb8ee502" data-file-name="components/CoverUploadForm.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-unique-id="8e0cc420-d789-4331-84ce-b5b3f1a18669" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="905c049c-2bf0-4015-9f8c-ee3acac6306d" data-file-name="components/CoverUploadForm.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="c492be80-6639-495f-94d2-3216900b5fec" data-file-name="components/CoverUploadForm.tsx">%</span></span>
                  </span> : <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="4da6bb0d-0904-4d2b-8642-cd94cac17ea9" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="bf5de720-0562-4d94-95da-f257653df304" data-file-name="components/CoverUploadForm.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2 w-full" data-unique-id="5ed3489e-dfa1-46c2-806e-3532ef69ff52" data-file-name="components/CoverUploadForm.tsx">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="283091cf-f78f-4d27-bb1d-e998ba68fd5b" data-file-name="components/CoverUploadForm.tsx">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{
              width: `${uploadProgress}%`
            }} data-unique-id="bab4d81f-40e3-40db-95e2-5bd6abf460de" data-file-name="components/CoverUploadForm.tsx" />
                </div>
              </div>}
          </div>}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md" data-unique-id="2161e0f7-224b-419b-9a7d-1cc5942e80e2" data-file-name="components/CoverUploadForm.tsx">
          <h3 className="text-blue-800 font-medium mb-2" data-unique-id="061ecd80-d1c5-4b3b-8c18-6b407f5c1da7" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="dbdb6570-e660-4a14-87e6-786644f3317d" data-file-name="components/CoverUploadForm.tsx">Informasi</span></h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1" data-unique-id="c9f089d1-66f0-4ab1-9835-0996c712287b" data-file-name="components/CoverUploadForm.tsx">
            <li data-unique-id="60d73852-d471-4e2e-b217-a6792132347e" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="e9d6b6fa-1c74-499a-9e80-6f180c6db4aa" data-file-name="components/CoverUploadForm.tsx">File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</span></li>
            <li data-unique-id="47e8ff1c-a11e-4a31-a13d-d138597ba469" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="f1494321-5e00-45b4-80e8-92bc4a1106d4" data-file-name="components/CoverUploadForm.tsx">File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</span></li>
            <li data-unique-id="c578ffc8-1bb0-4fd9-ad47-45aee0a7f21e" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="b61b7d1c-0d20-4bc3-b4a5-e5037603ce49" data-file-name="components/CoverUploadForm.tsx">Format gambar yang didukung: JPG, PNG, GIF, dll</span></li>
            <li data-unique-id="a9f04088-2515-4703-bd7b-5fcac4157f41" data-file-name="components/CoverUploadForm.tsx"><span className="editable-text" data-unique-id="edf88230-de58-4f10-a657-30457be11337" data-file-name="components/CoverUploadForm.tsx">Ukuran file maksimal: 10MB</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>;
}