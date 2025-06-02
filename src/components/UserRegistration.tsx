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
  return <div className="space-y-6" data-unique-id="e9b9c66a-f968-4315-9f7f-94d25d76a650" data-file-name="components/UserRegistration.tsx">
      <Card data-unique-id="81cb2050-117a-4ea5-8252-828e393d4aba" data-file-name="components/UserRegistration.tsx">
        <CardHeader data-unique-id="3ce3d172-d954-4c68-aa18-4e56d89f3e09" data-file-name="components/UserRegistration.tsx">
          <CardTitle data-unique-id="0d8c25f1-0c8a-49fd-aa6e-34bb40406e41" data-file-name="components/UserRegistration.tsx"><span className="editable-text" data-unique-id="e3ff86fe-98fe-4a57-832a-59d693d4681c" data-file-name="components/UserRegistration.tsx">Manajemen User</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="5bdf73db-9178-40cd-ac1d-9de4db99fe7d" data-file-name="components/UserRegistration.tsx">
            Tambah, edit, dan kelola akun pengguna dengan akses ke kategori konten
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="a811aa90-e8ad-4bc3-932c-5c11140ec0e5" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
          {isLoading && users.length === 0 ? <div className="flex justify-center py-8" data-unique-id="60c91777-8834-47f1-89f9-c63ed3a4128b" data-file-name="components/UserRegistration.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="2d6881bb-6242-4319-95af-2747847d7c93" data-file-name="components/UserRegistration.tsx"></div>
            </div> : error ? <div className="bg-red-50 text-red-800 p-4 rounded-md" data-unique-id="014ebef9-fcf6-47a3-8eb3-6b6072edfd5f" data-file-name="components/UserRegistration.tsx" data-dynamic-text="true">
              {error}
            </div> : <UserTable users={users} />}
        </CardContent>
      </Card>
    </div>;
}