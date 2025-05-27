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
  return <div className="space-y-6" data-unique-id="956e3157-002e-48c9-b8c1-5942ae7ba10f" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="68f7a226-0fee-4602-a302-78b8d2d4309f" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="04b63b6d-61ae-46bd-bfb6-db61f59503d0" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="e2bf67f7-d80a-4df7-8f6d-4214ec183bcc" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="eded28f3-776a-4b35-afd3-917099bd5126" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="a925ec08-5dcf-476d-a3e5-11aa09777f0e" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="bc3f2bfa-5883-408d-a805-d83f79515f43" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="6f691015-ea39-42af-917c-289af0815558" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="d74b9bb4-d12f-4a3b-afb0-2c7761622554" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="4fd154ea-e3c6-4bfd-916c-3866a0cec11f" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="7e160e6c-fcc9-467f-8172-f10f26b4aa65" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="9eb62b3e-6895-44bb-bed3-811874aab4f5" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="03340cdb-e342-493a-bd00-f4925f5c6786" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="11680323-8dd1-4c79-bbb7-2b17f127bee6" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="24691464-d711-447e-ba9b-339434066684" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="558d1524-3969-4cc4-a359-ce8580ea6b02" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="9e6b3fe2-4846-4d92-99d6-ae2ed8f1d3a9" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="22433784-e208-49af-8199-6fefaf20a689" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="36fb61ed-c90d-4bc8-8d76-23b74b0f9042" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="6a5c2cd4-4ec2-4757-b4f4-b452e04f8295" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="e09ecb7d-7739-40d8-b6ff-6aa22db054a2" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="2467ee45-4cdb-4106-b83a-53624d026f53" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="1ebe7a50-2230-4e10-a244-5ed87c7e4a9b" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="afe92976-f740-434a-bd77-8859e9e1d352" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="5a043513-3db1-4411-956f-26d0479bc27a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="2190cdb4-e22c-4f4f-b430-984fb3eb10fa" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="1e0593c0-793b-4baa-8f0b-893b4f165c03" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="0689410a-8401-43d9-83e6-d25ef7a3395c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="3bb4c909-0877-4b10-bc35-cf815cfb2bb9" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="89d1a9b1-f9a8-4d3b-a1b5-beadb8a5eef9" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="113831c1-fe1e-4540-bfa5-954468555644" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="19b03a9f-282d-4ed9-9356-cbc69f84dff8" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="9cff51fe-16f9-4110-9bb3-b55549065736" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="404b7167-5251-4077-bece-02b7e882e123" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="7964bdaa-d8bd-48bc-aa4d-2866988efd0c" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Categories list */}
          <div data-unique-id="4c661e46-01b5-4eba-b401-8858c2ac2be9" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="52b19ab8-d722-4bbc-9ce9-8d7dbc4101e0" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="22ed955f-8868-45e2-b15e-ebb786621604" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span></h3>
            <div className="overflow-x-auto" data-unique-id="040dc793-ca15-41a3-872a-cc3ef66774e9" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="6416f929-e19c-4f98-b9c3-dcd3e591d910" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="43c3566c-73fe-451c-8cae-462c13cea969" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="8fd4a875-5fb1-44a9-9986-0f6af3780b24" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="069c90fa-b6c2-44a0-a679-b72cbac5ad3a" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="25a2a014-9dc6-4fbb-9fc5-a89deaee8199" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="b171ff6e-a186-4946-8267-699eeb9be6a9" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="72c277ba-ae77-42d3-a0bf-d5669e6ca6b7" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="b0f10dd0-180f-4329-8df0-836cf99a8711" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="01e1a61a-d6b5-496f-87c8-9aa5d1ab9452" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : categories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="30f8d61a-fa13-4f42-ab5d-b5d02205fd90" data-file-name="components/CategoryManager.tsx">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(categories) && categories.map((category, index) => <TableRow key={category.id} data-unique-id="9bc5e139-7a5c-4d0b-9086-f2c9c37bb6b1" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="e2e355b0-7147-45aa-9466-2bf92fd8fef0" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="c20afce8-70c6-4828-90ff-f006cd0c32ff" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="cb07fee4-84a0-4eb0-acc7-69bbbbf112f3" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="56d0411c-be1a-4824-b469-0eb9c7a98599" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="ab4b7dcb-ce28-42d0-99fa-03954d76a2c4" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="ee2e32f0-8b6d-4395-a881-d33061e4f3b4" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="172db8fc-9c52-424b-8cad-c268b5cf1991" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="e0552d38-700c-4229-8f97-cac4b5211c13" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="b71231e2-40ad-4ddb-9270-40720946f366" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="a5d41401-cf52-4865-9fe4-f9715bd5bb2e" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="77dff087-725c-4b7d-98be-712025bbf660" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="be64278a-26c7-45e3-907d-a48d199dc2ee" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="6eb40de0-5375-4cd6-bb4f-6ec9d7dab0d6" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="1fdfe736-398e-4914-a17f-64f2ca01de59" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="bd5b139a-ac34-41b7-86bf-fc1ffed0c61b" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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