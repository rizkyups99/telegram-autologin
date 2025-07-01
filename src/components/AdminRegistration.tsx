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
    accessCode: ""
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
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
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const startEditing = (admin: Admin) => {
    setEditingAdmin(admin.id);
    setFormData({
      email: admin.email,
      accessCode: admin.accessCode
    });
  };
  const cancelEditing = () => {
    setEditingAdmin(null);
    setIsCreating(false);
    setFormData({
      email: "",
      accessCode: ""
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          accessCode: accessCode
        })
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          email: formData.email,
          accessCode: formData.accessCode
        })
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
        method: "DELETE"
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
  return <div className="space-y-6" data-unique-id="d54001fb-72ae-4413-a164-cf18e400e188" data-file-name="components/AdminRegistration.tsx">
      <Card data-unique-id="63895fd7-1263-48eb-9708-703e19dec17f" data-file-name="components/AdminRegistration.tsx">
        <CardHeader data-unique-id="273bd9d4-df5d-49fe-9ca3-6d717c8d371f" data-file-name="components/AdminRegistration.tsx">
          <CardTitle data-unique-id="30e6a961-00f7-4eec-9bf9-ebf52ce0ae0d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="8461b715-c886-4685-8d23-788ec503fe50" data-file-name="components/AdminRegistration.tsx">Pendaftaran Admin</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="b70a3504-7744-4c40-856a-0bff3a7953b0" data-file-name="components/AdminRegistration.tsx">
            Tambah, edit, dan kelola akun admin untuk aplikasi
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="8144c9bd-bea9-48ed-b4de-10ad2603ccaa" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
          {/* Form for creating/editing admin accounts */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="cea9553c-45ee-4899-98d1-6311a0872600" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="c341a0a7-dd27-41f1-9d31-589068dd7674" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Admin Baru" : "Tambah Admin"}
            </h3>
            <div className="space-y-4" data-unique-id="e87f5ac1-c91b-4190-bd89-01ae09e6ce8f" data-file-name="components/AdminRegistration.tsx">
              <div data-unique-id="e655ac6d-4fbb-4b3d-b0df-0cad0c19164a" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="email" className="block text-sm font-medium mb-1" data-unique-id="3ed91bf4-bdd1-42b7-b3c5-3a3812fafcd7" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="f57605a3-efb8-44b9-8fda-370073e6b14c" data-file-name="components/AdminRegistration.tsx">Email Admin</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email admin" className="w-full" data-unique-id="4143805d-682b-4f00-92ba-f635eef88462" data-file-name="components/AdminRegistration.tsx" />
              </div>
              <div data-unique-id="a7cf7afd-c535-45c7-9131-8cb738369a07" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="accessCode" className="block text-sm font-medium mb-1" data-unique-id="5441ab3e-d7cf-4709-b227-25856083b243" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="10734a36-0fdb-4f7e-842a-36e155ef3566" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></Label>
                <div className="flex gap-2" data-unique-id="d58c9eb2-abca-46f9-8c1d-59115c1f1366" data-file-name="components/AdminRegistration.tsx">
                  <Input id="accessCode" name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Kode akses akan digenerate otomatis" className="w-full" data-unique-id="2bde3250-da6c-460d-bec7-db07a7c1925a" data-file-name="components/AdminRegistration.tsx" />
                  <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="06a4b709-ed67-41c4-996e-98c71749f2ca" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="d0492098-62bc-49b8-9d2f-da87105def79" data-file-name="components/AdminRegistration.tsx">
                    Generate
                  </span></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="031621bc-6bfa-497d-9e52-9a555057e3c3" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="81cf8b23-f306-41a3-b04c-28dfb573b8c2" data-file-name="components/AdminRegistration.tsx">
                  Biarkan kosong untuk membuat kode akses secara otomatis
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="5eb6a931-93f0-4d18-be72-fc02285bd2d4" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                {editingAdmin !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="9e7fb830-8e41-4b28-b6c2-7ae998ef3da4" data-file-name="components/AdminRegistration.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="df02a3cd-078d-4b4b-86b4-eafbc6e6213d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="214f6480-2a32-4205-a502-ef5522f30ee7" data-file-name="components/AdminRegistration.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAdmin !== null ? () => updateAdmin(editingAdmin) : createAdmin} disabled={isLoading} className="flex items-center gap-1" data-unique-id="73a1ae3e-465c-47c6-8a7e-b4c127020f5f" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="7f1690f1-3b8e-46ca-894f-cb0b663a828f" data-file-name="components/AdminRegistration.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="87abb5dd-fa1e-4a9b-bb7e-e5c177217e93" data-file-name="components/AdminRegistration.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="54cef77e-c8a3-466c-adff-4ba6e2d0c30a" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="6fd1473d-a28b-48d8-bfb2-40ad2a531341" data-file-name="components/AdminRegistration.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingAdmin !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="6ea49ccf-3641-4666-a445-52727c377d3e" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="440c6d11-9b20-416b-b288-61f1331c9c1d" data-file-name="components/AdminRegistration.tsx">Perbarui Admin</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="82b59159-3fc5-4d5a-bf40-beaabc7e91e7" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="52b1cb52-1d28-4849-834a-7ddae7b46f68" data-file-name="components/AdminRegistration.tsx">Tambah Admin</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="b424b65f-7c84-440d-9e41-dfc30ba325c0" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="1a406b1e-2060-46cd-989f-498d0d2de160" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Admins list */}
          <div data-unique-id="ffaa97e6-998f-4f27-8861-49c1da11a35d" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="1ba42151-bd82-4d70-b722-0fd4ffb1b65d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="04f97726-39c4-4a6a-8326-aa9098fc2632" data-file-name="components/AdminRegistration.tsx">Daftar Admin</span></h3>
            <div className="overflow-x-auto" data-unique-id="e2013296-b979-4735-bb1d-792188e277a4" data-file-name="components/AdminRegistration.tsx">
              <Table data-unique-id="44de974c-a71b-4038-8452-f8b42db46d09" data-file-name="components/AdminRegistration.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="07729b0d-b8f3-4b91-b997-b4c75474844d" data-file-name="components/AdminRegistration.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="173b3f18-3d4f-40ea-9dea-ed9ddbc7bb2f" data-file-name="components/AdminRegistration.tsx">Email</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="41acbef1-09cb-4a1e-8396-ef3ff3922e4f" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="01f9ebd9-6f7c-40c9-ad11-123fb7ec0efb" data-file-name="components/AdminRegistration.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="2b8916dc-a9b9-4d01-bcb7-cad67b551f50" data-file-name="components/AdminRegistration.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="d7bcd557-c9fe-46c1-92bb-422a41948e9e" data-file-name="components/AdminRegistration.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="15ca9467-3fc5-4b2b-a4d4-68f19a808dfb" data-file-name="components/AdminRegistration.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : admins.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="2dd5c2f9-c9b0-41bd-bee4-b7f682c43b74" data-file-name="components/AdminRegistration.tsx">
                        Belum ada admin. Silakan tambahkan admin baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(admins) && admins.map((admin, index) => <TableRow key={admin.id} data-unique-id="bc353eae-9812-475f-adac-e0c6a9abb6e4" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="7dc661b5-d668-4b14-8e2f-d140f64c011d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="f8af7351-023e-492e-80ce-ac1e346a217d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.email}</TableCell>
                        <TableCell data-unique-id="9958b305-d483-4bef-b354-dadcfaeb83cb" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.accessCode}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="8dffd882-af6e-449f-9b3e-8d87ddc0a240" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          {admin.createdAt ? formatDistanceToNow(new Date(admin.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="43e5a310-3ccd-42c8-a4d3-821cea1f248a" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="99eb4079-6431-4067-bdfa-c32f512ba163" data-file-name="components/AdminRegistration.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(admin)} disabled={editingAdmin !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="e814a08f-8b9e-4a61-a543-11c6e4310515" data-file-name="components/AdminRegistration.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="e7ae411e-5197-47bc-8b6d-428aca54d108" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="9e1a4380-e35e-42d0-94f1-4bff7985ccde" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="1f6f0d0f-e76c-4683-b715-8d48e3afd6a8" data-file-name="components/AdminRegistration.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAdmin(admin.id)} disabled={editingAdmin !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="146bcb4c-b991-41d7-857a-c39df18d6ff8" data-file-name="components/AdminRegistration.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="c247ebf4-f6ef-446b-a37a-8c7b4b5811f6" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="4cc72d95-4617-45cd-8c2f-62ad41fe669d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="42877a23-1431-423a-85b8-f94aa2a574d3" data-file-name="components/AdminRegistration.tsx">Hapus</span></span>
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