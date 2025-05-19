'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pencil, Trash2, Plus, X, Save, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Admin {
  id: number;
  email: string;
  accessCode: string;
  createdAt: string;
}

export default function AdminRegistration() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    accessCode: "",
  });
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admins");
      if (!response.ok) {
        throw new Error("Gagal mengambil data admin");
      }
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError("Error memuat data admin. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (admin: Admin) => {
    setEditingAdmin(admin.id);
    setFormData({
      email: admin.email,
      accessCode: admin.accessCode,
    });
  };

  const cancelEditing = () => {
    setEditingAdmin(null);
    setIsCreating(false);
    setFormData({
      email: "",
      accessCode: "",
    });
  };

  const generateRandomAccessCode = () => {
    // Generate a random 6-digit access code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({
      ...prev,
      accessCode: code
    }));
  };

  const createAdmin = async () => {
    if (!formData.email) {
      setStatusMessage({
        type: 'error',
        message: 'Email admin harus diisi'
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessage({
        type: 'error',
        message: 'Format email tidak valid'
      });
      return;
    }
    
    // Auto-generate access code if not provided
    const accessCode = formData.accessCode || Math.floor(100000 + Math.random() * 900000).toString();
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          accessCode: accessCode,
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create admin");
      }
      
      setAdmins(prev => [responseData, ...prev]);
      cancelEditing();
      setStatusMessage({
        type: 'success',
        message: `Admin berhasil ditambahkan dengan kode akses: ${accessCode}`
      });
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    } catch (error) {
      console.error("Error creating admin:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menambahkan admin"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdmin = async (id: number) => {
    if (!formData.email) {
      setStatusMessage({
        type: 'error',
        message: 'Email admin harus diisi'
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMessage({
        type: 'error',
        message: 'Format email tidak valid'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/admins", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          email: formData.email,
          accessCode: formData.accessCode,
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update admin");
      }
      
      setAdmins(prev => prev.map(admin => admin.id === id ? responseData : admin));
      setEditingAdmin(null);
      setStatusMessage({
        type: 'success',
        message: 'Admin berhasil diperbarui'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating admin:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal memperbarui admin"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdmin = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus admin ini?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admins?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete admin");
      }
      
      setAdmins(prev => prev.filter(admin => admin.id !== id));
      setStatusMessage({
        type: 'success',
        message: 'Admin berhasil dihapus'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting admin:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Gagal menghapus admin"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pendaftaran Admin</CardTitle>
          <CardDescription>
            Tambah, edit, dan kelola akun admin untuk aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form for creating/editing admin accounts */}
          <div className="bg-muted p-4 rounded-md mb-4">
            <h3 className="text-lg font-medium mb-4">
              {isCreating ? "Tambah Admin Baru" : "Tambah Admin"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-1">Email Admin</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email admin"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="accessCode" className="block text-sm font-medium mb-1">Kode Akses</Label>
                <div className="flex gap-2">
                  <Input
                    id="accessCode"
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleInputChange}
                    placeholder="Kode akses akan digenerate otomatis"
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomAccessCode}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Biarkan kosong untuk membuat kode akses secara otomatis
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                {editingAdmin !== null && (
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
                  onClick={editingAdmin !== null ? () => updateAdmin(editingAdmin) : createAdmin}
                  disabled={isLoading}
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
                      {editingAdmin !== null ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline">Perbarui Admin</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Tambah Admin</span>
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

          {/* Admins list */}
          <div>
            <h3 className="text-lg font-medium mb-4">Daftar Admin</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Kode Akses</TableHead>
                    <TableHead className="hidden md:table-cell">Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Belum ada admin. Silakan tambahkan admin baru.
                      </TableCell>
                    </TableRow>
                  ) : (
                    Array.isArray(admins) && admins.map((admin, index) => (
                      <TableRow key={admin.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{admin.email}</TableCell>
                        <TableCell>{admin.accessCode}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {admin.createdAt 
                            ? formatDistanceToNow(new Date(admin.createdAt), { addSuffix: true }) 
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditing(admin)}
                              disabled={editingAdmin !== null}
                              className="flex items-center"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteAdmin(admin.id)}
                              disabled={editingAdmin !== null || isLoading}
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
