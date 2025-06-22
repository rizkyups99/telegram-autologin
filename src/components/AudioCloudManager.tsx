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
  return <div className="space-y-6" data-unique-id="1c0d3d80-2153-4956-b717-a2331f9177de" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="9f9771f3-bfe1-4ab7-a220-3f8916917754" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="a1f5e1d9-909d-4d44-8a38-e5035926663c" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="c4f650af-ae20-4505-9f44-b9609d105471" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2dc012b3-8fa0-418b-a4ac-98fa0e0c24b5" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9a505f19-b507-476f-92d5-1c7b847e4387" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="e5c95a6c-9797-42b6-8af4-5f905e8e5190" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="f986bf78-84ab-408f-81dc-53018d5c01bb" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4c11e21c-fdfb-491c-bd05-a967f8d3993e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="107587f4-8f67-4fe3-bf27-ac5c500e91b8" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="c8a0bfc3-4cab-4b5d-b22f-f5ea85ef8deb" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="ecd715ce-5f9e-4518-afd5-30c88ca7314d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="dc4e5cc8-fbd7-4b2c-bb4b-a5dc355a909a" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="10874fb0-97f3-40f8-875e-84327a915b0f" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="0cbd734b-3dc1-4695-8fb5-93708f60392b" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="26d500e0-4ed4-470b-8fe1-74b058cd969f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c88dd77d-f47e-4465-9a70-fdaaecc97a22" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="126a268a-dd00-4c15-a9dd-33cc1779b8b1" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="44e30844-01d7-4869-a5d2-d7bb80dbaba3" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="6527c3c7-e4eb-48ee-815c-016a421e02fb" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="99a7a67c-b503-411d-8cec-a734d1bd9e14" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="fba9d84b-c740-44a4-b301-81b135570de6" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="bffc5f75-6c8a-40e8-8389-c29db64c428c" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="4c4d9d30-3cfa-4a4e-81e3-3040251e065d" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="8c42b603-24ec-47b2-97bd-bebb700e7ae7" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="0e359649-8684-4d89-b607-ec464ce32788" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="fe9da911-add8-4bf4-abe7-99106ba33675" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="f269a785-cf30-466a-b8a7-34bb5ec99c3c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="c8d64c18-eb02-4799-916d-0482f9f0e8e4" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="a1abbbe1-8fdf-40ba-98d9-ae491fdc4e90" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3f7821bf-27c4-4ddd-ad9d-148673680b7a" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="7713b3c1-32a8-430e-8b86-a07fbddacb8d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="051fa976-84a8-42d6-a6c0-fac9870d2a28" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="95d6869c-f38b-48ff-a3b2-3a02ef0e8972" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="559c5954-f6fd-4c00-98a4-365f4e168ff2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8e021fa6-9c41-41b0-9b08-7937c6052c00" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="f181dd0c-8de2-4a04-a13e-b5b0bdc8ef50" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a7617cb1-ebb1-48f8-bbfa-0f77775537d2" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="4d70fb79-8757-48c2-a286-1be4e7231969" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ccba84b2-863c-4705-bcdf-77c43998ebc3" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="8271b3d7-d695-49aa-8193-660410d93480" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="5acb022a-16c5-4a1d-8cb5-6307804cb4fd" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="fa733474-33f5-4939-9b2a-35637a31ee84" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="87e14c37-7603-441e-a303-b3bdcbc8fab7" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="271d0522-5734-440c-824a-52539cfc50a7" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="1f10b270-a237-45b7-9213-d757ffa4f898" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="a21a736d-01bb-4172-9130-5dd61bb16573" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="931fafd7-4631-4107-ae7c-a7aca5ae5896" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="d62200c6-0a88-4fa5-ae06-b6f4c086e153" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="c3039178-b663-4f64-8107-36331090090f" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="6992a756-8e1d-4a53-a9c4-2a233caf99c9" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="d3ff2f6c-73cd-44ed-bdf8-5f716b22b7b1" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a138f3fe-fd86-4cd0-abe2-d525d5fbc910" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="98833b48-657b-45ab-9c83-9bf4d54589cd" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="20ad430e-b711-4c16-aee0-e77ee6e7527c" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="889646a6-5bb1-4595-96f0-f13adf3006ab" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="5472e34e-e04d-49ec-b2e8-ec3e96f08f7c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="2bbe06f6-c16a-4ade-8705-35da331b0bca" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="a5443d91-ac73-4103-8937-f4e4494b8eaf" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="ae73e3ac-6309-44be-b52d-39eec2ea7c9e" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="e977988e-04d7-410d-97ac-c652ae7e7dea" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="d1131df1-a141-4cd0-a326-b57048557531" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="636862dd-9641-4994-b751-3d3591f5f752" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="716c3220-ad74-4811-8503-cbf500f6c706" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="5d627a9d-8667-4cb5-8c14-35b9c602fc2d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="1c648608-6023-4f95-9d73-a8875781ea8c" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="3f0d40c8-3eb5-48df-8b19-51605f7d5659" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3b910e54-563b-4967-b146-c666edeed571" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="9d811700-7e25-4db8-ac58-f9e0910cccd5" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="8822f427-7f91-495e-9e8b-4f99b2706d8c" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="d7f9b145-4996-4b8d-a568-a6abc631531f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c237bc02-4fad-4a1c-ab60-a432af568fa1" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e32e3293-a6db-476e-9ac0-6950077c8a5a" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="999b8250-2a85-4937-997f-02729aef82dd" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="967bbfa3-a6f7-4e40-9dbc-ecf9f0c7896e" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="4770315f-21d5-4314-b3d7-47e86eea7464" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="87ce6220-e385-428e-a279-dec5d7e71c79" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="c4cfc937-2edc-4413-8069-d0cd1572a809" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="79e77fd2-15fd-42c8-9f25-66a9bd679611" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="c8a28b55-c980-43e9-84db-cafcd20cbb88" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f4ed5b07-7d66-412f-9ad6-bb592d5fa5a0" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="2dffbf6e-b196-4e73-8b1a-719f69d19740" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="f4b76f8c-d534-492a-af5b-580243b35571" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="80860d4c-d66f-498b-98b8-93caa9963d59" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="1629ffe5-9355-4afd-88ea-d91fb2f69d73" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="ae24396b-b61e-4edd-849c-2fb4fa609a3b" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="c8e1a4b0-c107-4eb4-a545-ca23637e6150" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f556fd01-8e68-4185-8d70-a4b3fc7ad316" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="87694b4c-7e6e-4872-b760-bdb5c673d016" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="60ff8ec0-a229-4fd6-a469-223b0f6851a6" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="3bb6bd0e-b540-4e40-897d-3c5bdb81dc36" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="ee1023ad-98bd-43a8-9344-cde67e78078b" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="430359e4-468c-4166-8a65-b3ed2b7a6343" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="6cd3b688-543e-44bb-a4c4-60dcbd7fb39d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="34797b0f-bc60-4508-be66-55aa622e7619" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="fa72649d-3013-4027-ae1d-81c518575dd6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="c18de239-7da3-40cc-855d-c80561318bed" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="0cd2b91e-1e45-47fb-b28b-e8b37db04429" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="8e2dc789-e18d-473d-8c0d-e1566096536a" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="013a92b1-5f34-42f7-b79f-1635284dd6d8" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="a7254485-eac2-44fd-9653-a5b0bc361e07" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="3f273c15-4f0b-4b55-8cd9-09b4fa951681" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="c114fd4e-88c2-46d1-973a-8c9bd2ba2671" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="39aed8a6-99f7-42bb-8f50-2225787c2511" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="c124c857-d842-43fe-87d7-e6fbe968626a" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="94249ddd-bebe-4547-b3ea-46da84948610" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="7bd76e63-f344-497e-a067-5fbc8364ed71" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="52bd6f60-000f-4da5-b379-64cadbd93ec2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="bb96ffa2-93f8-46cb-91c3-dd3583e79222" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ae63e03c-529c-42c0-ac8c-e647f2ef48d5" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="2be2cdb7-fa55-4c8e-9c26-bda58706146c" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="39f632c7-9b13-4ad9-aefa-c745dc28436d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="f8bf0c56-f245-4b43-ae81-bc09ce2df012" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="970417dc-92dc-4718-86a5-8fc098a133e2" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="b715a719-ab36-4bb7-a257-9c33286f1266" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="8c086cb7-f0aa-4ff7-b4fd-5452e98fb4b0" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="b235186e-9e02-4de7-8fb1-bd54d9b25bf5" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="0ff0f815-a727-4c27-878f-6c0a3620c505" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="9b2e4abd-7554-477f-8c51-a0bb01a8e37a" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="733a9617-5c77-4fba-b0e4-4fdbe0a0724e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="557fc354-b880-4317-b2da-72059ccf0064" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="401c8980-8aaa-4f88-86d5-014af63405e2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0bc2c064-545f-46fd-be42-afc89050c9f5" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}