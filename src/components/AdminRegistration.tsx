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
  return <div className="space-y-6" data-unique-id="677f7c9f-937b-491b-96dd-c1f5c514d7ef" data-file-name="components/AdminRegistration.tsx">
      <Card data-unique-id="cc0a76bd-8254-4eef-84ec-7f0a31378ca8" data-file-name="components/AdminRegistration.tsx">
        <CardHeader data-unique-id="58513546-c45b-4347-8248-e8da2eb6863b" data-file-name="components/AdminRegistration.tsx">
          <CardTitle data-unique-id="c2fe8c7a-5759-430e-a2ed-409844794658" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="e5f29eb5-4a57-4495-aa36-7f6cc4ecc0f9" data-file-name="components/AdminRegistration.tsx">Pendaftaran Admin</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="21bf90ec-3355-4c39-a67d-517456af25af" data-file-name="components/AdminRegistration.tsx">
            Tambah, edit, dan kelola akun admin untuk aplikasi
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="86336a94-17ec-43cf-895e-b03fa35ed528" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
          {/* Form for creating/editing admin accounts */}
          <div className="bg-muted p-4 rounded-md mb-4" data-unique-id="b302fddf-ded6-421e-8001-e2c676c2b8a4" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="718b0d64-b163-4fa0-b808-02ea6f263488" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {isCreating ? "Tambah Admin Baru" : "Tambah Admin"}
            </h3>
            <div className="space-y-4" data-unique-id="c7c5f893-fb5a-4675-a348-1093ef2d0739" data-file-name="components/AdminRegistration.tsx">
              <div data-unique-id="9bd888dd-3909-4c89-9696-5e554f35e781" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="email" className="block text-sm font-medium mb-1" data-unique-id="f3796000-28eb-4d27-bd99-f36038ec1c3f" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="2c6ca690-fcfa-488f-a61a-f9503af4f30b" data-file-name="components/AdminRegistration.tsx">Email Admin</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email admin" className="w-full" data-unique-id="6d189188-cd80-459f-be7a-d24909ad90f9" data-file-name="components/AdminRegistration.tsx" />
              </div>
              <div data-unique-id="5757009b-5984-43e7-9585-b1ef65a86ee8" data-file-name="components/AdminRegistration.tsx">
                <Label htmlFor="accessCode" className="block text-sm font-medium mb-1" data-unique-id="198d5109-badc-49bd-9716-ad6c0ba44b55" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="f1d4862d-f0b8-43e0-9bb3-a559ac9922db" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></Label>
                <div className="flex gap-2" data-unique-id="ca2de56b-bb3f-425d-b6dd-719f57c07137" data-file-name="components/AdminRegistration.tsx">
                  <Input id="accessCode" name="accessCode" value={formData.accessCode} onChange={handleInputChange} placeholder="Kode akses akan digenerate otomatis" className="w-full" data-unique-id="a536bda8-6900-4809-9019-d640c6035a90" data-file-name="components/AdminRegistration.tsx" />
                  <Button type="button" variant="outline" onClick={generateRandomAccessCode} data-unique-id="0272108d-3e57-4976-bb0b-ab06ac0a4494" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="5d8c29ed-2863-475e-8062-28eaff229863" data-file-name="components/AdminRegistration.tsx">
                    Generate
                  </span></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="475d0921-79ae-45a4-97c6-b695a7c78968" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="ee41ecbf-a252-407d-b8bd-2588161e5100" data-file-name="components/AdminRegistration.tsx">
                  Biarkan kosong untuk membuat kode akses secara otomatis
                </span></p>
              </div>
              <div className="flex justify-end space-x-2" data-unique-id="e3867dbb-095e-472c-8b07-ee317958793a" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                {editingAdmin !== null && <Button variant="outline" onClick={cancelEditing} disabled={isLoading} className="flex items-center gap-1" data-unique-id="62d645ba-ba92-469f-94d2-83327d4ea9b8" data-file-name="components/AdminRegistration.tsx">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline" data-unique-id="0873e198-f199-462e-b7b1-4063fc8dad24" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="b860df28-e2fc-4262-bfe7-963c797b8023" data-file-name="components/AdminRegistration.tsx">Batal</span></span>
                  </Button>}
                <Button onClick={editingAdmin !== null ? () => updateAdmin(editingAdmin) : createAdmin} disabled={isLoading} className="flex items-center gap-1" data-unique-id="fcb6ccd5-0f9c-42bc-be0b-129637dbf39f" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                  {isLoading ? <span className="flex items-center" data-unique-id="3d65a53a-663e-4cc2-b4e8-15885304c0b2" data-file-name="components/AdminRegistration.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-unique-id="f62fd149-1634-439c-9d09-00fb97af89ea" data-file-name="components/AdminRegistration.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline" data-unique-id="db749e7d-88b2-4e28-a336-c5fe27e6da18" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="bee19add-291c-4696-941e-0aaf417e17c1" data-file-name="components/AdminRegistration.tsx">Menyimpan...</span></span>
                    </span> : <>
                      {editingAdmin !== null ? <>
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="6d469a83-61ff-45ea-a3b4-ebb3bf95ad81" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="f615aa1c-ce52-4864-a61e-0a20c6d5ae5c" data-file-name="components/AdminRegistration.tsx">Perbarui Admin</span></span>
                        </> : <>
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline" data-unique-id="d82b2e62-10b7-495b-b020-7ec6fbb46485" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="39f76d9d-d118-4849-9bc6-6f691e71dd21" data-file-name="components/AdminRegistration.tsx">Tambah Admin</span></span>
                        </>}
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {/* Status messages */}
          {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 rounded-md flex items-center`} data-unique-id="3290fda8-56d2-48c8-a3db-275036be2c03" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
              {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              <span data-unique-id="63cb95b9-d401-4e99-8534-0a8492e20bcf" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{statusMessage.message}</span>
            </div>}

          {/* Admins list */}
          <div data-unique-id="208b7c02-5f40-4ae4-9511-ef6a1a204ddd" data-file-name="components/AdminRegistration.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="ec7248f3-0889-438a-90d6-96e270a3ad15" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="4e1e5392-0549-4ce6-a357-549b537c99a3" data-file-name="components/AdminRegistration.tsx">Daftar Admin</span></h3>
            <div className="overflow-x-auto" data-unique-id="2c137ec7-6c12-4651-980e-61dd3335a80b" data-file-name="components/AdminRegistration.tsx">
              <Table data-unique-id="7f4d4e4f-4647-4640-85c6-9679232f0a1f" data-file-name="components/AdminRegistration.tsx">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><span className="editable-text" data-unique-id="f8ddce18-459c-4c85-ac4c-423480deceed" data-file-name="components/AdminRegistration.tsx">No.</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="5941162c-0ac0-4518-819e-ba62edd50942" data-file-name="components/AdminRegistration.tsx">Email</span></TableHead>
                    <TableHead><span className="editable-text" data-unique-id="f5217435-33d5-46a8-9427-0d75a5a32a95" data-file-name="components/AdminRegistration.tsx">Kode Akses</span></TableHead>
                    <TableHead className="hidden md:table-cell"><span className="editable-text" data-unique-id="7c0ec2e2-a2bf-4de7-b9d7-79eda81a4b1a" data-file-name="components/AdminRegistration.tsx">Tanggal Dibuat</span></TableHead>
                    <TableHead className="text-right"><span className="editable-text" data-unique-id="fedc02b2-ee69-4a62-b5a8-b0537188cfe3" data-file-name="components/AdminRegistration.tsx">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center" data-unique-id="2e38ed5a-53e7-4077-9509-a5f3fff95794" data-file-name="components/AdminRegistration.tsx">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="0d04521a-df90-44f7-9b0c-750c6b09f4e0" data-file-name="components/AdminRegistration.tsx"></div>
                        </div>
                      </TableCell>
                    </TableRow> : error ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow> : admins.length === 0 ? <TableRow>
                      <TableCell colSpan={5} className="text-center py-8"><span className="editable-text" data-unique-id="7a4dbb9d-f4b3-4e87-86fa-d4443d43e937" data-file-name="components/AdminRegistration.tsx">
                        Belum ada admin. Silakan tambahkan admin baru.
                      </span></TableCell>
                    </TableRow> : Array.isArray(admins) && admins.map((admin, index) => <TableRow key={admin.id} data-unique-id="c406dd7f-28cd-4715-9fd9-537fc06421e7" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                        <TableCell data-unique-id="41345d4a-4664-4e30-9253-40be63a6ca94" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{index + 1}</TableCell>
                        <TableCell className="font-medium" data-unique-id="c8258043-6ad0-4ce3-998f-2fb4c2ab9946" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.email}</TableCell>
                        <TableCell data-unique-id="96852ef3-5da9-4205-86ce-fc513c666e98" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">{admin.accessCode}</TableCell>
                        <TableCell className="hidden md:table-cell" data-unique-id="aa5aa964-6cde-4f13-b4bc-e8a665c5d248" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          {admin.createdAt ? formatDistanceToNow(new Date(admin.createdAt), {
                      addSuffix: true
                    }) : "-"}
                        </TableCell>
                        <TableCell className="text-right" data-unique-id="d082b3e4-2388-4b79-9413-5edc0f35778d" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true">
                          <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="461024de-0a57-4618-ba43-1c7d65dd9231" data-file-name="components/AdminRegistration.tsx">
                            <Button variant="outline" size="sm" onClick={() => startEditing(admin)} disabled={editingAdmin !== null} className="flex items-center" title="Edit" data-is-mapped="true" data-unique-id="966cfa66-48f5-48ce-aaf3-43aade129fda" data-file-name="components/AdminRegistration.tsx">
                              <Pencil className="h-4 w-4" data-unique-id="7a68c209-55c4-46c0-ad39-e5760537075a" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="40a51d48-947b-4f69-b4e3-ac523829d8f2" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="2d372969-7950-4513-8abf-2362b62ecd2f" data-file-name="components/AdminRegistration.tsx">Edit</span></span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAdmin(admin.id)} disabled={editingAdmin !== null || isLoading} className="text-red-500 hover:text-red-700 flex items-center" title="Hapus" data-is-mapped="true" data-unique-id="8c0cefb7-7aff-4cc3-ab03-51567f929d58" data-file-name="components/AdminRegistration.tsx">
                              <Trash2 className="h-4 w-4" data-unique-id="dafccc53-5689-48c1-910e-7c0496e4ab92" data-file-name="components/AdminRegistration.tsx" data-dynamic-text="true" />
                              <span className="sr-only" data-is-mapped="true" data-unique-id="7017e735-6ed1-468e-b70f-d28ae92f3e1d" data-file-name="components/AdminRegistration.tsx"><span className="editable-text" data-unique-id="6b8cc99b-4a74-48c3-8170-fbfd166bcc66" data-file-name="components/AdminRegistration.tsx">Hapus</span></span>
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