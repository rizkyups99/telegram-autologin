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
  return <div className="space-y-6" data-unique-id="b4688771-30d9-47a0-9c01-ed18b65fc04b" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="57d26794-7d01-4872-9e15-30f60420d7a8" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="15f56037-4e48-49d2-b8d5-5c9b0a4721e4" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="0a737068-4759-4268-b520-906bb3bc8f83" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="a0a3c75d-d820-484f-8e26-d892077913ff" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9029ee86-06d9-483b-936e-47c0a2102a4a" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="780c1d92-66ec-4f7f-9aa9-cde328e47c13" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="f2a4eb6e-d76e-477b-8aa5-abc694803ee3" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="b306307e-efab-4471-84fb-979556aeb6fc" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="dc93c0d5-3c10-45fa-8454-d2065ad419ec" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}