'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import { MonthlyData } from './types';
interface StatisticsChartsProps {
  monthlyData: MonthlyData[];
}
export function StatisticsCharts({
  monthlyData
}: StatisticsChartsProps) {
  return <Tabs defaultValue="bar" className="space-y-4" data-unique-id="4be05fa2-3988-4cd8-9a1f-67d5693b1500" data-file-name="components/statistics/StatisticsCharts.tsx">
      <TabsList>
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="editable-text" data-unique-id="3540c7e5-09ae-4460-86d7-5e314eaf4ff7" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Batang</span>
        </TabsTrigger>
        <TabsTrigger value="line" className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          <span className="editable-text" data-unique-id="bcd878e0-e6d8-4e45-976b-7ec090e326c4" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Garis</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="space-y-4">
        <Card data-unique-id="d6ce51b5-e09c-432a-9ba2-190170c0930f" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="df5efba1-d5b5-452f-b63a-2d13398591f7" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="3d47216b-2c24-4b0e-97c7-0abb7da44e57" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="65f1c9da-069e-48da-a1ce-590e75170a0f" data-file-name="components/statistics/StatisticsCharts.tsx">Pendaftaran User Per Bulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="f2ecdb08-fe1c-417b-98de-e7ee830c2854" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="47ff30d6-5edb-44e3-8545-d9c8b0f489d5" data-file-name="components/statistics/StatisticsCharts.tsx">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{
                  fontSize: 12
                }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{
                  fontSize: 12
                }} />
                  <Tooltip formatter={value => [value, 'Users']} labelStyle={{
                  color: '#000'
                }} contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="line" className="space-y-4">
        <Card data-unique-id="ce571f2a-aca7-42a1-aa7d-991a82f3d306" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="4bbdc691-02e9-4a96-9191-5e3e2dd35bdf" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="88a63b1d-e624-4db1-b2c2-b9c9a9e1f3a3" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="fac3cc01-82e3-4db9-89f2-43605dad0dd3" data-file-name="components/statistics/StatisticsCharts.tsx">Tren Pertumbuhan User</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="517897a6-d2c6-4b63-90c0-7c811e1995f8" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="c8fdf597-dc0b-44ab-8960-863a0c588396" data-file-name="components/statistics/StatisticsCharts.tsx">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{
                  fontSize: 12
                }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{
                  fontSize: 12
                }} />
                  <Tooltip formatter={value => [value, 'Users']} labelStyle={{
                  color: '#000'
                }} contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }} />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{
                  fill: '#3b82f6',
                  strokeWidth: 2,
                  r: 4
                }} activeDot={{
                  r: 6,
                  stroke: '#3b82f6',
                  strokeWidth: 2
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>;
}