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
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
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
      const coverUpload = await uploadToStorage(
        coverFile, 
        'pdf-covers',
        (progress) => {
          setUploadProgress(progress);
          setStatusMessage({
            type: 'success',
            message: `Mengupload cover "${coverFile.name}"... ${progress}%`
          });
        }
      );
      
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Cover PDF</CardTitle>
        <CardDescription>
          Upload gambar cover untuk buku PDF anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium mb-4">Upload Cover Baru</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverFile" className="block text-sm font-medium mb-1">File Cover</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center"
                >
                  <Image className="h-4 w-4 mr-2" />
                  {coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                </Button>
                {coverFile && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {coverFile.name}
                    <span className="text-xs ml-1 text-green-600">(Akan diupload dengan nama unik)</span>
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="coverFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format gambar: JPG, PNG, atau GIF
              </p>
            </div>
            
            {previewUrl && (
              <div className="mt-4">
                <Label className="block text-sm font-medium mb-1">Preview</Label>
                <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={handleUpload}
                disabled={isUploading || !coverFile}
                className="flex items-center gap-1"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mengupload... {uploadProgress}%</span>
                  </span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status messages */}
        {statusMessage && (
          <div className={`${
            statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          } p-3 rounded-md flex items-center`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{statusMessage.message}</span>
            
            {/* Progress bar for uploads */}
            {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 w-full">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <h3 className="text-blue-800 font-medium mb-2">Informasi</h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1">
            <li>File cover yang diupload akan disimpan di bucket Supabase 'pdf-covers'</li>
            <li>File akan diberi nama unik berdasarkan timestamp untuk menghindari konflik nama</li>
            <li>Format gambar yang didukung: JPG, PNG, GIF, dll</li>
            <li>Ukuran file maksimal: 10MB</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
