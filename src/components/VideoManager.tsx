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
  return <div className="space-y-6" data-unique-id="159e6b25-7256-4b87-8bff-284e05173b52" data-file-name="components/VideoManager.tsx">
      <Card data-unique-id="13cb6e84-9980-4db6-8359-777f1530f586" data-file-name="components/VideoManager.tsx">
        <CardHeader data-unique-id="5dbb848e-8fa3-4db9-b3b6-c8f9bd46ae4f" data-file-name="components/VideoManager.tsx">
          <CardTitle data-unique-id="bf930eef-883b-4035-8dd5-81bfdebea677" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5d8a1e8c-a901-424a-8e63-fa083649d96a" data-file-name="components/VideoManager.tsx">Manajemen Video</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="052f6018-b364-4d46-81f0-a4907a2932cc" data-file-name="components/VideoManager.tsx">
            Kelola URL video YouTube untuk pengguna
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="d1fbe519-8cd0-4556-b0ab-f1c15eec23d4" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="684be7e6-78b0-4016-96bb-d10a59c93a64" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c316569b-e430-465f-aafe-fdcc0109533a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4" data-unique-id="81689fdc-8ee0-4ca1-b8ad-ad28e6597ad7" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              <div data-unique-id="f0ef3265-a817-4acd-9cb8-bf6a3b941517" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="297b969c-79bd-4268-9325-a206cb6d19bd" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4c677cf5-b17b-475f-8d2a-8fd95beec80a" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Masukkan judul video" className="w-full" data-unique-id="a321dd6d-1b89-4ff4-b6c2-860722997725" data-file-name="components/VideoManager.tsx" />
              </div>
              
              <div data-unique-id="1027da47-cc54-41bf-ae5c-000b93e6147f" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="7966f7a9-975d-496e-8581-acaf5829d4dc" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2e0a8586-a3fc-48f4-9d86-056dbded9029" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="a9216928-01be-4129-ad2c-a8a5668ac557" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="b734424c-3a67-4a95-9dd1-223c6c0ae68d" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="5863a856-0d66-4830-a5cd-095d04c83cd7" data-file-name="components/VideoManager.tsx">Pilih Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="cd61d802-f7fb-4738-ad97-60bfa0d191cc" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="884cc0ca-2ea2-404a-89c1-7a17f0d27aca" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1" data-unique-id="740c1c16-17db-4725-b820-c7b3516d7656" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="01ec08c8-d7c0-445f-aada-e0e056eb2110" data-file-name="components/VideoManager.tsx">URL Video YouTube</span></Label>
                <Input id="videoUrl" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX" className="w-full" data-unique-id="1126edd2-31f0-4d2c-8326-6640e60d5286" data-file-name="components/VideoManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="13bacfdc-dad9-4727-b9ac-c771af94a9bf" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="c7c8a292-2052-4ccf-a4ef-0887fd06a03f" data-file-name="components/VideoManager.tsx">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </span></p>
              </div>
              
              <div className="flex justify-end space-x-2" data-unique-id="8ab1b010-b19a-4482-a818-694189e503a2" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                {editingVideo !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="4a972080-87c0-443a-809d-559ddc8ae023" data-file-name="components/VideoManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="56b17d5f-5960-4dbe-9689-53c1de1c5145" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="09b5d9a0-af1c-421f-9b7f-a0098915d633" data-file-name="components/VideoManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo} disabled={isLoading || !formData.title || !formData.categoryId || !formData.videoUrl} className="flex items-center gap-1" data-unique-id="a13992ec-9147-4a13-816e-9a2f3aca2e68" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="886de5bb-5177-4e65-9991-2851840eef35" data-file-name="components/VideoManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="bf708d93-52f8-4d25-b799-bdad4f1421ad" data-file-name="components/VideoManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="5ba637ae-dd65-48fc-9388-95fc9dcde744" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="7453a846-9f8d-4baa-b069-3b182d40dc5c" data-file-name="components/VideoManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingVideo !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="3e323fc2-ee59-4e07-9bde-afba6132bae5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="90688f38-9d5e-4ec9-839e-5c903b73e6d7" data-file-name="components/VideoManager.tsx">Perbarui Video</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="b43eec38-1267-42ef-8ee2-27c732576bf9" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="ee31dcda-8146-4672-9234-a7acb206d31f" data-file-name="components/VideoManager.tsx">Tambah Video</span></span>
                        </>}
                    </>}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="2f58befa-2521-4262-b9e8-d11a5316b3c0" data-file-name="components/VideoManager.tsx">
                  <div className="flex items-center space-x-2" data-unique-id="c645ea63-713a-44c5-b97b-c41d4b345e02" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="c8741a60-d922-4b9a-b125-5b7f41f6f6c8" data-file-name="components/VideoManager.tsx">
                      <ChevronLeft className="h-4 w-4" />
                      <span data-unique-id="0f625b7c-461e-45ea-bf1d-1982258ce09e" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="256ad318-39f1-4279-a1ce-b4c7ed769762" data-file-name="components/VideoManager.tsx">Previous</span></span>
                    </Button>
            
                    {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="5dc776f7-12c9-424a-bf14-26f4eba01762" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        {number}
                      </Button>)}
            
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="c1409e0b-7f9f-4a65-9f88-8a030cafbd9f" data-file-name="components/VideoManager.tsx">
                      <span data-unique-id="673dea27-ed8c-441b-af79-524075d536b0" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d686d54d-ac07-4252-bb42-167a9a79ba0f" data-file-name="components/VideoManager.tsx">Next</span></span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>}
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="0b85b444-d4c6-43cb-aae3-f5a6048bd952" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="413bd3c6-71ea-4f5a-8548-2d2959ea6c9f" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="84032735-b94b-454b-9c4c-c3b22832d28c" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="d030a0f8-e81e-4259-88e4-e6356b49f562" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9b26881e-1bfd-447f-b6eb-cec386e973e7" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="c36036c1-e264-4f7b-a59b-9817dee31695" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="56d89207-1367-4e8c-8233-9144b8af17b0" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="bc8b2074-4fa9-4802-92cf-88fe7eaae04c" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="b6688e49-ca59-4eab-83b3-858118335592" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="c683410a-4caf-48f4-8e2b-0d445062dc58" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="77523927-988f-4e2a-8184-db5c6ae4206a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="2f00d826-ab22-4529-9856-db6610fc1aa6" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <h3 className="text-lg font-medium mb-4" data-unique-id="27b73ff5-9f73-458b-99e4-28df448b8367" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="eca17617-1afb-48cb-8122-e808d5993c58" data-file-name="components/VideoManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="5b1b07db-b2cd-45ae-863b-17396fdd6115" data-file-name="components/VideoManager.tsx">
              <div data-unique-id="dc0577a6-fe7a-42b0-8227-1513e9581100" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="8bd7210e-1615-4a36-9c1d-d6cf6d5ad297" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="4a918a48-4309-48d7-9f6d-762342ba3ba6" data-file-name="components/VideoManager.tsx">Judul Video</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Cari berdasarkan judul" data-unique-id="04e7103b-6c8f-41b2-9586-ce90986a339e" data-file-name="components/VideoManager.tsx" />
              </div>
              <div data-unique-id="2bc3c038-d8fa-4375-8e81-fcc3da96f726" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="cf46b4bc-a884-4236-937a-50e283b6f131" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="79adc9a9-0d8a-4cdf-ab37-141d239b5d48" data-file-name="components/VideoManager.tsx">Kategori</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="63c76d13-e25e-47d0-a556-0a01da9eb2e8" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="10f7f37b-eae6-4950-95c3-17739eac71f3" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e7bc2eb7-f845-446f-acad-2239a6237b56" data-file-name="components/VideoManager.tsx">Semua Kategori</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="38abe038-0276-4911-908b-af722628344a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="6ae58515-8cf6-4d67-a76d-1d1a5c1bcfad" data-file-name="components/VideoManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="aec9fd9e-3da9-45d4-aae8-6e31cfe26d79" data-file-name="components/VideoManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="0d8c46f6-cac0-4898-b794-219ab3e49f4b" data-file-name="components/VideoManager.tsx">
                  Cari
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="6a235972-ee82-41dc-b5e1-6caca776b730" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="80dc74e0-4d91-4a12-ae48-97bc59c9446f" data-file-name="components/VideoManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="3b760465-fc88-46e7-909e-6219f1b08db3" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="8c95f332-bdd3-490f-9197-00131b290809" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="efaaefda-6c81-4af7-8488-978dcd98c5f7" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="b883128d-7875-40b6-9e31-ade5a76a2d21" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="8f44065c-f561-4022-a4a8-b3391e695931" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="e9a8d7fb-f8b1-4a5e-ab36-176a8d8920f5" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="6710e021-11d0-4de1-8097-97f309315a3a" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="95d083c9-eba1-4772-aeb8-a969216d8066" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="542c51cc-4a3a-469e-9ea3-a72c91a884fe" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>

          {/* Videos list */}
          <div data-unique-id="2745b0a3-6568-4441-8f97-eed324f674cc" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="1614a420-1ae8-4431-bf41-aab3865fb91a" data-file-name="components/VideoManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="2e21206d-e3b1-4b8b-9f18-31ffd3ba6bc5" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="e74c3721-5b43-414b-9e71-d4c83d647127" data-file-name="components/VideoManager.tsx">
                Daftar Video
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="a485664e-99d5-4268-befb-6b3b010eeb3b" data-file-name="components/VideoManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7a2a7938-b063-4d99-94fb-8205bc47fb04" data-file-name="components/VideoManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="1c3a79d9-4206-406d-8b0a-aa64cafb49cc" data-file-name="components/VideoManager.tsx"> file)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="e1cd396e-adeb-4085-a75a-932ad75bf929" data-file-name="components/VideoManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="6f43809c-1b07-44f3-a9d8-270737e736cd" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="3a6ccb66-7d63-4638-9f4f-7551fb66956a" data-file-name="components/VideoManager.tsx">Tampilkan:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2e4d6af9-3fc8-4899-98f6-2a8885e47901" data-file-name="components/VideoManager.tsx">
                  <option value={10} data-unique-id="171702a9-878a-4ff4-950e-b2a7e1ef4796" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="eafb8802-33a9-44c1-929b-ddfdfdda154a" data-file-name="components/VideoManager.tsx">10</span></option>
                  <option value={50} data-unique-id="9ccda92e-4c7a-413a-9572-82f8078f8b36" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="2641ff60-5f8f-439f-a6c7-084e118d8dc1" data-file-name="components/VideoManager.tsx">50</span></option>
                  <option value={100} data-unique-id="bf20bf76-6f6f-43fa-a60c-e3867b1625c9" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="d2701e59-b57b-4e84-ae82-d21eb684feb3" data-file-name="components/VideoManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="808627a8-8eed-4daf-b721-891023ef2b2e" data-file-name="components/VideoManager.tsx">
              <Table data-unique-id="fb6927f0-d089-486a-a66f-2e12be5c48bc" data-file-name="components/VideoManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="c4c6fb2f-cdd2-4f4f-b656-964050079751" data-file-name="components/VideoManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a72d2bb2-54a5-40fb-9da7-543387eb5ac7" data-file-name="components/VideoManager.tsx">Judul Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f2713f0a-b948-4a87-bb3e-7df4c546f967" data-file-name="components/VideoManager.tsx">URL Video</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f5f6aa66-c305-45ce-b529-ba47e1784dea" data-file-name="components/VideoManager.tsx">Kategori</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="b474464c-c71b-4c4e-a0ef-f6ff11b1217a" data-file-name="components/VideoManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="4fd03721-74ef-491d-a310-31bba5e7199a" data-file-name="components/VideoManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="3fa446b9-41ba-4350-9e5e-fdd4d747a761" data-file-name="components/VideoManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : videos.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="e0d06e17-ead1-4b21-b23a-3f77cc84cf90" data-file-name="components/VideoManager.tsx">
                        Belum ada video. Silakan tambahkan video baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(videos) && videos.map((video, index) => <TableRow key={video.id} data-unique-id="bc3a06a6-842b-4bc8-bea4-d3823c009363" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="9e9593a7-4d1a-4269-a8db-e28e0bd76c78" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="c9dafe2a-22f5-4c55-8a16-805e0f76ff38" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.title}</TableCell>
                        <TableCell data-unique-id="b2f5bc53-75d0-42e2-b759-fc6d60831909" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center gap-2" data-is-mapped="true" data-unique-id="089276c9-9b08-4492-ae21-c02cc4305146" data-file-name="components/VideoManager.tsx">
                            <div className="max-w-[200px] truncate" data-is-mapped="true" data-unique-id="c3e6700f-8deb-4174-b906-c38758a2d8da" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                              {video.videoUrl}
                            </div>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => window.open(video.videoUrl, '_blank')} data-is-mapped="true" data-unique-id="b0e7dc39-b0ae-4598-abff-9344d20d4887" data-file-name="components/VideoManager.tsx">
                              <ExternalLink className="h-3 w-3" data-unique-id="fdf9fc94-7a62-4515-80c8-0cbbc25d9965" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="6716e440-4b28-4f9f-8a7a-f8fde8a5be66" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">{video.categoryName}</TableCell>
                        <TableCell className="text-right" data-unique-id="7ce32a19-9a37-4aa3-a610-3b50c2caca15" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="b80bb814-1c74-40a9-ba0f-022d921fb276" data-file-name="components/VideoManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(video)} disabled={editingVideo !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="e43d0e95-f6b5-46d0-aaf2-7bf489867f1d" data-file-name="components/VideoManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="e955ef01-145d-47dc-afce-022ded95c153" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="f33dfdf3-bc15-4319-b9f9-f7e268bd9b8d" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="f2e10d05-1a2b-473c-9fdd-7a366eb4fe71" data-file-name="components/VideoManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteVideo(video.id)} disabled={editingVideo !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="ed96eef3-1205-4af8-aec9-2ce3b8548809" data-file-name="components/VideoManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="f31f609b-10f0-4378-971c-e830e58f8dec" data-file-name="components/VideoManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="131f1e0c-b249-4b6d-9e72-db9ae9f82d10" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9280b6b7-b15a-4c7d-8c97-77bfeca1f4eb" data-file-name="components/VideoManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="7c110532-59c3-43b9-9e67-86e31d921619" data-file-name="components/VideoManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="c89d7d67-cdaa-473f-94b7-80d07f2bba9a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="f139372b-c62d-45b5-aded-02d733566097" data-file-name="components/VideoManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="9307e8d0-bf0a-4f2f-a44e-1c4103983afa" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="9675474b-5315-4149-b9c2-b459fb3673bd" data-file-name="components/VideoManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="2d13822e-1e2a-49c0-b19c-12d48f5c555a" data-file-name="components/VideoManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="d87d6876-33b5-43b2-abfe-d34c116d086a" data-file-name="components/VideoManager.tsx">
                    <span data-unique-id="a466f532-3371-4346-9ac6-7078ebe125cb" data-file-name="components/VideoManager.tsx"><span className="editable-text" data-unique-id="531391e6-52c1-42ef-85b2-69e6e366a6fb" data-file-name="components/VideoManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}