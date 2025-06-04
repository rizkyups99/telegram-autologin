'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, FileText, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
    coverUrl: "",
    fileUrl: "",
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
      coverUrl: file.coverUrl,
      fileUrl: file.fileUrl,
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
      categoryId: ""
    });
  };
  const createFile = async () => {
    if (!formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'All fields must be filled'
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
    if (!formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'All fields must be filled'
      });
      return;
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
    window.open(url, '_blank');
  };
  return <div className="space-y-6" data-unique-id="9a4acaa7-f55d-4a89-801b-636655b361c2" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="4b16728b-de46-4cea-b037-b0b344b4cdbb" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="d2de0134-2601-46dd-8fc2-8f86905ad0f8" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="b9719842-2807-4fa5-ab21-1fd9481dd678" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="84f8f7b4-f82e-4598-bb7b-3bb040aea880" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="d53df735-f7b3-42b8-843c-677418d4adbb" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="10f953dd-ed96-483b-beb9-d8783f018f76" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="53a0452e-517c-467d-b1b1-7254f0f009aa" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="43d1ac54-dd29-467d-8c87-25db0fbb2e32" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="96c2e28f-7610-4bc6-8071-000a6f2677ed" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="55a174ea-7e51-4b15-b788-77a8028d10c1" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="9e2a2607-1886-4508-a4d0-b139de9ec5c2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c605114e-6d7d-46af-b023-0eb591b14912" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="e80a4018-54c8-49dd-9442-25d0043dd03e" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="7f0c1eea-e3a1-4858-a07d-a99735f437db" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="82450208-56f4-4844-8c48-fe7bd4b8ad64" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a80d7522-d0c3-4818-9224-613dcb437353" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="a47645a9-f2b5-456b-aed2-4b43902dd09a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="3ea02a90-937e-46d4-86ba-bb469e10239e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4284d182-95ff-4900-8dbc-652aa4d49b82" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="79966606-f018-4473-b235-121530225bbc" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="fa061dea-657b-4dbd-9222-0e76882ad052" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="bce02620-5814-4d1b-9135-9c71e615ee6c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="83542a0e-312e-48b8-9ad9-880b857342cf" data-file-name="components/PDFCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="565a7cae-0235-4708-ac72-e275aa4da900" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="d9d23e6c-0a62-4b9a-a66d-8f7cb196a643" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ffa7398e-945e-4673-af68-7d90703e7db7" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of the PDF cover image from cloud storage
                </span></p>
              </div>
              
              <div data-unique-id="7fce961f-f88e-416d-8bf2-d8b9c2719472" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="ee0000ec-0e63-4a71-8979-04067cd1ce34" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0b16e3be-20be-4690-93fa-e33660676a5b" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL" className="w-full" data-unique-id="90b4fcdb-d599-460b-8b3c-f71b93308d32" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="f16be66d-10ab-4426-b0a4-36f18248de73" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e7ca0ecd-2ba5-42aa-a863-536d02da920b" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="5c7026a6-bec6-47aa-a383-2a01ec382483" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="b30d4d4d-2b39-4b6a-a4f3-676c7d8a9fed" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="d7a02f46-7bd9-4393-af90-2867eb32e41b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b712cd1b-301a-4670-bb2f-98b5d9bc9594" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="1463223b-0ee4-4c38-b25c-0c66e8ef3841" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="752ff580-1c04-4f45-885f-c270cbecad80" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="9744da79-aaaf-4324-bff6-a545aefa6211" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="cda31c42-8b43-4907-8c47-f6e53a9b6cc0" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="47b2f3ea-1a9c-4c49-b0be-7302b2bdd459" data-file-name="components/PDFCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="261ca100-7eff-412c-b60a-6561ab61001a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="72e0b253-2a74-42a7-9bc8-6d9de13f7208" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="5b09ab5a-bb78-4415-b14e-837144d76ff2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f07602d1-7a96-41a9-8bd9-c62a994cc21f" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="de5fb45f-0fc0-46a9-b902-e0aa2c64893e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="f352f580-0987-40a4-927b-aa11ed0f747f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="e9e25a0b-bb59-4aee-8d6b-29d61a325ca6" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="b731ad31-0020-4c25-8ca8-e05f97681d65" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="05a2cc17-992f-46ec-a003-21d603bbc53b" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="c752c472-6208-49d2-922a-4c1a7f70516e" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="c6ae9117-2d06-4e30-a213-f5794ec30866" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="ed822241-5209-4d80-8bbe-5544c8e9f5c8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b25cc051-42b8-49ce-8e8d-a79839918041" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="34e8c9b7-7621-4650-aafa-052fa195c699" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="790d907f-5a2c-4cbb-9436-13ba96c921c1" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="1570feaa-7ae2-42e7-8a72-67828f40a12b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a6d325ae-235b-4dcd-b016-e4716542a745" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="18a029b2-420a-4a01-b4af-1b2d0b8f1df7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="cfa599c3-6ae4-4b9b-8de5-b2c8bea8f09e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cde99874-40d2-4573-b4c8-93ef94dad84f" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="71850f3c-de6f-46dc-af56-09c3475fbc59" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="45b23f52-26ee-4614-8b74-348667561824" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="760b8c49-aa51-4ee9-a31f-684ffbf6aa3f" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="dfca6f03-30a9-41e0-ada4-4c143671c7dd" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="f12e2be0-31e0-423d-a3e7-f51179beaaa5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="73e17a87-892a-4a1d-9951-2a3d86c3997e" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="ca682f29-fa29-4011-be59-5768225fa60d" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="bd174932-fe4d-4bb0-99d4-6c51f31e3b30" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="f4148071-54b7-4ab4-927f-e99439daadcf" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a3d5dc8e-1e4f-4540-a593-6ef6dbfb9539" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="5c637427-7847-4a38-abdd-bb62d60a0c01" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="95b2b74c-5560-454d-a5f0-9b480a4b97f4" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="a5e476c3-02cf-43bc-988c-7ab68d5f66a4" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="c0a0627a-e2ac-4a9f-9ace-10a39c8bcff5" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="a8eb45cd-32bf-4259-955b-1f1eb7450b41" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d60cf10b-a21d-49a0-bab9-2b44b6275d73" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f6c615f0-3546-4bf9-8060-e6ae886cc03f" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="5ba64c1c-68f8-4b41-b687-8cd888851184" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="39ccce01-8c88-42e8-a688-2ea1a30cb901" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="407b3d39-10af-46cc-8e91-481fef9ef79c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0f4f8f17-cd2c-44db-9e4e-8566ebc9c973" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="93afa551-b9da-45c5-946f-7b5ba7c3a19e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9047caeb-1bbf-435a-a911-be958695addf" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="5e4e86ea-f184-4523-b285-a99070c090f9" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9d8ffb22-c0e1-4f87-beeb-d06c752cd7fb" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="d7efe592-0758-4d06-a756-5f1b94ede773" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="357abf3f-f914-49ee-a882-357fcdc4630f" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="2ce0c370-3036-4fa0-b2f4-762ff530769c" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="65749183-d39c-4355-a839-3f9f90559a7a" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6132a5b6-42a4-486d-a412-9a08cc9aa9ae" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9939fb59-a71b-4d5a-803d-9f9f19c8c411" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="e83ecfce-46bd-4ade-9b6b-9e8ee6c9133e" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="ecab9a3e-5b75-4169-8a4e-d4d99ad947fb" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="e751f41a-a4d7-4f02-852c-51874d99bf0d" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="4ecb8308-cdf4-422e-a390-6627dd6228db" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="612a39e8-7ede-42d7-9d11-8945fdaf3a34" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="86ed5bfe-d336-4bd9-a487-3606a80a70d4" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="31af6ccd-3efd-4543-9b77-4ea4bc738dbf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="8e62db7f-61c3-4de9-a33b-e71141495985" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="4b3621b0-eb22-49ad-a496-7e6d61631a5f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="58ea4a59-1a94-4ca5-9a06-372e4bc69fdc" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="12dd50e4-3bd5-4046-8624-46244ad79c08" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="8e03ae66-c04b-401f-bd57-446fd17dd355" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="bfa2fd0b-52ac-4082-b6a0-aaca20cd6cf7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="b9ae8e2f-2afe-4928-8281-d86f5551ab45" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="9bc4e839-abe5-4b61-b05b-3d9e8506b5d2" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="52399054-04b0-44c9-b901-fc59373a7854" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2848007d-0b39-46be-90c0-b94c7c800557" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="a7be94cf-1411-48f0-a0fc-7c82c72f7493" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="1eda9d28-9470-42af-8238-78b65ab2671c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="4e0d06fa-65b9-4e0d-991a-787dc055614c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="cd116b8b-a456-4f85-8414-9691ebb05b92" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="3fa8512f-0e38-45e8-98d1-b5c9c120dcc1" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="a57d49cb-004a-45b1-bc32-a89bbdb3e448" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="119922da-1d99-4f0d-9542-3cedf376ff8b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="23d21162-701e-4dfc-9873-76dd9c4a4af4" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="9db9886b-bbe4-493b-90e3-f203739d0e77" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="af82108b-9de5-4370-8596-7e5a0c2453d2" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="90fe8004-cf3d-47ff-ac1e-22c904bcefcc" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="05d1dc73-dab9-4366-971c-17e6d77e55d4" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="8913c127-b200-46ee-b5a8-831f730f6fe8" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="28fdf122-ec6d-4c59-a514-085474eba735" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="83de96c5-b7a9-422a-a5c9-6c5cf44885bd" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="cdf0ef45-7e89-487c-854c-e6d9d5e5bfcd" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="184de4d9-5859-4913-b8c9-5f7691329074" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="b8b5ef23-016a-4022-9697-dba3a1d0b4b9" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="3ba856a9-8ccf-4a55-af2c-20f28d84e091" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="0dd4b7d8-483c-46c1-9ff8-d6871e634fd1" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c88dc8b1-0f91-4e36-9c5a-d836aaacb44d" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}