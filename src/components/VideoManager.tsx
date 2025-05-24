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
  return <div className="space-y-6" data-unique-id="f25ce117-ffc7-4795-8957-662dc9c3b6a8" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="cd08c224-4b33-4d59-a369-06e7c0cc14aa" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="40f64e36-7051-45cf-acfc-b06c43f96911" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="8ef2332c-f059-4d08-83a5-87590d0eaf7a" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2e2b4fe0-4504-42dc-8f40-b26aaae7ff2d" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="c71b6b84-96bc-4d9f-a258-1ef141861792" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="2eb9bd3f-48b7-4a68-bdc1-e26c833bd8cd" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="9d2374f2-c744-4621-996e-5c559f82a469" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="f9cebdb3-cd7e-4bc5-ade5-b357f8455b74" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="6d09e615-51ba-4f90-bf88-8acae4871236" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="694efddb-1040-4c6a-992b-62bd7392accf" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="f25d2b8e-50c7-45e5-a510-8c8c330af7b0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="71bb2c6c-20e5-4f7b-948a-8c65047ff11c" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="2d3b11f0-0865-4d59-9386-ac82c12aa633" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="72631075-a87d-4466-85ee-5143df8bfdcb" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="c20c7629-153f-492e-a5a7-3146a617fb0c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="193f3646-102d-4de6-934b-970467025b23" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="79ea943b-171d-4871-91d4-0dce51e8e386" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="3ec9b7ba-cdf7-4891-ad6f-501a797c7bd7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5957c276-351c-46ad-bb7b-4b9433b4b04e" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="d98c833b-f2f1-4c8e-b35f-2a393294940d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="ed82ae85-9c5e-4f86-b66d-13b7bcd98e13" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="968ec4d5-0452-421e-94a5-576de35b4246" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a5f6dfd3-8797-4c56-8f36-d173addcac61" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="c95d51e7-1786-450a-a1f6-031160918361" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="7cb2c6f5-bc6b-4094-94e8-902813190439" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9f635212-b062-435f-9542-1596461d900f" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="0158594c-9414-4fef-8e62-3cc9108af95c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="de6d4642-dcb0-4218-9d56-f874ded8aece" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="2beb3331-8ab6-4e0f-92b6-f00342adf76e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ae5a18a0-e1a7-49bf-99b6-1775d3480290" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="c4b8e7d6-b7c7-4e4f-b11b-04bc896ba9a1" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="19b61981-fdf7-445d-b099-7a74d80e3274" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="e382289f-4ea1-42f7-8313-abcf8807c0fd" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="20db701d-6345-4ccb-b72a-487c98852636" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d025f565-6e88-4ce6-82e2-c33b51f39db2" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="922036e4-9c66-4c05-91ef-7d06f44252dd" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="dcbaff1f-960d-4cda-8803-d079f6cd761c" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="6520973c-cfff-4fcc-950f-32d72fa6218f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="03952da8-dca4-449d-9853-c41436edfcf7" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="76c15362-744a-4dd9-9091-55c806afec0e" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="ff2b3448-c7f7-4be7-93ae-b7f1defce235" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="8cff72d8-bbf0-4f71-ad34-05a92f31e6eb" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="20b22ee0-3fb3-4ceb-8cdf-a8c5443b42b5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="87d11c4c-5495-4150-b82e-747326560717" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="68b97faa-d2d3-4951-baf5-ec5a8dabd6ca" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="44cdcf1e-861f-4355-ab8c-86ef02fabc52" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="f005e872-287a-4fc3-8758-c2176a8f7976" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b333c078-1fcd-4c4d-aceb-0f97eb60d353" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="c6145e00-5778-46a3-a84e-43bc7a86c27a" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b0954789-b277-42fc-b6aa-6918197438ec" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="093cc4b3-4c52-4646-9113-83130933621c" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="af0979df-c423-45fa-a651-aa7653a0adf1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e71ac63e-b5ec-47e1-8b37-5c91d73cc480" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="977551a0-c964-40ba-9198-0f228183e4b1" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="d484c413-89cb-4236-99ae-e7fb1121df53" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="ec4fa3fd-bb31-49a1-8d9a-216d0fe26149" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a8679274-b863-4c81-8ce0-57a09b1fbffd" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="b1036af7-6bef-4f64-afdd-8e9ee779395d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="1cd52d0b-5684-4f69-8097-b2fda06aa6eb" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="58c9124e-392e-49a6-a922-a0dfc8b2cf9a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="e01ceaec-7b76-4c57-9ea3-385873af89f7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9158d9b7-606e-4cf3-9786-e281377929ca" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="76e273cf-2cbe-4b54-9855-26ce008fa063" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="064b924d-425c-4554-a0cf-24e1a7cd87ca" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="fd15c807-cda4-4d81-b48a-c5dfdb1814c4" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4df534c2-177b-440d-b653-c8c66ddd44c0" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="f65b5287-493f-465b-b3a7-0e37e05be21e" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="434a8c3f-c136-493a-b74f-faee1467a126" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="26254b9c-5b12-46d3-9593-de55df9c0774" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="adaab9e3-5c6b-4934-bdeb-b602a0c653f0" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e50a6207-0fd6-43b3-b7f1-5fbc16988b66" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5da89b78-7942-4ddb-9abd-984a04e5391b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6a6120ec-b416-4318-abef-a0e93e3e8371" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="f4263031-c827-4b15-a35f-55cee5622af5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="24dad8d2-ccc4-4904-9006-d82baf0e3585" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="e21bc44e-678d-4712-84db-32a0393b83fb" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="d5993bf9-d645-40c8-8b88-23ff17b6483c" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="43f8da56-456f-4eb6-bf48-4a66f33cf4d4" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f1b0e8d7-4099-4217-a492-1dc0c4b7f9cd" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="c4a9cde5-ffe2-4228-a8d4-34803a9c4b72" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="c6bacbb2-61e8-437c-a9e5-0369209072df" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="4f0f6e9f-8dc0-4242-9419-5a1cad68b997" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="eab1901d-f1ca-48e0-84d3-d7d02bb8ac78" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ca30846f-2e5d-4700-8f6b-67bed19123d4" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="20d7aa45-d810-419a-94ad-77e45efcde3f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="5a3f5857-a715-4361-832b-6c5235e98d19" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="2708ba41-9a22-44f4-8e98-5b5a8c7d9b6c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6ebc062a-0e7c-4363-af9e-bb8307ed3a3a" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="d5d3c93e-dedd-477c-8d11-d02fb0d28145" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="fd3dcf44-f2b6-45a7-906b-fe3cb2c880bb" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="339d7380-d86e-4855-bdc0-f95e59971439" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="51fa2717-445b-419a-90fe-a28f9576baba" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="b9093789-92d4-46a4-a49c-a3e78543ffe8" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="26041231-d2da-45fc-b562-b1ca0a1cfc9d" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="da750664-64ac-45e5-8b31-0748fdf7282a" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="ad5ef97e-dfaf-4670-b4d0-16915c787eae" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="6dadab18-1a4e-47ff-988b-7598bf9ea57e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="509a78e4-e727-4a6c-8fc9-31e1edc5ccac" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2713cfbc-783c-4a91-b166-1bd4e9b54a8a" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="dac631a1-d317-4197-a06b-222109f8bb30" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f6dd3f7d-d0e0-458f-8b86-49c13791419c" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="19c8ba6f-20ff-49f2-9f27-0c7f0bb3be33" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4bc6f40b-85ad-47e5-a64b-a581b450b9b0" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="4547ecb0-a8b8-464b-9edc-f5cdd1355237" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f48e2e18-520e-4693-ad58-a8836285552d" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="3682ce01-01ab-45c0-9515-ff23b418a991" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="aaacd23f-6e5e-48bb-8dc9-48ddaf40a4f2" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="73fa8491-a657-4437-b11a-1bc9d092baca" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="db15a896-09e1-4409-95f9-4474f5e06aa5" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="66914b37-e841-4caa-8a6c-0f96122f6a5c" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6871fa06-0b7d-4497-ba31-b9184817dd06" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="6ad0c3ff-7997-44cd-862e-594eb2b2319d" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b74f861a-2a85-45e3-bf89-862c34bceaf9" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="9ab7ba60-3d89-45f7-8676-9e1c597ca9cc" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="768ba183-1319-4bed-8ba0-36b60b8acd76" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="7e4a5814-515c-47f9-8074-6efdc4d6cc33" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="abb9dd42-adc0-47ed-b6da-035d9b162d03" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="e9ceb9c7-f685-43fc-8964-7cdd7e032c3b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="c2e84c84-3c45-42f5-bb30-136cabf9360b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="838104be-cade-42f9-b7b0-ec3244ed9fc8" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="5a350edc-092a-4fa7-977d-32174e781ebc" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="736ae297-d18a-4cef-b8ca-ecc4dcb78c61" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="6f0a0c7d-1900-40de-8391-63ea82377813" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="0300a993-b3a0-49f6-9c77-0c63fb39f3ea" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="1356c1a4-fd89-4b5f-9e32-f27e0002be29" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="543fbda8-0b9d-4e3c-af4c-f0c22472a658" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="d381c56c-a173-4783-a215-02dcb83ee539" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="5a60fae2-2a28-49c7-9361-3829499a983b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="dd9d0950-6385-4b46-abc8-92f28966b9e0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b2e6c18b-c119-4f0b-8c63-0bf3c39057a8" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="ad6d03fc-90ee-49e9-b9b8-1fee04478ce0" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="7d3f7d3d-1549-44b0-847b-7838a1cd9074" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="1e3eaaeb-018a-41f1-b7c1-e8c0467d9d9c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b4cd3555-3852-4ac4-a8b8-99ea305979be" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="839836b7-1202-40ec-9eda-d4c5d5b6d07c" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="3acdab93-55b3-4ea0-a096-e21c80d99b1a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="e1fadbea-b827-42c2-9961-c0b21e05078a" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="be8e0c5e-027a-4a57-b155-27e4f6ec4dbe" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="31017439-1c55-4c97-b587-91bc4f0fa84a" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="b25679ad-74de-4a23-b10c-02660eb6076a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a32946dd-c0b0-4607-a893-15084bf04aa1" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="9a341911-8ee3-4d4c-9f21-776338b9c465" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f8e84f99-dfb4-40e1-8488-42b407b66013" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}