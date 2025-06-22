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
  return <div className="space-y-6" data-unique-id="839ad551-9d97-40d2-b115-5b6ae75abc36" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="612db3d7-810f-4dd8-ac2a-9a9bcab30fc2" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="af15339d-22c1-4b7d-8560-e33c59c039d0" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="fd8a656c-dc49-4920-830f-3b7ed6057695" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="bcb37ddd-3b8b-4fea-824d-0cdda2f0ac01" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="289dc307-77c2-4185-96ed-18ec333c80f3" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1fbe7892-3cf3-44df-8fa9-7531c24b5f98" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="7a14dc03-c4e7-4419-83f3-88f90e54dc42" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="ee860985-adea-456e-a6e7-57e284ad20ae" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="fc4307cf-fca9-45b0-835d-368cab73c0a6" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="c7feaba5-e582-451a-a1eb-a08ef7f0d67e" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="9b2e0bd5-18be-4596-af5f-7de5c14a0e52" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="818ffce3-9319-49a7-a56d-bbb7951bbb7d" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="7ab62375-5c4a-437d-be05-e911c64efb19" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="5d209d42-3f0f-4b76-860f-7913db9ce992" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="3e78efab-6718-4e2d-9aa3-023404e9f3e1" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="326862b3-2bee-4086-8ceb-59d6f8b58a13" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="3516a042-fbfa-4b59-bb1f-585ac33bb730" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="20d4ddc5-6665-4e8a-a0d4-5102a6bf4eae" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="48d1c6d5-9749-497e-a94b-543f76e4d0d7" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div data-unique-id="e820d2e9-2d7d-4b2d-bb69-52d4138662cc" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="filter" className="block text-sm font-medium mb-1" data-unique-id="284e3af4-3fdf-4d77-b1c9-bb1764f8318f" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="c32296b1-2317-4d4c-a154-66f8977007db" data-file-name="components/CategoryManager.tsx">Filter Kategori</span></Label>
                <select id="filter" name="filter" value={formData.filter} onChange={handleInputChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="38ed268a-7262-4124-b324-c66c7993f766" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="921118e6-c196-49c5-93ff-fab8c4965db1" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="0678cfc4-db7c-46d6-953d-09dbb2751127" data-file-name="components/CategoryManager.tsx">Pilih Filter</span></option>
                  {filterTypes.map(filter => <option key={filter.value} value={filter.value} data-unique-id="dea50090-541e-4dee-a93b-75fcfa7fedeb" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                      {filter.label}
                    </option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="91666d4f-6982-4465-8082-0f6c37b99b36" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="72d5ca21-fae1-4f47-a7ee-c49979f7f4c0" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="08090996-7bbf-44fc-9c37-35ae8cfd119c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="2eaf5165-77f6-4ece-93a2-6f7bedfbe719" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="9bc0b725-fa70-4849-bc79-e4293b76725a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="d130535c-45a4-4cd8-848a-aa3ed26230b3" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="5a9f3029-ac86-43b1-afa8-368a623d4fcd" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="9c7b831d-1627-49ce-9abb-167dd3f76806" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="baca06a6-577b-4fc7-8b56-baff81cbf747" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="c0b0f711-e46b-4161-8f9d-d9930f2b6621" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="078fc743-7ed7-4a1e-b231-8a289112ec25" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="834f39ae-a9ab-46d2-b521-a103351d0526" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="2f837f68-8fd9-4f35-a1a4-571488a0b999" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="aa33df20-7e4a-42b3-b73a-bcd7dff9b7aa" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="2427ee49-c97b-4737-a82b-708254052ac4" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Filter Pencarian */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="aae76bf9-437c-4d5d-b898-9e1f2ae9593f" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="502a738d-ddcd-4e95-9c53-9f571c568fe4" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="4e195b24-f09d-4b31-9d2b-7f282dd8de34" data-file-name="components/CategoryManager.tsx">Filter Pencarian</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-unique-id="d693726d-c655-439f-bea0-0613dc5e875e" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="6c596201-a117-4dfd-9e47-55eee9e4e8e6" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="searchName" className="block text-sm font-medium mb-1" data-unique-id="520cd099-77d3-490a-8332-bb409cbc7d40" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="92470672-f4f7-4760-b310-e2bf547477a6" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="searchName" value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Cari berdasarkan nama kategori" data-unique-id="aa053735-f590-4a73-8b2a-f70b2eac77c9" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="15e8aba4-fd2a-4c4c-98c2-bd97cc4e72da" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="searchFilter" className="block text-sm font-medium mb-1" data-unique-id="a8aa3afd-379d-4058-b855-a1eaa13d2ca4" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="fd2505d6-f81e-4148-85aa-7d8830d8aa55" data-file-name="components/CategoryManager.tsx">Filter</span></Label>
                <select id="searchFilter" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="f00e70c9-6f0a-4ec9-9b7d-b3bf1848ffa8" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="afcc9980-be9b-4e63-bd24-678740a98c04" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="235de7d2-ade9-41f9-93a1-902ef1048746" data-file-name="components/CategoryManager.tsx">Semua Filter</span></option>
                  {filterTypes.map(filter => <option key={filter.value} value={filter.value} data-unique-id="e5ba0a7d-68fa-4384-9b54-7fb08368276b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{filter.label}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-2" data-unique-id="c6451f98-f475-4d6d-9038-a3d96d74d1a1" data-file-name="components/CategoryManager.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="ddf0d5f3-74ab-47b4-a37c-26bac0b05e7e" data-file-name="components/CategoryManager.tsx">
                  <Search className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="197f74a6-1412-4327-81d1-f5bb3f053e0d" data-file-name="components/CategoryManager.tsx">Cari</span>
                </Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="cd6939dd-612c-411c-8a2e-779e217f233e" data-file-name="components/CategoryManager.tsx">
                  <span className="editable-text" data-unique-id="dd59878a-9b6a-41f8-a32c-2c2f7bae2e69" data-file-name="components/CategoryManager.tsx">Reset</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Categories list */}
          <div data-unique-id="52cf1fab-1ef7-4a8b-b68a-98f7f80467b7" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="fd3bffe6-69f7-4815-bd25-bfe656d420ce" data-file-name="components/CategoryManager.tsx">
              <span className="editable-text" data-unique-id="e1a29e5f-578b-4378-a518-80654a73a3cf" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span>
              <span className="ml-2 text-sm font-normal text-muted-foreground" data-unique-id="de52803b-972c-4bed-83ad-401d8beef4e9" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="251af16e-60ac-4f91-be0c-1e46aef09c15" data-file-name="components/CategoryManager.tsx">(</span>{filteredCategories.length}<span className="editable-text" data-unique-id="9b4cc0a8-27c6-4357-b15a-e7de99fd3f34" data-file-name="components/CategoryManager.tsx"> kategori)</span>
              </span>
            </h3>
            <div className="overflow-x-auto" data-unique-id="5a94c476-101f-44f9-ae94-b1a753468b58" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="fc6d923c-92e3-44f2-ab8f-23acd3b3a657" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="2e65320d-873b-4077-96fc-b143c62e22d4" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="908a1607-a9e4-48df-bc2a-9b6dd9cc378b" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="27b0dc80-7854-4a17-ac4d-1da5d58dd547" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="c64d0369-5987-46ec-950b-fe655bdec8ab" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden lg:table-cell"><span className="editable-text" data-unique-id="9bde7911-a8f1-4b75-a20f-cd88af9c7389" data-file-name="components/CategoryManager.tsx">Filter</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="bb0ef1b1-8a4f-41f2-a089-e38a7350bf31" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="720305fe-041c-4707-a287-e7fb94e6acb3" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="0bcf496f-8896-4a58-b00c-90832f375903" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="9dfb8438-0801-4ef3-8ce2-53e4951b47b9" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : filteredCategories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <span className="editable-text" data-unique-id="93e79090-4c22-4377-b04a-5d8ba40a4217" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {searchName || searchFilter ? "Tidak ada kategori yang sesuai dengan pencarian" : "Belum ada kategori. Silakan tambahkan kategori baru."}
                        </span>
                      </TableCell>
                    </TableRow> : Array.isArray(filteredCategories) && filteredCategories.map((category, index) => <TableRow key={category.id} data-unique-id="a833ff5a-e76b-4d7d-a58c-e6ba410b96d8" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="45d99c97-0671-4e86-895b-1fc61651a50f" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="f9728741-5ad2-45c5-b6df-1e57d8ca197b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="ca6e4081-cdef-41b6-aebe-3c8cc9bc3c73" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="b2cc1fa1-7d4d-49b6-bc2f-fb8dc0a9794b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell" data-unique-id="d3aaaf8e-8bb1-423d-92a0-dac14dd33363" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.filter ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-unique-id="c36a8e76-83b4-4df8-bc40-1d8e3ee1d03a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                              {getFilterLabel(category.filter)}
                            </span> : <span className="text-muted-foreground text-sm" data-unique-id="d85e302f-5b9c-4616-bdf5-5183fc7381a4" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="256f0ca6-aca6-4a3f-b510-4b8681414dac" data-file-name="components/CategoryManager.tsx">—</span></span>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="490a1002-4dfe-45ad-a247-0476dedc7726" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="62f0fb12-857e-4779-975e-624718e931e1" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="8d380db0-a7ed-442c-963c-44811700592f" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="cea2d314-8b39-437e-9e68-fdad2cda5324" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="154d0ae7-b7aa-40a2-8bbc-3da5e9f06b25" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="18f9dc95-3d5d-4705-ad9a-b3980243e147" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="24281946-5b6b-4416-8423-2018f7f3db2a" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="29f591b1-44ab-4f95-91d7-93bb1c1f6338" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="5d6fd5db-2c2c-4afc-96eb-5c44e25aafad" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="8e5ac4c6-5474-469a-b703-814dbd68d3fd" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="aed81979-8efd-4de2-ac4c-d085b2e67df2" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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