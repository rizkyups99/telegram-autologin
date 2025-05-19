'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader } from 'lucide-react';

type MonthlyData = {
  month: string;
  count: number;
};

type DailyData = {
  admin: string;
  [day: number]: number;
  total: number;
};

export default function StatisticsPanel() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
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
        setMonths(data.availableMonths || []);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics data. Please try again later.');
        
        // Set empty data as fallback
        setMonthlyData([]);
        setDailyData([]);
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
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }
    
    const daysCount = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
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
        result.push({ name: month, users: 0 });
      }
    });
    return result.sort((a, b) => monthsInYear.indexOf(a.name) - monthsInYear.indexOf(b.name));
  };
  
  const completeMonthlyData = ensureAllMonths();

  // Format daily data for charts
  const dailyChartData = days.map(day => {
    const dayData: { name: string, [key: string]: any } = { name: day.toString() };
    dailyData.forEach(adminData => {
      dayData[adminData.admin] = adminData[day] || 0;
    });
    return dayData;
  });

  // Get chart colors
  const getChartColors = () => {
    return ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total User Perbulan</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Tahun/Bulan</TableHead>
                      {monthsInYear.map((month) => (
                        <TableHead key={month}>{month}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">2025</TableCell>
                      {monthsInYear.map((month) => {
                        const dataItem = monthlyData.find(item => item.month === month);
                        return (
                          <TableCell key={month}>{dataItem ? dataItem.count : 0}</TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="h-[300px] mt-6">
                <Tabs defaultValue="bar" onValueChange={(v) => setChartView(v as 'bar' | 'line')}>
                  <div className="flex justify-end mb-4">
                    <TabsList>
                      <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                      <TabsTrigger value="line">Line Chart</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="bar" className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={completeMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#3B82F6" name="User Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="line" className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={completeMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#3B82F6" 
                          name="User Count"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Statistik Registrasi User per Admin</CardTitle>
          <select 
            className="p-2 border rounded-md bg-background"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Nama Admin</TableHead>
                      {days.map((day) => (
                        <TableHead key={day} className="px-2 text-center">{day}</TableHead>
                      ))}
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyData.map((admin) => (
                      <TableRow key={admin.admin}>
                        <TableCell className="font-medium">{admin.admin}</TableCell>
                        {days.map((day) => (
                          <TableCell key={day} className="text-center">
                            {admin[day] || 0}
                          </TableCell>
                        ))}
                        <TableCell className="font-medium text-center">{admin.total}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted bg-opacity-50">
                      <TableCell className="font-bold">Total</TableCell>
                      {days.map((day, idx) => (
                        <TableCell key={`total-${day}`} className="text-center font-bold">
                          {dailyTotals[idx]}
                        </TableCell>
                      ))}
                      <TableCell className="font-bold text-center">
                        {dailyTotals.reduce((sum, count) => sum + count, 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="h-[300px] mt-8">
                <Tabs defaultValue="bar">
                  <div className="flex justify-end mb-4">
                    <TabsList>
                      <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                      <TabsTrigger value="line">Line Chart</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="bar" className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {dailyData.map((admin, index) => (
                          <Bar 
                            key={admin.admin}
                            dataKey={admin.admin} 
                            fill={getChartColors()[index % getChartColors().length]} 
                            stackId="a" 
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="line" className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {dailyData.map((admin, index) => (
                          <Line 
                            key={admin.admin}
                            type="monotone" 
                            dataKey={admin.admin} 
                            stroke={getChartColors()[index % getChartColors().length]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
