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
  return <div className="space-y-6" data-unique-id="efc81a79-98e3-480a-9890-f87448e21818" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="6518f9b1-0e6d-46c8-9a65-d90b878c96ab" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="f73e51ea-ff27-46a1-8506-99414f8204cc" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="532f2ce2-62e8-46a1-8343-2a2582e10731" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="cf0996b3-9372-41e7-82c1-8edd5d3d9ec4" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="d2c18a27-53de-4daa-a1e5-915c66f69473" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="99e40de6-00a7-4ec9-81a1-89689479e71d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="db6c2ce4-9a4c-481a-a548-e1a421915d5e" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="6826ca85-bc76-428a-91b4-9cd66bc13020" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="10871ff4-fd29-4873-adb4-6d70dc0c34c6" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="11ac277d-9576-4ac5-a591-a766d47dd8c6" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="9f161e5a-736a-4ef1-b1bb-1b095f1a6535" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="0084a2a2-5a60-475a-87de-830201c3e775" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="d9d0e1af-55b8-4789-8a2e-4247b5ad3e7c" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="d0878e6b-c17b-45df-9c6f-f7978eb92824" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="0ab9c07c-b20b-4581-be52-efa6d2d7dc86" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="e38f6f5d-ea62-4538-b849-1258882e33be" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="0e4bdbb5-4a59-4f15-a4d0-6ecbd6277096" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="4d5739c0-30dc-4596-8e4e-4ad5d8534ed8" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="a958b781-1b5b-4ad5-b9c9-5a52d24d55ec" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="f1782302-6339-4901-aae5-9e5345af4ab1" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="1212ed6c-a2b0-4233-a2f0-e9411402c86e" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="a0d03cc1-703b-445e-90a7-95c548cde42c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="579e020d-ad20-4753-9a20-ea4a539e2d43" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="784dd79d-5234-419e-8c77-d7ce89bfae4b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="c45fd4c5-71a4-488b-a992-b900275e2b52" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="509119c4-fe03-4b68-bf82-43355c3da093" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="06329fcb-dfff-4799-b231-abe1e5431df1" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="c856e235-f427-4e87-9f02-0c33262550c0" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="8e15f533-0548-4be5-90e8-377986da9512" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="d70b4467-5e89-4cd1-8beb-7ce156f63bf9" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="1c6f1f92-1b2a-4f31-8820-630c97a8cb49" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="8068c2e8-de69-467c-9d81-bfd732ee06f8" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="cf6a4955-4001-449f-b2c9-c30bf48fb6a8" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="4c73828b-7907-4282-b2fe-fb8dcacfb287" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Categories list */}
          <div data-unique-id="26d99696-2b82-4f70-a5c4-b08bb5d1e8db" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="34c3918a-e8fc-43db-ac53-f63c0e8d0ac7" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="b55fe679-a57b-4cc3-ad17-9a0d58a48d55" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span></h3>
            <div className="overflow-x-auto" data-unique-id="dee05e35-bdc1-4a20-9a15-ded576a07da8" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="77d2b256-fcc6-44a4-97df-8548ca6d271a" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="16bf636e-2b3f-4948-bac2-66713bc0382d" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="e48787cf-36c8-48a4-8f9a-95a65ffdac53" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="925374e4-52fc-4492-91f4-9706ef472500" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="34755fb9-1175-478b-b293-7847d4e1bc6a" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="d0b51e4e-9799-41ff-9773-4eab1099ea61" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="e37516f9-3e31-48c4-9823-81f276f23330" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="244078bc-4f97-4355-bb84-5e130b33de00" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="bf99fd83-2cd2-4f55-8c3d-e7f4686aaa90" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : categories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="115df896-88d5-4d0d-8813-0d160454d407" data-file-name="components/CategoryManager.tsx">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(categories) && categories.map((category, index) => <TableRow key={category.id} data-unique-id="e78c529b-c5e5-4d87-8149-f94ae6ee0a25" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="ef9b8a9f-b622-482b-b26b-6de205ae30f8" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="2d499ef7-5a8d-4aea-9dbe-a07a537afc36" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="a450d08b-ea53-4bf1-87d1-bdeb28098c21" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="6b793641-39f1-44ea-84d8-740b17b0e398" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="126d34e9-0c5d-4482-8de2-fafc400dd69d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="081b93aa-8b0e-47fb-945c-e1da82f3190d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="65fc9fb1-3418-4ab9-9361-1f027ebe41b8" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="c2faf675-b49b-4330-bf75-c51b074c622e" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c3f7e01a-9006-4b75-ab41-a4c51b67d512" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="541a4d67-038d-4295-ab4c-f91898b0a496" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="1f00b244-f361-43ae-bad7-2b9a699ea1ec" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="c8878bbe-09c8-4dae-9354-80de12bcd612" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="352661c2-71a3-4643-b4fe-fff46955074c" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="da1c82f8-96ce-4e93-9f79-b64bcc51fba5" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="1d921f13-b888-459c-81ec-084b995162cc" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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