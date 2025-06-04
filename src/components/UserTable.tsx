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
  return <div className="space-y-4" data-unique-id="af0c0692-a3d1-47f6-b9d6-75b475701a90" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="76d8cca0-3ac3-4426-80c8-8cb8c92975ae" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="0efcef6b-aaa2-45c2-a965-bb0127adc0dd" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="05641ae8-49b5-418c-83d3-43e1d603b9bc" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="30541ed3-9aad-4d10-a256-9ea0d82c8a06" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="8a1b094f-1292-4fa7-98fe-fb31f2f64749" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="a5ce6469-77ef-47ac-b087-f9ccfb46cb17" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="0cb8a88e-d20e-4839-9f1d-2c716a0716bc" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="1d6e0b9f-6527-4730-9bb5-dc2a4f5b63a7" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e21522bd-d8af-46dd-86d6-dfa08fd2d067" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f181ea32-3687-4779-89ec-de081ea023cd" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="241acdcc-fc9f-4cec-a988-35324f40dea7" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="dc1ea7c8-122a-41e1-a974-8a59246429dd" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="ba6ae981-c58b-4eaa-9e11-fa3570e3f3e4" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="0b760f26-80c4-4e7a-b73a-7ec25220a6cc" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="ef24862b-5bc2-4393-b481-46af8f8ecaa0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="eb929c89-7e23-43b1-90a5-3c029e2b35b9" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="e58bad0c-517a-4deb-ba0d-006d4f9f6b76" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="b5535c03-ef67-41c3-b26f-414211e5c519" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="c289d951-b031-4aac-ab35-e6b7d9cd7098" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="c841dd08-b1f9-4210-bea5-d9ee2191106a" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="c9cfc7bf-f7a7-4d93-a069-d84286d4a7c8" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="39fe3ebf-25b4-471e-bb1f-b0583721c53a" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="ddcfd7d2-0a7d-4b19-b46a-e6ea39fbf7c6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="aa64ae05-ee1d-4e6a-a0a8-7c74707279e7" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="de628778-cf63-422b-98ee-cc3f84f10101" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="1c089df1-7327-49f4-aecc-55581b61f943" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="a7eb2b13-8100-4d42-8e92-8b85ec0c8825" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="1784bd4c-aba4-4cd4-be0b-fc495eae2b24" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="ad547577-74ed-42e6-8ed6-b729f3e7f211" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="0ebd8915-0fae-449c-a3c5-7763b184f4b5" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-lg font-medium mb-4" data-unique-id="e26eed64-5ef5-482e-8a58-ffde96fb7036" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c989901c-d8dc-428b-905a-91ad0767ab62" data-file-name="components/UserTable.tsx">Tambah Pengguna Baru</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="b111b444-68dd-48cb-a587-32c62b54b00e" data-file-name="components/UserTable.tsx">
            <div data-unique-id="2244157f-ac2b-4c33-b7cd-e04a36f737dc" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="89ea07cc-0c53-49f9-bb75-a5a48466abce" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="4d1eb881-6976-4168-9913-fe970975160f" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="bf8ccc05-d290-4edd-996d-9fbebbd250b4" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="1497a89e-6295-4a30-9c09-90de584f4ead" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="097e3d99-3176-4081-9428-e0225589b334" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="76036e12-fbcc-4d13-8e47-4f3aeebf5f96" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="f16443b1-0dc7-4ddb-af0e-9e2ffeae1b51" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="23b17feb-49be-46cf-ab5b-1757f266741c" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="a4815a75-c26a-4c07-a9bb-1451589dad3e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="584fa78a-f79d-486d-ab58-48c866f940b6" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="f0481667-0d5d-4ab4-9997-9b8555406d0d" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="a0995ce1-7fb7-406c-9941-0d75b669cb50" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="0c23fb2d-12ac-40c4-a7e7-c1e84a4b466d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ccc728cc-0f17-4d1a-884b-6cea3cc644a5" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="ba41fc8a-7ebc-4aac-8550-ba4dff0ce5a6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b239d28b-bf60-47f9-8c9f-86e67e4246d8" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="5239bd25-3926-4c0a-887f-7c4820d7b263" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="24c16bd6-5cb1-4098-9f72-971c10201697" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="f3d40708-e4c9-42fc-9caa-beb0ce71c154" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="7630c151-5315-4ec5-b96a-8de3ef3d61ed" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="112c736a-127a-4ca1-a86a-3ca47a8a8941" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection - New Section */}
          <div className="mb-4" data-unique-id="2afac009-0a33-4a04-a657-de2931b264a7" data-file-name="components/UserTable.tsx">
            <h4 className="font-medium text-sm mb-2" data-unique-id="c92054bc-a6fa-48e8-ba72-3bc5d026d203" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="20322670-1433-4404-b184-fd0a79a75f4b" data-file-name="components/UserTable.tsx">Filter Kategori</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="bb1d369c-37b2-4bbf-9d05-92c5d279bd2b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Audio Categories */}
              <div className="border rounded-md p-3" data-unique-id="1976f1d7-5eae-4fa9-bbff-33066dc4707b" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="15282ee2-4018-469f-8fa6-be83f66acdc3" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="58348107-dae3-4c00-9ad5-4005f627a5e2" data-file-name="components/UserTable.tsx">Audio</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="c27eb22e-5c54-4418-b3b4-68f13b4528d7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="89c369a2-fba1-4d87-b9f7-d712cca90f01" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="af0ac198-9bb0-44d0-bd4e-efe74dfcc001" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="684bba2b-390a-4ea0-bd02-287ea288b414" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="7e756e70-9b91-4a18-a1d4-3fc807bdcaf3" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="a3b619a6-c162-41fb-ae1e-162f986f01d9" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* PDF Categories */}
              <div className="border rounded-md p-3" data-unique-id="734b6327-d88b-408a-9a25-e8b64fbf00ef" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="f4e7811e-1f81-453b-b0a7-eece186c4282" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b72f7edf-4cfa-4f06-9a9b-057545df8f15" data-file-name="components/UserTable.tsx">PDF</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="78720d25-e72c-4f56-8510-c8662db717ae" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => {
                const upperName = category.name.toUpperCase();
                return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
              }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="f41e66f8-e52b-4de8-872e-f72d257eecd0" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="718ebf3f-ea52-430e-8c17-477053342b2b" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="13e9ee9c-5523-4421-8b10-86a223d8601b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="c6e21665-cbe7-46a6-b4a2-05fdff9be586" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f9b52a17-f2a1-4e14-9e64-8885c0378341" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* Video Categories */}
              <div className="border rounded-md p-3" data-unique-id="d2ece552-d725-4afd-9b57-20d4d8c4394e" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="bb1e8cd1-3fab-4b19-9b41-e79143be4ae9" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b7f12d73-d3e9-4d7f-83f0-8215a901e060" data-file-name="components/UserTable.tsx">Video</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="a5b08920-232a-4498-94fb-a135a42eef2f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="6609c207-bd62-4701-b589-5468425c16a5" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="078a6cd7-64e9-4cd7-951d-13e30e8d9694" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="5489c9d1-9522-44e7-9fe4-d38a56db2be2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="dcf9f851-0205-41d1-a4a1-418e2f55a584" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="49b061f1-2170-4f8d-b2e8-0b940da26468" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="32c297d9-cfa3-4fdd-85ca-e3593d1ced0b" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="2afbb4b3-4c1f-4e25-91cd-cfaa423594c2" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="bfe03c47-90f5-41ff-a12d-746befcb5dc9" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="f5b3cf9e-83c8-40b6-8406-11e4554acfe5" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="e89cc085-9a3b-4ff3-9ed5-2b8e0b5b9b0e" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="1b9a6a65-3f7c-48b4-a2f0-e793093c8a94" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="fde18aca-2194-40dc-be9a-1c075d1d5e73" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="8ea56cf3-1e29-43fc-81f9-c33f1d40720a" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="2c7c8c5f-939f-40ec-9764-0263dd56d56e" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="64e2babe-a364-40a6-b843-bb2aef6bf66a" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="f1fb3106-fed9-49dd-a2c9-645d5b0ff9ae" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="b40fb8b6-f483-46bb-8000-cf1cfb963319" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="5cf5527c-7a6d-46be-a8e4-21438ec7f54e" data-file-name="components/UserTable.tsx">Filter Kategori</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="1d137c77-5659-4abd-8651-9e73a1be3f91" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="aa40b91f-02e1-44e1-b411-1cb262bcbff1" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
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
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="311af4da-2d60-4e62-aebb-da67285be5d2" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="1d3ade41-f163-453e-8d84-d6edf2aeb4eb" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="c2f78dce-3c2f-4801-9a2b-21cd2c40f70c" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="31d24601-6f62-42d5-b4e5-812c314b9663" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="8851e1f0-b31c-4c72-bc20-4ebadfb70ad6" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="ddf205fa-2b9f-4f36-bf36-8f8b6dd18102" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="a296109f-9d36-4f8c-bf46-7210d1f697da" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="410da87b-bd9f-4b9d-9a35-5011747a19c2" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="70cae190-bf4f-4efd-9fe1-1890a7a2716a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="a8a6d16c-6356-4f04-b6ef-c7e58281b5fd" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="b1434550-1248-4160-b5d9-011442248aa1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="4e1e2064-bb34-4c4c-a60d-a278eac10ab0" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ffd3b3bc-91d9-494f-b4eb-ef2ca8af5605" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="eb983359-2292-4d32-a53f-41601ce47935" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="972aae03-f79c-4cb7-9763-e1376f8ae015" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="381095e6-2657-4a9f-bc1d-882b39adc2d8" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="5082440c-24f9-42d8-8ce7-b3d32497ec7e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="f04b7c4e-d96b-4acb-b219-c0e5c53e9ef7" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4fe685e0-c5cc-4fd9-9059-7233547fab14" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="8077c971-b245-4398-81d5-534e1d3be64b" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="507a6a9d-4a86-4df2-b746-524a4d7e39ed" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="147fd048-e1d9-4266-b890-79dc3f476936" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="29ed7180-4825-4781-b20d-80de9c6178dc" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="84188d1f-7f29-4454-b955-5b92d5901f19" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e306943c-04cd-487f-aa29-ea6b562cf9e1" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="56e4211c-8c4e-4d95-8b7c-e5ef1c631ec8" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="5b3866e2-f806-4289-9051-701b4aae78c8" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="15f128bc-eeb5-48a0-8e36-647b582f7d8d" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="6aca993b-a3da-4b3b-82ab-6105f71e08bc" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="8d68f28a-4dcf-4c0c-9b11-794b1bf8ba31" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="af50350f-4c50-412d-8e9c-719b3d4a2211" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="5af3e749-4721-43d8-80f5-0885281c9e0f" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="f0ea48f6-ce9d-40a0-93a4-3e706f70e669" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="94d9ce62-44db-4bf1-95be-f95d57ecd045" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="fe3a1c8f-3538-4887-8f30-bfa5a06a7dc4" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="70805a53-89dd-47d6-8c76-bcab21925e7e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="9436ddd2-d535-4e33-8f49-37f571d51f33" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="d6fc93ea-6de5-4149-8d71-09edd50a757a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="1f90c77e-11cf-4aed-a06c-2f1632e9b171" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="ab3ba5fe-6dd5-4ba0-97ef-c77beae0650d" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="9583f5bf-2f21-47cb-b99a-6821f008ea0a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="79425121-3d44-4f0f-9c43-da7ad455e2ed" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="befda858-b53d-4f1f-a61a-c59a3d5b5f44" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="ca5bafae-4fcc-4cd2-8709-302ee72ffe08" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="555fe993-d450-43e4-9d17-48e64785d84b" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="7b691e93-5c24-4b94-9017-a59aad6a8f0a" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="7334daf0-ff91-4229-923e-3977a065f77f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="488795af-815a-4070-88b6-3790f00ae8ef" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="f60afebe-823b-4a95-8202-444fd02eb503" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="df00955d-d0c7-4758-95c7-9a5c8a7a40a4" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2c96f91d-bf8b-41cc-9147-0d0c88527ba6" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="7a03cca6-2d83-4870-a399-e1808931cddc" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="bac46bfe-7a9d-492a-ad30-1ba68a092414" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="6b24674f-cda2-4fd0-8240-59ecb5ee4bcc" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="c4d5ecb9-8e22-41e5-a8e4-e25df31a99b0" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="072920ec-5ef0-4c4f-bec4-e894e9b17083" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d1bd6b83-8722-4817-9798-df7e9e3f0895" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="65024d63-cc85-45f9-82d1-bd9e9df7e9d4" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="459c4889-7aeb-4bae-984c-dc563c8bf135" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="848b2962-40e9-4275-9115-539c8e11db00" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="7b7d28d5-ea7b-424a-aae9-28fbc9e54168" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="b8a48d9f-e46b-4374-ae5e-df077839ac6c" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="4a9f1148-3b01-40c7-b219-37984318dccf" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="33c90a49-6fe1-4d01-bdf9-85f7c547b88e" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="268fa386-1780-415c-8e28-54ff531b7c80" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="099267c6-0181-4540-b790-441540efdedf" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="1aa07559-a11f-4f1c-a900-4d4bfde5a41d" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="2136b04d-091f-4d1b-bfe2-9cb40c0976e7" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="417263a2-8406-4996-be4f-4d411a7e2d6c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="e8da3e82-9aa0-44eb-a5ee-7204e6f624ff" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="ac148182-5954-45ec-9aa7-437ff180a124" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="86db62ca-ebde-4ba3-8f5a-d508c1b0d5f3" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="f60d5d0f-dc8d-4fa0-9939-a71255774c76" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="de94d7e3-43a9-4fd1-953c-9791da9505fd" data-file-name="components/UserTable.tsx">
              <span data-unique-id="3d2e792d-14bd-4810-9491-d60bd888624d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="4714e046-f14b-49b3-b4c4-52f9c0ff3a5e" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}