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
  return <div className="space-y-4" data-unique-id="b203ce6f-67dd-4abd-a3c9-9e6a07f35b83" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="041faf84-9d12-4676-a811-faaa6a8a7a9f" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="bc767476-b414-4f51-8052-1f349b7a3386" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e32c70aa-9c00-48dc-8320-244f349e4774" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="5872b40c-ba8b-4e04-90d5-5afbff0d158a" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="669db9eb-6a48-4fc9-8bfb-d370259fc7fe" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="ff091979-e448-4643-aab7-78ad4d949c73" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="7ce7287b-2189-4132-a461-bd639e7280a6" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="1f2326fc-471a-4ef5-be0e-a52fb0d108fe" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ce32535a-4e71-46d1-a380-ba029d29bd56" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="482f60ce-c6fb-4ace-9aef-384c32a286d6" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="2b3e51df-b962-487d-b248-47be77f13535" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="f4c8f092-282b-46b6-80c0-a92043d7dec1" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="43ca0203-7c75-48b7-bed5-61ce2104244d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="7f80ab15-17ea-40fb-8d99-a86ccdd057f8" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="eb558322-7443-4d32-97c1-4e22fdf908c9" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="fe20b40b-0878-4457-be96-6e8b70a53018" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="12b3e27a-1d8d-4692-bbef-902b583971e6" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="46f24c43-0ea9-414e-bfc0-c659c30e815f" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="8e24dd63-56a3-45e4-babd-69b3e4dbd7a1" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="f76443ab-ee13-46bb-9f87-ecc9d3680a19" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="25c0ecc8-25e7-464c-93dc-86d666a454d6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="172fed18-419c-4cee-8670-6f4977e42cd7" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="bb475d08-ef4c-43ce-84cf-a2d94b07b82c" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="698decd8-50d8-4645-a161-b17faab35224" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="212bca89-096f-4d14-96ef-86b3bcfb0136" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="a2f1c9f8-c290-4e24-bde4-f9e4e1086baa" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="286aa62d-04b3-45a7-bed3-bfa3edd992cb" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="3d15a0ed-b2e5-4d6b-b346-cdd0fb940bab" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="bf6c440c-c228-42eb-9142-840474688553" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="bbad44c4-3fae-4a22-8d1f-eba788f2571b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-lg font-medium mb-4" data-unique-id="a2f3c9a5-4136-4a16-8d7a-6f95a1d9f983" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3815afe0-759a-4806-8f4a-48a2e678bf1b" data-file-name="components/UserTable.tsx">Tambah Pengguna Baru</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="d65f4437-86c4-4474-bb18-5d4f04f8a03c" data-file-name="components/UserTable.tsx">
            <div data-unique-id="e512500a-8d9f-46bc-93ff-9c8b1430be96" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="5f44e8bf-3a42-4572-9679-eaa29e269e55" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="0c3f5760-ec0b-4214-9bc6-5c1b41fc9d5a" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="9cad244f-2e0a-400e-9c59-bdb60ab4462a" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="0254deb0-7700-4b07-9134-c014841f7312" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="a901b79c-8ce0-4d50-a0cf-9e3829215cf0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="090becf0-94e3-407d-9dd8-966e3bd58417" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="a94c92a5-78ee-45a8-b407-689bbdcdb98a" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="caebce64-e8e6-4d65-9c5b-bf6c9ecb6656" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="05dd2702-ccbe-4dd8-9529-caec7848536b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="917695d0-0b29-4ce9-98dd-800cb5a3e11d" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="fc5b218b-7d4e-47e9-9426-4df88106320e" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="dee8467f-975c-4f30-87ad-0d3a91375e55" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="e5e35c2d-7fa0-4d40-8087-2557a5bd54c7" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="d918610d-23cd-42b1-abc5-c82d33004394" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="5bfe9b29-b6c6-4f23-bd68-aa2ade76ce37" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1792efcf-4a3f-48a9-832f-69d9347857a1" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="7689a3fe-ff4c-4098-8f41-f3b1833eec65" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="ca4b44a4-80ea-491f-83a7-ffa35cf5624a" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="5d883994-f446-4cda-a676-1f83df3de489" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="720c4aac-6b58-4a98-b18f-71b631468004" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="15030755-f4ff-400d-9a0a-a3242a48e163" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection - New Section */}
          <div className="mb-4" data-unique-id="1c0b4a42-6c5d-48d3-8fcc-ec5b538fa80c" data-file-name="components/UserTable.tsx">
            <h4 className="font-medium text-sm mb-2" data-unique-id="78e70ffc-74c9-4347-98c1-ab5e9c858168" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6985af4c-a236-4f1b-86bf-a49bb42f4534" data-file-name="components/UserTable.tsx">Filter Kategori</span></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="a458744f-3585-4aba-8f98-97b25c59d31d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Audio Categories */}
              <div className="border rounded-md p-3" data-unique-id="b9255a3d-ffe1-4e85-ae2d-1f58c69b246c" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="d3714ec2-7201-4f4e-b42c-b17197ceeb7e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="fe5d4c76-e312-4b63-8212-cfcc72e85483" data-file-name="components/UserTable.tsx">Audio</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="1c712657-b21b-4703-9ecf-e0d4ac1c2a4d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="65ad159d-cb6c-4cb1-b8d4-5417d5581527" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="a681e5ae-9d88-4cd5-9f3e-3f42eed04424" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="70b92d6b-41f3-4916-9bee-7f9c5abaeab4" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="64bd2b30-1e60-4f61-9031-bb14b21fe6d6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="4621565b-724f-44c8-9dd0-e90e77abcb9c" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* PDF Categories */}
              <div className="border rounded-md p-3" data-unique-id="b57a6ce9-4e3d-4888-b3ef-1f641cd99c91" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="42a1cea7-213c-4e33-89c1-a7f14c0ac55e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1eb358a6-e4fe-4dd5-81f2-c44fd87c1a12" data-file-name="components/UserTable.tsx">PDF</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="9248ef04-8e78-49b3-aa8a-dd0768777155" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => {
                const upperName = category.name.toUpperCase();
                return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
              }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="4dd68445-e044-4a5e-a456-4dc8637d3ba5" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="74f6f405-0715-4029-9da9-dfaadb80d485" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="1186ecc9-84b9-4f97-95ca-f380599590cb" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="bf8599f0-a1ae-4495-a701-ccaa16e138fe" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="4bb9aa3d-4313-4072-9637-2bfb552f6986" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
              
              {/* Video Categories */}
              <div className="border rounded-md p-3" data-unique-id="8bb2ad82-be75-4002-ade2-3061bfce0e7f" data-file-name="components/UserTable.tsx">
                <h5 className="font-medium mb-2 text-sm" data-unique-id="0007e1d5-34e9-4039-b0ce-cc87f62e2c80" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1d71ffb2-85c7-4332-9669-065b08336b46" data-file-name="components/UserTable.tsx">Video</span></h5>
                <div className="space-y-2 max-h-48 overflow-y-auto" data-unique-id="ac78ce50-3963-4b53-83c8-8ea9dd85b5cf" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                  {categories.filter(category => category.name.toUpperCase().startsWith('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-is-mapped="true" data-unique-id="ee8564db-bd8f-4198-9fd9-dfa477fe4d79" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary mr-2" data-is-mapped="true" data-unique-id="597449c4-e89b-4d05-9a22-f842fe486bc1" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm" data-is-mapped="true" data-unique-id="c0376ac3-e7de-4a9d-9cd2-d2a97361937a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                  {categories.length === 0 && <p className="text-sm text-muted-foreground" data-unique-id="78a1013e-bcf2-43b4-818d-1deea580d70f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="8d8dc749-8a30-4fd3-ab4f-fbf5b1afb6aa" data-file-name="components/UserTable.tsx">Tidak ada kategori</span></p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="ff402959-2970-44c0-ade9-238910532dfd" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="dfd90100-5cfb-4f5e-92cc-48d76ba1cedf" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e1f3ba2f-5d98-43c3-8dbb-3ae48852af87" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="487cf8d2-d903-4f6e-ab54-daf189166919" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="69af300b-ce70-49b4-8ce9-c3251f541619" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="e89800fa-036e-47bf-8c2d-11c09ea7e0e7" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="77ac296f-4184-448a-8eb6-e69024077b25" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="3565817f-9feb-4ff7-a563-c299f32f74ab" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="c72067cf-6e92-47f1-b6b2-a084b7126597" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="b11293b4-2ccf-4b1e-a761-1be4ff6b19ed" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="6a2c95cc-11bc-467e-aa80-51f34f8fab21" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="7bdd9fde-5e6b-494b-bcd3-b66ba1d923e5" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="32b35b2b-0f34-4350-91d7-ed838c32bffa" data-file-name="components/UserTable.tsx">Filter Kategori</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="608c0db0-6b4c-4587-90ea-d199baa235a7" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="da2e596c-f728-4592-99f2-517323d645cc" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
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
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="34835ce0-d967-4473-a18d-faadf2bb8585" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="99f40bee-9a5f-487a-9d66-377bce7438b7" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="46a2f627-0681-49a6-9d9d-38f2d510cf94" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="880ed2aa-11c3-4d24-b1dc-9819abfdda5b" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="974f3a66-b58b-41a2-9002-2c21f6332c9f" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="5a941f49-48e8-4515-b73b-722386934c65" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="0a67b52e-9809-4bb6-9313-750dcb49e05d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="6e91a55a-a445-4932-937c-1f38cc1ad867" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="257f8992-fa26-40a8-ac83-4691e7dcde41" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="bf9c0482-3287-4f5f-acfd-ae5d51f17dd8" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="60d6f068-5693-4107-830c-11270f1facee" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="c3bbbf4f-5a94-43d9-b875-ee642de3709e" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7acee17e-1f1d-42c4-b4f2-4963c6602ca8" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="d8174729-2701-4f2c-b25b-1470983ac295" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="ffa6520e-8180-48ad-918f-f810d476f73c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="75a71824-55e7-40ed-8fa4-0b89a58d8b06" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="4b7389d9-4e76-4089-bbd7-b4050851cc98" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="ad7cb461-d1a6-46c9-a07e-cabcceee5da9" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="773ee295-0750-4872-8dcc-84c1a93e58d1" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="2eea5fc3-d9c7-4b11-bc5c-877797596ae4" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="8ced2273-815a-43c1-8648-74986b5b3f1e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="55aabfea-27d0-41e1-a423-e32a02008eee" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="5754f84d-eb4f-4066-8db4-001cb6cffd66" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="ad1438e5-63f9-4aba-8aff-ef3fac5ee8f2" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6dcdc0eb-f9ab-4735-bdb1-cbfa03353bfb" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="1d6cb620-06d4-46e9-a33b-b6f938700f0f" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="fb5c2e8d-2e03-418c-99ae-071d0785ecc2" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="2c9cc99b-e966-43dd-ae90-11e9d0eb3947" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="bb7906e7-b39e-45c2-a824-cd62b0100a0b" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="ce586b39-12b3-4f40-8365-72fbfb49036e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="d8cfb8a9-c777-40f2-b2e3-f407343985d1" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="04aec20d-6a93-4a15-85dd-563b137c98f1" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="5a7ee547-8d87-442d-a0e8-57447474ebf8" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="246ff071-2902-4ed8-b752-992c3d7a3221" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="f3a981d2-f200-46fa-80b6-35ac16e558c4" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="8373d792-7e35-43f1-a218-06519eddac30" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="b537bd45-b1bf-48cc-b003-fb793c797892" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="7f3e465a-414a-452d-9aab-f7f69d083a8e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="d9945d8f-7bfe-4de8-ac32-aa8d3388c90b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="1964dc29-cc41-4788-a5b1-7d67d4e13b01" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="43013ae2-15ea-44f9-b68c-67d5f5104e58" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="a3f61301-89bd-432b-b818-23b58f3857f6" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="1ae6ca29-010d-4933-8861-92bef8604e0b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="6f157d08-c6d2-4e2d-9de3-7403d646e1f2" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f6f04e2b-27de-4f58-9f7f-aebfe3655d44" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="76252c27-09a1-4dec-b4ea-f69e952ef4d1" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="983f2db3-48e3-493e-8fc7-72ea098986e8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="0b3000c5-cb91-443e-87f3-3e0cf5e40ea6" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="aa1ed72a-5726-4b73-99e4-4726ba3ebe2d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="26e8bb32-7777-4734-9638-ce7964291869" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7edb2dc0-0532-43e0-abe2-14a3db15f52b" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="66c15176-241c-4cd5-b838-75e827b66fb2" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="c3d30df5-c94c-4578-a5ec-fdfe7344638c" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="5c77743b-2425-4122-999e-ead053a7b6b6" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="35925cb0-00eb-48ed-acff-2e2db5486ec6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="7168e756-4797-4601-92bd-3a432b143566" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4e70d271-59d2-4e77-b2ce-7717eada4d68" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="5ff1cdd5-dbde-4973-9a74-9c21ebea50cf" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="7f180b1a-41af-425e-8425-321617ea7a1c" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="e559a91e-b304-4195-b675-fc37686c9763" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="f9e14b3f-409b-49e1-9348-d7c43f71019d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="8b83a5a7-5c4d-492d-be5e-9bb165c6a145" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="17b96f75-0e7f-4798-8b92-e7245ae3791d" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="294de831-5c42-4b0b-997d-b3ab8cbe1cea" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="c4b2bb31-4890-4d92-949e-cb91cda10af2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="d841b52f-e6f0-4e56-9f5d-42e108ebb535" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="df39efef-15f1-443f-a0a7-23d9634c12be" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="55dad49c-d84b-4954-bda0-76fa765abf24" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="52b6129f-659b-4f29-90cc-0fa36c552620" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="3c8e9382-cb92-4e1c-b0b1-9ebd5074a6b2" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="793e624f-cdf6-4787-9ecd-6b503ec51de5" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="5a0db13c-fe91-4174-a3a3-93d88c0808e5" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="30f025fe-363d-4189-8dee-a2db5ade6dca" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="bea3963f-c857-4d57-b6d5-d67a1f7313e4" data-file-name="components/UserTable.tsx">
              <span data-unique-id="3e0adaa1-e2e6-410e-b232-a5159e6354aa" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="8bf97cbf-efec-4e9f-8389-7eb059952f19" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}