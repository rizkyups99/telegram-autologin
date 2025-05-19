"use client";

import { User } from "@/db/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
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

export default function UserTable({ users: initialUsers }: UserTableProps) {
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
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
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
      setCopiedCodes(prev => ({ ...prev, [id]: true }));
      
      setTimeout(() => {
        setCopiedCodes(prev => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
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
          return { ...prev, [fieldName]: [...currentIds, categoryId] };
        }
      } else {
        // Remove the category ID if it's in the array
        return { ...prev, [fieldName]: currentIds.filter(id => id !== categoryId) };
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...formData
        }),
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
        method: "DELETE",
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
    const matchesSearch = searchQuery ? 
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
       (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))) : 
      true;
    
    const matchesActive = filterActive !== null ? 
      user.isActive === filterActive : 
      true;
    
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
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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

  return (
    <div className="space-y-4">
      {/* Items per page and count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} users
        </p>
        <div className="flex items-center gap-2">
          <Label htmlFor="itemsPerPage" className="text-sm">Tampilkan:</Label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Cari username atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterActive === true ? "default" : "outline"} 
            onClick={() => setFilterActive(filterActive === true ? null : true)}
            className="flex-1 sm:flex-none"
          >
            Aktif
          </Button>
          <Button 
            variant={filterActive === false ? "default" : "outline"} 
            onClick={() => setFilterActive(filterActive === false ? null : false)}
            className="flex-1 sm:flex-none"
          >
            Non-aktif
          </Button>
          <Button 
            onClick={() => setIsCreating(true)} 
            className="flex items-center gap-2 flex-1 sm:flex-none"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Pengguna</span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && (
        <div className={`p-3 rounded-md flex items-center ${
          statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span>{statusMessage.message}</span>
        </div>
      )}
      
      {isCreating && (
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium mb-4">Tambah Pengguna Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kode Akses</label>
              <div className="flex gap-2">
                <Input
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode akses"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomAccessCode}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Jika kosong, akan menggunakan username sebagai kode akses
              </p>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>Aktif</span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection - New Section */}
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Filter Kategori</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Audio Categories */}
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2 text-sm">Audio</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories
                    .filter(category => category.name.toUpperCase().startsWith('AUDIO'))
                    .map((category) => (
                      <div key={`audio-${category.id}`} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`audio-cat-${category.id}`}
                          checked={formData.audioCategoryIds.includes(category.id)}
                          onChange={(e) => handleCategoryChange('audio', category.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                        />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">Tidak ada kategori</p>
                  )}
                </div>
              </div>
              
              {/* PDF Categories */}
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2 text-sm">PDF</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories
                    .filter(category => {
                      const upperName = category.name.toUpperCase();
                      return upperName.startsWith('EBOOK') || upperName.startsWith('PDF');
                    })
                    .map((category) => (
                      <div key={`pdf-${category.id}`} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`pdf-cat-${category.id}`}
                          checked={formData.pdfCategoryIds.includes(category.id)}
                          onChange={(e) => handleCategoryChange('pdf', category.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                        />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">Tidak ada kategori</p>
                  )}
                </div>
              </div>
              
              {/* Video Categories */}
              <div className="border rounded-md p-3">
                <h5 className="font-medium mb-2 text-sm">Video</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories
                    .filter(category => category.name.toUpperCase().startsWith('VIDEO'))
                    .map((category) => (
                      <div key={`video-${category.id}`} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`video-cat-${category.id}`}
                          checked={formData.videoCategoryIds.includes(category.id)}
                          onChange={(e) => handleCategoryChange('video', category.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                        />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">Tidak ada kategori</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={cancelEditing}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button 
              onClick={createUser}
              disabled={!formData.username || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Kode Akses</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Filter Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchQuery || filterActive !== null ? 
                    "Tidak ada pengguna yang sesuai dengan filter" : 
                    "Belum ada pengguna yang terdaftar"}
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(currentItems) && currentItems.map((user) => (
                <TableRow key={user.id}>
                  {editingUser === user.id ? (
                    <>
                      <TableCell>
                        <Input
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Input
                            name="accessCode"
                            value={formData.accessCode}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generateRandomAccessCode}
                            title="Generate random code"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.audioCategoryIds.length} Audio
                            </span>
                          )}
                      
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.pdfCategoryIds.length} PDF
                            </span>
                          )}
                      
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {user.videoCategoryIds.length} Video
                            </span>
                          )}
                      
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && 
                           (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && 
                           (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt 
                          ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) 
                          : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>Aktif</span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingUser(null)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateUser(user.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && (
                            <button
                              onClick={() => copyAccessCode(user.id, user.accessCode)}
                              className="text-muted-foreground hover:text-foreground focus:outline-none"
                              title="Copy access code"
                            >
                              {copiedCodes[user.id] ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.audioCategoryIds.length} Audio
                            </span>
                          )}
                      
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.pdfCategoryIds.length} PDF
                            </span>
                          )}
                      
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {user.videoCategoryIds.length} Video
                            </span>
                          )}
                      
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && 
                           (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && 
                           (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startEditing(user)}
                            disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null}
                            title="Edit User"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? (
                            <div className="flex space-x-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowDeleteConfirmation(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : "Ya"}
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowDeleteConfirmation(user.id)}
                              disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null}
                              className="text-red-500 hover:text-red-700"
                              title="Hapus User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            {pageNumbers.map(number => (
              <Button
                key={number}
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(number)}
              >
                {number}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
