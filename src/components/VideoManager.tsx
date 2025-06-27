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
  return <div className="space-y-6" data-unique-id="046b8494-c98f-465b-a3e1-9ab768ff242c" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="57d01a53-8ef6-47d6-a0b8-5f9ed00d2730" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="e1db8b5b-6875-4743-86a8-b7385186039e" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="b5273de7-f0b4-4259-9750-d202a510e336" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="121b1c3b-f644-45ec-ae3f-a7125551d28d" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="f3a97827-8267-4985-87d6-d2acc104fcbb" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="41aa08a1-7110-40c6-bbe2-90ed8a604672" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="b3240b9e-1fab-4284-862a-1038a3ec7456" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="63a84d52-1c2c-4e7d-9f71-2d6afa329a5f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="b5e343f7-a99a-4a48-af8b-e4f736c76716" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="ce7350b4-e6ed-473c-a35a-f5c927cd0fba" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="a9101c87-04fe-4bc7-80cb-258ea6e02624" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f5bda265-a8fc-44b9-8a2a-fa4e8dfe9391" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="4707af2b-eb0a-4189-9505-56bc09b04a9b" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="25657500-6e22-49aa-9766-0cb2b24af216" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="6e77a5a3-3bf6-4793-bda8-21b0649405e7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4fbf0e41-344e-4f7e-bd6b-96a41de1b721" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="32f90e19-3a87-474a-8cb6-4e5a4fd87799" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="283e6a6e-ab16-4aa3-95c3-a3f33e18a835" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ec734102-9dbe-46e2-bdaf-d2f27e6074f3" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="f6332b14-803e-4424-935b-3079d62763fd" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="d0d9d6ad-08ee-44ec-8611-ebaa19fb77a4" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="003f70a7-d987-463b-bbf3-51bc94a7f0a1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a37e1609-fa8a-4ddc-aea6-fd2d51b25c9a" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="7581bfc0-2ad7-4c64-8dee-4e4ca1a17462" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="613b986c-0cd4-4455-9f9c-33345d0eb636" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="165b718c-67b0-4921-acbb-2795ff96a70e" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="60b0cc7d-e405-4c7d-bc69-430938a49fda" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="f030996d-a263-4810-9fd1-77eea82a9706" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="2d7ec5c1-1b23-4482-b618-33bf1feb2721" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="94668010-9c4e-4220-9ffe-94fd673a086b" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="5d6f1158-c8cb-4120-b9b6-445a2468295b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="a957e482-4725-4371-9dfd-44919f2b6784" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="5b9582bf-55fb-4b68-af7c-5ad242602eb1" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="503231e1-e8f8-4056-a7bf-7536a9ad38c8" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2bb94e35-e5bb-4579-9c24-3df358f02561" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="2d658a99-7888-424b-bb10-0859ffc6db1e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="fcd726a1-8063-44f1-b03c-16bdd3cea7b1" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="36ade914-f696-42ca-9704-648a211295b5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="612d90a7-6587-4525-9a4a-c7fb76371aaa" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="2468b6b6-9342-48ea-8cab-ded0c2379756" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="da6ecc2c-c91f-4679-8164-d35dc30dea09" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="de2d41f5-1118-4ce9-9468-1b0ceb3a6c30" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="7734d737-df7d-414f-b08b-d7d36ea7343f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9b2e88c9-0d5c-459c-bbba-7b65041f2b61" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="b13ca450-a319-41f6-999b-b77b5062075b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="01a33461-8a68-48a0-8db4-5f7d7d86c873" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="2cd2feb5-9228-4f0f-b6e2-8d3ae459aac0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="354e1490-76cf-4909-99ba-3c8fc0f536ac" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="33e7dd22-745e-4bf0-8970-7eebd90e1079" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="be738b89-fc84-43a1-b35a-1332bf2345b9" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="5375c91d-97a4-493b-b49c-ea5f677ed2b6" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="1bc5b519-8b80-4757-9f7e-4d335bd48e5a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a4210221-0cb4-41c0-8f24-e1c0665d37d0" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="2434a57e-b1d2-4b96-97ed-ee07624667f0" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="d6e4afde-6c8b-4821-b183-4e4052b4894f" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="434b4efe-cb84-4b3e-9530-b597aa4c7279" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="bd526bf1-30c5-4a7b-b7db-0b30cba52f40" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="a8620971-9766-43aa-9c9d-81e85edc1e49" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="c3e056d4-581a-4c73-9ebf-94324530b91d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="78ecdf93-38ff-4743-93d4-464eefefd6ac" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="7a009eaf-68d0-4c35-be0e-588e3d362f47" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9346e91b-cf72-436e-b34d-aa96efca03c1" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="5562c214-1a10-410d-9c01-35e9f1e6227b" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="eafcb31e-1304-4682-b386-233ede869ea5" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="de21b799-f0ba-4862-abd7-215956228ba5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ddc24bd2-9f61-4304-a871-80ba245a2881" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="8a740936-2d70-42d9-94e5-29359b434651" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="431c346f-dca2-48f3-bbc7-e2a593d69ac1" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="889d5f8a-7e43-4f70-80e8-390297faab39" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d85bb077-619c-4394-a385-6078ee2d43ed" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="a3596d09-1432-4ee3-9640-4b8a82b4324d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="3f0ecab2-d901-4271-b72d-9650090a5971" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="140ae334-165b-45fd-bf60-8056ae12b856" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="82fc2faf-e85e-4df0-b423-bc99530bb77d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="5333b370-3fa6-4ab4-9714-a0f5f04466b1" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="941ae0cf-5332-4f9f-b737-da7dfae7929a" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="1ac51ddf-7a5f-4be8-b1c5-b9b286eaa261" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="06ba4424-6ae2-4038-a77e-fb390212b803" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="fee3400f-0714-41bd-8195-e58c1fa8573f" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="34559ef4-287c-4d92-82be-b62ccd1719f1" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="85181251-3903-4696-8393-6a1f80ce6e33" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="230f2452-c0f7-464f-b20a-8763e310aeb0" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="65700f60-62d6-440a-93d5-56d5ae880ad0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="943dde1b-f04a-4470-81e6-ea0d3183c85a" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="3d4ca298-bfca-45cd-b225-9e940b6d77e3" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="e52229a0-58a7-4b32-a44b-9a19306c93f8" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="c442cdfb-c473-4937-89ef-95f74d2f2853" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f87297f9-737c-4fb0-8921-e90179695ce0" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="8b8106ea-c194-48d9-b669-e421cc4194f8" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="d3acfc0a-4e7b-445e-adb0-e9c901d6233c" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="78d87c58-4d7d-4178-9177-636149c1155a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2dfa9740-77ad-4918-9979-1a2059f46400" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="61e6f40f-5d6c-4462-a901-f1aa2e72be79" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="dac1787d-7912-488d-9af0-1685bac0f5e2" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="2175e761-0481-4ab8-be1a-5ee7c903325d" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="a5e481d1-dd2d-4f6a-aa86-2677a1339de7" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="25948a39-3fec-4c13-a4c7-40b7c4812a8b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3ffde2d5-118b-4a1b-bd63-b904014d041a" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5d78ce50-de8e-41f0-925b-f896717b1d09" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="f7ad7a47-d459-483e-ada8-dfe00b14af04" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5cda4626-e783-463c-b6f4-1eba4cdd1d13" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="2a4bdd57-6ba5-4946-a4dc-0507088d2ee6" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="77834abc-dd67-4a77-823e-5ef669afc616" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="4a824a23-76c5-4aa4-9625-c17afe86f9a4" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5bff8c44-6e3e-4a93-b588-2d7b23f436fb" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="f58975c6-e4de-4eac-8bfc-42599308dba5" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="26f98b28-8465-41fc-aa44-d1182fc34324" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="4e5852ed-8f2c-4983-a751-16bf9e18f784" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="5c3846a2-06a8-4912-87cd-b8e17a40c7c6" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="b1786268-6a21-4bc0-ba01-a7176ffc6276" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6c402a10-fe84-4880-bde2-e5092d36a3b4" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="aa27ed37-a7ff-4ffc-b3eb-97323a029551" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b1f5cbfd-a895-4f50-8c9f-1b7da1e24486" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="5e5ddbc6-543f-43d9-8b82-ea9fea3593f3" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="ac1a3749-b61d-487e-8588-705eace3b7d2" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="156f1ce4-f7bb-419f-bf6f-d0ff71e07e3f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="a8401a59-8ae0-4bf2-ba47-7dfc4480a4aa" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="976260e4-b93a-4279-97ba-0f6ed197b723" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="4da1a291-c0d2-41db-9b5d-883dcaf790b9" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="f9000033-6da9-4a00-a86a-5689ec18e40c" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="2cca698e-ebfb-4f1a-b413-e33592981329" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="e4b42c4c-222a-4ebd-84a6-0cd6d06605ee" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="48402a0f-c52e-4a44-b6f4-ee01b024fd96" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="29b08188-6d33-4e73-b4e4-b38090721719" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="968aa334-e2a3-4b0e-8027-ac950fb23171" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="2036398c-116c-4ffc-88af-ff37354425b6" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="216e9571-2637-4934-b3dd-6bb51df81986" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="5986844e-416b-4c82-bdee-5f407f20b13e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="2887643a-6054-4bba-a513-b6be06255385" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4527ac8b-fed6-4dba-8843-b10b42da96da" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="0c2957ed-c342-43c0-ac45-e2c6f016cf3f" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="b7b07d40-2ce0-4b96-8648-474941292cb4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="c0ebbe2c-c5bc-4282-aa78-0c4c4bf6ebc1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0c2b1e6b-36cc-45b4-943f-ff2098884d89" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="43392728-8aed-48e5-9078-708298ac140c" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="6057ab67-0434-4939-a269-a59924a4b698" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="56abd93c-a9c9-4987-9ecf-a0f4c6115c5d" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="c192e7af-db07-42ae-a362-a06bb5b6a061" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="95031b23-de32-437f-b729-a67f77a82472" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="02fdaecf-6ac0-4c42-abc8-db5029de9ab7" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="ff0c5ebc-4f29-43c7-94e2-3cf98a756aa5" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="a6588c95-2ba3-4918-b8d6-a76f088adc74" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ad14c99a-6312-4f2c-8916-ef7c2086172c" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}