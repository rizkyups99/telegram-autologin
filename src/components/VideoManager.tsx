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
  return <div className="space-y-6" data-unique-id="c1f1d48a-06df-414e-a95c-dd3debbc886e" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="74804f2b-951e-4486-83bf-deca66d72c9a" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="3e921e97-dcc2-46a8-909f-196a57f8e262" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="f6bdc263-55b2-43db-a936-ac2dc6ce42d0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="1eb581bc-e6d8-4a1e-8d1f-effc85cefa94" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="8cdc6783-0f99-4d42-8041-829ff5896074" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="09e3312e-6d87-4960-acf5-5127583ff41f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="53f5814d-5396-4b12-85ad-c7719fcc5493" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c00835c9-e7b6-4134-bd14-5a60a5aa9090" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="b4d2b7c3-d2ee-49da-9c40-40a336a70c45" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="f4c97745-012c-4c94-bb72-0cada313184f" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="b154f7ea-54cc-4fab-ab36-8e86573a1749" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9a18eda7-4952-4251-b2ea-36e0a96f99f1" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="edccec25-adba-49b4-b300-60fc517b7cd2" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="8044659b-761b-4ee7-8de2-5cd32c4f5a1e" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="065dbb12-dde2-4bf9-9995-0fece9f5834b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0edd7e12-6bb2-49e6-b2c9-6b6656002dbf" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2b3508f4-86cb-486d-8353-987552572c17" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="8d8523e0-0f87-4fa2-82f5-3f06ee35d520" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f6b01dd6-d3dc-4f0e-ba4f-0dfac234d7be" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="1df916cb-b6db-4c00-a5ac-09811f0b2b34" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="90cae198-a499-4b04-9b95-3a979853fb74" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="02f942c9-c7dc-4cc3-9cdf-e2934dc2731e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7a07bcdf-7eb0-4d46-be1e-417a4084bf72" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="378c5193-b7df-4090-b4ad-590e84be927a" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6f1decee-f344-4b82-8162-fe8b83f1f48e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7a1f5e01-66e4-460b-bfeb-f2db12a03337" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="a8f91ac8-ab07-48f7-b4bb-b419e260d8fc" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="77c8aff7-feeb-473a-afd8-661881f35794" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="555650ec-88ae-4886-98a1-11116b2a4c46" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9a3e4433-88f5-4e69-8608-476e2cdbface" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="9fa4006f-9874-43fe-9fa0-acf7983a34ae" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="b3fed8af-e857-4e90-b624-45c7e8333e02" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="a0280574-58c0-4bff-ad99-2b7af6367ff8" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="641aeb03-febb-407c-b0d5-28f79c5724ce" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3e0ef4e6-c5a8-42c8-a414-6c8290d0ad47" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="683ea10d-d128-445d-8e40-2398f7100ce5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="29f9c47c-d2e3-4de7-b093-c7e9d5f60a8b" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="8f07d7f3-906b-473d-aa52-c463d84ec0ca" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d90d2354-cf0a-4819-b3c7-d0a99ff0a420" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="274533f8-469d-443d-ba48-b62f3e572af7" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="c24779ca-abb9-476b-a15a-d0f44ee776ff" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="3e870aa1-3951-427c-affd-4c02d33ad9f8" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="cf380a29-da5d-41c3-8eed-4b73c6ccd9b0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7847ac1b-9a0f-498b-9a3f-69e59014dfa9" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="ac9647d2-b073-4e4c-9ed0-b61fb6cd372c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="26f8fa9d-c6c8-4908-88ce-7499640b201f" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="324b4e2a-5bb8-4b10-9b8c-353d3b24b52c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ce31ce8d-f7f1-4e5e-9009-c34ee67f6b06" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="76a6a9d1-992c-49d5-bb4d-980ab9649bf4" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="26b2d253-515c-43b0-9bc0-952558ea160e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a49e3fdc-b34f-412a-8e16-7c744a634fa2" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="916078cc-dcd1-42b9-a898-737048160c09" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e28c4709-eb57-4b21-ba29-8438edd7db8d" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="ae779551-2d7a-4554-b073-2a30697fe6c8" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="2e8ab109-9b34-47a2-96be-fe7043294ac0" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="fcb50cdb-b893-4083-850c-390923ce2ec1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="fbd0a865-3965-4f3f-8878-6b963e3c0fbd" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="0c98b1bd-0a0a-41a6-a8f1-0b37fd681028" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="6f5fe86e-e3a9-4757-a909-353e2b604ef3" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="23d76603-ead7-4560-afc3-999508748ecd" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="95d1964e-538f-4b18-b904-59f335ce4c68" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3e729871-fc79-48cc-a42c-3bc47e5f666c" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="393388d9-a51f-4f17-aa3d-72dd28701aeb" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="f52390f4-f8cb-48a4-a307-fa66869dde4e" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="d7d3136c-e7b8-4fd0-bcb5-33d9ddf0b9ad" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5b0a6239-70c0-4b4c-adc5-b73e127a732f" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="73c93842-9ce9-44f6-878c-e51695c847db" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="bcce1537-4b80-48d9-9c26-be9df7d1c5e9" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="1d58e368-6fbd-486d-a9c5-c976e673fd32" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="62f1f967-d984-41b2-b0fe-26b475db9da4" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8ba9dc40-9c90-4329-8031-83f0f99e48fc" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="90d6be15-06e7-420e-bcc5-45a4c4f38f02" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d868fb4b-bbac-4dff-9a8b-8b4afb4fa568" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="8aa8642e-9398-4029-909f-dfff440b0d24" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="564b7c17-d36d-479d-87a1-bf4ce4303615" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="73edc458-3acf-4392-9b97-950fa47b4add" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="3469a94a-7884-4403-9a4b-7c1e21fcf848" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="8ee75f9c-3a2f-43db-bb42-e5bec7b2695f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="45e4e298-94fb-4f4e-bbcf-3900824a035e" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="ec1dd2e8-e8b4-410b-866c-20ed9018ecc7" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="2ca3b263-1472-4197-9585-b26e539eccf7" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="03f4188f-e1ad-4676-9aa6-43ce38a5b86f" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="70f944df-36ec-4c88-a412-6038be67946e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="950040cc-7c44-4385-98b2-d2825e805d80" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="23be1967-e2b0-4750-a1e4-f2d3ab4f28a6" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="bacd7c21-dfab-4fb5-bf60-68a7062369bb" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="39475dcc-1eb7-4d64-a4b5-bbae84df0b72" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="44b62c83-2863-47a4-83f2-02d863737377" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="c6a1c455-3c22-474c-8bb5-111119d1adea" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="7d9861d3-71d8-48fa-9d6e-ab796e992220" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="6a54ada8-1d3d-49ac-9365-610ecd877a74" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="183e3b66-84b8-4983-8af9-76ce697276b1" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="c1aa29fc-bbbe-43fc-9783-1359668a45eb" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="78861fc9-21f5-4867-ac0f-fe0c12b135a5" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="d8a4df76-e6af-4652-a24d-6125df2fbef0" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="fdea5c6c-e3af-4ae2-9c25-8f17128b9892" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="0383b4d0-5e1b-433e-be9b-19d4a577c75b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="cc39323a-039c-4b16-a3cb-83e170577fc2" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5a5055ce-a7bc-4fbf-9c69-cb18e3db18cb" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="60db6d55-184c-48f3-9496-30cbdbaa02ea" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="20c524f9-5794-4325-b61f-1724fb28ab71" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="ecfb8605-7e85-462d-ab01-2a0f8a75e892" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3322b16d-4708-4f7d-b503-038fbd226b75" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="7dd5bc17-bb18-4bec-9fcf-0b93dd7a0170" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4f965d95-bf0a-4b81-b956-5bfe57804318" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="184f2e09-2062-40e1-8089-694095322e3d" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="07b09f16-95ab-4cd6-960e-7d4df225c344" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="cbc1ea0c-2e6c-4fc6-ba0b-0fa42e05c93c" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="2b01d149-943e-443a-ba68-c45484c666d7" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="5bf74e5b-567d-42cc-b20d-27ae813d18c3" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="867a0a3e-52be-42ed-93fd-0ac86f56d903" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="cafcca05-00d6-48cb-8ca3-50b26f720596" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="567578e7-f076-40b0-a303-0fddbf075bb3" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="a38409a0-3e99-4fa0-b003-a6e369471443" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="c286c3a5-b6e0-4549-97f2-54320ddb252d" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="179cbb60-4545-45ca-9079-4bca4e93a733" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="d6b9d08a-1a52-4fe9-a1c6-6458cc9185c0" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="406e3e67-615a-485b-a297-42cd4f34b2ac" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="581fbcec-f3d1-4ead-a49c-3eba9efeeb19" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="ebf8a97a-8323-48c4-acde-0fc5d220ce92" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="1eb7e0db-d51f-480b-9e2e-6ffbbcb05deb" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="6a08bf7d-cc5b-4c6f-a147-15f6fc3aab50" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="89ffeacd-a601-4973-9da3-eeed7103230b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="1fee21ec-b7c9-4708-87d0-c77e7522a38c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="97f4161b-a56e-4799-928e-56ddaa818b73" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="46d83452-75f1-4431-8f83-12e823f49f06" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="369e59e0-00b6-4842-9652-8e13cd38e4fc" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c5f4d914-ed47-4830-af9e-610893cd02e3" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="60ffeb8d-9690-483d-bac0-89bfe5d2d4db" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b564ac13-55d4-4e72-8cc6-1c83c619ecd6" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="15ab7e91-f0a9-4853-b625-858378eeff68" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="94483a3d-5a6f-4d50-b3b6-a5e34d0ea521" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="a66943c1-3264-4f79-8ab3-bf40e0c39271" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d55f2a5d-ead8-4773-b3f9-7f0b230aee75" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="c6d3f670-f6ac-454b-8327-ebc305c679ec" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="ebe50210-01dc-4632-9e3d-25e71a066615" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="b1d81506-ec9c-4a98-9e54-6905d44223bb" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="178af33b-b73f-4999-a79c-6c396bde4635" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6aee7e85-1aa5-4098-baa1-67e7a65e2534" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="f113f9fa-1324-455e-8817-63eb0aadf17d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="244d2bf6-0e32-49eb-8a01-6fe5a95d4b8e" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="2674f457-d6c4-42fa-adfe-f0e1806717e3" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="219aae1c-f515-414e-96f6-3a723d2cfbde" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}