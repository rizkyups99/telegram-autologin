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
  return <Tabs defaultValue="bar" className="space-y-4" data-unique-id="a0150906-e2af-49a3-b361-ce44da27c13d" data-file-name="components/statistics/StatisticsCharts.tsx">
      <TabsList>
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="editable-text" data-unique-id="961d4197-af2a-496a-b920-3bc980772960" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Batang</span>
        </TabsTrigger>
        <TabsTrigger value="line" className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          <span className="editable-text" data-unique-id="203e6786-36a3-44db-8414-9b310b1ce03b" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Garis</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="space-y-4">
        <Card data-unique-id="11826742-a9f2-46ee-af97-e7e34e6065a8" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="e968cbd9-66ba-4c31-9428-f9e198359468" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="45b36200-11fb-4bfb-8d21-8de0546e59e2" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="aed7b6f0-d6a2-4257-aaa3-a6b6d9b9bc77" data-file-name="components/statistics/StatisticsCharts.tsx">Pendaftaran User Per Bulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="edeee512-051b-4cf0-8d08-f3aa144a78fe" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="fc4ae008-cd79-4172-a326-4ff8d4209784" data-file-name="components/statistics/StatisticsCharts.tsx">
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
        <Card data-unique-id="5f6eed6b-75f7-4b18-a6d1-067d812d086c" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="09d109cb-8100-4e26-a25d-dce0f5c6dc62" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="25141606-710d-4132-9f55-ea76380057fa" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="332f2f85-9841-4fc5-bb1e-fcc57f2f2ef7" data-file-name="components/statistics/StatisticsCharts.tsx">Tren Pertumbuhan User</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="96848e80-4f67-4a4f-aa96-f89fb78d16b9" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="0ae5d64d-c44c-4ec4-b2c0-ca0d3fb8711d" data-file-name="components/statistics/StatisticsCharts.tsx">
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