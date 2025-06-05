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
  return <div className="space-y-6" data-unique-id="4bd6f287-a4bd-463b-a027-c4eb25bc1c58" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="4637d354-706a-46a7-afb4-a6805003f73a" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="e330d7e9-260c-4491-941c-53f330d4b614" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="658cb8fc-037d-45d6-879f-55395c5e7340" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b2561356-ea7c-40e7-beae-3a4c4c0b204c" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="fafb6161-ff9c-4de6-9eb4-9de940d38e22" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="e4349bcb-b0ca-4ba3-9a93-3f5eba970a89" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="86d744f9-cc82-4621-899d-d01829c55b94" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="116e6953-202e-458f-9137-c11c768139cb" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="448770f6-25db-4453-a64e-a74ced00617e" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="c6dddcb2-9421-44c8-8860-1065d1fcf5d0" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="5027660c-65b0-4de0-b065-ccdefd9dfb1d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6d95e14a-962e-476b-a99c-d93579c591ec" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="78e5371a-bcdb-4167-852a-b61b53bbcea5" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="9cc0bffa-de66-4d01-a303-5fe33e53b332" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="e488d8d0-7c04-46fa-ba0d-b62d2b583e51" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d1bdd6d8-67fe-4af1-85cf-34f643037fd4" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="3f120e6b-1c09-42a5-9e02-7af7f1f28769" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="1b0db302-b0d1-4c57-bfc8-aaa4d6e3a068" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d904d56d-fdf0-42cf-9607-2283fa65bf6f" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="98665eaa-6581-40b5-8f84-9623d5988ca2" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="f3b1661b-3e69-4e7e-92a5-99c61bb8baa1" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="d2d449e4-81f2-4409-83b9-2d51fb3ceaf9" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="afc240e1-7517-4e3b-82d7-feb1f48fff26" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="6f55d759-b990-440b-b268-b29032383f74" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="eecb32cc-0eda-4d51-834f-9746ffc72d04" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f8a6ad09-bb9b-4091-a611-b3a27ecf5c01" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="d3832b70-aa55-41d1-9d83-94356f4dbd1b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="1d42e2ce-d4df-472b-b7d1-030bd7e00a1c" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="0fd844b0-b014-40ee-8d31-b8730dae185b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6afc95a6-3204-409e-a753-a4beeaedac21" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="1ec13425-1acc-41f8-9dc9-0763bb73d87e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="65dca212-79b3-4b00-a3fb-ff1cbd6fb7b1" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="1da4c26d-5888-46bf-b461-889d80c3452d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b646c8a7-d1c1-4134-8869-eaf8940ab70c" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="31e02918-d52e-4313-9add-b571533d0292" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="057695b7-1ac8-418b-b390-13e84e3fcf66" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c6381370-889b-4831-849e-cb3764d5fbbb" data-file-name="components/FileCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="cf380369-7dae-4f31-aa0f-746c6bfcf90e" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="f14b5a6a-7e50-4bb5-9f14-c020667e37ad" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="cf0172bb-9465-4a2d-9dba-fee7a558ef85" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of the file cover image from cloud storage
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="87ca7b07-5fe5-458c-a167-82c782a7d17f" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="2c399e98-ee85-45b7-90ed-da10fa87afb2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="78b7d5fd-e426-4fec-ad49-2ad9a3c691e5" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="592b8b5a-a4ef-4eb0-82c3-2ac4f8f36f75" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="8941d4d8-2f9c-49eb-aa08-4f9425a75cc0" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="637a1d84-3091-433a-a073-f5c7b85ffc4c" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="407c4a57-db20-4429-935a-519fc4db1c9d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="e455f048-5ce6-489b-9d8e-9ecea98d5e73" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="6bda2dd0-3933-4ec7-a461-7e217e7ac934" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="56b95b47-2e6b-413a-b423-3e7b4a400257" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="2a0ae99f-53cf-48ce-a760-8a82064c3bd9" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="c3cd37c2-c024-416a-8480-92ac04fe41f4" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="bf7fb33b-1849-4834-b1fa-452ccc45e7dd" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="c36a171d-bed6-4841-ba1e-f9e6874d9062" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="07eace65-8af9-4b88-92be-2f57ec36bd7c" data-file-name="components/FileCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="eb73b5f8-de03-4a2c-8b14-234b501ce424" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c15738ed-f1a6-4f60-8de9-51358bff35e8" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="b9f4b010-e63e-4258-a381-b6cf31d6727d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="14259617-e4bb-46ec-bb38-88b31d6b817a" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="58daa50d-61dd-476a-8159-1e4694a560c0" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="dbd10c07-81d6-40c0-a597-f1ee299fe290" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="b2b31a4f-f43a-4d1d-86c7-32c826cec40a" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="44eb15e7-ca7e-4f54-8a6d-f089a74a28e2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="58d8dd20-61f1-4fd9-a41c-e4e8d6c9b95d" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="a9acd60c-2d1a-493d-958e-ce811a8533a1" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="7c2b2a00-0a20-4f29-8889-6482c225fcfd" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="1e7cc926-3300-404b-836d-694b6433a84b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="302402c9-4d9e-4bfd-86ce-8e7b3c68c700" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="c6f1426a-df20-487d-8a6e-817faa5f17b3" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="b0242faa-a60c-4aad-b2dc-89101c139d98" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="dbd5d767-09e6-41eb-a1b3-3c18bd05f09e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="1473cfa8-cbe1-4a37-aa24-829d9afec9e2" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="fdb349ed-8b39-4fa7-ae9b-69b69304fb4a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="f219b1ba-403c-4d71-a4f2-07015b7c0bf2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f9411f1b-5263-4511-87fc-86abebfc5351" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="eaab80c6-84fe-44c7-941e-41bef222bc36" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="0a97ac75-2b4d-4f6c-85a2-7adc00ad4427" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="ffc6931a-1560-4fa3-b71e-8f6a751e9fa1" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="ad8a2413-678a-4630-a0b9-bc9ee50afbb5" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="727ba717-31a0-43b3-99fd-cabb82c8f7eb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="9379f18d-024f-4a9a-a387-216ec4e936df" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="eef70ca2-6ded-4a6f-9f6f-d98b8250f619" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="e9aa9521-d6f5-4ff7-a37e-d0fea3f32a78" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="9a9e6336-5bdf-4b11-bda4-ae16321e2ccb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6285abe5-613c-4343-b2ff-2f02d1ecb3c4" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="ef19cdeb-c617-40df-a162-d0b53364ed34" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ede2e47a-0489-417a-80c7-517d7eb427f1" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="3e0885cf-8e5e-4aa9-8934-98127077a341" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="6ac47af9-6d2a-4125-bb0f-fac73562302a" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="2f778f41-7c2b-44a3-92f1-bbc19e843ef8" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="98f6e09f-f28d-438e-8f40-fb9dd7a84698" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="b8a6e7f1-4a9b-4fb1-bbde-09dd565a68f1" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="13e38f2e-98c8-48f1-a86f-4a111c6b1892" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="f21db2a4-f75a-42b9-90df-0aaa83ce9e63" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="f324218f-96c5-4f16-ab26-dbab103fc45e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="35ca3b0b-d89d-4e2b-8728-b23da8e649ee" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="231c0bb7-137f-440d-be48-f80c111b28ed" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0be61096-6864-49a1-a61c-090515f9188a" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="96345aed-836c-4df6-a8fa-927facc3d80f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8f68a4c4-f02b-4aca-98b7-c2d37d972f1c" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="edef9250-3fce-4ac4-a071-300fd3953404" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="12a1cd9d-b13d-4b2f-a596-70ac722c17d1" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="b4b469b4-4472-4129-ae43-3f2825113b31" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6b995130-6315-4072-a676-3708533c38da" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0f23a981-7756-4b5f-b696-74be1193cebf" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="cd728c7b-a21b-4639-940a-e4c14f329595" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="e8849b33-982c-4fe1-a625-7aba017439f4" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a1a0bed9-40d6-4a82-8c15-4c5d4ed5e42d" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="097dcb29-147f-4f13-9672-89410b0ddd76" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="05010f5e-c257-4951-a75b-d96dc5de3dc4" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="2270c075-e434-4852-b7ee-37efc8cec934" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="52bc5f4d-60a0-4724-a6cc-9be0c964d8f3" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="4b0159f4-2473-49d3-8ac2-c826e85b2a50" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="afe23bbf-bb2e-4674-bbe1-b27a76986f07" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="ba9e6d9e-545b-42d7-ba7a-976f5569b110" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="f61eabcd-a148-4a6c-bd35-8697aa56daa1" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="56e4b977-e907-40df-894d-997ac6db704b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="e3329e17-1640-4295-b951-9d1c8f62b3e4" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="4e5777ff-86c5-409d-a36c-bf01a355cefc" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="0bd42a5e-eedd-4e20-b80a-7e8366fa1d2e" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="8de885b9-e921-4f8e-99ad-fab74c3d1f9a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="c82b455c-7019-4d96-8c71-d4ed57d3ea54" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="9a45ea2b-c392-4845-b1c5-8bc9927e43cd" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="101f1035-ffcf-48f8-82f2-ad7d8617bf50" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="0431b0e2-f57b-44d9-9893-6bc478495f6b" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="75f9498f-c953-416e-85d7-ee64a4fc64b7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e3b65661-b790-42b4-bb56-db6a3047d129" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="49c423dc-559d-432f-9d2c-91b062a46e93" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="413641e9-6c7b-44bd-9700-4657b31a254d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="c19a374b-d080-45ad-a718-878d7eb3d7bc" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="88dedd45-568f-435f-b6f9-65d9f0dde14a" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="6f04c965-516f-4953-a63f-61032be9aa58" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="699944ce-ff1d-4f7f-b644-2b22ddda364c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="c457e7d6-a07c-435f-9db4-093e38dca35e" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a4598997-38c6-4e03-9fa1-26519d2c6a40" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="4c0c776f-43b2-47cf-b51d-8ac0868b8313" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="67d19d14-fc20-441d-9bba-29704ac34685" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="21d4c00c-0342-47db-b038-45395ed5b568" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4112d7cc-c6a5-4ac0-9ef5-6bc0370b1ce3" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="83935389-e356-4c7c-b28e-793d1af07ddb" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="bc4e70d9-614c-4828-8647-c83cce234b0c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="dc09b495-ba6a-4591-b945-a2bff2b67b97" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="2a7f1fe2-b537-4b25-bc64-fb02eb7c6f26" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="da7214c1-11c0-4ef5-acb5-a70aad069e29" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="59a087f4-a865-4337-a1c0-735d7ff11008" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="a22eed5b-702f-43e2-9427-abd42bdcc1ba" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="4505feca-7ef6-4b79-ac06-69957dc8dfd7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ec20c316-0ac5-4bb7-86f0-988ca81de554" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}