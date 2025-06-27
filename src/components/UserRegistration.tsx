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
  return <div className="space-y-6" data-unique-id="48c41bc2-7f95-4b04-8c94-f0c9fdc37314" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="c5c7b145-5eaf-4ee5-93d7-ca15e305a9dd" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="64dc9c0b-9f13-4a04-aece-dbf51783fecf" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="15d558f8-1169-4263-bbbb-86cf6ddf8a26" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="1bef2070-9448-4d45-8c5c-cde40a0e8772" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="6cf4c406-9a9c-46b8-afbf-eb4f0ee9ff52" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="6352b0ae-60e3-4e2e-ba3d-5ba7d0bbeac4" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="e97e26f2-1443-4957-984b-6cac146e684b" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="d019d446-f498-4f06-b960-3e78928df511" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="dea57e9d-95da-449e-805a-04ed1e4b7d78" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}