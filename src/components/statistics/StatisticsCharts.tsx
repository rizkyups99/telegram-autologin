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
  return <Tabs defaultValue="bar" className="space-y-4" data-unique-id="69d11a9e-2e1b-4e68-928b-8a8730456b70" data-file-name="components/statistics/StatisticsCharts.tsx">
      <TabsList>
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="editable-text" data-unique-id="427af635-1a1a-4012-a3f1-b21838a54408" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Batang</span>
        </TabsTrigger>
        <TabsTrigger value="line" className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          <span className="editable-text" data-unique-id="b778c905-85af-4d61-bb4c-3b6eb005fb3c" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Garis</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="space-y-4">
        <Card data-unique-id="5ff55f0a-db39-498f-92dd-0aeeaf3f9239" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="de78f695-d71c-4a6f-a225-a4c2ba284a1b" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="cf0165dd-2de9-4e7e-8817-755594f6c56e" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="8daa677a-d09c-40fd-9b29-75fdd8f41a67" data-file-name="components/statistics/StatisticsCharts.tsx">Pendaftaran User Per Bulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="8fd14931-a653-4013-bc04-461e2bd89e85" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="e3bd9ba7-1d4c-4797-81ee-bb87f4d7072d" data-file-name="components/statistics/StatisticsCharts.tsx">
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
        <Card data-unique-id="9e645101-154a-43ee-81dd-7704c2df066d" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="3c33a2c9-a175-4c62-be65-9cc404fb0707" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="580418b4-690e-4f4a-bf67-a57181ce0c58" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="5f1f37cb-55dc-474f-85ce-07d8b0ea1d00" data-file-name="components/statistics/StatisticsCharts.tsx">Tren Pertumbuhan User</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="9d3ba3d8-b0fc-4057-b93b-b1951ee3eb82" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="f1dd25ed-e3e5-40af-b5cb-ac6367fbe5c7" data-file-name="components/statistics/StatisticsCharts.tsx">
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