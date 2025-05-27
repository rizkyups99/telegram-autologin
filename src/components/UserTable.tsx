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
  return <div className="space-y-4" data-unique-id="55d95f62-22de-4bb5-b914-1cbd65067242" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="50803968-db0e-444b-8ba1-0bf73aa0fde9" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="cdf5503e-943b-44b7-838e-b189187cdf2d" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f341a73a-515c-4a6c-ace3-a2bc583b9688" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="44158fb1-8938-4def-84a3-4d7d8e3cf42e" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="c0743af9-843c-407b-94e0-03ba29de6021" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="6267a47f-81fb-485b-8910-82a10509ff06" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="d28bb853-85f2-444d-842e-2bf48060b638" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="5de13145-aff5-4870-9936-c9dcace795f6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f9e60304-dbda-4c81-9b48-47f1c8b55010" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="5c3caa45-34d8-4bc2-9061-32a681b35f5f" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="0b276276-c800-4ae2-95e1-5b4d96a41be1" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c56387f5-4a3d-41b1-8fd8-993f3cfc00b3" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="2612ea50-6bf8-4a30-a4bb-15f64a05dbfa" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="93b29503-d52c-4ee3-9cbd-975a87e6af2e" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="9a05d9e4-7b63-4505-85df-3fb92a3ea555" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="d25ad1f4-aedd-483b-994d-62881d266c2d" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="14026ba5-6434-4d3a-9d87-d3430de789c4" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="793daedc-bb49-47bb-aa67-40ea50e63fb2" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="4bb90ef6-77f3-4448-b184-cff6bbcdabb7" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="4a02db36-e25b-4830-99c0-ac14c9ff9653" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="15782165-256e-4bef-886c-a88c64d56cf0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c0e22876-450d-4f5e-9108-2a1ae3159404" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="bd72aa01-5052-4d81-923a-3046b0c638ef" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e057b011-9876-499e-aab5-d55eeacda62d" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="5a054800-52c4-4b3f-adcf-a7003f230163" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="7bb5d201-cebc-4a74-a935-316da87ce387" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="21b01c85-4592-44bf-9ce4-3ecba8547030" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="c5fcf297-a047-4f69-9807-f11815b46ab8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="c28160c3-4126-4b3d-a122-3ac81c8316c6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="fe5d7ff2-3082-418d-9571-eacd18f8618c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-lg font-medium mb-4" data-unique-id="667ae186-f19d-4826-86ac-961bd285979b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="051d732b-415f-4eea-858a-8629c4012339" data-file-name="components/UserTable.tsx">Tambah Pengguna Baru</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="27a1d54c-5fe1-4aab-86a8-9fbf287cc774" data-file-name="components/UserTable.tsx">
            <div data-unique-id="fb3eb424-98ca-4a77-bd92-fd4c4ea60a5f" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="0507b4a8-6053-460e-a9c5-15cfa55b9788" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f455e514-b3bd-4fff-a14e-316c5e08bbe5" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="6b03dfbd-8e2d-4e09-a1a1-829f90a4f655" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="5e40e65c-73a1-4b0b-857c-258b67e7d343" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="4ac5c518-d40a-4817-9d36-67c6b9c3d28b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="620c9a90-9cab-4862-be08-856b8154d4cf" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="be00c1c0-75b0-409a-abe5-124e8ea48330" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="83bebb07-7c78-4387-a3c0-e00cfe09693f" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="8cce94ba-cd86-4266-b145-894008f52224" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="011fc4ed-54a9-42c8-a88f-2676f296adf8" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="524bba89-f6a5-4ab9-9a93-0b8cb0ebf281" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="462a64e9-129d-454f-bbb5-057582ba904e" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="7beedabe-b82c-4220-9630-48d499dde526" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="8b8151e1-13e8-47d9-ab35-30b1b9a81028" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="f18cd510-29cb-44e9-a700-2d0648598a5f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6c9f3007-cb48-438e-96a8-b3c916aa8899" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="c0d86cc9-1281-4f59-a9ef-da051643144b" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="94bb519d-1c96-43b1-aed5-cc11146ca6c1" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="cae8340e-fa21-4b7a-93e3-62264f3bd3e3" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="d7861235-6832-4b88-ac9e-e339f9a8a1eb" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5b491801-391e-4725-8421-e7b65c4e08e9" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection - New Section */}
          <div className="mb-4" data-unique-id="847d44f6-7fe8-4a43-8cdf-9c38775c472b" data-file-name="components/UserTable.tsx">
            <h4 className="font-medium text-sm mb-2" data-unique-id="14ac8634-91bf-4dd2-8317-56d317bfb554" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="656e27d7-49b1-444d-bfb6-0f3af8e5016a" data-file-name="components/UserTable.tsx">Filter Kategori</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="ccbda917-2bb6-4c3e-9773-c1c009e4681d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Audio Categories */}
              <div className="border rounded-md p-3" data-unique-id="9fed5b5d-4679-4cc7-886c-98f44d594f99" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="79853f56-1f8a-4037-aab9-99655dd1453f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6f7cf825-fb41-4df7-843e-bb2f932c62ac" data-file-name="components/UserTable.tsx">Audio</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="e82408af-42fd-4542-8539-6f4df045b112" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="885e4575-46d2-4663-9ca9-2a4dcff97f60" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="50ac1f32-0a02-47a1-88b1-899de844e9a3" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="0a4a2986-ee2f-46e3-b0ea-23df28d19036" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="8c1ed1a3-1f64-4f04-af06-20c4e106eb4f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="738f263a-139f-4b29-84c0-24d8a5e61756" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* PDF Categories */}
              <div className="border rounded-md p-3" data-unique-id="3b25cc68-7507-4936-8adc-92dba37f30cd" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="5a74758c-a056-48bc-b370-3abf7eae72a4" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="35092127-6234-4044-9f57-2e651872aec8" data-file-name="components/UserTable.tsx">PDF</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="1aa0df30-f269-42ba-b109-d292505b4c04" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => {
                const upperName = category.name.toUpperCase();
                return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
              }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="6549a572-e7e6-42d8-8f28-808c3fdd6b99" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="b853537e-c7d3-4bb9-ac35-91cb1aa15fa7" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="ac926ebd-dae9-427b-9a3b-dbac4f3be748" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="b7f6cdd6-374f-4a41-96bf-45ca88f28027" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="72d969ca-9c77-46bc-a80a-387a3ea6f9a8" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* Video Categories */}
              <div className="border rounded-md p-3" data-unique-id="360bc225-e40d-4f97-ae98-fafbfa0e7ddb" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="a313cb0d-0800-41f0-8c2c-9aadd83a1b06" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="95669a47-768a-49b6-9ea3-b67ad1c95cab" data-file-name="components/UserTable.tsx">Video</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="b1863c9f-ea5f-4182-b661-81ec41909822" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="08473474-a5a3-4ca6-a47e-5b16081e9e4e" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="b5d4f3e2-6e36-4ff9-8d83-206585805bd0" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="fffaef49-adfd-41ef-946f-7587c83ffdb5" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="4728a629-a5e3-48f2-a830-672d7e2d3f0d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="2fe6b914-6880-4ef8-9242-3e51b88b6f8f" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="07253c07-3e32-45be-9c2f-3a9cf15b8b82" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="42de92a4-5b7e-4a2f-ab9a-c2a41bee157f" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e12e897d-538d-4ac2-9e4c-12218bc371a4" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="ae3960e3-0c2d-4337-8600-64caee5a1b44" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="c27e9545-649f-4f04-b1d0-7170fdef6dfe" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="558e5ab2-2ade-4d73-b9f0-e5b217418736" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="84bc81b3-666b-4723-9a5f-2cc0a032fb50" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="71845227-fe5a-4d9e-9b95-cd9f88585105" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="8a96fc24-0e7e-4ce3-bee3-072873a467b0" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="99179320-05c9-4e7a-8a9d-603ae2fa18d5" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="9052c611-ca90-4adf-b94d-6f9b21d09b88" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="47b2711a-0cb2-45ac-85bf-f7d546d779e4" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="a65a1aca-0527-4a67-b444-f9bbb9bc57eb" data-file-name="components/UserTable.tsx">Filter Kategori</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="bed2a13c-b8d5-4017-97de-4f80f547d8ff" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="308e5b6d-e401-4dbe-ba23-4fb100aa11d6" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
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
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="2a1c8089-8c61-4e0c-8c6c-76088f8a7219" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="6dff9ec0-bd1f-4aec-adde-a55774523751" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="841f68f4-a459-48db-8bb6-fbdd22a56b64" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="639e8f01-7f85-49e1-bad3-cfcd72f8f135" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="046199d7-3ee8-46b3-8a15-b48a71152f3c" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="20062af8-7cf0-41ed-aca1-7395298fd95f" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="519cc5c4-f159-4a2d-bd4f-019684ce2a6c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="64b6f473-e47f-46a7-bf49-dbf1f6d9550f" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="8d28eb36-3aec-4558-8c85-fbe023060c37" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="8f020e39-e941-423f-9def-e89ebd48e51a" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="ad1b0050-2dac-4365-b123-eb08a7151feb" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="22c9a3cc-2ac1-4715-a834-029435cfe394" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6df98a86-e9c8-4ca7-8c05-f8c26ea4f6a1" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="3cfbabbd-9686-48e3-bcac-749b7eeafac2" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="079c2d4e-f839-41fd-8ade-4b73cbf06ab0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="af8b2625-0489-4939-b95d-d8710dcb9f2d" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="efc774e3-70b3-4ae7-b31e-9ccbaaacb874" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="5eceff37-f0c3-46a8-a7d7-527f62229679" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5c4f1479-a2d1-43b2-acd5-73cf2b58d427" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="59db7899-f0b0-43a7-8986-24ffa6e07375" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="787e462b-7427-468c-831f-009cecc5d768" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="d1c9c8f5-10d0-4902-a85c-fb76ec3b72f0" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="e906125b-f4c1-4540-8208-efcdc8edcd08" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="4e6d968b-5e0b-4a87-aa0e-027a09074a98" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4b721d68-b2aa-4c7a-b95e-2f64ca41f8c9" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="cd31b511-4839-43ae-b557-65776ca0030d" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="9e6953b8-8af2-412f-9009-0dbf7d6b08b7" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="e8de1d0a-0111-42c2-9acb-18450c795078" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="c1387735-d1a9-4d0a-a5f8-1f470fc1a50a" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="361ea187-61fe-46cd-aef5-ae2684dfe8fb" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6c73bdcd-5019-4896-89ab-8274ac87c932" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="d235eb2e-d3dd-4db8-9333-f856808e36a2" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="d7c0fef8-2487-4053-9b04-c5ca2780a138" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="0f98480e-25e5-46c2-acde-cceecde6e9b8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="e0565567-2f8e-49ee-9600-2fd93240937b" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="469ff93a-a632-48b1-ad20-848c3c69e458" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="5a5dc280-bad2-42f9-acd8-c498de76c46d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="19f3b564-64dc-4782-9fcc-fa5be41d0485" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="e7873fce-78f6-4c18-8662-aae2ec04a5ae" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="04ab7894-4f84-44d2-88d5-9632b5acc6d4" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="5c430759-5d65-4393-b670-dbef50c7bf54" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="6a17c0ca-aa73-4ef1-b2c9-fe4847ca2654" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="5404d71f-aac7-4f37-9ec4-6a4a48ed17b5" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="4b1ad9a8-2f23-4b79-bdcd-1bc411df4a57" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2087e6e9-5064-4691-9fb9-a1084c48ef0d" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="2a9dbd27-2582-47f1-8947-17c7f5186d00" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="693b1543-aa15-48a9-980b-e848fd642d82" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="55ff5985-d83d-491d-be6a-f7af4408c97a" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="7a92a782-0588-4655-979f-aad1675cd232" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="4970f524-b91d-4414-9864-e1a076434be1" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="189add1c-da49-42c6-8966-08aa378a97ad" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="3c0264c0-a517-4e98-9a4e-edaca9237333" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="9310aaf3-ccdd-4d0a-8889-3468d2132ada" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="5b79e52f-bf98-4894-a333-adabc3913996" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="fb4138d7-9478-401e-8280-506ccb6c13f7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="d4d7e599-2c9d-426f-9a98-0be17f71b1e6" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cac5967e-c2c0-47fe-b8e1-f6cccaefa98e" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="9fe9f5b4-5db0-4ee2-a07b-66ab77f37303" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="3cb3f93f-0388-4581-b38d-ea807398c36a" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="6851e0dd-2d16-430d-867d-5f80d7db016d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="50cca087-33e7-4b2c-99e8-b1e0bcefb4f7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="588143f7-ca32-46be-8c5f-d882a4c2fe0d" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="84c75bf2-78d5-4f7b-97fa-2aeef77b7912" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="4f3ceb5a-7064-4057-886b-98e59586442a" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="9f75823d-465b-4fcc-80ad-8468fde345a4" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="7c43b97d-ce7f-4e5d-be58-2f1e6ccda0dc" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="2b230a79-5cd4-4445-979b-e00ab8312402" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="36ba204a-6ac0-4d7e-bf1e-272136ba2a51" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="1e5fd7e5-c50e-4802-9031-66653bd1de6b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="0ae77ab9-a16e-45a7-b76b-fe58850b5cf7" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="922b32e6-9139-4404-8b45-8e27ba224625" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f7a236dd-dde9-4024-b4ef-f665f05a27f8" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="c4be6060-dc8a-4998-92d2-6adc6a464d0c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="38baf108-0622-4188-885d-20c88bfd4df6" data-file-name="components/UserTable.tsx">
              <span data-unique-id="8000258e-72a3-4360-ba21-3e34c7e4d1e0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="aef4627d-7713-44cb-8de3-4fab6bd4cf9b" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}