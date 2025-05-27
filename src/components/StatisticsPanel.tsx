'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ReferenceLine, LabelList, Area, AreaChart, Brush } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader, TrendingUp, TrendingDown, BarChart2, LineChart as LineChartIcon, HelpCircle } from 'lucide-react';
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
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategoryData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("May 2025");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [months, setMonths] = useState<string[]>([]);
  const [chartView, setChartView] = useState<'bar' | 'line'>('bar');
  const [error, setError] = useState<string | null>(null);
  const monthsInYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Extract year and month from selectedMonth (e.g., "May 2025")
        const [monthStr, yearStr] = selectedMonth.split(' ');
        const monthIndex = monthsInYear.indexOf(monthStr) + 1;
        const response = await fetch(`/api/statistics?month=${monthIndex}&year=${yearStr}`);
        if (!response.ok) {
          throw new Error('Failed to fetch statistics data');
        }
        const data = await response.json();
        setMonthlyData(data.monthlyData || []);
        setDailyData(data.dailyRegistrations || []);
        setCategorySummary(data.categorySummary || []);
        setMonths(data.availableMonths || []);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics data. Please try again later.');

        // Set empty data as fallback
        setMonthlyData([]);
        setDailyData([]);
        setCategorySummary([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth]);

  // Get actual days for the selected month
  const getDaysInMonth = (): number[] => {
    const [monthStr, yearStr] = selectedMonth.split(' ');
    const monthIndex = monthsInYear.indexOf(monthStr);
    const year = parseInt(yearStr);
    if (isNaN(year) || monthIndex === -1) {
      return Array.from({
        length: 31
      }, (_, i) => i + 1);
    }
    const daysCount = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({
      length: daysCount
    }, (_, i) => i + 1);
  };
  const days = getDaysInMonth();

  // Calculate totals per day
  const dailyTotals = days.map(day => {
    return dailyData.reduce((sum, admin) => sum + (admin[day] || 0), 0);
  });

  // Format data for charts
  const monthlyChartData = monthlyData.map(item => ({
    name: item.month,
    users: item.count
  }));

  // Ensure all months have data points, even if they're zero
  const ensureAllMonths = () => {
    const result = [...monthlyChartData];
    monthsInYear.forEach(month => {
      if (!result.some(item => item.name === month)) {
        result.push({
          name: month,
          users: 0
        });
      }
    });
    return result.sort((a, b) => monthsInYear.indexOf(a.name) - monthsInYear.indexOf(b.name));
  };
  const completeMonthlyData = ensureAllMonths();

  // Format daily data for charts
  const dailyChartData = days.map(day => {
    const dayData: {
      name: string;
      [key: string]: any;
    } = {
      name: day.toString()
    };
    dailyData.forEach(adminData => {
      dayData[adminData.admin] = adminData[day] || 0;
    });
    return dayData;
  });

  // Get chart colors
  const getChartColors = () => {
    return ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  };
  // Calculate trend data (month over month change)
  const calculateTrends = () => {
    if (!completeMonthlyData || completeMonthlyData.length <= 1) return null;

    // Get last two months with real data
    const withData = completeMonthlyData.filter(item => item.users > 0);
    if (withData.length < 2) return null;
    const currentMonth = withData[withData.length - 1];
    const previousMonth = withData[withData.length - 2];
    const percentChange = (currentMonth.users - previousMonth.users) / previousMonth.users * 100;
    return {
      currentMonth: currentMonth.name,
      previousMonth: previousMonth.name,
      change: currentMonth.users - previousMonth.users,
      percentChange: percentChange,
      isPositive: percentChange >= 0
    };
  };
  const trends = calculateTrends();

  // Calculate cumulative data for area chart
  const cumulativeData = completeMonthlyData.map((item, index, array) => {
    let cumulative = item.users;
    for (let i = 0; i < index; i++) {
      cumulative += array[i].users;
    }
    return {
      ...item,
      cumulative: cumulative
    };
  });
  return <div className="space-y-6" data-unique-id="6be8cea0-4204-475f-a316-0682430dbbc3" data-file-name="components/StatisticsPanel.tsx">
      <Card data-unique-id="cb766220-b597-4232-a813-849298a83a1f" data-file-name="components/StatisticsPanel.tsx">
        <CardHeader className="flex flex-row items-center justify-between" data-unique-id="cd83c69e-4058-4c4e-8a52-b805702d6c80" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
          <CardTitle data-unique-id="02b697a6-37aa-43d0-8aad-4552fce991b7" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="1e79fa94-1c91-4af7-b91c-8a10b793fab8" data-file-name="components/StatisticsPanel.tsx">Total User Perbulan</span></CardTitle>
          {trends && <div className={`flex items-center px-3 py-1 rounded-full text-sm ${trends.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`} data-unique-id="56fec1b4-b0a6-4b86-b012-aca2d412c7a4" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
              {trends.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span data-unique-id="d14d8ff1-c8a1-4e0c-8b45-df85b3d7d88b" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{trends.isPositive ? '+' : ''}{trends.change}<span className="editable-text" data-unique-id="f92e4bbb-bdb0-404d-9037-e1c87cd4df13" data-file-name="components/StatisticsPanel.tsx"> (</span>{trends.percentChange.toFixed(1)}<span className="editable-text" data-unique-id="d5bf0445-9347-46ec-8f93-baf04dce656b" data-file-name="components/StatisticsPanel.tsx">%)</span></span>
            </div>}
        </CardHeader>
        <CardContent data-unique-id="ee319147-7995-43a2-9f58-146990f699d0" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="8f64a6d6-a7db-4af2-82e2-c75ef1f981b5" data-file-name="components/StatisticsPanel.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="a9b7384e-5a89-42fe-81d5-2029a6232441" data-file-name="components/StatisticsPanel.tsx"></div>
            </div> : <>
              <div className="overflow-x-auto" data-unique-id="6901d8c3-e883-4894-bc8b-91098248817d" data-file-name="components/StatisticsPanel.tsx">
                <Table data-unique-id="7987373a-7dd2-4977-86c1-e6a3ae20add3" data-file-name="components/StatisticsPanel.tsx">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]"><span className="editable-text" data-unique-id="ed5ea4e0-c081-4d59-8473-e078fd86fdf6" data-file-name="components/StatisticsPanel.tsx">Tahun/Bulan</span></TableHead>
                      {monthsInYear.map(month => <TableHead key={month}>{month}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium"><span className="editable-text" data-unique-id="e797e5ba-350e-43da-a002-f320f581dd12" data-file-name="components/StatisticsPanel.tsx">2025</span></TableCell>
                      {monthsInYear.map(month => {
                    const dataItem = monthlyData.find(item => item.month === month);
                    return <TableCell key={month} className={dataItem && dataItem.count > 0 ? 'font-medium' : ''}>{dataItem ? dataItem.count : 0}</TableCell>;
                  })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="h-[400px] mt-6" data-unique-id="c803cf03-ca06-409e-814d-0f8b1c1d0f52" data-file-name="components/StatisticsPanel.tsx">
                <Tabs defaultValue="bar" onValueChange={v => setChartView(v as 'bar' | 'line')} data-unique-id="02112606-bd27-44c0-b253-6ca896a23914" data-file-name="components/StatisticsPanel.tsx">
                  <div className="flex justify-between items-center mb-4" data-unique-id="2112adbf-6a8d-4216-a26e-4d640563845b" data-file-name="components/StatisticsPanel.tsx">
                    <div className="text-sm text-muted-foreground flex items-center" data-unique-id="2d6c4b40-8853-4afd-a98f-a8adc05d64cc" data-file-name="components/StatisticsPanel.tsx">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <span className="editable-text" data-unique-id="abb3a1f9-751f-494a-b69f-3bb4d8ecf864" data-file-name="components/StatisticsPanel.tsx">Bandingkan jumlah pendaftaran user per bulan</span>
                    </div>
                    <TabsList>
                      <TabsTrigger value="bar" className="flex items-center gap-1">
                        <BarChart2 className="h-4 w-4" /> 
                        <span className="editable-text" data-unique-id="cb6af695-569f-46e2-b39f-645a3b6deabe" data-file-name="components/StatisticsPanel.tsx">Grafik Batang</span>
                      </TabsTrigger>
                      <TabsTrigger value="line" className="flex items-center gap-1">
                        <LineChartIcon className="h-4 w-4" /> 
                        <span className="editable-text" data-unique-id="86a58185-69ae-427b-9563-9c1c040fda03" data-file-name="components/StatisticsPanel.tsx">Grafik Garis</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="bar" className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={completeMonthlyData} margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30
                  }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{
                      fill: '#71717A'
                    }} axisLine={{
                      stroke: '#E5E7EB'
                    }} />
                        <YAxis tick={{
                      fill: '#71717A'
                    }} axisLine={{
                      stroke: '#E5E7EB'
                    }} tickFormatter={value => `${value}`} />
                        <Tooltip formatter={value => [`${value} user`, 'Jumlah Pendaftaran']} contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }} />
                        <Legend />
                        <ReferenceLine y={0} stroke="#E5E7EB" />
                        <Bar dataKey="users" fill="var(--chart-1)" name="Jumlah User" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="users" position="top" fill="#71717A" fontSize={12} />
                        </Bar>
                        <Brush dataKey="name" height={30} stroke="var(--chart-1)" startIndex={Math.max(0, completeMonthlyData.length - 6)} />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="line" className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={completeMonthlyData} margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30
                  }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{
                      fill: '#71717A'
                    }} axisLine={{
                      stroke: '#E5E7EB'
                    }} />
                        <YAxis tick={{
                      fill: '#71717A'
                    }} axisLine={{
                      stroke: '#E5E7EB'
                    }} tickFormatter={value => `${value}`} />
                        <Tooltip formatter={value => [`${value} user`, 'Jumlah Pendaftaran']} contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }} />
                        <Legend />
                        <ReferenceLine y={0} stroke="#E5E7EB" />
                        <Line type="monotone" dataKey="users" stroke="var(--chart-2)" name="Jumlah User" strokeWidth={3} dot={{
                      stroke: 'var(--chart-2)',
                      fill: '#fff',
                      strokeWidth: 2,
                      r: 5
                    }} activeDot={{
                      stroke: 'var(--chart-2)',
                      fill: 'var(--chart-2)',
                      strokeWidth: 2,
                      r: 7
                    }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="h-[200px] mt-8 border-t pt-6" data-unique-id="16498eef-e0be-4c6f-be37-2eb9ce33b466" data-file-name="components/StatisticsPanel.tsx">
                <div className="text-sm text-muted-foreground mb-4 flex items-center" data-unique-id="4eeaf0a4-12da-47a8-b379-5330fa44adb4" data-file-name="components/StatisticsPanel.tsx">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span className="editable-text" data-unique-id="c31fd705-291b-4343-974a-7265c8e0ea89" data-file-name="components/StatisticsPanel.tsx">Pertumbuhan total user secara kumulatif</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeData} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{
                  fill: '#71717A'
                }} />
                    <YAxis tick={{
                  fill: '#71717A'
                }} />
                    <Tooltip formatter={value => [`${value} user`, 'Total User']} />
                    <Area type="monotone" dataKey="cumulative" name="Total User" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>}
        </CardContent>
      </Card>

      <Card data-unique-id="b55c1f24-7d85-459e-bf7e-ed93cda66fd9" data-file-name="components/StatisticsPanel.tsx">
        <CardHeader className="flex flex-row items-center justify-between" data-unique-id="3af413c0-c24e-497d-9157-273952407248" data-file-name="components/StatisticsPanel.tsx">
          <CardTitle data-unique-id="551f2b5c-f2b3-452c-81bf-5adff5a9a704" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="5ba6c2df-066a-4b13-a350-d23ec1181af5" data-file-name="components/StatisticsPanel.tsx">Statistik Kategori Pilihan User</span></CardTitle>
          <select className="p-2 border rounded-md bg-background" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} data-unique-id="ae2c978c-df88-4c8b-9615-78d976699c47" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
            {months.map(month => <option key={month} value={month} data-is-mapped="true" data-unique-id="f42987fc-9f5e-4e22-b77e-4a25608e95e5" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{month}</option>)}
          </select>
        </CardHeader>
        <CardContent data-unique-id="8ad0af10-e694-482e-a605-b0d944110dd6" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="a83ab126-7f50-4109-9577-b2ec467b45ad" data-file-name="components/StatisticsPanel.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="6d5f2dd6-3799-4db4-8eaa-31126297ee1c" data-file-name="components/StatisticsPanel.tsx"></div>
            </div> : <>
              <div className="space-y-8" data-unique-id="1008c827-45c9-485b-8823-a09a0d73908f" data-file-name="components/StatisticsPanel.tsx">
                <div data-unique-id="0d9ff80d-1bee-4be0-a898-145cbffeb269" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="d2208727-6f27-4d19-94c7-bdfc1411869e" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="c77052d9-86e5-4762-9374-2ca5e59de6ca" data-file-name="components/StatisticsPanel.tsx">Kategori Terpopuler Bulan Ini</span></h3>
                  {categorySummary && categorySummary.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="a33c9243-078c-4309-a84c-70c6fedf4d99" data-file-name="components/StatisticsPanel.tsx">
                      <div className="h-80" data-unique-id="0f9991f8-e00c-427f-86c7-5f8aaa40c4e9" data-file-name="components/StatisticsPanel.tsx">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categorySummary} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={entry => entry.name}>
                              {categorySummary.map((entry, index) => <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} data-unique-id="7cb72e2c-f4cb-4ac7-9250-0d9eeb2d2f5d" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true" />)}
                            </Pie>
                            <Legend />
                            <Tooltip formatter={(value, name) => [`${value} pendaftar`, name]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="h-80" data-unique-id="999e7ddc-a9cf-4e8c-9574-ad8d536af0bb" data-file-name="components/StatisticsPanel.tsx">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categorySummary} margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={value => [`${value} pendaftar`, 'Jumlah']} />
                            <Bar dataKey="count" name="Jumlah Pendaftar" fill="#8884d8">
                              {categorySummary.map((entry, index) => <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} data-unique-id="3632902f-6ad0-4661-8a82-f5cb0cbd1ae8" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true" />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div> : <div className="h-80 flex items-center justify-center text-muted-foreground" data-unique-id="e53db53f-7be0-4370-b5ba-7a753e5389da" data-file-name="components/StatisticsPanel.tsx">
                      <p data-unique-id="a20d52d1-8f26-480e-982f-bbd413b221fe" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="f3028c02-0936-4fe9-a0a4-8e39016067c6" data-file-name="components/StatisticsPanel.tsx">Tidak ada data kategori untuk bulan ini</span></p>
                    </div>}
                </div>
                
                <div className="overflow-x-auto" data-unique-id="8986ea0d-eff9-4dbc-a1bb-59c845fa0adb" data-file-name="components/StatisticsPanel.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="c5687069-c48e-49c0-9d39-9a9428ac7b62" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="9aa620f6-2dec-4b16-a727-7eda46c4e9fb" data-file-name="components/StatisticsPanel.tsx">Detail Kategori per Bulan</span></h3>
                  <Table data-unique-id="93e870f3-82a2-4366-8939-9e84240b53cc" data-file-name="components/StatisticsPanel.tsx">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]"><span className="editable-text" data-unique-id="22a78709-5006-4e32-aa04-066a606b672e" data-file-name="components/StatisticsPanel.tsx">Kategori</span></TableHead>
                        <TableHead className="px-4 py-2 text-center"><span className="editable-text" data-unique-id="6f642d09-28f4-4422-ae8d-1f3803893a39" data-file-name="components/StatisticsPanel.tsx">Jumlah Pendaftar</span></TableHead>
                        <TableHead className="px-4 py-2 text-center"><span className="editable-text" data-unique-id="0c477cc3-f74b-45b0-9fe9-ccb5206e506b" data-file-name="components/StatisticsPanel.tsx">Persentase</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categorySummary && categorySummary.map((category, index) => {
                    const totalCount = categorySummary.reduce((sum, cat) => sum + cat.count, 0);
                    const percentage = totalCount > 0 ? (category.count / totalCount * 100).toFixed(1) : '0';
                    return <TableRow key={index} data-unique-id="feee5710-506c-4006-9b0c-f14b180b88fe" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
                            <TableCell className="font-medium" data-unique-id="2b574da0-d49f-4209-b2f5-e40ded488212" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{category.name}</TableCell>
                            <TableCell className="text-center" data-unique-id="805ec65c-821a-4767-b7ab-cf90e9edf058" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{category.count}</TableCell>
                            <TableCell className="text-center" data-unique-id="d46d5559-22e9-4528-8d73-95d53766ab8e" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{percentage}<span className="editable-text" data-unique-id="a39734be-1c54-4002-b825-d11bffe69dcf" data-file-name="components/StatisticsPanel.tsx">%</span></TableCell>
                          </TableRow>;
                  })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>}
        </CardContent>
      </Card>
    </div>;
}