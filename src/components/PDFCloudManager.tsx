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
  return <div className="space-y-6" data-unique-id="adf0e2c8-0bd7-414b-bbd0-ce75e52a4862" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="def82dee-e479-401d-b20c-26196b710853" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="598d3956-0a82-4934-8363-73b871e6033b" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="122ec822-c89c-4b2b-b973-32f08a9389c0" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c17a8009-1258-4d36-8770-51567399dd0d" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="f3e425b8-71c5-4e28-bcf4-6d7ff71f4a17" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="f180663a-6ed5-4321-bb1c-877ddeb0dad7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="037ea93c-dd7e-474b-936e-3cc604b0f8dd" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="2bf4791a-4454-4464-875e-ac461332f2dc" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="02c92ab3-3a24-4324-990e-e3a66a87e76b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              <div data-unique-id="f2d20212-dc21-4b66-9ad6-b43776271f1d" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="35736aeb-e9ad-4ceb-8739-e4bce48a2aaa" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2210bb6d-2c42-49ff-924e-fad25fb6e672" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="0821851c-de4a-4b21-a2b7-f42ab27d078d" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="3d8d2544-be18-4d7e-9aa9-0e03c373bbb2" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="f81136ab-6194-45ad-8603-f3f5cb00899d" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f27ac0f3-49e1-4cac-9cd9-755252f62fed" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="3f7235fe-e69d-4b96-a0cd-f57f1da4b928" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="aa164cfc-0289-4312-9848-4a60e93bfb96" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="34647998-9581-46f0-88cb-c3fe2aada6bf" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="1dbb3223-7947-4e37-b305-41c4216f31cf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              {/* Cover Upload Section */}
              <div className="md:col-span-2" data-unique-id="9bbd6956-bdcb-44c0-a83d-39453d557f86" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="388e7cb4-96b0-4b25-9b74-128c509c5e59" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="954cc025-c74e-4058-8ce5-94ad8cca22dd" data-file-name="components/PDFCloudManager.tsx">Cover Image</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="b6c3cff6-f291-4412-8316-d5f86c37385f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverFileInputRef.current?.click()} className="flex items-center" disabled={isUploadingCover} data-unique-id="869ec85e-ff5d-4ec5-8406-5e80857f1518" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="6c81f329-80ec-48dc-9509-e90b69cd0668" data-file-name="components/PDFCloudManager.tsx" />
                    {coverFile ? 'Change Cover' : 'Select Cover'}
                  </Button>
                  {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="6c7ed85e-6c17-4df9-a144-2433fcbbfa88" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="05aabde1-8535-40e4-b04c-a4d702f37865" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="839fa13e-a63c-4411-a7bf-e385bbfd9eb3" data-file-name="components/PDFCloudManager.tsx">(Will be uploaded)</span></span>
                    </span>}
                </div>
                <input ref={coverFileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" data-unique-id="6ab1974d-61db-48e4-9eb4-565baba5539f" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="c0c2fdc3-9618-475b-ac65-efa097db9375" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="131a0f66-91be-4963-aa2f-1583fa02a416" data-file-name="components/PDFCloudManager.tsx">
                  Image format: JPG, PNG, or GIF
                </span></p>

                {previewUrl && <div className="mt-4" data-unique-id="4784d17a-b774-418b-adbf-84f8e57ce4e1" data-file-name="components/PDFCloudManager.tsx">
                    <Label className="block text-sm font-medium mb-1" data-unique-id="ac2ef7dc-4c22-446f-be81-f280a27086b8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0e9d10a0-f442-48a6-9462-23bb97adecde" data-file-name="components/PDFCloudManager.tsx">Preview</span></Label>
                    <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="ddd13594-7cf5-40ec-813b-303586275280" data-file-name="components/PDFCloudManager.tsx">
                      <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="9292abc3-c1e6-47b9-9379-cd4b7b7d9b64" data-file-name="components/PDFCloudManager.tsx" />
                    </div>
                  </div>}
              </div>
              
              <div className="md:col-span-2" data-unique-id="836c86b6-a061-4e4a-ac70-b20219eba66c" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="f7834c7e-53dd-4d20-aa86-4e42addf1045" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4693560d-de72-4a35-b430-d5b14a6f6ab9" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL from cloud storage" className="w-full" data-unique-id="78a1cc24-e422-4ae4-a49e-9d6949d9f6e2" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6ecb09d0-6c70-4c67-8778-f8d746b68859" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="1d1b5b47-bbc9-48e3-b5e4-fee43a7d1f8f" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="466e6b33-2123-4836-97b1-e705b544ade8" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="7301c391-8460-47c5-877e-5442845db093" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="9aff71c8-419d-4cf2-8a46-282f567b5581" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="236c38a7-78d1-4cce-beb3-fbf1eac23cc2" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || isUploadingCover || !formData.title || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="c57ecf89-73bd-4f91-b236-bc671ccf376e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading || isUploadingCover ? <span className="flex items-center" data-unique-id="262e5785-b226-4fe7-bc59-80ba561baae8" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="d9328804-30f8-4ed5-ac25-a2bda94d0aef" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="47e330a0-c354-4ea8-bd35-e5a5f0f8abe4" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {isUploadingCover ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                    </span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="52fc64bf-a543-406c-98c8-2dbd663d2355" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8942dbfa-d259-4fb2-a000-6b6d632518d5" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="02462816-4e65-4477-b98e-913cfd504c4f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="993da0d2-8f96-40aa-a173-d36fd8932b5d" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="79809025-827e-4132-acb4-1c160097f059" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="1d257343-b31a-4d98-aaac-2452d5fa20ea" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="7407f0a1-ac8a-4a16-b503-5f9732ac4a05" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="16460f75-f8da-4b62-87f8-10c0d87175ac" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="bf3a409a-b877-40d0-a787-c0c1ba4540c8" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="b39462b5-46dd-4ab1-9084-67632ba34cce" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="d6db740f-c191-429f-ba60-0ae9fdab8a8f" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="467030ad-7b73-420b-beea-5483c4ae7f3d" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f4dc5967-f049-4c50-9717-4e04e0a790ff" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="94770dab-ca1a-49fc-b0ba-818dd8d35ae0" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="6ecb9b75-737c-43af-9bb5-bdbaa407013c" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="6827b7b5-7b61-47db-b6ae-c47e05f5ac76" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9ddd0561-f2c9-45af-beab-a849f74120ed" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4746cdb2-a3f4-4065-8cc8-d59bc981c642" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="02f8d3ba-4697-44b8-8268-3ccc374f6fbb" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="86c573b7-0c65-4b13-8f3d-855f0e096d91" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="fdc77a79-3bde-4359-8f74-197b2a725996" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="d00ec864-7c08-4c40-b4fe-0b812c50041f" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="e9bb748d-0e39-405d-a300-0ff6d05b2523" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="1e25d8aa-0707-4846-a82e-94660b32c76b" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="1da3daee-de1b-44a1-9bd8-181a294e025a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e923d5d0-22b7-49c7-98a8-206ce51429d1" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="e5fa36c4-f83b-4763-80d4-f500314299fa" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="92db302c-ce8b-4797-9abf-26716f64e9e8" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="1bb475a5-c7b1-4496-b7f0-6f466b12c22e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="78c00b01-7624-46c9-958f-da4f9d73d4f2" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="a44e3d3e-5d47-487d-aae3-943f406c6bd2" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3c4e2ed8-400b-4972-87fe-d741bbcc91e0" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="703b1aec-279d-44da-bc1c-f388189b0db0" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="f174c5b0-7611-4fac-bff4-46385b2e2c58" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="16402dfb-4d79-4a8e-b782-fabdefa5dd56" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4f080af6-190e-40cb-983a-aa6844f3eb87" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8a5bba2c-d563-48e6-a49f-225f19c26dae" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="f45d962d-5dec-4552-8ded-b426327c7ac7" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a9ab185b-f4f2-49cb-b2a2-f46e9ddae55c" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="3aa62f03-e0ec-4101-a388-a57c12bd45f5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8e47853a-b35a-48c9-8755-e13b278d421e" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="d6d5c9f2-07f7-4ec9-8791-4b8baa0a7d31" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="55d6c46e-a046-4abd-acbb-93c00d271dde" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="b7a67227-c5ab-4571-af37-fd370e4ca8fa" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="20965d71-a1f2-45d9-ba32-d57e485ca708" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="7374764b-4d50-4610-a858-7d2d7caaaf81" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="cbb8b393-1d78-4710-b90f-22035ba014db" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="b282318d-e19b-4120-a6f6-36d8806be8dd" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="06327827-7be0-4d75-9b0c-0ef346692b0a" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="1fdad93f-e80a-4b81-abd8-c34284c23891" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="bcc98047-659e-4e45-af80-10931f544687" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="70dca438-b3cf-464f-bb2f-b00bfaead642" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="9d9100e8-59f0-4011-b1fb-8d65042f2498" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="a54c0722-ee4b-4d08-ba36-038b4c07c4c6" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="735a3565-2d6f-47d5-8a44-36aa1e5fd320" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="3b2c1e69-2434-4ada-b186-50b0d229e39f" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="962fa4e3-f226-43d4-a9fa-8e19808386d9" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="d9b38db9-5dc6-4ff5-bb30-7e992e1d5647" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="3cfc245e-06d0-4a4d-afab-97a8e9f49f7d" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="5b49c11e-1151-4644-84e6-c9daa413aa24" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="b9df9bf3-fe7d-4485-b1bf-0923ef9a5a0a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="e7f75b94-321e-4c6a-95d7-324680d88243" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="486ed0d3-0119-4006-9be6-33e9b1f02907" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="7000fa6b-702c-468e-aad2-4d3fe1dbfecf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="465390cd-ffd8-41d0-8898-90ae9ee50e82" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="3a922cee-998c-421a-9d7d-bc97c017a601" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="0ff55f90-ae35-4094-b6f0-f54e44af522a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f580dd52-64b0-44cf-aa21-6818b15b84d9" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="36fc61e3-c73c-4133-967a-5305198bcc12" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="93b8d110-7c6d-429f-9ec8-b10787b5dc40" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="790ce501-c1b5-465e-bb66-76dc7feb04b7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="c8262f66-9ebf-4828-9be4-4ed8f78ff7a3" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="4060e0b9-2d32-4b56-9287-011cb205d1a1" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="708d7c3a-0cd2-4f54-b232-13ed48f947fa" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="43022b7c-60a1-4ba5-95e8-0aab9f9a080b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f5e691c5-c7cc-4be6-9936-48698c995e85" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="acdcbdfa-a3d2-41d4-afd0-4b7b7f964144" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="c4f7951d-91e4-4fd2-9768-a8d42b1d6a06" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="e96f45c9-91dc-4e6f-a38c-5f30e7201ca2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="1313f86a-dede-4342-9664-7faa9c3c22bb" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="bff12180-62b5-4889-8ab3-a9a46acf214c" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b6ff94bd-b0ad-4917-8afe-dc7126722e4f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="d27b6185-5202-4a3f-9896-0a3e5211cef6" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="122f3f33-f379-462b-b9ea-78b5a29ec1e5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8ee46a6e-2a48-455b-a339-c1d40c4643b9" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="dcfeb804-8595-45b7-8f5d-d6f04fa48ba4" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="2de6c627-eccc-49cf-b59e-d3a0cd43c4a3" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="ea0df393-ebfa-4b7f-86a6-f5a6ecd175f8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e05417c7-6b51-48c1-8a5e-008df7e48d1c" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}