'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Upload, Music, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uploadToStorage } from "@/lib/storage";
import AudioRecoveryTool from "./AudioRecoveryTool";
import SupabaseStorageHelper from "./SupabaseStorageHelper";
interface Category {
  id: number;
  name: string;
}
interface Audio {
  id: number;
  title: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}
export default function AudioManager() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAudio, setEditingAudio] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    audioFile: null as File | null,
    fileUrl: ""
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Calculated pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({
    length: Math.min(5, totalPages)
  }, (_, i) => {
    // Center current page when possible
    let startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return startPage + i;
  }).filter(num => num > 0 && num <= totalPages);
  useEffect(() => {
    fetchCategories();
    fetchAudios();
  }, [currentPage, itemsPerPage]);
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Gagal mengambil data kategori");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Error memuat data kategori. Silakan coba lagi nanti.");
      console.error(err);
    }
  };
  const fetchAudios = async (title?: string, categoryId?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/audio";
      const params = new URLSearchParams();
      if (title) params.append("title", title);
      if (categoryId) params.append("categoryId", categoryId);

      // Add pagination parameters
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Gagal mengambil data audio");
      }
      const data = await response.json();

      // Check if response has the expected structure
      if (data.audios && Array.isArray(data.audios)) {
        setAudios(data.audios);
        setTotalItems(data.total || data.audios.length);
      } else if (Array.isArray(data)) {
        // Handle case where API returns just an array
        setAudios(data);
        setTotalItems(data.length);
      } else {
        console.error("Unexpected response format:", data);
        setAudios([]);
        setError("Format data tidak sesuai. Silakan hubungi administrator.");
      }
    } catch (err) {
      setError("Error memuat data audio. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        audioFile: e.target.files![0]
      }));
    }
  };
  const handleSearch = () => {
    fetchAudios(searchTitle || undefined, searchCategory || undefined);
  };
  const resetSearch = () => {
    setSearchTitle("");
    setSearchCategory("");
    setCurrentPage(1);
    fetchAudios();
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  const startEditing = (audio: Audio) => {
    setEditingAudio(audio.id);
    setFormData({
      title: audio.title,
      categoryId: audio.categoryId.toString(),
      audioFile: null,
      fileUrl: audio.fileUrl
    });
  };
  const cancelEditing = () => {
    setEditingAudio(null);
    setIsCreating(false);
    setFormData({
      title: "",
      categoryId: "",
      audioFile: null,
      fileUrl: ""
    });
  };
  const createAudio = async () => {
    if (!formData.title || !formData.categoryId || !formData.audioFile) {
      setStatusMessage({
        type: 'error',
        message: 'Semua field harus diisi'
      });
      return;
    }
    setIsUploading(true);
    let fileUrl;
    try {
      // Step 1: Upload audio file to Supabase Storage
      try {
        console.log(`Uploading audio "${formData.audioFile.name}" to Supabase Storage...`);
        setUploadProgress(0);
        setStatusMessage({
          type: 'success',
          message: `Mengupload file audio "${formData.audioFile.name}"... 0%`
        });
        const audioUpload = await uploadToStorage(formData.audioFile, 'audio-mp3', progress => {
          setUploadProgress(progress);
          setStatusMessage({
            type: 'success',
            message: `Mengupload file audio "${formData.audioFile.name}"... ${progress}%`
          });
        });
        console.log("Audio uploaded successfully:", audioUpload);
        fileUrl = audioUpload.url;
        setStatusMessage({
          type: 'success',
          message: `Audio berhasil diupload! Menyimpan ke database...`
        });
      } catch (audioError) {
        console.error("Audio upload error:", audioError);
        const errorMsg = audioError instanceof Error ? audioError.message : "Unknown error";

        // Provide more helpful error message for common issues
        let displayMessage = `Error uploading audio: ${errorMsg}`;
        if (errorMsg.includes("size exceeds")) {
          displayMessage = `${errorMsg}. Please try a smaller file or contact administrator if this limit is too restrictive.`;
        } else if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
          displayMessage = `Network error during upload. Please check your connection and try again.`;
        }
        setStatusMessage({
          type: 'error',
          message: displayMessage
        });
        setIsUploading(false);
        return;
      }

      // Step 2: Create record in database
      try {
        console.log("Creating database record with:", {
          title: formData.title,
          fileUrl,
          categoryId: formData.categoryId
        });
        const response = await fetch("/api/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: formData.title,
            fileUrl,
            categoryId: formData.categoryId
          })
        });
        const responseData = await response.json();
        if (!response.ok) {
          const errorDetails = responseData.details ? `: ${responseData.details}` : '';
          throw new Error(`${responseData.error || "Failed to create audio record"}${errorDetails}`);
        }
        setAudios(prev => [responseData, ...prev]);
        cancelEditing();
        setStatusMessage({
          type: 'success',
          message: 'Audio berhasil ditambahkan'
        });

        // Clear status message after 3 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
      } catch (dbError) {
        console.error("Database error:", dbError);

        // Save record of successful uploads to help with recovery
        if (typeof window !== 'undefined') {
          localStorage.setItem(`audio_upload_recovery_${Date.now()}`, JSON.stringify({
            title: formData.title,
            fileUrl,
            categoryId: formData.categoryId,
            uploadTime: new Date().toISOString()
          }));
        }
        setStatusMessage({
          type: 'error',
          message: `File uploaded to Cloudinary but database record failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}. File information has been saved locally for recovery.`
        });
      }
    } catch (error) {
      console.error("Error creating audio:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menambahkan audio"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const updateAudio = async (id: number) => {
    if (!formData.title || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Judul dan kategori harus diisi'
      });
      return;
    }
    setIsUploading(true);
    try {
      let fileUrl = formData.fileUrl;

      // Upload new file if provided to Supabase Storage
      if (formData.audioFile) {
        const audioFileName = formData.audioFile.name || "unknown_audio";
        setUploadProgress(0);
        setStatusMessage({
          type: 'success',
          message: `Mengupload file audio baru "${audioFileName}"... 0%`
        });
        const audioUpload = await uploadToStorage(formData.audioFile, 'audio-mp3', progress => {
          setUploadProgress(progress);
          setStatusMessage({
            type: 'success',
            message: `Mengupload file audio baru "${audioFileName}"... ${progress}%`
          });
        });
        fileUrl = audioUpload.url;
        setStatusMessage({
          type: 'success',
          message: `Audio baru berhasil diupload!`
        });
      }

      // Update audio in database
      const response = await fetch("/api/audio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          fileUrl,
          categoryId: formData.categoryId
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update audio");
      }
      const updatedAudio = await response.json();
      setAudios(prev => prev.map(audio => audio.id === id ? updatedAudio : audio));
      setEditingAudio(null);
      setStatusMessage({
        type: 'success',
        message: 'Audio berhasil diperbarui'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating audio:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal memperbarui audio"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const deleteAudio = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus audio ini?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/audio?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete audio");
      }
      setAudios(prev => prev.filter(audio => audio.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'Audio berhasil dihapus'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting audio:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menghapus audio"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-6" data-unique-id="f7a3c818-f1a4-4fb1-8e51-71cd1e407ac2" data-file-name="components/AudioManager.tsx">
      <Card data-unique-id="d7a0e939-1f93-4590-9c1c-a14129a07dde" data-file-name="components/AudioManager.tsx">
        <CardHeader data-unique-id="b3456e49-befd-4b79-9984-a00a781c6970" data-file-name="components/AudioManager.tsx">
          <CardTitle data-unique-id="b37db5a9-3a3e-4cfa-9c43-e78355d820bc" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="c5c8a1c2-90af-4686-962b-67a9a6a35935" data-file-name="components/AudioManager.tsx">Manajemen Audio</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="d2ecdc8d-9a37-4ce3-8391-538f3afb3e80" data-file-name="components/AudioManager.tsx">
            Upload dan kelola file audio untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="17c05ee3-2745-42b3-b0cc-7ccb4743afe2" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
          {/* Audio Recovery Tool */}
          <AudioRecoveryTool />
          
          {/* Form for creating/editing audio files */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="d3fe2de2-aec9-40c4-9edb-b21022ceeaae" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="855b7aa4-621f-4e52-96dc-b8ab69c2b5ce" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload Audio Baru" : "Upload Audio"}
            </h3>
            <div className="space-y-4" data-unique-id="87128c9d-3e1c-41dc-adb2-71c413f9edd8" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="9cf4dbc1-0ea4-414f-912b-b5da4e925957" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="10e9955c-f7aa-43e3-815f-af32cb6517e6" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6502e0b3-37e0-4132-a085-576d58a15fbd" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul audio" className="w-full" data-unique-id="b2e0550b-9bf4-407a-a106-8d3a9c972cbf" data-file-name="components/AudioManager.tsx" />
              </div>
              
              <div data-unique-id="fbec36ef-2a68-4813-bab5-c6cfbd6c43e9" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="4e599393-b5c0-4485-b2d9-bb9203b1695f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="183eaf70-1151-4cba-8dc1-a1d3dc669625" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="50fe8e17-75ee-4c03-bf15-6fd860f49094" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="f0c4e44c-5022-41bf-b8d1-a540705518f6" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6505731c-9a90-4380-b720-dc79e793333c" data-file-name="components/AudioManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="16de7873-4d59-4be2-a47e-cee22a7eb9d3" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="6b472e35-7e78-43b3-ba57-44da81065754" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="audioFile" className="block text-sm font-medium mb-1" data-unique-id="cd7ac284-299a-4d62-a58b-8251be01a92f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="77171f9f-37a1-42cb-a2b1-3cfb826c8864" data-file-name="components/AudioManager.tsx">File Audio</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="4e5f3b74-0a23-417b-beb9-c4c49834542a" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()} className="flex items-center" data-unique-id="b69791bd-1aef-4e67-a41f-b43cccb60684" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-2" />
                    {formData.audioFile ? 'Ganti Audio' : 'Pilih Audio'}
                  </Button>
                  {formData.audioFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="8e9e9836-6340-4ba2-ac6d-8036e9bded5a" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {formData.audioFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="388b1ba6-9033-40c6-8912-081e8b02c0b1" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="93ad6375-99e4-4a75-baed-0ff6db2d91fe" data-file-name="components/AudioManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.audioFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="dd3cb2aa-c8cb-4e46-9b82-a35b781275f9" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="1f05ba13-3a2c-4d93-8c8c-16acb70b20ea" data-file-name="components/AudioManager.tsx">
                      File audio sudah ada
                    </span></span>}
                </div>
                <input ref={audioInputRef} id="audioFile" name="audioFile" type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} className="hidden" data-unique-id="95e2d3e0-fec5-401d-b271-d560648fd575" data-file-name="components/AudioManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6d015456-d99d-403b-b538-aed9f528b8cc" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="a080c9b1-7971-4b5a-b5ab-7bf890c9d590" data-file-name="components/AudioManager.tsx">
                  Format file: MP3
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="527e2452-ebcb-491a-8c49-a5824f96d619" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {editingAudio !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="7b59c9e1-0292-476c-a931-51ff4118c260" data-file-name="components/AudioManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="fd282dc5-c525-49dd-9ab8-bc96e8cd88bf" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6c842c6d-df37-43a1-8459-550ee55fcb25" data-file-name="components/AudioManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAudio !== null ? () => updateAudio(editingAudio) : createAudio} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="fbd234ce-5cd2-4d73-9c9b-581d49fcde74" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center space-x-2" data-unique-id="e6b0e78a-795e-4cee-a50b-a2e7c9628a84" data-file-name="components/AudioManager.tsx">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="9f385a18-db74-4cc4-8c9c-8d6f26495894" data-file-name="components/AudioManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="d841d88a-853d-4861-b291-69de319fc6e6" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="36685ca3-e778-4436-ba5d-45eb053f0841" data-file-name="components/AudioManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="037c2e64-a22e-48b9-a668-2853f0973e44" data-file-name="components/AudioManager.tsx">%</span></span>
                    </span> : <>
                      {editingAudio !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="ab14e723-5096-44fa-a956-2a8691090e07" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="fe911e00-bc39-4297-b15d-5802ded9442c" data-file-name="components/AudioManager.tsx">Perbarui Audio</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="80cbbce2-a098-4e95-b461-e8fc5180b84d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="11b5f1a8-81e5-46dc-ae54-abbba81cb159" data-file-name="components/AudioManager.tsx">Upload Audio</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="0d46339e-bd7e-4302-8c40-761fe7e5901a" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="0e6e18f2-eacc-4f2e-98e1-dc60b5c4e138" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="fb2207c6-908a-4b46-9506-76ea0d00c9a4" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for audio uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="826d79db-a10a-4f52-b87b-6de6d2a44da6" data-file-name="components/AudioManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="6afdb0e5-8d2b-4aef-ad24-ca06d9897d17" data-file-name="components/AudioManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="a85130f2-5eb1-43bd-b179-4b3f81d13d0b" data-file-name="components/AudioManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="473dce5d-f5e1-488b-a383-4b1a5810c824" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="00bdf7bd-3dae-41eb-835c-52b07c71a223" data-file-name="components/AudioManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="56b890d8-0b5d-49d7-b220-b87c669e0cd8" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="8ac5a26c-be5f-4fe0-81a2-aec747516634" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="c510c314-dd36-4dd9-8fc7-5f74a22a3fcf" data-file-name="components/AudioManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="8885d38a-1691-4025-9281-16b48473e7bd" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="3fad9845-2f42-40a9-8a00-4f35b2938749" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="b6afca25-613c-4af6-9a20-dbc5bf0a692b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4c151d88-b93f-404e-9b66-806de9fb1712" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="0d885746-1f1e-4a9a-a931-96a3a11cf6df" data-file-name="components/AudioManager.tsx" />
              </div>
              <div data-unique-id="de75e9cf-1c91-4102-9819-e4b47a732b95" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="e9d602de-4ee4-4128-ac92-f78fa399d57b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="c287f5db-dae4-4fd4-a27f-4a6358ec20d9" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="3c64a8fe-cc66-4c9e-b30d-925c91e44344" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="fa8fe49d-8272-4bc6-bf2a-1492511b596f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="0cdf9eae-608c-4134-9394-4ce499c996e2" data-file-name="components/AudioManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="23abf318-31ad-4461-bc68-fe831040f75d" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="86d06cd9-a128-42a9-8723-925cb6c69f42" data-file-name="components/AudioManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="a5e6a950-2867-4a25-b378-ea480fcae930" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="b4bf0c36-4464-463d-aa35-ac895244b8a6" data-file-name="components/AudioManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="6adcf681-93cb-4a1d-bd54-62e2b51c5d8a" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="79bc6a3d-2091-4a49-97f4-2728937081b5" data-file-name="components/AudioManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="bf16d632-5741-49e6-acc7-32fe5f3d4cb9" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="b33df8ba-9841-4b8c-bb9b-53c2801c4c75" data-file-name="components/AudioManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="444a2306-869b-429b-9666-f853aa566d49" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="958c0aa9-6f11-4134-b3e6-863cb870792e" data-file-name="components/AudioManager.tsx">
                Daftar Audio 
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="37fa916f-ab68-48b8-9fb9-251e25a3787e" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ba8d5112-1801-4320-bb74-be95b160811f" data-file-name="components/AudioManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="fd2806c0-26e5-4369-a5eb-fe17884e733b" data-file-name="components/AudioManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="db76e703-4cd6-4669-99c9-b897b6c0fbe4" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="f1a0d8f7-52a9-44bd-be85-9c6e1744a83b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="e3689a41-c146-456c-bd04-5509a32caca7" data-file-name="components/AudioManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8fff0adb-3817-49cf-9822-d869476553b9" data-file-name="components/AudioManager.tsx">
                  <option value={10} data-unique-id="f3740eb1-a5f6-4b70-bc8c-39fa4cdb657b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="937c1ed4-aaa9-4ba7-9d65-0f79fed7e935" data-file-name="components/AudioManager.tsx">10</span></option>
                  <option value={50} data-unique-id="17541df7-09b7-407a-a70b-5d7b7b6e143f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="b34ab6f9-924f-4302-8a95-de7ec9233a4d" data-file-name="components/AudioManager.tsx">50</span></option>
                  <option value={100} data-unique-id="ebaec416-3017-4780-b4dd-794212f165c4" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="7f34a82d-27c8-4280-986f-661f9fc8e619" data-file-name="components/AudioManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="8ff1346e-1f39-48b1-b752-720a9c643cff" data-file-name="components/AudioManager.tsx">
              <Table data-unique-id="54c45360-4abd-46b4-8cc7-217dd1c827fe" data-file-name="components/AudioManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="f31c532c-2acb-45fd-a91f-c7f769be1fc5" data-file-name="components/AudioManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="360f746b-58a6-4003-b66a-aeaa93ab7c28" data-file-name="components/AudioManager.tsx">Judul Audio</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c8de55e3-dcfe-425e-bf37-0fd90d65e0f5" data-file-name="components/AudioManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="6f5cb300-a313-4a97-8701-db6a598821b1" data-file-name="components/AudioManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c95766ee-9903-4734-b895-fd1e2e488b3a" data-file-name="components/AudioManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="3ca239cc-a897-4cfb-a77d-db1c0ca3f336" data-file-name="components/AudioManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="a43bd7cc-ff97-4cc1-9ec1-9a31ed5b09e5" data-file-name="components/AudioManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="a135c0f0-e342-4902-9d17-2339f28719f1" data-file-name="components/AudioManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : !audios || audios.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="5d5ef75a-3b56-4864-be53-1f1f906450b3" data-file-name="components/AudioManager.tsx">
                        Belum ada audio. Silakan tambahkan audio baru.
                      </span></TableCell>
                    </TableRow> : audios.map((audio, index) => <TableRow key={audio.id} data-unique-id="afa2cb9f-4860-417a-93eb-059a83ddf09b" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="a4fed048-0a0b-4c40-992c-23b61fe967d8" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="d5f0cd36-efeb-4bd3-a074-3b5e2946dc32" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.title}</TableCell>
                        <TableCell data-unique-id="29ad540f-3b44-411d-ad6b-bf03670dc58c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-is-mapped="true" data-unique-id="e2af4636-b9a2-43e8-9edc-ceccd3a9123d" data-file-name="components/AudioManager.tsx">
                            <source src={audio.fileUrl} type="audio/mpeg" data-is-mapped="true" data-unique-id="60c69958-77f1-4fad-aa0c-dbcea05deee4" data-file-name="components/AudioManager.tsx" /><span className="editable-text" data-unique-id="e9a1572d-98b8-47fc-95f5-d06ef86fb87b" data-file-name="components/AudioManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="d07298d2-0380-4dc4-974e-e6285a2d9b80" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="2946581e-f8ad-4da7-a3a3-0d3817b40d32" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                            {audio.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="7e53eb2d-852c-43ff-b6af-0681f1a7bce1" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="1b8f1aa8-5d3c-4f8f-b9ad-0e5cdcfcb786" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="7fe6bc4a-55ab-43d8-8fe1-a5760c3c7876" data-file-name="components/AudioManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(audio)} disabled={editingAudio !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="4452e0c4-5c11-4bc7-a4f8-3ba5f23b9510" data-file-name="components/AudioManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="85d826db-e431-4965-91a7-4d50a19a1e48" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="2e245c64-06a5-4347-9b6d-438cda7f9277" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="42182a65-6d2c-4612-a212-7898005a6efc" data-file-name="components/AudioManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAudio(audio.id)} disabled={editingAudio !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="8b52d904-7026-4aa4-993d-a9086bc269b2" data-file-name="components/AudioManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="c0039a73-03a3-4eef-88bd-4f3fef5adf23" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="56d4b204-9589-4618-b688-623910b2c5e7" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="cef5716f-c89f-4672-9558-a588d3efb458" data-file-name="components/AudioManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="d3e064ac-4895-4d11-8a42-4416b231a9ec" data-file-name="components/AudioManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="0b91c22f-0a89-407b-b64c-2f847b38276a" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="424bd872-3ee9-439f-8afc-ed0a4781e91c" data-file-name="components/AudioManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="3feff626-a22d-4896-9f1c-a916165f377f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="bba5bd47-e985-4124-92b4-3b330f3fd507" data-file-name="components/AudioManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="07a5f09e-d4c9-4f86-9c7d-12f61d7ce200" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a8a8f20c-7573-4a54-bf33-4676406b4dc9" data-file-name="components/AudioManager.tsx">
                    <span data-unique-id="5d2dfd47-96f1-4949-b907-93eda1de200d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ca32cdcc-73b7-4a46-9926-428689acf871" data-file-name="components/AudioManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}