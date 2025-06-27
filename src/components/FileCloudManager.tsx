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
  return <div className="space-y-6" data-unique-id="737ad6a8-534a-4e5d-b6ee-7efbb46824a4" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="0f6808e3-bfc7-429e-99b5-4570e7e145a3" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="495b57c8-e2e5-4874-9d4e-8ecc69cb787c" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="733e7b15-d3a2-4a55-aa52-2e38ef18f2b2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="182f8f88-d372-4082-8641-43c92cf03a49" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="b1d95406-fda1-4d45-afe6-94fbed858058" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1739f061-bd09-403e-acf0-0ee7bcb4c10b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="47a3fca9-b6c5-4ac7-b9bf-ae8e9ba96df3" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="0e3030d8-6041-4a23-bbd4-d88574987742" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="8df1728c-0e1c-4328-be88-954652bcfa5f" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="6b3c6bfe-f232-4b86-8894-0dc35acba421" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="0f866a56-60f0-44fa-9c55-a5780e0083a7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c4c189c9-979b-4942-9266-d82c87093d63" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="a3a2b5fd-333d-4326-990c-ed0df9c388bc" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="31607d7b-051c-4e74-860c-b0262fb9ac1e" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="92d592aa-af09-4092-a92d-c37eec56b458" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ad58b6de-3000-48ee-a93c-e8c1e8ba8345" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="29330242-0fbe-4a3d-b34f-0b91643b2c22" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="f3e156cf-9cd3-4c4a-8867-498d72a494b0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="fdceb840-03aa-4685-aab0-a34128ef1c65" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="0d48654d-df54-4b11-b519-d140d0a11330" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="40c119b3-4b7e-46e9-b1c7-e0d1e0e72809" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="b58c6bd0-f789-466e-946c-a882e64c4f38" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="37f117f7-3d56-4a34-b842-97561fc1894e" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="aaf39b50-8510-4440-9581-8fd16333789b" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="31ba11ef-124d-4efa-bf7b-5ac1c6c2a26c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9ce85a22-aa8a-45a0-8dc3-18067f785a2b" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="5d67b3a2-19f3-4a1e-94be-042f5e2d6c81" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2a861c62-f9dc-4b77-8995-d4d8f057401e" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="193bc6f1-042e-4e7c-9774-4062d28eb712" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e7f98001-3c61-4908-80de-d31798d2dd37" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="0abf1bf6-f961-4445-84e9-43ec39ecbf12" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5c9b6245-a08c-4198-bb60-d1b35a8c8d84" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="4e888dde-f5fb-4d85-a93a-b978e81b8806" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="613d6a44-afc2-49eb-90db-b354d1847122" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="ee8e6bcd-f0e3-40f2-9704-934b60c62201" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverFile" className="block text-sm font-medium mb-1" data-unique-id="51271144-c090-4d9d-8637-c27f46ebd98c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a6061c0a-e71f-4cce-8c86-6bcc7eec5f94" data-file-name="components/FileCloudManager.tsx">Cover Image</span></Label>
                <div className="flex items-center space-x-2" data-unique-id="621016ae-d377-4bc7-bce7-74b8f8543937" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} className="flex items-center" data-unique-id="e8233a8a-a9f7-40f0-9e1b-535a146f8540" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                    <Image className="h-4 w-4 mr-2" data-unique-id="448d8723-a3f6-4bd1-a389-3cbae6bdfd3e" data-file-name="components/FileCloudManager.tsx" />
                    {formData.coverFile ? 'Ganti Cover' : 'Pilih Cover'}
                  </Button>
                  {formData.coverFile && <span className="text-sm text-muted-foreground font-medium" data-unique-id="da8d1e17-efec-4a90-a4cb-4396960601b6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {formData.coverFile.name}
                      <span className="text-xs ml-1 text-green-600" data-unique-id="68f2f5aa-469d-476c-b11a-b6ee9fb5644b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="40d6e8ba-eefa-4932-b429-ff6f1b1ccfc7" data-file-name="components/FileCloudManager.tsx">(Akan diupload dengan nama unik)</span></span>
                    </span>}
                  {!formData.coverFile && formData.coverUrl && <span className="text-sm text-muted-foreground" data-unique-id="0860945b-2b75-405d-9859-1983c9eb0a68" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c40d2df9-0e4c-4ba4-b9dd-39a67dc45e55" data-file-name="components/FileCloudManager.tsx">Cover image sudah ada</span></span>}
                </div>
                <input ref={coverInputRef} id="coverFile" name="coverFile" type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" data-unique-id="eb74eec6-a963-4afa-98f0-47857c1bc986" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="ec1cd04d-4d0c-40a9-8071-db62aa5e728c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="3b3cd6db-a08a-4e2b-876e-2065671ac91b" data-file-name="components/FileCloudManager.tsx">
                  Upload file gambar cover (JPG, PNG, dll)
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="d7c5163d-f57f-4129-8bed-3287abae2962" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="d0fbf12d-7c12-46d1-a86b-91a7b4c04d7f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="05e5a69f-10bc-465f-8055-36d30c05fc18" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="d5fa7a19-1571-47c7-9d17-e18a61feefdc" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="9ada6570-4a0e-434d-a88a-2661616f3523" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="69a86b53-e4c6-4363-9485-5475242c1c3f" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="3ecde2fd-d9f1-431c-97b6-e55787f376b5" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="ca041264-4a03-43a1-937a-ca395d189789" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="93ab3331-3f11-4f61-8780-6da44dd643e1" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2f090416-1189-431f-bf2e-a0b1b7e72d72" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isUploading || !formData.title || !formData.coverFile && !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="9bf5f95d-fbee-4ab3-95e9-1e5e199d8606" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isUploading ? <span className="flex items-center space-x-2" data-unique-id="ac3f2834-a8ba-4f55-bc8e-b7dc102ee4ea" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="47065b94-6a20-4a4d-bd76-c9b34e01ae09" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="a655ff3c-e9b4-4ac0-b5ad-912146e30b54" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9d52f15b-6460-4b26-bbca-199631730a52" data-file-name="components/FileCloudManager.tsx">Mengupload... </span>{uploadProgress}<span className="editable-text" data-unique-id="2835190e-8409-4fc0-9374-633fa3d12a70" data-file-name="components/FileCloudManager.tsx">%</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="48789174-b054-4843-a806-ac88f88ea399" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c85e77d5-183e-4be0-be0d-bbe084b3c10d" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="e2c9131a-04ec-454a-ba0e-6375860a02d8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b599d600-e9fe-48b1-b523-8dd91e203344" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md`} data-unique-id="132b837d-3e21-4ab6-8c97-57ef13f70425" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              <div className="flex items-center" data-unique-id="e4bb9c3a-c67e-404d-958d-609aeb98d733" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
                <span data-unique-id="7d4f0384-ae03-4649-a636-f7d765491e34" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
              </div>
              
              {/* Progress bar for uploads */}
              {isUploading && uploadProgress > 0 && uploadProgress < 100 && <div className="mt-2" data-unique-id="a68a49c1-2658-43cc-9304-a922691a7a21" data-file-name="components/FileCloudManager.tsx">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" data-unique-id="eee8c7be-f5f7-4bb7-9bdb-f08b49ecd52b" data-file-name="components/FileCloudManager.tsx">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{
                width: `${uploadProgress}%`
              }} data-unique-id="f27eb8a8-86e7-4ba2-ba7e-1b447d305908" data-file-name="components/FileCloudManager.tsx" />
                  </div>
                  <div className="text-xs text-right mt-1" data-unique-id="1d1347c8-2f17-47a1-a8f6-228cb7442189" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{uploadProgress}<span className="editable-text" data-unique-id="615caa5a-1b23-4e09-9191-de2e8eec631e" data-file-name="components/FileCloudManager.tsx">% selesai</span></div>
                </div>}
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="ebf57556-529d-40a2-8fdb-75ec18792e62" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="14ca72c8-1c9a-4b19-a1ae-9e7f78bd6426" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b2d2305d-d583-4d25-bc5a-d9867bd5b0cf" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="175b5ba1-c676-4e6c-873a-3a911b77356d" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="e206086f-e25e-4fb2-aa16-0ee79e665f8f" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="74bd7cdb-57f6-485a-a4db-07d8f2e9a023" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7d75d564-37c9-45bb-9955-b4c9555c8a3d" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="2843bf64-ef49-4ea6-b6b6-1a2cd03486c5" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="297da8b8-2245-4528-9e0c-21c34d250ce9" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="5bdf481c-7738-4ec1-b983-c738e098c360" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ab959f76-cfc6-4d54-9984-7a7f2995f384" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="22d8143a-26c2-4c70-9b8a-e557ff83821f" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="f12b956c-5196-4d67-9849-35cf84274ccb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="32bdfc6e-3562-4959-b53b-b41aa3143f62" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="26f0ace1-f53d-4bbb-bfe6-7f09b2218800" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="4d8bd862-a2ff-42c6-8df0-b66433a25b85" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="d65b20ed-e732-4dc8-96aa-6555aaed7cdd" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="c29bd424-7868-4b4c-939d-82edf56df4d1" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="c11b8712-6284-4092-9e6b-5d2f59bef978" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8333c613-36a7-4a49-aaaa-90415fa35d6d" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="32bf53ef-cb5e-4dec-9cb2-2ec7b688e6b9" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="6c8a151b-8d4f-46ad-a952-8a1659831727" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="ed09a5eb-b0a5-4cb6-a22a-e4068387fd60" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7807bf15-b064-4aba-bab7-1e97899bf4a8" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="675a425d-a5e4-470e-8808-d668419fdccd" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7b29e442-ea27-4ef6-9268-fba5b94a6b37" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="d2ab3b07-5207-40cb-a93e-218ae19fa4a8" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="68118482-2647-4c77-a318-13265ee2e1ad" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="901f8cdf-5a6a-4634-904b-e4597eead7a0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="1d19e988-39f2-4805-8c21-6553848fb35c" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="66273c84-0b88-42aa-9642-549af39aaf8e" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="85c176aa-68b3-4059-aaac-d974aca27b11" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="3e446272-1c7f-46d1-b7f1-21a2e4296c75" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="f05b0519-f181-408a-85f3-c19cbdb23f61" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="39501584-d146-4bf9-a017-d3400769fccf" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="c185a7a3-319c-4ec9-8630-14f420ead127" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2992ad97-9a46-48f0-9926-168c89e744e9" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="7e9727b6-8e8e-4df9-aee3-70d121fa0190" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="eaadd494-cb96-4181-b12c-7c69781e3b9d" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="6892281c-76b7-4462-9f5d-dc39a5cb718d" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="ac6f4390-cfa3-4a38-b7bc-d31f34cc89a0" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="a4b1dd19-4e3e-4cb4-9ef7-ac8b76d1192a" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="40b16f15-3736-47b1-813e-05e7b844c22e" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0fff40c5-a1e4-4447-9874-9815fec07d2d" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8129a061-de1d-462c-a933-b204c9e1eae3" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="841dcfb8-e9b3-459f-a0af-f32490f2852f" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="b44f7bde-996b-450a-9f39-4372f8ed0e24" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="ff6235d7-f728-4f57-bc08-7f5f9a79de21" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="774674e4-9593-4153-83ca-4aa1f862c7f7" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="35add654-1e24-43c9-8dee-30b21998657f" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="ef88cf00-d3fa-4cfc-8795-97e2875c32da" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="6196a038-14fa-4293-ae6c-c4e93cb84bc1" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="02af0da1-ec63-4f4e-8f83-07a5577c393a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="acc8f2f9-27ae-44d0-b428-0f47d9187590" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="784b19a5-87b3-48a8-81a4-0414ff4b138b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="189d08c0-ce80-491c-9838-64baf05152ad" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="778f24d7-7660-4ff7-acf5-28ee13b8047b" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="89e6d502-51ae-4cdc-835c-4e07adc3a043" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="3cd32c48-2bea-416c-a8ae-492493c74476" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="1c6d1a94-5bd4-4d83-b19e-75a6176e6c33" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="c9a8d16f-005b-4305-86e4-c7fbd2a2bd93" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="2efaf4a5-4f1d-4d2f-97f9-420277a01407" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="13a551b8-10d3-4ff1-98e7-2383d6971f0c" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="69b70e5a-2f59-4a30-8401-f6d8108ae2c2" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="e69a0000-9111-4ded-8284-1a723701d5d8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="85aa16bb-4b86-443b-b57a-5f9bdb6b7e91" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="25ec5f73-2e39-4a32-8ead-5d38701612d0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="f9659f52-53ef-4172-a13d-d92f81304b7c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="b9ff4475-6372-4faf-bfb4-0443f6233741" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="875dd733-f29e-4c55-8c5d-9910504cfc01" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="de2f3687-85e7-45b4-91c7-797250060097" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="7ded411e-ba20-43b6-9cfe-af6c2cf49058" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="94754c49-b92b-4cb6-b544-53b285caba2b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6f99577e-3308-4668-9d7c-08198625e6d5" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="8f703b9c-fddd-4b97-97d6-1230cd69b11b" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="8daf99c8-b3a1-4861-b4c3-44b843265778" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="5422ae2e-d7ce-4cbc-9454-b2aa2d523821" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c7e37869-cfa9-4d87-b58b-8f350a8c9e39" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="5bfd3600-6f12-44e1-a047-9764d04a537f" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b7203a5e-9a02-4ef9-82cf-7e2a6eed55a7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="06ce60bc-71f2-4777-b726-2e126b748491" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="b785a5b6-5fd1-47c0-9788-417ba7394641" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8f960756-29c6-404f-8d77-f2cfbe384b70" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="9633321c-289f-4a36-8673-73b997431166" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="8d6895ba-98a9-48ae-b077-dfccddafa00b" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="9e2db38c-c7ab-4b47-89ea-21b7d903a69d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bdd5769b-6cc0-4ad9-9488-56dbbfbd05e3" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}