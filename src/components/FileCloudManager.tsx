'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, File, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
interface Category {
  id: number;
  name: string;
}
interface FileCloudFile {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  fileType?: string | null;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}
export default function FileCloudManager() {
  const [files, setFiles] = useState<FileCloudFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingFile, setEditingFile] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    coverUrl: "",
    fileUrl: "",
    fileType: "",
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
      let url = "/api/file-cloud";
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
        throw new Error("Failed to fetch file cloud files");
      }
      const data = await response.json();
      setFiles(data.files || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError("Error loading files. Please try again later.");
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
  const startEditing = (file: FileCloudFile) => {
    setEditingFile(file.id);
    setFormData({
      title: file.title,
      coverUrl: file.coverUrl,
      fileUrl: file.fileUrl,
      fileType: file.fileType || "",
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
      fileType: "",
      categoryId: ""
    });
  };
  const createFile = async () => {
    if (!formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Title, Cover URL, File URL, and Category are required'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/file-cloud", {
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
        message: 'File added successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error creating file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to add file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateFile = async (id: number) => {
    if (!formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId) {
      setStatusMessage({
        type: 'error',
        message: 'Title, Cover URL, File URL, and Category are required'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/file-cloud", {
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
        message: 'File updated successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to update file"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteFile = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/file-cloud?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }
      setFiles(prev => prev.filter(file => file.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'File deleted successfully'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      fetchFiles(searchTitle || undefined, searchCategory || undefined);
    } catch (error) {
      console.error("Error deleting file:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to delete file"
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
  const openFile = (url: string) => {
    window.open(url, '_blank');
  };
  const getFileTypeIcon = (fileType: string | null | undefined) => {
    if (!fileType) return <File className="h-4 w-4" />;
    const type = fileType.toLowerCase();
    if (type.includes('excel') || type.includes('spreadsheet') || type.includes('xls')) {
      return <File className="h-4 w-4 text-green-600" />;
    } else if (type.includes('word') || type.includes('doc')) {
      return <File className="h-4 w-4 text-blue-600" />;
    } else if (type.includes('powerpoint') || type.includes('presentation') || type.includes('ppt')) {
      return <File className="h-4 w-4 text-orange-500" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };
  return <div className="space-y-6" data-unique-id="21b4d44d-6d08-45bb-9d6b-b2a0e47b5d7b" data-file-name="components/FileCloudManager.tsx">
      <Card data-unique-id="79747bc7-be6e-44b3-9f83-362f97eb2117" data-file-name="components/FileCloudManager.tsx">
        <CardHeader data-unique-id="baef8235-5f80-4e3b-9407-f9483acb6148" data-file-name="components/FileCloudManager.tsx">
          <CardTitle data-unique-id="d46c9142-4ba6-4231-b252-e44eff789059" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="c0113afa-3365-4a1e-bc0f-19a2ca4727cb" data-file-name="components/FileCloudManager.tsx">File Cloud Management</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="738091f6-a754-4477-a290-c11ffc5e8b11" data-file-name="components/FileCloudManager.tsx">
            Manage document files (Excel, Word, PPT, etc.) stored in cloud storage
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="d1f1c111-220c-4516-9c3d-8e79bdf7d72c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
          {/* Upload form */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="5d322d48-e42c-4327-8779-293e7994345b" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="716c5446-6fc2-423f-8543-350fe2894050" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null ? "Edit File" : "Add File From Cloud"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="c4c2dd52-07b7-4670-90f2-1403a244395d" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="b1bc4fa1-69f8-41d0-b7d9-ce7e1bf9aea9" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="title" className="block text-sm font-medium mb-1" data-unique-id="84126f04-9403-4a35-8ea9-789fe6ce405f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="02ae93cf-2c88-4837-99ac-62aac554ebfe" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter file title" className="w-full" data-unique-id="d284db61-59a0-4ef2-bbe0-5b0e82380b8f" data-file-name="components/FileCloudManager.tsx" />
              </div>
              
              <div data-unique-id="6ec84d8c-a43f-4c20-a6a0-f0001dd8c13a" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="categoryId" className="block text-sm font-medium mb-1" data-unique-id="ac0105c7-3229-4f61-9ccb-cd5466f7f718" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ab6fd606-386d-4305-b4d5-9ee935faeff2" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4e9207cc-d44c-4b4b-bdf2-17008d78a943" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="2f6d1003-33b3-4bff-84a5-f23e4b3ae950" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="d88a460f-e828-4ce3-a4d4-ba6f83e6a980" data-file-name="components/FileCloudManager.tsx">Select Category</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="daa2fdf5-c8e9-47dc-8353-3ebb12eef34a" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>

              <div data-unique-id="e00a5a5c-e7f8-4d2a-8751-768a14e3b7e9" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileType" className="block text-sm font-medium mb-1" data-unique-id="fdbf10fd-697a-43ce-b360-804986a5902b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ec567e9a-53ef-419d-92f8-fdbc2c8674f0" data-file-name="components/FileCloudManager.tsx">File Type</span></Label>
                <select id="fileType" name="fileType" value={formData.fileType} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="a80b0977-fca8-4a34-b1d4-d9dbaaaca33a" data-file-name="components/FileCloudManager.tsx">
                  <option value="" data-unique-id="d4e40804-e5f0-4759-8210-3e6a9d314be1" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="90a53e08-7878-42e6-8b74-a120ac94d425" data-file-name="components/FileCloudManager.tsx">Select File Type</span></option>
                  <option value="excel" data-unique-id="2a6fe668-8424-4c7a-8a1f-80b600723237" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4113b51f-fdb1-4c73-8bd3-eaead917c274" data-file-name="components/FileCloudManager.tsx">Excel</span></option>
                  <option value="word" data-unique-id="8cbf5977-c896-46a0-9e94-110422847c7b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="ec230aaf-42c7-472e-8c7b-253dfabec8bc" data-file-name="components/FileCloudManager.tsx">Word</span></option>
                  <option value="powerpoint" data-unique-id="152ebdbe-a718-4492-a809-5b7909e6fb2c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8a6f9479-f656-4bfb-91b6-7ce19bef1f86" data-file-name="components/FileCloudManager.tsx">PowerPoint</span></option>
                  <option value="other" data-unique-id="e3971f49-de39-4098-9493-7e9cea686125" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="562b29e6-a65c-48f5-90bb-27d3af861de9" data-file-name="components/FileCloudManager.tsx">Other</span></option>
                </select>
              </div>
              
              <div data-unique-id="1c599a69-d117-41c3-98f7-5c86484844d8" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="coverUrl" className="block text-sm font-medium mb-1" data-unique-id="66b53553-2023-41c6-be00-399339875857" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="39c7bc39-0a9e-46de-a1f8-043891ed82ff" data-file-name="components/FileCloudManager.tsx">Cover URL</span></Label>
                <Input id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} placeholder="Enter cover image URL" className="w-full" data-unique-id="572b681f-792d-4e27-81e1-29de79e7353b" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="a4d90135-c705-427e-aeb6-b0bef3a0f424" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="2a1b9d8f-70a8-4352-be58-63ceeec04d52" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of the file cover image from cloud storage
                </span></p>
              </div>
              
              <div className="md:col-span-2" data-unique-id="6b467804-416c-481e-b591-e4d57e1b52a1" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="fileUrl" className="block text-sm font-medium mb-1" data-unique-id="eaf01dc5-3f9b-45f0-9ddd-69b759e87561" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e0daae34-ff4f-429a-8804-bbd10f88401f" data-file-name="components/FileCloudManager.tsx">File URL</span></Label>
                <Input id="fileUrl" name="fileUrl" value={formData.fileUrl} onChange={handleInputChange} placeholder="Enter file URL" className="w-full" data-unique-id="d32ba32a-d3d8-401a-a520-5e38b04a7a54" data-file-name="components/FileCloudManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="efda272d-bf8e-409b-9874-8532ae4208ba" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="123dacb8-012d-4147-a1b7-ebd3ad1bca64" data-file-name="components/FileCloudManager.tsx">
                  Paste the URL of your file from cloud storage
                </span></p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2" data-unique-id="b905484e-ef3a-4c12-8ae0-c2703213880e" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {editingFile !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="95d78374-29bd-4f32-ae7a-cbba71e6bc14" data-file-name="components/FileCloudManager.tsx">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline" data-unique-id="3d4877bd-24fe-4a44-ae51-c3ca051989ba" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7c1fb9d4-73fe-4020-910c-3d9336ed0f1c" data-file-name="components/FileCloudManager.tsx">Cancel</span></span>
                </Button>}
              <Button onClick={editingFile !== null ? () => updateFile(editingFile) : createFile} disabled={isLoading || !formData.title || !formData.coverUrl || !formData.fileUrl || !formData.categoryId} className="flex items-center gap-1" data-unique-id="81a55cf2-bab0-4bb1-b707-e442b3a622bf" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                {isLoading ? <span className="flex items-center" data-unique-id="7458ef43-fb01-416f-8d55-1a7e2143ea1f" data-file-name="components/FileCloudManager.tsx">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="77bf8fb0-19c0-4339-a950-01172ade26be" data-file-name="components/FileCloudManager.tsx">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline" data-unique-id="9278e19e-52bc-46c3-927e-22650bdab72c" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="25b7da58-c6a9-44fc-8f10-6f5ac68c051c" data-file-name="components/FileCloudManager.tsx">Saving...</span></span>
                  </span> : editingFile !== null ? <>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="12c59627-8693-4953-8c27-b5ca0abac0c6" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="a850df32-be0f-4537-89b4-61632ea005c9" data-file-name="components/FileCloudManager.tsx">Update File</span></span>
                  </> : <>
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="d30b674c-3cd5-49d0-8cd1-648a362256d7" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7329f0a7-a0c9-4ca1-ad09-0ed55e479c86" data-file-name="components/FileCloudManager.tsx">Add File</span></span>
                  </>}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="d5f1f8c2-dbc5-44b5-af3e-1250204f09f6" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="916a1c41-7f3f-44fa-bc9f-12f8513f3aed" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="c0818bca-e735-4ce1-8c12-2f062183cd8b" data-file-name="components/FileCloudManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="659a97e5-d72b-4a1d-86a4-4b58dcd190bb" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="7955a8aa-f30e-41f1-800b-ec28aacab556" data-file-name="components/FileCloudManager.tsx">Search Filters</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="b8cd755b-312b-4505-95c5-c34951131542" data-file-name="components/FileCloudManager.tsx">
              <div data-unique-id="a37eb084-5371-498c-8ad5-1bcab6b02bb0" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="9342d7f5-cf8c-480c-a1b6-500368224e54" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b4bd40d1-a7ce-4450-93ec-aa6dc674dfa9" data-file-name="components/FileCloudManager.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="799a1535-0f23-4dfa-80a0-7ead386c8e45" data-file-name="components/FileCloudManager.tsx" />
              </div>
              <div data-unique-id="ac2eabf8-cc56-46d9-b695-44db013fe294" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="f2c8becf-0a92-4319-b66d-d40020ac5798" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="770ff406-4271-4ca5-944a-ae401172c83c" data-file-name="components/FileCloudManager.tsx">Category</span></Label>
                <select id="searchCategory" value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="88241b48-bc20-476b-a43e-cba352f5ad24" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="74db2fa3-c6cb-4c25-b002-9189a59839b1" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="e4960826-4bc0-446d-8f81-fa8b615a36c6" data-file-name="components/FileCloudManager.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-unique-id="aeedfebc-cabc-4257-8cfb-c6a9b59ed38e" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="f79aef34-ee3e-4da9-a798-9242619a05f1" data-file-name="components/FileCloudManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="341129d3-80fd-4af6-a1c1-257a836a0c42" data-file-name="components/FileCloudManager.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="dbf97fbd-3bcf-4b61-aabb-701e07feced5" data-file-name="components/FileCloudManager.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="3a5f1ae4-4e7c-4312-b221-b28c00dbe94f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="6018a88d-6298-4c58-856a-45257ef4daa6" data-file-name="components/FileCloudManager.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* File list */}
          <div data-unique-id="64be9811-0dac-453e-89d4-73215dd1f3c7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
            <div className="flex items-center justify-between mb-4" data-unique-id="1eb63723-1825-40e4-9266-fbfa3fe3f188" data-file-name="components/FileCloudManager.tsx">
              <h3 className="text-lg font-medium" data-unique-id="522f3b6b-dc7e-4e82-a715-f7c27babb00b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="5b667b18-e7ea-4c70-9dca-d0481af3c3e4" data-file-name="components/FileCloudManager.tsx">
                Files List
                </span><span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="eeeb2eb3-f2c3-4e30-8088-9908fe921443" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f77e4f42-ef43-45da-9a34-45edba13d6d2" data-file-name="components/FileCloudManager.tsx">
                  (</span>{totalItems}<span className="editable-text" data-unique-id="0a1c9733-9c4a-48d2-a163-ce0c89fc7372" data-file-name="components/FileCloudManager.tsx"> files)
                </span></span>
              </h3>
              <div className="flex items-center gap-2" data-unique-id="51050655-e13f-4a76-90b0-f5197174bde1" data-file-name="components/FileCloudManager.tsx">
                <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="77f13cd3-07f3-4044-96e4-99ca7f3bf44b" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="b38ffa0a-4aa8-46d6-ac5c-d4a7db352c5a" data-file-name="components/FileCloudManager.tsx">Show:</span></Label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="dfb57425-f45b-457b-b410-3df1a8e47d61" data-file-name="components/FileCloudManager.tsx">
                  <option value={10} data-unique-id="544fd578-ae9d-486f-afe2-e4bd58bc1419" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="78d16a62-e791-48a3-a068-19138b2ab157" data-file-name="components/FileCloudManager.tsx">10</span></option>
                  <option value={25} data-unique-id="6bc30c94-6136-48bc-8ab9-cc27c71e1135" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="de034786-5e53-4269-b985-14e17f43b02a" data-file-name="components/FileCloudManager.tsx">25</span></option>
                  <option value={50} data-unique-id="32bf4733-eba2-4110-abe8-e5ca63abba8f" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="0f355921-72dc-46ec-916f-afba28768c21" data-file-name="components/FileCloudManager.tsx">50</span></option>
                  <option value={100} data-unique-id="2957cb3c-3d5a-4b1c-bc17-b9d1446708ac" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="eedf0d4f-fc51-494e-9079-a11ff8387624" data-file-name="components/FileCloudManager.tsx">100</span></option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto" data-unique-id="41103f8c-5eb6-4036-b4c8-d47a0e383a24" data-file-name="components/FileCloudManager.tsx">
              <Table data-unique-id="eb4eb4d6-5a15-4c60-bd3a-fa90a45dd2e3" data-file-name="components/FileCloudManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="98183270-f62e-4c91-b78b-b5b836afe130" data-file-name="components/FileCloudManager.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="7d16ebd6-c6dc-43ce-bcb7-bba09f95dcea" data-file-name="components/FileCloudManager.tsx">Title</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="d7aa33c3-46e6-4c53-bfda-a4a83e9e99e9" data-file-name="components/FileCloudManager.tsx">Cover</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="08070f69-4957-420a-970f-418ef35b1759" data-file-name="components/FileCloudManager.tsx">File Type</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="73a5745e-5f12-4714-8f6a-f3d62d9c7fa1" data-file-name="components/FileCloudManager.tsx">File</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="4eeabfeb-2eed-4370-ba2f-65e075dae190" data-file-name="components/FileCloudManager.tsx">Category</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="90a15c68-de05-46d7-8779-b317a3bbd428" data-file-name="components/FileCloudManager.tsx">Created</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="25015632-00f4-4847-be08-608e102e6294" data-file-name="components/FileCloudManager.tsx">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="9c898b02-95bb-4d35-9761-1ab0f183f8b3" data-file-name="components/FileCloudManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7a8bc4f8-265e-4e2a-8934-81d2709e34c1" data-file-name="components/FileCloudManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : files.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center py-8"><span className="editable-text" data-unique-id="e1948ac7-1832-4ec2-a2c8-0b782642e709" data-file-name="components/FileCloudManager.tsx">
                        No files found. Add a new file above.
                      </span></TableCell>
                    </TableRow> : files.map((file, index) => <TableRow key={file.id} data-unique-id="4ea57b96-ed84-4895-895e-a65a1b73c287" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="b0bf049a-6e61-42df-892a-a79d9a770402" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="10835a38-150d-4714-97b2-42fe804c678d" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.title}</TableCell>
                        <TableCell data-unique-id="f46882ff-2f78-443e-b51e-c8bb5843fe49" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="h-16 w-12 relative overflow-hidden" data-unique-id="dcb1b232-4536-47d3-a85b-021160fa4972" data-file-name="components/FileCloudManager.tsx">
                            <img src={file.coverUrl} alt={`Cover for ${file.title}`} className="h-full w-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/120x160?text=No+Cover";
                      }} data-unique-id="5c19d5d5-6f41-4553-b099-5ec2c90bc643" data-file-name="components/FileCloudManager.tsx" />
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="574f85e9-ab80-4445-871f-6f7357ec0c99" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex items-center" data-unique-id="5e355c49-8d09-40ce-8af4-68d877293ea4" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                            {getFileTypeIcon(file.fileType)}
                            <span className="ml-2 capitalize" data-unique-id="44fb0be2-ba52-4a5c-970b-fcb22f36cf29" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.fileType || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell data-unique-id="6f121a61-2ce1-481f-97d8-b58b88d5d633" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => openFile(file.fileUrl)} className="flex items-center gap-1" data-unique-id="ee894346-0981-4109-ba68-e5009026b2a4" data-file-name="components/FileCloudManager.tsx">
                            <ExternalLink className="h-4 w-4" data-unique-id="13acc5f2-59b0-4624-b138-e35843e600c7" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                            <span className="hidden sm:inline" data-unique-id="d6f7660d-42a0-4f9a-b5e9-714bf0ef6b36" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="8f06ebb5-98a7-4499-a6db-38aedaea1746" data-file-name="components/FileCloudManager.tsx">Open</span></span>
                          </Button>
                        </TableCell>
                        <TableCell data-unique-id="8faf213a-b4b8-4ef2-8bb6-0c4b66835114" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">{file.categoryName}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="8d6ca60c-568e-4e00-8d8b-1f884552ae6c" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="eecb29f1-8212-4591-8c78-c05e79ea8e41" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-unique-id="46b82951-3ffa-4704-b08e-ef0d2c43ee40" data-file-name="components/FileCloudManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(file)} disabled={editingFile !== null} title="Edit" data-unique-id="6e495cc3-1bd5-4612-aebd-cb2ce45128dc" data-file-name="components/FileCloudManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c0f99450-09ef-413f-908b-b2bd9bb380ee" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="ab1a21b2-36e0-42cc-a9e3-7a20db3a8bcd" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="20635c07-fa9f-4efb-b491-29c2a6642803" data-file-name="components/FileCloudManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteFile(file.id)} disabled={editingFile !== null || isLoading} className="text-red-500 hover:text-red-700" title="Delete" data-unique-id="131ca489-14ee-41e6-b1b2-7948a75ed59b" data-file-name="components/FileCloudManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="603318d3-f384-4c4f-a89f-0a9152159801" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-unique-id="959db0b3-b906-4cb9-9b90-9a41cb2bc510" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="410cbca2-0504-49b3-8ff2-bad9d6996e3b" data-file-name="components/FileCloudManager.tsx">Delete</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="09d70508-586e-4371-9370-1ce82e34584d" data-file-name="components/FileCloudManager.tsx">
                <div className="flex items-center space-x-2" data-unique-id="29eefafd-6a9c-4555-b07e-6720798f560f" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="d1d1c955-d99f-47e7-89da-ef922c0efb3b" data-file-name="components/FileCloudManager.tsx">
                    <ChevronLeft className="h-4 w-4" />
                    <span data-unique-id="63dc77d4-e75d-4a14-8617-9f3d41f0baf2" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="840be8e5-7420-4fe0-aa76-48e7fa2a6685" data-file-name="components/FileCloudManager.tsx">Previous</span></span>
                  </Button>
                  
                  {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-unique-id="e3101345-56bc-4ac3-b2c0-ed813be19943" data-file-name="components/FileCloudManager.tsx" data-dynamic-text="true">
                      {number}
                    </Button>)}
                  
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="601b0edc-8dd1-4ae1-b32a-6518b4890cd9" data-file-name="components/FileCloudManager.tsx">
                    <span data-unique-id="e03c859f-d2b7-4cbd-b795-25ca29b3167d" data-file-name="components/FileCloudManager.tsx"><span className="editable-text" data-unique-id="4977a2d1-764e-41a1-a3dd-d34a66214322" data-file-name="components/FileCloudManager.tsx">Next</span></span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
}