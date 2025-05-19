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
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Filtering state
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  
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
    const { name, value } = e.target;
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          videoUrl: formData.videoUrl,
          categoryId: formData.categoryId
        }),
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          videoUrl: formData.videoUrl,
          categoryId: formData.categoryId
        }),
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
        method: "DELETE",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Video</CardTitle>
          <CardDescription>
            Kelola URL video YouTube untuk pengguna
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form for creating/editing videos */}
          <div className="bg-muted p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium mb-4">
              {isCreating ? "Tambah Video Baru" : "Tambah Video"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium mb-1">Judul Video</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul video"
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
                <Label htmlFor="videoUrl" className="block text-sm font-medium mb-1">URL Video YouTube</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Masukkan URL video YouTube (contoh: https://www.youtube.com/watch?v=abcdef123456)
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                {editingVideo !== null && (
                  <Button 
                    variant="outline" 
                    onClick={cancelEditing}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Batal</span>
                  </Button>
                )}
                <Button 
                  onClick={editingVideo !== null ? () => updateVideo(editingVideo) : createVideo}
                  disabled={isLoading || (!formData.title || !formData.categoryId || !formData.videoUrl)}
                  className="flex items-center gap-1"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Menyimpan...</span>
                    </span>
                  ) : (
                    <>
                      {editingVideo !== null ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline">Perbarui Video</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Tambah Video</span>
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
      
              {/* Pagination controls */}
              {totalPages > 1 && (
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

          {/* Status messages */}
          {statusMessage && (
            <div className={`${
              statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            } p-3 rounded-md flex items-center`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{statusMessage.message}</span>
            </div>
          )}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Filter Pencarian</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1">Judul Video</Label>
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
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Cari
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
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

          {/* Videos list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Daftar Video
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
                    <TableHead>Judul Video</TableHead>
                    <TableHead>URL Video</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : videos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Belum ada video. Silakan tambahkan video baru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(videos) && videos.map((video, index) => (
                      <TableRow key={video.id}>
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="max-w-[200px] truncate">
                              {video.videoUrl}
                            </div>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => window.open(video.videoUrl, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{video.categoryName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditing(video)}
                              disabled={editingVideo !== null}
                              className="flex items-center"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteVideo(video.id)}
                              disabled={editingVideo !== null || isLoading}
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
