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
  return <div className="space-y-6" data-unique-id="b234cfdc-dc70-46bf-af7e-71bdfa347397" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="4897b85f-3b8c-4326-81a5-fd27f0c5ecf4" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="8bec1439-042d-4ab8-9745-6249dcde171c" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="2f7146d2-9700-4cd9-a385-949ecc64c50c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="a28d8aaa-a788-4f06-8a96-bc7d913b1f81" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="881b76f3-0a0a-483b-a6e3-12a5f700124e" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="8f696c85-c982-4e59-8c34-4be57790f14b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="9412b714-d432-4b43-89b3-cb7b1b998e0d" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="af233a5e-b223-4438-8025-496c130f1ab7" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="990ceda0-8029-4328-b3b6-1510d799f808" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="89fbad38-6841-4b62-8c13-80cd299192d3" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="9a5ef2fb-b497-43b6-88ae-2afa0ca5e59d" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="3f399dcd-116c-4c2f-bf21-37a49c1a5835" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="6e8d9557-650c-47eb-8989-2404360711f7" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="c887cba5-ad8b-46f6-8c3c-669ccbb53601" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="34eee7a1-6e45-4249-8cf5-41191eb02ddc" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="135e0408-7e84-4af4-8ad2-df2a1f16604e" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="4e176ed2-9fe6-4ebe-ac3e-7387795cfc21" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="230f8588-2f55-4bbd-b150-95c1f93183e6" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="21d02da4-55b4-41d1-9433-98498884a5db" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="2d61c784-89d4-455b-80d3-fd4c3440ad3d" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="7c106fe9-d1f1-4ef2-8e05-6d4314206271" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="1c5576e8-d540-4acb-bda2-81f99c3bc31c" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="e90f07a0-6f84-4431-8fa8-9c00a039c359" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="849fd0bd-67fa-4e86-bcf7-e6698201e60c" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="b07c6332-a130-4a74-95fb-73eda63d62b0" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="32bc90be-1318-444e-ad2d-4657e44b3ea8" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="a69feb4d-0bdb-4113-aa1b-e5d4f01510f8" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="0aa01cb6-7f02-47bd-a017-f9f3e303d51b" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="03510309-5d75-4a4e-9141-ba1465d9262b" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="397a5b86-18ad-42bf-83d5-446c1c795d75" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="5fde1da5-8164-4be1-b7f7-d95d05653595" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="9897eed7-8760-431c-8b8d-6bdebf7b070f" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="b88ceacf-901e-44a8-a1ab-239b6597846a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="075fc480-d59a-426d-aff7-a5774ff57b3a" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Categories list */}
          <div data-unique-id="8a733629-d536-4e98-9fed-3913eea74143" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="850a6e85-b22e-4ade-b095-a0072cc7a1f0" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="7c665f8f-c740-4279-bd41-57335d28e2f7" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span></h3>
            <div className="overflow-x-auto" data-unique-id="509dd797-01bf-4713-8ab1-7bcb63d83759" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="f3185a29-26fd-4f65-9777-4f2887566d77" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="11a217b4-be26-443e-8c3f-4e740ed768e8" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="728ece31-c4d5-4613-b249-ea5fa140f9d8" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="8a95b0ac-2848-468a-b0eb-e19ac0f2524a" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="16141c5a-3448-4e37-b2d0-63e4e9df6562" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="b1510200-96cd-4cce-9c65-c44539e779f9" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="9d121702-9ed2-45d3-8402-1b2f4eebf9c7" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="2800e7bd-ce38-42bc-aa58-013f10521ef1" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="876e1aeb-9bca-41c9-ace5-fb1ec7402526" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : categories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="2598a4fd-2238-4ded-aafd-435cdbbf00b7" data-file-name="components/CategoryManager.tsx">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(categories) && categories.map((category, index) => <TableRow key={category.id} data-unique-id="de90c600-30ed-4c16-bbbf-8c98b780262b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="9bb14b8a-6dfc-49f4-8005-31f79566b6dd" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="5d257b8d-eb95-4b48-827f-0440defc38a1" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="a1c60b98-b673-4d03-be1d-cd1773ce8176" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="1ac533f9-b613-44b4-ad0b-f51a197f6c41" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="ab56a74a-38dc-4337-bc28-ab0d48c09589" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="e7931443-8e21-4f26-9da0-a67c1dca4924" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="0264d092-0aad-4f09-8cd4-fc18a685a1a5" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="654396ad-9f97-4da0-bd12-af3b9c7db37a" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="b09f0ca6-82ec-485a-8f82-cdad79d63577" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="595f877b-107a-426d-b157-9b5571e8d6ec" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="af76b1cc-921d-4428-80f5-436d659585bc" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="e308d979-8349-4177-88c5-5805020b06e4" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="3d5770c2-ef01-47b1-a1f9-cb4f7aea8816" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="2d5df922-2917-470e-9e5b-02c59f1a2203" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="cd9a345e-7737-4da0-8538-0b080c6b4dc5" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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