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
    return <Card data-unique-id="de330df7-abc0-4d71-892a-23487b2413a3" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardHeader data-unique-id="7f76038f-be2d-407a-969c-5768c4956d0f" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="e5ccffdc-5f3a-418b-b601-1ff84a1eec7c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <TrendingUp className="h-5 w-5" />
            <span className="editable-text" data-unique-id="ff291461-fcd1-4583-bc37-f54da9510c34" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="d734b800-b5b6-48c3-b227-eb8c4465f13c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <div className="text-center py-8" data-unique-id="8b2c0732-4a13-4b47-87cb-5a81b1cf7d4c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <p className="text-muted-foreground" data-unique-id="4a20a542-5aaa-4eb2-b54c-0845114aef9c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
              <span className="editable-text" data-unique-id="f0ce275c-9c36-44d0-ae4d-791af6408a80" data-file-name="components/statistics/UserCategoryDistribution.tsx">Tidak ada data distribusi kategori tersedia</span>
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
  return <Card data-unique-id="73fd723b-ce37-4065-88b6-364f20a3e8e7" data-file-name="components/statistics/UserCategoryDistribution.tsx">
      <CardHeader data-unique-id="2c5442d6-5fdb-44a7-8da1-6a3c5947bb31" data-file-name="components/statistics/UserCategoryDistribution.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="c7298da6-a3cf-460c-bf20-e4214a118780" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <TrendingUp className="h-5 w-5" />
          <span className="editable-text" data-unique-id="b8dcdc0b-ce99-4a2c-84b7-35740c8bb6df" data-file-name="components/statistics/UserCategoryDistribution.tsx">Analisis Statistik User Per Kategori</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="bbdcd662-8c81-49c5-bd79-4a3d49f5b4d5" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-unique-id="21fc8618-ce0c-41b9-9e64-8e1ca021f7b9" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">
          {categoryDistribution.map(item => {
          const percentage = totalUsers > 0 ? (item.users / totalUsers * 100).toFixed(1) : '0';
          return <div key={item.categories} className="bg-muted p-4 rounded-lg" data-unique-id="0074bf3c-df84-479c-b16e-e033648bed62" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                <div className="flex items-center justify-between" data-unique-id="d75bd51f-926e-4bd1-bf41-cb7e53b0f8ee" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                  <div data-unique-id="99d0c89e-3736-4667-b660-f6d886b1cb3c" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                    <p className="text-sm font-medium text-muted-foreground" data-unique-id="c57e3901-43bd-47a2-9137-0ea035caeb67" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="6a0670f0-2bb7-4170-9f68-78d8d34b39ab" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.categories} Kategori</span>
                    </p>
                    <p className="text-2xl font-bold" data-unique-id="27343eb3-20a8-4d9c-aee9-c732501e6b16" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{item.users}</p>
                    <p className="text-xs text-muted-foreground" data-unique-id="f6698f36-9743-4649-b317-8f1af0314c47" data-file-name="components/statistics/UserCategoryDistribution.tsx">
                      <span className="editable-text" data-unique-id="ff2188e0-60d7-4dbe-903d-7eceffd3062b" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{percentage}% dari total</span>
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>;
        })}
        </div>

        {/* Chart */}
        <div className="h-80" data-unique-id="ffcd3214-be02-4515-9097-bebc9e2c9296" data-file-name="components/statistics/UserCategoryDistribution.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="fba8b75a-8fec-400a-8302-8f6dad2f51b5" data-file-name="components/statistics/UserCategoryDistribution.tsx">
          <p className="text-sm text-blue-800" data-unique-id="9fdfefec-f422-4210-980c-aa5c81006fec" data-file-name="components/statistics/UserCategoryDistribution.tsx">
            <span className="editable-text" data-unique-id="63ff33db-e8fb-4aa3-99b7-7ce32006511c" data-file-name="components/statistics/UserCategoryDistribution.tsx">Menampilkan distribusi jumlah kategori per user. Total </span>
            <strong data-unique-id="ff4ba7fc-0122-4a44-aa41-eaec8f969a01" data-file-name="components/statistics/UserCategoryDistribution.tsx" data-dynamic-text="true">{totalUsers}</strong>
            <span className="editable-text" data-unique-id="ccc7350d-af81-4472-935b-5ede94525143" data-file-name="components/statistics/UserCategoryDistribution.tsx"> users terdaftar dengan distribusi kategori yang berbeda-beda.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}