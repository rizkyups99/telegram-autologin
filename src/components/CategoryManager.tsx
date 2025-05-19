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
    description: "",
  });
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: "",
      description: "",
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...formData
        }),
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
        method: "DELETE",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Kategori</CardTitle>
          <CardDescription>
            Tambah, edit, dan hapus kategori untuk konten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form for creating/editing categories */}
          <div className="bg-muted p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium mb-4">
              {isCreating ? "Tambah Kategori Baru" : "Tambah Kategori"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium mb-1">Nama Kategori</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama kategori"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi Kategori</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi kategori"
                  className="w-full min-h-[100px] p-2 border rounded-md bg-background"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deskripsi kategori (paragraf panjang untuk menjelaskan tentang kategori)
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                {editingCategory !== null && (
                  <Button 
                    variant="outline" 
                    onClick={cancelEditing}
                    disabled={isLoading}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Batal</span>
                  </Button>
                )}
                <Button 
                  onClick={editingCategory !== null ? () => updateCategory(editingCategory) : createCategory}
                  disabled={isLoading || !formData.name.trim()}
                  className="flex items-center gap-1"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Menyimpan...</span>
                    </span>
                  ) : (
                    <>
                      {editingCategory !== null ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline">Perbarui</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Tambah Kategori</span>
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && (
            <div className={`${
              statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            } p-3 rounded-md flex items-center`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{statusMessage.message}</span>
            </div>
          )}

          {/* Categories list */}
          <div>
            <h3 className="text-lg font-medium mb-4">Daftar Kategori</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                    <TableHead className="hidden md:table-cell">Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Belum ada kategori. Silakan tambahkan kategori baru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(categories) && categories.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {category.description ? (
                            category.description.length > 50 
                              ? `${category.description.substring(0, 50)}...` 
                              : category.description
                          ) : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {category.createdAt 
                            ? formatDistanceToNow(new Date(category.createdAt), { addSuffix: true }) 
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditing(category)}
                              disabled={editingCategory !== null}
                              className="flex items-center"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                              disabled={editingCategory !== null || isLoading}
                              className="text-red-500 hover:text-red-700 flex items-center"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
