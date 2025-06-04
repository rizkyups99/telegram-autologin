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
  return <div className="space-y-6" data-unique-id="c4c6f8ea-9ddd-4a03-b85d-ddd8104557ec" data-file-name="components/AudioCloudManager.tsx">
      <Card data-unique-id="c92af984-5dd1-4079-a5e0-3d607da7bdb2" data-file-name="components/AudioCloudManager.tsx">
        <CardHeader data-unique-id="8504a859-8ed5-44e0-a651-7d77bdffe40f" data-file-name="components/AudioCloudManager.tsx">
          <CardTitle data-unique-id="6e640cb5-6a34-4234-a874-f3589423e360" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="10c25143-189d-478a-a86f-383ce5604a5e" data-file-name="components/AudioCloudManager.tsx">Audio Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="1ca5371d-ad1f-4b71-9d8f-5562d55e835c" data-file-name="components/AudioCloudManager.tsx">
            Manage audio files stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="b20995e1-a91c-4009-8ec6-048ab78ad22d" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="f9407b5e-3ff3-4d58-b2c6-2cad117ce46e" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="d033181b-9dab-469b-bea5-1177ec08a7c0" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit Audio" : "Add Audio From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="eee7e448-f91f-4e2d-917a-860ee18095bc" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="792f3178-7a6b-4568-a33d-467a94bc0098" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="1bee7f1a-9c9e-4451-8542-b39b4110571a" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="983bc7f6-99f8-41dd-b29e-71efdd479b20" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter audio title" className="w-full" data-unique-id="b00fcaa8-ad19-43df-9c8d-2ebbac3221b5" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              
              <div data-unique-id="c82365da-80f2-4a39-b2ca-3a6011be1615" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="3eb9436f-8ab6-40be-b8e9-c3344e5e0c49" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="08ff0e9d-7928-436f-8b60-9d3f01c8e270" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="fad4bf5f-80c2-48d5-a1c7-4b6391b89d27" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="0b308a8d-6ab0-4d41-aae7-a7055ab53ebf" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="bd129c30-8f29-4778-8cb2-1dbdc0224085" data-file-name="components/AudioCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="e5e8fcab-53d6-499c-90ee-d0bf07c46166" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              
              <div className="md:col-span-2" data-unique-id="7e03ad55-055c-4832-b19c-ff1b72433620" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="f3eb9df5-bc94-4a24-8398-564cef5b367d" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="7d906589-8db7-4741-9ed4-a7f460a52c78" data-file-name="components/AudioCloudManager.tsx">Audio URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter audio file URL from cloud storage" className="w-full" data-unique-id="8700cba2-2091-43fe-a168-01321e7d77eb" data-file-name="components/AudioCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="19bc4d3c-8c29-463a-b323-89acd0b1e4e7" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="fb500d48-42dd-458e-8549-0f7bcd28f035" data-file-name="components/AudioCloudManager.tsx">
                  Paste the URL of your audio file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="74586978-afd5-4faa-adcf-66d24b72c46c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="44a86b2b-f9b4-4726-96c5-4748311cebea" data-file-name="components/AudioCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="19832587-eb5e-4c1b-b4ab-8cbc2501ac3c" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="0e98c8f3-7074-492b-8cc5-632c6595c2bd" data-file-name="components/AudioCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.categoryId || !formData.fileUrl} className="flex items-center gap-1" data-unique-id="04f5613b-8324-40f4-8728-45a4a29e08ee" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="3d359b78-e75d-4d9b-8527-65a158de28e6" data-file-name="components/AudioCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="400c81a2-8ca4-42ea-a5a4-8593ae78b48f" data-file-name="components/AudioCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="b0a6baa6-26ea-49ed-879b-d332e9086a48" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="bff43a86-4406-4a7e-832e-e5413bc41f66" data-file-name="components/AudioCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="6fab7559-0b20-4470-b812-7d9d7aff58d9" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="3b1894cc-49ec-4d91-8685-de4a320a8a97" data-file-name="components/AudioCloudManager.tsx">Update Audio</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="f5acdf1e-8692-46f6-a5b3-64312e7c717b" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="79aede37-25fc-44b7-951c-40219c510e43" data-file-name="components/AudioCloudManager.tsx">Add Audio</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="9cbb3823-abed-458b-bc9a-c055f2919e4b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="0147288c-8938-4b0d-a9fb-ded67df42890" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="54c89f77-47ad-41a6-82d2-122017e0587d" data-file-name="components/AudioCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="19eabba0-5ef9-4f34-b63a-858c96c46005" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="b5e155e0-9ff5-4743-b41c-6f7733efaff1" data-file-name="components/AudioCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="24367012-538d-4a77-af3b-5624fa7e7e84" data-file-name="components/AudioCloudManager.tsx">
              <div data-unique-id="45788a56-a7ee-434c-b659-11dad3843332" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="5b330429-63b6-483f-bbe1-515fd0254206" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="81489979-cb11-4a30-88ff-227619ee7df2" data-file-name="components/AudioCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="f718fee7-cf81-4e0e-a119-7a0ad72062e4" data-file-name="components/AudioCloudManager.tsx" />
              </div>
              <div data-unique-id="280a27a4-ad91-4702-b9ba-a7fa7b9f1b59" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="cbf91345-61b5-4e3e-b49c-c5cf814e65b4" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="56073e01-768d-431c-8fbf-dfb016bf8557" data-file-name="components/AudioCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="723374a0-f833-49fc-b3f7-cd5c25ba9180" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="7a432f67-317c-4dee-aa78-81bc0727faed" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="02512d44-b668-4ae0-953d-b40d033b6a0c" data-file-name="components/AudioCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="e36f4ac1-7f03-4e2e-96b4-1e0b14ca23a2" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="41e0214c-a43c-4787-928b-9bb6464b469e" data-file-name="components/AudioCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="74e3b553-c743-4a62-a7d0-e367b97b5d1f" data-file-name="components/AudioCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="dc5db8f8-f63a-4fd6-9698-883f7f23106b" data-file-name="components/AudioCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="54b0baec-5bca-4cbf-8783-1899a2c36a49" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="24bf4ded-c7da-4070-b318-218dd8390215" data-file-name="components/AudioCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* Audio list */}
          <div data-unique-id="3d207000-427a-4168-9f81-5095a08fec02" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="15f365bb-b85e-40d5-8a80-2d1352198c72" data-file-name="components/AudioCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="b7f37315-5ca1-492e-be83-51489ced2231" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="e34936b7-6c2c-4788-941c-5ff7b690129f" data-file-name="components/AudioCloudManager.tsx">
                Audio Files
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="d61512d4-66dd-4bfe-9cef-308ddb561e1b" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="43b412a6-0d29-4500-b766-07894e44df1a" data-file-name="components/AudioCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="87a63569-43ab-4363-b135-ce72861daa43" data-file-name="components/AudioCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="f5a77153-a75f-42c3-906a-64929734b1bc" data-file-name="components/AudioCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="742462b5-87f5-48c0-a16d-a416701590ae" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="aa1bf6b0-352b-45c7-a871-b1d1f1fdb0c0" data-file-name="components/AudioCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="21054054-17e7-43a5-b827-31efd28af6fa" data-file-name="components/AudioCloudManager.tsx">
                  <option value={10} data-unique-id="98221d84-9471-43bd-a52f-d349d27be093" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="fa40ee23-f698-4801-95d6-ec0790ae570a" data-file-name="components/AudioCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="1825e24c-083b-44c0-944e-9c9015e058db" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="78cff79c-7265-4874-bd43-847f91ee46e6" data-file-name="components/AudioCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="291e488a-e6b5-4e1d-9570-3ab1b970a587" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="ae333312-f267-419d-bf47-a44ffb85ad3f" data-file-name="components/AudioCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="b767c00e-2de7-4445-b1e4-0b892b3aef02" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="aec6899d-0ebe-4922-95f6-2c7fef6e4d73" data-file-name="components/AudioCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="afbd7d7a-c27f-432e-9be5-d9d107ccf068" data-file-name="components/AudioCloudManager.tsx">
              <Table data-unique-id="58f2e1e9-7c40-41d0-b7ac-cb827ea59efe" data-file-name="components/AudioCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="d7e5e588-463a-4057-8254-ae7d34972898" data-file-name="components/AudioCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="3bc50ebc-f60c-48ee-8271-d6b390e48e61" data-file-name="components/AudioCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="02f33657-9447-4f0f-9102-9fdcb33beb3b" data-file-name="components/AudioCloudManager.tsx">Audio</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="9e7c7f6a-037b-486f-95a1-0ee9bb28338a" data-file-name="components/AudioCloudManager.tsx">URL</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="c8755da1-ce1d-40b4-97ce-473ed65d66ac" data-file-name="components/AudioCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="21aefe3a-0980-4d1a-8e1b-2ebda76cb552" data-file-name="components/AudioCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="d9eda630-2920-467e-a7ea-88494ad33345" data-file-name="components/AudioCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="50bb38bf-0231-4ae2-a899-1e9c16ef8308" data-file-name="components/AudioCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="c3169d80-7378-4490-a537-cbfcd636e9f8" data-file-name="components/AudioCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-8"><span className="editable-text" data-unique-id="18c44cbe-3a22-41b6-8d78-995650f5db79" data-file-name="components/AudioCloudManager.tsx">
                        No audio files found. Add a new audio file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="e27dc21f-8ad2-4339-bf34-ee2f5741be13" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="1ed89191-fd5b-4496-93c0-b998e6d6f8c6" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="d09d049f-c0b1-42d5-9ba9-bbfa1ea0a857" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="a41f6e38-9694-4f1d-a447-d8291d81f9bf" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <audio controls className="w-full max-w-[200px]" data-unique-id="d8358780-e66b-43af-8df7-e695f8ed4a7c" data-file-name="components/AudioCloudManager.tsx">
                            <source src={file.fileUrl} type="audio/mpeg" data-unique-id="3f6b8c02-3b5a-4256-8d77-6189cd113587" data-file-name="components/AudioCloudManager.tsx" /><span className="editable-text" data-unique-id="e937d91f-e21e-4faf-b2dc-d02421d7cd0e" data-file-name="components/AudioCloudManager.tsx">
                            Your browser does not support the audio element.
                          </span></audio>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="d739976f-a375-47b0-8eda-72a5531879ab" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="max-w-[200px] truncate" data-unique-id="076c129e-e7e1-4936-b859-8c03132438b9" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                            {file.fileUrl}
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="18d4ba60-1257-40af-8da7-7bc2e869448a" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="f915b694-d287-4d3a-9b63-fe4601524910" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="4a340623-9ffa-4b17-a846-d3ff271e1e38" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="028fbf5b-81f9-4e4e-b75b-aa7d6ad51ba9" data-file-name="components/AudioCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="e2971d38-9e33-44e7-9f9f-6bfe7a6fbd04" data-file-name="components/AudioCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="32966e57-3f68-4ebd-b573-b31c2aa6164a" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="9f4bac1c-11df-46f4-ba13-8412d2d40cb9" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="fe0fb0e5-9464-4f8a-86eb-671314178ebb" data-file-name="components/AudioCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="b9a4ee22-1fbb-4a1b-b16d-4bbd2f3fbb61" data-file-name="components/AudioCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="3766ee37-5649-4493-8d44-435964430167" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="d547c094-bf1a-4311-a5ba-1a0e8fef8f82" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="74ef26c3-97dc-44b2-8879-3d36d72eced5" data-file-name="components/AudioCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="2add6ed3-5bb9-40fe-8fe5-9c409b1c66cc" data-file-name="components/AudioCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="ed325171-4e99-4f77-9696-d4854f80905c" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="9f26efbe-3850-4368-a092-cd2497caa39d" data-file-name="components/AudioCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="e5ceddd6-27a9-4bec-92d4-3b00a8a41f87" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="257673aa-d17d-4c9b-b5f1-76d377f926af" data-file-name="components/AudioCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="e58e3e40-2030-443f-9f48-b02267f6ff48" data-file-name="components/AudioCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="6ae44305-12dc-430a-8033-ccc7d53e6d22" data-file-name="components/AudioCloudManager.tsx">
                    <span data-unique-id="d4beebc3-d02a-49e3-b428-96d5070e94c2" data-file-name="components/AudioCloudManager.tsx"><span className="editable-text" data-unique-id="289d9be1-8998-4141-88c9-7cab93196432" data-file-name="components/AudioCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}