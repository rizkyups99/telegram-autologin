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
  return <div className="space-y-6" data-unique-id="5db93199-890d-4bba-8613-5e7e2ee66820" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="dc8eba17-df44-42ca-9173-4e941ba65a58" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="97401c76-3ab5-4ec5-84d7-39e87e2caca2" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="02a38dde-6eb4-46a8-b7a5-9b6bba1717c0" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="67182344-3447-4e4a-abd1-aa7bd9f92af5" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="c07cd292-3b62-4e2e-8451-87cbbe231eb9" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="cef4e549-fdf3-4d31-84c8-c00b28ec09c7" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="d49a0a85-f40c-4ea7-9109-68e8bae05b65" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="820aba44-21e5-43b3-b8f4-fe3604b8093a" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="641a90d8-c6b3-4e2e-af1c-64d33a3556e3" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="eda62faf-fb73-443f-9eb2-dfc19972075b" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="74b3ff3c-e0df-45ca-b3af-0c552450ab57" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f308fbff-4372-4ab7-96ed-68a04799a978" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="3a7ef45d-db46-46c3-9313-579588f48ad7" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="f9208eaf-123d-434b-87c8-f56105ead86a" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="8d6a2f5f-7e2d-409a-8d7c-fc8272a4b608" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="063b9561-268a-4ace-a81e-af2602d4f3c9" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="48675f36-afd3-458a-837f-65bb6724ebf2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="2768004e-e4de-4319-be85-cb9531889652" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ad5a27e9-1054-4a2a-bbae-b631e8b55372" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="5ab24c29-edca-4832-9e79-30c57ea670e8" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="92ffb26b-4502-49cf-b426-36a3d14a5426" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="f64a41ac-c73a-429a-8083-824a084f029f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="df103243-02d8-4e26-9ac7-a923c4dda7bf" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="68d0c9b2-63d4-4b96-83d3-4dc65cc499b7" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6115c27c-843b-44b9-a0ca-78b5e025c4d4" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f8a2b142-464e-4bcf-a252-9126b74d44e1" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="f104b67a-84d6-484a-91d6-15888fa9c475" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="bfd74b1b-8f50-48fe-ab1c-7b5b556e1f36" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="6779df91-f8bb-4c5d-bddc-7589d911887f" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f9ac4760-5e80-4089-85bd-7474190e1da0" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="09bc62ff-927f-419c-b1b3-38298c2678f4" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="5ea91789-5fb0-4041-a417-cb882efdcb4d" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="cfdd7463-2039-4c1a-a287-6fcbf76f754b" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="ef9cd525-0299-4308-9bf4-b21e83dbfe97" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="d251b6f3-c2fc-4ec6-b68a-66ed12aaaaaf" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="c5acfd08-ced6-49d0-9caa-cfad45edbb62" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="e914f9a7-9c3f-4ea0-bf41-d26a208f671a" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="85e4d943-fc68-44cf-975b-7367651dd4dd" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="92e0c2ee-a9db-435d-a457-db969cc772c2" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="26c6d296-3f4a-4817-9005-7e7a457fdba6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="e1a3af5a-13ba-4323-bccf-5881132eb224" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="f46e240f-46f9-422e-8c41-18a29068e5ee" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c71fedcb-4d93-44bb-9119-94a255a30925" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="a76c8a05-05fd-4bf8-a95f-53abd06e1717" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="702f1d72-fe29-4bbb-af88-98b8d33dc8a5" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="b25a18b2-70db-43c0-98ba-cfddd836b57d" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="a75db715-f6c9-40a0-9b59-259df3ce1239" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="e49b182b-701a-4adb-9be9-178e92339c2e" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="18057214-b776-4609-9369-d303a0241b6c" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="688bdaf9-73e5-4cbc-8f6b-11455a83f7c1" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="474a086b-3ec0-43b1-a43b-b416e23b6080" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="8be00e86-a3e8-4c0d-9b79-9c2dfd6b3211" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f08f7740-3cf8-47ad-8671-6b63585b3a20" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="c5fa8130-1934-45b7-a393-876b46b3160d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7c923336-1b97-47a2-b5ae-58fe329f6332" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="0d662e27-ee37-4280-9ad3-557c4511c599" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="7a44d47d-a613-4890-98a1-7c81214de966" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="e0cf757f-530e-4c06-9235-3e348bbe5754" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="c40c2639-fa88-4e8f-b796-8337e7906016" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="e5371b99-dca4-46ed-8a49-1cd4bbd48a1b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7c72b0b3-f1ea-437a-ba4d-3c5afcb84279" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="8d1f5147-2948-4510-a92f-04211516be4c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="03aa24b0-8e48-4935-bf46-6c42bf03e5b2" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="3c5f08b2-2113-4650-b6a6-8351d79b7d5c" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="f1a42b81-5f8b-40ca-8465-46ff3946324f" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="e750b43a-9d47-459f-9fa2-031bc882d4a2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0d44cc27-ee4e-4219-926f-9d9a645f2023" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="490ccf75-eed6-46ec-8f7c-4a305a61795e" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="03edaf44-d8a9-48dd-b9bf-87dda0b3e158" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="e17df651-eb27-40a8-aa76-170250eccc69" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="2954bd7d-9981-430f-b1d8-038887a7af18" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d080d20d-2e90-4774-b263-0368186d2416" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="c6f65fc1-1203-4557-8c45-a49c96093075" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="12ef8b87-65aa-4982-a714-121502487d56" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="55b7db3d-4651-4b5b-a8d3-b94b9392bde4" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7c83b430-6338-40a3-9704-86d97cc93e85" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="5938ddb9-fa5e-4db8-b090-8574aa8ea741" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ef2ddfc7-2f72-43c4-92cc-a9909486706d" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="f6dca01c-d6e6-4eac-a3c0-bd78f1ad3eff" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="260b1ede-55f6-4665-82c8-7e191d53c213" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="90654564-af79-4661-a0d3-be092e2a2f95" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="7cf894bb-74f3-428a-af27-b1d15fa95318" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="a3433f8b-8021-46c1-8d60-025f59cfe306" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="280afa3f-e8bc-49b4-a9ae-0e97d553b6a4" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a11b6fe7-44f5-4ae0-bb49-c3512a53331e" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="a4b3c243-d7ba-4d3e-884a-199859fdf492" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="b3fea39a-dd68-47ba-99c8-e3cd4f7887e7" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="24119408-1ccc-4151-b75d-068571051630" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="5cc4b8cc-d551-4373-9969-ea3279a40eaf" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="c33c56e5-718f-4736-bcf8-5c628f716bc7" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="757655df-29a4-4e44-829e-c3c4aab24d69" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="f11b1159-2a5d-4d60-8025-11f162871f6e" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="4f93bc6e-c2f2-4e10-a928-8658933aee66" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="6adcf22a-21da-476d-816a-51bc17233025" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="5a4af5ea-fd55-4f95-85a4-ed7fcacbb96d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="f1c29abd-1dab-489b-8acb-7b1e839ee729" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="a5345513-c1f2-4aaf-b439-65249216c440" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="c250fcb4-6818-44cd-b515-2e392c029d15" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="7d6e7272-0944-4f3b-b193-ea162b9d9aef" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="945cc27e-96ae-4ec1-9b46-4c9179d89fe0" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="88c04f58-9d5f-4095-9c26-9b7c7b069a58" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="39931334-4717-4b50-b08a-c31cf26721ed" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="fe797f96-8666-43f7-b7a2-b4417ae5f60b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="50a2ecc7-21dc-47a0-9657-f98234a35f93" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="2352448b-6110-4079-853c-9187cd034ece" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="13651398-8d07-41ce-b714-da4478c14112" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="0aa3fb0b-c163-42a2-bb66-67dca3be129e" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="3f9f0474-ee8c-406b-b063-7e10acc80611" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="cc3fed37-a729-43f6-b0e4-8b828baf269f" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="0102b2cd-70f4-44fb-907d-7e6bd62f1345" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ac789d5b-4fa4-475f-a9ea-602964cb3c57" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="f82ac965-0f78-45de-a11f-934600d96c35" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="620e2a7c-63c3-43e2-91f3-988fdc2cd16d" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="456fcf0e-eea5-4ab8-b5e3-3a8ca5c4d98d" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="5217e633-0044-43df-b3b4-0b9959aaec65" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="e0b0e5a7-31b2-4c4c-93df-9a9bee81f56c" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="48b10661-9970-4b58-8641-b025e3c9c149" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="4176eeb8-806b-4d9c-8757-79b4917bbf10" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="ce3d1607-0c3e-47d1-a1a6-8c0c75856594" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="22fad2e4-876c-40d4-b94e-24372e5ac427" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="574e97ab-495d-4f44-8d9c-9b3a4d60e8a9" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="130dd170-ac2b-43f2-96bd-90a22edcda63" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}