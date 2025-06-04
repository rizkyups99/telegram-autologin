'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';
import { CategoryDistribution } from './types';
interface UserCategoryDistributionProps {
  categoryDistribution: CategoryDistribution[];
}
export function UserCategoryDistribution({
  categoryDistribution
}: UserCategoryDistributionProps) {
  if (!categoryDistribution || categoryDistribution.length === 0) {
    return <Card data-unique-id="ab8ab8e2-9217-4f38-bcbe-07739db2625b" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardHeader data-unique-id="2ea52117-4231-445c-9e9a-823b47692579" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="70ced881-b203-43e0-9ea3-a74b6041c438" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <TrendingUp className="h-5 w-5" />
            <span className="editable-text" data-unique-id="c6d174e9-a7d1-44e9-887e-ac88ba891864" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="7c4e4de8-0b59-4218-a5b0-e50bc735cf9f" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <div className="text-center py-8" data-unique-id="b740c58c-954f-4caf-ba25-c59adefd8da8" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <p className="text-muted-foreground" data-unique-id="88829b48-fc5d-4066-943b-8915116e8896" data-file-name="components/statistics/UserCategoryDistribution.tsx">
              <span className="editable-text" data-unique-id="79a9e730-04c4-43b2-a8da-74a094dcc614" data-file-name="components/statistics/UserCategoryDistribution.tsx">Tidak ada data distribusi kategori tersedia</span>
            </p>
          </div>
        </CardContent>
      </Card>;
  }
  const totalUsers = categoryDistribution.reduce((sum, item) => sum + item.users, 0);

  // Prepare data for chart
  const chartData = categoryDistribution.map(item => ({
    categories: item.categories === 0 ? 'Tanpa Kategori' : `${item.categories} Kategori`,
    users: item.users,
    percentage: totalUsers > 0 ? (item.users / totalUsers * 100).toFixed(1) : '0'
  }));
  return <Card data-unique-id="2dcf482b-1388-4c0e-a268-71a48e72907b" data-file-name="components/statistics/UserCategoryDistribution.tsx">
      <CardHeader data-unique-id="86be2ad4-b8d6-4a83-8167-0c877a72dc33" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="8f28c25c-f555-44e8-990f-ed5e016bac08" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <TrendingUp className="h-5 w-5" />
          <span className="editable-text" data-unique-id="a9cd6930-f586-4f16-a72f-42c8f83d0be8" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="d005de99-cc02-4dfb-9f06-f941ef043bf6" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-unique-id="2fa95e58-11e9-4b63-8dc7-78dbab23bc59" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
          {categoryDistribution.map(item => {
          const percentage = totalUsers > 0 ? (item.users / totalUsers * 100).toFixed(1) : '0';
          return <div key={item.categories} className="bg-muted p-4 rounded-lg" data-unique-id="9278b475-f8e9-48bb-8ba6-1d958a495c47" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                <div className="flex items-center justify-between" data-unique-id="075474e7-be5c-4a66-8957-2095e89c80eb" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                  <div data-unique-id="d854f1cc-78e4-40e2-acb5-a204a36befd8" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                    <p className="text-sm font-medium text-muted-foreground" data-unique-id="77e241ad-9ca9-445a-b767-667c79b06d54" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="eb358789-bcd7-4560-be2c-2e4f5305209e" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.categories} Kategori</span>
                    </p>
                    <p className="text-2xl font-bold" data-unique-id="e1c3906d-774a-464f-8c63-73e8aa321f74" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.users}</p>
                    <p className="text-xs text-muted-foreground" data-unique-id="c1e3962f-b15c-4b84-93be-fc1a327189be" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="c0e00ec0-7185-46bb-acee-e8ad4d0f54f6" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{percentage}% dari total</span>
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>;
        })}
        </div>

        {/* Chart */}
        <div className="h-80" data-unique-id="dd1f40ab-c06f-4fa3-ae86-81c1e7bf4f90" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categories" tick={{
              fontSize: 12
            }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{
              fontSize: 12
            }} />
              <Tooltip formatter={(value, name) => [value, 'Users']} labelFormatter={label => `${label}`} labelStyle={{
              color: '#000'
            }} contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }} />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="86134d36-7c70-4cea-823e-c82384293b5f" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <p className="text-sm text-blue-800" data-unique-id="3505b802-a33c-4194-8a6a-1e388bf7660e" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <span className="editable-text" data-unique-id="e7744023-8a1e-4bfe-8e54-fd7589e41577" data-file-name="components/statistics/UserCategoryDistribution.tsx">Menampilkan distribusi jumlah kategori per user. Total </span>
            <strong data-unique-id="ee3b2092-e619-489c-a26e-eb781362e25c" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{totalUsers}</strong>
            <span className="editable-text" data-unique-id="8e458959-cc3b-47b9-95f8-be8048f7a683" data-file-name="components/statistics/UserCategoryDistribution.tsx"> users terdaftar dengan distribusi kategori yang berbeda-beda.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}