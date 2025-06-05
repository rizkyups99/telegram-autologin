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
  return <div className="space-y-6" data-unique-id="204bb9b6-de6e-4cf7-a09d-15f3339e8413" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="491ec759-7f1a-4c2a-968a-996ff1b2bc41" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="e3a13c7b-db1a-4707-83d0-6481991c18d8" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="7e40907b-d43c-4e30-938f-5e0fa223d10c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="000be1cd-0823-461f-a21d-bb2ac1637867" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="73460701-efd9-4c41-9050-bad8cbf0fb0b" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="6b086c91-ee39-4334-9199-622528d07bde" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="a3c7fa11-5e0d-42a5-9758-1f023067757f" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="8da624d9-efd3-4bdc-9e87-f3498fc97bea" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="5ba04b8c-5bfa-442c-9421-a95d430a00b2" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="25ce769d-6edb-4d90-aa4a-345a21522a20" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="1663b547-40dd-49a5-bae8-66addb05fe12" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3838698e-7e84-4a74-9a7a-390f36f016f0" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="5408a074-dc17-4f99-b20f-3e37076583a3" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="220fb5b5-dd0f-4766-be59-f750e9e8ee63" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="103dfe79-363f-4eae-a437-f538d1f8a62f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="bd900f61-7726-4feb-a178-cf64621f7ea8" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8bbdd4dc-74f8-496d-a08b-55703857ea01" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="4248ebe6-3573-45f4-9fd6-a383c7591261" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="94964ccc-ceb4-49a6-a4b6-d765aefdc11c" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="10a3948f-af8c-4a9e-81f0-fc4ac87d43af" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="74170a4f-e8bc-4a00-a473-fcba69287ff3" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="53d866c2-2251-4395-a8b4-d56803fc04ae" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="ab111fd6-039a-45e4-9068-67e770a0641d" data-file-name="components/PDFCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="38b02850-2bb2-4c16-8b78-d57452dc3655" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="0660da73-fb05-49d7-abc6-f0beae1ad54f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c8826c9e-4e35-4b52-bd36-7683caac37fd" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of the PDF cover image from cloud storage
                </span></p>
              </div>
              
              <div data-unique-id="03692234-2260-4517-9ed3-9717f9491be0" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="c542fca5-f6d9-4077-b1cd-6fcfeacbd048" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="790df4c3-6333-499f-bca7-e95c3dd91ee6" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL" className="w-full" data-unique-id="cd7b852c-746b-4064-8151-89f412192ca8" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="57821e1d-e873-45ab-9b59-58b7c2884289" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9bc4d08c-b1cb-48d4-86ec-708dc5f82192" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="56aac60a-db6b-4b5f-bb48-7360e803c4c4" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="38f9f339-f9e0-42e9-9a67-b1001c49b12e" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="1b918ace-e72a-4a05-a56e-2e2edd76011d" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="12d4603a-d25d-4856-93a8-9d2c27864405" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="c88ba4d0-b84c-4cd2-b0d5-66ebd7547387" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="9180d950-f1e4-4679-951f-5e81efa14eab" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="0769a7cb-f8a6-418d-8dec-26ba53111f08" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="f8bed4af-4230-402e-8f66-bae3735a648f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3a527a7d-9b51-4a46-91e2-9115da5a9ee6" data-file-name="components/PDFCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="054fca62-3aeb-4e75-8363-e56ca5f5957b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4eeef4a3-030d-4121-a108-e6ee68a81126" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="642cf480-2026-46b4-b00c-1b1edc4d1422" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2a3fb49b-214d-4619-8c16-a725ab925fea" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="63a3c37f-47e0-4f17-9b9e-f0d24b79b3f6" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="ef20f62d-3f8f-42fa-bdbe-3e09fe03ca62" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="55227d55-8794-4b6a-817d-7eaf89df8a63" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="a6a788a0-9f9f-4666-a1de-e6519e85bf89" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="25d5ea3c-fc25-4ba0-91ef-8513f2d81c82" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="97fcf6fa-7ed5-40e0-a030-4aca05076bda" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="2e85528b-c352-44e3-91b3-423d60209a04" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="766f74e4-5041-4055-af09-241c4d58a90f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="d6eb9dfe-08d7-4575-ab6c-4816b4fc074f" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="7eddba2e-702e-4457-84aa-df4c3a70f759" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="db3e807f-eca1-4dab-816a-6b6d271bed92" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="81ef3bff-769e-43a4-b2b7-eb067290ca9a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2762f9fa-a583-45a5-b14d-7358cbe2b9a1" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="6cec7572-2568-4da4-99e2-322a6e739814" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="22bc7a7f-4463-4ebd-8d54-e0019961bae4" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="865d1aa4-ee49-4aff-83b3-2b98a6f0159f" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="0b7c6dec-1fba-44e2-bbd2-955d6d5f054a" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="f448a3ea-e51a-47f2-87ad-732adba162b3" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="7c5ea693-38e9-4af1-9cf4-143ddc12082d" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="0871da35-4a3d-4e79-8820-926e5cafeeac" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="f1e90151-d559-4952-be91-6d98f098493c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="5ebf7d71-a5fe-4153-8c47-12fbdc7d0dae" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="455b356d-af9f-4b8e-abb3-aabcb21b1c2b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="ac9ad6ba-5527-4671-bdd2-0d3c5139fbde" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="04ebbeba-527b-4b4a-b984-60f64fc6f5de" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="8e1361e4-2318-4897-ba3a-5a5683ce66ef" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="fd9157f7-3242-4044-8e70-6af9155d43e3" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="608de5be-e03b-4653-a8ad-08d0273a07e5" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="a3b8c56a-fa0d-4508-a35f-041c20d8b120" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="b65aa8fa-3ed6-47d3-a4de-6b461fe781ec" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="90f61496-727e-406d-8648-7fac99de549b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a410620e-ce03-4e39-8ff2-9a4e926c6b1e" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2e45f05b-9c33-4819-9424-2f1a8df28336" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="dfbf0c72-d9bc-4382-8afc-ed50be815cf0" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="700df850-1307-4156-9605-6328cc614381" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="c154c0a3-c11a-41cc-b900-9d4c0f187841" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="03e8451e-8ae5-4d20-8f29-3c3204315a1c" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="07928b88-8bc2-406c-aff6-5e848d91a166" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0876afb9-8185-44fe-a033-84c40cbfd93e" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="a6116fc7-1309-4fdc-a54f-84bbfb1ba199" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="5e0570d3-3f5e-44b0-b093-a3790bc5e837" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="7c2fb4ba-89e1-4052-a6ed-0269352f49dc" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="38d378a7-e9a3-48fb-902a-02394f4cf83d" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="373c652b-9fe0-4639-9ff7-a84aefccdb2d" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="fc841e46-48ee-4461-aa9c-ed9d9fbb1e6b" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9023f07d-d4d1-471d-b416-45bb03c6a325" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="444aa41c-fe18-43db-a365-1cb546515dce" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="518adbc5-f7a6-422e-afdb-9ed227ff1167" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="b8dcc028-8f6b-433d-8149-ed9ccdd19fc9" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="d329ef13-2091-4bc4-881e-bf71951656fe" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="2d115871-9138-4bca-b745-972b4a864b6b" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="967281ff-51d2-4832-88cc-409b3a31998a" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="90df1b18-7344-4246-9155-1be6987d31f7" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="d1b3c4e6-dd58-4e42-84b5-8f81f6e78e6b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="5e5716e9-7def-4c7c-8c7c-6b08627b5831" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="5075c240-8d50-47d7-9bc0-18c550ab38cf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="e1a8f8b9-3d32-4de3-b82c-d13eba86bbc0" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="b359a663-2b6d-44ca-a07e-8e7e309294d5" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="53517e1b-e9ef-43d5-bb2e-2f1249f3797b" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="2e6da9af-bf03-4341-8e3e-7a479f731c5f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="ad8b1316-3ed5-4ae4-89b5-452a060ff0ba" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="6ee09436-0727-4009-b02a-9c14af4494c2" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="93890856-ad3e-4b2b-ad62-b2b0ceafda0c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="31c0b32c-fc07-4804-a267-59ea22c7baa4" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="da06eddc-2df8-46e9-8464-4371a7f65bcf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="e8761430-b341-47a0-8457-81ff006bcf67" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="56b97014-cdbb-4c2b-94c0-6a11a3f99418" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="594fbe89-052a-4a6e-bb1b-1a0d953f9f88" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="048aae14-5ce4-4a25-adf7-8b9124a5e610" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="0719af44-9ecf-4795-8de1-978f2fccad90" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="a16566fb-c079-49c1-aeef-9bf1cf4af4b8" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="27c44089-5924-48dc-a630-61aee2f5a003" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="6217367b-d568-4480-a99e-620e8a75aa65" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="5374d059-1209-45f8-892c-6d6e08c600f2" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="42e13123-116d-4281-88ee-d42922a95ace" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2418ee38-0c89-46d8-bcc8-e452788a8b6a" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="d0c6118a-18d0-44a5-9277-42c4695db5e5" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="8312fa5c-4d38-4051-9a9a-54545c45366f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a30aa52e-6eab-43b8-9652-89afef181ad5" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="557d25d1-be58-4f30-81ed-eb1e3023c9bb" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b1d8bc2b-ad8b-4fc7-9565-ec638408b136" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="4d49b626-ad6d-4688-b820-a7ac873198eb" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="95fca762-4308-46d4-a185-33680e8bb5ee" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="3b8a4d57-236e-49fd-9aec-4437283a6f47" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cdf2c836-4ea1-4baa-81e8-2a029296bf0f" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}