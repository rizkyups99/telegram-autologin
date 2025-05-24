'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, File, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
    categoryId: ""
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
      categoryId: file.categoryId.toString()
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
      categoryId: ""
    });
  };
  const createFile = async () => {
    if (!formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Title, Cover URL, File URL, and Category are required'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/file-cloud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
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
        message: 'File added successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error creating file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to add file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateFile = async (id: number) => {
    if (!formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Title, Cover URL, File URL, and Category are required'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/file-cloud", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          ...formData
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
        message: 'File updated successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to update file"
      });
    } finally {
      setIsLoading(false);
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
    window.open(url, '_blank');
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
  return <div className="space-y-6" data-unique-id="812f9fa6-6f48-4bb9-a32c-56c3ea0c867f" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="b61d094c-c107-4e9b-ad19-e55f33c871ce" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="1634234a-c24a-4ee9-841d-973236f31005" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="d609c2c6-7ce9-4fd1-8911-5d7df7c9dd50" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b35200ed-27ec-4a15-9fcb-c2725e80bab8" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="ebeb9ee6-dc88-48fd-99da-63292142415e" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="b14e4231-1c16-4077-8076-4e5e524857d1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="2db9e425-ead7-4232-9ba4-41ca35e41beb" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="aac23655-0ab6-44da-a980-bceb6d2421a7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="b62d2a9e-3444-46f0-9800-771996e3e532" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="afba49f2-395f-47c3-94f8-9d69ad084114" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="c6e128c8-6180-4758-92e7-218ab59248ae" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bb3b8da2-d4ae-4db3-8919-dd1b4601e1b4" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="05dc5c09-387e-4311-b7e4-0ff43a6ce2c3" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="b9d8d4c7-aae5-4b66-9b95-ae0a397ea6de" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="d84b8f36-b3e3-4aba-9b5c-72a63e7512ff" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9725786c-ed23-4c23-bc1f-b321537db9f9" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="173ef86f-1ec4-45bb-a2d3-910ad1052088" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="05320f2b-c99b-4351-814b-dbbf83a2e38f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f60ebd56-df26-4466-8a4f-8d83eddea0ba" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="e9e78848-4cab-4f63-979c-10151de123f5" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="610e6cd0-6240-482f-af09-02ac0e3697ce" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="67e1228d-dd11-43a5-9438-7f4b73dacb45" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9c8cb123-3b52-44ca-8a38-45722376c2e1" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4995534e-15c0-4fc7-8346-f5ed426e31f6" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="13e0b7a6-c4af-440c-a6b6-29e324db698a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5219f288-70d5-498c-b813-02709606b6cc" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="088491a8-b235-43f4-932c-3a5643607157" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ce13977b-e2c7-475b-8931-4bd4f7a568e3" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="1a1b95a1-032d-4b0a-b98f-0b424065b980" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="56b11bb0-aa6a-4fdc-8bfc-8092893f5bd7" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="59c1df17-b8af-4346-8c1e-4d739f5c04a3" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="43198966-cdaa-4d07-a560-07651eee4a1f" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="e1c94fec-a9cb-49e9-b32f-8c20d1775be4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="35ce56f7-86f5-4ecf-ad13-1ec17be0b15c" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="700aa238-591e-42bb-9ae9-429f37261105" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="d39a7b08-6fd7-458c-9363-68d2ff83a6c2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="11fc5025-f762-4c4d-81ea-f64cf8729930" data-file-name="components/FileCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="04bef8c3-2748-4b37-9364-ceab4baf9f0e" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="a2a570cf-8f29-4e0d-a6b8-2e8a9b54f426" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="04a23900-3da7-4502-b119-5f762c1ebd58" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of the file cover image from cloud storage
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="4b131ce5-9ad4-48e8-98b6-ab90aec7dcb3" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="55e88c3c-93e9-4c89-b061-0df8c06a4669" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b6cafa5a-b3b4-4c70-bbd1-7c148a244670" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="c79c1c4e-26f7-4075-a745-6baf11d4a075" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="d38260ca-454a-4249-bba6-0e589973ab0d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9b72b9d2-9ab1-4880-8be2-a01a1f9eabe0" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="58fb873f-4579-458f-9276-b5886a4dacc0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="7f3e19fd-570e-416a-90ef-4d88c7cc0e65" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="f21e822b-97cf-46e9-b4d9-2fcbdc294195" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b387b899-94fb-4b1a-abf5-55b9711e8349" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="569d4af1-eef2-4a25-ac60-15b2d8e26139" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="4680d709-c198-44db-8f02-ee780f0f49ab" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="d96eac0d-d08e-4f3d-8627-fc0eaf9b9be9" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="fd9f6df6-8acb-41a5-86d0-bf668b7bbdb1" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="fe81e636-f9e9-4b29-a217-2556da1d72d2" data-file-name="components/FileCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="c7f1b064-7f00-4056-a93f-c5ca0a24dc7d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e3973223-554f-4423-812d-47959cfaad05" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="82f4e8fa-62eb-4e4a-9d34-5bc2b3474002" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="639b8422-b638-4466-9901-458de63dd284" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="6096b8fb-59d8-4049-ae01-2c005774ece3" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="3e5c0c8c-d908-4cb6-9ce8-6e6cb57c3431" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="b9fad61b-b480-450a-9541-dab364048d06" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="02eb2fbd-0b75-4404-a06b-c938b955bb56" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="53dbc156-f5b4-4da1-b855-82e8e10a32a7" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="4e5dd4f6-020e-4f5d-9639-549e327c4fff" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="1398adbf-092a-4b7b-a0bc-e4be9a1fc371" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="de70801a-0ff6-42cc-ad08-936b5169c7c4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9543da6d-55eb-4c2a-b7b6-2a8583753c5b" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="fa4f1d97-8278-4f08-b10a-eb1571c3b48e" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="f4610716-fffe-4e93-9c42-84cd7d8ae948" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="72ee25f2-eac2-47e9-8d40-7f48b0fde2c7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="aad2e3a1-f25b-4904-86c0-f10c7c22b8bf" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e1076bd2-1221-4ba1-8d69-9730062735cb" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="93e8fabf-a2ac-492a-84de-cfbf4f98520d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b034344d-2c07-4d36-ad11-e783cd88362d" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="aea10f7d-3320-48a2-b495-738924919ba0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="647e49ac-e7c2-4c22-a833-4c3a7cfb8940" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="2d6667fb-3c99-4f52-9f38-24c2dca61f00" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="c4f997f2-7039-49c8-ad18-ef8b1d75d07d" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="55e54c55-aadf-4264-9e17-046c44893a41" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6335da08-06c5-49a8-aa88-ce5792d8c16f" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="5d7cebe6-c17c-47b2-9b65-44203f176705" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="c491879d-1416-413d-a28d-055abd5c15b2" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="0a4f2137-1cfe-46d8-986b-52e57c851e3e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="1a973d5f-dac3-4445-a0d4-2beafdfdabc0" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="555392d7-5146-4571-82e1-e3a556075364" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="753ae3af-ab3e-40d0-9722-cb09a01e7823" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="725c3b02-5c87-42e3-aaa5-ab0967cbfa05" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="8fd3a208-f44a-48f3-88a6-49e4b1fd8218" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="e184bbee-9839-459e-82c3-4fd096b90afb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="777cc160-3889-4e32-9173-834251ecde64" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="be17bd3f-ad18-4c45-b0e2-9d7067243d75" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="a75a3046-faca-402c-bc3e-04e8632fa887" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="068178fd-13d9-4db9-b07d-e82bba1fb58a" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="ee39cc55-75c0-49b0-a21f-42b6d6612737" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6e64d099-8307-44f8-9e04-ff81206878a8" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="79099cd0-7871-47b6-b9c7-17fe71d3b74f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="80b55b56-28fb-4ef0-ae1f-ecd25ff0955b" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="4d172a79-8154-47e0-93f8-e0d4dddd0215" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b463822f-e64a-4c13-aa03-e1aae30c6acf" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="8d01a556-f27b-4caa-959f-9503afc28689" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="5340b2ad-d258-4c6d-bf9e-7923c3c777a9" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="b1154023-076b-49f5-868a-1cd0bdb29786" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="2af8fa89-473f-4d4f-8b11-0f55c805de34" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="da1236fb-1139-488d-9bf8-bfabd458d93e" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a30a9478-f315-4b13-86ab-e30b91130a7a" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="4ee1da64-bc0d-4417-a0ed-7c3b2a39f7e2" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0116821c-0fdc-4650-872c-3d21f575cbeb" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="bc5c11f1-5ae3-49d0-b28f-b801508bcf67" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="a7d66e8e-c655-471f-b5d6-7a871cb92053" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="82f22339-6409-463d-8756-6411048c3a71" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="e773d1f0-9c62-4d7c-8e99-424bcbc182b9" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="a76aad6d-fadd-4184-893e-1f355ea9117d" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="24420cb8-d0a5-4bf8-9b6a-77eebaf833ae" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="35615c4c-181a-42df-9a0e-b618d7e192b9" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="dfb9ab83-4904-4374-9307-0bb42e33a5a5" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="b6e0a8b4-5a96-4698-8a13-f6b6ac4a0c64" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="19b59e3c-aa91-4e7b-ade0-447a961f0594" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="5cd49f18-6ef5-4fd3-8d70-ff702e5aa32e" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="aaa7f299-cb42-495e-aee2-b786e5bda7a6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="db8e1639-2ba8-44af-a8b7-61e0528bed5c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="a95db293-845d-4f4d-940d-9402d88342c1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="87f14b21-3f5f-4814-bc16-d205b9bb6310" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="e622ff5d-866f-48cc-8de5-a25d9ba02b6e" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="40d9b1bd-4790-4cfc-9ed9-5688920b09b9" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="e25029db-9f84-4cfd-a480-0ee269f05ec3" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="62b0d6d8-e954-458b-abf4-3591339f734e" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="39a0d7cc-b0fb-4443-9871-c550f785bf49" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="9107af39-2a99-4312-84e5-4f3b24015352" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="752daa5e-25a5-4e86-a0ac-7cc7e5756775" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="a32442e0-799f-49ae-b41e-a8782e8570ea" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="3f6021ad-d62a-4a6d-92d3-8b3a1d0cf585" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="0e84dfe1-9367-4e3e-a266-158e08b4f44c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="42fa906a-6f22-41bb-b825-56d2394d4bc3" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0a4e8bd4-3583-4eb6-a66a-6556db7d468b" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="0b8ff79a-4946-4e4c-8c3d-e8d935e74cef" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="fad10b4b-2cb5-4695-ad14-81dd2aeae54a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="9f343ab5-de8c-471b-bcc7-11d98ca12c82" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="44e60d0f-67db-4e5a-9a6e-e9df5b0ef8fb" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="8fdc4491-8dda-4885-b9e2-c94b32939a89" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="a67dc48e-c238-49ea-967b-1e1fbd58418d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="5c5f71af-85f6-47d6-9458-0a0ebacaa895" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="44857184-a15f-4fa0-a675-6bcea93bcf6c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="39985afa-5b26-46b1-b297-5c01d2fae18d" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="1d3f95ee-945a-47c7-8d93-5a714118873c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="e01ec6a4-d851-4652-af9b-8168ec6ed082" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="e2ca5d43-f8ae-4c7b-b282-0426bffa7fe6" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e51926a7-da97-484f-85e2-3e543e718501" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}