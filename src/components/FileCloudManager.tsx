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
  return <div className="space-y-6" data-unique-id="c6609d0d-c0d1-4f0b-abc6-d906ef67f69b" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="c6d3b04f-d350-46f8-a7ab-8505fdf2a378" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="b030f92d-c2c7-4ba4-ad20-d51e04baeaef" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="a79cfa30-b787-42f1-ac75-f77d09ecefc0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="411ccfb7-be46-45d9-a2fa-9b501d1c2276" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="282db8c4-01c5-49fe-a399-82a3a78280af" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="bbddce42-d773-4943-ab05-f9c7f14804cf" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="9a1d639e-bdcb-4cc8-9a5f-3b02eae623ed" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="582d7dc4-7def-4396-8f69-ad3e6d0ac8fb" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="186f23bd-048f-4d91-8ace-9ff14ecb3244" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="12d70815-9afb-4a2d-9e24-86c1bef2606e" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="e0d35e43-0264-46da-bc23-b67265cd6b20" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6b2f14b3-c5a0-4adf-a0c4-d7885bdccdda" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="70c3db8d-13e4-4926-bf28-7b5ce02b5e2f" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="848cf946-5f0e-441e-910b-a77d33c3ac44" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="8dca33f8-7c5a-4273-bda2-ec58deaa5565" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bdaa0eba-46e9-41df-a5a8-a9896e40b036" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="31cdb683-284a-43b0-992b-b6c5fc5522a7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="6c640cb6-08a6-4371-86b2-343fb722c41b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7ad0fb28-74c2-484d-b755-56a70912887c" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="bc44ff76-4428-4a27-b19b-c363e61b5404" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="9b25a7ee-2c21-4e6d-b5e4-a07776161fa1" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="4f039eb3-fa27-44c4-90a1-0aefef35f4f2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="726cb1d4-ceaf-459a-8459-a67a165bd4b7" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f6a90aa6-8d81-4fef-996a-e5d4941118c3" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="d0b49c92-6786-497d-b9fc-52e39aa01c1f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5ef7cb8b-83ee-40cd-98cd-54b2dbe59811" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="5294ce5b-b527-4919-ac07-49393ff1bdd4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="39f6e975-2883-47f4-b80e-0dfa6cd764ee" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="282a8683-6147-4e2f-b901-309685399259" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e7f2c68f-8633-4c8d-9f03-3d51ef9e18b7" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="41a3bbe2-2a5d-4e5c-8119-fd07a776d422" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b5bb101a-286d-4276-a8d9-2b9f250f5560" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="d6dd5b39-9025-4afb-85fc-ec3f919533ce" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5b2ad921-8768-476f-9371-81175b73a1fb" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="57dc5280-f7ea-4435-a1e3-4377f88c220f" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="cf56068e-4e58-4574-9ff3-9c8bf60eaba2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b3f2199d-a2b2-42e9-9b61-520112b63ede" data-file-name="components/FileCloudManager.tsx">Cover Image</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="42920220-3f2c-462e-b4fe-9660149186f7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="542b9533-f7ea-4aa1-a0d5-927a2c7a599b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="c5f7d625-4255-45ed-a6fc-f257e4e4a1b1" data-file-name="components/FileCloudManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="9ab830a9-525e-46e7-a8df-36da0ea096c3" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="4daa4599-753e-4516-9340-29855bec8a72" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="98731048-62d2-4d86-8900-5c7305945dab" data-file-name="components/FileCloudManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <span className="text-sm text-muted-foreground" data-unique-id="50e7c52c-2c41-4dab-af0e-a507d19ff736" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e08048fe-43f4-4348-9269-60bc9b26d622" data-file-name="components/FileCloudManager.tsx">Cover image sudah ada</span></span>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" data-unique-id="840a89ca-2667-44a4-afc1-e98a13e41fac" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="2dc04513-2355-4095-a50b-92c23a090858" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="049ddcc0-db06-46d6-9a3a-52dfcb47a9c3" data-file-name="components/FileCloudManager.tsx">
                  Upload file gambar cover (JPG, PNG, dll)
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="7a0a0bb5-3f83-4b5e-ae17-bd7220c92782" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="888f3fda-3760-46d0-ad3a-b51f062db2bf" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="97226932-7b7b-4ed1-8984-849504ae2123" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="8540ab53-6a50-481c-b2ed-e368811d439a" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="4653a41b-f388-41da-8530-dc51397f194a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="96600dd5-0817-4fe9-b3de-cd302c1fc3a5" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="c1589ca4-a149-4207-b2c6-24d800cd37d4" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="33b3089c-7eb6-4f85-83cf-3b2814b4ae16" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="37344965-488e-40b2-9a0d-007c3cf30f55" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b3a6c98e-dd5f-46a9-bd27-0fe9453eacb4" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isUploading || !formData.title || !formData.coverFile && !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="ba773220-ca81-4913-a251-e016b69ea393" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center space-x-2" data-unique-id="2c4aa718-1ad4-4ce2-8d01-cf25a3a3e735" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="874d225e-82aa-4d3d-a796-3b442f2cd83d" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="7bbe799f-5a05-4360-853b-8644c1bd50c0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="bb4b77c5-7a50-427a-aa51-0817014df8c3" data-file-name="components/FileCloudManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="24e6aa14-14cb-4a55-bdcf-82321773f522" data-file-name="components/FileCloudManager.tsx">%</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="90233c37-c119-489b-88cc-3d6cabb2519d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="38371cb7-d07b-4e12-8670-35d7ae0a702d" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="b0dd13fd-0044-4185-a643-172f526aacfa" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="714aed3d-ac47-4651-a88d-12a6ec738c52" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="74729df1-3e4c-4085-93bf-72a3d8e57c4c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="5e733673-f1cc-4e62-8db9-8082c22c9f41" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="f8cffc63-3229-48fa-a5f5-ae6233bada0d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="7d26c0f4-b08d-467a-a58d-d48a60be5905" data-file-name="components/FileCloudManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="5a985dcb-b6f1-4f60-b426-ff42ead7d7af" data-file-name="components/FileCloudManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="f1a202d0-9d3b-4b0f-93c8-5d7132b85072" data-file-name="components/FileCloudManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="5079c302-ef21-48e5-add5-a0faef52bae8" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="19e4eaef-8806-4cac-b929-db7dabe21280" data-file-name="components/FileCloudManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="c1f5146f-94bd-437f-add5-7350d4c76a5a" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="9c831866-f305-4678-bad6-a8a84a86fd5d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0e9c007b-1328-47b9-9437-c48b7988352e" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="9ad7beb1-ea1b-4b5e-9c42-e459c7cf3d52" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="cf9d370a-76b5-455a-b71e-af3491b6529b" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="391007c3-e75f-4d72-b1aa-0b6c1e9fd2f0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="509b23d3-cc18-49a1-86bd-40fd32e8e522" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="13022791-0f24-4f97-8a96-260f4d2f9e73" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="be78f3a0-c2d4-4b01-b30e-7ba6e156d2c9" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="79281efd-f5d7-4aa7-97c9-f07242e80cfe" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="67bdc0cd-ff9f-4d0f-b947-69c8368b3b06" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="da6243cd-28d5-45b0-9958-af5ecf0a0c27" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="80600cf5-1536-4096-b4d2-cce2f3093a46" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e0442c78-ba5c-4098-add1-e2ee29844ffe" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="6b3493db-a4a9-48de-9879-0640c844b5ff" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="b732e94f-77f8-426a-9b64-2e80810c1a85" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="1408f750-18ea-44a5-a0ab-0ccebe4d1d00" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="7abe5157-2e31-4aaf-b012-44c7c12dbe7e" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="1dede26a-919c-4708-833e-74600966f350" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d7db8cdc-90d6-4b7c-92ae-fd9f3f6d17aa" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="512a1106-213d-4141-ad36-5a8aaffb8564" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="670fe921-00e0-4281-b060-822d9407ec88" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="eff16c93-5e8f-4a9c-8bfd-f3633e18df85" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="220cf404-2a24-4589-b8f8-8858f7009868" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="3bd2c22b-8dc6-49ed-9544-44659f70971f" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="18ee0a4c-8156-464b-9b10-41089dd16f46" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="24ec2860-d77f-47bc-ad5b-6894147c88e8" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="5bd82657-70cc-4858-b20f-68ae9206a6f2" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="9919c03c-9886-4be9-bc2e-5eb95c0d861e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6a2cbd57-8d54-4194-bdb9-2ad68b30f67d" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="48dda990-cfb5-4281-9575-22b21be42b13" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="c6fb6f94-a938-43e4-8b32-6c451d96a93e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6094de09-bfb8-47ad-a6df-99a23c757a58" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="fbc09eed-8f38-4fd2-bef4-569b23c15de1" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ce35447b-22b6-48b2-be5a-5f8f165efe66" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="46022c3f-cf82-4341-a8e0-0989548a7f5f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="1087546e-32c9-4ebb-b886-ce934f96a194" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="9d92001b-b93d-4375-923e-8b012d0fd9fc" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="38e029a8-0be8-41d3-afd3-8c3a29da23dc" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="8277b4b2-eeb6-4b00-8138-1d67d8a527ca" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="521829ca-fc4c-48e2-9a0f-77a6adcc3784" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="b63d308e-cd07-4ca5-a174-150403451e8f" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="ab6498d1-85c6-4b00-8eb5-95e773b76313" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="1d987808-a164-44b9-8228-a1e38d2db2cc" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f94de99c-e09b-4dbe-b34d-5f1bdb79b6f1" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="95b91511-5fe5-46fa-a0f6-8d527a0dd240" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="e60bea02-684c-4b25-af1c-e3af9d2119b6" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="e64fd46c-42ae-41eb-b130-be34b5d6f7e2" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="5f405818-0acf-49cd-acb9-5f746da7e190" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="f3524337-f8ae-41d3-82a4-cff220481ae7" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="1e08fad9-72ff-4114-b873-0abcec1c0702" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="a70d07dc-23e1-4855-902e-9e9839e494e1" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="3b4dfc96-0e8f-4fd3-9b32-dcf422f64c38" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="33897e21-cb6e-4ca0-a3ef-d7f4d3291e4a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="f043444c-fff8-42b6-8aa7-21629024842e" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="c2801608-1df8-4e27-8c2b-d4a52b8a3762" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="0007a25e-cddb-458b-86ac-008c1838575d" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="e9b82359-464a-4146-8c48-7c9bfc08cd5e" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="18b164d2-c28c-47b4-a2b4-3c5cdd87bf46" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="e33ab417-3afa-42f5-818c-9ea9ec0658f8" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="3e84944e-a237-4bff-8775-e7b1a44371a9" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="92f4b4e2-fdb7-44c3-afa2-707edc149588" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="47d7e4bd-cd5f-4741-a619-910a13c6448b" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="2d40ee20-312a-4e3a-95bc-9423ee5ac0aa" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="3a623e7d-def1-4984-b420-cea64def0b5a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d2bdc8ee-6946-4da7-9d88-cc7ccdb08a6e" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="18bf6b22-301a-497c-8eef-d811af6a0724" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="d2d3d85d-1f14-43d6-ae1d-0e4fee64d3d1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="9780af34-da3e-4f5d-abf6-064d56b28033" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="1259e559-1bc0-4666-9fb5-9742d2aaa502" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="c189efb9-3826-4d20-ad72-82e577682fb3" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="bf47fdda-9b2c-473c-9418-d8f3b4a4eca5" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="94788ec9-b637-4605-af92-81e72e2d3aaa" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a0b23798-f511-4749-92fb-669bebc90f89" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="5570253e-7456-4540-91a1-0bdad773b60b" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="493b96d0-8ef4-4382-a825-a9112933d1ba" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="fc5fd5c4-8f99-470a-9321-88cad9cf9958" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="630d5804-b565-413d-97d5-1d42d8b8808c" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="35c664ce-43ec-45d6-b19b-3280fcd0b9bb" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="3ed5242f-799d-49cc-b811-d01f07da3ad6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="cab027c3-c29b-458a-bc5d-93609af00a07" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="89c6daf7-333b-4e4f-82f9-4f33b1fa8c4d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2beb2da4-5e34-4188-bf73-f4e68f47bed8" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="bb33b675-bea2-4dc5-8aed-e48ba47144af" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="1d97648c-79ba-45bd-bb0d-16abc1c1269d" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="5d3f2d1a-ef54-4241-aeb3-9e216a19281d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c14b1feb-7cb5-4c95-b62f-24acfc62a170" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}