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
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
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
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
    const { name, value } = e.target;
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
        
        const audioUpload = await uploadToStorage(
          formData.audioFile, 
          'audio-mp3',
          (progress) => {
            setUploadProgress(progress);
            setStatusMessage({
              type: 'success',
              message: `Mengupload file audio "${formData.audioFile.name}"... ${progress}%`
            });
          }
        );
        
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            fileUrl,
            categoryId: formData.categoryId
          }),
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
        
        const audioUpload = await uploadToStorage(
          formData.audioFile, 
          'audio-mp3',
          (progress) => {
            setUploadProgress(progress);
            setStatusMessage({
              type: 'success',
              message: `Mengupload file audio baru "${audioFileName}"... ${progress}%`
            });
          }
        );
        
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          fileUrl,
          categoryId: formData.categoryId
        }),
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
        method: "DELETE",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Audio</CardTitle>
          <CardDescription>
            Upload dan kelola file audio untuk pengguna
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Recovery Tool */}
          <AudioRecoveryTool />
          
          {/* Form for creating/editing audio files */}
          <div className="bg-muted p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium mb-4">
              {isCreating ? "Upload Audio Baru" : "Upload Audio"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium mb-1">Judul Audio</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul audio"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1">Kategori</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="audioFile" className="block text-sm font-medium mb-1">File Audio</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                    className="flex items-center"
                  >
                    <Music className="h-4 w-4 mr-2" />
                    {formData.audioFile ? 'Ganti Audio' : 'Pilih Audio'}
                  </Button>
                  {formData.audioFile && (
                    <span className="text-sm text-muted-foreground font-medium">
                      {formData.audioFile.name}
                      <span className="text-xs ml-1 text-green-600">(Akan diupload dengan nama unik)</span>
                    </span>
                  )}
                  {!formData.audioFile && formData.fileUrl && (
                    <span className="text-sm text-muted-foreground">
                      File audio sudah ada
                    </span>
                  )}
                </div>
                <input
                  ref={audioInputRef}
                  id="audioFile"
                  name="audioFile"
                  type="file"
                  accept="audio/mp3,audio/mpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format file: MP3
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                {editingAudio !== null && (
                  <Button 
                    variant="outline" 
                    onClick={cancelEditing}
                    disabled={isUploading}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Batal</span>
                  </Button>
                )}
                <Button 
                  onClick={editingAudio !== null ? () => updateAudio(editingAudio) : createAudio}
                  disabled={isUploading || (!formData.title || !formData.categoryId)}
                  className="flex items-center gap-1"
                >
                  {isUploading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Mengupload... {uploadProgress}%</span>
                    </span>
                  ) : (
                    <>
                      {editingAudio !== null ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline">Perbarui Audio</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span className="hidden sm:inline">Upload Audio</span>
                        </>
                      )}
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
            } p-3 rounded-md`}>
              <div className="flex items-center">
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <span>{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for audio uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-right mt-1">{uploadProgress}% selesai</div>
                </div>
              )}
            </div>
          )}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Filter Pencarian</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1">Judul Audio</Label>
                <Input
                  id="searchTitle"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Cari berdasarkan judul"
                />
              </div>
              <div>
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1">Kategori</Label>
                <select
                  id="searchCategory"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  Cari
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Daftar Audio 
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({totalItems} file)
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="itemsPerPage" className="text-sm">Tampilkan:</Label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Judul Audio</TableHead>
                    <TableHead>Audio</TableHead>
                    <TableHead className="hidden md:table-cell">URL File</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : !audios || audios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Belum ada audio. Silakan tambahkan audio baru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    audios.map((audio, index) => (
                      <TableRow key={audio.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{audio.title}</TableCell>
                        <TableCell>
                          <audio controls className="w-full max-w-[200px]">
                            <source src={audio.fileUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="max-w-[200px] truncate">
                            {audio.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell>{audio.categoryName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditing(audio)}
                              disabled={editingAudio !== null}
                              className="flex items-center"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteAudio(audio.id)}
                              disabled={editingAudio !== null || isLoading}
                              className="text-red-500 hover:text-red-700 flex items-center"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  
                  {pageNumbers.map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
