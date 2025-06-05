'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}
export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Gagal mengambil data kategori");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Error memuat data kategori. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const startEditing = (category: Category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
      description: category.description || ""
    });
  };
  const cancelEditing = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: "",
      description: ""
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
        body: JSON.stringify(formData)
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
          ...formData
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
  return <div className="space-y-6" data-unique-id="894e8959-9857-4822-bf71-7ab44c3d2dc3" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="d212ca74-d044-4186-b562-fb9884f3f447" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="5e3b303c-a3db-4194-9f92-e35031546aa4" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="e9bc489d-ad80-4764-8fe5-1695baff74c4" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="b620965f-6472-4d9a-ae78-afc07934829b" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="a0529a6f-1dc8-455c-8dfb-de9597d87c84" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="2ef5508c-1316-4b6c-ace2-e5ec825f57e7" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="0ca452b9-93dc-47e4-bd56-0c7d5140af5b" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4cec44f1-9ec3-4160-ade6-d97a5f781f42" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="04f5500e-9c30-4067-98b9-d12a39678340" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="e74ec94c-6f23-4a5e-a6ce-8182b2c7c02c" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="aab3d9fe-5618-4f20-9a7b-e95013b5092c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="71b7e3d1-d196-4e68-a07b-1732685fc57d" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="3cd0b797-e9a3-4c73-8fd0-6f509bbeaeaf" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="820f578f-17ed-4828-94b9-d57befa0f994" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="009f876d-5f0b-42f0-aab0-fefe537d268a" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="b6622bbb-ee39-46aa-aa03-676febf0b931" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="ed233940-a8a4-4db7-9882-b2b28c582309" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="fd3c67a1-e649-402a-ab47-748959534db6" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="ed8c5070-7672-4e39-ae5d-87def8700e78" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="ae16cc2e-b149-4c43-90ea-f50e7fc6caa6" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="abe43925-fd88-4b60-999e-8926036d4a13" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="1f8f5f24-b0ed-486e-8dc9-46e0a3446254" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="b83672f0-8d44-4b55-a2f8-238be060ec8f" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="9ae9f0c2-f7ad-4297-be9a-29c0593a6d29" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="2ca45b0e-817b-4ff5-8d59-69e87e325a9c" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="519083ce-cc9e-49c7-b6e0-26533121bf4d" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="8e7876e7-b7c5-4bd7-b478-111ee86a7971" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="f9ddc152-9a5c-4513-8d24-bd0e8f22a19f" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="7fe8b907-de6b-48c9-abe4-4c7c2eed6bd3" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="695c2487-50f2-4e6f-bd07-b77ef5b4454a" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="f000a17a-103d-4a1f-b07f-6b96f2cef741" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="4abdf7ae-e3a6-492b-afc0-5b4dadaf03c9" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="ee18159e-50ca-46d0-bb5b-cd6d52be14be" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="2a071949-9360-4e0f-a90a-7759555a38e9" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Categories list */}
          <div data-unique-id="0dd2d162-9881-45be-9432-60f2362b24ef" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="2766b914-11eb-45a2-8eba-8a52a87ee4b3" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="a14a9417-f794-43ee-9a16-a85c443987f8" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span></h3>
            <div className="overflow-x-auto" data-unique-id="f769c966-08d7-449d-acb1-5405bf6fe0c1" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="3a58b252-3463-4b1f-bf08-3385d2c1aa61" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="d48cdcda-a64c-4537-b1fb-b8fc442d4042" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="2ff8de1e-28af-46b2-b21f-cf0a4ab783b8" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="a1d7cd2c-5640-4c5b-a3aa-0d5a4fafce58" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="f0669439-8703-4c21-aa21-3a01fac252c3" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="ebd0d705-fb46-4bd8-8606-cbd31d2b0e08" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="76b29a58-234a-4fc2-9773-15c5d8253aea" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="4671ac8e-fbc5-4050-b73a-58ead9087e0c" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="668f029f-f68d-4191-a000-dafa01b9062d" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : categories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="13f0ade0-047d-4bc5-9eb3-b44c7e36126b" data-file-name="components/CategoryManager.tsx">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(categories) && categories.map((category, index) => <TableRow key={category.id} data-unique-id="e3767e03-51ba-4055-88fb-77b751f3de53" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="cb669885-9385-45dd-a2ab-bdd7ab7824e5" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="ae2ec17e-bf8b-4a47-b221-8ee4eaa6af39" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="baac732d-dc57-45cc-a0d3-25efc90cb430" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="b4d99682-529c-412f-920d-bebec03e5c2d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="81ed7dc3-3af0-49d9-b8ac-d18b52025024" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="5af75c3c-d5c4-4482-95ff-21958b445765" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="93d4a872-c67b-4695-bf4f-daa4ba0c931f" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="6788730b-82e2-41e9-a345-c4a3a449d84a" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c091df0f-fd74-4042-b0b2-f20aab5cbe52" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="da2584db-63af-4946-9d0b-49849807cb17" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="42613ccd-3d49-4212-82bf-50d68cf47c98" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="50a6ca3e-da7b-4821-a23a-c1480cc0b90a" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="c3bcf557-f28a-44bd-83e0-16d4357b5d04" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="c010a7f1-7a95-4e9f-8e16-d68e1f7253b8" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="29d9bb5a-afe0-407b-be0b-5735b4e222d7" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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