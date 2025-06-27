'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
interface Category {
  id: number;
  name: string;
  description: string | null;
  filter?: string | null;
  createdAt: string;
}
interface FilterType {
  value: string;
  label: string;
}
const DEFAULT_FILTER_TYPES: FilterType[] = [{
  value: 'audio',
  label: 'Audio'
}, {
  value: 'pdf',
  label: 'PDF'
}, {
  value: 'video',
  label: 'Video'
}, {
  value: 'audio_cloud',
  label: 'Audio Cloud'
}, {
  value: 'pdf_cloud',
  label: 'PDF Cloud'
}, {
  value: 'file_cloud',
  label: 'File Cloud'
}];
export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filterTypes, setFilterTypes] = useState<FilterType[]>(DEFAULT_FILTER_TYPES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingFilterType, setEditingFilterType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    filter: ""
  });
  const [filterFormData, setFilterFormData] = useState({
    label: ""
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Search and filter states
  const [searchName, setSearchName] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);

  // Apply search and filters when categories or search terms change
  useEffect(() => {
    let filtered = [...categories];

    // Filter by name
    if (searchName.trim()) {
      filtered = filtered.filter(category => category.name.toLowerCase().includes(searchName.toLowerCase()));
    }

    // Filter by filter type
    if (searchFilter) {
      filtered = filtered.filter(category => category.filter?.toLowerCase() === searchFilter.toLowerCase());
    }
    setFilteredCategories(filtered);
  }, [categories, searchName, searchFilter]);
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Gagal mengambil data kategori");
      }
      const data = await response.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      setError("Error memuat data kategori. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFilterFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSearch = () => {
    // Search is already applied automatically via useEffect
    // This function can be used for additional search logic if needed
  };
  const resetSearch = () => {
    setSearchName("");
    setSearchFilter("");
  };
  const startEditing = (category: Category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
      filter: category.filter || ""
    });
  };
  const startEditingFilterType = (filterType: string) => {
    const filter = filterTypes.find(f => f.value === filterType);
    if (filter) {
      setEditingFilterType(filterType);
      setFilterFormData({
        label: filter.label
      });
    }
  };
  const cancelEditing = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: "",
      description: "",
      filter: ""
    });
  };
  const cancelEditingFilterType = () => {
    setEditingFilterType(null);
    setFilterFormData({
      label: ""
    });
  };
  const createCategory = async () => {
    if (!formData.name.trim()) {
      setStatusMessage({
        type: 'error',
        message: 'Nama kategori harus diisi'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          filter: formData.filter || null
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }
      const newCategory = await response.json();
      setCategories(prev => [newCategory, ...prev]);
      cancelEditing();
      setStatusMessage({
        type: 'success',
        message: 'Kategori berhasil ditambahkan'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error creating category:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menambahkan kategori"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateCategory = async (id: number) => {
    if (!formData.name.trim()) {
      setStatusMessage({
        type: 'error',
        message: 'Nama kategori harus diisi'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          name: formData.name,
          description: formData.description || null,
          filter: formData.filter || null
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }
      const updatedCategory = await response.json();
      setCategories(prev => prev.map(category => category.id === id ? updatedCategory : category));
      setEditingCategory(null);
      setStatusMessage({
        type: 'success',
        message: 'Kategori berhasil diperbarui'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating category:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal memperbarui kategori"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCategory = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }
      setCategories(prev => prev.filter(category => category.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'Kategori berhasil dihapus'
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting category:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menghapus kategori"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateFilterTypeName = () => {
    if (!filterFormData.label.trim()) {
      setStatusMessage({
        type: 'error',
        message: 'Nama filter harus diisi'
      });
      return;
    }
    setFilterTypes(prev => prev.map(filter => filter.value === editingFilterType ? {
      ...filter,
      label: filterFormData.label.trim()
    } : filter));
    cancelEditingFilterType();
    setStatusMessage({
      type: 'success',
      message: 'Nama filter berhasil diperbarui'
    });

    // Clear status message after 3 seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };
  const getFilterLabel = (filterValue: string) => {
    const filter = filterTypes.find(f => f.value === filterValue);
    return filter ? filter.label : filterValue;
  };
  return <div className="space-y-6" data-unique-id="1048b142-1563-481f-9a1c-e7441a9fb9c3" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="c4ebea42-fcad-4aef-ad10-ee05cc8e90cf" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="58a8be10-0dc8-436e-bc8f-5f1c09ca8620" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="3f7d2864-e0de-4b2b-bc4a-97a8129a316b" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="fcf30191-2180-45ad-b389-40506a304480" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="6e57ae3f-4401-4ef6-a6cc-ae6880dc2e40" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="4a4b750c-9d17-4f2e-be41-6875436260a0" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="5fa03e0b-9ef6-455d-9ec8-89f95ac14e12" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="a9d086d7-249b-48ff-9609-8525ad0e723b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="fd89720f-c042-477e-ab06-643e5d5b48af" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="ba364df2-9b45-4c71-9957-7c65c52e50b8" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="28796413-096b-40b0-8ddd-7e4e507b7897" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="6dfe2089-247c-4be8-bea8-3a1e8dc742c0" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="7ae1f907-1d2d-46aa-a828-117e9cd05406" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="5c8926f1-0d83-47b2-9066-d21c78733c83" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="fb986ef6-ea35-4555-8919-aa72df8ab320" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="cc6572ff-bee0-40f4-b97e-49d6f17fc116" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="0c933933-649d-4068-bbc0-5e9b220eb3e9" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="a0b33bf0-4b27-4cd4-962b-a51e70fa8a78" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="929de051-5979-40fd-8f9d-c5f7f47c4c70" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div data-unique-id="b414b2eb-1a57-429c-a4a5-e34fe81c3aa6" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="filter" className="block text-sm font-medium mb-1" data-unique-id="b828ea1b-4910-40ba-b2e0-7161c36118f9" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="acf5d3f1-56f1-4526-9e74-fe6be2a97270" data-file-name="components/CategoryManager.tsx">Filter Kategori</span></Label>
                <select id="filter" name="filter" value={formData.filter} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="bc709d3d-a36f-4905-985f-8d1dceabe667" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="d411e1aa-af88-4b20-978c-6a310027fae0" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="eaf0f579-c0db-4a45-85f5-b85fd0c8881b" data-file-name="components/CategoryManager.tsx">Pilih Filter</span></option>
                  {filterTypes.map(filter => <option key={filter.value} value={filter.value} data-unique-id="c3c25a3a-15b7-45db-a956-49191e0018c1" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                      {filter.label}
                    </option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="275f0cbc-3a6b-4005-a70e-95a35023c436" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="3fa2c80a-96ba-4690-bd5d-e36c24dd1d5a" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="fdbfd8a8-21f3-4dd1-8225-428118760931" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="45dda71a-fcec-437e-8703-60775e5fe9fa" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="18f0ab71-1a0a-4bca-8b9f-ab0ddc3204e2" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="793c038a-9bb8-4f7d-b4ac-bf1c98b09bb7" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="75408065-7e13-4237-9767-05327f74b930" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="201be3b8-55ba-43d0-8ec9-790d985dcb11" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="c98af3d1-170d-4f9e-8aff-b87eabec66f1" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="e776f95b-bb51-407d-ab17-f97a26c3b273" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="f22d1340-9c10-4e41-a198-4a9bf01b23b0" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="9d52933f-f015-4933-917f-d0da4082f566" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="2014d359-76f3-4e40-871a-273978e43ba9" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="166e612f-db4b-4a74-974e-63e534e20c45" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="913fe3dc-96f7-4fef-bd24-68fb57b5542a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Filter Pencarian */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="ce4a2aeb-39b2-404e-a497-89776e1a3663" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="03551380-d63f-4cd8-bde9-b511ed8c436c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="5a7b2ed4-d6fd-49d0-9130-758f03796894" data-file-name="components/CategoryManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-unique-id="81bb6fe2-c498-4406-9fd7-643662e1d9ef" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="0782cb80-c5e5-4fcc-a8a5-16f33c12cdc4" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="searchName" className="block text-sm font-medium mb-1" data-unique-id="e63a1826-1019-48cd-9c44-0d294c9d24c3" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="8b28d1da-862a-454a-a467-ebe60f318fc9" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="searchName" value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Cari berdasarkan nama kategori" data-unique-id="9ddaa77b-5ae2-4891-b9c1-94f0b1da881b" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="78a2076e-f102-4daf-8b3e-56aef8079d8b" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="searchFilter" className="block text-sm font-medium mb-1" data-unique-id="1d9a7fdc-72e1-4361-a95d-37589f374384" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="789ca203-fda8-4273-b21a-70c5012ea9c2" data-file-name="components/CategoryManager.tsx">Filter</span></Label>
                <select id="searchFilter" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d8ebb87c-57d4-44d7-9a58-98703037d3a0" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="ccbc262c-65ca-4349-846e-b2ba83d82021" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="316052a0-022d-4c62-b5b5-fc6574e820ec" data-file-name="components/CategoryManager.tsx">Semua Filter</span></option>
                  {filterTypes.map(filter => <option key={filter.value} value={filter.value} data-unique-id="43359c61-c596-428b-8435-8dc7881ea13a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{filter.label}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="8f644a59-2afa-46b2-93cb-9e7e6b5a7e75" data-file-name="components/CategoryManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="de9dc003-b80f-46e7-aa62-2221b0f425fc" data-file-name="components/CategoryManager.tsx">
                  <Search className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="18d0c1ec-94b4-4331-8978-b3c6616d1a4f" data-file-name="components/CategoryManager.tsx">Cari</span>
                </Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="c323457f-4ed9-4039-8486-c6af34a8093f" data-file-name="components/CategoryManager.tsx">
                  <span className="editable-text" data-unique-id="05d8f09e-7661-4395-8d61-e7eb0edfe4c9" data-file-name="components/CategoryManager.tsx">Reset</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Categories list */}
          <div data-unique-id="0624bd12-1539-491a-8758-6f10fbf7d8b5" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c6158f7c-ffbb-4197-8355-35afb0ea19ce" data-file-name="components/CategoryManager.tsx">
              <span className="editable-text" data-unique-id="fef3218c-722c-4f3a-a622-ea14a0e377bd" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span>
              <span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="1a3c1ed5-c0b0-468b-9011-fc5304b2bee6" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="100cae15-41a2-4ff0-819c-4c056aed2f7b" data-file-name="components/CategoryManager.tsx">(</span>{filteredCategories.length}<span className="editable-text" data-unique-id="f7a2146e-6c11-4a4d-a3fe-86315ca033b7" data-file-name="components/CategoryManager.tsx"> kategori)</span>
              </span>
            </h3>
            <div className="overflow-x-auto" data-unique-id="5f22a5f2-1cbe-4135-a7cd-4ed88897daf3" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="94648f51-ba03-48a8-a6a1-eaeadae2725e" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="198ad5c3-d292-4613-9dad-d6af8b282165" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="1aa872ef-cab1-4824-ac79-d7615f6c5360" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8f790cd1-9ff2-4616-99d4-94c5da3e695c" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="7b882ec5-c300-4c41-abf9-68233c13a42a" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden lg:table-cell"><span className="editable-text" data-unique-id="71140bd5-c015-412b-8cc4-590cadb913db" data-file-name="components/CategoryManager.tsx">Filter</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="89fe2aeb-b7b1-46b0-b7ae-94fe536f6118" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="03aca89f-1a2e-4aed-8fb8-d263fc7645a9" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="4b97103d-dfa3-47db-a215-6dfd5fc567a9" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="54e5a1e7-fbe7-474b-ab9b-cfc92021aea6" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : filteredCategories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <span className="editable-text" data-unique-id="5ff39faa-9207-4cc5-bdbb-33afcaaa1ff0" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {searchName || searchFilter ? "Tidak ada kategori yang sesuai dengan pencarian" : "Belum ada kategori. Silakan tambahkan kategori baru."}
                        </span>
                      </TableCell>
                    </TableRow> : Array.isArray(filteredCategories) && filteredCategories.map((category, index) => <TableRow key={category.id} data-unique-id="32c3850f-456d-4e83-a622-eddbed5cc1df" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="c17b03f7-9dc1-49de-b6d9-7da490caa447" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="20900daf-5d24-4ee2-a15c-2053bdf9b751" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="5988e6c2-745b-4a05-8b55-93b243001d7e" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="d7d6934b-2a28-440a-83df-9be2802a8dc6" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell" data-unique-id="5b063ca3-c1e3-4283-909b-811e9c4d6056" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.filter ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="becbf5bc-b9e0-48a6-bcdf-f1d5f611e73c" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                              {getFilterLabel(category.filter)}
                            </span> : <span className="text-muted-foreground text-sm" data-unique-id="30fa08f9-2db8-4bf7-8f94-0069c98f5a46" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="4eaf8422-319a-42ba-949d-5709a3c4499f" data-file-name="components/CategoryManager.tsx">—</span></span>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="ea9ae8a3-dd20-4f57-9ad0-c4da90cf1d1b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="554dbc76-8d48-457c-94c3-238f606ff773" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="305dabac-5054-4678-ad5d-2947d72945e8" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="b12b13d3-e0af-4393-9b72-dd68312dc6fe" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="cf21ec9c-facf-4b49-b246-868de28fb0a5" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="a1e09d77-32e1-429a-b70e-210aa386b586" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="63123fd0-a30e-441b-a167-feb05881a2b9" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="fa4d1d0e-98aa-4931-805e-8fa1dca75d41" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="8b2b91ec-b9dd-4484-b117-947d61c49429" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="bfc2826a-0fb7-4a6c-bbcd-13a7d3ff08ab" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="d42accb9-4a72-4e1e-86c5-f372d9758914" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}