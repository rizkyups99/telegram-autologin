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
  return <div className="space-y-6" data-unique-id="dfb86e96-78a4-4921-8cef-f39997737fb3" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="63b0925c-53d5-41e9-ac52-b44e0bbba844" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="0bcee0c2-cb7b-47e1-b5aa-f66182c6364d" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="474f8e64-0dee-468e-8c13-bdf6ba64e459" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="fa87fe47-6284-45d3-ab9b-3c390c1c3d55" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="8c5c7e08-5d91-414e-b2ac-2046c7f849a2" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="5c2edc16-e850-4e84-a420-5b734c9b97e8" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="f8d62982-56c5-4784-9ade-035b9e258b45" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="3934c2ae-f1ad-4e1b-ae98-1770bba9c1b2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="2f146d2e-8814-48e1-81c3-2e5f8b1e3728" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="3db21d0d-127e-4c7d-9490-01b4f16ce4e6" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="eee22f8d-5566-4e31-89be-3bb42d3e0bd7" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="4257c9e9-91c8-43f7-9762-6b3b6008803e" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="91ba7bbc-5d95-4ba8-a4a5-d27d3b85e787" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="4eb97bd3-c04a-4ddb-8ceb-00382fb04e49" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="fc45b98e-df9c-40b4-80d7-c09933756be6" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ff746d7e-7174-4532-ba2d-9c695f23a35c" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d4a9ee4a-5375-4581-884d-15b40c89b827" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="a26e71ca-bfab-46cf-8eb1-0cab2371d15e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="38f09ad6-215d-405d-a6b7-314c6c087191" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="ca8f9731-2877-4d50-b208-f4b98d38b034" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="16dc05e2-d7f3-4499-9294-0164fd675bed" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="b662b636-f890-40d8-8ae2-2b7ac82152ad" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="46c22df2-603a-4efe-92ae-b8ec0ba01e04" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="a1b8a65a-1fc7-4b1d-bd75-d646820ce268" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="32a03ed4-da66-4bc1-9653-b9ee359adbfc" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="30ced9d2-95ba-4bea-ac3c-792f72795a4c" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="83d2545e-8915-4a34-bb87-86492f76aa51" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="9deb3866-de85-4d2c-a19c-b168244c2e35" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="85703322-2993-42d1-a3ba-36dc79ae83f8" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="5ec0ee24-7d0e-4b0f-afd3-0e6adae8b855" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="3a0dce66-6f2f-44cf-afe8-d79c3a2583d6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="a5568cd0-fb64-4649-aa09-97156b0ee53a" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="38bb5b6c-e2f4-4f96-a0c4-01f95b06019a" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="071bab86-5133-4e75-8e00-768730a83d9d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="6c4398d2-8136-4da4-a247-beb70a745239" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="67728d98-624f-4ef6-8a0c-353723339970" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="63344acb-0bc4-4a2e-8e69-280f1feb42fc" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="df331720-e1af-4606-ae6c-390a0f210ac5" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f3308819-f81a-4ef3-9592-d3a3c72d674a" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="7d19042c-7446-4e3b-b9bc-69bc3078110f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="e32da9e5-310b-4dbc-92aa-245f61a5ade5" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="0062d04f-5400-4f8b-a4d2-32db253ac055" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="7ca2618a-6fd3-47f9-9d47-11d84d181e8a" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="30020c1f-92e6-4410-9fc4-0c75bf625694" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="f4cbbf8d-27c1-4802-92d8-5663c8f24d2b" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="0846f189-b86e-412d-b75d-463e2f6c96c1" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="5519b367-5d48-456e-aa58-6d2e46a8e990" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ae8986cc-83b8-4777-bd47-16276380f6d3" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="19035134-9e9e-4a78-8d31-4f5477b07cb3" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="91b6f2fc-af54-4acc-a87b-94662f2c1ede" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="a5ddc3b6-a5a0-4ab8-8031-16599e668a16" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="361fdbf0-03c8-4bba-8044-506642414720" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="271f0b5b-a210-4fe7-9e59-eae1cab0a3b7" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5dc6a05a-f3ba-48aa-a426-070c5980e21f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f8010f6d-44cd-47fb-8138-e64b43dd7a31" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="e7c827e2-8634-4ef1-a999-5654e1761287" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="ec1e29d7-621b-4c25-84b6-3cedfe44aa0c" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="8815854b-b001-4701-a8df-3b6d0718e547" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="1abc684c-9bb4-45ec-be29-dd7820556654" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="f360ff82-20d4-4c61-a39b-216e4ebce49e" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3870bc9c-bc7a-46de-9a7e-631dec51a228" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="c01c476e-0aac-4aee-9667-a53920384540" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="843838e5-04f9-4a87-9ff0-16029284e324" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="ab2dedc5-bec6-4b14-af79-fdbae45a67d1" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f2b56855-ef86-4bcc-96ac-59261e8095c2" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="93a9d671-94df-4ea4-a92a-a9324619b121" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="20ae0877-8e19-4db6-9dec-e3660ec089d0" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="2465ecf0-7092-4f8e-bd52-2387983fe9ae" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="0c53cc02-1206-47ca-a281-c586df90cb06" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="7912fb1e-c3fa-428f-b4e2-011416b72455" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="74c2da01-671a-4dbb-9b66-e74967d682b5" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4661d339-d062-463e-9464-e1c8c5ad6abc" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="1020eabf-623e-444f-b02d-8870838f7d2f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="baf17224-ecb1-4b1b-bb0f-5c151f346939" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="6419e8ca-88dd-4d3a-9df4-27d1c8c85f4a" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="1210772a-0501-4907-8b18-5ef6abb3a2fb" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="f5f7be05-a0d8-49c4-b3cf-c8afa26f0328" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c8552f0a-bc23-4b93-84c5-5298d577c473" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="2a657e5b-f882-419e-8d03-8667dfd63ecf" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="6c2ce396-f56c-451d-a7cc-eda0a1769d4c" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="b750eec7-3768-4815-bea9-d773cc793d68" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="a2c0f66e-8dfe-488f-88ee-ed3a13b20bd2" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="7fb94dca-cf32-401e-8b2c-ed5f35404bc6" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="0cb7f3f6-57ee-47a2-9eb1-4250ec276f2f" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="6a295f4d-6bce-4a0b-bf88-a98b7dfb06d6" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="7775826b-0fce-4b2d-83b8-105fd1d1490f" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="e0487db3-26e3-46c3-9a2a-a5d8bd8d2516" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="3af42325-695b-47f7-a659-3638c7ed52ce" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="e40bd749-6390-4434-96c3-7a95cf6fa969" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="af656689-e628-456f-a5ef-5738af7d089d" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7230d64d-b920-49cf-929e-b2bb463ca99f" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="56327cd7-feb2-4d1f-8176-673a75112406" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="67f9d07d-63f7-4f81-9fc8-4287b45b2a8b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="89633cab-73f2-4d37-aeb3-10c4a69e402c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="affbd584-7695-49c6-9417-c737670031b5" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="31bdffcc-2994-4358-92dd-ce6e2c656096" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="7f47e414-e378-42cb-81d5-d72af6ba3e4f" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="655925d5-12ff-4ed3-8c66-34fdf11d172b" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="b0368fb0-0771-46b4-8b78-0af2b940a246" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="87d1413d-f92f-4a03-b306-6f9b317eee25" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="bde0f533-640e-494b-b6ae-9d4fdd7652b5" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="c5d2cefb-a7eb-454f-9c50-2352844cec1f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="90826760-7e60-4eeb-be69-be5f1d37c37d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="37e5550e-42ea-487c-b99c-4f3c5da5b77d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="f0cbeb17-2178-42a9-98af-8a29c19c88fb" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="96fb9fe4-da7f-457a-999e-e151c46d0145" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="48cecab2-811e-40dc-8707-1fb14d04b189" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="3d7a98e7-ebe6-4e9a-98c4-3ed4405c0ba9" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="35d6d199-d7d8-4273-82aa-07d602e00796" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="d3b31780-4ba4-4a54-ab38-2be18b3b1e4b" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="463e06ba-9e3c-4108-8f5b-581c5aedb65c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="21d88cc5-99ca-47cd-9f07-90970c1082fc" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="10c9bd1c-ba23-41f5-ac54-11d1634770a4" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="a9440f92-9e19-48c1-be3e-a6ce30adf967" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="fd3b9e27-4cf3-4016-95e4-965f33e10c3b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="80cd73c7-97f4-4b6c-8ff8-12c08ee620a6" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="adf96801-24ac-45e4-9e87-1ca14dc0063a" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="69991c9b-71a1-4521-9c43-b080b39dc0fc" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="00344006-000e-4b05-8c0a-9ccdb785ddef" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="6869ad10-52d8-466c-85c3-7dcc3af9f0da" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="56e664c1-66ac-4653-a7d0-1e37582a20d5" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7986f3ca-5cdb-46c7-809c-dfab8992bbed" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}