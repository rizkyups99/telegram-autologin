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
  return <div className="space-y-6" data-unique-id="9c76f1e7-82ef-484b-a419-f8fd5a2082f9" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="3c3e4836-8929-41c1-806d-4dd8d0e2cdb2" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="1b50f223-6ae5-40b2-87fc-28bd397f65f7" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="28d4469c-3ab1-4090-ad48-6a4abc1f14ef" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="83290212-1e39-4acf-8fd3-d0b8ae477425" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="27e83404-3ce5-4b53-b0ed-5a64b3c1e2c0" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="f45b8075-94f4-4775-a97f-87f2448f6521" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="ccf2696c-3ab5-40d8-8b2f-cf879b68f0fd" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c1e62b9f-1bfa-47c5-bf8d-566bcd2a8555" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="377e6998-3101-491a-920b-a2911a27caf6" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="d5528dfa-916c-4a8b-ab4f-b900d9d4eae3" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="b482012b-20ab-4595-8765-88d15eac193e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c20fc2cc-eec6-473f-ae4a-8d58ad5aaa44" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="34425430-d571-438d-953b-ac90a1b400f8" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="1a72f156-fa87-49a7-8623-5a068b053847" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="1127dfd9-2ed9-4f7e-aae7-90b85f440307" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0ea88bb5-6d38-47f5-acfc-5cf3e287c30b" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4b186311-0548-4f93-b452-ea6c523db150" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="4638b8d9-ce46-4c12-848d-f07fe58d77cc" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="07834991-55c1-4d60-9018-a5996fb64cd8" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="1d16a57c-0287-4b79-a19c-e73d0856c373" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="2d0e76eb-74c6-45f2-85ca-e83dc3699fd3" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="5ae8ccb1-7411-4074-a7e1-2a29e554c429" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="fbb9315c-3b30-4e4f-b46c-eba86a28b3ee" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="c3ad8dc6-5899-4856-8133-19c76dafd5d1" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="9afafb3a-daa8-46ee-b11f-e6739d935246" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b4386ff9-627a-4c92-82dc-5372318347e7" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="6b102f75-e8a7-4054-b583-16a28d2ebe8d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bec80f0e-5377-49ab-9b1b-189c985635e9" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="a927c6eb-d926-4b1d-a3dc-9e15c3a91eea" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0a2f23aa-2080-4cc0-bbaf-ba5d1b231f71" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="e11ca990-4d34-4d4b-ad7c-f7e5874347dc" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="939ea3c8-2ac3-4168-9dd8-1085e05245ec" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="0640c849-7df0-428f-bad1-6d70213cba32" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6872587e-3018-480f-a1b4-a266cf28519c" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="6d14a76f-439a-4d0c-b991-e0f0b3c4dd37" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="aa2541d6-76bc-48e5-b7c0-8cd60330e831" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="17ba17e7-4b13-47ef-8f0f-712a6ddfc110" data-file-name="components/FileCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="b12af3b9-2680-41ef-b492-4bedb68ada4c" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="db7f1f7b-ac0f-4431-84a1-02d011b3691d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d365a39f-532d-4bf2-9282-7257b8c800df" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of the file cover image from cloud storage
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="21285234-7d4a-4910-8744-0f4a9eaf0662" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="6dd7db6f-62eb-44a6-8805-d9ad5b2729e9" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c22a9023-c79e-4c5d-bdf8-44b7b2ef9468" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="3902a90a-0cbc-421b-bb2d-9b8ecf5f0b18" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="13b66737-b24c-4ac3-9bb3-0929aa8a3d76" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="91e7b136-caf1-482a-acfb-0a86b8f8c48d" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="9e95078c-afa1-4623-a650-a5e4ad52f306" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="9f341dce-6b31-4d80-bd9e-022a580cb0cd" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="b65d5082-9601-4093-a7aa-388a457580d2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="da218aa5-fa48-41aa-95d1-7cc7c1f1f194" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="490dc137-9659-46ce-a40a-3d271bbfebe3" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="a9e4cbd4-3654-45fb-b81c-75a650095f5d" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="4216eb17-94ba-487b-b3d4-add5fa42ff74" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="e698a20f-e3b4-429b-b980-32fb1edb741c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="31f2a121-c794-46dc-bae5-3180ff48d38e" data-file-name="components/FileCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="8c5f2b60-6df6-4ef8-b5b4-ac9f45781c18" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="060a77fa-8d87-46d1-998d-e4d10b46b036" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="1a033ce6-c610-4865-a823-c35a09f06ad7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="13e974b5-8e96-4a9b-b6ef-ebc42e2d8bb7" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="456628ea-7933-41c0-a7c1-dacda3e5dfb6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="fb528b5e-e6cf-40a8-be5b-b6e485a731b5" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="a3551616-c1fd-4647-a92e-d4dd2b54eb1c" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="2f3b58d8-b678-4661-bbe5-4920d27264f0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="db91ef48-8810-4b14-8aca-7b563b43da6f" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="a0fe69bb-20b3-4494-b380-3423ad0ce13c" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="907d22cc-b2c0-486a-9be1-58f1129bd2cc" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="7da8a0a2-9c30-40a5-8011-2f54e33369df" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5dbeac3b-319d-4974-a8e6-e28ab10d9280" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="43d5671c-917e-4150-86b0-2d0438a69ae7" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="8e28dcc4-e2f6-4da4-a406-40a116e432bd" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="20da7019-f6e9-4a8c-a577-f0e1cc28a1ba" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f35ca07e-58d7-4c71-9c38-c50063cb49f2" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="b322ddc9-4fc8-44ed-9059-3b4d33fb7400" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="4b4d9a30-a5d1-407c-9355-24bb83cd7729" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="88c53797-cd3e-4d14-ad22-3737fb37446e" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="a663903d-68b5-41db-8a75-20a9407331d7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="af49d022-a1d1-4158-a5ad-3cbc0895d4e9" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="b75d1706-49ce-4171-a09a-b05b39976d69" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="61db2e91-165a-408f-af36-b6ff7b39f192" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="f3382e05-948a-4e29-b2aa-63f99798047a" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="bc7b0085-6dfa-43a2-96f5-b3244eb5e5cc" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="ef17ad8c-74c4-4354-bcf7-c63cf035a0cb" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="de2f84ab-9505-4e2e-a371-2cb9454034db" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="81103069-fcaf-4bf3-8a77-178844b1350b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="cfe62603-7fc8-41ca-8046-b28bfd734f59" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="2ab57816-2ed0-47e1-8ab0-5ef2a8307aa0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ebb2cf60-91c2-4c26-9f0a-2c1c53e0db35" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="d42bad58-8348-4a9e-9811-83830f3104c1" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="f3c29076-1976-44a9-b9c9-7c857cd6aa27" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="4cdc677f-445c-4be1-bc70-f83e5f4b8719" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8880b95c-e65b-436f-a517-521748e6f902" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="36f09a3b-afc1-4492-877d-a5fbc9877d9c" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="992b2145-1a90-4afc-a2df-71c3fe533cf9" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="41512765-36ea-481d-9a3f-c3824d77cf93" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="c92fd07b-af01-4436-82e0-f47671953a79" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c21cde59-e8f9-46b0-a523-48e84bea6345" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="fa9f5617-7366-48f9-bd4c-2f319834a8e8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="cc0d678a-fd51-4f8d-bf6c-e7654ee793dd" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="34c57d7a-ae53-4544-8766-c60e98121225" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e2942327-f6cf-43be-a99d-3eca31ce40f2" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="1f1a0fe2-d07e-4f26-bf38-7f481e167c6d" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="54b45f01-e5a1-47aa-bd4d-ed34b20128de" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="084dd5ef-23af-4c1d-8333-41426b539876" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="4d53d5ad-0fe1-49a8-9661-e4ef93d14938" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="de52fa54-2c55-4a66-84ae-7ae47d4b6f3c" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="7206cc2c-b700-4999-93b5-07b7f8130674" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="11f15960-9a96-4e01-b7fa-f702ff04c165" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="4878aa46-9a4a-4293-abb2-d2ca0ccca3f0" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="183609dc-ae20-49f4-ac80-f0039292a6e8" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="d28acb9e-d5ee-438c-b5f2-d84b8ef14ed9" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="a7cc7255-acf4-4125-b935-ddd06359c50a" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="3a8b0ce5-155d-49de-8c83-24c6ca6fbcec" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="49446d9d-3bb3-4dee-bb4b-cee970c2eff4" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="03675eb5-514e-42e4-84ff-0fd5e6b1bda1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="4a88d3bb-18f3-4e0e-a6cc-90f4fd6c8d49" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="201e75db-a7d2-4837-a60b-68c10c873d74" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="ec3625b5-1047-47e2-85f2-1ecfdea3734c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="6e7ff101-66a1-4597-bdcd-56e01a87b0fa" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="9a696dce-de30-48e3-850b-8f9e593e991c" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="ebbc9714-95dc-4b1b-a47b-6f158d30da23" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="6475ef23-c48c-47fb-814d-cfc1a920e6e1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="6aebf956-b74a-43c9-a662-4345475beecf" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="947c0044-557b-4d68-a398-0e03eedc6e21" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="27fe0817-5118-4385-996d-0d8edd781bd2" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="a1777e4c-c032-473c-81d6-db30922b42fe" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="377a9f56-95aa-49c0-8acc-b2e31f92a2c8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="07e19d85-43f3-4385-8d48-f173b8af9d37" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="9e5c81c7-b0d0-4db1-b575-81f615e1b122" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="bdb2d9b1-d39d-426f-9cc3-88fb922897f9" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="1187c413-ec40-473a-bb05-fcc57dc917c3" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="cd0223b8-c3c5-4434-833c-adc7d38f9d13" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="ed562e60-c147-4f40-8957-407a6b379548" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="75c416b8-d381-4598-9019-698d9a4abb31" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="5a2be726-60d8-4827-816a-2a88d62ca404" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d23322c6-4b73-40a0-9c08-a4e15cc487da" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="df9aaabd-1e7e-49de-8488-4628f57ca553" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="0605640d-51ee-488c-bda8-fe1b490cfa3b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="d7afe862-0de1-4681-a902-371273fa855f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6d88dc1c-b7ef-4edb-89df-aeec354f8ea3" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="9f5eceb0-1736-4b00-9055-ffb39f0c3f6d" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="2a8519fe-ab58-4ae7-b1f0-d06187d3907c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="689b8165-629d-4979-8c1b-a08a51b990fc" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="35b69a6e-c41b-4917-89e9-5c6e9956a0d4" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="dde1c7dd-c7a5-4b71-9e09-9828907a2645" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="328da77f-d899-4381-bd6b-6aaa2e6f5904" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="fe09355c-70ba-4e22-8279-7117e1256dac" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="bae06517-f4d8-4dfe-a96f-213ec060c61d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7034d89b-37f3-4260-a549-25ac5270b4af" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}