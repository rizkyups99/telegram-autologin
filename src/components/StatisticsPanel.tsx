'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ReferenceLine, LabelList, Area, AreaChart, Brush } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader, TrendingUp, TrendingDown, BarChart2, LineChart as LineChartIcon, HelpCircle, Users, Calendar } from 'lucide-react';
type MonthlyData = {
  month: string;
  count: number;
};
type DailyData = {
  admin: string;
  [day: number]: number;
  total: number;
};
type CategoryData = {
  name: string;
  count: number;
};
export default function StatisticsPanel() {
  const [data, setData] = useState<{
    monthlyData: MonthlyData[];
    categorySummary: CategoryData[];
    availableMonths: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchStatistics();
  }, []);
  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const statisticsData = await response.json();
      setData(statisticsData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-64" data-unique-id="b523e2e6-70ed-4b74-9e24-4523d1a8899f" data-file-name="components/StatisticsPanel.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="06cb70c2-fab3-49d4-a3ae-8535aba81056" data-file-name="components/StatisticsPanel.tsx"></div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-8" data-unique-id="ec111938-b4a1-4636-b523-1b9a15f27166" data-file-name="components/StatisticsPanel.tsx">
        <p className="text-muted-foreground" data-unique-id="dcc5b8f0-f164-4631-a822-4a7b418b1b9b" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{error || 'Failed to load statistics data'}</p>
      </div>;
  }
  const totalUsers = data.monthlyData.reduce((sum, item) => sum + item.count, 0);
  const currentMonthData = data.monthlyData[data.monthlyData.length - 1];
  const previousMonthData = data.monthlyData[data.monthlyData.length - 2];
  const growth = previousMonthData ? (currentMonthData?.count - previousMonthData.count) / previousMonthData.count * 100 : 0;
  return <div className="space-y-6" data-unique-id="01b79e73-1237-4fa2-961c-7256d6c6cd7a" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="540e015b-4ef8-4594-b996-866bb6aa1102" data-file-name="components/StatisticsPanel.tsx">
        <Card data-unique-id="36f09f5a-39a5-4345-adc5-5b0dbf9cfdac" data-file-name="components/StatisticsPanel.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="51fed53e-ee95-44e9-9681-100cec83e5f2" data-file-name="components/StatisticsPanel.tsx">
            <CardTitle className="text-sm font-medium" data-unique-id="9724e560-0392-4ff2-a8ad-65ba74dd4e9d" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="145e8f8e-91fb-4940-899b-e566d7b3272f" data-file-name="components/StatisticsPanel.tsx">Total Users</span></CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent data-unique-id="5ff64e20-f98d-42b6-9f85-15f9d4b404f2" data-file-name="components/StatisticsPanel.tsx">
            <div className="text-2xl font-bold" data-unique-id="1f38dcbe-4785-425d-b513-f6c11511fac7" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{totalUsers}</div>
            <p className="text-xs text-muted-foreground" data-unique-id="71d15d5d-5f80-44a0-a179-a0ca42c77074" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="9978aba1-5cf1-4dcf-bb49-d4573d60e8b8" data-file-name="components/StatisticsPanel.tsx">
              All registered users
            </span></p>
          </CardContent>
        </Card>

        <Card data-unique-id="a1a48848-82f2-42be-8792-f0b928fadb22" data-file-name="components/StatisticsPanel.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="db5aa760-6e97-43fb-89ad-467a990413de" data-file-name="components/StatisticsPanel.tsx">
            <CardTitle className="text-sm font-medium" data-unique-id="ded9a963-053f-46a4-9ab0-91f036a072fa" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="61a2ee63-d562-40de-a8d8-8061bca0daf4" data-file-name="components/StatisticsPanel.tsx">This Month</span></CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" data-unique-id="0f70469e-0275-4ec2-82f4-23879e5af55b" data-file-name="components/StatisticsPanel.tsx" />
          </CardHeader>
          <CardContent data-unique-id="475f57db-2dee-4cc8-8b2b-04e93ade69df" data-file-name="components/StatisticsPanel.tsx">
            <div className="text-2xl font-bold" data-unique-id="c0fca890-777e-471b-abdd-5db2932af84d" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{currentMonthData?.count || 0}</div>
            <p className="text-xs text-muted-foreground" data-unique-id="a2e6807f-c321-4d2d-8727-e2eec86bb387" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="5e760f75-dfc9-473c-8824-08079ce8f924" data-file-name="components/StatisticsPanel.tsx">
              New users this month
            </span></p>
          </CardContent>
        </Card>

        <Card data-unique-id="e7b7dcec-dcf8-4bfb-9ad5-c09d3110693f" data-file-name="components/StatisticsPanel.tsx">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="ac01de95-8fd6-4247-a1ec-e5ad103b5ab4" data-file-name="components/StatisticsPanel.tsx">
            <CardTitle className="text-sm font-medium" data-unique-id="49a74511-3276-4999-acbe-0143c55529e3" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="aa94b890-3fdd-4dbe-8abf-0a7ed507344c" data-file-name="components/StatisticsPanel.tsx">Growth</span></CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent data-unique-id="a4d8893b-75c4-4cdb-9eaa-7ff8e3873194" data-file-name="components/StatisticsPanel.tsx">
            <div className="text-2xl font-bold" data-unique-id="487b72b9-32c4-4cc0-ab4f-681d2613a23e" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
              {growth > 0 ? '+' : ''}{growth.toFixed(1)}<span className="editable-text" data-unique-id="f6bffe8e-b1ab-4d52-b01a-1c65e10c7f94" data-file-name="components/StatisticsPanel.tsx">%
            </span></div>
            <p className="text-xs text-muted-foreground" data-unique-id="646d3734-1235-4d36-b7d7-ec66170cd433" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="0a59bd47-62fc-4fe5-b7c9-4092483c97ef" data-file-name="components/StatisticsPanel.tsx">
              From last month
            </span></p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="bar" className="space-y-4" data-unique-id="58c9a6f9-0453-432f-9ead-662bda5f4009" data-file-name="components/StatisticsPanel.tsx">
        <TabsList>
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /><span className="editable-text" data-unique-id="c625b52c-dccc-4fa4-98a8-6193e0e1a3aa" data-file-name="components/StatisticsPanel.tsx">
            Grafik Batang
          </span></TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" /><span className="editable-text" data-unique-id="94ac3245-f969-400f-9b9f-67bf81f3df4b" data-file-name="components/StatisticsPanel.tsx">
            Grafik Garis
          </span></TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-4">
          <Card data-unique-id="723ed67c-9e6a-40f0-bf5a-9d769e291d0e" data-file-name="components/StatisticsPanel.tsx">
            <CardHeader data-unique-id="3a0ee47b-3cfe-4d51-82a7-9b39d18152b4" data-file-name="components/StatisticsPanel.tsx">
              <CardTitle data-unique-id="b594772b-5331-46f0-ace8-199b3c2d4e60" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="00f810bb-b8cf-40ec-872c-bd496d4d9f08" data-file-name="components/StatisticsPanel.tsx">Pendaftaran User Per Bulan</span></CardTitle>
            </CardHeader>
            <CardContent data-unique-id="1cfa66ef-3f33-41af-a9be-9ee7fb2c49db" data-file-name="components/StatisticsPanel.tsx">
              <div className="h-80" data-unique-id="2f7ec220-6604-48c8-b468-ece346690edb" data-file-name="components/StatisticsPanel.tsx">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyData} margin={{
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
          <Card data-unique-id="af57e9f9-f449-4e41-bf8e-19a6b489e212" data-file-name="components/StatisticsPanel.tsx">
            <CardHeader data-unique-id="48b4f3b0-4cfc-4e5c-b2f5-402e94703f73" data-file-name="components/StatisticsPanel.tsx">
              <CardTitle data-unique-id="eac99c73-dfe3-4f96-b330-29e07f1de482" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="50e9dc48-156a-4aef-bd22-a2d567c689fc" data-file-name="components/StatisticsPanel.tsx">Tren Pertumbuhan User</span></CardTitle>
            </CardHeader>
            <CardContent data-unique-id="367f4ee9-e296-4e0c-ba88-fb4002bcff07" data-file-name="components/StatisticsPanel.tsx">
              <div className="h-80" data-unique-id="8c47b489-5e5c-4fa8-ae5a-664311c64d72" data-file-name="components/StatisticsPanel.tsx">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyData} margin={{
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
      </Tabs>

      {/* Category Statistics */}
      {data.categorySummary.length > 0 && <Card data-unique-id="d9585706-c4a4-4b7c-ab9c-7d71e27b9afe" data-file-name="components/StatisticsPanel.tsx">
          <CardHeader data-unique-id="9d291415-b177-44d9-9dcd-e5f61ddc94b2" data-file-name="components/StatisticsPanel.tsx">
            <CardTitle data-unique-id="55180ce0-32f3-46a7-8423-9ba90f2eff30" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="6843ec1c-a78a-404d-8f5f-0d4f4a85e932" data-file-name="components/StatisticsPanel.tsx">Kategori Populer</span></CardTitle>
          </CardHeader>
          <CardContent data-unique-id="37a88c26-e41f-4bc9-b7fd-9ce14b172009" data-file-name="components/StatisticsPanel.tsx">
            <div className="space-y-4" data-unique-id="ee7885b5-e112-4451-96fd-87398a871e6a" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
              {data.categorySummary.slice(0, 5).map((category, index) => <div key={category.name} className="flex items-center justify-between" data-unique-id="873300af-afbf-4c15-ab3f-d5e2c89d9314" data-file-name="components/StatisticsPanel.tsx">
                  <div className="flex items-center gap-2" data-unique-id="49ea0684-4c68-479b-9c97-8845af610c4a" data-file-name="components/StatisticsPanel.tsx">
                    <div className="w-2 h-2 rounded-full bg-primary" data-unique-id="ea6226fa-c9db-43c6-b7a6-1e7c3bbe7521" data-file-name="components/StatisticsPanel.tsx" />
                    <span className="font-medium" data-unique-id="8b3e7cc5-85dc-4972-8789-961f5aaf4827" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground" data-unique-id="5653b6cd-5abd-4b0a-8490-6d41bb0464cc" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
                    {category.count}<span className="editable-text" data-unique-id="7296bfa8-b798-4028-952c-0e071cac4eda" data-file-name="components/StatisticsPanel.tsx"> users
                  </span></span>
                </div>)}
            </div>
          </CardContent>
        </Card>}
    </div>;
}