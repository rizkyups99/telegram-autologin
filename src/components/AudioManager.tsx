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
  return <div className="space-y-6" data-unique-id="5e35e9bc-33c9-49c9-8a4a-ec7aba44d2d3" data-file-name="components/AudioManager.tsx">
      <Card data-unique-id="eec75ccb-b2e5-477d-b6b8-ce1f8c8f5576" data-file-name="components/AudioManager.tsx">
        <CardHeader data-unique-id="dc1d3856-2074-4a7f-854d-d313c9380565" data-file-name="components/AudioManager.tsx">
          <CardTitle data-unique-id="dbc63d0c-a68f-4c34-b984-69df2a69bbe7" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="9d84e95a-1cd4-44b8-8ad5-33f83a432b1c" data-file-name="components/AudioManager.tsx">Manajemen Audio</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="6216754e-4275-4f72-8e09-2516e2a0812a" data-file-name="components/AudioManager.tsx">
            Upload dan kelola file audio untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="f705cc31-62ba-437f-bd89-f6e2b161b229" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
          {/* Audio Recovery Tool */}
          <AudioRecoveryTool />
          
          {/* Form for creating/editing audio files */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="e0c5a9f8-d083-48ca-94dd-46baca20b9c2" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="8b3f5a60-ebb6-44b6-bd8d-c7d6718a71b2" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload Audio Baru" : "Upload Audio"}
            </h3>
            <div className="space-y-4" data-unique-id="8130a609-afb7-4031-8852-28a5dd459109" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="f981a194-7c2a-485e-922e-849c6b6cf7c2" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="5132672a-b390-4ee8-bab1-f1ac1a3d856d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ac9aced0-794e-4b66-91f5-22ffce50f394" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul audio" className="w-full" data-unique-id="350c712c-ce78-4b85-a5ce-0be349219e61" data-file-name="components/AudioManager.tsx" />
              </div>
              
              <div data-unique-id="ac109375-751c-4232-b23f-9dbd7ccad049" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="0e849368-9823-4bc9-8bdc-738bf2e2cc0e" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ecc69155-3d72-42dd-b856-f05fd947eb13" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e7b28c1e-5f65-4ebd-8a40-150462876dc6" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="26add7a4-cea9-4150-92f6-ff69fdfe55ee" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="33851dbc-dddb-4387-a829-40a236eab0f5" data-file-name="components/AudioManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="d9c633a2-27d5-432c-bd4b-211242d051df" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="a1a55899-3678-4a70-a45a-4cf7a84e1a5a" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="audioFile" className="block text-sm font-medium mb-1" data-unique-id="8c7efcb4-da99-4ff7-a86a-5f39e33ce70f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8cb4b497-31fa-4079-ac20-d5054ce8d8fe" data-file-name="components/AudioManager.tsx">File Audio</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="0a6f7de6-f226-4bc7-b8ac-8b0acd77b511" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()} className="flex items-center" data-unique-id="ca7cf361-e6d8-4e82-a232-f761faab630c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-2" />
                    {formData.audioFile ? 'Ganti Audio' : 'Pilih Audio'}
                  </Button>
                  {formData.audioFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="1175caa4-c8ee-479c-8d3e-d51cd52cd692" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {formData.audioFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="531c716d-1b34-4e90-8e70-7d66c29a0222" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="3bd6a530-1280-4444-8729-83d7e53c8a25" data-file-name="components/AudioManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.audioFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="2bed71af-605c-425d-859c-825e0d4cb4a5" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6c177fbb-e9fc-4fe1-b575-21a00062d3a4" data-file-name="components/AudioManager.tsx">
                      File audio sudah ada
                    </span></span>}
                </div>
                <input ref={audioInputRef} id="audioFile" name="audioFile" type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} className="hidden" data-unique-id="07ec0587-dae6-4e9c-968b-370dbd75bac0" data-file-name="components/AudioManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="7d9ca8f2-c3bb-41d4-9bc9-bc6684baf6e4" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6ddcd68d-b19c-458c-8194-0306c5c2b661" data-file-name="components/AudioManager.tsx">
                  Format file: MP3
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="e3f705a4-efab-41ac-848c-d583c81c5a64" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {editingAudio !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="27ae71cc-8f1e-4e03-8902-87ce7faa0f6c" data-file-name="components/AudioManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="0310248c-d0a1-49ac-87c4-e04d31d0f79d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="0fa0cb58-1ef0-4e7f-b0df-c3716081a436" data-file-name="components/AudioManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAudio !== null ? () => updateAudio(editingAudio) : createAudio} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="5371418c-19bf-4482-a6eb-818fa7cdc66c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center space-x-2" data-unique-id="47c094c1-b7ff-4977-adf8-630e908671b8" data-file-name="components/AudioManager.tsx">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="6c35ebb9-e62a-42c9-a756-dc333e910222" data-file-name="components/AudioManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="9cf8f107-caac-4698-a1d6-4b47046498e7" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="bd764187-277d-4266-a900-f5c6ffceb8c8" data-file-name="components/AudioManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="6cb69a56-27fe-4ad8-9bfd-349790b5f19d" data-file-name="components/AudioManager.tsx">%</span></span>
                    </span> : <>
                      {editingAudio !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="ebb35da2-b059-4d60-a7ea-b408260fb9d5" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="5199e7ad-cd9f-49c6-bb33-c131c451bdd9" data-file-name="components/AudioManager.tsx">Perbarui Audio</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="0b55aeb6-19e8-4a16-a0e0-252acc722a1f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="f09b53ef-caab-4d53-8721-e8f5449f0912" data-file-name="components/AudioManager.tsx">Upload Audio</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="0179522b-a1f2-4969-ab67-677e5650f288" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="a368fa0b-d144-4e48-91ea-37b1eb00d03c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="fa03a415-067b-448d-bc5c-71e9c907a42d" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for audio uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="ca9cb2c9-f430-4222-8351-7f4899f2f124" data-file-name="components/AudioManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="60e8d77f-3ec7-421a-aecb-6008f92e628c" data-file-name="components/AudioManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="a6b35dfe-7f15-4144-b428-ad148c2b47bf" data-file-name="components/AudioManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="c9f37eff-bda9-4881-a29b-a6eb66f91c40" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="2d238629-af9d-41ed-ab3a-9f2e6bbea531" data-file-name="components/AudioManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="e49446c7-732a-4f6e-9d09-c92c06d72a93" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="a2402e13-90e8-4a74-9c95-32610bd0a5fd" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6051fe2b-f1f3-4d3a-ac3a-d9b67da8554a" data-file-name="components/AudioManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="c4f932dd-7ceb-42d7-9d5b-7b44af28bb16" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="205e397a-2c18-40c2-ba05-d78c1a37102e" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="478f1935-ba9d-4c28-b9f6-9b68e4e0c68c" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="7763c010-6978-4520-ac66-ee13ea3b9d22" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="162c29d4-b6fb-43d7-8c6e-509df80c09a9" data-file-name="components/AudioManager.tsx" />
              </div>
              <div data-unique-id="28f5f0b6-493d-454c-8498-53997a7f195c" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="ad181d9a-890d-4944-9fa7-9a70bc462ea7" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6d0e34a9-41cd-4ae7-8aeb-632557107360" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d18f4a5a-69af-498b-8d7b-ffd780764df1" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="b291b265-6578-4669-9896-f67bc15f3f31" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="36caf9e5-525e-4c86-b323-939b2fdc3040" data-file-name="components/AudioManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="bb5be1f7-5946-476a-976b-5852a7722e3b" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="c5dc6283-3dd6-4de2-aa23-69da1580c3a4" data-file-name="components/AudioManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="e95fa743-abdc-4fef-a901-94b738f49317" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ba652dd4-7506-49bb-bae7-6c978dd208da" data-file-name="components/AudioManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="7cc6c8ed-1c0f-4f91-8981-37f676316d63" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="6eb18fae-c208-4a09-bdc2-3cbf57b9d63c" data-file-name="components/AudioManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="4f2944bc-d090-4420-8ec1-2c9cea492369" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="05f01b02-02fd-4e31-9745-55e02a3b7c69" data-file-name="components/AudioManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="d0c9453a-2bb3-4a97-91c5-2134262534be" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="b904577c-e029-4e97-bfb6-c3fc02b127b6" data-file-name="components/AudioManager.tsx">
                Daftar Audio 
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="b77f0ad8-08e9-4aac-8fa7-dbe41359b089" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="25086fc7-7bb0-4839-84a2-de4d94301679" data-file-name="components/AudioManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="2dcf35ca-7b9b-441c-ba13-6d779c3c6654" data-file-name="components/AudioManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="4d28ef85-45cb-4c05-8706-283e4b9e664c" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="40747657-69c4-4b68-a4f2-586cb85b236e" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4e6b58e5-6349-46e7-a801-3a08140ffab7" data-file-name="components/AudioManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="daa6a20a-8935-4706-84c7-28da159c68a9" data-file-name="components/AudioManager.tsx">
                  <option value={10} data-unique-id="80250077-8f44-4846-9e17-1b6d2591acbf" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8e3caa8d-78af-4cc4-a9c7-f07730ac7d24" data-file-name="components/AudioManager.tsx">10</span></option>
                  <option value={50} data-unique-id="f362096c-945d-4d6b-9451-ea995bf3126a" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="fd1ec53f-27f6-495a-aff5-8f7fa736b369" data-file-name="components/AudioManager.tsx">50</span></option>
                  <option value={100} data-unique-id="73bba576-90b5-4b92-92e0-21be18c8555b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="3f43eaf3-ac9a-4e32-b0ec-1a130e42395d" data-file-name="components/AudioManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="199221e1-f0a9-489e-9b26-f28be22de932" data-file-name="components/AudioManager.tsx">
              <Table data-unique-id="2b2db0e8-8318-4ae6-96e0-41e02a1d33f2" data-file-name="components/AudioManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="565e49c9-2b55-4d52-9292-7fcd8a275534" data-file-name="components/AudioManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="fd3cdec3-df19-49ad-a20a-8baef1074ab0" data-file-name="components/AudioManager.tsx">Judul Audio</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="b17882c9-57af-4bec-ae55-3bcfa98dc6b4" data-file-name="components/AudioManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="7b6c9de1-8772-478c-b609-e51ff903a7eb" data-file-name="components/AudioManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c98dd9a2-0d18-43e9-bdf4-8f60ba85fd5b" data-file-name="components/AudioManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="6dd316a9-77fe-4ce2-bbfd-20072a540ff4" data-file-name="components/AudioManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="e5e19b1e-8d14-4fea-8be6-4f0fd76e6f75" data-file-name="components/AudioManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="6097856b-cb4d-47bd-8d14-f42f99546948" data-file-name="components/AudioManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : !audios || audios.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="cd7641ae-5779-4b85-89c5-c5cd5bba8b29" data-file-name="components/AudioManager.tsx">
                        Belum ada audio. Silakan tambahkan audio baru.
                      </span></TableCell>
                    </TableRow> : audios.map((audio, index) => <TableRow key={audio.id} data-unique-id="77fc0a83-2d5e-49db-9442-1ac1ea830509" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="7d82a52e-dd51-4bf0-a6b5-f74bfe6bceee" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="5ff61568-c5b1-4012-8760-4c880fc3e802" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.title}</TableCell>
                        <TableCell data-unique-id="20a5ac75-1a57-4d78-b855-7992f67118f3" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-is-mapped="true" data-unique-id="3f8c631f-00d8-4fa7-9279-e7a2ff29a157" data-file-name="components/AudioManager.tsx">
                            <source src={audio.fileUrl} type="audio/mpeg" data-is-mapped="true" data-unique-id="c8301fa5-109d-4857-8661-7b1ddc88fbc4" data-file-name="components/AudioManager.tsx" /><span className="editable-text" data-unique-id="1560bbd0-06af-4e4c-a390-00d3a7a3b5fd" data-file-name="components/AudioManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="be5fd7fa-37d2-48e8-95d6-0f67784fc141" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="516de60c-7941-4b74-8d9f-3c34958dc41b" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                            {audio.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="7215542f-48a8-47c5-8d1c-257d752f448f" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="290f5298-ab08-4a34-b0f6-db57d0fb5e22" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="9a4fed33-5589-4809-b33c-3fcda0bd9d75" data-file-name="components/AudioManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(audio)} disabled={editingAudio !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="b752cc57-2ec8-4a5a-a752-789f99fb181d" data-file-name="components/AudioManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="e98044bd-16b7-4e0a-a65a-0dc4d05bccfd" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="b4f0b855-3fce-43d0-900c-713591df0841" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="c26a8fb1-0576-4638-9908-e881a12c0a72" data-file-name="components/AudioManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAudio(audio.id)} disabled={editingAudio !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="81dd6b24-4f90-405d-826e-9b457c8ad25f" data-file-name="components/AudioManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="e6d4b689-8492-4449-b58b-d5f8468f7e00" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="5bc49628-ca78-411e-a6de-e62039c8d155" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="e42ec30c-1fd1-490c-98f4-2fce0f216b02" data-file-name="components/AudioManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="c429ce0d-0c0a-4fe4-9c9b-1e3faa50c703" data-file-name="components/AudioManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="8798eea3-e3b9-4f22-be4d-9a2cef31a1dc" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="769515df-05b5-492c-8e0f-f4fa632600d5" data-file-name="components/AudioManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="9b142156-a5f5-445e-a1e2-4dc2833dd17c" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="a2ec41fc-8e91-4efa-870a-226675bfd844" data-file-name="components/AudioManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="a537f3e0-3740-492a-9632-297e233e4aac" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="d5ab6647-6836-4b77-9ac0-7df024f50f83" data-file-name="components/AudioManager.tsx">
                    <span data-unique-id="50c68cf4-31e4-4e68-bce7-e82f7b80d4aa" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="7e9ebb0f-fc71-4901-8f26-04ea9bffcab1" data-file-name="components/AudioManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}