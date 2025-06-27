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
    return <Card data-unique-id="69169ff5-0762-478b-9b96-66fd53fcb16f" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardHeader data-unique-id="f08aa207-4d0e-4433-bd7e-4d500ae75fc0" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="1745d49f-0b2d-48f8-be5c-4722475873cd" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <TrendingUp className="h-5 w-5" />
            <span className="editable-text" data-unique-id="a76ea8fb-1616-4af7-b826-32a92fd53fa1" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="aabcb466-f8d7-4752-bdbb-7edb25ce0c44" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <div className="text-center py-8" data-unique-id="c4fbe9eb-1cda-4a5a-98e0-f0e7ccc073a8" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <p className="text-muted-foreground" data-unique-id="a93b2025-31af-4079-861a-f7914373b756" data-file-name="components/statistics/UserCategoryDistribution.tsx">
              <span className="editable-text" data-unique-id="938e47ab-c23c-4b4a-b401-a5d7da18c811" data-file-name="components/statistics/UserCategoryDistribution.tsx">Tidak ada data distribusi kategori tersedia</span>
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
  return <Card data-unique-id="78c76295-1063-4bcf-9fab-0fbbf548881b" data-file-name="components/statistics/UserCategoryDistribution.tsx">
      <CardHeader data-unique-id="e6c5f813-1152-457f-bb70-fff0ddbd9819" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="278a2e78-7098-4614-99ee-69a013088866" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <TrendingUp className="h-5 w-5" />
          <span className="editable-text" data-unique-id="d9665593-f231-4f14-9e17-e473a71435d4" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="713dadaa-9e00-4127-b76f-52e06bf7382d" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-unique-id="25641d51-495a-4edf-bd41-af259df80984" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
          {categoryDistribution.map(item => {
          const percentage = totalUsers > 0 ? (item.users / totalUsers * 100).toFixed(1) : '0';
          return <div key={item.categories} className="bg-muted p-4 rounded-lg" data-unique-id="37ee33ff-5bdb-4378-a899-b1bf5f3c7e5b" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                <div className="flex items-center justify-between" data-unique-id="df229d9d-6874-42c6-968c-db7dad08521b" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                  <div data-unique-id="93458fca-284b-4004-b8b9-fb8378b0c62a" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                    <p className="text-sm font-medium text-muted-foreground" data-unique-id="e4251ae5-ab00-4061-ae76-46fef8edd0dc" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="82e68fbf-ac00-4302-bee8-b983440ad9b5" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.categories} Kategori</span>
                    </p>
                    <p className="text-2xl font-bold" data-unique-id="23190417-4271-4238-9434-9cd6357c5b82" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.users}</p>
                    <p className="text-xs text-muted-foreground" data-unique-id="86563a8e-86fa-4d05-999c-b32a4bf5de20" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="a1c03892-b029-47b5-b25c-2eb0374c3ee8" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{percentage}% dari total</span>
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>;
        })}
        </div>

        {/* Chart */}
        <div className="h-80" data-unique-id="0cc4c584-4579-43fe-bd55-e293fe714b77" data-file-name="components/statistics/UserCategoryDistribution.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="a04f43fe-41b0-4bb6-aa51-fb89e18713ce" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <p className="text-sm text-blue-800" data-unique-id="88bf2e62-cb11-4e5f-8920-ffbd92203a96" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <span className="editable-text" data-unique-id="cf9017ec-8858-427f-875e-db8a1f289208" data-file-name="components/statistics/UserCategoryDistribution.tsx">Menampilkan distribusi jumlah kategori per user. Total </span>
            <strong data-unique-id="41638222-63a3-47c8-8244-358dd5ee7ae4" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{totalUsers}</strong>
            <span className="editable-text" data-unique-id="88d2b20a-63f6-4086-bb13-65ed517c1717" data-file-name="components/statistics/UserCategoryDistribution.tsx"> users terdaftar dengan distribusi kategori yang berbeda-beda.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}