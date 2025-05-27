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
  return <div className="space-y-6" data-unique-id="affe7a60-876f-4ed8-a8d4-20d3258467d9" data-file-name="components/AudioManager.tsx">
      <Card data-unique-id="c45af1b2-d813-4a7b-b89f-56059ac79a5e" data-file-name="components/AudioManager.tsx">
        <CardHeader data-unique-id="bc8191c2-d47e-4fc4-9008-b8890d5b9c21" data-file-name="components/AudioManager.tsx">
          <CardTitle data-unique-id="f3f52d3c-7075-4130-b340-15308e440971" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="b5cd5fd7-f61c-4438-9af1-f12668895457" data-file-name="components/AudioManager.tsx">Manajemen Audio</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9cc1e52d-ce20-4b97-8f25-1739caac5c91" data-file-name="components/AudioManager.tsx">
            Upload dan kelola file audio untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="da25a6d9-2b73-4abf-995c-ddb3b050cbd5" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
          {/* Audio Recovery Tool */}
          <AudioRecoveryTool />
          
          {/* Form for creating/editing audio files */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="376c3e11-0ec8-457b-a09a-a6190fd29bfa" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="becd8c2c-4480-415c-ba0a-2e9504d1b036" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload Audio Baru" : "Upload Audio"}
            </h3>
            <div className="space-y-4" data-unique-id="82460d00-a119-443e-8a51-1914b442c2f4" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="0396a543-05a6-465c-9ead-0dbdde296d14" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="a2fb44c3-5e51-4e00-9329-80aa53ce6674" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="d010067c-6ee8-49d7-be93-617526824451" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul audio" className="w-full" data-unique-id="0803cbce-7553-4e34-a0a3-9b6131138dbd" data-file-name="components/AudioManager.tsx" />
              </div>
              
              <div data-unique-id="a558353c-ad7a-44e4-a5a5-2991c3fab5f9" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="6eea67e5-58cf-4009-a2b7-1e4631485516" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="9413a57d-66b3-4b2c-9377-8469385590ef" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8af7f02a-6055-4eb2-a2e2-257e30f71e4f" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="ba6c07e9-eb0b-4695-987d-5636cf7cfa06" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="9cbd6cdc-49ce-453b-8904-c3f710586457" data-file-name="components/AudioManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="966f7017-ee25-477b-88c8-48c2e1b4e889" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="2997a130-1604-4d45-b009-f31615fc0e4b" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="audioFile" className="block text-sm font-medium mb-1" data-unique-id="46d4ca92-fb68-42e7-8db0-0a8597ee7fd8" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="17148750-eb5f-4995-83ae-e9bc116cef56" data-file-name="components/AudioManager.tsx">File Audio</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="4910561a-ce1d-42be-9efc-0cecb03e80e3" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()} className="flex items-center" data-unique-id="d9de646e-d187-4d82-a81a-5abe5a7fa84d" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-2" />
                    {formData.audioFile ? 'Ganti Audio' : 'Pilih Audio'}
                  </Button>
                  {formData.audioFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="550132e7-99a9-4d00-895f-da5361dc2d41" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {formData.audioFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="ac88e878-b425-49d9-bdbd-ac0447c9bb81" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4bb93840-a016-4073-a24b-1b9257601646" data-file-name="components/AudioManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.audioFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="1c0ffdca-883a-4c84-ba26-5cee7b988a41" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="5449f3fd-105b-4abb-9b4f-200fdceb8fc8" data-file-name="components/AudioManager.tsx">
                      File audio sudah ada
                    </span></span>}
                </div>
                <input ref={audioInputRef} id="audioFile" name="audioFile" type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} className="hidden" data-unique-id="5c599b55-d9b6-4122-8da8-7d62290120ec" data-file-name="components/AudioManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="7d9835a2-284a-4417-8c3a-b30e23c36584" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="91748282-208a-4507-b5d9-bc777a13f948" data-file-name="components/AudioManager.tsx">
                  Format file: MP3
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="56cc6778-ff2f-4b75-b2ce-ba54ba0b156d" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {editingAudio !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="041bb989-01e9-4ae1-8254-cdfba5836002" data-file-name="components/AudioManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="2f2014e8-fc4b-45bd-8a4e-11554e747540" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8928c4e5-11e4-45b2-ac95-b8b191e11f88" data-file-name="components/AudioManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAudio !== null ? () => updateAudio(editingAudio) : createAudio} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="0181cd8d-65ef-49e4-916e-b14647b18f48" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center space-x-2" data-unique-id="7df47bf7-3858-44fa-9ce6-baa7f67a2380" data-file-name="components/AudioManager.tsx">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="c1aa92a3-ffdf-46bf-96bd-49cd86eace19" data-file-name="components/AudioManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="8fc1e372-6600-436f-9740-40f965d09448" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c5fd5c59-3f80-4139-8bf6-cd6e6dcf5c27" data-file-name="components/AudioManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="3568160f-f3e0-401b-99f8-016834acf878" data-file-name="components/AudioManager.tsx">%</span></span>
                    </span> : <>
                      {editingAudio !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="b297ca39-7b20-4b09-b942-92b0126feb86" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8314cba6-a99f-4cfc-94ac-04b470024afe" data-file-name="components/AudioManager.tsx">Perbarui Audio</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="9a15cf30-4181-4558-88f6-61a0e8710ddc" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="56791313-35ed-4e91-b31e-229897fdca73" data-file-name="components/AudioManager.tsx">Upload Audio</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="cebd6ead-1aa6-4eb5-8089-26432850b142" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="8c86445f-2ba8-46e9-a54c-cb34ae086262" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="4f1975fa-d5c3-4a75-9a53-72afd13b2677" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for audio uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="fe9510d9-92a4-4e3d-bb5e-d67dff41c821" data-file-name="components/AudioManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="cbdf65e4-27ad-4118-91fe-b049df20e58e" data-file-name="components/AudioManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="d7bc21d8-d81f-409e-ad9a-109aed4ea0bc" data-file-name="components/AudioManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="b251f100-caf8-409c-9f76-4266c8b579f5" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="d5f36544-8b2f-4f02-be9e-2bcbd55b3ba3" data-file-name="components/AudioManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="e2ad91bf-5c6e-4ea6-8f9f-4b7335904c01" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="8e6a3851-d5a6-44c7-b594-e14cf7932f2c" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="1c1561f3-4262-4b2f-9d26-10c1a7c2ad34" data-file-name="components/AudioManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="925be9f6-5026-40b3-83e2-a1763dfff498" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="aefb5b87-4294-4580-81b9-0f7dcda57677" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="5e165c49-f147-479c-880d-cf651bea02ec" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="932c169a-f96c-4ce8-8fe9-54cb8320b0ca" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="7a98689b-7f75-4d77-90c7-555a19dcaa93" data-file-name="components/AudioManager.tsx" />
              </div>
              <div data-unique-id="d5e0dcdd-27cb-4838-a32a-de6bf4b0db39" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="9f6d20dd-4114-430e-9540-74d2cfc3b95d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="bb0ddfb5-977e-4afd-bd7e-625ee67358d2" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="102d066e-4b45-4ff0-b23f-eb2b2dc9b408" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="24446965-a76a-48bb-b134-743f9d5c4396" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8e258916-aa8e-4db0-867c-6e84bfb0a2b4" data-file-name="components/AudioManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="e0920a8e-c3a3-4c76-8a9b-e02f1bd44c64" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="57aaf7e9-800a-4fc6-8a3f-c86194cdc60a" data-file-name="components/AudioManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="927a5cc6-d88c-46c5-9313-6483050cab56" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4541b308-9d06-498d-b935-81d87d70d754" data-file-name="components/AudioManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="9c5400df-063f-4d1a-aa5f-31165be70bd5" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="3395ff4e-30ed-4789-933c-6c22eeae44d4" data-file-name="components/AudioManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="5f4833d1-a42b-409c-9f30-7e09e0adaf39" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="6b6f0339-8b81-429a-9782-910b0fa147bf" data-file-name="components/AudioManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="ba4c0a37-cfec-4609-bf2c-c5ffdcd2e9f2" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="42f5c34c-6acc-4b81-b8d3-c122512600ee" data-file-name="components/AudioManager.tsx">
                Daftar Audio 
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="6e0b05ab-2ab5-4b47-9e29-077ccd699d9e" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0846503d-d007-4409-91dd-26caa678ed13" data-file-name="components/AudioManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="e0da537d-c7d9-4c82-a56f-f0b40bdedd1d" data-file-name="components/AudioManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="a7f08425-6058-4906-874d-236242e863f4" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="471f5430-3134-46ac-8a9d-a1989132c324" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="e1610569-eb06-4749-a974-28e15553fd8d" data-file-name="components/AudioManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5bfd7d0c-4076-47ce-8ab3-21b827c9a07f" data-file-name="components/AudioManager.tsx">
                  <option value={10} data-unique-id="1f2a8561-00c9-4d5b-9f25-13727b605d36" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="56be3d17-b9a9-498b-82db-eb2d79572889" data-file-name="components/AudioManager.tsx">10</span></option>
                  <option value={50} data-unique-id="fdbc789c-a902-4aa3-8b5d-d033ea0012c8" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ceef069d-094c-40c7-b473-53c2e9972fbb" data-file-name="components/AudioManager.tsx">50</span></option>
                  <option value={100} data-unique-id="7fee955c-9e32-4a3a-af29-1e6c657c8b00" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="874d39f4-79f4-46dd-b88d-526759250721" data-file-name="components/AudioManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="1bbf6b3c-47dc-4deb-9790-8169c7b71e29" data-file-name="components/AudioManager.tsx">
              <Table data-unique-id="275a9eec-dcd3-4f50-a62f-09b4f33526cc" data-file-name="components/AudioManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="7ae78f8b-fd50-482c-9a53-8f6e4de5204a" data-file-name="components/AudioManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="395a34bd-83b6-4330-b2cc-47c9f983ed64" data-file-name="components/AudioManager.tsx">Judul Audio</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="7f9afc38-0a9f-40cb-aec4-6bb3b75eab8a" data-file-name="components/AudioManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="3b001a84-c033-4f6c-b475-4dc4b5d28133" data-file-name="components/AudioManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="e124db83-07f2-44fa-b51a-ba4b8c340e7c" data-file-name="components/AudioManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="37057807-1bc2-43b1-87b8-c401cfe9a971" data-file-name="components/AudioManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b8711ba7-1a43-4bc5-b6f2-27bc5289ce3c" data-file-name="components/AudioManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="2afe7ef0-1f61-45d3-809c-46f7dd09f876" data-file-name="components/AudioManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : !audios || audios.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="ac57626c-1e7b-4427-afba-b9c44ecf8fd5" data-file-name="components/AudioManager.tsx">
                        Belum ada audio. Silakan tambahkan audio baru.
                      </span></TableCell>
                    </TableRow> : audios.map((audio, index) => <TableRow key={audio.id} data-unique-id="e709202c-e317-460c-abd7-6f80868e8336" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="032126a3-8c4e-43d6-8828-41cff11b833c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="9dcc0247-a7ba-4daf-9f9b-94e994fefdae" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.title}</TableCell>
                        <TableCell data-unique-id="7c7009f6-54ec-4a0a-87a7-4ff3269e8994" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-is-mapped="true" data-unique-id="b45c0714-cbc8-4dd8-bc15-a19e72620c68" data-file-name="components/AudioManager.tsx">
                            <source src={audio.fileUrl} type="audio/mpeg" data-is-mapped="true" data-unique-id="0a0bdf6f-2512-4364-b37a-0699405fd36f" data-file-name="components/AudioManager.tsx" /><span className="editable-text" data-unique-id="ab342353-1646-4f83-893c-1a147ae1470e" data-file-name="components/AudioManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="644be58c-43e5-4b9f-82bc-20d2bcd0375c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="7de3ebb4-adbe-4312-9590-fe61c76ddadd" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                            {audio.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="a552a6fc-b03c-49da-bb23-e7a9ec9fcf62" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="06a7aa00-c298-4ad6-880d-f836779641f6" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="cd8201e8-e1f4-46e3-a7a1-a4a4d3b60f64" data-file-name="components/AudioManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(audio)} disabled={editingAudio !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="8f119097-2399-494a-a619-ad00096e09a6" data-file-name="components/AudioManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="855dcabc-fef0-48f0-917b-a1ad5724b751" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="c5df0569-5951-4eef-92ba-a1b6fb43470c" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="d8865269-f343-4bba-9027-2747afd71c78" data-file-name="components/AudioManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAudio(audio.id)} disabled={editingAudio !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="4a90ee3a-187d-4736-8d99-fccfc77b3dd6" data-file-name="components/AudioManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="32d82062-8468-459b-a0e8-b122e23e48db" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="4207282c-9949-450f-ab26-8d159d1a2e6b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="63c691a3-3581-4e27-9b1d-593cd961c580" data-file-name="components/AudioManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="8289adca-059d-4d9c-b334-3ed829e76a95" data-file-name="components/AudioManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="2a5fe298-95f0-4c5c-b438-082c2719a70b" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="9655f1b4-b8e4-4a77-9607-8161c35bf131" data-file-name="components/AudioManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="ca8814cb-8a0d-4a31-86d7-ab34558160ea" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="5d28a350-cae6-46f2-84b3-a18885e6c105" data-file-name="components/AudioManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="4e0a08c3-ada5-417e-9961-19839650ac55" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="666ee2f2-0446-4d85-870f-24f0f0a76669" data-file-name="components/AudioManager.tsx">
                    <span data-unique-id="3fd5e80d-6869-4c39-9698-2a0d0a10676f" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="5fffcecc-45a6-4851-9e41-c0a1d2cfff35" data-file-name="components/AudioManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}