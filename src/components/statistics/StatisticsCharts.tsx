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
  return <Tabs defaultValue="bar" className="space-y-4" data-unique-id="02342429-d8e3-416c-ab60-2314129a4893" data-file-name="components/statistics/StatisticsCharts.tsx">
      <TabsList>
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="editable-text" data-unique-id="48cc0d59-dc22-403e-8b84-787b63f6808d" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Batang</span>
        </TabsTrigger>
        <TabsTrigger value="line" className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          <span className="editable-text" data-unique-id="4a901e99-6aa5-43b9-aba1-38409e31c388" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Garis</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="space-y-4">
        <Card data-unique-id="88720cfc-b360-49e6-bda3-7f001c978808" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="4b18c062-3315-4538-b90e-2596713233f9" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="e836030c-4a08-40de-825b-11c47da50cdd" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="efd7f8fe-8a58-4e3f-998f-466e6eeb2394" data-file-name="components/statistics/StatisticsCharts.tsx">Pendaftaran User Per Bulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="c94bce65-d871-482e-8270-1bc9429cf18f" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="8cf88292-2ac3-478f-bce9-ef761a37957e" data-file-name="components/statistics/StatisticsCharts.tsx">
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
        <Card data-unique-id="a861def8-55c8-42f0-bf28-14c353716bc2" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="a8ead845-39da-46f7-b5f5-52ec32fda2e1" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="e7dea970-e279-44a3-9302-522ccad5b853" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="9d8dea5f-dbf6-436c-913d-dc01b8f867f6" data-file-name="components/statistics/StatisticsCharts.tsx">Tren Pertumbuhan User</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="22c256aa-506d-421e-8e70-8f6c11e1dace" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="23e9280f-4bd0-4246-a2f9-94e9eb491717" data-file-name="components/statistics/StatisticsCharts.tsx">
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