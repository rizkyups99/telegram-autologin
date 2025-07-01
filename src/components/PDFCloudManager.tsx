'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, FileText, ExternalLink, Search, ChevronLeft, ChevronRight, Upload, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uploadToStorage } from '@/lib/storage';
interface Category {
  id: number;
  name: string;
}
interface PDFCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}
export default function PDFCloudManager() {
  const [files, setFiles] = useState<PDFCloudFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    fileUrl: "",
    categoryId: ""
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Cover upload states
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState("");

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
    let startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return startPage + i;
  }).filter(num => num > 0 && num <= totalPages);
  useEffect(() => {
    fetchCategories();
    fetchFiles();
  }, [currentPage, itemsPerPage]);
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Error loading categories. Please try again later.");
      console.error(err);
    }
  };
  const fetchFiles = async (title?: string, categoryId?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/pdf-cloud";
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
        throw new Error("Failed to fetch PDF cloud files");
      }
      const data = await response.json();
      setFiles(data.files || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError("Error loading PDF files. Please try again later.");
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
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        setStatusMessage({
          type: 'error',
          message: 'File harus berupa gambar (JPG, PNG, dll)'
        });
        return;
      }
      setCoverFile(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Clean up previous status message
      setStatusMessage(null);
    }
  };
  const uploadCoverImage = async () => {
    if (!coverFile) {
      setStatusMessage({
        type: 'error',
        message: 'Silakan pilih file cover terlebih dahulu'
      });
      return null;
    }
    setIsUploadingCover(true);
    setUploadProgress(0);
    try {
      setStatusMessage({
        type: 'success',
        message: `Mengupload cover "${coverFile.name}"... 0%`
      });

      // Upload the cover to Supabase Storage 'pdf-covers' bucket
      const coverUpload = await uploadToStorage(coverFile, 'pdf-covers', progress => {
        setUploadProgress(progress);
        setStatusMessage({
          type: 'success',
          message: `Mengupload cover "${coverFile.name}"... ${progress}%`
        });
      });
      setCoverUrl(coverUpload.url);
      console.log("Cover uploaded successfully:", coverUpload);
      setStatusMessage({
        type: 'success',
        message: `Cover berhasil diupload!`
      });
      return coverUpload.url;
    } catch (error) {
      console.error("Cover upload error:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Terjadi kesalahan saat upload cover"
      });
      return null;
    } finally {
      setIsUploadingCover(false);
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    fetchFiles(searchTitle || undefined, searchCategory || undefined);
  };
  const resetSearch = () => {
    setSearchTitle("");
    setSearchCategory("");
    setCurrentPage(1);
    fetchFiles();
  };
  const startEditing = (file: PDFCloudFile) => {
    setEditingFile(file.id);
    setFormData({
      title: file.title,
      fileUrl: file.fileUrl,
      categoryId: file.categoryId.toString()
    });
    setCoverUrl(file.coverUrl);
    setPreviewUrl(file.coverUrl);
  };
  const cancelEditing = () => {
    setEditingFile(null);
    setIsCreating(false);
    setFormData({
      title: "",
      fileUrl: "",
      categoryId: ""
    });
    setCoverFile(null);
    setCoverUrl("");
    setPreviewUrl(null);
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = '';
    }
  };
  const createFile = async () => {
    if (!formData.title || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Title, File URL, and Category are required'
      });
      return;
    }

    // Upload cover if selected
    let finalCoverUrl = coverUrl;
    if (coverFile && !coverUrl) {
      finalCoverUrl = await uploadCoverImage();
      if (!finalCoverUrl) return; // Upload failed
    }
    if (!finalCoverUrl) {
      setStatusMessage({
        type: 'error',
        message: 'Cover image is required'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/pdf-cloud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          coverUrl: finalCoverUrl
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create file");
      }
      const newFile = await response.json();
      setFiles(prev => [newFile, ...prev]);
      cancelEditing();
      setStatusMessage({
        type: 'success',
        message: 'PDF file added successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error creating PDF cloud file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to add PDF file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateFile = async (id: number) => {
    if (!formData.title || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Title, File URL, and Category are required'
      });
      return;
    }

    // Upload new cover if selected
    let finalCoverUrl = coverUrl;
    if (coverFile) {
      finalCoverUrl = await uploadCoverImage();
      if (!finalCoverUrl) return; // Upload failed
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/pdf-cloud", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          ...formData,
          coverUrl: finalCoverUrl
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update file");
      }
      const updatedFile = await response.json();
      setFiles(prev => prev.map(file => file.id === id ? updatedFile : file));
      setEditingFile(null);
      setStatusMessage({
        type: 'success',
        message: 'PDF file updated successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating PDF cloud file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to update PDF file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteFile = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pdf-cloud?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }
      setFiles(prev => prev.filter(file => file.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'PDF file deleted successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error deleting PDF cloud file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to delete PDF file"
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
    setCurrentPage(1);
  };
  const openPdf = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };
  return <div className="space-y-6" data-unique-id="fa261146-5d3c-4b89-89c0-a9c75c35ba66" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="4d67fa63-b56b-4981-a7ea-71c0240f8830" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="bba8ad68-9e75-4201-a90d-0aa8292f7546" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="9112edb7-8ef7-4c26-83f5-290f5c9aeda2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e019f40a-36ef-4c61-90b5-69acabe42d0e" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="93fa79a6-0707-4e03-8e7e-c1bfad1102ac" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="6bfad848-0efd-462e-83f5-9cc5f6399991" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="6015489c-f49f-4998-826a-f27dc4100fed" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1cd6e0a8-0873-4fdd-8920-2d25435e5c14" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="376285dd-a894-4c35-82b2-d1aa8e80a8b5" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              <div data-unique-id="90a308f6-b901-4697-8504-4be701b8210e" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="f110cac4-e260-4d76-ab67-951e073555fa" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="dcc876a3-62c7-4483-bdbf-8d425c7be89b" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="67e890cd-9321-466e-b04a-cd4dc0607617" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="b77cf8ef-0ce6-4f7a-9150-5f03cf0ba10d" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="09596bfe-4410-45ce-82a2-95b90f96346c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0dc7a82e-821b-4a8c-b77e-b4dd315510bf" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d273b7b6-a812-4207-89a4-6e75b47bd60d" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="58189040-bf9d-43fa-b45d-3f8a2c42c4df" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d9c3abcb-c61f-4137-a676-6a5439800d0f" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="37f2347b-16f8-4782-bd78-1b3b907bf3d0" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              {/* Cover Upload Section */}
              <div className="md:col-span-2" data-unique-id="b93f9de7-da94-434e-97ff-e974f41c5a49" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="fd69b4a6-a8c5-4a27-b7eb-b0895d05db68" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c438c7d0-ab8d-43d9-a979-0b78c4dfa318" data-file-name="components/PDFCloudManager.tsx">Cover Image</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="925f9495-10fe-4c42-8b2e-1668f977fc19" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverFileInputRef.current?.click()} className="flex items-center" disabled={isUploadingCover} data-unique-id="f50175c1-7fc2-4afc-85e5-267c6397264f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="eff84150-0be2-4647-8ff7-25584f5d4ddf" data-file-name="components/PDFCloudManager.tsx" />
                    {coverFile ? 'Change Cover' : 'Select Cover'}
                  </Button>
                  {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="3ee8e5da-10de-4345-9cbd-36e0aa30b8f0" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="84ff43a7-ba5d-4843-abda-2b8227d7ff15" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3ddd6bad-9500-40bb-b5c6-527e202b7e48" data-file-name="components/PDFCloudManager.tsx">(Will be uploaded)</span></span>
                    </span>}
                </div>
                <input ref={coverFileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" data-unique-id="e2ae3d73-0ab3-44ef-b367-92a05a316734" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="9b7cd27c-532c-4586-862e-7d5f19bda8c6" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8d088a00-ea65-4508-989e-165439889b9c" data-file-name="components/PDFCloudManager.tsx">
                  Image format: JPG, PNG, or GIF
                </span></p>

                {previewUrl && <div className="mt-4" data-unique-id="187b26ed-7b19-4844-a14d-565445b9453e" data-file-name="components/PDFCloudManager.tsx">
                    <Label className="block text-sm font-medium mb-1" data-unique-id="94c5364a-bf6d-4e42-9534-ad8ec6871aaf" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b63c54a3-6ed8-4481-ae60-1c155027c54c" data-file-name="components/PDFCloudManager.tsx">Preview</span></Label>
                    <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="a5179f67-4154-4875-851c-0e82efc4f4ee" data-file-name="components/PDFCloudManager.tsx">
                      <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="2a60f724-b05d-4e8a-a9d0-fe97f096b75f" data-file-name="components/PDFCloudManager.tsx" />
                    </div>
                  </div>}
              </div>
              
              <div className="md:col-span-2" data-unique-id="17f8bf91-e567-40a4-b973-0857c8eb3ed1" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="cdb96056-36f3-439e-b467-2ed7defe581c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d43e8423-fac0-4dfd-88d6-4e4f7d585c9e" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL from cloud storage" className="w-full" data-unique-id="2d8bcb70-3056-4bd0-b044-fc4d008c31b7" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6ac6b146-8123-4751-a799-65f3cd9497f0" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2b89a5a7-95f4-4a2b-926d-481a2653b8ca" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="aa17faeb-20b3-45c6-9252-ab1994b64825" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="4ea82b03-b120-47c2-9817-42762d83033d" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="931a86d2-6e41-4b77-9c9d-d6630fe61e03" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="6286acc9-4d59-4f11-983e-93f6243fdee4" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || isUploadingCover || !formData.title || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="adb3db8e-d4a3-4a61-984d-bbc5823ffb6a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading || isUploadingCover ? <span className="flex items-center" data-unique-id="ff094390-dc10-48a1-8e0a-0e21b590243c" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="01a76fb5-df44-40f0-a380-4892b5fe024d" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="da4c03f8-e7c2-4593-88bc-b996cffcff22" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {isUploadingCover ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                    </span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="a79093c2-088b-4a80-8fbc-c6daad66740a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d6d720d2-456a-495d-ad8c-2a0d6313768a" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="e844adf8-1208-4ae1-98ad-0d1825d51fd1" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="bcb24dae-b312-480e-880b-1ba609f3e2a0" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="c11ff558-9dfa-4dd4-9bc3-6430237f93e3" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="de671238-d643-4f19-a481-d958a8107620" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="07b47600-221f-4106-b93d-8a5b0f714587" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="df315935-5fd8-4219-85b4-c6231d6ace06" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="20b781fd-db8c-43b7-9bca-769f1f115f0c" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="8f6af46c-159d-499c-b7c1-7d468b1d12e0" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="b481f7da-0fc5-469c-b07e-ffd2a6c65cb7" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="1c618374-32d8-4531-9c80-c046af3daf89" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0e28d534-ed05-4790-96ab-cb0df2ab5d43" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="b3ed1527-df15-47b4-9ac8-922a5395febc" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="1953005e-4c9f-4948-bb97-eee70d8da6a3" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="29a18459-aa6d-457b-9294-66103da2b889" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="55b4d6dd-e97b-4a42-a021-9271cb85c69e" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5b77daa9-0c60-4d6f-9166-483f662d54b7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="7983c7bc-2d89-418a-b4bf-e9296ff59be0" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f3a3c05e-54fa-4974-b7f9-31d6c87fa399" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="3eb61288-e136-4ee9-898f-3cf5a08c9d12" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="1aba5788-2f8e-41c7-a68b-cbc03982b256" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="54dacc0d-a64f-4132-b0c4-589f3150b5bd" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="9b7959f6-2ca2-4d47-8cd5-d174318f5ac9" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="4fffe64a-2c5a-4b3c-9575-9ca0d6c48f72" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="56b6bcc8-7da5-4f24-b604-b49a95e5f918" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="ed7e5ffe-80bd-43b2-80d4-ae236dd33a35" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="5a5a1c55-14a0-4d5f-9529-ab3e8a750830" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="8ec392b1-47bc-4135-b101-dc50f751a380" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b49c4382-fc20-4c52-abdc-f561048af5ba" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="c36aa5ef-5796-43e4-bf7d-bf6969c1ddaf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="64cef666-d466-4559-8146-7698b73c43ac" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="f4a87553-ffb4-49d6-bf5d-265633d13a71" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="691a1c04-e0fd-47fc-a839-498b6903ca49" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="158429f8-edcb-4a0a-964a-4d9a98d095b2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="170a6d27-3798-49fc-8abb-de7f49827b2f" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="646d2730-53a2-4923-b96e-8159faa3d785" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="2e3ddbf5-44d9-4a4b-a121-457311ce29d5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2a244418-6713-4410-a8f7-9bf106bb0135" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="1bf2f814-73cd-42e4-be07-ca67718279ca" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cdb1b4bb-4bd0-48a5-ad83-a0125e8aede4" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="529622f6-c8f9-4410-b2c1-b7b9c074187b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b08365ef-16e6-49e0-8273-7e80b4ed1435" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="c9252d14-71cb-4196-b1ce-ead4657c8ebf" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2696e06f-d40a-4b54-aa77-d39c20bb078e" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="cd567694-9972-4d7f-8ae6-e07e32f90c4d" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="febad129-934c-43a3-8481-0d8fd096e7a1" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="3978863d-8b71-4d6f-8f20-85662ff286c0" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8a05a4f4-489a-4144-a84b-3c7e5b26cd9b" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6fad87f3-fcd2-49c3-97f9-82d7dcabac58" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="019cda3b-23ab-4406-8084-d41058e18001" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6b7ea8d1-e1a8-41e3-93f8-a39382265a54" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="7ead3c7a-6de1-4e72-b832-e7792815a6fe" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="8b8e870d-733e-4609-a972-291dee4ba4e1" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="4719290a-c281-4563-a157-ca680ea72cef" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="0f6129bd-99f0-4832-899d-70ab520cfd98" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="6fdae183-174e-4433-8a73-2ba25b99261c" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="2ce0c893-ccca-412a-9a79-93d7b5079f1e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="5d73a930-96e9-4714-af80-19cd58c68df9" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="98c5fbb0-e84a-47ca-b4ec-f87506b5b521" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="2b2cb830-f318-450b-8ce3-e8f3d9971a90" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="afc0fc4b-24d2-4907-80ba-d8bde20aaaf9" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="3e64d3f9-2507-48f3-a01d-d30260a3fb39" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="c21d61e2-5e36-401e-922a-a342b49a0e5d" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="27f7da74-d096-4bef-863e-6009397fc05b" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="1595ffe4-4421-4de4-8fce-10ce33755bde" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="2dcff393-34d1-425d-a540-07408bc56caf" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c4f90b13-50f5-4ab7-89de-f6629dd94106" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="7953c0c1-5c1e-4173-9781-b8cb0e98dd67" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="d09b5d95-7424-4382-a444-f8d2a5d81a83" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="7fbd540c-7b8d-4e01-942c-d2f4f3f94c6a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="1d9286c7-2b0b-47f9-bb53-7a40bf446ed1" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="9c08a2a6-6efb-43f0-a3ba-7a779e1f63e1" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c3386f0d-4bd9-4b75-9a8a-37c8ee4294fd" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="bca5ab00-3492-412f-a3c6-592ecd5688a2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="dcbaf3cf-f8ba-48f5-8a5d-849d3178de73" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="caec3534-0dbe-4c55-9d0d-c757814d1f76" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="510d8940-4126-416c-aa58-c9ea35703a39" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="80fb5d78-20fb-44bf-9b9c-7c3a98963e62" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0f2583b0-223d-4172-8fd3-2282032eccf8" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="81f48065-aec6-4d7f-9fd9-562a7de2be5d" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="3a95633d-5f1d-4687-a0f1-1fdffe1ecf3b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="57c57523-57fc-4bf8-b495-c4ec16c348d1" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="3310dd06-55a9-42ce-a511-5fa142d0e705" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="99fbbbdd-54a9-484b-980e-9039608baee7" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="500e6a72-6896-4f62-9c43-f010427318c6" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="66065256-b135-4ab5-80a1-52603fa47a41" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="478e1b6a-3cba-46fc-8598-24c67aafb996" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ef65aa89-1dd2-4e6d-afd1-32460a1bd7cb" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}