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
  return <div className="space-y-6" data-unique-id="f74e087e-ee2c-4672-94f7-0b2452abd7ae" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="4a3b7bfa-f08a-4d8b-ac42-ba5d326d5b38" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="a93bab0d-c829-4d2a-9634-2a4efe6f1b2e" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="20412c3d-d6aa-42a7-833c-e087ceec37fb" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="109b9457-f330-4014-87bc-b0849cdd8d46" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="5162e72c-45d1-4d2e-8b79-55a9b7df0e72" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="1072e19c-8fed-4a61-84de-cb9e3036e651" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="4f4da434-90c6-44b4-98a9-47c0f269f8a1" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="88c5170e-4e3b-4204-8f12-c94881b06d23" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="03e88ae0-dd17-4a66-ab24-c551acec4f84" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}