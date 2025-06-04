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
  return <div className="space-y-6" data-unique-id="cab0b484-3b49-4710-9c90-69d1be0a2481" data-file-name="components/CategoryManager.tsx">
      <Card data-unique-id="a8c10bd4-3ccb-4666-9ce7-ab8b5b819dae" data-file-name="components/CategoryManager.tsx">
        <CardHeader data-unique-id="876a6d9e-f503-4eba-8d4b-4b65066c25e3" data-file-name="components/CategoryManager.tsx">
          <CardTitle data-unique-id="eb5d79b0-3c5d-4453-a454-afaea5ff8d14" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="dec4c9ea-36d1-4d8f-8ac5-af3bfe337ab3" data-file-name="components/CategoryManager.tsx">Manajemen Kategori</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="0a06b5c4-3190-4128-bb45-f0e2343a9d9e" data-file-name="components/CategoryManager.tsx">
            Tambah, edit, dan hapus kategori untuk konten
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="a1b57425-3efa-4a39-abaf-566cd92d9f0c" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="1de00e77-25c1-4913-92e7-af9eb1cd22a3" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1a4cf58e-96df-4bba-9bc2-1d16855e9257" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4" data-unique-id="b12f60da-57cd-4ab2-a089-3cce5c71057d" data-file-name="components/CategoryManager.tsx">
              <div data-unique-id="3d12ca55-2f90-48df-ab72-d6515239c7f7" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="name" className="block text-sm font-medium mb-1" data-unique-id="3a4aeab6-e9f8-4204-837a-89a14c43aae8" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="a7e6ec1d-c746-4215-9bae-abe74da847b4" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama kategori" className="w-full" data-unique-id="36e770ca-a3ff-43d9-b73a-2f39ce7f394c" data-file-name="components/CategoryManager.tsx" />
              </div>
              <div data-unique-id="078fb3a5-f5d9-4c39-ae4a-69eb1fefe139" data-file-name="components/CategoryManager.tsx">
                <Label htmlFor="description" className="block text-sm font-medium mb-1" data-unique-id="a895c4fe-2ee9-4d3b-8eec-8812aa73db05" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="59f1f2bc-7c80-4eee-abb1-67b7a4e7fa14" data-file-name="components/CategoryManager.tsx">Deskripsi Kategori</span></Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Masukkan deskripsi kategori" className="w-full min-h-[100px] p-2 border rounded-md bg-background" rows={4} data-unique-id="ea19b74a-0c70-4960-a048-2d7c0caa2ac3" data-file-name="components/CategoryManager.tsx" />
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="e4b2f2af-13cc-430f-9c02-50f27a8508a0" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="9f8aebc4-a8f9-4196-b024-7b671228a601" data-file-name="components/CategoryManager.tsx">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="4860ac42-7a4a-4c26-91f4-72d2aa46447c" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                {editingCategory !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="9b21b4bc-b5ca-4e5e-bdc9-96c993769d5c" data-file-name="components/CategoryManager.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="149495a8-d241-4288-a9dd-e4ba6ceb3444" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="52403132-503b-44e1-bf88-f26cdbbb87d9" data-file-name="components/CategoryManager.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory} disabled={isLoading || !formData.name.trim()} className="flex items-center gap-1" data-unique-id="35233114-2679-49a0-b4d6-833479cdfb02" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="589053eb-f4db-4c13-97ea-3f28a5b5c580" data-file-name="components/CategoryManager.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="699d3969-9c2e-4a20-bc3b-b3cf342b3698" data-file-name="components/CategoryManager.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="0eb8e0ba-6753-47e9-b038-1728ad20326d" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="a9b1001c-8c3c-40ea-bc04-6e50fe03ae7f" data-file-name="components/CategoryManager.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingCategory !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="f1019a35-1469-4e8c-9159-afaf3f3002a3" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="d34f379d-2e10-4ecb-9d84-127db45ab66d" data-file-name="components/CategoryManager.tsx">Perbarui</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="ae310495-0c71-4629-9e30-3d438c73b43b" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="65fcd10b-18ff-4864-a083-5df6c45a9aad" data-file-name="components/CategoryManager.tsx">Tambah Kategori</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="f225eb72-02d5-46a7-9926-c85ab0751634" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="6c4515c2-456b-46f2-9a87-20d46fc343ab" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Categories list */}
          <div data-unique-id="61a34a61-6f06-4c08-b585-186411517a9e" data-file-name="components/CategoryManager.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="cf18d725-4c38-4fbc-acd1-40fa09468cd5" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="b6620512-8ddc-4bc1-9784-27455b066521" data-file-name="components/CategoryManager.tsx">Daftar Kategori</span></h3>
            <div className="overflow-x-auto" data-unique-id="9316bfc8-a6e3-43ea-8cd2-7592066e6f37" data-file-name="components/CategoryManager.tsx">
              <Table data-unique-id="794c5e5d-965b-4389-9927-3f4803896e4c" data-file-name="components/CategoryManager.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="e136591b-995e-4606-be03-e45d23234974" data-file-name="components/CategoryManager.tsx">No.</span></TableHead>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="44c7fee9-017f-4f3b-9768-01dbdf02c584" data-file-name="components/CategoryManager.tsx">ID</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="fd9c9deb-2530-4038-a4e7-d0ac820202c9" data-file-name="components/CategoryManager.tsx">Nama Kategori</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="b2d40fc0-cc62-4140-973c-a3cf5fb49a9e" data-file-name="components/CategoryManager.tsx">Deskripsi</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="bb5462b1-8724-44ff-bb13-7cb1f9668f19" data-file-name="components/CategoryManager.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="9bdeadbd-bcaa-4098-a9df-e2d3bf49b716" data-file-name="components/CategoryManager.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="ff0775c6-5a1a-41a7-9936-6da1d970cad5" data-file-name="components/CategoryManager.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7b5477a6-6f9f-4203-af1d-f956284ab8ef" data-file-name="components/CategoryManager.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : categories.length === 0 ? <TableRow>
                      <TableCell colSpan={6} className="text-center py-8"><span className="editable-text" data-unique-id="2474accf-f9fa-473c-9779-79cfea5a3111" data-file-name="components/CategoryManager.tsx">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(categories) && categories.map((category, index) => <TableRow key={category.id} data-unique-id="3ed04dcf-e439-45db-85a1-2dcd896cb5ae" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="8ecef11a-0a5a-4fc3-b834-656045dd46c3" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell data-unique-id="191bbe7b-7c16-456b-b56e-e3603f79c788" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.id}</TableCell>
                        <TableCell className="font-medium" data-unique-id="52142e1b-ef95-4145-8316-3d10feb1fd18" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="0a7d62f2-c565-43a9-8134-91ab7c06f59b" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.description ? category.description.length > 50 ? `${category.description.substring(0, 50)}...` : category.description : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="93b6b31e-e064-4b76-8779-337ecf3d01eb" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          {category.createdAt ? formatDistanceToNow(new Date(category.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="f4ddc814-9725-444e-b2a8-5408ee760d98" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="da9ba32f-92a4-48e2-8291-7c97f0157c6f" data-file-name="components/CategoryManager.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(category)} disabled={editingCategory !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="2b98f6e6-bed2-4452-8b24-3e486d0041d7" data-file-name="components/CategoryManager.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="c155d953-0fb2-4860-9199-8dd341af0e20" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="dbbe6c58-cb88-47f5-8d20-de667acf248b" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="12c2f924-d7a7-4483-a705-e9b941f74463" data-file-name="components/CategoryManager.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteCategory(category.id)} disabled={editingCategory !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="8fc70219-d953-4f77-9d63-b87cb962b14d" data-file-name="components/CategoryManager.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ec9d3a2a-4ce8-497c-a6ab-1d69f01eb1af" data-file-name="components/CategoryManager.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="1f367fab-76dc-46f3-ae5e-73bb9329fd49" data-file-name="components/CategoryManager.tsx"><span className="editable-text" data-unique-id="5ef6a8bc-2157-4485-81a4-1452da7167c7" data-file-name="components/CategoryManager.tsx">Hapus</span></span>
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