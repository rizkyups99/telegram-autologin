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
  return <div className="space-y-6" data-unique-id="a11d52e2-8e71-41d7-9a5b-c64572e29006" data-file-name="components/AdminRegistration.tsx">
      <Card data-unique-id="b73da077-2984-4819-baaa-1280573e5d74" data-file-name="components/AdminRegistration.tsx">
        <CardHeader data-unique-id="038cc049-a226-43f3-817a-03900f19f65f" data-file-name="components/AdminRegistration.tsx">
          <CardTitle data-unique-id="17150f00-2fec-4567-ada6-d518743da885" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="fbe7432d-06bc-48bc-bb1f-c502093bed6f" data-file-name="components/AdminRegistration.tsx">Pendaftaran Admin</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="5e91aac1-8aee-4a14-bc5a-cb6ed22e6f75" data-file-name="components/AdminRegistration.tsx">
            Tambah, edit, dan kelola akun admin untuk aplikasi
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="7504d19f-3ed3-4d11-88c0-a106c5ec3bb7" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
          {/* Form for creating/editing admin accounts */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="f78538b6-ae5b-4bbf-b406-3e2f443ed86d" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="a25f46c6-826c-4570-a369-82d1ce3ef05c" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Admin Baru" : "Tambah Admin"}
            </h3>
            <div className="space-y-4" data-unique-id="48a46c2a-ebfa-41a7-ac49-714ece98fd62" data-file-name="components/AdminRegistration.tsx">
              <div data-unique-id="a6f1f3f8-cd45-4617-8b5c-b6682a35cd48" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="email" className="block text-sm font-medium mb-1" data-unique-id="d3218630-5be7-4879-805a-afa9d69c05c6" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="90bdbbc7-6bc0-4af7-a07f-fe51613f9cca" data-file-name="components/AdminRegistration.tsx">Email Admin</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email admin" className="w-full" data-unique-id="d4613a32-ede2-43d3-9069-ae91798eeaf8" data-file-name="components/AdminRegistration.tsx" />
              </div>
              <div data-unique-id="4c8e13bf-4d8f-4932-b1a4-8fbe805ab401" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="accessCode" className="block text-sm font-medium mb-1" data-unique-id="9e186991-b6d7-4b1a-ad32-91a400a27d75" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="25d8e55e-b3d6-488e-b104-0f989bd14f9e" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></Label>
                <div className="flex gap-2" data-unique-id="151c379b-f0d1-4588-a2b6-f833a2a9fbee" data-file-name="components/AdminRegistration.tsx">
                  <Input id="accessCode" name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Kode akses akan digenerate otomatis" className="w-full" data-unique-id="cedcf9c7-2f30-48ec-8860-7a67984afccd" data-file-name="components/AdminRegistration.tsx" />
                  <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="919acaaa-67fd-4d37-8563-875505e94b7d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="76d110aa-0ae3-4045-965f-489a29dea96c" data-file-name="components/AdminRegistration.tsx">
                    Generate
                  </span></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="8f53c002-39b0-428e-814d-3b269b7f392e" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="9bf90494-d972-4790-8779-495f7c1f7760" data-file-name="components/AdminRegistration.tsx">
                  Biarkan kosong untuk membuat kode akses secara otomatis
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="2f562079-4aea-4b5a-851a-b681ae431314" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                {editingAdmin !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="281d2394-1258-4b41-8765-77a8c55fbf12" data-file-name="components/AdminRegistration.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="b48a76a1-780e-4123-9da1-b05089f918b8" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="c3a9d576-e4e0-46f1-94d0-43021a7eb33a" data-file-name="components/AdminRegistration.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAdmin !== null ? () => updateAdmin(editingAdmin) : createAdmin} disabled={isLoading} className="flex items-center gap-1" data-unique-id="918527d3-f87e-470d-8941-dddeb07e04e2" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="c8c878cc-0c61-43d5-9dbd-24f83dbf1b33" data-file-name="components/AdminRegistration.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="3f7a5a6a-6d15-4453-8661-7528d525ca74" data-file-name="components/AdminRegistration.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="a3f3bd77-a59b-4969-97ba-8430690482ee" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="322e4c25-8e6c-4499-84c2-1a65abbea0c1" data-file-name="components/AdminRegistration.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingAdmin !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="a14ee4c0-6beb-4a8d-85d6-fb0bb9b39cda" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="aaf17c2e-c821-4810-9b11-34b98562ca7a" data-file-name="components/AdminRegistration.tsx">Perbarui Admin</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="395ecaf2-7085-4884-ab63-c9380235e314" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="33d07497-d8e0-4af4-9752-9e1e252e6207" data-file-name="components/AdminRegistration.tsx">Tambah Admin</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="155fcfb9-997b-4b0d-96b5-074dee825b81" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="26b3c95b-ca6e-4759-8599-3a257ed5a91d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Admins list */}
          <div data-unique-id="952e20d3-ed42-47b3-877a-14f7cdfd21a7" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="032c14d1-257e-40fd-a6ab-a76d6fc9693e" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="943ead80-7487-4a68-9868-57efebf42a8e" data-file-name="components/AdminRegistration.tsx">Daftar Admin</span></h3>
            <div className="overflow-x-auto" data-unique-id="3bfb3658-d800-45ee-80e9-c91d663cbded" data-file-name="components/AdminRegistration.tsx">
              <Table data-unique-id="25425a06-2dd5-43a6-893a-879633c93fa6" data-file-name="components/AdminRegistration.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="8026d47e-a472-47e8-99f8-83be8b22fd37" data-file-name="components/AdminRegistration.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="ec013bf4-7196-4ebd-8c49-62459cef0518" data-file-name="components/AdminRegistration.tsx">Email</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="75d227d1-5705-4fb2-92eb-37982bf1dfdd" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="2dba2a77-a2c1-4976-b780-60d3fa650222" data-file-name="components/AdminRegistration.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="ef8a14aa-5cdf-43f7-ae61-a760dd57af33" data-file-name="components/AdminRegistration.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="79df9ff2-c9da-4914-ab73-0738c640dfd1" data-file-name="components/AdminRegistration.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="b605c965-33d9-44aa-a5ef-adcdc8a6d542" data-file-name="components/AdminRegistration.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : admins.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="43e28be9-e582-4367-90fb-7d7c56aa4c22" data-file-name="components/AdminRegistration.tsx">
                        Belum ada admin. Silakan tambahkan admin baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(admins) && admins.map((admin, index) => <TableRow key={admin.id} data-unique-id="f7ada4d8-6189-4672-b32a-3efae8348b04" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="5e14763c-932a-4bb3-b5bb-191fb3bddd57" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="dd55379c-825d-4b31-bef9-0e4bcd4ad74e" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.email}</TableCell>
                        <TableCell data-unique-id="0c441ad6-0948-46d2-b527-ab4ef1ef30b8" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.accessCode}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="cc294dcd-9c6e-4d48-9496-c0b6bf716d08" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          {admin.createdAt ? formatDistanceToNow(new Date(admin.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="899468ef-f82b-43a2-93b8-22401383923d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="57dcfb92-c214-4994-8be0-60759e1a5eb5" data-file-name="components/AdminRegistration.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(admin)} disabled={editingAdmin !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="6d2f65a6-a394-47d8-bd82-e8f906c7d49c" data-file-name="components/AdminRegistration.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="819c2c92-4590-489a-a31f-4a3d1466dd01" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="918e7fd6-7dc2-4dc9-b201-9b5f08aece19" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="8dbb5813-4200-4211-a50c-f56cd7f0cd65" data-file-name="components/AdminRegistration.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAdmin(admin.id)} disabled={editingAdmin !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="46a7058d-411c-452a-8f7e-636b94a74a98" data-file-name="components/AdminRegistration.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="03975ab3-e477-4fdc-bd52-b579882004ae" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="07ba0f6b-b76e-408e-8f74-3d17f1d3254d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="f615aab0-af8a-4d0b-8af4-8ccf93ed5a4a" data-file-name="components/AdminRegistration.tsx">Hapus</span></span>
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