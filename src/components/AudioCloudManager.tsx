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
  return <div className="space-y-6" data-unique-id="8924728f-39d5-45fe-a66b-4c3a272c2898" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="9d282988-460d-47f0-a01d-0651aa00b2ce" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="2c3d84a7-f1b2-4359-8744-d5a99e3900c6" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="0507476d-405a-4749-a457-bb7729d4a0a6" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="28b4598e-6b7a-4473-9423-818f105a3003" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="5351cb9e-db57-48b6-b674-140120240ec6" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="adefdf7d-d6c4-4b88-a5a7-c12a7d6d1036" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="11bd032d-3901-4160-9b38-c282085b4b22" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="5d49959b-0252-44bd-a11b-7aaf17547ded" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="e6ca7221-9bd2-476d-8754-dc6cc207af86" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="ae05ab24-eb65-4926-aa2b-acf096860d76" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="3a0ca45b-838c-490e-bbfc-04dad304e9cc" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f461f6b3-679c-4db5-9c9a-96c6bf3fb575" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="0e300a8b-7f91-4c7c-a6fb-5522484d19d3" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="2401dd97-073d-412e-aaac-1cbbc27de7a6" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="106bbacd-a250-4bb4-a5db-d5665ac0dbb6" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="830eacff-a7d0-4f28-9304-b9df30cbf0f7" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="669426c4-4ab1-4417-9b9b-2c8a80c767bc" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="c06916a2-62ca-420b-b369-3029f52ac752" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="69d4ed4b-923d-4032-8086-73749dadaa5c" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="ac94808d-c9ba-4b7f-9f20-0b3fc4a04b7d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="6c844a0f-b923-4c34-9b19-aceeee244201" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="38edfea3-56c6-403b-9af0-b3ccd00014dd" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2f945679-6565-45b0-8493-f303d1632905" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="f6b4c467-274b-4801-8543-cd9f43990439" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="77e1f83c-087a-4e6f-b663-ca29f21ebb42" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="53716121-bdde-4884-bdaf-1c44ce06f084" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="1b52a267-ffb3-4c21-a56a-2a622e22482e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="170040e5-3992-4a1e-8cb7-5d2efc1ce14a" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="5aedcf3e-fb78-44c9-9e77-714ee3faac29" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="d93366b4-52a5-46c6-8306-b48b59cb6a4e" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="6ecc616f-dfcb-4aef-8414-6d876dbe92d1" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="f2c3a2af-982c-4b4d-a428-2d23207c607c" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="418304aa-72f4-44dd-a4ab-ce4e1f0edbfe" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="821df125-29cb-40de-ab98-e2a69004fc20" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="65ffd6dc-108f-4c24-8148-4c7eeeab520a" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="e648f839-5a3c-42fe-9633-ff2221c8a278" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="b459e2a5-bfe4-4ac0-8f49-53ba50fb8926" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="6a7544e5-7fe3-4c58-ae0a-715a6a74baa3" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c05a55c8-d223-427e-8a39-9b5314d1bd48" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="01562c58-efe9-458d-94ee-edff8bddb26c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="4a3c73c0-ac64-4282-91ad-2b8e0865b9f9" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="341ef75c-6fd9-4652-a5e5-d2382171e1d5" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1a999062-e74a-4bd5-861f-8e2265b92c27" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="67977928-aaeb-422c-bbe5-f1c078d66fa8" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="8cf40d43-c3bf-465f-86ce-44cb1cd50fcb" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="9370b7af-d694-401e-b166-d763bf0b4b9a" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="fbc30ec1-0738-4983-92f4-b6f1dfb6b07f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f8f69977-6aa5-4a44-9297-2fba148f3d9b" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="c36ea623-ac0c-4fce-85b5-4af324cbf484" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="8092d10c-12d1-4d68-bf91-3ce2ce760185" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="4edca0b6-6e6c-46c1-b2f8-90ba830a44c1" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="895cbec3-55b3-4591-82a5-de70f9172a29" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="cdfbda62-3628-4c0f-872a-fed6a572c778" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="ba81e074-7e21-41c9-adfc-c55ecfcf0ca9" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a89469d1-a6bc-4737-9553-c9524320f859" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="b6e6fedd-b195-4f7f-8606-ba80f57d3db2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="23313ee7-8da6-4c05-b1a9-a3ab25d7f1e6" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="c61e5b42-ada3-4d58-93a9-bd1e4d2a1d8c" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="81ffd454-23b5-41c8-a23a-19acb14ce917" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="cedb9d7b-a7d1-4861-9929-9d3265c73966" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0ab3e1be-122e-4d83-9247-dbb36356baa7" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="7f1f2dab-119d-4a11-9da8-6f4138491f2f" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="be92375a-31cd-40e0-b548-279bfe7fa79d" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="66c8b019-af69-4369-999e-08aa3f6fc69f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="c34dd6ff-1d49-4ce9-9d29-7019057713df" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="e962cdad-4ef6-42d0-acf5-468987e3a01c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="996bbbae-e04d-4b00-9937-54fea3d19c3b" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="52ef4690-1f8a-4653-aa28-bd56f6778d75" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="88978b67-3d38-4998-8fad-8679faf03a27" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="37904336-0d05-4813-beac-d4418815b955" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="4c8f01ca-7dbd-4e17-a316-79ffe4ed4f57" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="ba373424-4fd9-4313-8635-5a9cb4d39030" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="99a248e1-78a5-4ed8-98b3-4d275c5cc954" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a2feba5b-6fe4-49cc-a732-f9727903c2bd" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="30be36bf-cabf-416e-a255-c037ee831891" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="5660c3d8-68dc-45fa-b3c2-49ad4a83da98" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="de902be4-5c18-44eb-83aa-64a8b82ee174" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="65a13db3-980e-4eba-8d58-bea8d552d751" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="402274e7-7cdf-4a9e-ab88-7dfdb9edc4ec" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0ad570a6-d360-414b-b176-9fdbb119a991" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="acc634c2-7fce-488f-a572-d2b19a5d084e" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="db266707-5b96-41f9-88f4-6f1a29d7d6e3" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="41ca3209-f85e-40f9-a2b9-7fb2e574442e" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="9d0a29b8-1f64-4823-aa43-7b34d5f4731a" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="97c0fdd8-d911-49a6-be3a-55d9415a86c6" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="f61ee4df-e1de-49e4-8783-54701e40901a" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f15fbed0-cd2a-452a-be80-0a7a48d1c76b" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="e31a2d24-962b-4362-af61-4df6d9ee4873" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="7e028c9f-c12e-44c6-9b19-0148c55ed060" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="d118b88e-b8f3-42c0-ab68-4c005428ecd5" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="9de364cc-57d7-4f10-acd7-719fd84356ce" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="e99ffd2d-461e-4df4-9451-2a654d4d4c93" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="ed2dcadb-5e5d-4496-a392-9b6cbf898654" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="575fe5c5-ab32-4e7b-a29d-3160c6adad26" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="9e59d7fc-7f53-437c-9fc1-583aa31cf1c1" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="d9327923-c2a5-488b-b92b-8f4c94922b6d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="06c04f3c-4dec-4f16-bf40-a4b4b0678d53" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="5facc28e-97d9-4b6c-a829-37f189747f85" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="2e9e761d-aaf1-41f5-99cd-603fcf9dff97" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="3ac8be22-de6e-48f8-82bb-150337abb4c2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="bb24e7c5-9807-4c77-9973-5585ce40bef6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="341202f9-d739-4279-adfe-1ae984f045f9" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="093cf319-245a-496c-a386-2dcf3fcc05bc" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="442c19c6-f3a1-49c3-b385-f44b68198978" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="063eebd2-1184-4e72-8ea9-272745f70325" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="127dd3fc-7419-45d2-823e-2903091e7b4f" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="f7c5909f-271c-4e36-bcb0-34d234dfc789" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="1c75363f-d1ed-41aa-93b0-2c50d5fd42b3" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3dde8ab1-380b-4241-b15d-045708348275" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="5d118aae-d579-49e9-be85-5b759e833fc1" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="6c73434f-bfbc-4d35-8005-b679b896c9a2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="947dd05d-4082-4532-9523-2ef50ed2a060" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="baf67b57-cd56-43b1-9cb8-6fd52adf97d2" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="0ba88b4f-3d77-496c-bd12-dd95b925d2e1" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="bbd3536b-b622-4cfa-abf2-18f51fd29abf" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="984268bf-8bb0-4362-86b5-46b8eb9f7a44" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="5f3573ec-b2cb-4da9-b3ee-83fcf63907c3" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8822b359-82c4-49f5-99ef-f4d405c7e55d" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="ca44ff59-938f-421d-988a-0a0fc9782986" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="ba8abc2b-c386-4d14-9c59-4521e4b0157e" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="9243ac30-b3bd-4d6b-91da-eb57b541b71b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f5f3c99a-065d-4fce-b746-7c6bb2848a81" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}