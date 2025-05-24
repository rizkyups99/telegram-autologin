'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Music, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
interface Category {
  id: number;
  name: string;
}
interface AudioCloudFile {
  id: number;
  title: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}
export default function AudioCloudManager() {
  const [files, setFiles] = useState<AudioCloudFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    fileUrl: ""
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
      let url = "/api/audio-cloud";
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
        throw new Error("Failed to fetch audio cloud files");
      }
      const data = await response.json();
      setFiles(data.files || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError("Error loading audio files. Please try again later.");
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
  const startEditing = (file: AudioCloudFile) => {
    setEditingFile(file.id);
    setFormData({
      title: file.title,
      categoryId: file.categoryId.toString(),
      fileUrl: file.fileUrl
    });
  };
  const cancelEditing = () => {
    setEditingFile(null);
    setIsCreating(false);
    setFormData({
      title: "",
      categoryId: "",
      fileUrl: ""
    });
  };
  const createFile = async () => {
    if (!formData.title || !formData.categoryId || !formData.fileUrl) {
      setStatusMessage({
        type: 'error',
        message: 'All fields must be filled'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/audio-cloud", {
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
        message: 'Audio file added successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error creating audio cloud file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to add audio file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateFile = async (id: number) => {
    if (!formData.title || !formData.categoryId || !formData.fileUrl) {
      setStatusMessage({
        type: 'error',
        message: 'All fields must be filled'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/audio-cloud", {
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
        message: 'Audio file updated successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating audio cloud file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to update audio file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteFile = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/audio-cloud?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }
      setFiles(prev => prev.filter(file => file.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'Audio file deleted successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error deleting audio cloud file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to delete audio file"
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
  return <div className="space-y-6" data-unique-id="9601a218-1dfa-43a3-b114-5afe3d16a1d9" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="6ac710ed-ec04-4caf-bb69-c3c034fd53a8" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="f7ecea80-d460-4e75-943c-69171c0e8908" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="b7ff0fad-e584-4300-8f8a-cc74785d3af6" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0e67e598-4de1-47af-964c-5af27f479b94" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="3be161ed-7bdc-449a-a45f-fdc686a0c9e4" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="09064ab3-39c6-47f6-ab41-22526fefe016" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="6461b55b-aeb9-4ff1-ac6c-c175755dd38a" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="52ce8b71-8f05-4542-befb-b4856916ee61" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="aca3de33-a0b8-40a1-add8-155a07b9f7d5" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="cbae5d46-4733-4061-8afa-45eea52f80a9" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="fbcadb9e-0a1e-4d8f-9170-4c775baf85fb" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="05785252-bb89-4690-a0e0-555888566550" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="0ec8e1a9-f0dd-4018-8603-791ed24d346e" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="d7ad2630-feb0-43bf-b214-8238339d458b" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="dd3d4825-f444-433f-8326-fe93c713063a" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8aa1b3f5-0e57-450e-975a-c678174ffaa5" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4c1b9a2d-55a5-45f0-bbe6-9b10d97e0097" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="7d73a2a9-e573-4f8c-a776-7845818ae702" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a981bd71-0c35-4884-9b10-d4f4c1857f2c" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="4d098a14-c98b-4596-8cba-d9df99295183" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="7b4270b3-16b3-42bd-a30d-a60b5d8cf074" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="6b7cc301-404b-4dcb-b1c8-9269696cca6e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c3d2cee4-f6c8-4d72-957a-eea05db1775c" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="81d46c0a-3614-4584-b3a4-644673ebabf1" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="46b104a2-e82d-4ca2-b0de-5dae4457137b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c1339ef9-53f4-4088-a604-3fef3937c66c" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="e23d77f7-9eb8-448e-97b4-9c45cb1e9198" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="3a08c70d-6969-4ea7-89a3-48f8197d3f88" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="4e0c0729-8268-4452-beb8-b672680ccdeb" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="781b33bf-385d-481a-8824-fcc01dd2cfc8" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="6b1ecf90-4403-42f9-8426-887f1ecf5a58" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="cda0c573-2de0-4727-86cc-82bae1ef9867" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="cd6c22ae-c2e5-49a7-abb2-167212f5fbf2" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="3fc3ec5a-7d50-4da6-bdfa-16731b5588f8" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="68d47550-bee6-45af-babb-64f3e883bb45" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="e69da4cc-2c9f-48ad-aaec-a9286db40444" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8f0f6088-90ad-41be-9b84-dabaab2318a5" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="648d5b48-0692-40b8-95a4-ab1ab966bf0d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="035f8aab-d832-400d-bb2d-d0e227ff5374" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="ce8b1836-bddd-4d7d-856d-99449c056a57" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="d16c293b-e6c4-4c38-b13b-2f0ac9269cf2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="7d3b1664-184b-43fe-a61f-4e4f0c225a11" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="084f3ef5-38c9-43bf-a2e6-9baa23443e03" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="cfafbd87-92c2-4d37-b1b6-edc2c952cc5e" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="298294ba-f4a9-4164-89cd-8164102c1551" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="45421a71-5599-4fd9-b691-4d14a753fbcf" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="507d50f1-e8dd-4963-a42b-c422d99e5114" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="57671ce4-6313-410f-96a4-370d33ca3aa2" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="76270f70-b208-42a0-9b08-1b88a0d946c8" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="0a138ad5-24e7-446e-83b4-ffd797715d4f" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="81974c67-0847-4844-990b-3a1d2771ef21" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="9ff2a1e9-0964-4503-a7e1-e443984fe4f3" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4032e275-9f74-4f3d-9b77-9ef892c9635e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="3a05ad3e-e988-4aa2-9fa0-2db2fedc7907" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="6f3c151b-a3b3-4532-b114-ababb8a8e78f" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="958378e6-db58-4f68-a22e-17e5b73eef96" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="107e55a0-2f03-4c99-9eb6-04a15ce42986" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="f20a1dc7-6f22-438c-be88-2e555ba24fc2" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="09cdec84-cc1e-4b63-b05b-f9e5f0c5b7e0" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="8dbbb057-1d5a-48ba-b8ca-5bf6f3b212d3" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="5bd476f7-362e-4b88-a3c3-5a60e38317ab" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="ed9f23d9-dc84-4b68-8f88-f659e36a0b0b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="2964ecb6-1065-4728-bcdd-8a94affd1ce7" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="2bdaeb48-21a9-4a30-91fd-f72a2dde04cc" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="055ba440-0154-4297-bb94-a97992fb2183" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="8b0774f7-42b7-4bb8-a22c-6ae112376aec" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d385dee9-9b10-4334-9298-0277426f9858" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="7716abcb-bb8e-4fc9-81e7-e4cde0cb7519" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="ce4f678f-126d-410d-89e6-e13c36e0f89d" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="bb50253c-5b75-4ed8-b84e-32fb1f705b69" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7047bb26-f9e0-42e6-8e87-e12f1c09629f" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="9587c8e8-a5e5-4fd6-adff-277589adf2e0" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="83954f4b-cd13-4261-85c1-6a6dd9abdc3e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="bd27165a-6105-4739-ae1e-d55c27ff99e6" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="221ec9de-b960-4d33-b79e-ed99506c6c8e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a08ce2b2-b5be-4c57-bac0-45308f3cef1c" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="4850f0fd-f500-4e8f-b1e0-8fdd1d398936" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ae287aad-804d-4793-a2dc-50abaca3cb96" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="59e7ff10-e87e-474a-bc58-2ca3314a1e44" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="9beb49ba-a01f-45bf-a134-486a26ad57d6" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="5e374de9-931b-4fee-a4d2-84309f299bd4" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="f013b4ac-6957-436f-81f5-e15339a0cd56" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="5369806e-19a9-4671-a23b-31229b2ccdd7" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="414ccbb0-9efb-4063-9585-4ab99464474b" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="cf8f5900-6750-4b0a-980e-499643d8a119" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="f5e1c85e-994a-43bc-a3df-a68b6e2fd57f" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="cfa90621-d234-45ff-9f0c-7dc81404c3a1" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="099b6757-45a9-4890-aa33-76bc8bc5b743" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="463a726a-df32-4903-8014-4161711bd71c" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="721771bb-c195-4b53-9a19-126c92087a79" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="544fed07-a1e1-4d86-b66b-8ba8d801aff4" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="8e57d228-decb-4a3d-bd4d-4ac2ffcbd933" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="182ba978-ddb0-4abd-aa2d-74ce18e5120e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="e97fbece-be87-4044-a78b-8fdc0284f6fe" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="a321173c-d021-4b13-8ad8-82c72ecb9fe9" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="5d54b660-eb3f-4fdd-b406-0a6b22cc71b3" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="e001a4bb-b725-45c9-8aa0-b59dc22e7e44" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="eba93384-32f8-4436-a5a0-bb5cacb00c7b" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="ff63b503-08dd-4f57-82d7-bfb5ce72800c" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="939b8d48-482d-4d56-9009-8f5ad3e0c9ec" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="2e4d5bfd-45f8-4c31-a9ef-b8957c76d109" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="2966ff24-553c-45a4-8b7e-83ad2a7968df" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="d3ffecc4-2eed-405a-b18b-27fdfd9a9282" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="9b270779-a204-4cac-8a7a-9cbac9d8c708" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="c2b38f87-507c-4be3-bb68-8be776357e69" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="73e89c32-0844-41af-b953-3affa3014a1e" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="ef46bfb6-385c-41b6-983d-381c04446ca5" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="2df8753e-2c0e-405d-80e3-c2dc6fb181e2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="56335fcd-1d29-4c03-b17f-5561d44ffeec" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="82dc91f0-7aff-49d4-b7a2-1b52532ef840" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="b25d5608-2510-4c6f-bff6-2075d0b172e6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="fb0bf079-b47f-4466-89e2-232568dfa72e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="eb9de724-ffb3-4345-8176-1c7b45dd0942" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="6fd7a2e1-509e-479d-8419-d98470ee0d44" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="4ba61765-0505-4aaf-838c-6d23afa416cd" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a016815a-4807-43e8-8009-d42300eddcdb" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="b60f41ca-12e4-435e-942c-1aa9a00bfcff" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="436b518e-c767-4d99-9604-694d8cf3b6e5" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="0ef72e96-6258-47cd-b9f9-3f717f722412" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="0eda6ede-6717-4b12-8dd3-1a5727c3b89e" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="37976ecf-303b-48f3-a68c-877169c24416" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ee085447-3bc2-4f43-91ad-d27790397d3d" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}