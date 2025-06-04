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
  return <div className="space-y-6" data-unique-id="5f6e4686-1c65-4bf5-8701-ce1d719ac60c" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="ca46f18c-26fe-4650-aaa1-f0031ac670b1" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="70305889-48e6-4659-8b45-24047c0e1b76" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="8de157ea-dbc8-4b15-9827-35fd96cf3126" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f736fb57-c6e2-4eb9-98c4-1bafaa1974ef" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="b3fd3b15-b5d6-4438-9bd3-32d1a144ecf6" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1aad5d04-6acd-4682-9d2e-38b02c39132a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="a4309c24-c790-4dc3-a5bd-c737f6967693" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="69956ecf-8167-4023-ae1c-1a3521dc62a7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="05ffbec4-6e01-4590-96fa-f33126de773c" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="3145ae6a-af96-4eb0-86f5-e299bce7b02f" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="d1940108-2ec3-4e31-a6ef-7d8c73e0b557" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="297ec589-e973-4e49-9931-a3821caba2ad" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="4d6add2e-4f0d-448a-8a0c-a2a01a916326" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="f43ea965-5c4b-4486-a62a-aaafb9745f10" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="0f522580-3b23-4ee4-b9ee-7b4901989713" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="56bc33b7-dcf5-4256-b771-c466ccdee06f" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="55d5abb5-43c5-4e7a-bb01-c192b677e222" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="db7a28c2-bd66-422a-a155-945a95e35fa3" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4e0883cc-6fed-4269-bb06-dce5dd21fa96" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="04a5d13c-586c-4d8c-aa71-2faf6bc06368" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="b0938617-abdc-45af-addf-5f044ea98f68" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="d056172f-b43a-46da-bd6b-7e1e227c9896" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ee8f4912-a3a5-4d37-b980-d751941e645c" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="a3357047-21a5-437e-ae32-4e554da6ff8e" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="861bdd3a-2c5a-4f00-9203-4a72c615cfd0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="746df5d0-63ab-4051-9762-a9bb0c9e95a0" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="4193ce33-7875-4752-a20b-0b3e85e11d73" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="09609ccf-2c8d-40fc-acd1-baed3c04788b" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="f92244cd-f051-4698-89ef-16b0a46b6cbb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a67f8a3b-7ba2-437d-bccc-5002da0665e6" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="cd054697-105b-49aa-8124-82cc7299ffbd" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="37ae9d52-3416-4b2b-ba5e-7e8f39f62ab9" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="72c0ac9d-9688-401a-82e7-86a353cb8580" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a75aa37d-eb47-4369-a958-15cd24485659" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="d76bbd64-28e0-4cd0-869a-b8751bb0a75f" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="dcc19c64-dcf6-4d4e-b948-2cb19ab9e6a6" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f55ea87c-c854-49f0-a99c-822f8477f705" data-file-name="components/FileCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="471866bb-1af3-4fb4-8cfb-cd582d002c94" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="d7f30edf-905b-4699-af4a-1283e7df262f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a850189b-d3f6-42f3-b0ed-d640bffe1550" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of the file cover image from cloud storage
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="b5c76936-5b66-4444-a160-f6069e54b5d7" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="db6e2635-1877-46c5-81f7-c44695951b8d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5fcf0123-a369-4529-8939-d7df89a94ffa" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="0e472440-6259-40e9-8eee-fdb005ead665" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="3d8ee95a-7464-499e-b536-864a7a20ad1a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9866b115-d2ce-416a-9d4f-30a1df22c7d5" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="263e6c25-268e-4937-bbe2-78544154b6c8" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="3c6b3b85-e6bf-46bb-8ab3-19885dc28130" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="83211d67-a969-4c25-b3a1-1f127a3d9b82" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8068bcc7-af7b-44f4-a9ad-958afe123516" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="8c311412-49df-4ebe-8d1f-901783646a18" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="5c78d8be-d79f-45a2-ae27-1d93cea55878" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="65472a2f-c3ec-4b42-8d21-441aa3840133" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="d5edd6c7-6fd5-49a7-92d4-1fd6e774b3a7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="97ed000b-908d-4536-889f-8857a1fba9bb" data-file-name="components/FileCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="23621309-456c-4d0e-93a7-5e18b384bc26" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="187ae6b6-fa8b-4d0c-9c68-192966f8ad9a" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="be3cfb75-9cf1-4770-9f4b-3323a6e20db6" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="17c8b26e-af2d-4cda-8e84-03359f660fc0" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="34943b99-e17a-4102-9a61-3d254909b355" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="daaf3c06-1d61-42b7-8124-3ad6f380155c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="5c6a66aa-7179-4090-a039-1f55e3bd4be8" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="0992fca9-e5d6-4d75-a272-dcdde914b763" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b9bbcdd5-40be-4154-8096-71367e8d7fcc" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="30a9619a-3815-42b3-92cd-fa31a7bfec1e" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="5a7f2390-a239-4f4f-958c-5832cb864513" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="a9eb19dc-f8a6-4bec-b498-f6b84ec68d30" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="62424bdc-dfaa-41f4-b50d-4ae5ba8f1cd4" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="c7d71642-4a00-4fd8-81af-2b656419c2d6" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="e10db181-84a3-48d0-bbf9-19855a7a967e" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="87f92d49-9957-4d4f-a421-44299b2d059d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e471a335-ef71-4f89-8383-885ee75f2fdc" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="78054a5b-064f-4ccb-a664-cc3980bee1eb" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="37202d2f-cc70-469f-b2c3-95284dcd6b6c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bfb2a2d9-40fc-4f19-a4a7-115dcac86825" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="3681d92c-5b91-4f19-b8fe-197a964ab2f6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="5b10d700-32d2-4ed4-a10e-7097ba367465" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="f6bc348c-bac3-44da-817f-75b3ef31600b" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="86ee2f3a-3cd9-42dc-9bf9-eca54caf38ee" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="e15da5bd-3dd5-441e-a5d7-38a130ea4723" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b915589f-224c-479f-86b4-5e0e15f0944f" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="d4d60455-5643-44f3-9b24-9d03d92e8b2a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="5c49aa25-b91c-4d16-9dfb-d0498ffbb288" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="4d43ef62-5aad-4222-bff3-19aada33acf4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4bf3f1c3-bb56-45ae-9b84-ec791729d8c2" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="84fb8281-64c0-40e1-b7f9-4c9a2a0ab589" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a8824676-19fd-4416-af7c-b46a0ba43337" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="ba51b0b0-da5b-429f-9bd1-c9a61393be69" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="10208e63-9db1-49c9-b922-1cb2a31d83f7" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="9b301daf-c47c-494f-aaff-7c05ad3313ff" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e7f9e8bd-25b6-466f-8a57-7f60d661397a" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="95c69259-207c-4d74-97cb-a686c29c55db" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="d6702819-708a-4458-ba7d-430c92b2610b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c96aae05-cd19-488a-b92f-5266e0dc13cd" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="e90944a0-4748-4fb3-8440-203cea330bf9" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5e1fb2f9-55cd-4678-b9c5-a6629a353033" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="8b9f8a5a-2ee7-44aa-98a4-e0d5712cffa6" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="71a761ac-d279-4139-be7c-3a7b82fa43db" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="9e09aae9-f564-4d33-9b3c-a3b2303b06e4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0a580ff5-7309-47dc-8c2b-12316a374795" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="96f3235a-818a-4b2d-bc8a-b4c1ce34bba7" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="a4323410-03a1-4a2d-ab91-6da12690f605" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="016cce82-9c93-4a95-8aa6-62cd63dcce9c" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="233c9b6e-0de2-46ef-83ec-bcc6dd7f1e2b" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0162a802-148f-42f7-97ec-ba8f7ef43965" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="978c8236-0259-4693-8bb7-393d8b857ac7" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="d5703b49-5054-4f5d-91f4-92c51bdd796b" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="7fdbff6d-4b08-4e99-a087-7fa57dec03db" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="d9cf36b7-c3f7-4b5a-a90f-d8fe497f1e87" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="7c1893fa-0488-453b-9f53-edbe16edefc2" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="98756d17-9b80-421e-a3f9-edce408fcd7f" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="19e60a83-1184-4d1f-8123-bf72c0e50862" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="42ddb667-8018-406a-baf4-c7ac0fc710f0" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="a1cc7a8a-c0f8-4602-b44c-54517db384a0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="a9b7f3d0-3b62-4090-aa76-5793e33b25b2" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="dd4e1d55-183a-465c-9f4a-03cc67664c1d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="b42b5afe-8d9b-4c8d-927c-e4a6d9286014" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="be620719-e57f-4667-b825-464d490fe695" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="f7640c4f-8372-466f-9a82-b00e763807a7" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="34040cf3-ef92-4ca4-bc4d-dd1870600590" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="12887e53-a4e3-45cf-80f2-a727a51e889d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="b1534c42-5768-4c12-baa4-897053efe168" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="c4309671-e039-4c97-b767-6eb45388bbb8" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="a391a54a-6502-4830-872c-be4de59e6fc0" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="f4107ea9-5a76-447a-8a13-8432a31e4119" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="fc43fdc6-fb65-49ea-9694-64847ffcc9b8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="148ca553-91cc-49d7-803a-bf4e13506637" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="cd340505-4f26-4de9-bdc6-75c78fbd3e49" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="be0fbe56-32b3-4e45-b7c6-eeefa8f01799" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="c9d459a9-7c39-4681-9660-82d18e4fb67c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="71eede24-9ed4-4ccc-bce1-6dc2c8b5e480" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="7e80a49f-d36e-4c57-838b-fb83891da68d" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="9c4ca6d6-99a8-4ec2-86bd-c8e471710a33" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="a92e82db-7446-45d5-b7c8-b0820309c66a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="401345fc-d06f-4037-a0bc-ae27c95e795a" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="6a247131-70f7-46df-aa0d-a24cdc57b9ed" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="a3a4322e-cad4-4cb1-ba5c-49b6a37ec1a3" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="dd56f542-a9df-44a6-8ea6-9e56f78dd2d7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c03e1d3b-f755-4d58-af1b-be6e1884e42a" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="3f5c370f-4d09-4cff-b05d-da8247b65489" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="56cef12f-5a18-466a-9c03-18c42ad02516" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="03d4d773-1e68-46e3-a91d-27781abb20fd" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="878fcdfd-5454-4aff-88de-6448a072e029" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e3c3e193-2f97-4b1a-94c2-ff6e1e469e17" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="28523285-c032-4d4e-a074-95527cb20fd5" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="7dc85b42-b5c6-44f2-8ac5-931fa47339ad" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="12c52d20-6ddc-4bd7-8755-d2ac8503a260" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8520de60-9c03-40e6-9171-bee1b57d5f24" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}