'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import UserTable from './UserTable';
import { User } from '@/db/schema';
interface UserWithAccess extends User {
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
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
  return <div className="space-y-6" data-unique-id="87dc0bb4-c3c4-4efb-91a2-df8b0305894b" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="18ed8c35-b6d8-42be-a87b-c2ffcbee97f7" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="1cbbc595-37ee-4021-8fcc-32e3e5217a15" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="9eccb1a3-4e96-4c7d-848e-ae90266469cc" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="8fa2d329-d05a-400e-9809-ffc386522bbc" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="30dca431-3d28-4cff-a414-078cc3fa53d4" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="a9107491-a140-4e9f-86bc-3c04a10c4a7a" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="1a448bef-1369-4ad5-a895-0de8859367c5" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="dbdac852-7fb8-4c8d-8f1e-618376a9e68a" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="542f8c88-569d-4c8f-bb7b-ffb74e0c9007" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}