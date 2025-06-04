'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users } from 'lucide-react';
import { DailyRegistrationData } from './types';
interface DailyRegistrationsProps {
  year: number;
  month: number;
}
export function DailyRegistrations({
  year,
  month
}: DailyRegistrationsProps) {
  const [dailyData, setDailyData] = useState<DailyRegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchDailyData();
  }, [year, month]);
  const fetchDailyData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/statistics/daily-registrations?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch daily registration data');
      }
      const data = await response.json();
      setDailyData(data);
    } catch (err) {
      console.error('Error fetching daily registrations:', err);
      setError('Failed to load daily registration data');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Card data-unique-id="5978237e-5c71-4887-9082-e69dec7ef7dc" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="c9222c19-08a9-4353-982e-2085e6dee14d" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="f88f52c2-eade-4bcd-991d-1333c636645e" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="f2d11d4a-4956-4a15-ba09-d86b50c28699" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="0d58d3fc-782f-4fe4-b7b7-33143ba6f81a" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="3c4e9036-cab8-4d79-81e6-6fc351e02703" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="flex justify-center py-8" data-unique-id="dbc59fcd-3f77-447b-96e6-fb5aa904b0e8" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="e3948b70-5b5f-4480-890d-b01d9d4f267e" data-file-name="components/statistics/DailyRegistrations.tsx"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card data-unique-id="fa2dd7e4-6c53-4feb-9b84-400a82d75c4a" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="4cfbc109-9934-4e63-8991-a58e2f5da388" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="1ad328c0-3eb9-41fb-af9c-d8fe8955289b" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="7d689c93-f60a-45d2-89c9-d8e99a638eb7" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="26c912e3-822d-47f9-997e-04bd458d8b2c" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="7b8976a3-161d-4a3f-a7e9-4c55ca6c043c" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="text-center py-8" data-unique-id="4208dac8-d407-453c-ace8-1fd8841dcdff" data-file-name="components/statistics/DailyRegistrations.tsx">
            <p className="text-muted-foreground text-red-500" data-unique-id="ceb7e372-12c8-435e-b0b2-9719cd519d5f" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{error}</p>
          </div>
        </CardContent>
      </Card>;
  }
  const totalRegistrations = dailyData.reduce((sum, item) => sum + item.registrations, 0);
  const averagePerDay = dailyData.length > 0 ? (totalRegistrations / dailyData.length).toFixed(1) : '0';
  const peakDay = dailyData.reduce((peak, current) => current.registrations > peak.registrations ? current : peak, {
    day: '0',
    registrations: 0,
    fullDate: ''
  });
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return <Card data-unique-id="d649f306-2718-4148-b52e-b5698836ef0b" data-file-name="components/statistics/DailyRegistrations.tsx">
      <CardHeader data-unique-id="a14c4b97-10d0-440f-81b3-446ad2f38e75" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="604c9fe1-6b44-4d15-97bd-50847c5d070a" data-file-name="components/statistics/DailyRegistrations.tsx">
          <Calendar className="h-5 w-5" data-unique-id="2348f6ee-4f47-4769-a050-df8200f1fe53" data-file-name="components/statistics/DailyRegistrations.tsx" />
          <span className="editable-text" data-unique-id="613d78ba-e2f6-4e57-bcc6-40281a317f87" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground" data-unique-id="2e7c2f4c-d1ac-4e06-ba0f-cf8166941aaf" data-file-name="components/statistics/DailyRegistrations.tsx">
          <span className="editable-text" data-unique-id="1816cf0b-edaf-4bbc-88a7-2f8e0b5f2e8c" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Analisis pendaftaran user harian untuk {monthNames[month - 1]} {year}</span>
        </p>
      </CardHeader>
      <CardContent data-unique-id="2476d826-a8f7-468f-bafd-571b505235e8" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-unique-id="3f558155-7a48-4e87-bda4-62e9aad13b51" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200" data-unique-id="ab1ed0aa-4d71-4c18-9a3e-a9c368c70c5d" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="4b070e43-1b4e-4942-98e8-8e384f1f70f4" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="61cf97e9-94ba-49fe-bfc2-e331bbae6a01" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-blue-700" data-unique-id="728ce5d9-151a-4c48-8345-4ff722837b9f" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="2c3fadba-34ca-46c9-b59d-dd90c0db6499" data-file-name="components/statistics/DailyRegistrations.tsx">Total Pendaftaran</span>
                </p>
                <p className="text-2xl font-bold text-blue-900" data-unique-id="185cd996-3a18-47a1-bdf7-8e8d0f2079de" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{totalRegistrations}</p>
                <p className="text-xs text-blue-600" data-unique-id="c5b681f1-46ec-4c13-b817-94bf0b609915" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="fb941c15-2579-4553-9fbf-da958d3fd79b" data-file-name="components/statistics/DailyRegistrations.tsx">bulan ini</span>
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-unique-id="eb36013e-4bf2-4fee-ae31-052bb0987610" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="4dba197b-5d97-4248-a2f0-2a266284423e" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="e23ae206-f5ca-49e2-8eb8-7ef5fe2277d3" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-green-700" data-unique-id="b05be7db-4f45-492f-9145-bfc1bb1e303c" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="8a34847e-05e4-4a8b-9fe9-ef800da91283" data-file-name="components/statistics/DailyRegistrations.tsx">Rata-rata per Hari</span>
                </p>
                <p className="text-2xl font-bold text-green-900" data-unique-id="ec57aba3-8adc-419b-983a-b3e4079cd711" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{averagePerDay}</p>
                <p className="text-xs text-green-600" data-unique-id="c7d722ee-b724-4be7-9f1a-d0fd4727f463" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="4d616510-ac6b-4f6a-ae11-082bde4a5bb8" data-file-name="components/statistics/DailyRegistrations.tsx">user/hari</span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200" data-unique-id="40b76b75-3e86-4cb4-90e1-b169a7dd5de7" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="9b3166d6-8dac-491a-b188-e3ac046a8f21" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="a5162932-f5af-4ddd-9586-5e621e1a4035" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-purple-700" data-unique-id="5d23e232-c7be-4b0d-baea-a53a4c9e59c8" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="bec90479-d066-4693-b5d8-7b20aa86a7b5" data-file-name="components/statistics/DailyRegistrations.tsx">Hari Tertinggi</span>
                </p>
                <p className="text-2xl font-bold text-purple-900" data-unique-id="bd1cda86-42c8-4bc2-bace-a3ac77c8cf22" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{peakDay.registrations}</p>
                <p className="text-xs text-purple-600" data-unique-id="0cd0a3f8-7d6b-4c05-a429-6381fc4fdb2e" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="9a48dbb9-3ea3-4334-91dd-892e248a9cce" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">tanggal {peakDay.day}</span>
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" data-unique-id="3ef978e9-b8cc-49de-980d-e04fef5fdcb8" data-file-name="components/statistics/DailyRegistrations.tsx" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="bar" className="space-y-4" data-unique-id="6a4f0416-d6e5-46c9-aba0-8c291e464daf" data-file-name="components/statistics/DailyRegistrations.tsx">
          <TabsList>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="6f73b6e7-80a0-49b7-b273-68c23e8bb905" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Batang</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="fa20bb74-3531-454d-96bb-fb0bea63475d" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Garis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="h-80" data-unique-id="3426f7ca-184c-4134-a7bb-92c66e6eed2b" data-file-name="components/statistics/DailyRegistrations.tsx">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{
                  fontSize: 12
                }} interval={Math.ceil(dailyData.length / 15)} // Show every nth day to avoid crowding
                />
                  <YAxis tick={{
                  fontSize: 12
                }} />
                  <Tooltip formatter={(value, name) => [value, 'Pendaftaran']} labelFormatter={label => `Tanggal ${label}`} labelStyle={{
                  color: '#000'
                }} contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }} />
                  <Bar dataKey="registrations" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pendaftaran" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="line" className="space-y-4">
            <div className="h-80" data-unique-id="7f4f9657-9915-4de8-a17c-05e52154ee09" data-file-name="components/statistics/DailyRegistrations.tsx">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{
                  fontSize: 12
                }} interval={Math.ceil(dailyData.length / 15)} // Show every nth day to avoid crowding
                />
                  <YAxis tick={{
                  fontSize: 12
                }} />
                  <Tooltip formatter={(value, name) => [value, 'Pendaftaran']} labelFormatter={label => `Tanggal ${label}`} labelStyle={{
                  color: '#000'
                }} contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }} />
                  <Line type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={3} dot={{
                  fill: '#3b82f6',
                  strokeWidth: 2,
                  r: 4
                }} activeDot={{
                  r: 6,
                  stroke: '#3b82f6',
                  strokeWidth: 2
                }} name="Pendaftaran" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="56b125b7-d689-44c7-baba-b6eb8a9ba3cd" data-file-name="components/statistics/DailyRegistrations.tsx">
          <p className="text-sm text-blue-800" data-unique-id="78f57420-2bf2-4c44-8467-8cae11e35a51" data-file-name="components/statistics/DailyRegistrations.tsx">
            <span className="editable-text" data-unique-id="4510ab91-ad66-4ffa-863f-d7015b0f2124" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Menampilkan jumlah user yang mendaftar setiap hari dalam bulan {monthNames[month - 1]} {year}. 
            Total {totalRegistrations} pendaftaran dengan rata-rata {averagePerDay} pendaftaran per hari.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}