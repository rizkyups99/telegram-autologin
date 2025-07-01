'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import UserTable from './UserTable';
import { User } from '@/db/schema';
interface UserWithAccess extends Omit<User, 'createdAt'> {
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
  audioCloudCategoryIds?: number[];
  pdfCloudCategoryIds?: number[];
  fileCloudCategoryIds?: number[];
  createdAt?: string;
  created_at?: string;
}
export default function UserRegistration() {
  const [users, setUsers] = useState<UserWithAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-6" data-unique-id="70f36a29-2d38-4c94-8c27-d5e36096d762" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="e1202db4-ea48-4752-b9e2-3a2bf8875ba3" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="f95a9aca-c5f8-4618-bd7f-d0f677eb4e90" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="495343a6-c35f-4820-9486-c0bb37233718" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="2d278b82-026e-4cba-aa2b-135cd3803bd5" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="79b3ae56-5350-4dc2-abae-04d0cf79a73a" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="a65c9649-3350-4b51-ab60-9c0423074418" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="1c5a7c36-3e9e-4838-aef0-064c21f1d08f" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7ea759a3-4718-427d-a659-30efe72917f6" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="45b10651-eae5-4348-8c18-ec0857c2c62b" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}