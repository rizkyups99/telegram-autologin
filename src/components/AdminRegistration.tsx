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
  return <div className="space-y-6" data-unique-id="46b3ce17-f0ca-42e7-9fd2-8151fd90635a" data-file-name="components/AdminRegistration.tsx">
      <Card data-unique-id="6ec15545-ce26-43e0-a571-7cfb85eecb3c" data-file-name="components/AdminRegistration.tsx">
        <CardHeader data-unique-id="2b58b2a0-b78a-4f12-9515-34a48924e19c" data-file-name="components/AdminRegistration.tsx">
          <CardTitle data-unique-id="405eafbe-6ba2-4e8b-b218-20a69c820698" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="ff22819c-5e2b-47ce-a136-56379ad610da" data-file-name="components/AdminRegistration.tsx">Pendaftaran Admin</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9778e63f-7a1c-421e-ad45-f280fcee88d1" data-file-name="components/AdminRegistration.tsx">
            Tambah, edit, dan kelola akun admin untuk aplikasi
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="a9a9eeec-917e-46ad-b0ad-264084ae048d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
          {/* Form for creating/editing admin accounts */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="410092a5-6525-4acb-8b17-7d13e89c79c3" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4ed7d29c-164f-40ac-addb-c64dfb3fbfb0" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Admin Baru" : "Tambah Admin"}
            </h3>
            <div className="space-y-4" data-unique-id="251595de-2f87-49ce-9218-1a02a4d148ac" data-file-name="components/AdminRegistration.tsx">
              <div data-unique-id="a54e65de-795e-480e-8492-6006fe6f6611" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="email" className="block text-sm font-medium mb-1" data-unique-id="f4c0b47c-98e7-45cb-9289-f76ccabfb666" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="fb4e3c07-aac8-4338-a27a-130fcec6d12f" data-file-name="components/AdminRegistration.tsx">Email Admin</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email admin" className="w-full" data-unique-id="a191944a-7b42-45c2-ac0e-a21cbe69d269" data-file-name="components/AdminRegistration.tsx" />
              </div>
              <div data-unique-id="7f62932f-9a7a-46a4-8238-dfb6ef11a61d" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="accessCode" className="block text-sm font-medium mb-1" data-unique-id="8fba896c-802e-4cc9-96a2-87fb219cb459" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="ec96c3f3-2a47-4b04-abdf-d527697780aa" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></Label>
                <div className="flex gap-2" data-unique-id="521bbfc1-9b94-473d-8c5d-f238bae172c3" data-file-name="components/AdminRegistration.tsx">
                  <Input id="accessCode" name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Kode akses akan digenerate otomatis" className="w-full" data-unique-id="76bdb1ef-281f-4392-9bbd-d6aa70f33fda" data-file-name="components/AdminRegistration.tsx" />
                  <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="bd9aa661-c1aa-447b-961e-4a6ce21b856b" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="de0379ee-d338-4300-8bd0-a1f76d2aaf36" data-file-name="components/AdminRegistration.tsx">
                    Generate
                  </span></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="eb15a4a0-eedf-4a7a-9d20-9bd55eeed282" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="c1b3f440-ba8c-4bc6-809a-5c6ab6a671fa" data-file-name="components/AdminRegistration.tsx">
                  Biarkan kosong untuk membuat kode akses secara otomatis
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="31e52e38-6727-4b1c-9f95-1d433bd6bbb8" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                {editingAdmin !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="c7aff2d6-a500-4176-825f-ab3ec9da2d91" data-file-name="components/AdminRegistration.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="29eed71d-9211-4780-86c9-f95e8f716934" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="bf76f96f-11c1-43d5-9b01-734ecc712a39" data-file-name="components/AdminRegistration.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAdmin !== null ? () => updateAdmin(editingAdmin) : createAdmin} disabled={isLoading} className="flex items-center gap-1" data-unique-id="77dcc498-e20f-4a11-b4ba-a2c9e2bf541a" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="5c2d2dbe-46b4-43a3-9104-6042de9d66ae" data-file-name="components/AdminRegistration.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="2a8e39df-e44a-4090-a290-6115d32a8cd7" data-file-name="components/AdminRegistration.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="9484e5d2-58ec-4203-be84-596ce1880a23" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="ca8aa6af-d72c-439d-b4c1-612388814093" data-file-name="components/AdminRegistration.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingAdmin !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="ba5a9ccb-206b-48c7-8189-566b86f92c81" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="819692ca-2b93-4660-a74e-1f112fc1cdc6" data-file-name="components/AdminRegistration.tsx">Perbarui Admin</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="9cf06c62-d8bb-4620-be58-88c32f5686b7" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="e6dff266-6322-4e88-8e4d-3c8b2c908200" data-file-name="components/AdminRegistration.tsx">Tambah Admin</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="db03ed95-5e84-469f-afb7-43dfee033001" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="3fe19704-fe1a-4c26-bca6-7dbfe86d435b" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Admins list */}
          <div data-unique-id="8f0f1bd7-ef99-4bc1-be0a-2ac45d495e5e" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="293db090-7945-406d-9e8c-32a379099492" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="06210930-c105-4d3c-99bf-575f3a7aaef7" data-file-name="components/AdminRegistration.tsx">Daftar Admin</span></h3>
            <div className="overflow-x-auto" data-unique-id="0c66cc8c-6ab3-4cae-9a5e-0945da917f79" data-file-name="components/AdminRegistration.tsx">
              <Table data-unique-id="c4d3ad45-c24f-49c7-a7c8-f5bb5d1f0f1b" data-file-name="components/AdminRegistration.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="7506af31-bd70-4e2c-83e3-2721c511cb0c" data-file-name="components/AdminRegistration.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="68ca0f6f-9302-443d-85b1-016a0589d9b4" data-file-name="components/AdminRegistration.tsx">Email</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="42561235-ce03-456f-904b-cb97406c8ae6" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="1970c8d2-a82e-4321-b26a-351bc711bec2" data-file-name="components/AdminRegistration.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="efd2161e-1c60-4b1f-9a48-507a0c5a45d1" data-file-name="components/AdminRegistration.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="f2851725-69ae-46c5-a694-b2063071a95e" data-file-name="components/AdminRegistration.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="106ee7cb-f687-4007-a33b-44036fd59042" data-file-name="components/AdminRegistration.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : admins.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="4fef2a28-79da-4033-bbe7-e8f6709bb7b0" data-file-name="components/AdminRegistration.tsx">
                        Belum ada admin. Silakan tambahkan admin baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(admins) && admins.map((admin, index) => <TableRow key={admin.id} data-unique-id="dfabfd72-4c76-4bfa-b1d3-ec73e49507aa" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="84ae9fc0-80ad-46c8-be32-bcaf9a30c458" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="362a8845-b0ca-4fe2-b3f3-8781454ed09f" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.email}</TableCell>
                        <TableCell data-unique-id="fa4f9d76-9781-4eb0-8131-95fe101ecb53" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.accessCode}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="f3c5d8c3-e528-4011-b51b-a579ba4bd2b1" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          {admin.createdAt ? formatDistanceToNow(new Date(admin.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="23cc249e-bca0-448d-bd63-deaa34e3ff21" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="2b660a95-b196-46a8-ae26-f517f85a15f4" data-file-name="components/AdminRegistration.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(admin)} disabled={editingAdmin !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="e0cf1e51-ef33-4829-9a0e-0fae6c964bf7" data-file-name="components/AdminRegistration.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="8d1fad0c-181e-47b5-bcca-76e09173abbc" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="8c9b7921-bfb5-462c-a093-6f998fc60dc5" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="9b957cf9-d5d9-4e74-bc00-b9ca57bf7a17" data-file-name="components/AdminRegistration.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAdmin(admin.id)} disabled={editingAdmin !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="abb55045-5e9f-4907-992e-1f9b8b0525c8" data-file-name="components/AdminRegistration.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="ff0dbc15-fba9-4c55-b101-424b92321cbd" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="0645672c-bf0f-4aa8-b3a9-1d69da7d7ea2" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="976de6f0-9de9-4c3d-ae27-1d49a12b4297" data-file-name="components/AdminRegistration.tsx">Hapus</span></span>
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