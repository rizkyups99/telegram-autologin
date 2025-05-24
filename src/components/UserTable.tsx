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
}
interface UserWithAccess extends User {
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
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
    videoCategoryIds: [] as number[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
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
      setCategories(data);
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
  const handleCategoryChange = (type: 'audio' | 'pdf' | 'video', categoryId: number, checked: boolean) => {
    setFormData(prev => {
      const fieldName = `${type}CategoryIds` as keyof typeof formData;
      // Ensure we're working with an array
      const currentIds = Array.isArray(prev[fieldName]) ? [...prev[fieldName]] : [];
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
      videoCategoryIds: user.videoCategoryIds || []
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
      videoCategoryIds: []
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
  return <div className="space-y-4" data-unique-id="5ed8f565-1574-4eb4-8658-bd12f02cf3b8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="7bf85147-f97a-4074-9517-ba2285cca70c" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="353fb08e-5497-4915-a670-7628fccc1d46" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8f451e1d-2914-4e8f-99b5-64716254ab76" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="64d07fcb-ab34-4f4f-bb3a-820b0f2bdc54" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="9d90ea7c-f431-485f-82d5-70a225593def" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="5c435885-2169-4c94-adb8-2504bbdad1d0" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="35b5b7b0-66d1-43a3-8fe0-ab870e3cf600" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="5b4784b8-a705-4a8b-9b48-e34b2a4885cb" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e0491039-c1ba-436f-a0d4-df6d4d60be6f" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="55fc9b2d-fd44-4d66-9cb9-a0c764aa2df8" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="255384cb-f853-4066-bed1-656aca9466c8" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="a6f790ac-6e0e-4c77-a124-d6a25f419080" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="70fe81d6-6d2e-4e16-8def-3fca55b9293e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1196489e-923e-4ac2-87eb-a3efbd91da2e" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="38bdca28-c0cf-41e3-8654-39990e6f3a24" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1071157a-dc20-411e-b811-168d3a8c3265" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="79737113-d191-40fe-877b-0ae8e49b6669" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="8cacd401-e3f2-4c1c-87a3-5ac4316ebfd1" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="0c04ff2e-c20c-48f8-a7c3-04d371af14ac" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="6062d3b8-25f3-4c92-8c81-ec669281bfcb" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="99ac271a-d8b9-4644-9e79-8bf5d3c93af3" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="8422ebf2-9471-4c8b-9f20-ed9b9e35372f" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="299f7a14-045a-43bc-bedb-31569e2cc403" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5b202ea5-7aa9-47c9-9377-f4aa31325510" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="5b4b0128-ff76-4562-a8d3-8a6b89d89720" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="8d621529-e1bf-4647-b3df-eac907392d8f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="7139a0b2-5d7c-4016-849f-617c3eb1e830" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="73a28f55-e87c-418c-844e-b7ff5651a3ef" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="005d020d-b7f4-430e-a3b7-14452e01dbb2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="cc736800-0804-42e7-903c-294a22c0f834" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-lg font-medium mb-4" data-unique-id="5640460c-59b4-4ec7-b7d2-5757b5d0e2bb" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6e9ec1c6-e1fc-472a-8595-64e0d9e738d5" data-file-name="components/UserTable.tsx">Tambah Pengguna Baru</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="49e0e78c-1db8-42e6-bb4b-69de57c4a679" data-file-name="components/UserTable.tsx">
            <div data-unique-id="9f0983e1-7260-4123-9d22-1a3eaa53acad" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="410c3811-4fae-4f52-aa58-7be0dacb265d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="4a1286d1-644b-46ce-a623-bb32df6beea3" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="0c683480-16c2-4782-afc8-da3287c95e20" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="d7725b12-8409-4af8-8f42-712f6528dcee" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="3ebf3007-f914-43c4-9da3-f0ac8acfd5f9" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c511f41d-9e1d-4b37-b68c-6b5f0f0e1b1d" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="5fd87980-ca01-4deb-9314-baaa8eacaaa9" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="d2dcdcd5-4737-4595-b2f8-366417089c2e" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="6ef1b54e-7eab-4390-8f70-cdd979d8d4f9" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b9b63baa-df8b-4f9d-8b88-ea984ac5b353" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="29d26158-f3dc-49be-bf48-2281e8b168e0" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="0527584b-cdf0-40e1-a84b-88f69a6164a3" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="40cf7f84-812c-4f6d-9e9b-9a7b81b98f60" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6503c2a9-1ea5-434f-ae7d-d60191c2cff8" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="afac4fdd-bc0b-4e93-88d8-59a63af32f6f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="673c1051-e027-41d4-b4fc-16ca1d20406e" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="dcac2732-d473-4b10-b747-f8b87d4210e4" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="b8625841-b9db-4bbb-acf6-28a1f6d1117a" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="0a0eba28-e5ce-472f-bd12-86c980a8e601" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="4f73b763-a447-4a9d-97da-dce39d213b09" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3f6e2c30-2f3a-4438-a039-ebecf5945e88" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection - New Section */}
          <div className="mb-4" data-unique-id="5e83a28a-fea0-4f6d-bf0d-2fb421f1a5f7" data-file-name="components/UserTable.tsx">
            <h4 className="font-medium text-sm mb-2" data-unique-id="25ab319e-2e79-4b27-83ca-21680ac82fd2" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="34d5633a-7c3e-44fa-b425-1701b160574e" data-file-name="components/UserTable.tsx">Filter Kategori</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="75fcd68f-40a6-4e2b-9ad3-23d3b2f7aed1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Audio Categories */}
              <div className="border rounded-md p-3" data-unique-id="2bbbece8-23f0-478a-ae8e-ac9dc3ecc044" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="4da283bc-b4f6-4a94-86e4-59f586f40031" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="34f14988-0663-4aac-a0b3-c82850293327" data-file-name="components/UserTable.tsx">Audio</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="fd9cf5d2-5be7-4a99-8726-6a7836ade75a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="2b98c005-eb9a-45bf-a448-459f6dd5bdbc" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="23ef19d7-757e-4581-ac9e-60717958fb43" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="9e35854f-c49b-4214-8eeb-85a07d6da00a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="6cbb497f-2bd3-4ac3-8292-1f8119044316" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1eefe626-bb01-425a-9da8-c0fa14916dfd" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* PDF Categories */}
              <div className="border rounded-md p-3" data-unique-id="3719de3f-32c1-426a-88c2-0601a367f455" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="4f7da0c8-7f5e-4138-b3b5-fdac6483ff8b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3eb8529d-d9cc-466f-b114-a43ac79940b8" data-file-name="components/UserTable.tsx">PDF</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="461c74f0-da66-4b95-8963-1437d723e25f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => {
                const upperName = category.name.toUpperCase();
                return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
              }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="933f19e3-0f0b-4e85-afe4-e00ee540937b" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="5f7455c1-c855-4e75-8377-51043fd441c4" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="609d01f4-2e64-4863-8942-b3939a8ffd09" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="99a2c44f-7e8a-475d-9fbe-2a3bea81f14e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="86ff252b-904d-499a-92ff-be4412fdd98b" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* Video Categories */}
              <div className="border rounded-md p-3" data-unique-id="bf6786c0-bc78-4038-9242-1a251e850727" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="9ee01b79-82fa-49bc-a3cf-c4c660794e20" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b935f798-defe-4311-b779-7c2a2cd85ba8" data-file-name="components/UserTable.tsx">Video</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="c0e1bc27-cf43-4624-a5a6-6d346ddb5a3e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="c005090c-0d6c-4ae5-b1a7-e5c5a4cb91c6" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="cc67acaa-6542-482f-a4ea-045de41653a0" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="c59c7feb-e5c8-4a49-9546-59f829f3ed53" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="3e9de833-1742-4e1d-a0a6-31979930ccfd" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="74ff7083-ba5b-4d3b-81fc-6804437f71c3" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="34c98902-f0d6-4395-aa25-e237c8edbdcc" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="13819c50-f648-4c75-8c52-74fa8a3213d4" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b58e88ec-dc6a-4dd9-b59e-01723a92fe98" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="03d78dfe-69f8-4a46-9be9-1ede5c1b66ae" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="1002cea1-9349-47c4-bf4f-83ae04b18980" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="39bc6db4-2b05-4fe2-8a2c-3916b27a0672" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="b592e351-6769-4035-a735-c8ae36d2bb7a" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="ce0e1f57-5acb-4cf8-aff2-d89ad36c751e" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="fa015671-4850-49e6-ab25-cbd121e928c4" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="d64abc8a-794a-4718-814a-743121d47dcf" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="75e88cfd-090e-4abc-b2f0-f95a0ccde02b" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="74c62417-0428-4331-9f3b-efe78bc0cea7" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="f4005018-a7c0-4a5c-ab5b-155ab129ea38" data-file-name="components/UserTable.tsx">Filter Kategori</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="8ae96b79-d1b2-473b-8748-6b440d063601" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="8cf9726f-957a-446a-9551-5cbe9926e071" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchQuery || filterActive !== null ? "Tidak ada pengguna yang sesuai dengan filter" : "Belum ada pengguna yang terdaftar"}
                </TableCell>
              </TableRow> : Array.isArray(currentItems) && currentItems.map(user => <TableRow key={user.id}>
                  {editingUser === user.id ? <>
                      <TableCell>
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="aa9b07d6-bf6a-4e84-bbfd-0432de0ffeb7" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="85ff0562-c4e0-4c17-ace6-11d1702a0d23" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="05e30c90-c491-467e-8ab8-dd5a0dab09fd" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="e237dc33-f1de-4864-a9a7-09e6ed6d2a28" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="ff376d83-c910-4a04-a90c-7224b421d44e" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="f4b7a0cc-0e18-463a-9b54-f088a3685c17" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="490f9c22-02ee-40ae-b1c2-2388349972cb" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-is-mapped="true" data-unique-id="02f2a041-16e9-41c9-bec7-2e1e16eb461d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="5f1357f0-829d-46f2-b29e-c1e2cb2d93a2" data-file-name="components/UserTable.tsx"> Audio
                            </span></span>}
                      
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="1be168b1-8ca2-40a1-abb8-cbf4d55f43ae" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="ddcbcb11-713b-4332-b752-4bc92601c4fb" data-file-name="components/UserTable.tsx"> PDF
                            </span></span>}
                      
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800" data-is-mapped="true" data-unique-id="624cf5d7-e334-4731-bd21-99f7b62fd12e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="0c62c41e-54c7-4f8f-8c5e-4a45a60fdd90" data-file-name="components/UserTable.tsx"> Video
                            </span></span>}
                      
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="12a8a72b-60a5-44e9-acec-fd7d766d85f5" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e86e4941-bf8b-48dd-9e8c-f8d0bd4d00d2" data-file-name="components/UserTable.tsx">—</span></span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="28098966-9866-4ca4-a94a-93e7fcddaadb" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="f024ab6c-08a6-424f-8e57-83a17dcb7ab6" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="b143298d-722d-4c5e-a4a7-ae954d0122db" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="56a22edf-0095-4aa3-bda6-5053d9f4094c" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="b033c6e8-adc4-4074-884f-4a49ba6186c4" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="5e1047c2-46c6-4d0e-88ad-c53cc26122a7" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="c9c66a96-642f-49a7-8b4c-a1d4463a90d3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="c2d8b34f-eb52-4411-babe-a58b93be7829" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="b304e4ee-4081-4afc-89ec-9ebbdd2d43b3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="dd6fd625-5c72-4234-a9f1-b750d75b034f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="f13f6fe9-5180-4bf9-8c6a-cbad3c05cedd" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="7a83d454-af2c-4c7d-8e71-b2b9ca3c32dd" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-is-mapped="true" data-unique-id="15f4a006-aeeb-44c8-8998-e03c2df9cbba" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="9d9fd718-702e-4aa9-8edb-3d9bfbd2b573" data-file-name="components/UserTable.tsx"> Audio
                            </span></span>}
                      
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" data-is-mapped="true" data-unique-id="73e6e353-da95-437a-bc24-c2472650d55b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="6b25c96c-939b-4787-9d0e-69b3928b5e99" data-file-name="components/UserTable.tsx"> PDF
                            </span></span>}
                      
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800" data-is-mapped="true" data-unique-id="a81ce416-d418-48ec-bdba-6353446bb71e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="c9a8f002-211e-4ffd-b2d6-c21ce9c3ea9a" data-file-name="components/UserTable.tsx"> Video
                            </span></span>}
                      
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="87ec9ab8-05c8-4d19-900e-f9cf16569c4a" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="39639f2e-04d5-4a07-85e6-2e42b3ee7ad2" data-file-name="components/UserTable.tsx">—</span></span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="2a665c2d-542b-4224-837d-4c310ec310e2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="4ff0c563-98bf-4ca9-b969-99764b31824c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="655c23dc-2b34-4e73-a504-bf441b801661" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="52900cbd-58fa-489c-adec-20272cd683c9" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="040aafbf-5f39-482f-a72b-8c618ff40d29" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="c784bb21-fe93-430a-9e2d-fbbeec914f97" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="b3a0a3b7-2490-4165-ab70-625b73476015" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="2015a836-7062-4a69-8ba3-24ea07198e01" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="9ee75272-6511-43b9-97ff-635698aa0709" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="1e6fae4b-e1a9-49bf-8cb3-6aba3bcfc5c2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="216631d7-74fb-4679-9149-a9a9c0258a69" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="7286e51e-a68e-4181-a20d-4561cef7ac27" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5c9d8389-b366-4a78-87a0-2efbc835317f" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="f9c98c62-6f6b-4739-832a-e2bedb34ac2a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="ddb11dfc-e353-418a-88b4-b8c40d5946f2" data-file-name="components/UserTable.tsx">
              <span data-unique-id="7695b8b2-78fa-4da2-80aa-21e1284129ea" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="85ec07f0-f834-47fb-8374-80e34bee884c" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}