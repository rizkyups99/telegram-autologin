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
  return <div className="space-y-6" data-unique-id="8d01deec-e1d9-43d9-93b0-786e8dcc9cc5" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="783d539b-8049-45f3-910e-07047a3cd068" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="4e1f7c2d-58a2-4594-9779-6ea2f3f8511e" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="a34ac2f6-7178-47c8-9784-c4dc68967611" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="feb89b89-289d-4b51-8a3a-d0f1ce0577cb" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="25895425-ae2e-4651-9e9f-f6710ab59588" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="05f4ea3b-7f21-40c9-9ab5-f5d68ac718a1" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="2945ad5c-d898-46a1-bfc0-6269f2d40abc" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="5737a20f-47d8-4012-a888-56834de1997f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="9a86bb2b-5c20-48aa-b782-4af58a9474ea" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="039619a2-1238-4fce-9090-6551671681c7" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="a76d0dae-62e9-490b-8b59-01dfddec4f9e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="42d23d8d-7aa3-4f62-8a4f-c8d9a2155bdf" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="50eb3656-59a9-4e5c-8fa3-53e1d0d15580" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="df6349b8-4093-4214-9064-041b859684f9" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="1452fb10-7c37-4c44-b317-b4bb7ada6640" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="8981eaf4-f04a-44fa-886f-8c2e42b6c30f" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ca314edf-4aa6-4fc6-a577-58130e8f3a35" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="c516db6e-bf2b-4974-bb21-9e8f4a3aa37e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9daef79d-4dd1-4d34-b6d1-cb14108bce5c" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="1b20e1bb-085c-47f8-90f2-0f322f675742" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="466daad2-d02a-4638-a294-773fc6ed47cb" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="278df55b-18ef-4b39-8a5c-3eee92687823" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="91d11b03-5ff4-42d4-a30e-f7b543793f72" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="6606dd09-5e67-42f6-9b82-10184fc2a755" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="cbda5d52-00fe-4156-8b16-692ae337d0d1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="226496a6-8613-411a-977c-b2604729e9cd" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="6d0d3aef-0978-4f77-910f-feaea828d8f9" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="e90a9111-168f-47cc-97cf-e97d4045ad27" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="8591046e-2fe5-41ba-a0c7-fe59a5544096" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="416da606-f297-4283-890e-b7be8c11afff" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="ccc96cae-ab13-4bb1-baef-144d51fc1882" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="13409aad-c8d0-42eb-a1b0-9c265fe7b82b" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="a59cc0df-6ff3-4524-9ff6-0ed46ee3b6cc" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="b2ebb3d3-e6b0-4aa3-a036-7c37a997d34a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3b3ddd94-e86d-47cc-9ba5-0f2a0f212548" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="aa445f58-9e37-433b-9b24-eaa24ef2d61a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a4c530ea-94a0-40d0-aba8-0c008a91cd85" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="27f17f3d-0ada-4f4c-8476-3d1c94adc13f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="fdecf9e6-f28e-427b-9a10-0719df15fe9e" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="83c2a47c-e909-402c-bb04-37147cf565ea" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="e4ad99d3-934c-494e-85e7-fb651a34f4b7" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="d8daf6f8-b1a3-4a6f-98fa-79da52acdad3" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="fc323111-3d60-4671-86fc-fa4c1a049a91" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7dd562f0-0b43-4a02-a1fb-2b7eb8d7c24a" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="ca8ae090-b023-457e-bbd5-b40cc75482e5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a2a0de53-5b11-4cae-88ad-5a342c20a5ec" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="63c86277-4d52-4484-ba4e-a25afc3233a1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a3fb7c02-1465-4c17-8df7-8b01ae76e358" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="863f1560-7937-4fbf-99e3-137ada9fc856" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="5242f278-ee57-4b8d-9f93-ddf0042437e0" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="79d03ab4-8c58-48a9-bebb-bc022ea5a9bb" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="c72f9bdf-aa9d-4e0e-8f31-e9d123c37f56" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f9f2a74d-e702-400f-88e0-ee783cc948a9" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="0ed81f48-90b6-438e-8a97-281e278172bb" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a756a1c8-6f7a-4003-afa5-d8c3d400380c" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="314f244b-5292-4c2d-9c0a-51b5eefdb1a8" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="89ba8bea-fc70-4980-a39d-1865d87fe69d" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="8ce055aa-2d88-46e4-b908-afca741949a2" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="8fba77b5-1d0e-41ba-8747-0a6d408e6e31" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="08963879-4e92-4440-978c-3b1c192b6480" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c9d6a17d-0189-4780-843c-e102856116c3" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="cf278383-17ab-4b67-92dc-21fc00065515" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="b1d5e2a3-056a-40d6-af47-bf7a3d93d3d0" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="11ca1b0d-9937-46e3-b89b-c4abfb77df9f" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="559631e8-d32e-478d-964a-72823219f09f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a69268ed-0734-4922-87f9-6d048f728b1c" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="86a4e563-356b-4e64-ac62-2b366a7cc7dd" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="841ba8e9-2f4d-4cb0-abec-12575a0ebbee" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="a567b12b-64eb-4f44-8993-1201cf200a57" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="85b746ef-fc2b-49d8-8e27-e35455c9259a" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ad0216d6-564c-4936-a966-f281aa2dd2c5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="240170ce-f676-44b9-b489-2b1d2b42a078" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d096acba-1f6f-4056-8804-1052d53d134d" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="4122d8b9-e491-4671-8beb-c195752d63b1" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="37329157-af90-403e-b109-0acde57852b8" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="ab13c07d-f742-4662-9c7d-7b3fa9f8fa01" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="6838323f-6cb6-48ee-9ea2-c96761ecba9c" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="c9dab636-9f06-42df-9731-9bc89d241fba" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2a3eac49-9aed-47ec-a42c-f4f30cf645a2" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="b2138786-5da8-481f-ab2b-4b071b0e2857" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="5cf86a0e-85e4-44d1-804e-174849f16295" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a140442d-9bb7-4e68-af21-69c0fc923709" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="f4145909-2b60-4607-86b1-ed774c8261c4" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f825a130-0611-4889-b5af-34deb3f04c0b" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="83bc4bf9-c2e1-445d-a891-8c6587ecabc8" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="e51ecd2f-0839-4a8e-8dd1-e30f25c71978" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="191a39b1-49f3-4265-beac-cf60989c4738" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a1a53166-a7bd-4509-ba30-6f7dc90cf84c" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="abf2a12e-c09b-4f7f-9e6c-60962d0f8d62" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="c8fec705-d3a4-4c72-8349-780073e6bfd2" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="a70a3787-b677-45cc-8de7-c57cccbd01b0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="909e09f8-214f-4e74-97b2-7ccc650db7df" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="d9d24a85-72e2-484d-b36d-0c8479b2e9b4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="680e16ed-33a7-4531-bacf-9e264643ab26" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="f2ae0d18-3bca-4269-b587-35439c7de1a9" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="1e5ba9cd-9a5c-446c-936b-277741ec98bd" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="a282262a-34d8-48e3-bbe6-d0ba3f491c74" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="cc347da7-1c68-4fda-919b-a529c16b0794" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="fb03ffdc-d3e2-4649-a01d-6ad1900ccaef" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="8a41f385-05ce-48ba-9540-91295c611b70" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3f6bff8f-35b0-4369-b026-48771a308e0b" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="6ab34572-6cf1-4dfc-8cce-86093e3f627c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="add8c1f1-7c83-4c0e-a98c-0d573e5c91ae" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="130b6fa9-5672-4b2b-961c-714575015a67" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="201048df-6419-4f30-a761-616aabbb1efe" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="4cf5693f-7a6f-4caa-b25a-174ebc72f77f" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="493f994b-d3cd-4e97-9081-10c4d6c05f79" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="ad8b5253-c3af-4a1a-abdf-e6f39e4386ae" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9090dad5-22ce-4770-882e-13d788f292af" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="036de6cd-d074-41b7-8054-c30c41896a89" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="1f6a5790-4ddb-4510-a6ac-590240029649" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="e94d137e-af40-4647-81a9-3b3a11edb2ea" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="18885c42-8d1c-4a54-a8a2-de103d190fc0" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="124f925c-43d9-4b2f-a295-4fc5e0cd4a53" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="bf4c26eb-9e8c-4d9b-84b6-379f2352eb15" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="1bfbfe7e-bc23-40f9-9ba4-b18ad57012c5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="426aab22-bf3a-411d-89b8-5713a33c8349" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="9e2b6d01-1f9b-4411-b419-c40aa966f578" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="1bc441d1-c884-4526-891b-8ca26ac6540c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="909786ee-a951-4768-b7aa-12c30407128a" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="a4d69915-8e01-43e6-9456-f7a82900edaf" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="bc430604-1195-46b4-b734-d8514f5bf042" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="56794fe4-cce3-4c5c-9485-1dec6cebe37b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="f85ca5db-f68f-4d31-ba08-a55e36f47daa" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="ef6f802e-6a95-41f5-8463-1c8b0e603998" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="f14c3ad4-5f42-4439-98e0-01b67cca4621" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="e959d70d-37a6-463c-b4ad-19b109448e44" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="780f3cce-7a08-4fdc-9d06-bb8ecf5f6794" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="8dc42aed-e09e-405b-906f-11d03ef1f1b0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="498d2138-39bc-45f3-9f47-970e725b7681" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="cfdef0bb-0573-430b-b127-eb25e60f0dfb" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="44cc30e3-b0f1-420d-8216-15973a3d4ca6" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="af056be6-4f28-4374-8b87-3cd8d37a0d43" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0fd9caf9-8194-41f0-b312-a2ae85e58f19" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="2b7760b0-de8e-4630-9593-ab71284f559f" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="c9353773-02f3-46cb-bcc0-d3934fdc9c20" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="2e7f8eab-3d38-4231-8b2f-48cf36a9b051" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="fbb1d6b0-2a17-4611-9c04-85d4887ebb7e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="87371beb-c4b2-4b7c-8582-e01d0ed96cae" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="62d38949-9d05-4461-a79d-9828249205e6" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="0b328edd-df2d-4a03-981d-9f5c006dbfb7" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="9d6fb045-5475-44e7-84f7-e5e8490ce716" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b4f13b63-c315-4119-b0dd-b723f69d8cc4" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}