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
  return <div className="space-y-6" data-unique-id="6304f631-46ba-403c-b9c0-207aa1783e6b" data-file-name="components/AdminRegistration.tsx">
      <Card data-unique-id="7065a74c-0f7e-4770-a21a-e07e6a066cb4" data-file-name="components/AdminRegistration.tsx">
        <CardHeader data-unique-id="1610caaa-294c-422b-821d-7e3e11648884" data-file-name="components/AdminRegistration.tsx">
          <CardTitle data-unique-id="cf568d69-9999-4b45-bb8d-5dde1b29fa7b" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="3b9e7672-fd9a-4493-ac91-c3a2d009c80b" data-file-name="components/AdminRegistration.tsx">Pendaftaran Admin</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="6d931c9e-8bd0-4fe0-96c9-396910bf7181" data-file-name="components/AdminRegistration.tsx">
            Tambah, edit, dan kelola akun admin untuk aplikasi
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="681f25ef-373f-4a26-8ac2-a44ec875db9b" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
          {/* Form for creating/editing admin accounts */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="b22aca2f-0c67-4c16-8226-8aec7c29c5f3" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="12d631b7-94bd-4c39-8258-69034dcd15bf" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Admin Baru" : "Tambah Admin"}
            </h3>
            <div className="space-y-4" data-unique-id="4126cb49-f4b8-4a71-8826-6bb5f08a1065" data-file-name="components/AdminRegistration.tsx">
              <div data-unique-id="eea356c4-d569-473d-a819-0c5fb51b17a4" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="email" className="block text-sm font-medium mb-1" data-unique-id="fe6e7d00-10b1-4049-8845-193a146183e7" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="ead12574-b1de-4273-9684-a09bc2ccb70f" data-file-name="components/AdminRegistration.tsx">Email Admin</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email admin" className="w-full" data-unique-id="51318e5e-e0cd-4a3f-a11d-bb79983ea778" data-file-name="components/AdminRegistration.tsx" />
              </div>
              <div data-unique-id="45f19f3f-9330-40aa-a114-86e3b9f792c6" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="accessCode" className="block text-sm font-medium mb-1" data-unique-id="bf1cf5cc-8dc6-45e2-8912-68ed79905713" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="bfe7e39b-1c92-45d4-8adc-e5cc17be3395" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></Label>
                <div className="flex gap-2" data-unique-id="17b4f76b-ad1d-42ad-8dbf-f6d0ed24c65c" data-file-name="components/AdminRegistration.tsx">
                  <Input id="accessCode" name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Kode akses akan digenerate otomatis" className="w-full" data-unique-id="9fee2476-3541-4f6b-b7b6-844c8d4c93bf" data-file-name="components/AdminRegistration.tsx" />
                  <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="2c7414c6-4dda-4f10-bf2f-93d8ad12ff3a" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="178aacd0-7150-42ce-9b09-1875f7fe3719" data-file-name="components/AdminRegistration.tsx">
                    Generate
                  </span></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="6da73da5-2553-47f3-a01a-6ec33499ba17" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="432e8f6f-a2fb-4fc0-b7ad-5dac2714cc5f" data-file-name="components/AdminRegistration.tsx">
                  Biarkan kosong untuk membuat kode akses secara otomatis
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="422281b3-edbc-45a6-b048-5011d57b9efa" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                {editingAdmin !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="a0e10364-5eef-4a17-a332-fd4e98aa170a" data-file-name="components/AdminRegistration.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="699692b3-147a-4971-8bf7-5151d4c2113f" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="0beff548-e877-4620-9b4a-3b5d4c9fff8f" data-file-name="components/AdminRegistration.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAdmin !== null ? () => updateAdmin(editingAdmin) : createAdmin} disabled={isLoading} className="flex items-center gap-1" data-unique-id="84ae974c-65db-4caf-b8b7-3a687ec6188a" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="a0da2f3f-69d4-4ac6-b899-9811234e3ed2" data-file-name="components/AdminRegistration.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="79bab08f-40c1-47bb-9895-403026d0870d" data-file-name="components/AdminRegistration.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="b63c6a15-2113-4e41-92da-5c660a3b25c5" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="2fc0a6db-4836-480b-866c-641453398a30" data-file-name="components/AdminRegistration.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingAdmin !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="8a34f9b1-fc2c-4305-ad7c-d8ffab9f0d89" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="b27dde2e-956b-49a1-8b97-98d92fa0bab5" data-file-name="components/AdminRegistration.tsx">Perbarui Admin</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="5ca1d356-2afd-4003-8011-0fbbab76dc71" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="8e00c3a9-07b8-4053-87d6-9fd8abd81b8b" data-file-name="components/AdminRegistration.tsx">Tambah Admin</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="e041f929-9561-4c3d-a6e0-a2b33800b99e" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="86669a7a-8ca8-497f-a6fe-1717f4f2ae14" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Admins list */}
          <div data-unique-id="79344da9-3ae3-4d98-9399-9c315da19c8c" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="36a7ec3d-6c4c-4d3b-a4f7-ce621cb6f6c2" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="73179e98-0a26-4ddc-a775-10160061aeab" data-file-name="components/AdminRegistration.tsx">Daftar Admin</span></h3>
            <div className="overflow-x-auto" data-unique-id="8f42f812-4d51-404f-98ca-b1a63dee9207" data-file-name="components/AdminRegistration.tsx">
              <Table data-unique-id="cb8961f0-9122-45dd-ac58-e57c28dd1924" data-file-name="components/AdminRegistration.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="a45ab9a0-b42a-4aa3-931e-cec3ffe35aaf" data-file-name="components/AdminRegistration.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="ca1c17bc-4b65-49ac-96d6-8ef3e447bb7a" data-file-name="components/AdminRegistration.tsx">Email</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="325f16eb-35b0-4496-b3db-ba9a72c1aa60" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="33030c31-d848-4b11-aa60-0caa65d8523d" data-file-name="components/AdminRegistration.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="d715be5c-941e-433e-b1f2-32a76ba04a95" data-file-name="components/AdminRegistration.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="f867859e-4f0e-4580-ae49-9dbe051a0c6e" data-file-name="components/AdminRegistration.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="35904b8e-8981-4c2a-8e91-98159124844c" data-file-name="components/AdminRegistration.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : admins.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="7f4d5521-5140-435a-91f8-eac5fdd7372c" data-file-name="components/AdminRegistration.tsx">
                        Belum ada admin. Silakan tambahkan admin baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(admins) && admins.map((admin, index) => <TableRow key={admin.id} data-unique-id="23afa892-f1ae-4924-a8e5-a5025694fd56" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="e287f107-30c7-4ecd-88da-2c4efe43be63" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="3e633654-df2f-466c-9cc9-8a6ea072c99d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.email}</TableCell>
                        <TableCell data-unique-id="1a2c004e-0eaa-4d42-b82a-90b95196e145" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.accessCode}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="cd05d35a-f202-4e16-b625-ff69857833c7" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          {admin.createdAt ? formatDistanceToNow(new Date(admin.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="f3d370e2-e094-4751-951d-2db04793eb0e" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="b90dff87-461a-45da-a1c1-cf7b369b808e" data-file-name="components/AdminRegistration.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(admin)} disabled={editingAdmin !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="b6c51d4a-6630-4b8a-940b-7b52766d0b6a" data-file-name="components/AdminRegistration.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="bd945b6c-cc68-4f7d-bb09-de9267166536" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="902996af-3e28-46aa-8eb6-589972d583de" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="61a117ec-8593-48ae-8413-6d1e6daf4760" data-file-name="components/AdminRegistration.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAdmin(admin.id)} disabled={editingAdmin !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="febe232d-b569-4745-b862-df7929c40834" data-file-name="components/AdminRegistration.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="636a6b46-1fd0-4750-9c15-e707fde9c344" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="61004145-95d0-488e-840a-b73ac5f27fbe" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="b7cf3c56-0ef6-483a-81b6-cbe4a606d468" data-file-name="components/AdminRegistration.tsx">Hapus</span></span>
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