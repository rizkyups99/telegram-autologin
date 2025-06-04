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
  return <div className="space-y-6" data-unique-id="51df2980-07e8-4a45-823d-25f81d0717b5" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="8e9bddca-ca57-4a26-8f4c-3346fe629392" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="d599592e-01a8-4666-b63f-dc881c8f3622" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="97a28008-9098-49c9-91ca-c8bc8d0c34f6" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e92482c4-65f0-4e56-8f8e-8b010f23d839" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="89362b6e-c52c-40fb-b3f1-049107e01d27" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="a4b2267f-f0c6-4f20-b141-2ca426e3a404" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="ac9a5af9-e57c-44c2-90e8-f9662d3a302a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="f5b1ca29-ff9c-4f2e-a46c-a299498eb396" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="ea153954-af54-4506-81f8-1eba458a8c4b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="30afe559-a520-4dee-a278-9627e31f3de0" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="eb0a1135-337e-47fc-bf97-737f779bce0d" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b4b0e2af-b936-4a62-bda3-39db3cc57da5" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="674fd931-b79a-422f-a9bc-eb717986a9d6" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="54995b76-f0e2-4705-9c63-f13005a6a737" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="e778800a-3c71-44ff-8ea5-62c404827d54" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="670f2740-65e3-4b0a-93ac-3be7d89da8cb" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="cff450f2-bcb2-42d2-83c1-bf6f3d0d5e97" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="4cfbd55e-863d-4fbd-b044-c6a7535deb14" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="c5461f0e-13fe-4b08-aa01-edadc559b4ab" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="f3bca9b5-3f85-4596-9fb7-a796bc7d1114" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="a4eb616c-4655-49cc-840a-ab8ce75df965" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="fe8a5c7f-b6fc-44cf-8d61-1ae498089c45" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f8cdaa9b-e616-4f7c-9773-1dfed3945fda" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="d7d7ea4e-3da0-40f4-b7d2-6f159a62df4a" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="00f2e4f3-ebcc-4610-8d3b-ecd8991ec0e6" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="42fdab03-eadd-4467-90f5-89edc75923d9" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="6aba8392-825f-465a-9a6d-774f05cff1d4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="bd3b1fb3-f68c-4475-98bb-13e0254a99d3" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="a568361b-df55-4b2c-942f-1a115bc410d0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="165dfc17-6ad9-495a-a4cb-c323d36ef95c" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="209d84ee-4cc0-487f-af9d-0a36343ce042" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="f2113314-c358-4753-92f3-9b3d53e56179" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="a5c31023-8231-4f01-b273-4cc2529d51a2" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="c6e17770-657c-4115-acce-6314c5c739df" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a74a25d6-8bb8-47e7-85af-ff741ecc8afb" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="6fe1195a-ccbe-4839-a07e-ff699554080e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6e827131-c0a7-4c5a-9dec-58777b475409" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="2bf96ab7-51d4-4574-9475-50612ef761d1" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3a9cd577-1901-4241-9391-acd26c3bb673" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="05f3219d-ef84-4526-994b-c6a1a4d5df74" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="e2cb2578-08f8-4477-9abe-2e70f5e8db81" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="7e69b8da-68f1-41f2-80ae-941a7dce93d7" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="618c87a6-b8e4-4992-9958-04c684723c02" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f196070a-bc41-48e7-8eeb-b424269c3bf7" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="6161f23b-eecd-4f73-8316-e37af78323f5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="eff7da0e-36bd-4e2c-b032-d67fc9f17ab4" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="275c1af6-d8b1-4308-899a-6d9f0f793636" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="64e7202c-0a1d-4231-9dc3-9b914ef2daf9" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="40647b73-8c5d-4ca5-86cc-094a49d4e267" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="be528287-d842-4427-a6a1-829512cf3165" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="ed1ac220-0b4d-4443-9e3d-d2fdac5aabd8" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="4781a732-f773-47e6-950b-95b56cac5faf" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="46fdc60c-f045-4ecf-b2e0-ded180fbae90" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="4e1029af-48b2-4c67-aca7-96eca235fc72" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="cff8b88d-8a99-4eeb-8ff1-755c999e0797" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="d298ebf1-1c74-48cb-a869-49c4f1d74fe5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4ab27ffc-cbb6-4610-bbd4-3f98aa64fbd2" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="c74d0891-c699-418e-a9c6-a0ab7ef989c7" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="97f06564-0463-4c72-a3d7-631bebc0a012" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="20c667f6-5917-4f9f-9b14-d8d9f73761c5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="e8feeb66-1b36-41ae-acb8-cfbf78d5e28b" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5eae3e25-56e5-4b18-876d-81b3f6c2481b" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="a787eb86-bed6-4eef-9762-6a3d2df64ce7" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="3c74e87d-f560-43a6-919c-cc33aafea0cf" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="dba2f6c0-b2b9-4c3d-a311-c89db705c891" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ca253d15-4790-4aea-a56c-0541ced37717" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="77aa58bf-b509-4d02-92c0-d06bae1679c9" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="4711e795-0f0e-4906-8259-2ba60b352085" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="3acb8ee8-204a-4986-a12b-74d824a52979" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="681ea072-4b13-412c-9053-5a7fc3838adc" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="6e3a7f3f-b7e4-4253-ab8b-da97dbb5ed9c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="0b9de46d-e6cc-4428-8cd3-a803746936d7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="14348d7b-275e-4ac2-938c-048b584d238c" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="f535fd78-32b0-4176-a488-a0828ff975d5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="b052ef03-9404-427d-b701-933dc5dff680" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="d66cf92e-c054-4c51-96eb-e574bab69d50" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="9389a2bd-f334-4623-b4a1-a2e340854ae7" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="16960c18-796b-41b1-ad72-8103c4d7a8f0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ca42b1f4-d8de-4763-a5d0-7e44ca15332c" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="740de9ff-876c-45e2-acc3-493e8562e38b" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="bd4c7bc7-11c7-4a9f-af55-3bf6267bcaef" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="bd973ed4-5eb5-4340-82a6-6874a0c80e11" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="1757be99-05f1-4c58-9a39-72460090adbd" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="849ef8cc-7171-421a-a319-c594fcb587d8" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="c71cb0b0-d859-40fb-ba4a-a322aff4ba7d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="635dd7a9-17f4-4cd3-88e0-c22a9198a98a" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="60a976d9-13c6-4dde-8a6e-c8bdaa0a4c70" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="007958e9-3aa9-4afd-be02-8027da0ba781" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="7eac8329-d14f-4efa-8124-9a7551a20801" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="6d797bd7-db1b-4688-a04f-571ce0255c48" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="94cbd532-61a2-4c44-bf35-6c765b3e25da" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f2b15f16-bd39-4e2f-97ee-49fda56e52cd" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="40cfed60-ca84-4187-ad90-8cbc87b5431e" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="405f958d-bb24-4974-aeeb-9189622f00f2" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="8e4d9b0a-26cb-485d-bdfa-1fb3cfa21398" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="601e5b2b-95f0-4a2a-b61b-a1a41ed79dab" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="40133244-4d47-43e4-881c-a82944cf64e8" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="77f20852-de57-434f-bf99-00f914d2406f" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="c9452978-8b47-4e36-b093-4ff8a13cd141" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="0fcb49a9-d395-45fe-85f4-faf4ad1cf72c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="50223600-18a4-4e5f-9b42-10f234b6cc0b" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="f29e61bf-faff-4e9d-b156-97f7a9f0dbe2" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a2a7ca64-c83d-4b05-9700-b0767c91ff58" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="5a612db1-1a31-40e7-8cbb-164450487420" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="a88dada8-3ae7-4df0-8252-2e27f403d4ba" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="3074a38e-c715-45fb-bd6e-8cfd94da4e8f" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="36c1b362-49df-4e77-abbb-bf592ba4fc1b" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="7c7c766e-4cb5-4316-95e5-6c472754c7a6" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0b4c93a0-516c-42cd-85d5-32db42cd0648" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="d533068c-a898-41f4-a904-be7f53048bd4" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c2f04397-3c2a-49d7-96c9-76f9b3442370" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="27fe6c5f-4a36-4831-a9c1-aea3d12e55c0" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b1a1dd2d-c7f6-44aa-8394-82b074900138" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="e2b903d4-d200-41e2-b330-ae7b47f57e2b" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="61b9685d-d476-4ef0-9745-df5a9bd27167" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="576f9b84-1b63-4d54-a116-bdc9613607f1" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="7d12388b-a12d-40ae-b721-598af3fec50c" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="a9941df5-ed6f-44e3-b653-7fae4659bb44" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="920a8d76-d5dc-4937-b03e-329dd8c835a0" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="4d851399-bd02-40e0-a410-7c8018fc6640" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="08b7906c-3449-4a4f-af65-09fa63699caa" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="c9012ff4-0809-4ddc-bff0-9e2e9638ea0a" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="81b4aa96-5678-46ef-a15b-0e59636a1f8b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="39bd11b0-fb55-4f1a-bb30-1b6fc10f02a4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="b4daec91-b771-4250-b4e8-951245b53ea7" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="11cc81a6-8021-4dce-b3e9-5d38672ea4d3" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="2673d4f0-bbf5-467b-be9a-87d96b567cb9" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="f595681f-be01-4d58-9e50-84cd95c44cc0" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="b1a46753-7903-4982-99e9-d65ef7f66756" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ef6943c6-2a84-4847-b361-b5b8eed3dbe8" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="7a222be3-b56a-4368-97bb-90f7429bbcb8" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="50f589c5-e47e-41f9-afbb-903eb0bb4c7d" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="86eb9d4c-b77c-4106-b777-d345eae11104" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="0ddd36c4-f782-43a0-9366-dbc0aa0d38a8" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="d49ae14e-6cfb-437e-bf99-0c5c4232c22a" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="eeb1f220-cb7c-4328-a723-b6f4fd9565a4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="e60339f0-49b2-45dc-9a16-469e9e30daf4" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="c329bff0-e350-4539-afba-593b0165a7a7" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="6d9ef46d-857f-4955-90ed-b7f25cfd70c3" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="97a83c3d-a705-4cb7-9b4c-997089237cae" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="aa76149f-22f9-492d-8cf6-a8a7b803a679" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="ddb558a6-1ed2-4a66-94bf-df6fe8be488f" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9c567607-e073-4598-979f-9afd68034322" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}