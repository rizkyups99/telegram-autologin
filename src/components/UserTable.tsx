"use client";

import { User } from "@/db/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { formatDistanceToNow, format } from "date-fns";
import { Copy, Check, Pencil, Trash2, Plus, X, Save, Filter, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
interface Category {
  id: number;
  name: string;
  filter?: string;
}
interface UserWithAccess extends Omit<User, 'createdAt'> {
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
  audioCloudCategoryIds?: number[];
  pdfCloudCategoryIds?: number[];
  fileCloudCategoryIds?: number[];
  createdAt?: string;
  created_at?: string;
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
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Generate month options
  const monthOptions = [{
    value: "",
    label: "Semua Bulan"
  }, {
    value: "1",
    label: "Januari"
  }, {
    value: "2",
    label: "Februari"
  }, {
    value: "3",
    label: "Maret"
  }, {
    value: "4",
    label: "April"
  }, {
    value: "5",
    label: "Mei"
  }, {
    value: "6",
    label: "Juni"
  }, {
    value: "7",
    label: "Juli"
  }, {
    value: "8",
    label: "Agustus"
  }, {
    value: "9",
    label: "September"
  }, {
    value: "10",
    label: "Oktober"
  }, {
    value: "11",
    label: "November"
  }, {
    value: "12",
    label: "Desember"
  }];

  // Generate year options (current year + 5 years forward)
  const currentYear = new Date().getFullYear();
  const yearOptions = [{
    value: "",
    label: "Semua Tahun"
  }, ...Array.from({
    length: 6
  }, (_, i) => {
    const year = currentYear + i;
    return {
      value: year.toString(),
      label: year.toString()
    };
  })];

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
  const formatRegistrationMonth = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear().toString().slice(-2);
      return `${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };
  return <div className="space-y-4" data-unique-id="19947e7c-67f8-4071-9307-ea56970f99be" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
      {/* Items per page and count */}
      <div className="flex justify-between items-center" data-unique-id="4eef4239-2e2f-4c7e-b50e-b3888ab53707" data-file-name="components/UserTable.tsx">
        <p className="text-sm text-muted-foreground" data-unique-id="5e409f05-3bd0-4f2d-9ac2-2f048c5391af" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="003ca919-7beb-4d28-8de8-e3aadcff0b17" data-file-name="components/UserTable.tsx">
          Showing </span>{indexOfFirstItem + 1}<span className="editable-text" data-unique-id="c9151708-ecb6-4096-a29e-7e52809e0715" data-file-name="components/UserTable.tsx"> to </span>{Math.min(indexOfLastItem, totalItems)}<span className="editable-text" data-unique-id="a9adea3e-34af-44b4-a680-b813c28ccca5" data-file-name="components/UserTable.tsx"> of </span>{totalItems}<span className="editable-text" data-unique-id="345e4980-6d5d-440e-a7bc-5275be6fd7b1" data-file-name="components/UserTable.tsx"> users
        </span></p>
        <div className="flex items-center gap-2" data-unique-id="3b2edc1a-ac85-4ad2-8c52-d40b7bba779a" data-file-name="components/UserTable.tsx">
          <Label htmlFor="itemsPerPage" className="text-sm" data-unique-id="08fd84a3-cb66-4484-9783-60a731ae656a" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="fa7942aa-b269-447d-a77c-9da622cd360b" data-file-name="components/UserTable.tsx">Tampilkan:</span></Label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="0b747f04-b1c0-442f-871a-0c21874dd42e" data-file-name="components/UserTable.tsx">
            <option value={10} data-unique-id="484f6960-6129-490f-8827-0ada9b01f5a4" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="93261ab7-c4ea-4bee-8a6f-a5b4821d4f02" data-file-name="components/UserTable.tsx">10</span></option>
            <option value={50} data-unique-id="b1eec9fe-a062-4da3-9bd7-861d0035f5ef" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="780ad75f-1101-43f8-a6b3-df9ce08a859f" data-file-name="components/UserTable.tsx">50</span></option>
            <option value={100} data-unique-id="e178e1b5-12b2-4200-8f86-fffbd5214131" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3e9f71a8-1d6c-479a-b455-313023012cf9" data-file-name="components/UserTable.tsx">100</span></option>
          </select>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4" data-unique-id="ac1ad384-6213-4588-8e3d-927722082acf" data-file-name="components/UserTable.tsx">
        <div className="flex-grow" data-unique-id="06cf461d-e590-40e6-91a2-b7f0fa88a78a" data-file-name="components/UserTable.tsx">
          <Input placeholder="Cari username atau nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" data-unique-id="0880ba95-453c-40d3-bee7-babaae1efb49" data-file-name="components/UserTable.tsx" />
        </div>
        <div className="flex gap-2" data-unique-id="961b554e-e084-4eec-affe-2258b9c11818" data-file-name="components/UserTable.tsx">
          <Button variant={filterActive === true ? "default" : "outline"} onClick={() => setFilterActive(filterActive === true ? null : true)} className="flex-1 sm:flex-none" data-unique-id="13ddaf76-93f3-454d-a690-e2682861141d" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="96249036-63e0-401e-90fc-b260c7fa2bec" data-file-name="components/UserTable.tsx">
            Aktif
          </span></Button>
          <Button variant={filterActive === false ? "default" : "outline"} onClick={() => setFilterActive(filterActive === false ? null : false)} className="flex-1 sm:flex-none" data-unique-id="9a46f46b-4449-4e61-ae55-2761ea75c93e" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e83aee11-f323-47e9-b605-bc15ecd763b1" data-file-name="components/UserTable.tsx">
            Non-aktif
          </span></Button>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 flex-1 sm:flex-none" disabled={isCreating} data-unique-id="0fe06063-205a-4278-8ef4-7a14c75984a0" data-file-name="components/UserTable.tsx">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline" data-unique-id="1d201cab-e18b-449b-a922-92653ec2c3cd" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3f7d4ef7-1976-4b0f-921f-902862a9a50c" data-file-name="components/UserTable.tsx">Tambah Pengguna</span></span>
          </Button>
        </div>
      </div>
      
      {/* Status messages */}
      {statusMessage && <div className={`p-3 rounded-md flex items-center ${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} data-unique-id="05adf9a5-42bf-4db5-b4e0-ae40a30ae1c8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          <span data-unique-id="adeb43a5-5c49-4264-91ef-c079d52fe391" data-file-name="components/UserTable.tsx" data-dynamic-text="true">{statusMessage.message}</span>
        </div>}
      
      {isCreating && <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl shadow-sm mb-6" data-unique-id="cee270d8-228a-44a1-9536-a3c3cc840521" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2" data-unique-id="a5383347-dfb6-4184-ad03-5a65dd747b4b" data-file-name="components/UserTable.tsx">
            <Plus className="h-5 w-5" /><span className="editable-text" data-unique-id="a56a76ea-36a2-4d94-b027-9cd6e15f56c4" data-file-name="components/UserTable.tsx">
            Tambah Pengguna Baru
          </span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-unique-id="1a28493b-83bc-4a2e-adb7-2b542a3ecc41" data-file-name="components/UserTable.tsx">
            <div data-unique-id="f6e35e80-1a7d-44a2-ae5d-e7ba29aae5dd" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="6a6ea4dc-bfdf-424b-9a29-2a7b03ba8bf0" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="e264b715-d39d-41a1-bddf-deb385087b28" data-file-name="components/UserTable.tsx">Username</span></label>
              <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Masukkan username" data-unique-id="70b5e5c9-af7f-4e82-9a89-e4dd7f67233a" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="98a7b35e-1c9a-4995-b561-f4100afb1e5c" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="1d850cc3-2847-4ba0-9a13-fc46ea5ec39f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1cefc2ed-be89-4f23-a187-a5728d021591" data-file-name="components/UserTable.tsx">Nama</span></label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama" data-unique-id="f2118005-7f3d-4fc5-8976-458da782f2af" data-file-name="components/UserTable.tsx" />
            </div>
            <div data-unique-id="348333a6-806b-48e2-aab9-1bcfa3169116" data-file-name="components/UserTable.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="be6ffbf3-58e2-426f-a926-b0ea5bb570a1" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="36f33d9f-7bee-45cf-893a-e532a35e7e8d" data-file-name="components/UserTable.tsx">Kode Akses</span></label>
              <div className="flex gap-2" data-unique-id="aa632cb1-2c54-49a3-bf8d-57b026e71251" data-file-name="components/UserTable.tsx">
                <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Masukkan kode akses" data-unique-id="24514165-acab-490d-9fdd-f8b8abbaa630" data-file-name="components/UserTable.tsx" />
                <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="a55e592d-285e-436d-9cd8-24fc7c52b5e1" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="eec7c8ca-ca50-43d6-8dbc-d9bfd181ba51" data-file-name="components/UserTable.tsx">
                  Generate
                </span></Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="b41600e5-0136-49e3-8685-9c13a0f2697b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="7a4cff9e-45d4-4188-b236-3a7f7420e79e" data-file-name="components/UserTable.tsx">
                Jika kosong, akan menggunakan username sebagai kode akses
              </span></p>
            </div>
            <div className="flex items-center" data-unique-id="022499dc-d8d8-4532-840f-8545758b544b" data-file-name="components/UserTable.tsx">
              <label className="flex items-center space-x-2 cursor-pointer" data-unique-id="ec943c1d-2d62-4c02-b635-cee3c711d348" data-file-name="components/UserTable.tsx">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="8a3ecb4f-c952-40ea-bd36-56bb9d68d252" data-file-name="components/UserTable.tsx" />
                <span data-unique-id="f787022d-f3e3-4053-ac28-703593368028" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="ae0b2b9a-d483-4933-968b-4349ae057748" data-file-name="components/UserTable.tsx">Aktif</span></span>
              </label>
            </div>
          </div>
          
          {/* Category Access Selection */}
          <div className="mb-6" data-unique-id="1f1d4c2e-4871-4089-915f-50f3b5508e70" data-file-name="components/UserTable.tsx">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2" data-unique-id="101335cb-8f93-445c-9f96-2ca1b7ad79b9" data-file-name="components/UserTable.tsx">
              <Filter className="h-5 w-5" /><span className="editable-text" data-unique-id="b4ed17c0-50bd-4ab6-95bd-2ea5e859a020" data-file-name="components/UserTable.tsx">
              Filter Kategori
            </span></h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="d95e58a1-85ef-47fa-a679-fef1f1c1c040" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {/* Regular Categories */}
              <div className="space-y-6" data-unique-id="42d1ed2a-70d6-490f-a040-ee5f30a9e207" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                <h5 className="font-semibold text-gray-700 text-base border-b border-gray-200 pb-2" data-unique-id="f13082a5-e64c-442e-8cb6-1904a0da4557" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="1c68b5c1-0e29-4fdc-ae69-517ed6d6e4b1" data-file-name="components/UserTable.tsx">
                  Kategori Reguler
                </span></h5>
                
                {/* Audio Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="4ebed29e-1a61-4879-98d7-7764460d6fe1" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-orange-700 flex items-center gap-2" data-unique-id="ce06cc2f-a7cc-446a-8141-3ba93ab9d0bb" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" data-unique-id="7213ae96-b81b-4a7d-8801-40ef0d7db79c" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="e5798a60-ae3b-44de-836f-fd282c76c059" data-file-name="components/UserTable.tsx">
                    Audio
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="a8dce322-2d55-446f-9ad8-28f350b9978e" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).map(category => <div key={`audio-${category.id}`} className="flex items-center" data-unique-id="6772a11d-c157-4222-964a-2ff2a034a878" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cat-${category.id}`} checked={formData.audioCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audio', category.id, e.target.checked)} className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-2" data-unique-id="11d37d1c-29ac-479f-9ec6-b98b5edba3d2" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="f8640b24-b2ab-4e56-821a-d3e9f1937327" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="3ee7978b-052c-47e0-a6ee-5d7cff05713c" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="b4355f5e-251d-4604-b6e9-020f5ee3647e" data-file-name="components/UserTable.tsx">Tidak ada kategori audio</span></p>}
                  </div>
                </div>
                
                {/* PDF Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="e56cabf4-e57c-4733-909e-940206a786c2" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-green-700 flex items-center gap-2" data-unique-id="202452e5-945b-4ce1-887b-2d88e3b1e545" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-green-500 rounded-full" data-unique-id="f80819be-37a1-4c7a-9594-c1116e4041c1" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="895e9271-e6ac-4f1a-b88c-ca311c463f45" data-file-name="components/UserTable.tsx">
                    PDF
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="024b5900-419e-4e14-92ce-e73d538e57b2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('EBOOK') || upperName.includes('PDF');
                }).map(category => <div key={`pdf-${category.id}`} className="flex items-center" data-unique-id="d21a707d-3716-4388-bc5f-53e14ee77d0e" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cat-${category.id}`} checked={formData.pdfCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdf', category.id, e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2" data-unique-id="ddf6b522-18f4-43ae-be91-6fdd8ce19325" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="5f110c3a-0a55-470f-a18b-7bb7e35d3a2b" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('EBOOK') || upperName.includes('PDF');
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="36e4ee9c-7b7e-4263-9956-49ee68b14d0b" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="8ce58071-1078-42e7-bee9-d771472c2675" data-file-name="components/UserTable.tsx">Tidak ada kategori PDF</span></p>}
                  </div>
                </div>
                
                {/* Video Categories */}
                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm" data-unique-id="dd36d628-0d88-4b64-b8cc-0ef876cc50b4" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-purple-700 flex items-center gap-2" data-unique-id="6cb8a193-088f-4291-82de-f0389a4dfa5b" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" data-unique-id="42cd96a6-3040-4799-8eac-bf26e59caa16" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="6dd2ccec-cd00-4a93-98e1-832e2cb23428" data-file-name="components/UserTable.tsx">
                    Video
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="6c0ce3a6-68f5-45f4-a634-4688d3cfcba9" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('VIDEO')).map(category => <div key={`video-${category.id}`} className="flex items-center" data-unique-id="3fda5f9d-9e38-43c9-be8a-5a3d0a8da7ed" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`video-cat-${category.id}`} checked={formData.videoCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('video', category.id, e.target.checked)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2" data-unique-id="dd59a98e-14ce-4777-a51b-2694f76019f4" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`video-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="68069efb-c6bf-499d-9d03-13145a4f62a1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.regularCategories.filter(category => category.name.toUpperCase().includes('VIDEO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="59fe1fb8-faf7-478b-8970-c6f3be6c7dc7" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="9ad6cfc5-2e5d-4cc1-a3b6-be0d7455b56b" data-file-name="components/UserTable.tsx">Tidak ada kategori video</span></p>}
                  </div>
                </div>
              </div>
              
              {/* Cloud Categories */}
              <div className="space-y-6" data-unique-id="75a893c9-5956-47cd-8ca0-b37f7882c722" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                <h5 className="font-semibold text-gray-700 text-base border-b border-gray-200 pb-2" data-unique-id="fefb3255-be3c-44f0-999b-11cbbfa6d09f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="d1eab91c-0dc8-48f9-b14f-46bdb95f84e6" data-file-name="components/UserTable.tsx">
                  Filter Kategori Cloud
                </span></h5>
                
                {/* Audio Cloud Categories */}
                <div className="border border-blue-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm" data-unique-id="da7a494f-7866-4991-b9ca-a4b578e5ff25" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-blue-700 flex items-center gap-2" data-unique-id="958e10d4-dd12-4ad3-9bde-8ef861a34b36" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" data-unique-id="627b8919-f9f1-4047-b81e-bfd8799528f2" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="8e8c9d12-d963-4495-b2ff-d360adab7f06" data-file-name="components/UserTable.tsx">
                    Audio Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="e157232e-d434-46d7-a0cd-846ead96fbae" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).map(category => <div key={`audio-cloud-${category.id}`} className="flex items-center" data-unique-id="4aed2515-febb-4b01-9f72-1a7bcad59032" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`audio-cloud-cat-${category.id}`} checked={formData.audioCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('audioCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" data-unique-id="97301f4c-4920-4a90-bed5-8502d065a128" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`audio-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="2bc72050-5498-4e3d-802c-e0f50e079c47" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => category.name.toUpperCase().includes('AUDIO')).length === 0 && <p className="text-sm text-gray-500" data-unique-id="40ef0663-e9c8-41b7-87ca-a6bd35744f26" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="53829ec7-2640-4faa-b687-29bcd3bbb812" data-file-name="components/UserTable.tsx">Tidak ada kategori audio cloud</span></p>}
                  </div>
                </div>
                
                {/* PDF Cloud Categories */}
                <div className="border border-red-200 rounded-lg p-4 bg-gradient-to-br from-red-50 to-pink-50 shadow-sm" data-unique-id="8a30a1a7-b0ac-4144-bac2-324cf76275d2" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-red-700 flex items-center gap-2" data-unique-id="4b41dd43-4f28-4a34-a44d-87e8a50ee7c4" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-red-500 rounded-full" data-unique-id="02024430-f216-48c6-83f0-7b0edf2c0e84" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="25d7810f-341b-4eb0-89d1-bbf5d21c4e03" data-file-name="components/UserTable.tsx">
                    PDF Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="b6f165d4-9380-47fd-8a66-22817edb21ab" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('PDF') || upperName.includes('EBOOK');
                }).map(category => <div key={`pdf-cloud-${category.id}`} className="flex items-center" data-unique-id="492fca70-1bfe-4e9d-9960-67939875abfe" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`pdf-cloud-cat-${category.id}`} checked={formData.pdfCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('pdfCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" data-unique-id="56fc25b0-4837-4145-aa67-f5f39cfd4611" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`pdf-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="bd5ff31b-0c50-455d-868f-7f8cc77fa31f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => {
                  const upperName = category.name.toUpperCase();
                  return upperName.includes('PDF') || upperName.includes('EBOOK');
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="bbb1465d-8375-4446-94f3-d1905002a2b6" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="734b2e16-0a7f-4587-b836-2d7cffc93208" data-file-name="components/UserTable.tsx">Tidak ada kategori PDF cloud</span></p>}
                  </div>
                </div>
                
                {/* File Cloud Categories */}
                <div className="border border-teal-200 rounded-lg p-4 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm" data-unique-id="51a463cc-d9f5-4889-a50e-5d2b8cb0ce22" data-file-name="components/UserTable.tsx">
                  <h6 className="font-medium mb-3 text-sm text-teal-700 flex items-center gap-2" data-unique-id="ea3963d2-4652-4211-ab55-4c810795a445" data-file-name="components/UserTable.tsx">
                    <div className="w-3 h-3 bg-teal-500 rounded-full" data-unique-id="30c04777-554c-4aeb-acad-3a4d98e12ecb" data-file-name="components/UserTable.tsx"></div><span className="editable-text" data-unique-id="b591dc7f-092a-4a3a-a8e6-89198e035df3" data-file-name="components/UserTable.tsx">
                    File Cloud
                  </span></h6>
                  <div className="space-y-2 max-h-32 overflow-y-auto" data-unique-id="b4d31837-fcbe-4ff2-bbf2-3e4004adca90" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                    {categories.cloudCategories.filter(category => {
                  const filter = category.filter?.toLowerCase();
                  return filter === 'file cloud' || filter === 'file_cloud';
                }).map(category => <div key={`file-cloud-${category.id}`} className="flex items-center" data-unique-id="2094c5ff-8ee3-4669-9a93-fa50226b0908" data-file-name="components/UserTable.tsx">
                        <input type="checkbox" id={`file-cloud-cat-${category.id}`} checked={formData.fileCloudCategoryIds.includes(category.id)} onChange={e => handleCategoryChange('fileCloud', category.id, e.target.checked)} className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-2" data-unique-id="27e08335-ca92-42d1-b104-7acfe46f47d3" data-file-name="components/UserTable.tsx" />
                        <label htmlFor={`file-cloud-cat-${category.id}`} className="text-sm text-gray-700 cursor-pointer" data-unique-id="3aed3e83-4d37-456e-82f4-cdfb791aa76f" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {category.name}
                        </label>
                      </div>)}
                    {categories.cloudCategories.filter(category => {
                  const filter = category.filter?.toLowerCase();
                  return filter === 'file cloud' || filter === 'file_cloud';
                }).length === 0 && <p className="text-sm text-gray-500" data-unique-id="ca9d7f97-fe55-440c-88ac-5b2a41097629" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="3a227a3a-715a-4687-8565-9a63d447f797" data-file-name="components/UserTable.tsx">Tidak ada kategori file cloud</span></p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2" data-unique-id="a0fc2894-d702-427e-9095-4fa68b77ae2a" data-file-name="components/UserTable.tsx">
            <Button variant="outline" onClick={cancelEditing} disabled={isLoading} data-unique-id="c7d90f08-1746-4fe9-8488-639804cb7a7b" data-file-name="components/UserTable.tsx">
              <X className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="8e8faf4b-a5b8-441f-9289-1c856224551e" data-file-name="components/UserTable.tsx">
              Batal
            </span></Button>
            <Button onClick={createUser} disabled={!formData.username || isLoading} data-unique-id="b5e36e78-ec6e-41a7-bcab-d3c03dfe5022" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
              {isLoading ? <span className="flex items-center" data-unique-id="57bae94d-4642-4161-9e24-159f569fe772" data-file-name="components/UserTable.tsx">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="cd7a8e06-ffdd-464b-bfd5-9ee5dacf9f3c" data-file-name="components/UserTable.tsx">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span className="editable-text" data-unique-id="f96de97c-dd6b-4cb4-9fd2-8f34e590dfd0" data-file-name="components/UserTable.tsx">
                  Menyimpan...
                </span></span> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>}
            </Button>
          </div>
        </div>}
      
      <div className="overflow-x-auto" data-unique-id="084918d2-92b8-477e-aead-1a5d4d201995" data-file-name="components/UserTable.tsx">
        <Table data-unique-id="e9219c25-a08a-4600-8c05-17ec069a0fda" data-file-name="components/UserTable.tsx">
          <TableHeader>
            <TableRow>
              <TableHead><span className="editable-text" data-unique-id="57c9b52a-1ccd-419b-8e7e-cbe75886b6fe" data-file-name="components/UserTable.tsx">Username</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="ceda8ebf-017a-4790-80c3-385a600a5e59" data-file-name="components/UserTable.tsx">Kode Akses</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="1008bb81-30e4-4e68-967b-38ec996a57da" data-file-name="components/UserTable.tsx">Nama</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="305aa647-ac7c-46bf-911e-052676eef9f7" data-file-name="components/UserTable.tsx">Kategori Regular</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="784a419c-c4b6-4cc6-83e4-50aab603d24d" data-file-name="components/UserTable.tsx">Kategori Cloud</span></TableHead>
              <TableHead><span className="editable-text" data-unique-id="99869b91-25d7-49d6-9fa1-050c04eaa1f0" data-file-name="components/UserTable.tsx">Status</span></TableHead>
              <TableHead className="text-right"><span className="editable-text" data-unique-id="c8a222ab-0ab3-41f5-a1af-418e9b82a648" data-file-name="components/UserTable.tsx">Aksi</span></TableHead>
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
                        <Input name="username" value={formData.username} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="6b2d5d68-0743-4a01-91c9-101c06e20e3a" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2" data-is-mapped="true" data-unique-id="0946e5b3-6def-455f-bd23-c1be9579be5b" data-file-name="components/UserTable.tsx">
                          <Input name="accessCode" value={formData.accessCode} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="876ac9d6-417b-405a-8659-5089f788e2e2" data-file-name="components/UserTable.tsx" />
                          <Button type="button" variant="outline" size="sm" onClick={generateRandomAccessCode} title="Generate random code" data-is-mapped="true" data-unique-id="7998e64d-c729-49f0-8b43-a0ba7034dccd" data-file-name="components/UserTable.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-is-mapped="true" data-unique-id="eb5a17cb-dce0-4f87-bc49-697c09157f04" data-file-name="components/UserTable.tsx">
                              <path d="M16 16v-4a4 4 0 0 0-8 0v4"></path>
                              <path d="M12 12v4"></path>
                              <path d="M8 16h8"></path>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input name="name" value={formData.name} onChange={handleInputChange} className="w-full" data-is-mapped="true" data-unique-id="ba2ce8ad-306a-433b-a9e0-2c339994597c" data-file-name="components/UserTable.tsx" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="1b8f07b3-3d15-4ce6-9111-33216fdd6958" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="0a1b6f58-df25-4a19-8ac6-efb2e5c69fea" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="a503587a-d3d7-4e4b-a5fe-722727d0c68a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="5a6b0550-d4eb-4e90-aa3d-7dee7a03d772" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="0a34a616-ea38-4b3f-9dae-890600fd43c7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="3e1936c8-3bf4-4174-8231-1afafff37a50" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e7387cf5-fd41-4c78-acbe-6dc0d42bc827" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="b1101684-8e1f-4780-9dd5-bddbba973088" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="bd33fcb9-7b8f-4307-918d-6ad54eca1236" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="856c0e60-868d-43d1-b2b0-f1d365a8f654" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="33041cb6-affc-4a91-ac3d-f806c82e1e0d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="44a2e948-6438-4db5-8bb8-d35001ea53b9" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5985dcfb-1526-4b48-b020-6c59198a8e92" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="2e5c2e30-1bd0-4ae3-b727-94c8bb99c0b9" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="76a686f0-49c6-4daf-9e06-136b9d5d7516" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="4cf53800-7b91-4626-8a92-1fba25c22dd4" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="40bf10f1-f17b-4289-89b4-9d2a52827f85" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="0b16e981-8e00-47ef-b9bf-d51b437e84ad" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="063aefc4-9654-47bb-9ced-28d02cc509dd" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="843fa016-eece-4368-a540-4e306d6b13ad" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="72e47971-a1a5-4c0c-afb9-e9d9ac68f14d" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                }) : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <label className="flex items-center space-x-2 cursor-pointer" data-is-mapped="true" data-unique-id="bf194164-6bc3-4a29-8f57-28c6d585f527" data-file-name="components/UserTable.tsx">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" data-is-mapped="true" data-unique-id="87f013b1-17d1-4c8c-853d-3e94cac9b804" data-file-name="components/UserTable.tsx" />
                          <span data-is-mapped="true" data-unique-id="b126a717-85c1-4d6d-8e0f-f475ef5afc11" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="6a541159-32f2-4e9c-af4f-eea73a718da0" data-file-name="components/UserTable.tsx">Aktif</span></span>
                        </label>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="1b6f7f3a-6592-4ba0-ab50-d6e529bc9bf5" data-file-name="components/UserTable.tsx">
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} disabled={isLoading} data-is-mapped="true" data-unique-id="a2a43483-cf78-477e-b010-f40e5b013e50" data-file-name="components/UserTable.tsx">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => updateUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="e358bde7-78f4-4863-9eed-54100f2cd3b7" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {isLoading ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="1be47012-4495-4a93-969d-e17c77ee80b6" data-file-name="components/UserTable.tsx">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg> : <Save className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </> : <>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2" data-is-mapped="true" data-unique-id="82ec32cb-31f2-4cc5-bf12-24091bd00982" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <span className="font-mono bg-muted px-2 py-1 rounded text-sm" data-is-mapped="true" data-unique-id="12a93b4d-1312-473d-9eb2-2ee097f3cf4a" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                            {user.accessCode || "—"}
                          </span>
                          {user.accessCode && <button onClick={() => copyAccessCode(user.id, user.accessCode)} className="text-muted-foreground hover:text-foreground focus:outline-none" title="Copy access code" data-is-mapped="true" data-unique-id="93b23396-d049-4111-9a42-b6299f2e7c7d" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                              {copiedCodes[user.id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>}
                        </div>
                      </TableCell>
                      <TableCell>{user.name || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="bc6b85d9-7f59-49a4-8801-f4eae321d8f8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCategoryIds && user.audioCategoryIds.length > 0 && <div data-unique-id="c1bd257b-c37c-481d-b07e-18bef8a197c9" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="efc78399-4685-4a6b-8225-4d5f2accf8fd" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.length}<span className="editable-text" data-unique-id="c4ae3681-50dc-4b6d-a02b-5868ce9a94af" data-file-name="components/UserTable.tsx"> Audio</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="3d4099bd-0565-4b6c-9f33-3128dd338822" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="c33b5d08-3a33-4537-acf8-24169ef1cbf0" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d8ab50f2-a8f8-4d42-9369-beeb023a6840" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCategoryIds && user.pdfCategoryIds.length > 0 && <div data-unique-id="273b6a4e-9b58-4257-8f6d-f34741ff6b57" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1" data-is-mapped="true" data-unique-id="886e9152-6ba3-44ae-9ecc-e8273f0f8ada" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.length}<span className="editable-text" data-unique-id="99d0687a-4883-4073-b5d7-b796f7cd2bbf" data-file-name="components/UserTable.tsx"> PDF</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="7f5a5d31-1f95-467c-b1ac-9f87edb2ddb1" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="108c86a0-59be-4f7c-a770-ba8756e48035" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="78537dbb-a0b8-4ae8-a08d-9358bf1f76a1" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {user.videoCategoryIds && user.videoCategoryIds.length > 0 && <div data-unique-id="b12fc08d-f631-4304-bea4-40c47bbee8c6" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1" data-is-mapped="true" data-unique-id="6f31837b-66e2-4660-b0b9-875451c15d39" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.length}<span className="editable-text" data-unique-id="e28afff9-715c-4a3d-b77e-58e127e79b05" data-file-name="components/UserTable.tsx"> Video</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="d70ecf71-105d-40ce-993a-a64c141bb9be" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.videoCategoryIds.map(catId => {
                        const category = categories.regularCategories.find(c => c.id === catId);
                        return category ? <div key={`video-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="a60d9c7e-65cd-481a-bfb8-6e97a74fd1f2" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="520081c8-fc09-4835-b5a6-f51f6d77937b" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : null;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCategoryIds || user.audioCategoryIds.length === 0) && (!user.pdfCategoryIds || user.pdfCategoryIds.length === 0) && (!user.videoCategoryIds || user.videoCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="23c36989-2546-441e-a71b-36aa0161e5d3" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="0b1cb475-8873-4ed7-bc78-b75599ded5a0" data-file-name="components/UserTable.tsx">—</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1" data-is-mapped="true" data-unique-id="c79b2c61-800c-49ff-9526-f73b625a1062" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.audioCloudCategoryIds && user.audioCloudCategoryIds.length > 0 && <div data-unique-id="9c098eac-1e00-46fa-a383-91383acd5748" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1" data-is-mapped="true" data-unique-id="472d0460-b852-49dc-ac18-51c2f98b7077" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCloudCategoryIds.length}<span className="editable-text" data-unique-id="836e00d9-37b3-408b-a848-7779fb0fe071" data-file-name="components/UserTable.tsx"> Audio Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="8a50460e-3d14-4c17-b553-3afdc7aa17ef" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.audioCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`audio-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="54a59657-c5ac-45aa-80d1-8e9cbf9c62c6" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="21d6dd68-1742-46a3-b8a0-939ebe3d34fd" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`audio-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="8a75b649-fcc5-40f0-b5bb-565b90b14887" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="66667cdc-d5e1-4963-a015-35cfac707b73" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {user.pdfCloudCategoryIds && user.pdfCloudCategoryIds.length > 0 && <div data-unique-id="06ad5097-ed4c-40b8-a7fc-79a5a6120f7f" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1" data-is-mapped="true" data-unique-id="e848a271-3d08-4993-8356-396752088341" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCloudCategoryIds.length}<span className="editable-text" data-unique-id="020eb008-370a-4f64-bcd6-18076997dd17" data-file-name="components/UserTable.tsx"> PDF Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="f0557911-c58d-4853-a8e0-d5acac16fb60" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.pdfCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`pdf-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="885ddf57-929a-4aac-93cb-7af2b86f6fe8" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a126bcb9-07d4-47b6-aae2-67b7c7e85457" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`pdf-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="ff492f4d-ece2-4c71-9880-5c5118967a4f" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8b339b9c-1a2e-4653-9985-fb7c49074d2d" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {user.fileCloudCategoryIds && user.fileCloudCategoryIds.length > 0 && <div data-unique-id="f5415b5b-26b8-4191-95e2-1eab735d4135" data-file-name="components/UserTable.tsx">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mb-1" data-is-mapped="true" data-unique-id="b9d83d9c-3e97-433f-bd63-5d338d0748b9" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.fileCloudCategoryIds.length}<span className="editable-text" data-unique-id="8f44e16a-7b0d-44db-9edf-7ec058d67ebb" data-file-name="components/UserTable.tsx"> File Cloud</span>
                              </span>
                              <div className="text-xs text-muted-foreground pl-1" data-unique-id="ca19c4d8-b70e-484c-be34-443f74ca52f2" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {user.fileCloudCategoryIds.map(catId => {
                        // Search in all categories for cloud categories
                        const allCategories = [...categories.regularCategories, ...categories.cloudCategories];
                        const category = allCategories.find(c => c.id === catId);
                        return category ? <div key={`file-cloud-${catId}`} className="truncate max-w-[180px]" title={category.name} data-unique-id="54f9d1e1-70f5-486a-990c-ef53fe15da0a" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="fb90154c-2521-47fa-ae71-ce6fbaf6d850" data-file-name="components/UserTable.tsx">
                                      • </span>{category.name}
                                    </div> : <div key={`file-cloud-${catId}`} className="truncate max-w-[180px]" data-unique-id="27d70aa7-fcdf-48bf-abdf-5c1344eb885f" data-file-name="components/UserTable.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ab43a386-2a32-4e0a-96ae-44174b6f1c65" data-file-name="components/UserTable.tsx">
                                      • Category ID: </span>{catId}
                                    </div>;
                      })}
                              </div>
                            </div>}
                          
                          {(!user.audioCloudCategoryIds || user.audioCloudCategoryIds.length === 0) && (!user.pdfCloudCategoryIds || user.pdfCloudCategoryIds.length === 0) && (!user.fileCloudCategoryIds || user.fileCloudCategoryIds.length === 0) && <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="6feaf711-89c8-42d3-9c6b-b1ec6cf52953" data-file-name="components/UserTable.tsx">
                             <span className="editable-text" data-unique-id="a44cbb12-8624-408c-ab1b-101076b0e72e" data-file-name="components/UserTable.tsx">Nonaktif</span>
                           </span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`} data-is-mapped="true" data-unique-id="f9a73fe7-e248-456a-a9a6-d7361a4667fe" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="efce6275-b841-40d3-b2c6-ee23c24443ca" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                          <Button variant="outline" size="sm" onClick={() => startEditing(user)} disabled={editingUser !== null || isCreating || showDeleteConfirmation !== null} title="Edit User" data-is-mapped="true" data-unique-id="879516e1-afe4-43f6-8d06-3fa87408da43" data-file-name="components/UserTable.tsx">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {showDeleteConfirmation === user.id ? <div className="flex space-x-1" data-is-mapped="true" data-unique-id="4cf58dde-3d8c-4f2f-965c-68d2b706c8b2" data-file-name="components/UserTable.tsx">
                              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(null)} data-is-mapped="true" data-unique-id="88510b23-d7c4-4af6-ba10-fb61f77b8812" data-file-name="components/UserTable.tsx">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)} disabled={isLoading} data-is-mapped="true" data-unique-id="a8f11dc5-55cf-4af6-a4d4-455cb1c38990" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                                {isLoading ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="0cd44a78-7ebf-4388-9adf-54a9a41d62d5" data-file-name="components/UserTable.tsx">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg> : "Ya"}
                              </Button>
                            </div> : <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirmation(user.id)} disabled={editingUser !== null || isCreating || isLoading || showDeleteConfirmation !== null} className="text-red-500 hover:text-red-700" title="Hapus User" data-is-mapped="true" data-unique-id="4c182ffb-87f2-4687-b3cf-384d2fe4ad4f" data-file-name="components/UserTable.tsx">
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
      {totalPages > 1 && <div className="flex justify-center mt-6" data-unique-id="30c30226-72a4-42e8-bc16-3249dc29ae34" data-file-name="components/UserTable.tsx">
          <div className="flex items-center space-x-2" data-unique-id="61367111-cdd2-4cca-9e76-a8547a1099f6" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1" data-unique-id="a94d6896-1951-4c37-bc51-23d5d71127ad" data-file-name="components/UserTable.tsx">
              <ChevronLeft className="h-4 w-4" />
              <span data-unique-id="b0ac9c2d-1a05-4ced-9987-48dba44bb43f" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="c17c4fc8-5962-4903-9c72-629a230b5a51" data-file-name="components/UserTable.tsx">Previous</span></span>
            </Button>
            
            {pageNumbers.map(number => <Button key={number} variant={currentPage === number ? "default" : "outline"} size="sm" onClick={() => handlePageChange(number)} data-is-mapped="true" data-unique-id="46b2ca42-fe7d-4eb3-b2a7-7581115d9ad8" data-file-name="components/UserTable.tsx" data-dynamic-text="true">
                {number}
              </Button>)}
            
            <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1" data-unique-id="938ac439-45e1-4337-a075-a4c0a93773eb" data-file-name="components/UserTable.tsx">
              <span data-unique-id="3bced4d1-defb-4b95-bd1c-671243a7f3d4" data-file-name="components/UserTable.tsx"><span className="editable-text" data-unique-id="0f8c6dbf-a5a9-4089-99ab-53f1a1f6cc35" data-file-name="components/UserTable.tsx">Next</span></span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}