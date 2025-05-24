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
  return <div className="space-y-6" data-unique-id="7952a12c-84ae-4d67-916b-05f02c29999c" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="bf9b4ab2-20d3-4bd5-939a-dfae48fc5d61" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="5a9350c1-2e29-452a-b10f-a5f06908b762" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="5aaa2f89-e553-486a-a0cf-b90fbc1f498c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="5cb78162-ffd1-41b8-a26f-f42c97c32d56" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9275d09a-9abd-445c-9ca7-737eb9fa78cb" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="f495d90a-a99f-4cf6-a454-9474aa37f465" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="d1ddccb2-9aa7-4a15-b6de-7f20e9b73237" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="9beb34be-8a65-4ac3-9158-fce0dc31c67d" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="c9a15619-3f3a-4885-b47a-5a629f37480b" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="fba4f760-6eb1-463b-8dac-43249b54a8d1" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="7162212e-9dad-4082-9cbb-a8011df5b355" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cd565544-22c3-4467-a1ca-92165743198e" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="7a84c730-8bbe-4ec6-92c0-93942834c278" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="d730ee70-b459-42a9-be3b-e5e7b7cdbe43" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="d9e15164-85ef-4acb-a8d5-676266034cd3" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ce7abe98-7f09-41f1-a376-4074a57e6fff" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e69a7459-0434-4b08-bb98-f9aa531d74aa" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="af5f284c-4e17-4c62-bb6c-95131fedf02e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0fd12f15-a91e-40ab-893b-4047a150b299" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="fe3a0f54-b776-47e8-a9a3-93aa232b4e1e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="5662c3cf-a77a-4e28-9e78-efd5f6a9ec2a" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="e004a9a2-a567-452d-b0de-dc6b9152c3c4" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ad945ae0-e392-40f6-9180-12a7acfd6314" data-file-name="components/PDFCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="227400d7-cda7-4126-87c2-f246f338dff4" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6611bd30-3527-4131-8f9c-deb36a369c30" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3e8e2e21-c17c-4c9c-9144-bde57d8ac60d" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of the PDF cover image from cloud storage
                </span></p>
              </div>
              
              <div data-unique-id="a238e468-16f4-43f5-9dfb-80288a113308" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="1a355936-3f44-48c1-a80c-fe6b3ea26eec" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="50185c94-ad8b-4a59-bd5c-391c9a246da6" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL" className="w-full" data-unique-id="442697d1-ac14-4214-a925-1b184a2e4823" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="1a5c2eb9-2ef8-462a-8b77-ea5de3ed293a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="28d57967-d957-4894-a2cc-31b35eeddcb4" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="f5849986-70b5-4c67-b49b-9328bed5a2d5" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="5bfe9e65-39b0-4e9f-8a3c-3d87f7b7cb52" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="f4b31cdf-2bf5-47e6-99e5-b286ef20ae1f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="596c51c8-8fa8-4e47-8f72-4641b6be0006" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="295f63f2-e0d6-40c6-be86-565d96dbf80f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="060a1d24-4e54-4f05-870d-9aaed7e88691" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="a9ecbede-48f4-4463-98e9-35ff5c122d4f" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="1715ef99-ebb8-4fc7-8005-d9d512c0c1b8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="084ad19b-e993-43a2-8aec-413cd9d52ea1" data-file-name="components/PDFCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="00ce0654-0b95-4a2d-95e7-a6c652bb3e25" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="debb88b8-95a1-4bc3-bf84-4c7f03d52ac8" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="b3d8a3d8-ad0e-412a-a155-3ec8d88cb598" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="030be5ec-d6d4-47d0-9275-216eb6f94e0e" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="0c2975e4-0bbf-42df-9723-4b39d3e08725" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="255b33c2-990b-4e87-8004-5cdad6e1d2ad" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="7031c375-1ef2-4bd1-8543-0ab80a5ed3ef" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4d596c50-2774-4e90-b5af-2af431ff61c8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cec8d0da-95e2-4af0-92be-948bd959add2" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="9ccb93c9-2c89-4907-966c-1a9a62f7d89c" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="65cb49ac-b20b-4de6-a3f9-609951815bb3" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="ce72d34d-ea7a-4fbe-b53f-5ccb100d13a5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="50457cd3-9aad-47f7-b177-ad4127aefe6c" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="6024abab-4592-4e8b-9bdc-5c11b047c496" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="21db94f6-952b-4ec9-a5c7-4564b53b860e" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="b6eaf625-6b76-4328-a13f-8d7fe82e15a2" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="dda681c5-8461-4c0f-a717-f6b0e2999112" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f036e406-bfa1-46a8-928e-307b22e6f577" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="6bb31253-d539-49d2-af4f-3510db8075cc" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f5fe8420-c5ea-44ec-9fd4-5c60d38e6904" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="52f75092-3c30-4585-ab6a-38072af5d6bc" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="a39251cc-658b-4d5c-bd2d-e5c2b7d46cae" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="bd949389-d387-4683-b39b-fb7942314053" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="eb7f79fb-8435-4f3e-b7f3-5b38837c7355" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="2a0af25e-8349-41d9-86ec-5ca451586f40" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="320a7457-f861-4e62-a039-580ef8446989" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="1d0583c6-58b0-47b0-a2b7-51d6c1e5611c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="e0a7fca3-f39f-46cf-be7b-6d041eedbb4b" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="6c6d4f6b-c5a3-4905-8889-ecd69c3bad69" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0d348d8c-40dd-404c-8ecd-c9bdd0f0cf2d" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="a933b6bf-0b82-43f9-8dc3-ade8adfa06ee" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d9f179ed-51ca-4627-a6fe-3d803d6f06a5" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="0b2531f1-06f3-47ff-8bf1-15960eb7e8d6" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="3b32df28-b97b-410f-a8de-96f50bd7e007" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="3881fcd8-096d-4e33-8d95-b5c1118d6b07" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f61a6eb8-56fd-4e20-82df-74398192a072" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="6910f17b-0842-4776-8520-2cf0fb2afcb1" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="428df502-3ec4-4b15-9f71-e47ed3de9de5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="639066dc-060e-4b15-bc8b-8f07a5b8b96f" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="cf327c17-6efa-4d87-b4d4-7a70f5c93049" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9e5dd84d-7a9c-4012-a645-3854027550b7" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="71985393-6397-44e5-bdb9-9e8f939b4cb3" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="52156b03-4bb3-4c8f-9f0a-5a2faba9cb83" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="bba247c3-90b4-4f36-a746-83466985d171" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="7d7a872c-f0c6-4cf2-947f-d788f8f72344" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="5a1c40ad-ff8b-469f-8b84-368005c24364" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="23558296-7178-4e9e-83e9-7cf0bc2ac443" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="55fb6bf2-39af-40a0-8609-4bf69570fb49" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="fb3cbcb6-fc8d-4b1e-90ad-654f8bc7f78d" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="128e89f0-4de5-43d5-956a-f517d86dc277" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="631ac9d8-1572-4e91-a85d-13fe10aece02" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="7f467e7f-367f-4b0d-9122-194a1177371c" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="fda2c3b3-4ca1-4c11-89a9-fb0dec91e5a4" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="922e257c-d064-4a12-8140-b86f29ad0c33" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="18a1158d-d840-43c7-aa50-446dae6323cf" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7d44b4d8-da94-4148-9138-53c4b3ee2d37" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="6e97421b-0c70-4c7f-a3f3-0d81e9e5893b" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="2dfa2905-0858-458e-b56f-0ead976b4cdc" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="8d48fcd7-d21c-429e-b8d8-91641ee4d87f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="6f1396c1-d3fe-4e2c-838f-be5a843117b3" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="64fd0140-1570-4e37-a10f-9b8fbc12bd1f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="d550596b-c48d-46c2-9efd-7f0d50f483cd" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="1eaa8e0a-c5b5-4893-8dc9-4f900f3370d1" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="1f40413b-b5f0-456c-8d62-5c192c17498b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="2e77adae-4d2d-4bc8-ab15-063ab19b0eb2" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="f08412d7-6a3e-4596-b1a7-f8b0552ec819" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="fb7a09a9-81af-4f6c-ae0a-9c31f3f9ae48" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0da8c7d1-d787-4cb1-9faa-e7d20d37bd7f" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="fc3da79f-7bbf-4d08-94ba-58821f6459a4" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="5958c599-6533-4323-9629-1c46a9ce1155" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="c29eb158-f453-489b-a118-3a9e409771d1" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="76f2e23c-2ac8-42c0-bc90-3443e715084b" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="309de0d2-3412-4d71-bec5-d91fc97e3c46" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="0b36a75d-2d6a-433e-9457-2652409db607" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="436f67f5-dd89-4078-8045-c561941182ec" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4cb9ae80-2baa-4d91-9224-3b92f0a2bc51" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="db1c9484-53fd-4a46-9d74-a8459cd995a2" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="5f3f8077-5a34-4ac2-9777-aa8f37995339" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="a77d55df-2cd3-4de6-af5b-447b419f9d93" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f1dc6009-4cab-46e4-afa1-ed991c7b4c0d" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="d77eb8e8-8c14-48e8-9cf6-16d43f519d05" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="49e84b94-fc20-43a4-bfbd-57726e63be66" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="c04e6965-5ff5-4c58-a709-356dc3bb24d6" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="7ff6395a-12b0-471b-9afe-9130e13d1d8b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="78382bee-0512-4e00-bd5e-65624cdc4554" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="6437dda7-4dfc-4725-ac7e-baafa5a21547" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="d1a54ffa-7762-4660-b1ec-4a869c4f2fcf" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="4cbce011-e31c-478b-be8e-af2bad37c237" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="66275517-d8c6-4b9f-a62c-a61ace3a1a38" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}