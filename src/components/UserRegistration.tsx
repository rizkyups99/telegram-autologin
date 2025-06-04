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
  return <div className="space-y-6" data-unique-id="afd6ca29-d43d-4d6e-b410-875d37480c2a" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="cf738a67-ff64-427f-bc62-e68d09dbcdd0" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="448741d2-021b-48f3-a816-a1d6b5a08565" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="bcfdee6e-ab8d-4724-af1a-8b000279dac6" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="77a1031c-b48a-4f3e-9e6a-a2155607555b" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="18383a2c-9ac5-4254-8deb-1a954413045c" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="77dbab1d-8083-4459-b114-282318a243ea" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="a31ed258-6cc0-43ce-b9c0-c1b6b09288dc" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="8aa166c3-7921-4907-84ff-1d45eba5e07f" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="e7447600-b58c-4e2d-bf65-b7d2626fb68e" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}