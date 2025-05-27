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
  return <div className="space-y-6" data-unique-id="25b23108-75cc-4040-ab51-b3234fa2b92d" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="e8d351e4-e88d-4e59-843d-91c9dabf8271" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="3727863b-df5f-42de-ad1b-b5de4bf52dce" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="2479d99e-8411-4a4a-b40e-ef042b7dbd4f" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="e7594f75-9f2f-4cf1-a229-e0ddca94c659" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="57b18a5a-a7f5-45c8-b89b-5b92dcbf7ea4" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="12e37fd0-2c8b-4e85-8ca3-03e88bce8fa5" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="6b497e19-ae48-4e68-83da-40d48a2356cf" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="f5af39e6-7071-4c4f-864d-5817b5680649" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="f644ade6-f606-436e-b136-919b4cde0fa6" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}