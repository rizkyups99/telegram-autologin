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
    return <Card data-unique-id="cdb66f1f-4803-44fa-a3aa-b638cf713786" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardHeader data-unique-id="829a9a00-2da5-4085-80fb-4ab789c75c32" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="b27acb35-9281-4f32-bbe5-915e5c67cb7b" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <TrendingUp className="h-5 w-5" />
            <span className="editable-text" data-unique-id="0af31b27-c378-4fbb-beb5-a0b82b4237c0" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="368a4141-fbaa-4dbd-8a06-448429602012" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <div className="text-center py-8" data-unique-id="adf00388-b0d2-4b30-b635-1667d660a0f5" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <p className="text-muted-foreground" data-unique-id="d063722e-1228-41f8-b3d4-5b1403a13a2c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
              <span className="editable-text" data-unique-id="a9de24b6-3e34-469d-af3f-94c9cb88e49d" data-file-name="components/statistics/UserCategoryDistribution.tsx">Tidak ada data distribusi kategori tersedia</span>
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
  return <Card data-unique-id="1242aeb5-074b-47ee-93e7-f028c2b76095" data-file-name="components/statistics/UserCategoryDistribution.tsx">
      <CardHeader data-unique-id="2c0cec09-9be8-4b51-b637-6dc40372350f" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="16cb8ceb-51f7-458b-a270-0bdab68a037a" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <TrendingUp className="h-5 w-5" />
          <span className="editable-text" data-unique-id="47df2c4b-6be2-4db0-b9ac-11e92b25e267" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="5f650ffd-33e2-49a5-a0c0-ea8073898c9a" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-unique-id="f3e040cf-c071-410e-85e9-6a76a169c334" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
          {categoryDistribution.map(item => {
          const percentage = totalUsers > 0 ? (item.users / totalUsers * 100).toFixed(1) : '0';
          return <div key={item.categories} className="bg-muted p-4 rounded-lg" data-unique-id="c4e4ec7d-4324-4733-ab78-d2d2aee32108" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                <div className="flex items-center justify-between" data-unique-id="074a3b5f-bd6d-4d5d-94e4-7a029f5aa709" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                  <div data-unique-id="d5e9b05c-e81c-4c7b-9001-0b3435227d7e" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                    <p className="text-sm font-medium text-muted-foreground" data-unique-id="98ccd70b-1028-42d3-9d66-955f79aa4709" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="53ee9c7b-8dca-4d87-8742-6da41b77dba6" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.categories} Kategori</span>
                    </p>
                    <p className="text-2xl font-bold" data-unique-id="c851b97d-f48c-45e3-8986-56056856879f" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.users}</p>
                    <p className="text-xs text-muted-foreground" data-unique-id="cf43a4c8-917d-4a60-af70-4f8b452c150e" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="0f96c5dd-6f42-4704-8778-0592a0162b0c" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{percentage}% dari total</span>
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>;
        })}
        </div>

        {/* Chart */}
        <div className="h-80" data-unique-id="135315c3-d789-4731-85d0-a09cbff435a3" data-file-name="components/statistics/UserCategoryDistribution.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="4fbe59a7-dc24-4227-b1e4-3eeccb942da6" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <p className="text-sm text-blue-800" data-unique-id="6e3e2a47-7877-4b7d-ab5f-62505740dd1c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <span className="editable-text" data-unique-id="c9e5aee0-cabd-4113-ad40-200ec381a35a" data-file-name="components/statistics/UserCategoryDistribution.tsx">Menampilkan distribusi jumlah kategori per user. Total </span>
            <strong data-unique-id="93e6657f-5006-46e4-9c0a-3ee074005485" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{totalUsers}</strong>
            <span className="editable-text" data-unique-id="6ecf56c3-fd7d-4645-985f-74e55736db47" data-file-name="components/statistics/UserCategoryDistribution.tsx"> users terdaftar dengan distribusi kategori yang berbeda-beda.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}