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
    return <Card data-unique-id="c184cdaf-1cf7-4d53-a637-7bd3ca66cf87" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardHeader data-unique-id="9ea1e97a-0abe-4181-867e-473d8996587e" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="c139084c-2ae8-49d0-85cf-920a84a82687" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <TrendingUp className="h-5 w-5" />
            <span className="editable-text" data-unique-id="257c65d1-0325-40de-ac4b-9ab55ae129f2" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="4d7c74cd-17b5-4407-ba18-7fe7e6bc71b6" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <div className="text-center py-8" data-unique-id="fb30a5a4-4295-4a1b-8ec5-45c2286f3464" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <p className="text-muted-foreground" data-unique-id="cab23579-401b-488e-aa2d-06ff8c1f02cd" data-file-name="components/statistics/UserCategoryDistribution.tsx">
              <span className="editable-text" data-unique-id="24416bc4-ca08-47eb-b3b7-f7ff2109e68e" data-file-name="components/statistics/UserCategoryDistribution.tsx">Tidak ada data distribusi kategori tersedia</span>
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
  return <Card data-unique-id="15dbfebc-41ba-4096-9b91-3a0fc8c9eee6" data-file-name="components/statistics/UserCategoryDistribution.tsx">
      <CardHeader data-unique-id="a34c658c-c6a1-4f56-bbcc-3b6ee6066aa7" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="299f51b6-cfc6-43af-96fa-541b6a5f7779" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <TrendingUp className="h-5 w-5" />
          <span className="editable-text" data-unique-id="1805d93f-98ef-4e22-bf65-4ebc2db9a43a" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="244f91a0-595b-4c18-b29e-b7ea5ca7971e" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-unique-id="1af5789f-100a-430d-9b02-a90947e821d3" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
          {categoryDistribution.map(item => {
          const percentage = totalUsers > 0 ? (item.users / totalUsers * 100).toFixed(1) : '0';
          return <div key={item.categories} className="bg-muted p-4 rounded-lg" data-unique-id="6f3ab183-bdb4-45a9-9d80-773e99086509" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                <div className="flex items-center justify-between" data-unique-id="2f8a2757-5905-41bf-8242-51dee63a9849" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                  <div data-unique-id="16c42c60-7eac-42f7-892a-5f7030dc62d1" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                    <p className="text-sm font-medium text-muted-foreground" data-unique-id="b7038783-6f24-4446-be5f-bf0e38056cd5" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="5ded1b8f-e8a3-465c-b3dd-1bc189500da2" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.categories} Kategori</span>
                    </p>
                    <p className="text-2xl font-bold" data-unique-id="d225a048-256a-40d8-8edc-7dfa62d06525" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.users}</p>
                    <p className="text-xs text-muted-foreground" data-unique-id="49ff0f94-5667-4c21-a658-086fdec87699" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="89fe470f-3e85-4b6e-8acb-834d4df84717" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{percentage}% dari total</span>
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>;
        })}
        </div>

        {/* Chart */}
        <div className="h-80" data-unique-id="d8ec8ea2-14e1-47c5-a01f-90d02f33ff35" data-file-name="components/statistics/UserCategoryDistribution.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="1ea8313e-b738-44cf-910f-6325950c18d7" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <p className="text-sm text-blue-800" data-unique-id="6d49aea0-6cdc-4705-8f08-3865c78cb003" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <span className="editable-text" data-unique-id="e8317441-d6b7-442d-ba30-59c73a634d66" data-file-name="components/statistics/UserCategoryDistribution.tsx">Menampilkan distribusi jumlah kategori per user. Total </span>
            <strong data-unique-id="231f477b-6139-45b7-8333-e4a22c9c97ba" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{totalUsers}</strong>
            <span className="editable-text" data-unique-id="1d405f03-e168-4153-9add-b8aa31d900e4" data-file-name="components/statistics/UserCategoryDistribution.tsx"> users terdaftar dengan distribusi kategori yang berbeda-beda.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}