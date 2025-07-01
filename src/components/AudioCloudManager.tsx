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
  return <div className="space-y-6" data-unique-id="95903021-0f96-42db-a292-76bbaa915f06" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="c3865d39-c220-4cd7-87df-6f1b1ce98258" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="d864baa7-8af1-4867-b56f-0e12df208f04" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="44a1c367-521f-4b86-ba27-f2c41e4019aa" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="af15f990-993c-4229-a2f0-d9ac166fd7ad" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="7d931632-a4f5-4fc3-ab65-3b9f54adcaee" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="d14b03e5-5018-4880-9caf-5a815828c5cf" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="3294d211-19b1-49f7-b8ca-213af7930e62" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="e28e2045-c4ba-41f2-86b3-63f1f8be599d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="178a2a1f-9d9f-4690-ba4f-94dc35ddcdff" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="4e76a73b-4533-4313-ae6a-3b600e928707" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="62c62519-0298-4d64-9194-6a6b143d5b5b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ff3c5ffa-8fd7-4c18-af87-2017c7740639" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="93a552da-8675-49bc-a4bd-b95ec087d1e1" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="8550e304-73c8-41ae-9963-a1bf3022c4eb" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="9a4b8c25-ccbe-49ab-876f-b6074bb75f56" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8fb40050-90de-4fbc-ba0a-e09d65ae0a32" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="eca7bbcc-4a45-4f86-9592-4a7c646a91f7" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="514a47e3-9d4e-4862-86ca-d95bc4afc81d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3cea4995-d7eb-4765-be94-913bc31af2a6" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="850a098e-f362-4cbc-b141-144c1825ec6e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="8a71eefb-bbba-4e9d-8604-bba08108bbc1" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="a83bccc9-ed9f-4e35-b787-596c5bff04ae" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="bcd1618e-97f5-4748-a8e9-0eb4abd6a2ff" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="5999ac16-4974-48d8-9f6e-78350764c59a" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="67270397-baa7-44ce-a4bd-b91baaa20305" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0c9c090c-d900-47a9-a5e0-0b57e2bae029" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="7b990fda-2b7d-4b3b-b23e-cfd49e647659" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="851457fa-2ff0-4fea-8c9b-698faf880741" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="1c56ff0c-eee8-49af-9033-3b27b65bf9c5" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="385adf71-29d7-45d3-9c6f-bb876cde09be" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="32416548-4d07-43ab-bb00-40886a52eaba" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="a6f6cd53-90d0-40d4-8369-b671a7f73fd1" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="eb10b9d5-c8ed-422c-ae90-067f260f4795" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="1bac3f14-d504-4e6e-80df-1322fb6a72aa" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="bd040811-b423-4d9d-b726-204b591e5f78" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="e1a144b5-5eeb-464f-a053-1449f2b502a6" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="374e037f-0b2c-4dd2-871e-dc73d31d4a43" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="3e2e16d2-dc08-4ca2-86f3-2a7fd0f5088b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3d1ce00a-8d4a-4893-b9d2-857fde96236e" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="3afd4e82-9c6a-4b2c-9dfa-1041b327978a" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="0b1ad6e9-4077-466e-8dbe-aabcc0b45399" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="81ba585d-5f75-4ede-bd48-13ab41da70e9" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="222b3e33-9368-4ab2-b025-913fc8ea710b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="479a528d-c386-4e29-b1ed-96e81a249e70" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="b3b7dab3-d5be-4b9a-9b90-9bd9f7cf1825" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="f98eed2c-7453-476e-8616-8ee8f41e105f" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="64627b50-314b-41d6-9001-142950adb75e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="5442f6c7-a593-4e0d-9dcf-45348ebe2707" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="242c815d-2715-4595-9e4b-77643a239d4f" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="52f3345f-646a-4926-9fb1-6a4d5fb5f48d" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="44b11052-77b6-4558-8e0d-178c059b601e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="748dc705-5818-439d-b870-721fe6eb5caf" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ac8cfd22-eacc-4cc6-986d-c084d04e24d6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="ac770d6d-f8a8-4b27-8098-a6a050460fb2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="5db18b7f-c832-4da4-a463-21146f295557" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="c50cf04a-d8a1-42ac-89c6-677b5a11252a" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="5bd3b503-391a-468f-81c9-9647fb48d0fd" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="a6c41936-1ac1-4617-8aa8-37815cf52ae3" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="5132be63-a20e-4770-a151-3ac3708e4e96" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="2f15a331-9903-4948-b80d-780fcf202d91" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3b6266d8-7ed0-4ff8-87f2-4f757fdaa841" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="b94bb11e-833f-41eb-ab9d-d9abf0a72a42" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="dc443250-835f-4052-91df-ffbf90ec23e2" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="71443914-19bd-4002-a113-e17314b47ec5" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="be9a8746-a5c2-48f8-a8d6-8985220f4a1a" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="89cb7bb8-9893-4e9c-85a4-59d9e5ac82d8" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="66ef8a8a-1adb-4774-97c7-cee5ff37bce6" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="0c04f32e-b73d-4bc8-a400-f591f8f914d5" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="badaafc5-a2ac-4515-9192-3c3c90523bdb" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="00714cb1-8db2-4963-b0c2-f1e39d9b3eb2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2f7a76fb-0ec3-4a55-b58c-1d0313c2a85e" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="96c1f301-6837-431c-81b4-acc962b6b3a9" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="36fe1feb-18da-4205-9aa5-2e375d744184" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="353da9ec-7b98-41bf-b454-123606cf910a" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="139ebe11-a070-4bf8-aa64-0f908ab3e531" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2e9ad19c-95a0-4823-9454-8d206b76cd24" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="aa3c91f6-51ca-4fbe-9301-10d26a438d1e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="4c55e758-fa87-4b34-b2ae-c41ae0f4f52c" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="1108a5f5-78ef-4422-8b25-e992c7c90e08" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="187902a6-43bc-4bae-83d0-732aa426296b" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="d98ced59-ba50-4662-9709-0af3b1584122" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="53d10dfc-73ae-4778-87d8-03a1a0ba116a" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="775377a7-dcff-4e49-8258-30071d26bd1e" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8502d87b-ec70-489e-85dd-62005c5347dc" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9401bbb5-56bf-4f82-9b51-0372c831addf" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="a2f37f61-4881-48ce-bc0f-ffc2d8b0af67" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="074b57a0-94a5-4176-8384-a430e97f363f" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="f363386f-a68f-4c95-8e0d-53aee2cf4b71" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="38aabb5f-e609-45a5-a3e0-a2c9055ce6bd" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="2b1fe818-f32c-44ef-943e-777be6a0b1e7" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="0c73d339-bcc7-4e3e-adf0-a3ddc88cc70a" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="f19a4da3-cd2f-4f03-852b-76c1a0e22990" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="c974b54c-4f41-45ed-a99f-0bd78bc3296d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="466ecfab-805b-4357-a5bd-074890cd150b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="25242b52-3381-4afd-84b7-ef076ed309b3" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="6ce3d60f-66cb-42e3-b39b-9d65c53656aa" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="de08e4b6-ff1f-4534-bfc7-f1282e027d88" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="271aefde-130d-4de2-b658-b124a0148a90" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="3b584758-3068-41f1-a528-167630afadff" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="46ff67e7-119f-47b3-bdfd-31f5059adb1b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="f7b85198-0de7-4818-9ff1-5cea25332f31" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="f0f14982-c287-4eda-8900-df7ba0748f71" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="b5547d23-707d-485f-9a25-cbead332a90b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="f46c16d0-4832-4de6-a7d7-9248bc174eaa" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="7831ca2f-dbbe-4409-982e-cb811de55b06" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="8ff6a8dc-95c6-4f43-a043-ff20d97ea4d6" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c08e3ade-cc93-4356-956d-fc7a8f41b359" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="66bd2b15-e11a-494f-9687-8ed78044221f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ee781afc-335b-4e5b-ac86-d5fd04828c82" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="61975367-e4ae-4bc6-aa2b-728b5fc418b4" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="65277a43-c5f7-4ba3-a46b-e45891fd9233" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="23c35c71-ba52-44d0-8bda-c48f40e81a7e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="50769c40-222d-488c-a8cc-231d3dcf2591" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="3806c690-0322-4207-bd6d-bee16daee1b8" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="b9ea24d5-c874-4d04-bedc-603b6e82ce98" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="34871f2d-8b09-4f68-bac5-c4c00f7a7887" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="860dd099-daff-4f4a-acf2-e25a0c908992" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="d1903006-bc52-44ad-83dc-bb615002fab8" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="7c9e47ff-d987-41f9-bf4c-5a30f0f0a013" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="cf393356-73ca-40d0-b0ee-a66ebf066575" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="8afde502-4a03-4743-b209-f4edfd275bc0" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ddfb0377-4da6-499b-bca1-2aa7f426a168" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}