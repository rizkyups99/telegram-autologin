'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, File, ExternalLink, Search, ChevronLeft, ChevronRight, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uploadToStorage } from "@/lib/storage";
interface Category {
  id: number;
  name: string;
}
interface FileCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  fileType?: string | null;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}
export default function FileCloudManager() {
  const [files, setFiles] = useState<FileCloudFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    coverUrl: "",
    fileUrl: "",
    fileType: "",
    categoryId: "",
    coverFile: null as File | null
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
      let url = "/api/file-cloud";
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
        throw new Error("Failed to fetch file cloud files");
      }
      const data = await response.json();
      setFiles(data.files || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError("Error loading files. Please try again later.");
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
          message: 'File cover harus berupa gambar (JPG, PNG, dll)'
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        coverFile: file
      }));
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
  const startEditing = (file: FileCloudFile) => {
    setEditingFile(file.id);
    setFormData({
      title: file.title,
      coverUrl: file.coverUrl,
      fileUrl: file.fileUrl,
      fileType: file.fileType || "",
      categoryId: file.categoryId.toString(),
      coverFile: null
    });
  };
  const cancelEditing = () => {
    setEditingFile(null);
    setIsCreating(false);
    setFormData({
      title: "",
      coverUrl: "",
      fileUrl: "",
      fileType: "",
      categoryId: "",
      coverFile: null
    });
  };
  const createFile = async () => {
    if (!formData.title || !formData.fileUrl || !formData.categoryId || !formData.coverFile) {
      setStatusMessage({
        type: 'error',
        message: 'Semua field harus diisi termasuk cover image'
      });
      return;
    }
    setIsUploading(true);
    let coverUrl;
    try {
      // Step 1: Upload cover image to Supabase Storage
      try {
        console.log(`Uploading cover "${formData.coverFile.name}" to Supabase Storage...`);
        setUploadProgress(0);
        setStatusMessage({
          type: 'success',
          message: `Mengupload cover "${formData.coverFile.name}"... 0%`
        });
        const coverUpload = await uploadToStorage(formData.coverFile, 'pdf-covers', progress => {
          setUploadProgress(progress);
          setStatusMessage({
            type: 'success',
            message: `Mengupload cover "${formData.coverFile.name}"... ${progress}%`
          });
        });
        console.log("Cover uploaded successfully:", coverUpload);
        coverUrl = coverUpload.url;
        setStatusMessage({
          type: 'success',
          message: `Cover berhasil diupload! Menyimpan ke database...`
        });
      } catch (coverError) {
        console.error("Cover upload error:", coverError);
        const errorMsg = coverError instanceof Error ? coverError.message : "Unknown error";
        let displayMessage = `Error uploading cover: ${errorMsg}`;
        if (errorMsg.includes("size exceeds")) {
          displayMessage = `${errorMsg}. Please try a smaller image file.`;
        } else if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
          displayMessage = `Network error during upload. Please check your connection and try again.`;
        }
        setStatusMessage({
          type: 'error',
          message: displayMessage
        });
        setIsUploading(false);
        return;
      }

      // Step 2: Create record in database
      try {
        const response = await fetch("/api/file-cloud", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: formData.title,
            coverUrl,
            fileUrl: formData.fileUrl,
            fileType: formData.fileType,
            categoryId: formData.categoryId
          })
        });
        const responseData = await response.json();
        if (!response.ok) {
          const errorDetails = responseData.details ? `: ${responseData.details}` : '';
          throw new Error(`${responseData.error || "Failed to create file cloud record"}${errorDetails}`);
        }
        setFiles(prev => [responseData, ...prev]);
        cancelEditing();
        setStatusMessage({
          type: 'success',
          message: 'File cloud berhasil ditambahkan'
        });
        setTimeout(() => {
          setStatusMessage(null);
        }, 3000);
        fetchFiles(searchTitle || undefined, searchCategory || undefined);
      } catch (dbError) {
        console.error("Database error:", dbError);
        setStatusMessage({
          type: 'error',
          message: `Cover uploaded successfully but database record failed: ${dbError instanceof Error ? dbError.message : "Unknown error"}. Please try again.`
        });
      }
    } catch (error) {
      console.error("Error creating file cloud:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menambahkan file cloud"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const updateFile = async (id: number) => {
    if (!formData.title || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Judul, URL file, dan kategori harus diisi'
      });
      return;
    }
    setIsUploading(true);
    try {
      let coverUrl = formData.coverUrl;

      // Upload new cover if provided
      if (formData.coverFile) {
        const coverFileName = formData.coverFile.name || "unknown_cover";
        setUploadProgress(0);
        setStatusMessage({
          type: 'success',
          message: `Mengupload cover baru "${coverFileName}"... 0%`
        });
        const coverUpload = await uploadToStorage(formData.coverFile, 'pdf-covers', progress => {
          setUploadProgress(progress);
          setStatusMessage({
            type: 'success',
            message: `Mengupload cover baru "${coverFileName}"... ${progress}%`
          });
        });
        coverUrl = coverUpload.url;
        setStatusMessage({
          type: 'success',
          message: `Cover baru berhasil diupload!`
        });
      }
      const response = await fetch("/api/file-cloud", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          coverUrl,
          fileUrl: formData.fileUrl,
          fileType: formData.fileType,
          categoryId: formData.categoryId
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
        message: 'File berhasil diperbarui'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal memperbarui file"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const deleteFile = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/file-cloud?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }
      setFiles(prev => prev.filter(file => file.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'File deleted successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error deleting file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to delete file"
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
  const openFile = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };
  const getFileTypeIcon = (fileType: string | null | undefined) => {
    if (!fileType) return <File className="h-4 w-4" />;
    const type = fileType.toLowerCase();
    if (type.includes('excel') || type.includes('spreadsheet') || type.includes('xls')) {
      return <File className="h-4 w-4 text-green-600" />;
    } else if (type.includes('word') || type.includes('doc')) {
      return <File className="h-4 w-4 text-blue-600" />;
    } else if (type.includes('powerpoint') || type.includes('presentation') || type.includes('ppt')) {
      return <File className="h-4 w-4 text-orange-500" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };
  return <div className="space-y-6" data-unique-id="8fdc26a1-789e-49dd-84d5-318c46aad4ba" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="3571ef23-3be2-4874-a41b-0de54f594ba9" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="07c33693-ebef-4d61-bfa1-a7950e61364a" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="ab604b16-ab50-4907-83b7-9df8b8aa7b15" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="739e434a-d81c-42a3-beeb-d4d07cc87fe7" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="40540061-a354-493d-9db4-a802a1824e53" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="ae3a823f-20a5-472d-be3d-e2c5b2305053" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="cebb6987-0f0d-438a-aa47-122a7a48a50c" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="905c38ae-8381-4866-9185-9c5b2856fe96" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="0e8f175d-c97f-42af-bc20-5c5cface6266" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="c19358eb-0b5d-4d0c-b755-6326d0904ec6" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="cea44fe7-0fd3-44b6-b6be-87989315c9a7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e7adcab3-afb2-4553-ab05-eaaa185e7cb3" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="a0b83695-6388-487c-9265-15344523421a" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="7edc6e4e-83f4-4733-bf28-5ef3bdffa9b4" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="11ea812e-6343-46c0-a8d4-84a74cc37451" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="cdaadb1b-3e68-44f2-be7a-ac08ef97c17e" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="795853c6-4efc-4db6-9658-5a3004a71101" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="1df8c2c0-c71b-40d7-abd4-c7b1ccf64bf2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2b7fa023-b6ac-4a69-a41f-64323b4fbb58" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="2e901997-80d6-4467-9452-c2f0695b1666" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="5090fa8e-1b4a-4e08-ab5b-9c57afc3f7cb" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="7215c8c1-d74f-42ac-9e4b-596fab2c3eeb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="36b4f832-2e0f-4a70-8535-60b7471047ff" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="726dd9dd-aa9a-4e65-8025-d2d0b6ee3a7d" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="e567a358-77da-4307-996c-dd3b963ab8aa" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="72adc84c-b49d-48ba-9966-f53abd924c7a" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="4b0cde4d-f5d4-4d75-b4c6-24a66d730033" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a1a032fc-4a15-4e4c-933f-1272ac20c4b6" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="ee6fb88f-db32-4a1e-a16c-7afaf69e0ee8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4039dfcc-f382-40b9-9fee-99e7aba13d27" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="b02a3840-b835-46d0-97a3-c36bb9a4e45e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4011bb67-f5f9-4ad4-85ea-939a44d331e9" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="41a99b37-ad4b-4e24-a96c-42d5b4379ec3" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c992a8fa-ba09-48d5-9afc-fbb72db1f5f0" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="841186bb-3ee2-422e-90e3-572e09079f42" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="abd7b30f-5f9c-4e29-aaa2-6eb494596483" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="506745ff-e89a-4d3c-a495-5ed64869aba7" data-file-name="components/FileCloudManager.tsx">Cover Image</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="7619d214-19cf-4428-8ec1-c77fbae6824b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="bf7936e2-b62b-4f50-9b08-f5224716dcc6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="64925448-2de8-4b1c-8f51-1d7f106d366d" data-file-name="components/FileCloudManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="aa9e1f10-829b-4c5f-b4f6-14609d0d8d09" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="3fafaefd-94f3-4f3f-9f9e-0a8428590efa" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e99fd3e7-41eb-4ddd-a94c-6565e74f950d" data-file-name="components/FileCloudManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <span className="text-sm text-muted-foreground" data-unique-id="571d6f5f-cc51-41a5-8f58-34be318dd8a8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9b13743a-58eb-4d60-95c4-1f4355041dcb" data-file-name="components/FileCloudManager.tsx">Cover image sudah ada</span></span>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" data-unique-id="38afed85-c62e-4ac1-91bc-09e4ef33933f" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="7c9d6ab5-21f3-4632-b6a0-e75e0c6f9577" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6cc56afd-7733-4cc4-b8fb-fdc9f91266c8" data-file-name="components/FileCloudManager.tsx">
                  Upload file gambar cover (JPG, PNG, dll)
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="066d0ed0-2f67-4b53-9b9f-aa14f370bee9" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="04336052-138e-4dd1-a439-5e754a50936f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="01cb4310-060e-40e1-afab-f15081ae2911" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="db55ddf7-d70d-4285-a583-02af4bb5694c" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="e2f188f3-ae50-4d7a-a30b-957e2e667d68" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c36a88fc-66b2-46dc-aeda-812b97921dfa" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="6611c2e1-df26-49f6-ac8c-8f6d0ccc8373" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="aed7f2f3-0cd5-4f21-b465-19ff5d295615" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="0b218ef1-f269-427c-99f0-a17113725210" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="81e2f848-be74-4bc5-a08e-e8aa8a1882b0" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isUploading || !formData.title || !formData.coverFile && !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="b79a1f45-a01f-415c-a785-dec90c60d7e1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center space-x-2" data-unique-id="8bff342e-b7a3-4a95-8163-e3eddf321c24" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="4a57b812-986d-44e8-b3bb-a04715950200" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="7f89a754-1daa-4260-acc7-d7aacb886484" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a406b6d8-bf88-4204-8fa8-c4dff1bb799c" data-file-name="components/FileCloudManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="aff91026-0461-4ac8-9a7d-d463422fc6f2" data-file-name="components/FileCloudManager.tsx">%</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="cf9acb46-b841-4bcc-af8a-e01b3e6cc57c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="33cb8aca-c46f-4ef9-b0d8-bc1be2799ff7" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="28e5c079-f6de-4ef7-8d26-d6ff33d6c80c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e1bfa227-a7ac-47e8-ba55-057720a8b004" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="f1100be6-eb5d-469f-a509-64beb7e6b3ca" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="0df1398a-6711-4a3a-98fe-8e3588706477" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="8460f1fb-bd16-4682-875e-3134cbb705a7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="8af234aa-a897-483b-9bc1-4328353b7a30" data-file-name="components/FileCloudManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="d8d61350-fd0a-4f3c-8a07-877fa1096315" data-file-name="components/FileCloudManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="2ec2f16d-6aba-485e-aff7-9b9a2fb4ff63" data-file-name="components/FileCloudManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="733d099a-766e-48c0-9a2e-296b74ecb1ab" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="2a865cb2-a2a7-437e-b160-0c7328a0785b" data-file-name="components/FileCloudManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="50855194-c504-4553-8b28-7b27c8eb4a39" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="bb9fbb03-7e80-4c82-82d3-eb23f09fe6a8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5309fd33-35a7-498b-a5db-70de3a3e130c" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="47805f61-fbae-4f81-a79f-a4aa83c372dd" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="ae0354bf-525a-4237-b0af-430c4350d277" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="533f6757-d11d-4c63-99ee-7b2883592a83" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="67c5880f-0cde-499d-b547-81c667bd77e4" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="8c2948c8-68e2-4e15-a469-4794b38e70cb" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="63608eb2-d17b-4cc1-882e-0af5ce481b9e" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="a2ee6b1e-38d9-456d-82eb-24bffd4ea779" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5f1348f0-93d3-42b8-80d6-f495e6edfe38" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="b2d3bac1-1488-4023-bca8-121abc36db5e" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="68c54334-ef62-4f90-8636-ac35ccbc8b09" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9b01fb78-9e53-4ec2-8228-7af45aa09298" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="e1d38772-24c6-40c3-838c-c0acd57bd1f0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="75c91863-e4c0-455f-b732-7d26767e93aa" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="147b2a3c-8341-461d-9879-ab929ca7a707" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="04ed0e62-4d06-4475-bf6a-dfc38af5630b" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="9984c770-bbca-4603-939a-fe324da8a281" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a24b2fde-0ca5-432c-979d-f30af8c651fd" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="c89054f9-3d2b-4525-9f06-c3fa7332c6df" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="bd611016-35ec-4a3d-8830-9871fc1bbf23" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="9eb6bacf-0136-4947-881e-f432f4e533d6" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="453b54e8-2361-446e-bc6b-5c6cf34fa225" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="d2ad34ba-3c2f-44a9-9588-62fa127b6469" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a04c87da-8915-4761-9027-3f66ad11fa41" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="d7c90310-55b1-4156-ae94-475abe6b38f6" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="3169e756-18ce-459f-963b-875ffccb1004" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="8b2346a9-d311-4c5a-b6bd-6ccf58138440" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2ad4ee21-f522-4e52-81ca-fc865be984e5" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="22d04ea2-aaa1-4537-912c-35a18e0f0b87" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="0b179387-d29e-4597-a60b-0e4d2023ef81" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bfc83ca8-f272-4781-9715-79293c6de10c" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="cef6611d-3317-4787-ba41-9efad3f12c4a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f8cc763b-8f4b-43c6-95cf-fe02fec5818a" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="5cd048f1-5d38-4d72-9fea-4b1612bf1962" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="49a91b40-da8d-45cf-a0ee-7a283afb4d95" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="b7f54328-33af-47be-8014-f7fab5a62af4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a03a7beb-ae02-4bb0-b47a-6a3801413d5c" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="aa00144e-3e69-40cc-a8e3-1b290e36521b" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="5dfff3b5-44d0-4880-bf88-c13b19167a37" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="8bd9c7b2-baa2-447e-be16-6a67deab4f7b" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="fb9a1e5c-e056-4b44-a08d-9d00a23d93dc" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8b632ec1-bdcd-4ec3-b778-ff23f3f149f3" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="e8156755-2a64-4ec4-9375-b05375e2fb87" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0954dde8-474b-4b21-9e68-a369a9cd00f1" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0e92973e-7117-4b82-a651-a9bd4955639f" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="0a96b35c-2c09-4225-a6f4-185e87a2bccc" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="7521d1a9-c199-404e-aedc-5d6351ca001f" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="03ba4935-9c6c-4bfd-a484-4e13b396a316" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="64456ad0-3630-4392-8cb0-21601f661889" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="eae50b59-436c-4a8a-a09b-ae99d8efedac" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="af23c65e-a20a-4720-8f31-6bfc31578e9c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="b0c6d961-2fec-4663-a875-c328ae8544eb" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="45dc0208-54b6-40ac-9bc5-09c22dfd2fcd" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="f0dd2efa-e1bb-48bc-b553-2b9293d2e7d7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="e9243fc3-4745-4404-b621-eff5d8aec62f" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="e2847347-bc51-40d8-8f54-7dacf9ec0f01" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="dde94275-1a9c-4e90-93e6-46c886316c8a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="6df4c824-7eb5-4e67-872c-fccc67acb323" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="da65a451-bc67-40e1-bc7e-8c847ef373d1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="b255ba6e-5f5d-4b12-b3a9-89cbb6023470" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="5f8fc2dd-e120-4863-9216-d0ef22ec8fac" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="15a0859d-a66d-4b0c-88d6-ce05ca3fa8f6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="b4d6f39d-b31e-4a35-bace-d199455aabd4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8e33820e-6b7a-4467-affc-157b9f165ac2" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="bf88a92a-c43e-49c9-a9d5-99297374c31e" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="075f76cd-c83b-44ab-aecd-3ca9a5010862" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="fc712157-8115-4c70-82b0-85f84d402e19" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="952efe53-20fb-4dbf-97f1-4425107a9ef2" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="7c72bb92-02b7-4aa3-a401-b44b39a700e8" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="bd65ddeb-2184-4970-ac12-6d1d933b3f34" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="4936dde6-aa3c-4ce9-9431-cd75386f18f8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e628a399-5a68-4f78-923f-226a53b7afa9" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="3b2095ae-5673-485d-b46a-3a34b6c2ead0" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="24c65946-8801-4118-af69-a9230f94839b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="f598b874-12a7-41f9-aae6-b0735f84b58c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c584fc0c-adc5-419e-b5f9-7b7dd4b208a6" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="19c90e67-b1e9-417e-97e9-34e66428ca07" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b5c986d3-ccc3-4abe-b12b-c9993fe52118" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="1e61e932-2dd5-4748-afa5-58a4a191d84a" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="72bc60c3-48bd-40e0-afaf-54da9d45e928" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="91e0ea4f-8464-40a5-989e-4144d39a6a64" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="ebbbbf02-e4e2-4677-8c02-31c922e92d49" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="4f55a5e1-f875-43d5-a25e-58e9ab4d4591" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="a8da0368-22cc-4f34-b007-37d8613a6a66" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="31768a96-2f7a-4023-9577-8bf86b3c144a" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}