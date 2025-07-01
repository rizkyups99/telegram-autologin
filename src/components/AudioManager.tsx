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
  return <div className="space-y-6" data-unique-id="fce0c307-2f1f-405a-a184-c77145309fa2" data-file-name="components/AudioManager.tsx">
      <Card data-unique-id="19aee9af-ca3e-421f-9139-2400adb0ad81" data-file-name="components/AudioManager.tsx">
        <CardHeader data-unique-id="a31e5a07-6576-48af-93b1-e9460da63f51" data-file-name="components/AudioManager.tsx">
          <CardTitle data-unique-id="640c8ab9-802e-4140-a028-25bf841a32fc" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4760186e-6b97-4236-864d-b95481228054" data-file-name="components/AudioManager.tsx">Manajemen Audio</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="8946a50c-3724-4ea2-9beb-0948ce3794c1" data-file-name="components/AudioManager.tsx">
            Upload dan kelola file audio untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="e7e7f2f7-af53-44d2-a4d3-150bdbe9cae5" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
          {/* Audio Recovery Tool */}
          <AudioRecoveryTool />
          
          {/* Form for creating/editing audio files */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="bbcb70b9-dd55-4348-8c95-eea23929a4bf" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="333cc14e-cebd-4e9b-a7c9-766f3a127a55" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              {isCreating ? "Upload Audio Baru" : "Upload Audio"}
            </h3>
            <div className="space-y-4" data-unique-id="5ca8bcf1-812a-478a-aca5-b0ee3bdf6121" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="091c63d3-48f2-4a08-832f-c73889a9250e" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="ed078a48-4db0-4b7a-b5dc-7d66aff9e85b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="8abce074-f774-4dcc-9a76-f29037fe9050" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul audio" className="w-full" data-unique-id="15b34e38-52e9-41c1-9201-755fa3530fd3" data-file-name="components/AudioManager.tsx" />
              </div>
              
              <div data-unique-id="d5dadc0d-27a0-49eb-b574-44bb2eaf6146" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="eb2235a9-5c1c-4e16-bffa-e8bb3a071f84" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="c919021f-5f73-4f04-b456-82e10ff12ca7" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="843645f1-519c-438b-ac3f-231ce499928c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="750d8f7b-9847-4bed-9ef1-dfc36b56ca20" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="1d7e8dd2-62dc-4498-ae5c-6b3cd2476c99" data-file-name="components/AudioManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="4223ca23-0550-4d29-8361-b5334ccb11d5" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="69edddaa-e85f-4c16-a5f1-98b57893951f" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="audioFile" className="block text-sm font-medium mb-1" data-unique-id="6679dc8c-e060-4cf9-acef-bf05e1e283d7" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="a641c0e1-62dd-41ee-80c0-b4ebf45560a6" data-file-name="components/AudioManager.tsx">File Audio</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="7daffa15-d456-414a-a7c8-25ee7ef0ea38" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()} className="flex items-center" data-unique-id="1ba7e191-b60a-4dd4-86ef-fbba0c2458e0" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-2" />
                    {formData.audioFile ? 'Ganti Audio' : 'Pilih Audio'}
                  </Button>
                  {formData.audioFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="b5d6f2b8-d212-4b49-9012-032b4b29e0a0" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {formData.audioFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="02a23100-e9cc-43b7-9e5a-c6302871edd8" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="d15cfa57-cd5c-4e39-9d67-1bf5bba114e7" data-file-name="components/AudioManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.audioFile && formData.fileUrl && <span className="text-sm text-muted-foreground" data-unique-id="b49af230-d585-4d11-b58f-7f811c0364a0" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="244d0c7f-d0a6-4918-b50c-2953e9dd4910" data-file-name="components/AudioManager.tsx">
                      File audio sudah ada
                    </span></span>}
                </div>
                <input ref={audioInputRef} id="audioFile" name="audioFile" type="file" accept="audio/mp3,audio/mpeg" onChange={handleFileChange} className="hidden" data-unique-id="1a8830dc-1d29-4743-9365-125f24260ca4" data-file-name="components/AudioManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="0b40cb34-6398-4c3e-ad13-a1318b62058b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="c652a3ae-080a-40b5-8095-2cd750aacece" data-file-name="components/AudioManager.tsx">
                  Format file: MP3
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="67bf8766-fadd-456e-aa9d-0cc1416b6ad0" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {editingAudio !== null && <Button variant="outline" onClick={cancelEditing} disabled={isUploading} className="flex items-center gap-1" data-unique-id="9bd8fb99-2b4f-4b84-a252-18ce7317aeb5" data-file-name="components/AudioManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="73eea868-ba57-4e7b-b130-6bff75ae0502" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="05a2f720-3743-41e1-ba36-d98e874d598c" data-file-name="components/AudioManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAudio !== null ? () => updateAudio(editingAudio) : createAudio} disabled={isUploading || !formData.title || !formData.categoryId} className="flex items-center gap-1" data-unique-id="0e0b9099-200e-49e7-a57a-b83a1547d1a3" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  {isUploading ? <span className="flex items-center space-x-2" data-unique-id="e4dc5fb9-7f94-4d78-8fc5-77a6a364884b" data-file-name="components/AudioManager.tsx">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="2f0d147d-ba0a-4277-b6d7-c8f0553a9ffa" data-file-name="components/AudioManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="859612e3-4609-42c9-844e-731ecb382f00" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="90af7b5b-74ce-40fb-b713-5ab6964de395" data-file-name="components/AudioManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="15b0eecb-9451-4370-8ee2-14c930d35ac9" data-file-name="components/AudioManager.tsx">%</span></span>
                    </span> : <>
                      {editingAudio !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="3a65176e-b927-4426-898d-bf67b3480c39" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4d6ca65f-bc7d-40fc-8cff-647309a29988" data-file-name="components/AudioManager.tsx">Perbarui Audio</span></span>
                        </> : <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="bdb028de-fa8d-48ae-9062-07764a7a1c0b" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="82bb5f1d-45e5-40e2-a626-a838f0601385" data-file-name="components/AudioManager.tsx">Upload Audio</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="70f0c143-d887-4b15-b804-5246899cca40" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="48854f31-6ef0-48b7-9baa-97a3b41c4c63" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="4e58fefd-9991-4301-8ff3-472ff9a8533e" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for audio uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="c2cbbd67-308d-43df-a0ce-aa8f1e0df550" data-file-name="components/AudioManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="7291591a-ff86-45dc-b629-c4b098971fdb" data-file-name="components/AudioManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="b1256d0c-d3fb-4e90-9eb5-f7c4447e0696" data-file-name="components/AudioManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="e6d47f51-e671-40ea-9a66-89b6d6604579" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="2edc0b74-d994-4bb9-a359-30adcc21a72a" data-file-name="components/AudioManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="fcc96277-63c5-46b0-a81e-737e849a4603" data-file-name="components/AudioManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1ce0095b-e034-4b66-8920-0d6a0e8719bf" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="a8814000-a02e-4945-8208-eb6f3581e1ab" data-file-name="components/AudioManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="08e4429d-e4b3-43fa-99b3-a9b5fdfa36e9" data-file-name="components/AudioManager.tsx">
              <div data-unique-id="c99d5721-d78a-4bff-b247-501544153afb" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="494001a4-1c0f-42c2-bc93-a5c60dfad05d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="27c91206-7706-413a-89fa-5a279db17256" data-file-name="components/AudioManager.tsx">Judul Audio</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="85b73c8f-7577-4c9b-8b27-f571339c460a" data-file-name="components/AudioManager.tsx" />
              </div>
              <div data-unique-id="db5a98c8-4755-4e8f-91e6-04df5941b5ca" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="f2a08166-b78b-4399-a2b2-86d2c80100bc" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="5cabe89f-0f0a-41ce-95f1-8220110411a9" data-file-name="components/AudioManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="30e389cb-ec26-4114-a6c5-7d5cf64a00cd" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="9d64ba1e-d7ba-40f6-b6e7-81aaef5604a4" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="23bf6b7d-a881-40d5-adf9-3971eac9f8b3" data-file-name="components/AudioManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="df7c988e-eaeb-400f-a401-102ff9c4943c" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="0d3dde35-97c5-4dbc-907f-36d59c0bd296" data-file-name="components/AudioManager.tsx">
                <Button onClick={handleSearch} className="flex-1" data-unique-id="613174ff-b264-4157-8628-7ad6451f9bfd" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="50565415-e9c6-427b-8608-49fab2033074" data-file-name="components/AudioManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="16cffbbe-b574-48b9-b564-49a6b2ab857a" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="e417f241-35fe-4397-b752-632c899320df" data-file-name="components/AudioManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="b9e44323-1c32-4194-b26f-0b757d16c5db" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="d94647a9-347f-458b-9158-bf8ea0e578e5" data-file-name="components/AudioManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="522f78da-866f-4d16-b5de-d147a2b5592d" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="4bccdd69-1b9a-4579-a7a5-6ae40541f036" data-file-name="components/AudioManager.tsx">
                Daftar Audio 
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="99101cd7-4285-4149-bcdf-9ab65fcfacd1" data-file-name="components/AudioManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ec739288-743f-46bb-88c2-f3e529e1fe5e" data-file-name="components/AudioManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="cc276a31-0c0d-409f-8021-3314bdb679d8" data-file-name="components/AudioManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="a8c2fbaf-7b61-4db7-8a39-78525bdc7e4f" data-file-name="components/AudioManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="c5b470a7-3537-4eec-819a-1059ff732b19" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="9cb3c6bb-8b8d-47f7-ad27-e9ae950f4d47" data-file-name="components/AudioManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="72825e27-70b9-437c-b3c6-0c559c68aba5" data-file-name="components/AudioManager.tsx">
                  <option value={10} data-unique-id="834b1209-efde-477e-8774-2d827a38e6fd" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="fc5fb190-037b-4c39-a7ae-0a3583bf2224" data-file-name="components/AudioManager.tsx">10</span></option>
                  <option value={50} data-unique-id="63255895-253e-4583-bb7a-9b14a769dacd" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="25c26009-49b4-4307-8b24-fd56a8ac76b9" data-file-name="components/AudioManager.tsx">50</span></option>
                  <option value={100} data-unique-id="d86ddc56-f6ae-4a38-a630-a94550c6dcbb" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="ac0c3b69-9833-4b4c-aeef-88efd4124542" data-file-name="components/AudioManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto" data-unique-id="74bfce11-f1de-4e4b-9693-b4d133c31d4e" data-file-name="components/AudioManager.tsx">
              <Table data-unique-id="207a64b3-64d8-4b8a-b78a-76d928a64005" data-file-name="components/AudioManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="332b25d2-23e4-4ac8-9e45-717809b9c1aa" data-file-name="components/AudioManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="19b7e3b0-8e56-445d-9a75-1be1d8762606" data-file-name="components/AudioManager.tsx">Judul Audio</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f2d9f809-846c-4a63-8e9f-88a4fb554d0a" data-file-name="components/AudioManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="426b0f9c-ac5e-406d-b8ae-5109bd35126f" data-file-name="components/AudioManager.tsx">URL File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9be3f9b9-5cd1-474a-be4e-ca50c92753a4" data-file-name="components/AudioManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="169824ee-a7de-4655-a4b9-f99d256baf99" data-file-name="components/AudioManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="c0e7082f-85c0-48b3-9d2d-4f36ce451fcb" data-file-name="components/AudioManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="cb1cf1be-ede7-4efe-854b-fb4ec363c400" data-file-name="components/AudioManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : !audios || audios.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="395ac977-5995-4a32-9882-8b772ca61e85" data-file-name="components/AudioManager.tsx">
                        Belum ada audio. Silakan tambahkan audio baru.
                      </span></TableCell>
                    </TableRow> : audios.map((audio, index) => <TableRow key={audio.id} data-unique-id="b93d9712-ffda-4cab-b5f7-1a0aa1042f88" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="ae44d353-ac0b-40c8-b0ca-9e6fa9cb99f5" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="58284f14-48d0-4b69-bcc6-f7151b99f8ce" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.title}</TableCell>
                        <TableCell data-unique-id="adb40a80-0ce6-4e82-95b3-ad33e103d033" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-is-mapped="true" data-unique-id="1d6ba649-8d9a-4d1f-b286-e99d3b2b8be4" data-file-name="components/AudioManager.tsx">
                            <source src={audio.fileUrl} type="audio/mpeg" data-is-mapped="true" data-unique-id="114a9ed4-0389-49db-b994-1586bfaeb5f0" data-file-name="components/AudioManager.tsx" /><span className="editable-text" data-unique-id="f9a828bf-6d32-4ca3-9476-91513649b2cd" data-file-name="components/AudioManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="62275bdd-d2e5-40a4-b83d-ad8edc3697bc" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="28237d62-5833-4265-8b48-2e8f9ccf836b" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                            {audio.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="3b6b3edb-0a81-421a-a9a7-5e097b1922ba" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">{audio.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="27c0cca2-309e-4996-a6fd-e66ee4672779" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="cca395b6-918c-4d0b-ba52-39764bcc295e" data-file-name="components/AudioManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(audio)} disabled={editingAudio !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="c485a8fd-7114-4e30-a1ef-5e014a0b6f27" data-file-name="components/AudioManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="bcc4bafb-c0e5-4f72-a700-63d87ffd70c8" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="15a33e34-7617-4c26-b40a-7d0546972e94" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="a8cf885d-02bb-47d3-9709-eee46df9b6bc" data-file-name="components/AudioManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAudio(audio.id)} disabled={editingAudio !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="deb5b47e-0028-4ab1-81c5-76e11f0e0b48" data-file-name="components/AudioManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="eda7fb34-ead6-4496-91c0-0475c7d9be19" data-file-name="components/AudioManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="7d88afd3-2723-4b6e-ac98-c5edb4ac4be7" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="096e5df4-641f-44c5-b91e-84bbe771c979" data-file-name="components/AudioManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="5b00c1d3-254e-4464-9bc2-1b313e7ba325" data-file-name="components/AudioManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="e0e8bb93-1db6-4b46-bfba-a9fcdb86c74d" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="79c8691a-8af5-4f94-932b-c54cb3798be6" data-file-name="components/AudioManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="2049cc9a-4836-4cd3-b8b7-f4cfb28f9ad1" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="d7542864-46e1-419d-b5b3-5df544d1187e" data-file-name="components/AudioManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="4bc525c6-f883-4205-9c86-4457cada7faa" data-file-name="components/AudioManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="5f981f38-4a4c-4f44-a208-b3994c6e9818" data-file-name="components/AudioManager.tsx">
                    <span data-unique-id="a1b2f323-18b2-44eb-b8f1-5ac8e799d070" data-file-name="components/AudioManager.tsx"><span className="editable-text" data-unique-id="89bc422a-99b9-49f2-9f22-139b1a95f979" data-file-name="components/AudioManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}