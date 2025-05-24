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
  return <div className="space-y-6" data-unique-id="aed61ab9-20e7-4046-abdd-fee802e1ce53" data-file-name="components/StatisticsPanel.tsx">
      <Card data-unique-id="0f67c118-dadb-4670-96d9-9dbfde447601" data-file-name="components/StatisticsPanel.tsx">
        <CardHeader className="flex flex-row items-center justify-between" data-unique-id="71496f56-b294-4a80-8d85-4d6b6eb77d7e" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
          <CardTitle data-unique-id="31b8b1d8-1591-4d51-809e-1e32e8f7258d" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="02ea2dc2-0ac1-4cc9-bd84-32821f7bb119" data-file-name="components/StatisticsPanel.tsx">Total User Perbulan</span></CardTitle>
          {trends && <div className={`flex items-center px-3 py-1 rounded-full text-sm ${trends.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`} data-unique-id="012ad0e7-2545-4c1f-a525-ec0ab6604a4b" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
              {trends.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span data-unique-id="b42962cb-2a39-4c08-86d5-e2d34ec0755e" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{trends.isPositive ? '+' : ''}{trends.change}<span className="editable-text" data-unique-id="1306c178-e27d-4f91-80ff-53411a0aa848" data-file-name="components/StatisticsPanel.tsx"> (</span>{trends.percentChange.toFixed(1)}<span className="editable-text" data-unique-id="79e3e562-fafd-4a7f-9c28-5f215c9e96e6" data-file-name="components/StatisticsPanel.tsx">%)</span></span>
            </div>}
        </CardHeader>
        <CardContent data-unique-id="a231ca07-e0c8-48ae-8219-39e8e6a31537" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="4b1a134c-2eb4-4222-a997-54ca2480a4e7" data-file-name="components/StatisticsPanel.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="25954127-2651-479f-990e-5c57bb664cbe" data-file-name="components/StatisticsPanel.tsx"></div>
            </div> : <>
              <div className="overflow-x-auto" data-unique-id="2803109c-1784-4d26-859b-7dfe9a8bba46" data-file-name="components/StatisticsPanel.tsx">
                <Table data-unique-id="bd8c42bd-9e94-4a0d-b518-1c7784c85f27" data-file-name="components/StatisticsPanel.tsx">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]"><span className="editable-text" data-unique-id="409a049e-942a-47b1-b186-11b2f18f696c" data-file-name="components/StatisticsPanel.tsx">Tahun/Bulan</span></TableHead>
                      {monthsInYear.map(month => <TableHead key={month}>{month}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium"><span className="editable-text" data-unique-id="7895727e-70b4-47bb-bacd-3584fb5a591a" data-file-name="components/StatisticsPanel.tsx">2025</span></TableCell>
                      {monthsInYear.map(month => {
                    const dataItem = monthlyData.find(item => item.month === month);
                    return <TableCell key={month} className={dataItem && dataItem.count > 0 ? 'font-medium' : ''}>{dataItem ? dataItem.count : 0}</TableCell>;
                  })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="h-[400px] mt-6" data-unique-id="6f6025a8-e854-41df-b4ca-198c02dc40fc" data-file-name="components/StatisticsPanel.tsx">
                <Tabs defaultValue="bar" onValueChange={v => setChartView(v as 'bar' | 'line')} data-unique-id="07feb651-bf62-4717-b268-2a2e216fae52" data-file-name="components/StatisticsPanel.tsx">
                  <div className="flex justify-between items-center mb-4" data-unique-id="54a6d985-32a0-47fa-a4b6-221fbce1ac8c" data-file-name="components/StatisticsPanel.tsx">
                    <div className="text-sm text-muted-foreground flex items-center" data-unique-id="a59b9666-ce4f-4cdd-a083-6126a0bebd97" data-file-name="components/StatisticsPanel.tsx">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      <span className="editable-text" data-unique-id="15ff8a38-9beb-41df-a6f4-7320336c1356" data-file-name="components/StatisticsPanel.tsx">Bandingkan jumlah pendaftaran user per bulan</span>
                    </div>
                    <TabsList>
                      <TabsTrigger value="bar" className="flex items-center gap-1">
                        <BarChart2 className="h-4 w-4" /> 
                        <span className="editable-text" data-unique-id="62187e54-5b3a-49da-894e-ea2627420bc4" data-file-name="components/StatisticsPanel.tsx">Grafik Batang</span>
                      </TabsTrigger>
                      <TabsTrigger value="line" className="flex items-center gap-1">
                        <LineChartIcon className="h-4 w-4" /> 
                        <span className="editable-text" data-unique-id="5383994a-8484-4d19-8988-42a64470a57a" data-file-name="components/StatisticsPanel.tsx">Grafik Garis</span>
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

              <div className="h-[200px] mt-8 border-t pt-6" data-unique-id="31b02e4f-55a5-4045-8527-a303f74b1df8" data-file-name="components/StatisticsPanel.tsx">
                <div className="text-sm text-muted-foreground mb-4 flex items-center" data-unique-id="70af7024-6754-4da3-bb6b-d315b94111dd" data-file-name="components/StatisticsPanel.tsx">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span className="editable-text" data-unique-id="17514aa1-74b9-4e45-b416-9cbde88bd7d6" data-file-name="components/StatisticsPanel.tsx">Pertumbuhan total user secara kumulatif</span>
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

      <Card data-unique-id="402cf41c-856d-4363-8c17-0e8f992f7501" data-file-name="components/StatisticsPanel.tsx">
        <CardHeader className="flex flex-row items-center justify-between" data-unique-id="d14e2e1c-793b-4937-8a97-20c9ecd17f9c" data-file-name="components/StatisticsPanel.tsx">
          <CardTitle data-unique-id="21d23544-47f4-4bd7-9135-7c24e1bb300b" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="a6cbba7d-a6a0-43aa-875a-48ef12b64cc5" data-file-name="components/StatisticsPanel.tsx">Statistik Kategori Pilihan User</span></CardTitle>
          <select className="p-2 border rounded-md bg-background" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} data-unique-id="40bf52a9-0b1b-4e2f-a6a5-e07c964a70e7" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
            {months.map(month => <option key={month} value={month} data-is-mapped="true" data-unique-id="82d1e5da-2264-4878-b654-f865f546e39f" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{month}</option>)}
          </select>
        </CardHeader>
        <CardContent data-unique-id="2528ec55-60b9-405a-aed0-f311ac8d48f2" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="062af68a-d4d6-4481-ae77-85ae57526429" data-file-name="components/StatisticsPanel.tsx">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="9d1caf77-73cf-48f8-9596-5e88b5e9b0f2" data-file-name="components/StatisticsPanel.tsx"></div>
            </div> : <>
              <div className="space-y-8" data-unique-id="6f8d9137-ce89-4c9a-9d5e-219d4f1f0d0f" data-file-name="components/StatisticsPanel.tsx">
                <div data-unique-id="ef4ba7b0-4cee-405b-a54e-dc7f58c837d3" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="dfc4161e-5fea-4365-82ea-a092ebffd5e8" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="4c80bd79-886f-4b45-80a3-e1a88a38abc5" data-file-name="components/StatisticsPanel.tsx">Kategori Terpopuler Bulan Ini</span></h3>
                  {categorySummary && categorySummary.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-unique-id="e2ce35f0-b21e-4567-9afd-f62d604d3e59" data-file-name="components/StatisticsPanel.tsx">
                      <div className="h-80" data-unique-id="370c2aed-a00e-4a06-91e6-510c36a75c70" data-file-name="components/StatisticsPanel.tsx">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categorySummary} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={entry => entry.name}>
                              {categorySummary.map((entry, index) => <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} data-unique-id="509b201f-fb75-44ff-9557-d31abac81c10" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true" />)}
                            </Pie>
                            <Legend />
                            <Tooltip formatter={(value, name) => [`${value} pendaftar`, name]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="h-80" data-unique-id="d9309d24-329e-4792-9fc3-7319467d5525" data-file-name="components/StatisticsPanel.tsx">
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
                              {categorySummary.map((entry, index) => <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} data-unique-id="f0face37-1ca0-4065-9920-e26ead440162" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true" />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div> : <div className="h-80 flex items-center justify-center text-muted-foreground" data-unique-id="f432f7e1-c6d8-40ed-92d3-b473ec170cad" data-file-name="components/StatisticsPanel.tsx">
                      <p data-unique-id="52e7b658-a1bd-4183-ad49-03ed15ae8945" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="b9fb8697-0c9c-4ef7-9a37-25a1457bab41" data-file-name="components/StatisticsPanel.tsx">Tidak ada data kategori untuk bulan ini</span></p>
                    </div>}
                </div>
                
                <div className="overflow-x-auto" data-unique-id="d17bc74e-ae15-483e-a24e-99cdd10f940a" data-file-name="components/StatisticsPanel.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="c09c2e6d-683f-48af-8ff4-ed1f5b540e90" data-file-name="components/StatisticsPanel.tsx"><span className="editable-text" data-unique-id="668097df-d9c6-44d3-abf7-d3005c8d6db2" data-file-name="components/StatisticsPanel.tsx">Detail Kategori per Bulan</span></h3>
                  <Table data-unique-id="4c924cdd-1a21-4787-9c8b-8876bd92aba9" data-file-name="components/StatisticsPanel.tsx">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]"><span className="editable-text" data-unique-id="33464985-7563-4f38-b7fd-20081a164b99" data-file-name="components/StatisticsPanel.tsx">Kategori</span></TableHead>
                        <TableHead className="px-4 py-2 text-center"><span className="editable-text" data-unique-id="a9a6ce88-9c77-4859-8a16-2d2cbb819c45" data-file-name="components/StatisticsPanel.tsx">Jumlah Pendaftar</span></TableHead>
                        <TableHead className="px-4 py-2 text-center"><span className="editable-text" data-unique-id="bf911f62-130e-4ac6-85ce-f3e070ac3383" data-file-name="components/StatisticsPanel.tsx">Persentase</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categorySummary && categorySummary.map((category, index) => {
                    const totalCount = categorySummary.reduce((sum, cat) => sum + cat.count, 0);
                    const percentage = totalCount > 0 ? (category.count / totalCount * 100).toFixed(1) : '0';
                    return <TableRow key={index} data-unique-id="cea97a4e-6437-4253-9222-c5af650353a2" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
                            <TableCell className="font-medium" data-unique-id="0292eee6-58ea-40b7-915c-cbb45ba04e94" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{category.name}</TableCell>
                            <TableCell className="text-center" data-unique-id="52e4a916-acc4-43df-a6a4-c63ccbe1e6c0" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{category.count}</TableCell>
                            <TableCell className="text-center" data-unique-id="c5a7cb99-64b9-4d10-a641-1216351601a2" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{percentage}<span className="editable-text" data-unique-id="0973f779-a237-476b-8669-a953dd8b138b" data-file-name="components/StatisticsPanel.tsx">%</span></TableCell>
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