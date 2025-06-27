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
  return <Tabs defaultValue="bar" className="space-y-4" data-unique-id="033b85df-f046-403f-a2cf-df23dacf9c86" data-file-name="components/statistics/StatisticsCharts.tsx">
      <TabsList>
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span className="editable-text" data-unique-id="a31fc621-32ec-40d4-a6bb-c91f01728be7" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Batang</span>
        </TabsTrigger>
        <TabsTrigger value="line" className="flex items-center gap-2">
          <LineChartIcon className="h-4 w-4" />
          <span className="editable-text" data-unique-id="5d5a929f-2759-450b-84a4-24e0452377f8" data-file-name="components/statistics/StatisticsCharts.tsx">Grafik Garis</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="space-y-4">
        <Card data-unique-id="1a8e5096-a812-470b-8f93-e54654886863" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="7c89e5ac-b939-4381-95a3-8d46be7ca819" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="48df1724-6a36-4951-a3a2-d71bb863c169" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="97f85299-bfa4-4180-ae8a-d9a924791467" data-file-name="components/statistics/StatisticsCharts.tsx">Pendaftaran User Per Bulan</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="b67f145b-4ed1-428b-aecf-415dd8bd6c0f" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="8cd8ee24-a05d-49c5-9929-e04fb07b45de" data-file-name="components/statistics/StatisticsCharts.tsx">
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
        <Card data-unique-id="cbd3e571-2add-4d0c-9726-5db07a76b928" data-file-name="components/statistics/StatisticsCharts.tsx">
          <CardHeader data-unique-id="7f7328df-0a73-4570-959d-bca914468c01" data-file-name="components/statistics/StatisticsCharts.tsx">
            <CardTitle data-unique-id="7dc3bd2c-1fdd-4bd7-95ae-480b8cb2c194" data-file-name="components/statistics/StatisticsCharts.tsx">
              <span className="editable-text" data-unique-id="5ba2d54b-28b4-40ff-988e-bdd0b641c9a5" data-file-name="components/statistics/StatisticsCharts.tsx">Tren Pertumbuhan User</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="18e75d42-2bee-4e7f-8bf6-135c7a2db106" data-file-name="components/statistics/StatisticsCharts.tsx">
            <div className="h-80" data-unique-id="a7546b95-8405-4035-9cbc-aa81e6280457" data-file-name="components/statistics/StatisticsCharts.tsx">
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