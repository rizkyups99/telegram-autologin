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
  return <div className="space-y-6" data-unique-id="564f59df-b095-452c-82df-e0c16aa29ab3" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="4fa8d4d0-3b75-4d8c-82d7-4b96b685674e" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="eb69a781-2241-49ed-94ee-fb34f7559f73" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="c18bedc5-a387-4280-8e76-40bd234a5dd6" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="741bcaf9-bc4c-4a13-8ce3-e895c04b7c99" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="8db8abc0-571e-4b9a-9039-88e60bc2fa28" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="5874690e-0996-4875-a65e-fc9863b2f204" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="38b773e8-e43d-4e4e-b661-c71c79afdaf0" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="e37c53cd-184e-4f5d-a76e-2e48912c68ac" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="4f3af8c2-be20-4e4d-9b8b-eeaabbdeed8f" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="5d5389f2-c662-43fb-99b1-e7e6df721667" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="521ce3d0-c422-4b3c-beb0-cf51ec151baf" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="3fa0086c-63cc-4400-9b41-df0544a0e78f" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="57882f27-91e5-4ed6-8e9a-bf4a6c24f446" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="2fc298ea-6d67-4311-9c0f-25d532fa9fd8" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="32b73e1b-106e-4e39-bc68-718aaca073ee" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="d235f14e-e011-4f56-b1d9-f8fb9678d270" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="230ab1aa-84c4-4726-95ba-29007136f915" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="bad51768-3b7e-48ae-bc3f-25c833587588" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="e7ba3c37-c8a4-4ba2-97f4-200ec4ee595b" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div data-unique-id="c37f5c10-40cc-436e-ae18-360f5031bf01" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="filter" className="block text-sm font-medium mb-1" data-unique-id="ba991972-747e-423b-9670-58635b73c5e6" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="cc59c788-d278-4bd4-bec3-2024401780cb" data-file-name="components/CategoryManager.tsx">Filter Kategori</span></Label>
                <select id="filter" name="filter" value={formData.filter} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="cf5cf760-e8b1-42e3-bd99-410284680243" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="4f70173c-d901-4812-a2d6-f122c434d89b" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="1bf50c5d-0913-4449-9a30-1ba6f5090d2e" data-file-name="components/CategoryManager.tsx">Pilih Filter</span></option>
                  {filterTypes.map(filter => <option key={filter.value} value={filter.value} data-unique-id="0c238a1e-1d0d-4182-ad7c-d702bd9e37d7" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                      {filter.label}
                    </option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="5f2467e2-43be-41c8-9f81-e688495c8d3d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="100cd734-b2de-4981-8784-1d63bd9aae7b" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="65357901-8263-4b50-a34c-9cca78d10207" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="7ca9d251-ab31-41a8-b961-ae632c69fa0c" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="3563d681-bbcc-4cc8-900c-e29094e67e20" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="334c2db1-f839-4d57-975c-61fd1388ac85" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="4e9cdff0-ff4d-48c1-a5c6-91f6b2448207" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="97f5af47-d858-43ab-9c02-02a2624fa763" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="b6035f9d-9a55-437b-89f0-da0d88e2d006" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="e2c9b916-2b2e-4b61-bb0e-666d872d2ddd" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="d710f238-1509-405f-97a5-99281914f976" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="3c1a6d1f-6454-4e35-9744-d83a9baa7211" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="81d300e8-565c-44cf-a060-41ca2bd2161d" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="3c890819-0489-4548-8ef4-8f775cb64fa7" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="b313b87a-0358-43dd-a520-ca8d116a0575" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Filter Pencarian */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="c49c9764-17ed-48e9-a8be-37309e5571ad" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="7be7aa12-092d-49ce-9904-42c0fd5b08e0" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="88a8deb7-85b4-408b-be8d-730de76cf5c6" data-file-name="components/CategoryManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-unique-id="e8b8d6b7-92fe-4c61-9725-7e9a2c4a07c1" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="bb328276-e1c9-4586-81a5-21e6e0458f65" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="searchName" className="block text-sm font-medium mb-1" data-unique-id="3ba60c1e-5b86-4946-b4f8-ec4d52a8d4f1" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="1cef2e30-26f4-4571-87a4-673b39a971ce" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="searchName" value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Cari berdasarkan nama kategori" data-unique-id="93320f51-b550-4706-8e58-805bbf0be22f" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="d85ab431-2b3d-4ea3-a7ed-7de425c8a93d" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="searchFilter" className="block text-sm font-medium mb-1" data-unique-id="9867cb5b-ca3a-40fe-af09-2e24c0e594e3" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="a027c107-3536-4c5f-b8ea-691e13190217" data-file-name="components/CategoryManager.tsx">Filter</span></Label>
                <select id="searchFilter" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4af031ef-fe29-432f-8b7e-a3a125ac06e4" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5226c8b4-fd12-496a-a055-379de2387826" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="15c42a8d-2158-4efe-8403-b28b1bca85ef" data-file-name="components/CategoryManager.tsx">Semua Filter</span></option>
                  {filterTypes.map(filter => <option key={filter.value} value={filter.value} data-unique-id="7cde8ab1-1a6e-4447-bc09-e54ae2c77cb5" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{filter.label}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="6b27df98-a1b4-46c3-a971-34ce6127ca3e" data-file-name="components/CategoryManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="b944b39b-2607-4676-a488-a1f394322ce8" data-file-name="components/CategoryManager.tsx">
                  <Search className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="2592b20e-3b74-41ec-8106-30e4e163a146" data-file-name="components/CategoryManager.tsx">Cari</span>
                </Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="3b80b94b-75ae-4bf3-a31f-5ae953adddcf" data-file-name="components/CategoryManager.tsx">
                  <span className="editable-text" data-unique-id="8ee92a90-d78c-41d2-b812-60fd766436e3" data-file-name="components/CategoryManager.tsx">Reset</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Categories list */}
          <div data-unique-id="cc53945f-2a90-4b58-a8a2-397873f8f297" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="20e7c728-7837-4ed0-89ff-3912ba011921" data-file-name="components/CategoryManager.tsx">
              <span className="editable-text" data-unique-id="eb5d90f6-73c4-44fb-91cb-2fe1452d2732" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span>
              <span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="bf854018-8b6f-471d-9b14-ddabdb81eb4f" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="561793de-7d7a-43e0-8af8-9b09ae20a0bf" data-file-name="components/CategoryManager.tsx">(</span>{filteredCategories.length}<span className="editable-text" data-unique-id="eeb97ca8-e0bd-4585-a350-06b84799abd5" data-file-name="components/CategoryManager.tsx"> kategori)</span>
              </span>
            </h3>
            <div className="overflow-x-auto" data-unique-id="2f4e6413-1a9c-470b-b4fa-b72bea4e8e19" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="1af66c57-8102-4394-af25-0371def0d38e" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="02139b88-363a-4bc3-bfb3-23b652fba8c8" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="8717a10f-ad74-4fea-9bd3-670728edd5b4" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="38ef7c56-c207-40d1-af7d-583589286c6d" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="74737361-db13-4ee8-90df-aaeeb8b1ed6c" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden lg:table-cell"><span className="editable-text" data-unique-id="01c53408-66d3-4d70-a316-a65eeb890069" data-file-name="components/CategoryManager.tsx">Filter</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="d5646873-f2f1-4f26-be28-344789f3b678" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="0f22b6bc-f9a1-4df4-ade6-d0cfbf5d35ac" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="ef8b3279-33b5-442b-a370-703ea393be88" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="39cb043d-6cb4-45af-b020-c72803b14c1d" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : filteredCategories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <span className="editable-text" data-unique-id="024697d8-0e01-4ec4-b624-76ff63d7f01a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {searchName || searchFilter ? "Tidak ada kategori yang sesuai dengan pencarian" : "Belum ada kategori. Silakan tambahkan kategori baru."}
                        </span>
                      </TableCell>
                    </TableRow> : Array.isArray(filteredCategories) && filteredCategories.map((category, index) => <TableRow key={category.id} data-unique-id="344d5db7-a84a-4ce3-a19d-95cff8f41b17" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="d80f1007-b219-4e5b-a3ce-08d2393fbbe6" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="46907c38-63fd-4495-897d-2ed6962145d1" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="6b681e33-6b24-493c-af9a-aa012064662e" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="cfdbafbd-5cd6-40d8-a452-a286abebfe7b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell" data-unique-id="10af002f-6a2c-4e63-aedd-92719548daf6" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.filter ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="82ad879b-d87a-446c-9d36-0d31afdcc0d4" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                              {getFilterLabel(category.filter)}
                            </span> : <span className="text-muted-foreground text-sm" data-unique-id="cafc0f3f-648e-4f83-a0b0-178c4db81f9a" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="e3717655-c557-4059-916b-66870aef6af6" data-file-name="components/CategoryManager.tsx">—</span></span>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="ca4478fb-e026-43ef-9ab7-ca25223ec44a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="c6a842c9-a5c7-4af7-90cf-eaa05baa3af0" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="065a760c-73e5-45ee-98a3-2b68587b6737" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="f08b3363-6f81-4518-bcc7-f70a095a493f" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="15d82c1e-abbd-4f2a-89dc-2ff3b1e05d9b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="c14a26fa-f2ef-4ee9-917c-290c320d266d" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="85c38bf5-19ca-4ed1-b76e-8b214745e7c5" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="ecb1ceab-0e9b-4de1-a7c4-e64464117d29" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="b9541ece-6bd0-4541-8dad-58a37b99379d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="5a0362b3-c6fb-4bbf-9032-4c4db4f71e5c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="fce129b8-defe-4873-8ea7-03551a8e560e" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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