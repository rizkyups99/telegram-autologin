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
  return <div className="space-y-6" data-unique-id="067acd07-2a4e-46fe-a282-fba00266adce" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="125b908a-3e8c-4d9e-8ef0-fec9ca503d41" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="ce3fd06d-025d-40e9-bb50-380d41c3a37f" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="4c95c09d-db84-438b-9a2c-74bbb3f33d18" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="13382262-3a64-4627-843f-77afe0640596" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="07f2e557-3007-43ce-bab9-5469ac06b9df" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="382fa8d6-ad23-4716-8f78-2681a1c2bfee" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="88d4d5c7-a849-45e8-b652-a1a88dd15c74" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="21c2a465-ba4d-4f1c-9f66-5947f4c2fe5f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="4546efe3-d929-45cc-bb31-661e9c918c58" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="77a8f506-76d1-47aa-829a-d84f23c98888" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="08e0757e-e5c1-4752-9a28-5e781ef6fcdb" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b34386e5-3174-4fb5-884f-fa614c640f7d" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="418bb085-a375-4030-82eb-e41dde16612c" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="e1930a4f-a4e8-4c94-b9e6-afc65f043cc1" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="477f4cfe-5eaf-4abd-9c49-32d7d18df9c8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0b423553-accd-4ba2-9140-61a22bb036ea" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="db423f5c-3c1c-4e2a-871f-e007d769f6ff" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="7009250c-999f-497f-9070-ffe1f48d626d" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8032f712-40de-42a2-8b32-8d2a97035c64" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="03712fd9-1063-4875-a8fc-41a20e601bfb" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="1401ea04-b520-4c42-b999-b25f6595c352" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="a59e07dc-28dc-44d9-b053-51cbff7dc9c5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="959c3b87-40fa-475b-b4a8-ac5574b08124" data-file-name="components/PDFCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="bf460c8a-bb7c-48a8-ab9d-81386f3de07f" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="a2ee9e52-d9df-45da-bd90-e41d5db6e8e8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="89a2bac4-8860-4efc-8a00-775fd56a2910" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of the PDF cover image from cloud storage
                </span></p>
              </div>
              
              <div data-unique-id="e1209deb-2241-44a0-be15-2fa86faef473" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="244ffc85-4840-4e65-acd6-d1b15b1556fa" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9b1cc78e-2ab7-4c51-91ba-12d3a19551eb" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL" className="w-full" data-unique-id="10ed9143-d340-4afc-bc8e-6ef5fe34b98d" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="f5471d47-cdec-47eb-94e1-f7e0047692c2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e402d50a-0a6c-49dd-92e2-79fc507b27d8" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="e317ffce-3a64-4771-910a-00b9676bdeac" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="7ed9123d-a5cd-46f5-b439-35331db65d4a" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="c63d1ea0-855d-4e54-944b-c5fe84d768bf" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ba5afb5f-c3aa-4cab-a600-56a9cad6ac90" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="a6303681-fc6d-4744-a1f7-6a22a8be57b1" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="5ed67181-ce4a-4390-a801-b9a5fbd6c311" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="81a293f6-e9d6-4069-9aec-b6500725622f" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="3f148397-f2a4-4f65-8ee7-ac94d827506c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e479242d-fa79-4510-9b63-f7992b1154b3" data-file-name="components/PDFCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="96b37e45-91a0-4864-9647-737c30212176" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="fac041d2-115a-4b14-ab8b-85c5810e0a94" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="49e07e8c-e10b-4d51-94a6-4325229c617f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="08307535-670e-43a9-87b2-675f031027ef" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="52f4d76a-e7aa-4f96-8e20-92db4dc7a095" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="d0038d99-967e-44ed-9785-1915a9ac6ce7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="27c91bc7-02c6-4fc4-9ff2-e6da9b6a0287" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1eb2c53a-1221-472e-aafd-5605ff799d84" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3af3f48e-b347-4232-b633-c6752bb5479a" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="5f7227f5-d059-4d54-9567-ab7b0da41b8c" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="4b52ea68-3c04-42bd-b9d7-f026cdb00acf" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="fe9afc1e-eb38-4aad-a595-9a7c9ea3095c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0cde609d-5cc4-45fd-ba73-8b41dfb2c207" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="b6e73b9e-29c0-4329-bd5f-900e2b0add52" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="bb20083b-1dce-4691-95bd-adc9315b3c54" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="6d6dfc48-bc4f-4bb2-bc6b-70aac97e4ffd" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f4978d98-8d25-4701-954e-df62a6a48e80" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="9c196040-6aa9-490c-acf2-5d0af6c883f7" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="27dcbe53-4fc3-4bca-a3fd-d799b074704a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8e91a93f-d8d1-4428-a773-8e30bce4b25a" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="cc55156a-5652-4e70-885c-2f2a24ad09ee" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="300876aa-0b4a-4267-b100-8a0f0d04f0c4" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="5ff83267-3169-47a7-8c3b-b365f6038f8f" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="9ea0b29e-2a47-4dd1-9946-f9461310a70d" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="6bfcdc92-8036-449e-b0e8-75ff78d98549" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="41214abb-9b42-4bf8-8710-08e0de6adab6" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="296acbf0-6c35-4fa1-adc8-51ee203152f1" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="4dd65b91-1ab5-4731-8db8-be9e50347e81" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="a5806ed5-19d7-489a-b42c-19c1c3cb867b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="bc0d9f99-6411-428b-9729-0a00e2f3a7d8" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="8cab17f1-40d6-4ee5-a862-8d703c5e1341" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="80255add-091b-4d97-a80a-7399643a9ebb" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="893a80ef-d51a-48f9-bd97-74a0e7a3e50e" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="c0757534-e37d-4d88-b191-7c90be2130d6" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="8ea6169e-23f1-4b65-860d-d4f8d4398c33" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="38ab24f6-cd35-4b9f-883e-867fd0014d72" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="15efde24-8f96-42ce-9d51-fd1b8b564537" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="42d70265-ee12-4e93-9e00-85bcaed1d3e3" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c5ac4539-e6d0-4dfc-a9fb-df43555c7b2f" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="464ff549-7f03-47d4-88c2-e4538cb47e9c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2d691348-4154-47cb-a7db-ca947fdc7fb7" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="00cdb8ca-9cef-4a40-bbc5-a0aecb897ced" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="60f3946b-3f26-4748-ae3a-b630815cf1db" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="c36a04e7-f098-4180-8271-acb51e6abc8f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f902d323-2a03-4c33-963f-8afcf6c4eec2" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="be6335fd-7fe0-4d64-bf65-4e442cee8250" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="cbaae4b7-b3d9-4716-9c2f-a2cb93513ce5" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="44dbeca5-03c7-49bf-8dbd-08f0ffe8507a" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="10521389-16f2-412b-8474-15cdb081d238" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9023232f-2968-460c-ae13-6deb9636f6d3" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="549e10a0-b469-4375-8043-3be5237a2108" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a07629b0-2fb5-40d1-aa3d-221ee84e938a" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="82d083fe-6153-4af1-bfa8-9964db0bf2ff" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="ece51bd1-0d29-40e0-b433-8804c2539d30" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b54b2a41-6445-4a1b-8c0a-24600724fef4" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="b5488d0c-7a60-41a1-b488-75980c41cf4b" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="7de24324-232a-4c87-9a6e-4e703f15bb54" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="01b99574-cc8d-4bf0-8cc6-c7b539852b61" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="0e3661b2-eb81-4f34-a84d-9964432d2b11" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="d3185d2b-43e9-4d8d-bb12-737c86dc85c3" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="32306da3-52b0-463c-a5ec-01ffdbe61249" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="3f7fd449-8725-4c5a-a799-0caf01714759" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="363cbf28-a484-4c7d-89b5-3241b0122745" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="aa549713-fdfa-4a96-8c8f-4f2b7a8e846a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="992db812-6015-4f93-8044-7f52f1711d86" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="2b8b25cc-44ac-4721-bcc0-3f65cff8973a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="ea42fe64-80e8-4db4-ad4a-f68ceab7af5a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="649dad61-a00b-4edb-8f31-c972d84ef41a" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="d54164f2-d69b-48d8-89e2-1e91368b8afa" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="5852270d-a174-4012-9772-d285a5f91073" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="d7e82c31-ee12-460f-ad97-e8e21d27acaf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="1b2e07ec-6f63-4edf-a291-7a8d6e962074" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="294789ad-0dbb-4d8d-9597-4f0de474cc99" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="0255aa15-b0a5-47e6-8f49-243cfdecb6bf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="ee663133-a55b-4877-b736-006ea42363f6" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="1fe106b0-1d20-4442-ac27-2b4b1bbe98b8" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="9e3b55fd-0e1d-4f0c-8810-a5cb5d6881bf" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ad7d4e20-44d2-41bc-9626-0557ed7b7b1a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="03aeb8c8-e5bc-4979-a7d9-5b5acb86018e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="392a8a94-06bd-4fca-a7b6-14090d9f163c" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="dd8db49c-69c1-4b57-a344-58550b23a3ca" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="089d918d-a971-4e37-9732-b4a9f71a22db" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="861e0ccc-9a54-46d3-9577-daab6615d120" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="8ea6a2ba-54b2-4f41-bf27-2d89967dd6bb" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="987b4790-134e-437a-a8e0-0dd84c1eb2d0" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="9c949aa2-d81c-4e91-b59f-01769ef5b77f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="7f8483b9-6094-4642-939a-8c798415615b" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="b1ccfbf2-ca46-46fb-9962-55b8fdf534d4" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="240cb393-f051-4631-94d0-82f8304c0c4a" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}