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
  return <div className="space-y-6" data-unique-id="c632424b-f60a-43e1-8655-1ad3b32fa06e" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="534a7cf2-4fe0-44a5-8546-4a8013f611eb" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="2aeeeffd-753d-4226-94d5-8c04499bf15d" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="6ab96674-783a-4430-ac1f-af65c8151654" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e0e1c29a-fdc8-4c76-9059-7239f9bdc92e" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="d92e0ad1-fb6a-45c7-891e-368dbb6229f0" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="7c61a4bf-35ba-4f79-b9b8-f481a4eb653c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="89e0a634-db48-404a-b7c1-5d0b34cfb57d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="662fbcd8-58d7-4c3d-9e90-216aa0811d6c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="1820ce42-b38c-4e79-8402-903af54ee302" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="11eafeae-184f-49d6-865d-d85fa31cf11d" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="e330489d-400b-4bdb-a4ee-899c4f21986e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0a9e4861-e273-4271-ab95-00db4ebbd08b" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="152f8f84-9b0f-4d3c-82dd-5a9a3ba32171" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="a9703abd-4d8c-4109-a438-4ca9f8d39345" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="39b807ac-7620-42a3-8d31-bc8ed7b71207" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="232f04c4-5fc8-49e4-8ef4-b4f859f34aa7" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4021acae-3639-427a-8ab5-7a68c90b682b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="543e835f-eba4-4126-b4c8-24a30da16ea5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5ae1b49d-1170-4228-936d-82198e4a00d5" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="419f2bf9-be29-4b3f-863b-6ce170d53407" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="73f187e9-83d2-4c94-bf2d-d36ce5c2ffc4" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="215defe0-4281-4379-92ee-576f72cbe0bf" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6b726524-76fd-4463-9906-875f8ae9a977" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="1b1a85d7-a9b9-4d7f-8db8-bc990e3dbd40" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="29bae8b2-40f1-4eff-8317-0531793b04b8" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2c41a98e-ed4b-408e-be2f-a1f8d106a0de" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="715fd1f2-5ada-4aa8-be45-694fd20e506a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="eba8cda6-007a-44b3-b1e8-a074ccca27dd" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="6cac4597-9fc8-42c0-ad59-d11d9b8c92a2" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="169b2c0c-b921-4294-87d4-db7be45bab83" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="0cc1defd-935b-449e-bf2f-5f951d11ab77" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="17afa37f-b5b8-4a9a-ad16-057e2eedaab9" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="6514caf2-9d87-4406-a25a-1bb262acb7e0" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="516189f4-1c7b-44a1-83c4-55393608ff8e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a7d7470c-169e-4e96-ae35-4c0843c7776b" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="bae75f3c-7de0-4cd1-a3f0-c72d4f09893f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="172202f8-e23b-41eb-993c-9be1fb15b254" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="2256e3db-efdb-44aa-8ca7-a05b05edee07" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a7e29d42-c2b6-47b0-bccf-4389e32152ef" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="35935519-ca20-48b3-b48c-0e56d8993d62" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="474f5004-8839-4a40-ae27-5bb9ef7a3d7b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="6cf5df3a-b6de-4e33-9154-2e2919fb37f1" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="e9ee889c-5c73-4a0b-86d8-ff213a8d4474" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d435dd4e-e0df-4c69-849e-ba124dae6593" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="3831174f-24a9-44c0-9291-3b0f239bed08" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="3a9b843d-cf60-46f4-9480-bc27d0b2b034" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="64b60e7c-5a60-499b-99a2-093e557ebeee" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="c84c3271-4063-47a9-b4d4-ea23ac96806b" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="a3b639b0-582f-4fe0-9791-a7b98b810da8" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="0eaa3746-de39-49e3-b705-1e47a9580af4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="9070c44e-8e1a-4b3b-a8d2-cf93382f6770" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="fc6b4345-cf4a-4924-a50f-02cf0adaf231" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0ba12033-3e69-4a65-8dc8-47d97321c3c6" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="cf8bfa34-8c90-4e50-acb9-c6e4bc0732fe" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="51cc6107-1c12-4671-87ea-f433ac5b11a7" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="2312909f-a8ec-4f71-838e-839766127298" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7f4f31ad-6366-4948-aee8-8163a71cbbb9" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="2ee67f06-cbe1-4465-8975-417f83d86d7e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="93c3c321-79a0-48a1-a028-ae548f962a1d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="b7f70a13-381e-4415-b738-59d24625ce90" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="dfc0e7c3-4769-4b39-8e67-f1588642a545" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="12246d23-a3e3-438f-aab9-3f6960cf8923" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="8996f5b9-9f9a-429f-a150-176b37e00f5a" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="9d7c0a7f-2aea-4d47-9e6d-90d097d776ae" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="86ed40fa-48f5-4da5-aa12-050a45a163a7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b9e32d43-2c83-4fc3-94e1-7f0164e3463e" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="26149edf-dbcb-41c2-9bd7-27b00ddab52e" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="ac572ad2-8158-4958-b5f0-eebd35fa6d24" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="609aafcd-c386-40d0-b449-2bd5b91cbe00" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="105d5a6f-3a3e-4e64-826b-5b5aa179776c" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f9466382-8b69-4b0c-8423-95cc03ad3f0a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="e85f1b16-13d5-4b59-ba55-827efcfd7776" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5b9b461e-7630-495e-93dd-0681b6bb5f85" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="ad558a90-9034-4885-bfaa-c59e788af645" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="4559994a-5963-4561-a262-f219030d7c4e" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="614502b7-8efe-4ea0-a018-2986ffaee741" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="e396dbb9-c07c-497d-9edb-ec3ac6c12afe" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="80f355ed-afa7-4c70-b309-48ac12028f7c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2f2c81f4-96df-4d4e-b578-9ea86d4f91fd" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="a3d68990-0a63-47da-a401-96b80a936bbe" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="08945563-244b-4010-aab2-b3105b3ad09e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a5a5a4ee-070b-4277-8c54-dc958a9446b4" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="d8584ea5-155d-4934-a7c8-089b64f734d6" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4e355c59-58ec-4c6b-994c-4ab56b357476" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="d8a6e4c0-fde9-4e33-a8af-2afc55157d17" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="15fab8bf-1118-449e-915f-94249130f0c5" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="82aeb4ce-5c7c-4684-ad92-5e76088e1bb9" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="65eac576-b617-405b-8d33-48cfd2671f09" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="61ea4f6d-7ba2-47b0-a997-6bed6d7616cf" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="8650f302-d4ff-4cdf-8415-4818c16555d6" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="83cbf71e-d92f-4926-9914-87fe4fd3cfbf" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="262f21fd-eefe-47eb-a44f-d0fe954155fb" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="1ad89b11-3b7b-46f8-93b5-56cf0ea832e8" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9a4b7d18-4b65-4229-8611-19112393a330" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="51fba2eb-052f-45fe-af44-e99031edecaa" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="de033e1e-2edf-43ad-8dcd-913685e0e281" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="879b52f1-5a1a-4031-ab68-3a1849b6d2a3" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0078e4cc-039a-4d63-b73f-9ff3d5bf92eb" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="3dd9d625-1d70-4e7c-a222-5ca7f5d6dc8c" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="8938624c-8f46-4570-977e-577b63c4c79b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="cc3b49bf-b311-413f-aebc-b98cebad891a" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="52a0dd07-0c21-4dc3-9d25-941ba03629f5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ce5c0d90-f380-4152-a873-1d3623224a51" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="536a650c-cb9c-4817-9dbb-fb0525178c89" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4537def7-f246-4707-be4d-393c715946d3" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="eadb3c02-6d21-4472-9534-52d7b75885f6" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="890eff5a-a556-4e79-ba25-c73f17069fcd" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="bcff939e-4c54-4e09-ac4b-b1a20c4e0ee2" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="20ab924c-73ae-4d73-962d-877d6c326930" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a163facb-d714-4f12-962f-71f6fd757e0a" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="60cbe7c4-c349-4805-80b8-9aae218c4984" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="ee4d191b-1a14-4443-9c57-87f9deead6ed" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b0f56f9c-7f31-4419-af8d-b2960bfaa361" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="31a0666f-8f1e-478b-a3ac-0253b875709f" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="99d06906-2218-43ad-83ad-50e24b6acb3d" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="7aedc7a9-8832-42ca-859e-fec13785db7f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="bac0f9f2-4d76-4378-93d9-2b4713d8bf60" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="e65682fc-6689-460e-ae3f-19d9ea86e80d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="b534756d-73e5-4179-bc35-96bf61b5f393" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="7e4a44ed-8480-4bae-9ddd-d30793d674af" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="9a20738e-c5dd-454a-b18a-5ee7be95ab51" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="cba1f4a4-4968-4416-8765-bb9edde482c8" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="7dede90d-f415-4c3b-a773-3f077fec182e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="c243a6a4-551b-40b6-94ab-2b7c32b5d392" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="a396b8b7-46b2-424e-90df-da8593b0c19c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="da34155b-8da7-47bf-bd9d-9c24159dcbb2" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="665160d2-fe56-4d01-b72b-a8a1f190a85f" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="44263944-f9a1-431d-9baf-2074ee7dc1f3" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="91ea88a2-8af9-4b24-b9c6-f36d7174f5ca" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ce27f2fd-40d7-4dfd-b0cb-522e975ea14a" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="103fbc3a-585e-43b2-858c-69406d274b7d" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ae5c8611-66c2-4b3d-869f-625bd80b29eb" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="729d9d79-9284-451f-b29a-97fa5eb4fc7b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5b23ff07-a66c-4399-931f-e2187d89f42d" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="045270da-628a-4979-95e5-6ada55b5c87b" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="601d840b-4570-4edc-a781-e79f644d3dc6" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="eea1ced6-43b1-4359-bcd1-84c5418fec06" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="339bed5e-4dbb-430b-b878-a3b76b3716c3" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="c5ebc567-20e7-475e-b0cb-d4dfc27c03a7" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="d6a66d5c-b8b6-4f40-b63a-7898d98b46ec" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="2a3b9742-b251-4d0b-9fe6-5dd81cebce6b" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="b174fe25-25af-463f-bd0e-aff1c137076a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="89626252-7e25-4f37-8c80-5a7d214231e3" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}