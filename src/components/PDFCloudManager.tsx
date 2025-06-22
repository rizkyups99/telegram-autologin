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
  return <div className="space-y-6" data-unique-id="6ef04cf6-5e31-4329-b8db-887031f7b5dd" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="d3d953fb-1579-49da-be8f-d955b954af85" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="60012ecc-c8c3-4b93-af53-cbf55aae5996" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="7b4b7618-23bc-452f-b1ed-48e335196ca3" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b8f6b74c-1ce9-4dc3-90ee-92b573899a20" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="4e62f977-c9a7-41e2-b9c0-d9a76747bd6e" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="32e6bfb5-1db9-4572-bb3c-f30196732e2e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="09120631-6cf3-4ac2-b162-f5ebd6930362" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="46ccd6e7-6bdc-4018-8a30-7168b0308155" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="56a61e58-6f06-4d78-93c1-4aebdb35d3cf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              <div data-unique-id="d16747a8-fda4-44c1-9a86-cbdfe405bf79" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="90aef578-50c8-45da-bd61-9cd2cbbe41a0" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3dcb153b-396c-48cf-9e7f-ea8d01a28ffb" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="31b1eb48-807e-4ccc-9b71-23711a562504" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="1494b6ec-5bb7-47c1-8b24-4816dd26b84a" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="9cab3796-c3d1-4db8-ad83-ddfa7eb512a7" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3e9a4dc4-d160-4be3-a123-e06b80b9a614" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="46231ff0-6103-4551-b702-5ddf9c143ecd" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="692193c2-6d2f-451a-929a-a6cfbb2f0e90" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a03250e6-6ba5-43ff-9759-170de681aeee" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="89f88d3d-be9e-4cf0-ba3d-7ee72eb32e65" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              {/* Cover Upload Section */}
              <div className="md:col-span-2" data-unique-id="701a370a-7efc-4350-a409-d2673346ff6e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="c4cfd03a-e0b3-487f-b536-78e00a8e2d60" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d205c1f8-47e9-4953-b1f7-4d0484b92b83" data-file-name="components/PDFCloudManager.tsx">Cover Image</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="610d48df-ce79-4d13-addf-0ae7f86422af" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverFileInputRef.current?.click()} className="flex items-center" disabled={isUploadingCover} data-unique-id="9a40d0c8-2890-4093-8dca-a3cd6bb93da0" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="9b55952a-de32-46ab-b14c-28b3993ce54d" data-file-name="components/PDFCloudManager.tsx" />
                    {coverFile ? 'Change Cover' : 'Select Cover'}
                  </Button>
                  {coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="d9851c00-1fa0-408e-a675-6defd5f9a117" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="bfbc382f-b963-4ac9-9c7a-ef69fd7482f8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="bfff55f1-7d0b-4edc-9967-22dcbe6dce41" data-file-name="components/PDFCloudManager.tsx">(Will be uploaded)</span></span>
                    </span>}
                </div>
                <input ref={coverFileInputRef} id="coverFile" type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" data-unique-id="c15d20a5-ee6a-4f61-9f6e-348fe999ad8b" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="fd72bfd2-961c-4a33-8319-5502e3981d98" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d201a818-dbdc-4764-bd5f-3c2929fc07b5" data-file-name="components/PDFCloudManager.tsx">
                  Image format: JPG, PNG, or GIF
                </span></p>

                {previewUrl && <div className="mt-4" data-unique-id="96bf89be-0db4-4d5b-b4fd-80f8d59fee8d" data-file-name="components/PDFCloudManager.tsx">
                    <Label className="block text-sm font-medium mb-1" data-unique-id="fd685501-82f4-4f61-8601-06a0622e2123" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="fabb5fea-8486-4c6d-aecc-2b99ad08a6e8" data-file-name="components/PDFCloudManager.tsx">Preview</span></Label>
                    <div className="mt-2 relative w-40 h-56 overflow-hidden border rounded-md" data-unique-id="5735f532-f7cd-47b9-b540-85c7cdecc5bb" data-file-name="components/PDFCloudManager.tsx">
                      <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" data-unique-id="08805940-5a21-4803-beb2-5c80ca43aade" data-file-name="components/PDFCloudManager.tsx" />
                    </div>
                  </div>}
              </div>
              
              <div className="md:col-span-2" data-unique-id="40fb4a70-624c-4252-86bc-c415ac86f305" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="73190aa5-7673-4101-8fd4-d23fcf2fadd7" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="192a384c-d20b-4224-a0a4-678f5c0de4b0" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL from cloud storage" className="w-full" data-unique-id="d01deea0-6a83-489d-9423-5db3ab637840" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="765a14c1-c79f-4612-b7c4-ba9d8fcfb2f1" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cd37fe9a-7c9a-4db4-8faa-a90b4f8cb660" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="19e28545-08a3-4cff-9739-dc6cc9cbd2a7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="770e1c4d-2b7f-4904-b523-5ae804549e34" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="7a16730e-3bba-44f7-825f-49fc38a2372c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b2781a63-b61c-45b1-b046-67542edc8ae4" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || isUploadingCover || !formData.title || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="e55514d8-f18a-4cd8-9c97-9185c66348ab" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading || isUploadingCover ? <span className="flex items-center" data-unique-id="d2ced70a-5738-4540-8956-17f2fd817cad" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="d9390471-9fc9-4e31-a490-af5b5105064d" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="ffb314c1-b314-44f0-b2b0-bdd42c81d68a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {isUploadingCover ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                    </span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="19d09dfd-aa92-4bce-98e4-7459b194dff8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4adda7f9-68f2-48d7-9568-04c9683db3b7" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="197ce9de-863c-4ec4-89aa-d7054106da80" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="aa46896e-5caa-48e9-9b40-766471b0acc2" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="995ba072-5542-4b16-8d48-62d7832d05ee" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="7c333ad1-372e-4fa2-beab-d91940cd14da" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="bbc71210-6cc3-4ef0-9d30-355bfdf44867" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="bf35b2d3-5e5f-441e-a6f3-c908467fd3fd" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a715c07b-da4f-4aa0-afe2-10a2c2f9aa14" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="6b126ee5-8d32-4ecd-8538-e4e8f0032538" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="b4d8076f-8649-4870-98fd-92fc5aad4617" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="7119ecf3-551d-4e9a-a31c-b06253423496" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4c71a6d3-c4e0-480c-9d11-7eacfe08c507" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="999426a3-b4d9-4181-9389-b8f9f2aca8e3" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="a4131ade-a3b6-4880-be45-b849b2c7e551" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="81cfb3e0-49f6-45b3-a71d-26cbc988fb90" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9f524d22-eca5-4d1c-86ce-2aee74acdd6e" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2bbd1faa-66e2-4ddb-95c9-f57a45bccac1" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="76c8a53a-1a47-4b7a-96c8-bc82f382ce5c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="721e6b3b-25f3-4a34-9842-1449e4bd37f2" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="301338f8-75c2-4c3c-bcd4-920f06f61821" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="10bd7d15-2e08-4bca-9907-4f447572755c" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="727cc13c-c9e8-43ef-822d-6448f28b5731" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="b14596d6-f9a5-441c-878c-2638edbab767" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="28adc8e1-228d-4f54-b841-f5bed218b075" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3ceb85ff-d81d-41ec-af87-49aa0eb97d0e" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="3f4abc5c-2ff9-42d6-8b30-adc232d8089b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="5bff2bf6-8c20-46e7-a64a-a016b10f8f2e" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="2cd663be-e194-496f-aea2-09afd569642a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c59785e4-69cc-4be7-9a73-7b42f71fed5d" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="47a6b370-c5dd-47de-b6bf-8a29ccb8b27b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="37900cde-6dca-49f2-b471-483ecaae1f47" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="db114926-323a-4774-8394-15ab8f9ecdf7" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="f9e94b58-6a86-43c5-88e9-0a0291815ce5" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="2df88b64-fb1c-496f-8115-6e20a983518a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a7c083b0-b3f6-45be-b6e6-a7d1b0097668" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="c61be1c5-038f-4e0e-a8e3-34dac6c70dfc" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="ad042fe3-1003-4ac2-9274-a79a0c61b18e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="dc5c1b5a-2df2-4c91-93c0-3f6e4acd138c" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="489dd7de-f471-4ec0-8ed8-d3c17a34f47c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0ce2d489-9a94-42f0-9ac4-3d2b77f9878a" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="a96b2504-3662-4c34-8148-73117739bc16" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="43be3dd0-e622-465d-aeb6-896c6d6be0b2" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="a52c123b-f7c0-4e57-bc05-9139380598a1" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e326a2d7-92b3-43d7-92de-d9df976db92c" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="01f14a01-e189-4851-917d-100cd093b950" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="471460f4-a2a9-44e2-b2fd-9bbf80eb8fd9" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="9692db10-1abe-40b4-ab15-a81b5342f66e" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f30573e4-d907-4e1d-bf4e-dbb495cd0031" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="ef9cec32-5dc7-484d-a98a-d33ea516af42" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9ed3d034-0175-47c9-9b7e-f1ef41d1de09" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="4db9a663-32c9-4ce0-93f5-ccde964a5ee6" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="7a49fbb6-1044-44a6-af4f-c510c9138168" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="9cead8c8-1b93-4e74-a880-415b4dd5be17" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="a2df4f62-c5c2-4dc5-99ab-1740cce7c295" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="0041338c-f028-46c0-b972-63fb95fee325" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="fc1e4afd-8fbe-4fe2-8560-eb81e8fc1063" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="62bd639e-8c34-4d3c-93ec-158d78d3d58b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="f9b19f78-60a2-42e0-a0bf-0b08cb61848f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="d30458d1-921a-4031-988f-9b067b19161e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="e7ecf2dc-51bb-4061-8e39-dbd88ce40706" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="c446c10d-9a5a-4c57-b37b-da844d88955f" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="be47c2ca-6269-4532-8f5b-3b00345dbf9c" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="d8ef3f67-4030-4d3f-9e36-13e66c17830f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="6dc26098-0a79-4608-875a-b0f71540e5d9" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="812203a8-d55e-49ef-83c5-4cb24ae82056" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="6a09d61c-9903-4a37-94db-946a226ec702" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ca2c3b3f-86fd-4c25-a591-48bcf2560d21" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="ad76878e-91b0-49e1-be4c-4137b42cc08f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="67568833-1420-4412-9ad9-bda5be184c74" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="8f828e2d-efe8-4f70-a4ee-528be08c6aed" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="e9ad93aa-5ba2-4aef-a721-a050534334f5" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="a4c674df-53bb-4b73-9236-da615720ac31" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="7b51afbc-8e23-462a-9b23-128ba23e7bda" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="453d9898-569a-4aeb-87c6-56f40604a3d3" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="41bcfc1c-2464-49f7-9e3f-4ca248ca9d05" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="e07bfbae-fc1c-4420-9c37-aa5e416d04a9" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="f6d9e202-6643-4647-b03b-be45deda0619" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="1ad61650-24fc-4dba-acd4-6d79189cca54" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f9023742-78d7-4ff2-9d52-6bf789172a44" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="787d826e-9035-4b33-a889-68ec98a258cf" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="e8e87908-5aeb-4b18-a01a-2507b622821c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="489b6fb8-d812-4998-b6e2-48e402f15066" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="84bfb2d9-b191-4084-a088-fdbaba647b93" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="06454edc-bcaa-410b-82ed-1f87e048bcef" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="99a4c320-e178-49e2-aa20-689d03b80950" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a26e4708-c5c8-458b-9cf4-6c9bc157c2de" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="65198caf-8137-4e2f-a7c1-b9684866dd96" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b182662e-f440-4df4-b83b-77da311f0162" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}