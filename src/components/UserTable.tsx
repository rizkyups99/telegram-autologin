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
  return <div className="space-y-4" data-unique-id="bb680d47-5d41-4501-a2d4-e136a8c0d5af" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="0e66887c-7e25-4796-a077-9dec5cbfc754" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="039adf0e-eb0e-41ef-8317-c183255439aa" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3b364986-8d6b-4e5b-841c-cd2f5cd62f9d" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="95328bae-9a69-4e97-bc71-f50b3abc1859" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="3c3fef67-39dc-4c8d-8024-0dedf37c3057" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="c6eff578-530b-483f-ac04-cec8274a4d4f" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="0188533e-7948-41f7-8372-5b2708f6b81b" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="456dc66e-0370-4572-9102-1de9f09974c5" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="2e1ee2bb-cc4c-4546-b1e9-781dbde28895" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="680894cb-cb63-4ecc-8611-08b78a919f57" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="0d78b260-30ed-497d-b645-30c8de697577" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="389e4174-527d-444c-9372-1f88647f675c" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="dc8e7d2a-c0d9-4728-a3dc-31290984b68b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="45ee1636-82c6-4bf7-9440-19942b3a93f1" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="0ad77b0c-4b84-42ab-baef-cd3b0f833422" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b79c7683-40ca-4319-ac94-a4507a00114a" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="3ac165a4-2698-416b-8113-099ea6856fef" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="cbb86f76-3187-4a68-88df-94b3391981a6" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="d821006b-f03e-48a3-ad14-44dc3fbbd16a" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="2edf99aa-d10e-4e0d-a661-6c9d069f7e1d" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="bcb60c3a-4fbd-4a70-bdb4-147c0ac5590e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ad8ff8c5-2278-4658-b240-4b761068267b" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="660d7b65-a27c-4169-9a39-456d20e4da4e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ccf8238f-8839-49c8-afa2-67ac97f6c6b2" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="38e18913-ed25-404d-82f9-0f7ee849629a" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="92a55dd9-a0cb-4b2d-8bc3-d2602788163b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f451a3d2-78b4-47ef-a06b-6286fa0f83d1" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="6a8ca23e-48ab-4d64-a4df-da02d193a9d3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="ec109160-59ca-4d5f-badc-51653cfbc7fd" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl shadow-sm mb-6" data-unique-id="b1ceb8da-18bc-46b0-8464-aa3536d06831" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2" data-unique-id="11b7c851-19f3-4377-99eb-ef3440664c2c" data-file-name="components/UserTable.tsx">
            <Plus className="h-5 w-5" /><span className="editable-text" data-unique-id="51aeca5f-f5fe-49ba-a5a0-f2595a8e51ea" data-file-name="components/UserTable.tsx">
            Tambah Pengguna Baru
          </span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="22d6c93c-d4fd-4c74-a85a-8384c2b926c7" data-file-name="components/UserTable.tsx">
            <div data-unique-id="326d3956-c7d8-4a8b-9212-7c509e3f95f2" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="3ce6a798-0d6d-4d5e-bb3e-3ac0c75ec617" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b52fc40d-0f1b-405d-bc4a-1850e0b0d95f" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="22f996f6-d5e0-4eda-8ee4-669cc6166b4b" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="45038985-db90-4bc4-b2b0-b0ac4a385be5" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="e31bce39-e044-4c36-9bfe-09bd95ce676f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="77d639f6-043d-4334-bb58-2ec9ff9590b5" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="08bad65a-158f-492c-bedc-80edd5c1082e" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="c242f5bf-af75-4491-ae9a-0a93f6e342ce" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="9e926e1f-e0bb-4db8-91bb-d3e4018be91a" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="bdc930e1-f327-47f8-a90a-ba4ff3451016" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="d0e06eee-8080-473a-9ba7-28460d4b6b94" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="85543322-ca8f-45f4-9d2a-c78f04277911" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="33193596-54e8-4ea5-870e-eeb2d63dae94" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f9f0d28c-6fca-429d-915f-718a09b9afd5" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="646c9b34-a1f8-4ab1-afd7-0ed50a939d2b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ebe87456-e37c-4af4-a809-2c76893b108c" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="0af7ad63-eb56-4839-95c3-abcd3000f6f4" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="2e2c1fc4-e81d-40d3-b254-0a6fdd06a17a" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="2170108c-6d03-4456-96f6-52ff09736922" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="abee5405-a46a-4ebf-b018-dd0d6f9cc3ed" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f5fd1c8f-6033-4b89-9acc-30f0f99ee51a" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection */}
          <div className="mb-6" data-unique-id="5a15c110-73a1-4376-ba4c-0191595571c9" data-file-name="components/UserTable.tsx">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2" data-unique-id="3944720d-8b90-4961-a7a7-3b4945783cd8" data-file-name="components/UserTable.tsx">
              <Filter className="h-5 w-5" /><span className="editable-text" data-unique-id="8c928a24-ffb0-48e1-be44-8c1d2749ac64" data-file-name="components/UserTable.tsx">
              Filter Kategori
            </span></h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="8954fee5-7122-44aa-b07f-be252dc24ad6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Regular Categories */}
              <div className="space-y-6" data-unique-id="611ab946-8192-4817-9679-91485793b73a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                <h5 className="font-semibold text-gray-700 text-base border-b border-gray-200 pb-2" data-unique-id="e13bf4ba-4cf1-4c9a-948b-e0d3f1f6fcd3" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c9dc9765-5954-4f2b-a465-441eb7c5e3b1" data-file-name="components/UserTable.tsx">
                  Kategori Reguler
                </span></h5>
                
                {/* Audio Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="7af74478-f82c-4632-adf1-4ba7942ed1b7" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-orange-700 flex items-center gap-2" data-unique-id="414e0338-eeb6-45f1-921a-6ec71c96acb8" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" data-unique-id="8e4e202a-294c-4320-b166-9e980ca20afa" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="8a253469-aac1-4108-a071-0bfd74d9482b" data-file-name="components/UserTable.tsx">
                    Audio
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="bdb1d95e-5962-41de-8295-d46ac567ade2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-unique-id="0fcc6351-1ea1-4793-9191-47485301de95" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2" data-unique-id="f1aa1f03-50a2-4d2a-b84b-7bbced27e267" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="10cea69b-87c7-491b-a57f-0413c12527ec" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="8f5bf854-ea70-48e4-8351-3b7796497bc0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="11338ef6-f5e6-4cc0-ab8c-ccf97177f0b2" data-file-name="components/UserTable.tsx">Tidak ada kategori audio</span></p>}
                  </div>
                </div>
                
                {/* PDF Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="72dba0db-3b1b-4e1b-82a2-62b25c531ba3" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-green-700 flex items-center gap-2" data-unique-id="9a2ceead-59c1-4266-b9b9-b1a227ac8b4b" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-green-500 rounded-full" data-unique-id="0473d31d-b506-4afb-81b6-b9d812d0aaee" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="d4b6f346-5a76-4c63-8eb5-2422cce1278e" data-file-name="components/UserTable.tsx">
                    PDF
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="d582d675-e9af-4e60-9662-9b4519573246" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('EBOOK') || upperName.includes('PDF');
                }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-unique-id="e3901640-9fc5-437e-a3bf-9be7832e01aa" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" data-unique-id="90d26e82-ed6d-474d-93ee-3cce0bedabf5" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="46e2bc0f-2c64-458f-a043-3e98becfe16a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('EBOOK') || upperName.includes('PDF');
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="5e1ff357-e76e-492c-a17d-a8e43b8b39f6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="aa61f14b-a160-40c6-a21d-53ba46887ffc" data-file-name="components/UserTable.tsx">Tidak ada kategori PDF</span></p>}
                  </div>
                </div>
                
                {/* Video Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="10d9e95e-6af9-4487-8960-132da750f782" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-purple-700 flex items-center gap-2" data-unique-id="68f05839-a748-4ef1-90da-0adf7fd1ea8d" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" data-unique-id="333775b0-f610-4f8c-88b9-0bb4bcd1cc73" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="f7960077-1e91-4f6c-97e6-574b1b396921" data-file-name="components/UserTable.tsx">
                    Video
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="f96c2b93-7def-42f7-99c0-d03f4a269fa9" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-unique-id="4a26f252-f981-4758-a961-c92a844fd164" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2" data-unique-id="938f8b80-31a4-4dab-a3e4-a65d8f7fd81c" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="1fe8d46b-e20b-45ea-b9d6-477afe4ab601" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('VIDEO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="a0b0cc90-1ccc-4f7c-a244-0ef78665c35f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ff73ee28-feef-4d32-9f5f-91bc1416f03d" data-file-name="components/UserTable.tsx">Tidak ada kategori video</span></p>}
                  </div>
                </div>
              </div>
              
              {/* Cloud Categories */}
              <div className="space-y-6" data-unique-id="7c8a716b-c90c-46ce-9881-dac6dcc8fefe" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                <h5 className="font-semibold text-gray-700 text-base border-b border-gray-200 pb-2" data-unique-id="79d204ce-b77b-4748-9c62-f1b9636e6428" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e2d7a6c6-c17c-48a0-a694-ae483acc95aa" data-file-name="components/UserTable.tsx">
                  Filter Kategori Cloud
                </span></h5>
                
                {/* Audio Cloud Categories */}
                <div className="border border-blue-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm" data-unique-id="3c8aa197-4c21-4ebe-995a-2dd467af49c8" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-blue-700 flex items-center gap-2" data-unique-id="305228e3-7667-48e8-b437-7b5d739be62a" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" data-unique-id="1cf32774-9ea4-4ba7-97e2-9ac5ef900eb9" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="e0b2e3d9-d618-4ea6-bb2d-0688d30f7453" data-file-name="components/UserTable.tsx">
                    Audio Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="c3003f06-8631-419b-b99d-2596eee35655" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).map(category => <div key={`audio-cloud-${category.id}`} className="flex items-center" data-unique-id="815b831d-2901-4483-9cec-aa088d7b3241" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cloud-cat-${category.id}`} checked={formData.audioCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audioCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" data-unique-id="b4c2abbd-ef52-42a1-b61a-5b2f55a9a7e8" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="7a22c5e2-5bfe-455e-a3a1-3e3976b81253" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="da62315e-d011-458e-9a4d-2466e868ecdb" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="a9b2c503-9035-45f1-9c61-238905c5a639" data-file-name="components/UserTable.tsx">Tidak ada kategori audio cloud</span></p>}
                  </div>
                </div>
                
                {/* PDF Cloud Categories */}
                <div className="border border-red-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-pink-50 shadow-sm" data-unique-id="058952ff-7e64-4591-8cc3-bcbb2101c5e7" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-red-700 flex items-center gap-2" data-unique-id="949ae947-6a9b-436c-be69-f36a03e97a24" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-red-500 rounded-full" data-unique-id="0fa375c8-b8e3-4d75-8f0c-945ae6592513" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="2bd09b5f-5702-4932-bc81-3502dd97d731" data-file-name="components/UserTable.tsx">
                    PDF Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="76472bc8-75ff-4e1c-9425-ba2cafa8b1be" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('PDF') || upperName.includes('EBOOK');
                }).map(category => <div key={`pdf-cloud-${category.id}`} className="flex items-center" data-unique-id="89bbd3e0-3ac0-485e-b81e-fc8c31b10de0" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cloud-cat-${category.id}`} checked={formData.pdfCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdfCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" data-unique-id="1698cd05-e87e-428c-9d74-cc86c4b6481a" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="59dd83df-eea3-4fe0-b7a5-11edbfff1f3c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('PDF') || upperName.includes('EBOOK');
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="7d9b2d85-9fb4-4751-85b4-b658e6e97ecf" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5292d1df-959e-4b55-a36f-130585e7c054" data-file-name="components/UserTable.tsx">Tidak ada kategori PDF cloud</span></p>}
                  </div>
                </div>
                
                {/* File Cloud Categories */}
                <div className="border border-teal-200 rounded-lg p-4 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm" data-unique-id="2695689f-0bb4-42b7-be77-9ffdc817d6f8" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-teal-700 flex items-center gap-2" data-unique-id="9bc4b36c-cc51-4b3f-ab23-9cf45a8dad79" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-teal-500 rounded-full" data-unique-id="347efc76-8f3d-4282-9455-a07fe572a790" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="2a1a7dd7-807c-48a6-9928-88eca325c102" data-file-name="components/UserTable.tsx">
                    File Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="f0012ed9-ff07-491b-b8b0-a58fabd7e542" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => {
                  const filter = category.filter?.toLowerCase();
                  return filter === 'file cloud' || filter === 'file_cloud';
                }).map(category => <div key={`file-cloud-${category.id}`} className="flex items-center" data-unique-id="440d82bc-d20b-4102-8448-ecb1968ed83a" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`file-cloud-cat-${category.id}`} checked={formData.fileCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('fileCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2" data-unique-id="2a5847c1-22ae-41de-b027-22ee9e136785" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`file-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="44afe00f-708e-470c-bc87-2aa5ec529172" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => {
                  const filter = category.filter?.toLowerCase();
                  return filter === 'file cloud' || filter === 'file_cloud';
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="bc2af4aa-6691-40c9-bb75-999ef25b13a0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3c09eae5-8f3a-49cc-b6e8-6e23fbb5ce70" data-file-name="components/UserTable.tsx">Tidak ada kategori file cloud</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="87e485c4-7e1f-4709-b4af-206195851c9b" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="76b1ee9b-0dbb-4778-b08c-5489ac5e0fba" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="8e1fa7b5-51b7-44e5-8863-6ef07376025e" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="a3525a43-ef48-4bfb-917a-52e83f01bf01" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="1a5ea75c-37c3-4411-a91e-d11cb6cc6d91" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="f4c3a154-eef7-440a-a3f2-1d6d8b31cfd5" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="86593220-a2b7-443e-82e0-38486a30b7cc" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="0c1e1d7e-5917-4d68-a179-7917c34fca80" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="84f2563a-018c-45eb-b61c-d1b098635ba8" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="ada47dcd-f2c6-4973-82ed-ea104f3f67c1" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="1c5e84c6-8c31-4c0d-bd7e-a1d6ebc9acd7" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="ad55b0ba-8a23-441c-a578-84eb147dd35c" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="a79b69e2-fa76-4660-81fe-8c2f907e5042" data-file-name="components/UserTable.tsx">Kategori Regular</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="14798d67-87e0-427e-ae0a-033047886956" data-file-name="components/UserTable.tsx">Kategori Cloud</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="e68c70ff-0689-4c32-a551-5a54fd2cfd52" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="57876c2d-bcc2-428f-9c16-a7d6dd09d66c" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
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
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="6a57a1ad-b664-47a1-a182-e01a37598110" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="bfd87c2f-aed6-49e8-b7c7-c1525e076f84" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="7c3e1698-dd5c-48ca-bdad-b99c1f248abc" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="9fae36a0-0ff5-4490-af74-2c8a6f29ba54" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="8f52ba86-a385-4289-aa9b-782e4cf333a1" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="9bb3983f-f21d-44d3-850c-12059f04f95e" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="87872123-68cf-475b-a34c-fe0b33673fd0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="34c5ba87-9b68-4550-b3a2-64292f79c881" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="c44aadac-0ab7-4087-a693-caa5216000a0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="d0525049-27b6-4642-8d57-3d69f095733e" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="ff1b4449-3781-4602-aa16-bc1f6e010494" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="7eb9044b-d9ac-42e4-887b-c326384d7269" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5dda13cb-08ec-453a-8076-0f5ed8fa1e17" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="802c30ab-6969-434a-9c9a-903b2a844f51" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="46f14dc2-5fd5-4651-b1a3-e6c7d9ae95b0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="45d27776-5215-4036-b1ff-27b66007e488" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="9480ed7f-421d-48ae-bf1a-a5f6d2a134ed" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="65c88c6a-595c-4c11-af12-7b27a64da919" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d3000af2-1acc-4a81-a513-c7993c2c5916" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="0dfeaf0f-58f9-4f97-9941-41bc79e260ee" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="05381b83-3fde-4885-8c53-440874acd35a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="e452917b-cfe7-4c4f-bb62-f29c2b70acd2" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="d118a504-20cf-470b-8199-6164d354c281" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="39a28a8a-9887-438c-81d4-4f5180544a28" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2cb7bc31-aa4f-493c-a64f-00d6419a86a0" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="9341e042-dbe4-45fc-900b-49bf54000c13" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="4663ab14-9e3f-4208-8853-6ad5f72180a2" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="cce323e7-cc78-48a1-b7a9-4391f8827fc9" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="f7d50fd7-9cc1-4a83-a177-bf6a4fdabbe1" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="0d4d3d1e-1e73-41ac-9510-294249f6f17e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="cfaf6838-789d-4ad1-bf4c-b9d7aabf0dec" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="8c1ddcb6-39e0-4160-be98-d97e74cff808" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="3e0b22e6-fa73-4c5b-acd3-a05b0767ce33" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="6350ce29-a8e3-428c-9f67-2273ae66a54f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="c43e91e4-6722-49ae-b5d8-a54b847653c9" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="2d685422-852f-46b1-84cf-38d799de1deb" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="f5689514-8fb2-48e5-9c86-03653c28197d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="d06a0f5b-dbb5-4fce-b528-3422a76030bb" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="dc382a22-7a8d-4801-a551-e1b4cf3fad0f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="8cee939e-c614-4e8a-9794-aac3e1bf1bc4" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="59efcec5-cb9c-47e1-af38-103ba3133395" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="227e6e8f-99f2-4625-8b95-e5cc59d6c964" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="ce705cd2-5e70-4fe8-973b-e9d54894c753" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="8748bb36-b614-4fbb-9847-5d640e427d62" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="81a76646-932b-46f0-9089-e34149fec089" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="5d9f866d-fcfc-4a30-9639-6bbfe331dd41" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="d6d49471-f472-4df1-828b-ea2f0c1a7b6e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="06e85101-1f08-44fd-b88c-94c158dbd036" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="69d292c0-f241-4abd-a4f9-72baf3c7896f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="de525363-8a85-4dc2-91fb-b8084b83558f" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2346d81f-e33b-4c86-8b16-ba472bbe9608" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="77392225-e788-438d-9684-5e0dd5195dfa" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="6334d2ec-0d11-4926-959c-5477a3937677" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="e752a6bd-669b-4440-803e-c48ecd62d3a8" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="8c521bd2-f766-4bdd-980d-1cfc9aa10b4f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="437869ea-4e85-45ec-a840-b19bc4c27735" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4a720789-2af8-4c35-8b62-ebc6789d4ac3" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="9e45eb42-8315-4201-925a-62a08b1d8471" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="c8ad71ec-5198-4c0e-a1be-93005a71add8" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="c233883e-99e6-4604-a7fc-2b21738a8944" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCloudCategoryIds && user.audioCloudCategoryIds.length > 0 && <div data-unique-id="55caeebf-53e6-42ad-84fa-520e5c432b4d" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="6c2eefa3-b3cb-492c-ab66-8ddecb56c67f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCloudCategoryIds.length}<span className="editable-text" data-unique-id="e471d3fc-18c4-4cf3-890f-7a6f5b02d2cb" data-file-name="components/UserTable.tsx"> Audio Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="58cf816f-a583-4963-8d45-8d800079d502" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="6170f3db-3d84-4d73-b0f2-900b9b334091" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="66f4d240-8255-412d-bb46-bf3deeb1ee79" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`audio-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="d61189c5-5017-40c7-b112-3406a358336e" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6868e0c4-4c02-4248-a2d6-8d7202fe4c2e" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCloudCategoryIds && user.pdfCloudCategoryIds.length > 0 && <div data-unique-id="62b4f85e-d122-49db-82b2-b2473eb6e035" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1" data-is-mapped="true" data-unique-id="7dfaadc4-70f8-4c55-8b38-a856edcb4860" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCloudCategoryIds.length}<span className="editable-text" data-unique-id="f8ac9982-57c8-4ef9-976f-b0debf74ae7b" data-file-name="components/UserTable.tsx"> PDF Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="ad28e56a-c923-4c7b-8c8a-0259b780f42c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="ab167642-d897-4d75-acb3-9f76a6e80cfa" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d042d480-fd1a-450a-9750-432996076ded" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`pdf-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="70a5c7e5-0aa1-4c15-9ea2-286d36c04fd1" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="fa804ef5-9ca7-4114-8046-f071363aecb8" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {user.fileCloudCategoryIds && user.fileCloudCategoryIds.length > 0 && <div data-unique-id="c8319b93-8e5a-4017-97b4-b1c78753679a" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mb-1" data-is-mapped="true" data-unique-id="444e24ae-e861-42b2-bb7b-2e0ecbb1a7e4" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.fileCloudCategoryIds.length}<span className="editable-text" data-unique-id="54b1e45b-6028-4e5b-9dac-1fa0ce554f51" data-file-name="components/UserTable.tsx"> File Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="fab545b0-799a-48f0-bfbd-c0c05636f2a6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.fileCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`file-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="886a4324-056a-440d-b167-f7b7e346e807" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9d52878a-6447-4b9e-9b4f-f64ecf03c641" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`file-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="222c3c61-81dc-43ea-9cb1-0928b7d73b4b" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c567e174-2d0b-4942-b85f-9eafd6868888" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCloudCategoryIds || user.audioCloudCategoryIds.length === 0) && (!user.pdfCloudCategoryIds || user.pdfCloudCategoryIds.length === 0) && (!user.fileCloudCategoryIds || user.fileCloudCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="55d4db7c-3641-480f-978c-c020e2a579af" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="27436976-b3b9-4ad8-8651-33c2ce481505" data-file-name="components/UserTable.tsx">Nonaktif</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="0ba14f43-d351-4627-ab65-5fca4e8251f7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="4c48f9b7-5da7-4e87-951d-ee10f40a091d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="33837a07-5740-4610-b6a8-830b3bf994b4" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="d35678e8-f490-4e86-bb47-8ee0930866dd" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="afc6986f-b7a4-4ba3-8fe8-31a357a80848" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="46baeed9-3a28-41c6-8156-c84be163d58b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="298be3dc-6fad-474c-be76-dd6e81bdbe15" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="4426eaf5-2aa2-42be-b033-5e810125f54f" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="12880341-3c71-404d-93f8-1dcd52ed5293" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="46d04a60-b005-46fe-af58-91a87669516c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="58621f0b-a644-40c0-b943-c8127eae3f03" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="7eec79b3-9830-4ab9-88de-215ada62cc79" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="2f045f6b-aed1-40a9-bcc3-1f270475fe59" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="d89a367e-902e-44e7-bdd9-e768d9b5d6df" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="c1148dec-2e2e-4214-86cc-ce5826de0fa6" data-file-name="components/UserTable.tsx">
              <span data-unique-id="0b1ac9b9-89a0-4d96-8d3b-ad55aebcec43" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="caf27858-ed02-496a-afc6-1e39f49506d8" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}