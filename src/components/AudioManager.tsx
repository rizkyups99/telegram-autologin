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
  return <div className="space-y-6" data-unique-id="41431f41-6d7a-4deb-bb3f-c66024407911" data-file-name="components/AudioManager.tsx">
      <Card data-unique-id="54c13b30-27cf-42dc-973b-45b907b164ac" data-file-name="components/AudioManager.tsx">
        <CardHeader data-unique-id="60012781-1b88-4661-9ea0-98b9233accd4" data-file-name="components/AudioManager.tsx">
          <CardTitle data-unique-id="2fb470cd-afb4-4018-b309-2363fec49b7e" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="541607fb-6728-4ab1-a0a4-32cd08ea459d" data-file-name="components/AudioManager.tsx">Manajemen Audio</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="e22adc57-a8b9-4349-a7de-461d0a4f4914" data-file-name="components/AudioManager.tsx">
            Upload dan kelola file audio untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="88fbb1ed-f75e-44c9-9e0f-866715a0c31d" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
          {/* Audio Recovery Tool */}
          <AudioRecoveryTool />
          
          {/* Form for creating/editing audio files */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="c2a079b4-6b8c-4a6d-8ece-08b56eec304c" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="24a32874-e925-4e68-9906-8222bc597365" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload Audio Baru" : "Upload Audio"}
            </h3>
            <div className="space-y-4" data-unique-id="30b1ff73-0a2a-4a6e-9e48-61ec04c00f45" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="fa7e3783-bd81-45a7-b6c5-98b0c5170150" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="d9ae72ac-49a8-4767-9f3e-b7985f472529" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8c029dbf-2cfa-4481-b0c5-f766fdc89eb3" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul audio" className="w-full" data-unique-id="18b5c651-f710-4ad4-969b-1943c46eaffa" data-file-name="components/AudioManager.tsx" />
              </div>
              
              <div data-unique-id="49124946-c710-4d51-ac1c-0d379dca990b" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="10e14468-aa51-404f-b3a3-f9de802a5536" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ab101caa-bfaa-43fe-bb63-0141ff0e5e38" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="b73250e5-8e58-4432-9713-73ebbbf82a91" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="b10b5399-17c1-4573-ad87-54ec57dd9653" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="2cf8cfba-cefb-480d-9916-97da3f476f2a" data-file-name="components/AudioManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="44a2eb62-22b5-4aa5-a364-57785a715395" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="df4fc01f-5bb5-4501-9eea-14fe8745b00e" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="audioFile" className="block text-sm font-medium mb-1" data-unique-id="b1677db3-bda7-42be-a2a0-87074e4bb796" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="0c34a9ed-f1d6-4fec-8060-d64762f1d5c1" data-file-name="components/AudioManager.tsx">File Audio</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="61af5b5c-b33d-42f0-805c-be766811d9f2" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()} className="flex items-center" data-unique-id="f6d3af84-f417-42c8-98b1-9e7dccb8daa7" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-2" />
                    {formData.audioFile ? 'Ganti Audio' : 'Pilih Audio'}
                  </Button>
                  {formData.audioFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="2375e329-d00e-45ff-a3bf-cc0381500572" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {formData.audioFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="f20153ae-fc22-4d43-a903-3d9ce7689c5e" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ee7b4511-da26-4d7d-b691-37639344476f" data-file-name="components/AudioManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.audioFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="13501ded-c05c-4268-8eba-e4ef52d53a06" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="25cc5f68-0c5b-485a-aea9-63d90c72e6a1" data-file-name="components/AudioManager.tsx">
                      File audio sudah ada
                    </span></span>}
                </div>
                <input ref={audioInputRef} id="audioFile" name="audioFile" type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} className="hidden" data-unique-id="347e945f-3e9d-4682-9ec8-6b5a95c6086a" data-file-name="components/AudioManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="023b7a74-34f8-40e2-9d92-2fc006e34f91" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="74d593e3-267a-4cf1-997b-4c6efe312d8c" data-file-name="components/AudioManager.tsx">
                  Format file: MP3
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="bc4831ef-2262-4920-a508-d77ab016ceac" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {editingAudio !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="580a4e5b-5504-42d0-989f-3b6bbfdefbc7" data-file-name="components/AudioManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="44fea316-72e0-47fc-b2eb-00d56040680b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="faad4948-75b6-4774-83c4-8a52d7e82d32" data-file-name="components/AudioManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAudio !== null ? () => updateAudio(editingAudio) : createAudio} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="85ea553b-f2df-4963-8a2d-094e15b34e6b" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center space-x-2" data-unique-id="e2122eb9-a0ce-486b-ad07-8a936933df49" data-file-name="components/AudioManager.tsx">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="26dfdbab-b73d-4cf7-9523-b5a6f1bb4a4d" data-file-name="components/AudioManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="08f9fcf7-9fc2-4e60-98dd-2ba250190996" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="69ec87d8-f08b-4c73-9d23-c0061e8bb70d" data-file-name="components/AudioManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="91b1b0b2-601b-4cd1-9b20-b6c887dca006" data-file-name="components/AudioManager.tsx">%</span></span>
                    </span> : <>
                      {editingAudio !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="d56fd6df-4f9c-43e1-b56d-3d5172f38cb4" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="bc953bba-9ee0-47fa-bdbf-335975928f6d" data-file-name="components/AudioManager.tsx">Perbarui Audio</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="3ca63987-719e-4bc1-b742-23199be42821" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="f1dd5594-c37e-4783-bd49-13bb55624d64" data-file-name="components/AudioManager.tsx">Upload Audio</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="e028c229-ce7d-4612-ba17-7f08a15691ed" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="b180cb30-c87a-4e8f-ace7-04652fa9c82c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="ca8dbcda-501b-4c71-a48d-a74f201d4359" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for audio uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="1a55f1d2-214c-4e13-ba96-d8c7af530a13" data-file-name="components/AudioManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="79cd4208-8bd9-4b28-9133-8486ce108663" data-file-name="components/AudioManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="881b3ae6-658e-4588-a597-d44784d4e7c9" data-file-name="components/AudioManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="16eab6bf-0005-4a72-acdb-b2868fd36857" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="4cdcbf9d-9766-4d2b-a180-7132582713a4" data-file-name="components/AudioManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="91df3d3c-3c9c-4b36-8ac4-0922f6ae53b3" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="78ec726b-5cbc-4ebc-851d-a510302b9f7a" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="acce818c-3aec-4cb4-9a09-66bb5e99e0de" data-file-name="components/AudioManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="58964f7b-5702-4a75-9b03-acf8c200153b" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="803e4538-c915-480c-8a8f-35ea9849bbe9" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="97fdab76-b743-47e3-bb2a-dd0bc63bfe28" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="266b2f05-f36c-44c2-9bc4-544e929101f1" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="74d60e14-8d40-4b5e-9b2c-bd94159c8d00" data-file-name="components/AudioManager.tsx" />
              </div>
              <div data-unique-id="0bf48b0b-2a30-49a7-9e17-d8d3135dd7ca" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="890a2115-fb35-4747-97de-aaf4e4f82bf9" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="654af313-2b91-432c-9246-5c4a2ba12624" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="3ba07ec7-3d1c-4c66-ae52-a7b690268ed4" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="f52cfea9-1884-45b5-89ee-e52c7e104a4f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="143e22be-bae5-436b-88c4-221642377e3d" data-file-name="components/AudioManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="05726142-7c03-4d59-a3df-7eed789ec373" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="4fac53e8-9763-4667-9929-fca2ee0d3c4e" data-file-name="components/AudioManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="a07b5c4d-65f9-4b5d-b786-21fc28309072" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ff939a7b-1829-4e92-a322-fb3beaadbad1" data-file-name="components/AudioManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="9a180b8e-1b40-492a-b703-d9654d3c55ff" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="84c0d646-a70b-4ff3-ad67-7117341d242d" data-file-name="components/AudioManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="ea55fedd-deb8-4a8b-a820-4c74d0e4e934" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="e8f53200-e061-4810-9e09-f1836f96f0f4" data-file-name="components/AudioManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="140f9d60-f2d3-4640-b437-8b7c171fb61f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="d6963326-82fa-4b8d-bdc6-616f145f8731" data-file-name="components/AudioManager.tsx">
                Daftar Audio 
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="757b3166-5d9b-4454-833b-5a82f576c677" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9f9bf0f9-3561-48d8-9961-bdb7d9444174" data-file-name="components/AudioManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="3adf545e-5ba9-47c5-8b96-f7e1c8d88c85" data-file-name="components/AudioManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="b10c0596-e7b4-4e5a-ba24-02e044b7efce" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="0ea178c6-20d3-4e98-95a8-1a8b4b810174" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="d84534ca-c3ea-4d31-81f5-d3c079dd4201" data-file-name="components/AudioManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ea777a4e-c0aa-4e45-a4f3-91007bee13cb" data-file-name="components/AudioManager.tsx">
                  <option value={10} data-unique-id="93903913-6021-494f-8caf-3777345ccd6f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="fb84d26c-3b60-4708-8f7a-6c1647a6c456" data-file-name="components/AudioManager.tsx">10</span></option>
                  <option value={50} data-unique-id="ca3d15cc-a051-4637-9354-634b88b8cdd1" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="a3968d5e-2412-4a24-9fd1-a612ee19ea27" data-file-name="components/AudioManager.tsx">50</span></option>
                  <option value={100} data-unique-id="bb42068a-f6be-4b86-99f4-aa33fc483673" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="57ed6d64-383c-4c27-bf23-322b0136f9ca" data-file-name="components/AudioManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="05ac2bcb-bf03-48a1-9d0f-af23eb0ab567" data-file-name="components/AudioManager.tsx">
              <Table data-unique-id="7221698e-5ddd-40ab-9f96-05177e3a5f19" data-file-name="components/AudioManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="14b7b949-7d31-445f-9bb2-1a0e18b88502" data-file-name="components/AudioManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="fcfc77ef-901e-41c6-8cf0-08475ff1e459" data-file-name="components/AudioManager.tsx">Judul Audio</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8c9d1335-749e-4b73-b7a7-8b8c4494d29f" data-file-name="components/AudioManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="f1ec958a-cce7-4ee7-9a73-8f475f421dfc" data-file-name="components/AudioManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="468e3dc8-b84c-4c74-9dc1-f106c97c0cba" data-file-name="components/AudioManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="56e73820-2ae1-493c-a7e0-a23da802eee6" data-file-name="components/AudioManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="351925b7-589f-4c51-a2b7-a995a8d83475" data-file-name="components/AudioManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="2702c762-5ee9-4423-ac74-e83cc059047d" data-file-name="components/AudioManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : !audios || audios.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="d847dff2-20a5-4919-8dde-1a6b9383a17e" data-file-name="components/AudioManager.tsx">
                        Belum ada audio. Silakan tambahkan audio baru.
                      </span></TableCell>
                    </TableRow> : audios.map((audio, index) => <TableRow key={audio.id} data-unique-id="5719c2a7-13ae-4c94-b537-79ef45a36090" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="dbc23e88-99e8-494c-a56d-4123fe9141a0" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="d5fea607-1d84-4041-a5cc-602625ac97a4" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.title}</TableCell>
                        <TableCell data-unique-id="2b6ecdb5-f10e-49e5-9ad8-338082a8c378" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-is-mapped="true" data-unique-id="2edaeedc-6614-4586-8008-3ea0d8e14abb" data-file-name="components/AudioManager.tsx">
                            <source src={audio.fileUrl} type="audio/mpeg" data-is-mapped="true" data-unique-id="55e01e32-a6d0-455b-aaf1-513598ed1d87" data-file-name="components/AudioManager.tsx" /><span className="editable-text" data-unique-id="a4245a9c-1b07-42a1-b907-c1c3f3eed79b" data-file-name="components/AudioManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="f4720885-7b34-4bce-8956-bb5d8d364f79" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="1496065d-ae59-4aaa-af0e-b0e0784e3485" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                            {audio.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="2c392e62-db1a-4824-ba61-79d846c493db" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="d7ac1e49-cdb7-4756-b683-5799ba60624c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="24483321-594b-4450-8972-6d1da5beaf99" data-file-name="components/AudioManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(audio)} disabled={editingAudio !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="27539900-c04f-4917-9213-7332b8afaa5a" data-file-name="components/AudioManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="d14ba9e1-d0d8-4739-860a-fc04b96a6a33" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="170baeb5-dc4e-41ed-bd09-3077bda9bdb6" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="b163a388-e8be-49e6-90f0-4368fbe81cfd" data-file-name="components/AudioManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAudio(audio.id)} disabled={editingAudio !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="a2d55943-94f8-4a55-b0b7-078c5d2d4b9b" data-file-name="components/AudioManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ef84d0bd-feaa-4273-aa5a-660665675d49" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="5e8a49b5-eaf4-475d-9299-e5e0a985e80a" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="17c30376-3c5b-4653-9480-67a8bb770b5f" data-file-name="components/AudioManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="e06cefba-f8f2-4418-b5d1-ad1c4573d41e" data-file-name="components/AudioManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="94b79ed3-4255-46b5-bf52-e3607f36737a" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="fdf14ecd-3eaf-4fb8-bd0c-78baabec4ffa" data-file-name="components/AudioManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="67888c96-73f5-42a0-a3e0-9a5dea6b7f01" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="85747128-dac2-49a8-9a88-2a0e9f5610af" data-file-name="components/AudioManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="1a44bc8a-9563-4dd9-93f2-32b43ccd6113" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="41b609f1-4e49-409c-8cfd-ad0ce2ddaf73" data-file-name="components/AudioManager.tsx">
                    <span data-unique-id="2c1a2865-adf2-4063-8078-e45132b5b810" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="2a8ab2df-d1b9-463a-810e-0f90651a182d" data-file-name="components/AudioManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}