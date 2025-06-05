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
  return <div className="space-y-6" data-unique-id="73dc6d09-6c4a-44e5-9b38-4ed84698fd54" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="fd3ec983-6ca1-4a35-b863-27ada883315d" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="5177a25c-6c29-42e9-ba10-f1c044d171d2" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="75c237d0-f53e-4c7f-ac49-9036ba3bc8c2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="1db7b8f7-1f90-4103-931f-8c1e1e48647d" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="39a33d97-59a1-45ff-bb29-7af7726e1720" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="a002d1fc-143a-443f-90d9-fe1eff26db14" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="e78958ae-70d5-4640-9aca-5d7bc8edf446" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1b20f57c-ec80-4071-8a7a-9b9f2dde5a71" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="4e0c5a01-45ae-4912-817b-d9e5f7c3a65e" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="d1f4d489-0391-4f3e-a691-96955fd7577c" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="34db89ef-2683-4340-bafe-7f6f24b07253" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7d3ea862-00fa-44aa-92b1-3f7c85ea1650" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="126a1473-f4fa-498b-8937-f8a27c555913" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="8eb3f085-6bc0-491f-bd11-6b3dfa7325cc" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="3b68e05c-2ff9-46e7-b4a5-9884b875b9ef" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f4c10c2d-591d-4eb4-a8b9-c4e32adecb0f" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ba06f83d-df77-4d38-bed4-f96daa1ee280" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="960b410c-0dd6-4a27-be4e-1dc32dfc1c91" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="15af4f94-c046-4ac2-b784-aa2afe6356ef" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="e153041b-a5c9-47b7-9e1f-951556dfd53e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="b2bc1347-e8ca-42ff-9f14-e224f543e70a" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="ce758844-990b-4810-8e2a-8f7f3fd463d4" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2a0e7a73-2d0c-4d06-80f7-64f388c5a52e" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="d0eb7881-b5b8-43f2-83be-05a8191c8533" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="fbbe2cea-374c-4e60-b294-2dd82277225b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="334b54b9-df16-4f8f-8614-11d2fdc5d2bc" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="9fd7a503-50d9-4d04-a7d3-fe1d02195577" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="adc253e1-c0b3-433f-a254-0658bf06a2c6" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="b6d1035b-d9c3-46fe-8ea8-6036ecfdf721" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2f67af72-47f1-4c26-8782-67b03ee3557f" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="1a044105-61e3-4a88-b84c-c4e9d146d7ac" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="1a73df27-b810-4797-98c3-e853b07ff21d" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="0008dd0c-845b-433a-9a85-d47fb69a6555" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="5aea908c-ebb2-4f2d-bd78-5242b39c9a06" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="d089e777-e22d-4c37-93f3-48b962b5eff8" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="1fd593dc-35ae-4100-bc06-e088c0596cd5" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="1aeffa64-c7dc-4e72-9e8e-6dff83e17bb0" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="0de4fc48-78ee-44a8-97d9-0cd5a41a2892" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f7acdcca-88e8-4676-bf63-cf62f3acaa11" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="16644837-0800-489d-b55c-2876203bf759" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="85e802ff-41b7-4ea2-833b-548d3f753268" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="605644a8-f378-4577-8914-5ce59530b608" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="19cbd61c-ad9a-4e1a-92ea-afe2ff1dfdef" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ad6a2754-b20d-4b03-8b9a-006a319f12e4" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="7388965f-3bc6-499f-869c-1c5a93485f86" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="c158cd67-a5ea-49ea-9f10-4fde97b99c78" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="408ec959-c836-4a3f-aa3f-14cf914733b4" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="b5b0ee07-4b1f-42ca-8cbd-abf960903c50" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="7c64fa1b-e8b6-4ab2-bd15-df048965867d" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="d07fbff4-afd4-4fc8-a8f9-4d357f9552af" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="df026f16-cfa4-4382-aea7-c00b3a0b02ca" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a28c18ef-3035-408a-a014-d3d97260f013" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="b4625f30-b0ed-4a13-9ff6-c050800af16d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="b5edaf53-65f1-4101-b248-55c28bac7b1b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a5d8f6a2-cd77-446d-aade-c830e2341688" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="98d4e16b-af41-4553-bd71-1cd28cfc2201" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="50be9615-fd76-46c8-99fa-332d03a0ce40" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="16033553-5d8b-4d4c-be6b-01342706c1d2" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="d9c57739-9a57-47f2-b09f-c89b120b4b01" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="8afefb48-a536-407b-9ed0-00b858d0c557" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f7824954-ec9d-4af6-b363-8bb8eeb17136" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="7ddf3a37-04d6-46d7-813b-9d37385aa42f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="6458c009-a59b-4239-9f64-3a4df52690d3" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="5e661c41-ce12-464e-9ec8-5bc2284fb501" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="43886da4-3d48-4518-bd21-5631c8be5b26" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="7a3db928-c501-4aee-be6a-7fd697324591" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="57b46d7e-d04e-4030-84e8-3fd24bf9659f" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="ea651afe-900b-45f2-b5da-93324daa6fb3" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="21a20916-f212-450e-8a49-7b09b87416c7" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="a3b5e740-313a-4068-9a0c-f6b4f9f645bf" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a2fd57cb-f7c4-4290-bcf1-7d531baea949" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="aaa83005-e03d-4d65-aadf-85d650faaea6" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="7730f918-436a-43a5-8d8f-55b54bc39a8a" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="74665054-3ce3-444d-86be-ca53039e0c97" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="4c38068f-c26d-4edf-a3a4-c3fb46b2c5f4" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3606365b-a099-403d-bcb4-817e429488eb" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="2ec10b3b-ab89-4aee-94d7-5fc4cac0bc3c" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0f36a9c1-984d-4a23-a099-cc7efde8fbb1" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="757c9571-236c-46d3-a7d7-892fd5bba8ca" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f3516c98-5020-4ea7-8a41-b25439ee49be" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="3e137095-05df-4f39-b7a2-2a034e6a2776" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="12273387-f033-4eb2-b039-94b2205c01a4" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="dcc1b27b-4421-4ffe-952d-e8895dc6a04b" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6112dc92-8f3e-4d53-a504-75c7a1fd2db5" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0ac62f78-8d33-4283-a197-c4b63ed23150" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="fae34cc4-b863-472e-93a3-ab1018854f8f" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="64e90cd0-1aad-4cbd-9ae2-004ceb436083" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="fc00b8c8-b1a2-4e6f-bb48-6b5b8083ff61" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="53edef38-fbe2-4432-b307-e1358ff1a638" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="34607e0a-1e11-48fd-a61c-3e0e9897517d" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="11e82d77-dd61-4e17-a179-841d4ef88ddc" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="829dd438-56a4-4c9d-a84f-cd4924f53852" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="38c32ed5-6e02-4615-9f41-904a82fef06f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="3be070c2-c80a-4918-8a56-8b3b6b8fded4" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="d4adda41-6c59-438f-b3bb-aaf88750aca2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="e30e290f-460d-4e47-9335-599bab4ea4f7" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="31c0f3e3-ae55-4a31-b8ee-d352ca6635f0" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="2a2d4d34-2bf6-4daa-af55-4024f9b340e8" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="ede2e104-dff9-4395-bbbe-9fea6e6c7ecf" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="204fb037-6767-4f05-9f67-8eaaec4e80f2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="7254f13d-c422-4080-afac-61d8bf77bd2f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="7cbf2362-5f41-48e1-b99e-160ff53a9355" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="5aa5655c-cf39-4fb6-9e0c-1e007ab181ad" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="eea75b28-d074-4d54-b9a6-476de58aa243" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="1ab3acac-eed0-4103-ae9e-2b9534d18ae3" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="fa1ad4c8-77be-454a-8fc2-c6597274420f" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="0cbfdeb6-d062-4f4c-b1dc-6dccbca1326f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="a146d1f7-c4e9-47d9-9d51-f9553e2c7994" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8d203776-51d0-4e40-8b4a-0d0fb2703622" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="12b8dbb7-3188-4c44-93c7-b042873ac539" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="4c5c1284-957c-462e-85d6-70f952589f9c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="5ac125f8-6827-42a0-b5f5-82951e5525e0" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="32481295-9cbe-4427-b14e-d31f644a4db2" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="eeb8a3c8-049c-4458-b922-64469567aa9e" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="5ee61bf9-b01f-409b-9ac5-03a754e70a57" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="f8f9a029-dbf4-437b-aff0-d64fd1ca2c0b" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="611ce8ba-a1a0-47f5-a1e1-f6ce13c7bf99" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c5400ff5-2166-4e4e-ae4c-8664c6c50935" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="3e9e7129-f697-48a7-b375-dd10c9c50902" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="96f17776-746b-49ba-9f20-45991188943c" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="27cae9cb-910f-406f-9114-4083a48f1eac" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c157a2d2-e24a-40aa-9853-1bb8dbd258bb" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}