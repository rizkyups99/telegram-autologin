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
  return <div className="space-y-6" data-unique-id="7d2039a1-557a-446b-a7c6-7512c79d9b86" data-file-name="components/PDFCloudManager.tsx">
      <Card data-unique-id="2573f3c6-53e3-4971-972a-759b4d56d0dc" data-file-name="components/PDFCloudManager.tsx">
        <CardHeader data-unique-id="28d41391-76c7-4bc4-b34e-6aad32d77659" data-file-name="components/PDFCloudManager.tsx">
          <CardTitle data-unique-id="4ec3aa74-4988-453e-b226-6a14afc302ec" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cfd0db01-0bef-40ca-8571-7ec1b688b0bf" data-file-name="components/PDFCloudManager.tsx">PDF Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="75c4f831-9ef9-4b9d-a0c1-840452fc7708" data-file-name="components/PDFCloudManager.tsx">
            Manage PDF files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="b30287d5-f8ec-4b9c-9960-eb7e3bea5e0e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="0747d67c-c3a5-4cfc-947a-70acb4cdef97" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="f0d0e5ac-256b-415a-82d2-21395cda5c02" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit PDF" : "Add PDF From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="29b03302-55d4-4d46-ad67-36877f89a342" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="9bafab77-1a2b-4b3c-b86d-c1f8fca60198" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="47f2138c-aa7d-4f04-8410-a26c4ac04441" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4a12cd9e-8abc-4a1b-b4af-8d1580198a3e" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter PDF title" className="w-full" data-unique-id="d9a98874-8f2c-499d-b378-7fab0b0b36c0" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              
              <div data-unique-id="9065c9ee-2131-4670-bbff-3d3b58fd2260" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="1b538728-8fea-47aa-af52-369d717c662f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9e763cb9-2c8b-4e42-a35d-a289e6d688d8" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="377f39d6-ea91-4371-9635-a9575a07da94" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="1d035ea7-33ea-4c3f-bbae-2289a005b000" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="80e6d710-6b20-4610-aec1-ab2242ef62f4" data-file-name="components/PDFCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="8733aefb-1dc8-4906-9a5e-2e61552b247f" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div data-unique-id="49c7b92c-030f-4c13-8b91-f98c56b7cb6a" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="54a42516-bb76-4027-b10d-8a63e56f190a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="53be9202-ea79-4016-ad10-b765ce1887c8" data-file-name="components/PDFCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="e87d45c7-9cfe-4072-b9d3-987aa5147d67" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="8e01fbe4-ae3a-4790-9af5-0ceb370dff97" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="a1bdf2d6-785b-424a-9b22-5e494f404084" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of the PDF cover image from cloud storage
                </span></p>
              </div>
              
              <div data-unique-id="bad6c78a-ed87-4e20-a693-53c450d8fae9" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="174f4f93-3c86-41ad-9713-3bc9bf8c0ade" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="cc79d176-0779-41ad-9ca1-9781faff1b82" data-file-name="components/PDFCloudManager.tsx">PDF URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter PDF file URL" className="w-full" data-unique-id="fc5d5461-e461-44af-914b-a7c29d95b8b6" data-file-name="components/PDFCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="0440110c-836e-442e-8cf1-640639d69d8e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="550c3383-f9ea-4c2c-acdd-41f92e60a369" data-file-name="components/PDFCloudManager.tsx">
                  Paste the URL of your PDF file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="12aa4706-bded-4055-b029-5c9fd4c744bf" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="9bbc2450-0268-42da-a226-576f4546b5e0" data-file-name="components/PDFCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="5418816e-0754-4b31-a1cf-0de3ca97d700" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="beaf5456-4418-49ef-aeac-ac0a3e7c119a" data-file-name="components/PDFCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="605de86e-8070-4912-87a6-9fcf95267062" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="4ad525a7-1e56-4dbe-b076-fcf693a08bed" data-file-name="components/PDFCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="ad9444c6-a957-409f-abb8-73e780f01b79" data-file-name="components/PDFCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="0827fd98-aea6-4ed7-9223-be2ede09afce" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="792cfba8-78e7-42df-b72d-4bddf0df05ad" data-file-name="components/PDFCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="20e39e44-f0c3-41a8-9c1d-8e0fa9bd200f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b70998ce-656a-4526-9dd9-a1929895188f" data-file-name="components/PDFCloudManager.tsx">Update PDF</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="b3cb88df-ceab-4bf8-b355-cb30e124840f" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="872de540-9d78-4e01-9a39-3052e935d99b" data-file-name="components/PDFCloudManager.tsx">Add PDF</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="ac3e59f6-78bc-490c-871b-56f791d494d9" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="ce186522-a832-4754-9ba9-ed656dc81b1c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="5e7eaf94-37b8-4040-9802-b66169849d7c" data-file-name="components/PDFCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="881e64c6-e5d7-4443-bd35-987e35e0924a" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="79caf95d-c446-4a9b-8d8b-a37b10a5c3a7" data-file-name="components/PDFCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="075d3be8-d013-423d-b30a-4939a1adce3a" data-file-name="components/PDFCloudManager.tsx">
              <div data-unique-id="67910b7f-cd8c-4837-9d86-5e6418afe3dd" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="54e18fc8-b809-4413-b7fc-09a575fde236" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="471a096f-8f16-4bfa-83f4-876e9dd915bf" data-file-name="components/PDFCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="98a6e4e1-1934-408e-b30b-37fa263e202d" data-file-name="components/PDFCloudManager.tsx" />
              </div>
              <div data-unique-id="e39faff0-bc89-4e99-a6b8-4fa72c2436a3" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="6e133628-96a6-4647-90ac-bc7eca6be6bd" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="e531e342-a97a-4fac-8581-412bdaaae60c" data-file-name="components/PDFCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="fe50fabc-d8ac-4028-88d8-0a426c5d1ee5" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="e05c4f98-f865-499a-9b49-cc72a417943e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="7ad7f590-90b7-4d50-890e-240a7dfd42e4" data-file-name="components/PDFCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="bca3b635-96ed-4359-84d6-d136d7ba62db" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="70fca29b-69ee-4fed-b253-dde5755bc13a" data-file-name="components/PDFCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="afd9709d-f9ce-4dc5-bd5b-869fbe19d4eb" data-file-name="components/PDFCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="5bc3b25c-2b0b-4792-b587-a55e54d6ce8c" data-file-name="components/PDFCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="cda8b6c7-c33d-459f-b419-3d1d200b2f56" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="b76be036-94b7-40b1-a394-6c3ca261bac9" data-file-name="components/PDFCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF list */}
          <div data-unique-id="00509bcc-10fe-4cf7-b02c-0d5c35f6e751" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="4710c169-c10c-4467-a93f-6df8dafe870a" data-file-name="components/PDFCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="956869cb-bd48-4539-a96b-cba47590dd22" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="7b78370b-d9f3-47d2-90bf-7959b0b60536" data-file-name="components/PDFCloudManager.tsx">
                PDF Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="bdfe7e3f-4aee-42c1-a2fe-9f29bcef7b46" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ab19034d-e16f-47a3-8030-0ca1056ea867" data-file-name="components/PDFCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="64c1b832-5f54-442e-bf08-6bc57c9593b8" data-file-name="components/PDFCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="cb97ccff-69b3-4151-932f-2981f1945afc" data-file-name="components/PDFCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="9927bdba-7a1f-43a9-b20d-8520a4d89b7e" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="4f32e85a-1e41-41a0-9f5e-bcc34c9160c0" data-file-name="components/PDFCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f65f21c0-b11a-45d0-ad64-449b562bf553" data-file-name="components/PDFCloudManager.tsx">
                  <option value={10} data-unique-id="13cb6cb7-bc97-4f8d-932b-463d53072753" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="0dec8965-885e-4939-ba5b-08133579cd4d" data-file-name="components/PDFCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="495f581b-ca6d-47a2-af88-ecaca5e27a2c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="c23ba19e-ac5b-4376-87af-91685510263c" data-file-name="components/PDFCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="5c1253c6-9a69-4d2b-be10-50356ed730b5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="3a25c102-be65-479f-ab3c-5c462dc80edf" data-file-name="components/PDFCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="faa78bdf-e4e3-49f3-81cb-62f1f730592b" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="2be0b972-a508-4a35-9ac5-d15bac244b1c" data-file-name="components/PDFCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="210c9fe2-2cc0-4db9-a456-7618a16544e2" data-file-name="components/PDFCloudManager.tsx">
              <Table data-unique-id="9b2d2ead-5148-4be7-a1c5-e6ae9b41b507" data-file-name="components/PDFCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="e23fc29b-36f2-4a62-94bb-66b1f6d6a2aa" data-file-name="components/PDFCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="360a081e-ec48-4f59-8a8e-0ee2e0848607" data-file-name="components/PDFCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c8ad5966-f019-4f09-a1a2-aa465f4ad33e" data-file-name="components/PDFCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c88f9f08-86bf-43bb-91b3-a6dcd86ba347" data-file-name="components/PDFCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="72643058-ecd2-4ac2-8200-1e05df5446ca" data-file-name="components/PDFCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="e908514e-b137-426c-9c77-c955cb84142a" data-file-name="components/PDFCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="9e76e5ec-3f67-4db8-bd9b-d93ce8c44266" data-file-name="components/PDFCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="759fc8a9-aaf6-4676-a563-50d3cbea9504" data-file-name="components/PDFCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="10baad56-9d2e-49bd-a20a-101a2066a072" data-file-name="components/PDFCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="c85ae462-4306-4c89-9339-441c21adb694" data-file-name="components/PDFCloudManager.tsx">
                        No PDF files found. Add a new PDF file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="2fd64251-c022-423d-8af2-d1abf40167af" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="4008b31b-edb6-4237-b090-01125de5a9a4" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="9d138fcc-0d76-4827-a517-02771dfa06da" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="08a03eb7-1d96-4f64-af57-772dd15fbe5b" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="3b0da8fb-2725-46a4-b6b8-79111f86346e" data-file-name="components/PDFCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="70d1cf72-ed9e-4371-a558-8c3d8316ccbc" data-file-name="components/PDFCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="3b4ca6d3-2068-4818-91f9-0f2c049fbf4c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openPdf(file.fileUrl)} className="flex items-center gap-1" data-unique-id="ef9f3705-e24b-4966-abc4-b2efe5b4503b" data-file-name="components/PDFCloudManager.tsx">
                            <FileText className="h-4 w-4" data-unique-id="a379b00d-6bff-4bb6-a625-c316ce4c1a7d" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="78fa55f7-6582-4301-a54a-650472020dd3" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="9ef7b275-17a2-4b60-9fe5-5bcdfbe1934e" data-file-name="components/PDFCloudManager.tsx">View PDF</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="007fa613-6049-4491-a0af-6a75e99b3916" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="e8f52ff4-149c-42ce-81a5-e2be8afd7b1c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="fa324d12-8480-4d3e-a325-43fb8809ac3c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="69e3613b-bdd7-4be3-8bc1-ec6add08c245" data-file-name="components/PDFCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="92b16733-0c5e-4c23-88f2-32ee6ee82682" data-file-name="components/PDFCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="b2618659-e6d2-416b-8924-7be1a6555f8c" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="7af78272-d7b4-4e24-9b66-d73a2c34c0a1" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="f04a0448-68dd-4e29-9840-f24f7f7d6aff" data-file-name="components/PDFCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="1db57743-d0a1-4c41-b6c7-9acc386f4974" data-file-name="components/PDFCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="356223e7-e852-45db-86c8-8d57d83f365e" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="a3489bbc-bdfa-45d9-a209-555decbfcf4c" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="70dd4cef-5b92-4cad-a5e3-671664854750" data-file-name="components/PDFCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="3b92157c-de2e-4327-858a-e281cf06ffb0" data-file-name="components/PDFCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b56f6f5c-61ad-420a-a1c9-513991f03528" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="68325c76-c7e9-4203-a5d8-499a5512a5db" data-file-name="components/PDFCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="6e70305a-9034-4c98-b7a3-b008dacc23b9" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="5e2e7e54-3203-43b3-97ad-00eed98f4170" data-file-name="components/PDFCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="f433e2b4-ae08-4cb8-bb91-dec318e39c40" data-file-name="components/PDFCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="9de52db3-b882-4930-8135-96824db5e99e" data-file-name="components/PDFCloudManager.tsx">
                    <span data-unique-id="3234dd00-f2da-4bca-8a7e-de79fe8520b5" data-file-name="components/PDFCloudManager.tsx"><span className="editable-text" data-unique-id="64818086-023e-4cb5-badf-d5bcc47f1302" data-file-name="components/PDFCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}