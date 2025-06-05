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
  return <div className="space-y-4" data-unique-id="81ab3797-8b1a-4e32-a853-3f6ce24dfe6f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="a6dfa4fa-fd1d-4b4d-8d35-7a61780687f2" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="32a4dec8-357f-4e34-957c-2696097c1977" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="27822158-4ff0-4ead-ba6a-3371b610ea72" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="58f91dfe-17bf-40c6-b2a8-2880aeb8ea17" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="b8b404c6-7010-466a-b13d-deb7bc575cb3" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="56b8d6c4-fa3c-4830-949e-d308ad2a5006" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="591c6ca8-05f3-4ae0-9201-c181d7c83b43" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="c4b897d3-31d2-4026-b566-d16cea4e9c5c" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f4de476b-5d53-4864-b07d-517989974dc3" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="13631921-6e38-4dad-a51d-a622cb03d509" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="c6067bc7-4a0a-4b57-9ce6-be12c51ef45c" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3cbe6f88-f943-46ba-96c0-33c8d32951d3" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="cb9f025e-ef52-4d0d-aeab-569b6466eaf6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="016d44fd-e14d-4200-9f17-5e3cbd11e196" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="7fc2d4df-28bc-4a53-ae3d-c93d47621bcc" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5faf3951-ae63-41b5-9994-5f57ddab27cb" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="f976ec0f-8b38-4b23-8d03-986bcad4e350" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="c484b24e-12d1-4f6e-8c7c-85d30fa36308" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="86e39341-5941-4893-8d56-f988d6e80c0f" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="af3a3216-4558-4593-8ad4-01557e6150ec" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="4030ec51-9d7f-430e-bc89-3fab6c1d3659" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5c5e9dba-5b6a-4a2f-9651-10016af1b079" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="5ca9110a-3705-4f04-bb4b-e8d1ceac0c6b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ea5bf698-f11d-4d7c-abb4-3fb144b9d9b8" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="9269a13e-2491-4e7c-b9ee-29677b769d58" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="ced01169-9ffe-4da0-a1dc-6df51579decc" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="10f7c3fb-139b-450e-92df-f0a362c3b9ca" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="9eecb622-4cce-43c6-a45a-67a5aa7d144c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="835fe5a1-af6e-448b-8225-4fffbf44d6e4" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="d0a4221b-7b4e-4897-a66a-835ef8e1aa46" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-lg font-medium mb-4" data-unique-id="c7a303fa-915a-467f-8e18-880689793866" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="48b875d7-fa85-4942-a3e9-8819542c487e" data-file-name="components/UserTable.tsx">Tambah Pengguna Baru</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="585cb4ee-ed13-4f69-bc3b-3722c3bdfeb8" data-file-name="components/UserTable.tsx">
            <div data-unique-id="45f5e979-ab02-4da6-baca-85c51b8aedc4" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="739909d6-8d8a-41c6-baad-511cfe5179a4" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b651f899-096c-4359-bf06-6ec617d8b900" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="d386b208-faef-4dc1-899a-640514fba8a8" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="464bacc9-ba57-4133-b6a5-698ac9929cc5" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="91936fae-69b2-498e-b59a-d3be1bf16008" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="502c4194-06b9-44ad-a3a0-9c0b1b3aa955" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="0fddf7bf-2dfd-4ed2-aa2b-3978dd2834f2" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="c7e5b853-e4fe-4f9d-901a-5f8b39165afa" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="74d08335-8d6c-43dc-bd0d-fcde3676d543" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f7ddb522-cb68-4ba8-b579-1f4a0f4566e7" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="436c3b9b-5c3e-4afd-ab23-54116cdf269c" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="d6a9cd9c-b474-40a2-8bd4-cf68dd9232d8" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="5bfb852a-e7fd-4c09-8f53-3b57f9a9a334" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="42b714f5-33bc-410a-8a90-1fe76b46a5fe" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="4cfa3ec0-102f-4128-b064-3059fab5a7e2" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="0e60de80-21ac-4c8e-8532-7c19caa544e0" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="a1f448e2-51c8-4fa2-89ca-e96521696429" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="415494c3-63a6-4e44-944d-9077331ec64a" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="b1f7d98d-ec3d-420d-bcc7-dafb7481a43b" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="68df5358-9536-4aba-9709-4112c04b9bc3" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="89b5ed09-846d-4989-a959-ccd0c84defc4" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection - New Section */}
          <div className="mb-4" data-unique-id="1bd6d264-6279-4354-b868-18b4d1fee46c" data-file-name="components/UserTable.tsx">
            <h4 className="font-medium text-sm mb-2" data-unique-id="c3407e65-bff7-47db-a386-f43327c305a7" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f029dec8-ee6a-49f1-ab9d-81305583cb1d" data-file-name="components/UserTable.tsx">Filter Kategori</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="5241ec6a-b672-4d62-9a6f-34be47781332" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Audio Categories */}
              <div className="border rounded-md p-3" data-unique-id="b91bdabd-83d0-4c6c-9f22-3d18dfc5a424" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="c81b7942-7cce-4923-8945-9505e835758a" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="a60cbaee-405d-4720-9f81-e7d23c204505" data-file-name="components/UserTable.tsx">Audio</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="f83db2ef-176b-482f-afef-42670e3efca0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="3b146f51-19db-4e52-834e-6c2f8d959db6" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="682ee8ab-a362-4dd1-9f77-d8d3ef1c55f5" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="0611a500-37bc-4bb9-8412-49453f1e05e4" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="ffa0b107-f401-414d-b24f-2624d2371429" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c5bff300-be33-47e5-b190-b2bdfe0b6ba8" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* PDF Categories */}
              <div className="border rounded-md p-3" data-unique-id="4f4955c1-a8cd-4081-b2d8-73c0a599cc46" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="d8513250-87cc-4444-b39d-abdb05c7c1c0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="403c5bfb-9596-43a0-8613-97ddfb84fe30" data-file-name="components/UserTable.tsx">PDF</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="5c46a8aa-a058-49ba-b197-ea89369bcac7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => {
                const upperName = category.name.toUpperCase();
                return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
              }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="e7271e5e-f90f-44d0-8bf8-e68cca5c7c32" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="bd68df7d-0b4d-46b4-8b5e-465e14d3abad" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="79e1eb7a-13b7-495d-9b7f-1f4a1cf184cb" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="4ad924b8-9a2a-4bae-9728-7149bb811324" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1925e4f8-4a5e-47ea-8dd5-a05e56a863ef" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* Video Categories */}
              <div className="border rounded-md p-3" data-unique-id="b4a23dd1-1af3-46ea-a95e-fc10ba17b71c" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="39c7827b-7599-42ac-ba66-9c7091880b13" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="efa73913-30fc-451c-ac57-97f6c5001ae7" data-file-name="components/UserTable.tsx">Video</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="f30c3b50-0f9c-48e7-8ce6-38165dd1a51c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="10b26446-2b52-4781-b20a-fcae39814c38" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="63686f1d-effc-42cf-9721-f35efbc057d4" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="bb5600f1-1446-4e22-a2c3-9e5ef5832ad2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="3135c5a7-589f-4810-b6f1-1498bb516229" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="52d3a8be-54af-4ff4-9c83-3ca5e891d22e" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="ee36c728-d5f1-40ab-820d-20b79fcd93e9" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="7c71690e-609b-4caa-8d79-6d718c04d8e8" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="43b98945-135c-4f19-8c8c-b65b1df3adcd" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="e7a74798-2330-4b84-af96-6289e12c11fe" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="28b02051-3529-44da-81f3-b5868102e932" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="52174769-a1a0-41b2-a2ce-93831b8bf99d" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="e17e2e40-6c66-4387-9e26-aa15fdc5659d" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="18502f23-8ff9-4267-88a2-fea47a80d709" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="5fa8d78d-f2b4-4dfe-bcd9-73c1c3795234" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="d25a4d98-58bb-4039-b500-5d118f0440d5" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="761592c6-2e0a-426c-911f-7c38221af2d8" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="feed8f68-7aab-430c-9922-512e043e312b" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="8e24c2b0-25cd-4b58-9522-027479a65d78" data-file-name="components/UserTable.tsx">Filter Kategori</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="4a2f20bb-791e-4311-9ab1-401c7cc47d1d" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="3ca743aa-35f0-46eb-8514-56dcd481c980" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
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
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="f9f856fb-b503-4c94-b689-f2c11c8f4333" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="cab91037-b7c1-4be7-b876-f88f5be3385e" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="2c1941bf-61d7-46b6-a630-7ec381e82066" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="bddc27d4-144b-48a6-a6cd-5ddba3d0fcef" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="eb63f595-2d01-4284-bdee-d0302687d97a" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="aaad56f6-52fe-4017-9c63-e40397bf96b2" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="0820ae75-5c69-4b28-8108-6e78321a87ff" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="5395b364-d1bf-4033-a1cf-9aae9e5c9372" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="baa683cc-d324-4d6b-a372-7c464d0d24e7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="e4deb6e7-5796-4f39-a407-846d7e2180cd" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="d25f5c52-dcdc-4e52-86b1-70468403d42f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="c7e6f62e-0f37-4597-8059-3f712cb866e7" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b228ad2a-de5c-4ee7-a4ff-65dd5376865e" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="4611768c-289f-48c0-8d66-414033afd02f" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="0732e752-b0b9-40c0-ad93-c23d27e56171" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="768cf105-19f7-497e-a1b8-64854b55b72b" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="ddb8fa34-5fbc-4731-9727-777a3648c718" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="ad4e4cd9-bc3b-48f4-b656-fa6cbf69421c" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0f1f90f3-de67-427a-9631-61f0faca2455" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="625ba355-867c-4d0d-be19-7910b8e72e80" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="5e78b2c6-1589-4051-b9a0-9ad1cbb6c922" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="e6398684-7b72-4c12-b6e6-fe75dee7c85d" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="74f80828-d857-44a9-a805-a03b56a618cd" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="634b9abb-d2a9-43fa-bf1f-87e054ebc396" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9391edf7-8727-46c6-a31e-c48dadb9d29b" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="3a01f6dd-d216-47ca-b75d-128863de427a" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="0075dcb2-5817-48c8-8b44-dfa8b171e060" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="90a5426d-4bea-43c9-857c-72fda0949930" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="eabe60d5-ea99-477a-85fd-0c27d7f6fd34" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="12de6c73-6ee1-4beb-a7e2-85049d992514" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ccf9a01a-37b4-4867-a64f-8633ad8044e0" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="819219ff-29b3-4801-b4ce-4dc59a6384f0" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="aae6e3f3-a895-4657-bd68-5ade074c6159" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="4229309e-ccb4-4991-9642-66568f6b3ce3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="88c3cde3-f6f9-45e7-8f0f-9d34e6e7111c" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="7f004581-a4c3-44d8-b013-bda3137a33e1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="acb2fdbb-a913-471f-a2de-c282029622b0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="22097d63-8d15-4b18-ac64-42feef0034b7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="7f4b7f15-7e71-4c5f-a808-9c191a14cb90" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="09a0daf3-bcb0-4a62-9466-61fcbba70492" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="f4b82cf2-5dc3-4454-8845-5a0371020734" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="bdc30640-9bc3-4690-a857-b5d649e8cf2c" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="dcf8d20e-d618-4239-9974-203748af9c7c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="8986401b-c592-446d-a757-a76053d24cac" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b57069ce-7699-4bde-b231-3df12eb8ca5d" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="e748bdcf-6da5-4a8f-90a3-f72784c0ce49" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="bd4ed61f-eaa8-42f7-aeeb-6dae4b98c4c6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="ebefcccf-2a4e-4653-9e17-74848b9e76d6" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="38435fd9-4685-4539-9e9e-25ac813b0269" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="73b4722e-271c-4925-a195-16098188acc8" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7193b36c-7a2e-490d-bde9-f6572214b863" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="e08d1256-5706-4b3c-bb03-bc9494168108" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="7ed6ac0e-b18f-49f3-bf1e-f68fea1df7fe" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="9bfb09db-d402-454c-a893-7ee0a506c9e4" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="67981e44-8856-4f9e-959c-4bd9fa0d2703" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="34a3078b-785e-4cb7-ae01-f9cc571ea733" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f3a8e93b-84da-473b-a613-a3c6ef76e717" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="59ac5074-f2d1-47cd-91d4-6e8ab215cde0" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="88ada591-c09c-480c-925f-2fc31136b0f2" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="b2c74a10-304f-48ea-87e3-60b248473d19" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="1bc38703-4f6d-4773-b21b-c7d588743120" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="da38ed92-910d-4efa-bc79-bac214d531f4" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="219c7a4c-0fb8-4fd7-aa25-6aa80dc1abb7" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="86f341ca-ffc2-4bd1-94d5-67ced171a5b7" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="8dea621a-98fa-48f6-be40-537a13e7196d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="ef53d815-12cb-42e9-93af-35e4f3e9ee56" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="34f79892-4786-4101-9d46-1081dd8ec223" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="38f87d9b-d046-4569-80c0-3aa4995e35aa" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="5ce4e06f-ba83-47df-91ae-01bc77882fa3" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a90666aa-66bb-4b7f-bf6a-7baebe97121d" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="346507d9-7963-444e-9cf2-d4806ae4f9e9" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="37e111cb-f7ef-4542-b30f-56586de0771a" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="44650bb0-160c-4936-8b52-97ef76d09d13" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="04fe7449-a26a-4393-89fe-9c17fcd81e02" data-file-name="components/UserTable.tsx">
              <span data-unique-id="99c7331b-ed74-4983-b9c0-ceadcae0094a" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="7d2e3c26-049a-4ee6-9330-18133100f344" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}