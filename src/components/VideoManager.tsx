'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, ExternalLink, Youtube, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
interface Category {
  id: number;
  name: string;
}
interface Video {
  id: number;
  title: string;
  videoUrl: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}
export default function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingVideo, setEditingVideo] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    videoUrl: ""
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Filtering state
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

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
    fetchVideos();
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
  const fetchVideos = async (title?: string, categoryId?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/videos";
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
        throw new Error("Gagal mengambil data video");
      }
      const data = await response.json();
      setVideos(data.videos || []);
      setTotalItems(data.total || data.videos?.length || 0);
    } catch (err) {
      setError("Error memuat data video. Silakan coba lagi nanti.");
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
  const validateYoutubeUrl = (url: string) => {
    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;
    return youtubeRegex.test(url);
  };
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchVideos(searchTitle || undefined, searchCategory || undefined);
  };
  const resetSearch = () => {
    setSearchTitle("");
    setSearchCategory("");
    setCurrentPage(1);
    fetchVideos();
  };
  const startEditing = (video: Video) => {
    setEditingVideo(video.id);
    setFormData({
      title: video.title,
      categoryId: video.categoryId.toString(),
      videoUrl: video.videoUrl
    });
  };
  const cancelEditing = () => {
    setEditingVideo(null);
    setIsCreating(false);
    setFormData({
      title: "",
      categoryId: "",
      videoUrl: ""
    });
  };
  const createVideo = async () => {
    if (!formData.title || !formData.categoryId || !formData.videoUrl) {
      setStatusMessage({
        type: 'error',
        message: 'Semua field harus diisi'
      });
      return;
    }

    // Validate YouTube URL
    if (!validateYoutubeUrl(formData.videoUrl)) {
      setStatusMessage({
        type: 'error',
        message: 'URL video tidak valid. Masukkan URL YouTube yang benar'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.title,
          videoUrl: formData.videoUrl,
          categoryId: formData.categoryId
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create video");
      }
      const newVideo = await response.json();
      setVideos(prev => [newVideo, ...prev]);
      cancelEditing();
      setStatusMessage({
        type: 'success',
        message: 'Video berhasil ditambahkan'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);

      // Refresh the list to include the new video with proper pagination
      fetchVideos(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error creating video:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menambahkan video"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateVideo = async (id: number) => {
    if (!formData.title || !formData.categoryId || !formData.videoUrl) {
      setStatusMessage({
        type: 'error',
        message: 'Semua field harus diisi'
      });
      return;
    }

    // Validate YouTube URL
    if (!validateYoutubeUrl(formData.videoUrl)) {
      setStatusMessage({
        type: 'error',
        message: 'URL video tidak valid. Masukkan URL YouTube yang benar'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/videos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          videoUrl: formData.videoUrl,
          categoryId: formData.categoryId
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update video");
      }
      const updatedVideo = await response.json();
      setVideos(prev => prev.map(video => video.id === id ? updatedVideo : video));
      setEditingVideo(null);
      setStatusMessage({
        type: 'success',
        message: 'Video berhasil diperbarui'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating video:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal memperbarui video"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteVideo = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus video ini?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/videos?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete video");
      }
      setVideos(prev => prev.filter(video => video.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'Video berhasil dihapus'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);

      // Refresh the list to update pagination
      fetchVideos(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error deleting video:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menghapus video"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  return <div className="space-y-6" data-unique-id="183fdf2d-17f4-49f0-b8e1-4d0c69f1800f" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="84666c30-9188-4762-81ad-ca4b76de5cd9" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="f5c66119-b1bf-40e8-aae0-03403a376df6" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="9774c7f5-91c6-4814-ab8f-a10c5c173d96" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="78f5e79c-de27-4e60-bba1-d6bbb7d2441e" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="255cdc6d-ae56-498f-9764-9a9931d91072" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1503a355-fb46-4983-9c4c-582c59e491be" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="7f904504-2852-4f00-9836-47467e6bb842" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="7d292df5-4114-4126-9917-ede14689749b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="fec772d1-a967-4c0c-b03b-1cd6a3e62282" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="f90a3447-bd72-4784-813a-8f46a1e2563c" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="8c07e04b-1c34-4a70-b677-1726f8709084" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4d94e6b5-a64a-45c2-85a6-ce545299aeb9" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="37c50553-3776-4ff6-a4f1-7843c944fc91" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="7fba9e97-18fa-4083-af06-c6a742384e08" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="3d84a14c-7150-4c7e-baa4-65a77c896d1b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="631248ba-14c2-485c-bfe4-7e1b0aaf9b99" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2d5acb14-c035-4897-b9c5-8bb179b42b36" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="722250e6-103f-472c-8337-98be0d491dbb" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="56eb450c-ee09-4f88-8079-a96fdb2e3dc5" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="6e1745d9-8339-4575-a3e5-88c9927da451" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="9de8dbb6-9511-433c-9b21-94511f240fe4" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="8eafa9f6-ecca-4469-b7a5-7c5a767f874c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f70d8ec2-83f6-4d55-8ee1-b44c7749b455" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="8f4ff90c-0612-4bc3-a82b-c223f1d677d9" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="0e88d61d-83d8-418b-97ed-9fa8c4b967a9" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="785860ab-c5db-40a0-bb62-5fe97e7c907a" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="e0e1e0b2-dc55-487e-af56-583af53d0032" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="52b523a8-abed-42bb-9aba-10a57eb7d4f1" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="78db102b-837d-411f-8725-cae91fd8c66f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="624db84c-6cc0-4d01-92cd-83aeadc93701" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="053f7661-9f1f-42a8-9255-a4aa02b68c75" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="032e9e8f-af6e-4471-82e6-e2a0caa96a92" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="4c744f92-b25f-4a46-80e4-bc67f1471f46" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="f6453bb4-3bc9-4713-910e-a55a791b371a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="72e2c439-564e-4eec-9fdb-0d00c67b41ae" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="845e0c48-7bf6-4af5-b2f4-34bdf9eb7792" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="15468740-2cbf-41c6-b307-f037f91b425b" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="ab3ee3fb-bbbf-4f5b-8894-ec783777274c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2a95f798-3f5c-4594-965d-ae06dbb45fd8" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="571069c9-09a2-4c33-8451-8a86d16f9b13" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="f164bf19-6352-418f-a094-a96b32f740da" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="dbcd74c3-bc6e-48c7-8138-f0717b980612" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="843c55a3-9d02-424c-a7f7-0686b37e6bbc" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d39fd51a-2c65-4337-883c-12ef62e09503" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="589fb312-64ed-483b-a4e6-c794ef3238d4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="026f3ed8-4575-4955-bd42-e7ad0cccd2ab" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="fcacbe6d-de17-4484-9403-2403290dd136" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="89e629b6-6bbe-4707-afcd-244958aadc06" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="a44260be-edc2-465f-ab77-44277e7eb542" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="7b0ab1c0-8164-418f-9451-00cf164e1766" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="6db9aa33-d41c-4c5a-873e-3a070882f17c" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="52729bf0-3b7c-480e-9c9d-68ff339d1b90" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f05bc17d-e9a6-441e-948d-d43b4f1259be" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="e6f75ecc-b146-4d73-a9bc-cf1c4e896897" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="f5988d75-2d38-4ad0-b810-3581328db4b7" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="8de4144e-b8d3-41f6-a6b0-c1b8c49362bf" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6e8c3d29-e642-4bc8-9bb0-ae6f78b3c0ac" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="46deb322-c81f-4bea-9328-c422069c1a30" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="af4f709c-cd3a-4821-96ab-c58cf4742225" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="da360130-89ac-40fd-963f-91eda31b5823" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="b2fc9639-0d75-4144-8bb1-ac9bbbb2d8ec" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="bab5d04b-6292-483d-aad5-05195554de83" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="69f8bf3e-65c1-4a29-9a9c-ca7ab9535867" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="c8344dc5-84e0-4caf-af75-4222b39a085d" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="63892886-9507-43a4-adfc-4848be2c8404" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="95822a08-19bd-4ae1-ac5f-b2c22e6797fd" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="48cbc3c4-4968-44f2-b6b7-c979f67eb669" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="5fbde6f8-8563-4e3a-b656-7338e3660eda" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="2a0a8d93-ac75-4c29-8349-12020071fafa" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="88f8a5f8-5f67-4a01-92fc-8277117f0343" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d98c866b-07ce-4037-88a4-91713445538e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="c3b0f7f5-de7d-4cdf-a05b-d274cd6a6c74" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d7bebdfe-658c-49f6-90a2-d508771adec1" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="19870ca0-40ac-424e-9c86-a43936e10d7a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="9834e4e0-9ddc-46c5-8e5c-ca5a3f111f88" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="1851d088-1cba-46f5-97ff-f0147546c8ee" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="7a741ec1-ecf9-4539-9b19-d31067aaf398" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="53fd7da9-1326-476e-b496-3e5755d0a703" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="53ce589d-0c52-4df5-ba9a-f7a477d21f4e" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="0299da4c-6bd4-446c-a130-9eaa3b7b8dcd" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="12482ef2-711f-4311-8f1a-0b54faa6085c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="9b448c0e-d3af-4ea8-b17b-417f1d1fd6ba" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="835ca0f8-9b6f-41f9-a542-558aad3f6cad" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="bc60cfb7-df3b-493e-b713-2e195c2e50d7" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="48032688-2e3f-461b-8272-ee3545089732" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="25c5cdb5-59f4-4cf8-9cb9-a6818451d598" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="326ef50c-f646-470e-ac15-5beca4641146" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0aed02bd-1e4e-4f9a-9220-d8c7e641577d" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="ce0c9f54-e4aa-46d2-bf34-4d8cbfacd089" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="c6c2f6e8-659e-44b5-85de-bc1e03bcffcc" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="1880ae47-b45d-4359-aa78-f43dd3f3a5ec" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7d279380-a26b-41dc-b404-08d0ab210a0d" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="cbd341bf-a252-4c6f-99d7-2818be2e4d36" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1f1ad419-3c1f-49f1-a062-21ca3256a08a" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="f20b57f4-220b-4c29-bd22-4c42a72c052e" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="0aa34892-b038-40c5-890d-1a19cb059823" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="af964c81-ee9d-452e-92b6-64834ea3f5d1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="337eefc2-a47f-4f66-a96d-b553e9ba15ee" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4ef7bbb5-05c1-4c3d-9fd2-183a8e85c3a6" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="ef5368c0-b7fc-4f6e-bcc9-18982be06a68" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="469e11ee-4291-4312-9000-6618cd3f747e" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="622bb6de-e525-41e3-90bb-e20db7b6b0d9" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a2be4cce-660a-470a-8de1-e3aaa42af329" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="98d17c1c-311a-426c-aac1-9fa89a9c35c7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ec08cfcf-739f-40ac-9d7b-ecd925f30351" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="9b09f2b3-3fd6-4942-b9a5-678b0366b886" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="7ae15e8f-90bf-4881-9118-990f1e4f3643" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="f635f7ca-04e6-49ee-832c-17335981d882" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="4baf027a-494d-40e5-8246-a5e1f8b75952" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="2b12496d-5db0-4c75-a19a-1d60d65835c9" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="47a34f2b-4592-4815-ac8f-2dc9b4e77bd9" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="9f3cbd78-2fe9-4e4c-a098-490c93428a2a" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="15b33301-5864-4ee1-b92d-b7506320796d" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="d41abb9a-d783-46b6-9cdd-36850c811590" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="02fd1bae-ab40-4cdc-98d3-40c21ad2cc3f" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="e399e6b1-d8a1-42dd-a0fa-61d6a87e8cc0" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="5edf3e3c-1ee2-4080-85fa-bbbfdf45c41d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="45a6e17d-254c-42c0-a077-2baa019bf2d1" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="4d48bc6a-5073-4f1c-abae-e87c11976d38" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="05f07c5d-5c12-483b-92c2-3c17c203506e" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="696fe184-9ff6-422e-946f-5d54f4cfe334" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="b7fcaed8-089f-42b4-bdd1-2d09ed4b3038" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="0ea91727-3f09-402f-bd58-da40658c6768" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="95dd3605-d1bf-4de0-9ee0-3abcd99807f5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="a8e8a370-b378-4322-982d-7f4598a73733" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="84cb0cde-3af0-4338-be9d-cf4359a4731e" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="ef5cc05e-aca8-49f6-9d86-d29c5271e820" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="8c5903e2-a611-48d0-86ba-ba2d890a122d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="9794eb4a-2adc-4e3d-9e67-558646469b44" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0862eee2-02b1-4396-951e-958b7dce80e3" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="506a2af2-82a8-4543-b8e9-96c93d77b675" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="9e3a35f3-7aeb-4cdb-ae6a-d587d1751770" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="41374d27-22ed-41dd-a51e-96fd0e30473c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3c42710b-dbbd-405e-a8aa-d2b346caec0d" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="a4dc6b4c-99bc-4490-896b-6a517632fc95" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="d486f829-acdd-4f3e-8b33-c1e47c8aaaf9" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="6c46e9f2-8875-4df5-b47f-c9a536ffa96b" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="dd9bab12-658f-4ae2-bb4a-a05a52c9c577" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ce1c1c28-ae60-4878-ad86-47291dab1c27" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="01b4c46e-5283-4f26-a8eb-886af135dcd4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="b128c632-0ec8-4d55-b988-801fe086f6b5" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="fef95fb2-32dc-488e-a8e6-c48930c83fd6" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e1b0cc86-c507-4c0f-9f24-83f2883833fe" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}