"use client";

import { User } from "@/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { formatDistanceToNow } from "date-fns";
import { Copy, Check, Pencil, Trash2, Plus, X, Save, Filter, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
interface Category {
  id: number;
  name: string;
  filter?: string;
}
interface UserWithAccess extends User {
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
  audioCloudCategoryIds?: number[];
  pdfCloudCategoryIds?: number[];
  fileCloudCategoryIds?: number[];
}
interface UserTableProps {
  users: UserWithAccess[];
}
export default function UserTable({
  users: initialUsers
}: UserTableProps) {
  const [users, setUsers] = useState<UserWithAccess[]>(initialUsers);
  const [copiedCodes, setCopiedCodes] = useState<Record<number, boolean>>({});
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    accessCode: "",
    isActive: true,
    audioCategoryIds: [] as number[],
    pdfCategoryIds: [] as number[],
    videoCategoryIds: [] as number[],
    audioCloudCategoryIds: [] as number[],
    pdfCloudCategoryIds: [] as number[],
    fileCloudCategoryIds: [] as number[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{
    regularCategories: Category[];
    cloudCategories: Category[];
  }>({
    regularCategories: [],
    cloudCategories: []
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();

      // Separate regular and cloud categories based on filter field or name
      const regularCategories = data.filter((cat: any) => {
        const filter = cat.filter?.toLowerCase();
        const name = cat.name?.toLowerCase();
        // Regular categories are those without 'cloud' in filter or name
        return !filter?.includes('cloud') && !name?.includes('cloud');
      });
      const cloudCategories = data.filter((cat: any) => {
        const filter = cat.filter?.toLowerCase();
        const name = cat.name?.toLowerCase();
        // Cloud categories have 'cloud' in filter or name
        return filter?.includes('cloud') || name?.includes('cloud');
      });
      console.log('Categories loaded:', {
        total: data.length,
        regular: regularCategories.length,
        cloud: cloudCategories.length
      });
      setCategories({
        regularCategories,
        cloudCategories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load categories'
      });
    }
  };
  const copyAccessCode = (id: number, accessCode: string | null) => {
    if (!accessCode) return;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(accessCode);
      setCopiedCodes(prev => ({
        ...prev,
        [id]: true
      }));
      setTimeout(() => {
        setCopiedCodes(prev => ({
          ...prev,
          [id]: false
        }));
      }, 2000);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle multi-select changes for categories
  const handleCategoryChange = (type: 'audio' | 'pdf' | 'video' | 'audioCloud' | 'pdfCloud' | 'fileCloud', categoryId: number, checked: boolean) => {
    setFormData(prev => {
      let fieldName: keyof typeof formData;
      switch (type) {
        case 'audioCloud':
          fieldName = 'audioCloudCategoryIds';
          break;
        case 'pdfCloud':
          fieldName = 'pdfCloudCategoryIds';
          break;
        case 'fileCloud':
          fieldName = 'fileCloudCategoryIds';
          break;
        default:
          fieldName = `${type}CategoryIds` as keyof typeof formData;
          break;
      }

      // Ensure we're working with an array
      const currentIds = Array.isArray(prev[fieldName]) ? [...(prev[fieldName] as number[])] : [];
      if (checked) {
        // Add the category ID if it's not already in the array
        if (!currentIds.includes(categoryId)) {
          return {
            ...prev,
            [fieldName]: [...currentIds, categoryId]
          };
        }
      } else {
        // Remove the category ID if it's in the array
        return {
          ...prev,
          [fieldName]: currentIds.filter(id => id !== categoryId)
        };
      }
      return prev;
    });
  };
  const startEditing = (user: UserWithAccess) => {
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      name: user.name || "",
      accessCode: user.accessCode || "",
      isActive: user.isActive,
      audioCategoryIds: user.audioCategoryIds || [],
      pdfCategoryIds: user.pdfCategoryIds || [],
      videoCategoryIds: user.videoCategoryIds || [],
      audioCloudCategoryIds: user.audioCloudCategoryIds || [],
      pdfCloudCategoryIds: user.pdfCloudCategoryIds || [],
      fileCloudCategoryIds: user.fileCloudCategoryIds || []
    });
  };
  const cancelEditing = () => {
    setEditingUser(null);
    setIsCreating(false);
    setFormData({
      username: "",
      name: "",
      accessCode: "",
      isActive: true,
      audioCategoryIds: [],
      pdfCategoryIds: [],
      videoCategoryIds: [],
      audioCloudCategoryIds: [],
      pdfCloudCategoryIds: [],
      fileCloudCategoryIds: []
    });
  };
  const createUser = async () => {
    if (!formData.username) {
      setStatusMessage({
        type: 'error',
        message: 'Username harus diisi'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }
      const newUser = await response.json();
      setUsers(prev => [newUser, ...prev]);
      setStatusMessage({
        type: 'success',
        message: 'User berhasil ditambahkan'
      });
      setTimeout(() => {
        cancelEditing();
      }, 1500);
    } catch (error) {
      console.error("Error creating user:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to create user"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateUser = async (id: number) => {
    if (!formData.username) {
      setStatusMessage({
        type: 'error',
        message: 'Username harus diisi'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
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
        throw new Error(error.error || "Failed to update user");
      }
      const updatedUser = await response.json();
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      setStatusMessage({
        type: 'success',
        message: 'User berhasil diperbarui'
      });
      setTimeout(() => {
        setEditingUser(null);
        setStatusMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to update user"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteUser = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }
      setUsers(prev => prev.filter(user => user.id !== id));
      setShowDeleteConfirmation(null);
      setStatusMessage({
        type: 'success',
        message: 'User berhasil dihapus'
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to delete user"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const generateRandomAccessCode = () => {
    // Generate a random 6-digit access code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({
      ...prev,
      accessCode: code
    }));
  };

  // Filter users based on search query and active status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery ? user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesActive = filterActive !== null ? user.isActive === filterActive : true;
    return matchesSearch && matchesActive;
  });

  // Pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Page numbers to display
  const pageNumbers = Array.from({
    length: Math.min(5, totalPages)
  }, (_, i) => {
    // Center current page when possible
    let startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return startPage + i;
  }).filter(num => num > 0 && num <= totalPages);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  return <div className="space-y-4" data-unique-id="ebed2d7a-214f-4a35-877a-e3e7abed1db1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="cde61632-ec27-49e4-98e0-09e4d1985133" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="98e5d4b3-c233-4056-9054-a2b616c704a3" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="042bbe3f-e48b-4b47-b97a-44b6f3b88f2e" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="6cbdcf10-6acf-47fd-a40d-3b8b7f626b47" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="4ab70341-0c9c-4ce7-b55b-7de22033d334" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="e37e16d2-30fb-43e0-8c04-3084ee90aa5d" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="9926d8a9-3a53-46b4-94b2-50fa787857fe" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="c32367b1-e96e-4561-b6e2-edce1bda8803" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="d208fb4d-82db-4308-afff-2d890237e7d0" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="74f9034d-a90d-4960-8422-f03ec049fda6" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="44141e87-e205-4f07-aaa8-c35f38adc917" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="fd179806-619d-4f07-b094-06edcb7135cc" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="c7c7fac8-9c10-46c2-9393-aa9c5bd034d0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="afc9e015-99ca-4246-9f40-534fa2a7bc87" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="1390429a-0395-4881-8c39-9b4eca8c8ef7" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="2ca84a8c-e190-4bc7-8388-9926791d4380" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="73e3e680-b037-4369-bd72-c4045a45b2ea" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="3f8709ce-b4dc-4a68-adeb-396113eee7af" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="4ad6aa92-ae88-402f-a989-1f0ca58b9dad" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="a2b93992-f340-440a-ad3e-8c8ba8231282" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="400388d7-c0d5-452b-bde9-fdf800280d80" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ab013191-04ae-4a3c-bae9-052ed9dd5d26" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="1491b82e-a34f-45d8-93c2-2e800a719ad9" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="72f7bac7-fccc-47e3-8663-e05eee1033b9" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="0717efa1-50c4-4034-b11c-5fc2df05cf41" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="52cd6bf1-b440-481b-a51c-cb5acf0b4c35" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="d09b2579-1266-423c-adef-3aa1949acf84" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="2ff61b40-fc49-48e7-8217-5d34b563841e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="97594f42-2832-431c-a97d-bf5ead06b91e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl shadow-sm mb-6" data-unique-id="c10d3ff7-8185-4d96-a6cd-404c80d0a046" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2" data-unique-id="8192b918-c024-419a-8f1b-fed8320b878a" data-file-name="components/UserTable.tsx">
            <Plus className="h-5 w-5" /><span className="editable-text" data-unique-id="a0c70ad4-0133-413e-8637-c60793e18fc8" data-file-name="components/UserTable.tsx">
            Tambah Pengguna Baru
          </span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="fbfb679e-2a19-4719-8e40-68b3e56ae525" data-file-name="components/UserTable.tsx">
            <div data-unique-id="0393e519-c42f-45b5-9c77-1a5494148712" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="2a5407e6-480c-4b4f-b4d8-bd4113872585" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="48028979-cdec-43eb-9ea4-ed060af59e60" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="0691678d-0790-4cef-b48b-2e092efdc78f" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="e5074ecb-d251-4e1f-ae8d-c37625e60dd9" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="a1400735-686e-4549-8e13-9c445f01c42b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="76f6bab3-8b55-40e6-90d1-fc0b40c49c52" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="b688592a-98f8-4d78-8b63-8118bc0b934c" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="5e49c5af-b626-494f-b537-2e2c7bbcbca0" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="3386a66d-a7a9-4bba-84d6-8981244c147d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f2f842ea-3db0-47ed-b8ee-2124a519d49e" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="ffd22003-4b7b-4988-be62-3bdaa212d12e" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="982b292a-63e4-431a-932d-3019e2e15b0e" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="679b0991-7278-4ead-b2de-d41c2377b51c" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="7072fafd-bb65-4ecd-8bc6-b2ac3c8663aa" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="33b340ac-8efd-4b1a-af9e-6ad986c9928c" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="7f5e59a0-d388-4e47-a039-238234886a19" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="44c99fb4-e65a-448a-a3c6-73c9a85d24d0" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="dc9b928a-db69-4aa4-99c8-90540acecda6" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="a281add3-8244-4e34-94ce-4f67300adaf8" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="8123be77-a29c-45e1-890e-af57c5441703" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="520e94ec-5a59-44c2-bdba-117b9566a8be" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection */}
          <div className="mb-6" data-unique-id="b1e4edf6-29d2-400c-a0cf-27e529f9fad6" data-file-name="components/UserTable.tsx">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2" data-unique-id="5aad03fc-7676-4b65-b2a7-46754a37fd60" data-file-name="components/UserTable.tsx">
              <Filter className="h-5 w-5" /><span className="editable-text" data-unique-id="b409776c-7eaa-409a-908a-2f7b8e8dddd2" data-file-name="components/UserTable.tsx">
              Filter Kategori
            </span></h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="68e6a003-31b5-4dd4-9c2d-34363e646732" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Regular Categories */}
              <div className="space-y-6" data-unique-id="42974f6a-690b-4912-b220-3b185c741f0d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                <h5 className="font-semibold text-gray-700 text-base border-b border-gray-200 pb-2" data-unique-id="51a08c9e-8590-42c6-805d-e7f416f3d7f1" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="53518e11-3bba-4b16-9bdc-c490cc49d026" data-file-name="components/UserTable.tsx">
                  Kategori Reguler
                </span></h5>
                
                {/* Audio Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="86778816-130f-4cc1-b144-830a438248d4" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-orange-700 flex items-center gap-2" data-unique-id="54d4778b-514d-42ce-a795-850597e560cf" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" data-unique-id="e666da01-d9f4-4559-a57c-9e6f353976e7" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="b47518b7-5909-4833-ab8e-7ca37b703ce1" data-file-name="components/UserTable.tsx">
                    Audio
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="45aeacca-ccf5-4761-89a2-7588cdb979b2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-unique-id="96a72508-6af4-4bb0-9efa-05d9d4e32d73" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2" data-unique-id="dd92ac99-7489-44f9-8b89-4a2f6abd4df2" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="4c0d5140-00b4-4925-a466-07c3f1da8410" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="d2e2b188-5a0c-4a5e-ab0b-1a7ae9a626c1" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5f354e71-0986-4c7f-8e7e-3444332a4cc3" data-file-name="components/UserTable.tsx">Tidak ada kategori audio</span></p>}
                  </div>
                </div>
                
                {/* PDF Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="d0524090-e124-4173-9afa-be132eb20a31" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-green-700 flex items-center gap-2" data-unique-id="1eea4373-7fa0-4861-bb3e-2c2fd18e3204" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-green-500 rounded-full" data-unique-id="c7f2f0e3-0e64-4648-a15a-6063dbc1f0a0" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="217c599e-e89b-47c5-be2b-90e506f293be" data-file-name="components/UserTable.tsx">
                    PDF
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="8f8b5c5a-4b69-4eb9-a61a-00c59d8f710b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('EBOOK') || upperName.includes('PDF');
                }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-unique-id="0c370396-1166-4deb-ba2f-7ff3e7b93e77" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" data-unique-id="6eb1dfa2-ddf9-4814-9880-b459863c49d6" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="e3d808ab-97bb-4bf1-a4f6-649022a6e112" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('EBOOK') || upperName.includes('PDF');
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="23f6ff5c-1606-4316-b4f2-4f3ed819b1f0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="64bf1635-04ea-4352-aa7e-4a53d37b0ea8" data-file-name="components/UserTable.tsx">Tidak ada kategori PDF</span></p>}
                  </div>
                </div>
                
                {/* Video Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="bce92ac4-9aa8-4285-b27f-9578eb2d5b0d" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-purple-700 flex items-center gap-2" data-unique-id="34eeef35-0d37-4bf1-b4da-7afbadda08b3" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" data-unique-id="452d61f4-f812-4ca1-845d-5e328fcb9f7f" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="275e6029-0544-457f-a12b-e20cc69f914f" data-file-name="components/UserTable.tsx">
                    Video
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="163ee425-840e-4088-98bc-5c7deece2adc" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-unique-id="0772a698-0e11-4969-9cde-b3dced962bf4" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2" data-unique-id="3ac7836d-b1a8-4540-b234-866a2cba5caa" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="5b4cde86-9b3f-435e-b2bd-b97c731928e6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('VIDEO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="742b5bb8-6ddb-4846-a69c-845e6af8b4d0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3e8b89a2-5c41-4119-a2a0-405dc91b975e" data-file-name="components/UserTable.tsx">Tidak ada kategori video</span></p>}
                  </div>
                </div>
              </div>
              
              {/* Cloud Categories */}
              <div className="space-y-6" data-unique-id="80d2ef73-3adf-4f6d-8791-78ccc8a32c71" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                <h5 className="font-semibold text-gray-700 text-base border-b border-gray-200 pb-2" data-unique-id="c53a26a3-9376-4d2a-a9fc-4a8690a2bf91" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f5c064c9-577f-4f6e-b71f-c958f3ea4043" data-file-name="components/UserTable.tsx">
                  Filter Kategori Cloud
                </span></h5>
                
                {/* Audio Cloud Categories */}
                <div className="border border-blue-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm" data-unique-id="04bcf57b-786c-4386-9f79-056415c880d0" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-blue-700 flex items-center gap-2" data-unique-id="c9456342-9e79-405e-a44d-b42869b9e28b" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" data-unique-id="812d70ab-13d1-49dc-a6cd-f3ffe098cd43" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="a545e07d-490f-4a44-b2d7-98e18f6f3520" data-file-name="components/UserTable.tsx">
                    Audio Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="4cf3564b-efca-4da6-8821-e88cffedfb2b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).map(category => <div key={`audio-cloud-${category.id}`} className="flex items-center" data-unique-id="dcba39c9-333c-4cf4-8dbc-01e2906df154" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cloud-cat-${category.id}`} checked={formData.audioCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audioCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" data-unique-id="44aeedfd-2105-425d-b6ac-5807964f69b1" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="8df0f182-881d-4cdd-9a38-a1f01a98b166" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="69b6c5b2-2628-4770-9cf8-f1f8930c3d98" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="cc38e398-0886-423f-a331-9b28cd13f28e" data-file-name="components/UserTable.tsx">Tidak ada kategori audio cloud</span></p>}
                  </div>
                </div>
                
                {/* PDF Cloud Categories */}
                <div className="border border-red-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-pink-50 shadow-sm" data-unique-id="8aaac096-5d68-4349-85fe-4fc54242612c" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-red-700 flex items-center gap-2" data-unique-id="b7ad9f9d-8107-4f53-9678-1cce4f54323c" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-red-500 rounded-full" data-unique-id="34fc6ba4-c295-44d3-8729-1d5a7a9cc6eb" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="0cd6c0af-0ec6-4a5e-8c5d-873cb494ad53" data-file-name="components/UserTable.tsx">
                    PDF Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="def83e1b-4e1f-4d96-a050-b0e4b0ebb57f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('PDF') || upperName.includes('EBOOK');
                }).map(category => <div key={`pdf-cloud-${category.id}`} className="flex items-center" data-unique-id="349dac5f-1105-48ad-9f05-df28599a940f" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cloud-cat-${category.id}`} checked={formData.pdfCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdfCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" data-unique-id="ca7470af-5983-43aa-bfa3-dedc6d835143" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="e4a8f996-f0b1-41ae-a46f-7b66648c891a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('PDF') || upperName.includes('EBOOK');
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="3b771b13-dd00-4efc-a39b-87933d54f27f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="698abf38-f7b7-4491-874f-66eac209d4ea" data-file-name="components/UserTable.tsx">Tidak ada kategori PDF cloud</span></p>}
                  </div>
                </div>
                
                {/* File Cloud Categories */}
                <div className="border border-teal-200 rounded-lg p-4 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm" data-unique-id="a69c3b01-f487-44a1-95b2-fb93f0c1de4d" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-teal-700 flex items-center gap-2" data-unique-id="9eb9e707-3d29-4b76-86c1-a7e480ee75df" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-teal-500 rounded-full" data-unique-id="b5f38752-5736-434d-9241-b544b8896358" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="3c63076b-6c41-4039-85ca-b602ccf5b290" data-file-name="components/UserTable.tsx">
                    File Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="01f3e8c5-ea72-47e8-8f90-7772c3feb3b2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => {
                  const filter = category.filter?.toLowerCase();
                  return filter === 'file cloud' || filter === 'file_cloud';
                }).map(category => <div key={`file-cloud-${category.id}`} className="flex items-center" data-unique-id="9dfae772-81d7-47e6-8364-4ac2687ff874" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`file-cloud-cat-${category.id}`} checked={formData.fileCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('fileCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2" data-unique-id="6631e487-7855-4c69-9092-d11617df162f" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`file-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="8031c1bd-1acd-4754-832a-edd503166d72" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => {
                  const filter = category.filter?.toLowerCase();
                  return filter === 'file cloud' || filter === 'file_cloud';
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="72b0fa51-319b-43f0-b628-ca20bc10e25e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="a7291d9b-add1-47ba-8123-0026f180f5a5" data-file-name="components/UserTable.tsx">Tidak ada kategori file cloud</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="0dcf341c-8a8a-4285-9d60-b81613fd95d5" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="91d6525a-edfe-4ed5-9afb-8d029c5902ca" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="96d3eabf-099f-474f-af9e-72e64265d427" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="6774acdb-81bd-464c-8918-d2b8bd0174d2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="a9f4ce5a-9774-456b-9691-43eabc05159c" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="05ba102d-2f7a-4ba0-bc5d-b9fcafc4dc03" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="82b45b52-7bf6-4d85-9e89-fb1b014b0ee6" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="003d5d6d-4563-4b4f-a8f9-439e1c86f4e6" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="314b5b19-6ab2-4292-842e-1123bee59591" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="fc98f1df-7fbd-4e59-88b9-636fa5762735" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="b1e8258b-5d18-4564-b5c3-ce9a29d662ae" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="4c192d4e-8955-4768-b007-ee7d7a8fb219" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="8def7fd6-b6d1-4f70-a665-41d648c30d90" data-file-name="components/UserTable.tsx">Kategori Regular</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="a80d187b-a96a-4e00-b7dd-bd13daa8f326" data-file-name="components/UserTable.tsx">Kategori Cloud</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="463326c7-f87b-4938-b179-52dd379d1afc" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="8775e7ec-9cb3-4899-a4a8-02f717b24bee" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchQuery || filterActive !== null ? "Tidak ada pengguna yang sesuai dengan filter" : "Belum ada pengguna yang terdaftar"}
                </TableCell>
              </TableRow> : Array.isArray(currentItems) && currentItems.map(user => <TableRow key={user.id}>
                  {editingUser === user.id ? <>
                      <TableCell>
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="152087a2-698e-46ae-92ad-d3906ccf8b9a" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="08f15aed-31d3-4b99-8a09-fee83d7e84e3" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="8fe8993b-e454-4a72-8406-40e96ac7b452" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="4676dee2-5e4e-4d3c-b451-4fc4096bae8c" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="7f4e42fb-bbcb-441f-8d2b-aade12eab02e" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="700d90f9-c834-449a-a60a-21d4fc7e5391" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="36b5aae9-2e83-41f5-83a0-7bbcf71f44d3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="0adce034-3c49-47e5-948e-82963119ffa0" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="aa921d4a-d55d-49de-bb02-4c16b044768a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="af66ae93-45c8-4df0-a921-4e09cf50f2c1" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="764892aa-a86b-4348-8db3-e726ad2598f9" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="80becb98-5251-4fe1-b5bd-7c7c0627e608" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="70043524-5acc-4dc3-af58-6898419705b7" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="dc79c5aa-3e2f-4534-89ab-daf140d0d826" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="482b2e4c-5ca9-4e1a-8e97-ad61f41c71f8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="2087658d-96c2-4239-b9b0-4860f6adb895" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="10a04e67-7095-4056-8a8a-73bca46dfcfe" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="4b8953a5-71e7-48e4-a94f-ca24f33f64f9" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="12b726bf-c856-41f0-ac5d-eaeaca931a97" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="7f80a4d3-acee-4b4b-83ec-ab02910668db" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="4a6348f4-46ad-42f8-bf5f-d9f0b91b5ab0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="22a8289b-96ca-40bf-bfc9-cc1a0f5eabbe" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="bb48baf2-8513-49a7-8346-2c63f8e0d83a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="23cccb96-068b-4cdd-808f-f4be17df4513" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d5bb830e-76f9-4fd3-a736-a0a395d33329" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="5bbb34f4-3cba-4e82-a565-66a2d7e0da3b" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="505e45e5-b05b-462d-91a2-9dcb4794c2ac" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="80e5e660-ed04-4dd1-9e98-8f93d9de08ba" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="accea170-034b-4f65-884f-13b0431084ea" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="40cc523e-0fcf-4715-a331-d7becbd48f56" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="23cb0204-f9db-4a5d-bbc8-f2395d8b6e5e" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="d8640ecf-4ffb-4843-a149-03f06eea8249" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="24b85fa2-da19-4b85-8ccb-7f07f58d7d49" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="7ec2b762-be32-4a60-82e6-af9b936d1016" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="8dad1b4f-3dad-4f12-9bd5-32ed086756ab" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="2be1554a-e681-4d4d-a040-8ec7efbd0d6b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="f13c6e90-d3f7-4149-a7bb-7b80a1456391" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="46b20f63-fd1d-42d5-8da2-106fec2f5025" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="6a16571a-d2dc-4faa-9082-cdb3e024c638" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="64cb2bc8-ee27-4fac-8ec3-edce97545a06" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="93df709f-c823-49ae-b3b2-99b8cc82c9de" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="6b4efc76-59f4-40d3-a50e-1d16d4dd9432" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="7e2f907a-3758-4b80-9b4e-c7a32ad6a226" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="8662ca0b-cc81-4230-be68-e3abc3ef01ad" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8927de61-708e-4d26-805c-8383b079c2d9" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="17fd9995-6ebe-4dd1-9b59-1b071597594f" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="16602d96-4e9a-4812-8d76-abcff6d33033" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="997cbf65-9aa4-469f-a0ae-697232a068e8" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="53a56f50-5c3d-4cdb-b9db-b784957952d3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="2a617847-fdb4-406a-96f2-a1f517ea267e" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8bd9e89c-9df0-40e8-8089-12fb5446826b" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="90f7d373-4b47-4bf8-944c-b866fb049f4c" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="69043000-c87e-4a66-ba6c-9eb652678b30" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="682139a9-6f19-4118-9fcc-381d41de6415" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="fecb4170-4dbb-4431-a056-464fe84b0d10" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="b7366638-983c-4024-b0c9-c8ba2875210f" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="77c533eb-6c74-4ae3-8d34-41807c610dc7" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="368a8a89-aba8-4f01-a51c-ee1795b86d9e" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="762e3cdb-0bd8-4074-8a43-ebb7b1b3d097" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="d719c43d-503b-4919-8d78-59b0fbd2eb95" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCloudCategoryIds && user.audioCloudCategoryIds.length > 0 && <div data-unique-id="89eb8b12-2311-4c0f-88b2-d45cbe726d9a" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="fd0085a6-6c3b-4c9d-a4cc-535db0cee4ac" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCloudCategoryIds.length}<span className="editable-text" data-unique-id="7ba70ff8-78c5-412a-8e96-c3ee565c23b9" data-file-name="components/UserTable.tsx"> Audio Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="1730d406-08f3-456c-bda8-738aaef2ebb8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="15cd37e8-3981-4833-b05e-0603663ddabd" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8a5cf78f-1ae9-4a9e-80a0-b2dc61ef344b" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`audio-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="d531c6ec-235f-436e-ba65-7ba356460022" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6e78e7a5-ce13-4ee4-9035-db136a81e7c0" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCloudCategoryIds && user.pdfCloudCategoryIds.length > 0 && <div data-unique-id="08d665ac-6629-4fb7-a4d7-969149b5eef4" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1" data-is-mapped="true" data-unique-id="ed8b126b-1707-48e3-8cbf-16d32d7de0a1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCloudCategoryIds.length}<span className="editable-text" data-unique-id="f68e1e24-d3d7-4762-84d9-a1abf062c167" data-file-name="components/UserTable.tsx"> PDF Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="0261f4a8-43ff-404d-996d-b66bf9e024c3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="b4c1f1b2-8238-44d3-8e75-0b4738235c22" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="01c5bb32-0e03-4d98-bd2d-6342b1bba748" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`pdf-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="94ae48a6-0eb9-4a28-bc60-cc11e5614ef4" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5bc5814e-30ed-41fe-8664-e57ae9d6a0a0" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {user.fileCloudCategoryIds && user.fileCloudCategoryIds.length > 0 && <div data-unique-id="743daac0-2c41-4fbb-99cf-af0047925116" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mb-1" data-is-mapped="true" data-unique-id="ab6dbedf-0f87-40b2-b59d-5dfa9eaab79d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.fileCloudCategoryIds.length}<span className="editable-text" data-unique-id="8d3abebb-2e91-485f-8682-f6ab76e0bd92" data-file-name="components/UserTable.tsx"> File Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="249820e1-b187-478b-a94b-194cc67f696d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.fileCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`file-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="09197821-46aa-47c8-8855-aaf80a11c5df" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="36e06a25-4a22-4ff5-ad1b-5d072a458916" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`file-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="266860b1-aeee-4f0f-9736-744914e6713d" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f7780535-7dba-4e93-94f7-3ca2515d82cd" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCloudCategoryIds || user.audioCloudCategoryIds.length === 0) && (!user.pdfCloudCategoryIds || user.pdfCloudCategoryIds.length === 0) && (!user.fileCloudCategoryIds || user.fileCloudCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="3a2f6831-8fc5-4d5b-901b-0761a6fd4426" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="a46d4606-34a1-4fc4-b7f2-4cc45a7b192d" data-file-name="components/UserTable.tsx">Nonaktif</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="a80266fc-3b92-473c-b916-63f15f49bafa" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="29335ab7-dd09-4895-a847-4a5eea437884" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="99adea97-6624-4f8e-84bc-578ed10fee3c" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="fd8ebe90-f454-4e18-bfe5-3bd3234a42ee" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="de381bd9-ce2b-422c-bb28-60327a2a9273" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="54c4d344-72c4-4307-99de-6e292116826e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="f3bd45c9-771c-4e85-b26d-5f9536e408ef" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="ecce71cc-d26a-4ccb-a1f9-6f8db1d4ea31" data-file-name="components/UserTable.tsx">
                              <Trash2 className="h-4 w-4" />
                            </Button>}
                        </div>
                      </TableCell>
                    </>}
                </TableRow>)}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="51fca6bf-cd6f-4419-8769-e8d93c369555" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="78cac2c6-c5a4-47df-96f2-e66b2227efdf" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a1463fd0-2b49-439e-b852-b235321ead38" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="8498d964-dcbb-43fa-b457-a83e17d07a24" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f9a6ee8b-d70f-49f3-9fec-f44a3e9e11b2" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="da065c21-e90f-407c-aeea-a93f870493e9" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="1511425f-2cc2-4ca3-8bd6-ff8d9e6d32f7" data-file-name="components/UserTable.tsx">
              <span data-unique-id="a593739b-67ab-422c-aea0-09179bf69e56" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="82fbe5ce-44e0-4139-87f8-fc637209bc40" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}