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
    return <Card data-unique-id="ccb3eaee-136c-492d-b0a0-f5449515d353" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="de9ebe87-bcc2-45aa-8ddd-afcdd5531651" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="65e736b0-024f-46bf-a586-73e93b754045" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="3f515142-e773-4b8a-9371-dc614c91f0b9" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="8942d5a3-6cfd-4896-82cc-80f7c110365d" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="2c9c2071-8be8-4292-8f7d-f659d9c65a74" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="flex justify-center py-8" data-unique-id="9e180a16-14e5-44b8-875d-5a2f0005c49e" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="c16a4d7a-ed8c-43a3-a81c-7be202e3bdd7" data-file-name="components/statistics/DailyRegistrations.tsx"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card data-unique-id="d458de70-f75e-4bc8-8a3e-c045c7420731" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="a0178a54-21cf-41aa-ab09-1e40219114fe" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="b879145f-2ad3-4c1b-ae6f-0250b4d877c4" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="0377d902-a1bf-4e1f-adef-52820e6c0ddf" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="96758967-81f2-45db-a3b8-cb3024f6bc07" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="9c0293ce-5a1b-4371-befc-1a0687f8e060" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="text-center py-8" data-unique-id="eb2079f7-9203-487e-b1b0-5b9cfd6c6aac" data-file-name="components/statistics/DailyRegistrations.tsx">
            <p className="text-muted-foreground text-red-500" data-unique-id="5ccb09ba-ddb1-4922-836f-12f2706a1d7a" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{error}</p>
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
  return <Card data-unique-id="c6e23071-dad8-4f96-9f3b-95ef68b20129" data-file-name="components/statistics/DailyRegistrations.tsx">
      <CardHeader data-unique-id="ede537ee-7066-41b6-8adb-27ea7bca8f28" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="8ea51891-6932-430a-a767-290fbfb44a3b" data-file-name="components/statistics/DailyRegistrations.tsx">
          <Calendar className="h-5 w-5" data-unique-id="4bde69bd-bcee-4651-bc0c-e39ab3c75f79" data-file-name="components/statistics/DailyRegistrations.tsx" />
          <span className="editable-text" data-unique-id="f6f2a965-f79f-4180-8492-0ba341ae39e5" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground" data-unique-id="ab0ceeec-5009-43d4-824f-b93c6201c211" data-file-name="components/statistics/DailyRegistrations.tsx">
          <span className="editable-text" data-unique-id="5d1f3b28-250e-4cb2-9b4d-629a2a950a53" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Analisis pendaftaran user harian untuk {monthNames[month - 1]} {year}</span>
        </p>
      </CardHeader>
      <CardContent data-unique-id="bd92b71c-c6c5-4671-8707-178abdf66ca0" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-unique-id="69dd20d6-71f8-4dd6-8830-f655cc04a5db" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200" data-unique-id="5f0abbad-edaf-4b4e-a316-38b109826281" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="4aaffa5f-98d2-4f15-8346-b54a114ec851" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="fd06540b-a955-4bd4-a14e-c8e0980c2656" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-blue-700" data-unique-id="388775ac-998b-4100-843f-0261c87c7f48" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="f67577bd-1c2a-40a2-a3c5-8bb9f80c3b16" data-file-name="components/statistics/DailyRegistrations.tsx">Total Pendaftaran</span>
                </p>
                <p className="text-2xl font-bold text-blue-900" data-unique-id="1c65dff8-8f9b-47d0-9912-ba6bd5ecf07a" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{totalRegistrations}</p>
                <p className="text-xs text-blue-600" data-unique-id="03be08c5-fe05-4547-90aa-d0d029899379" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="c090e4cc-ce58-4061-a342-c01cca168e54" data-file-name="components/statistics/DailyRegistrations.tsx">bulan ini</span>
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-unique-id="cc585748-f64b-48a2-b292-a7c69a713d08" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="4d0a0873-eec6-4319-8d41-f23164b7f7cd" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="060d2bba-d36c-463f-93ac-f78ae5b43d97" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-green-700" data-unique-id="3a6d3416-472a-4071-b8bc-203b817094c6" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="39f9ab42-642d-4a77-9339-706afdd302b5" data-file-name="components/statistics/DailyRegistrations.tsx">Rata-rata per Hari</span>
                </p>
                <p className="text-2xl font-bold text-green-900" data-unique-id="9121a2d6-5d1f-489c-b309-97d2e03fafb7" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{averagePerDay}</p>
                <p className="text-xs text-green-600" data-unique-id="cee7250d-5567-4a22-a597-d8a6ec186fb7" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="12afd12a-6c9e-40bd-8b5f-37b1e4052c48" data-file-name="components/statistics/DailyRegistrations.tsx">user/hari</span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200" data-unique-id="391e1f5f-bf63-453d-84c0-58be9862aae5" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="2bc8c42a-8b85-421f-abf3-bcf413a59c9e" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="6fcb8565-b50d-4929-bd7a-d6ddee6e2fa7" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-purple-700" data-unique-id="9b758460-f12c-41b5-b19e-666b72c49281" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="3d297e44-c46d-4eaa-b5a8-e50396efa315" data-file-name="components/statistics/DailyRegistrations.tsx">Hari Tertinggi</span>
                </p>
                <p className="text-2xl font-bold text-purple-900" data-unique-id="b6bcc60d-8377-4f6d-8933-b2772c604619" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{peakDay.registrations}</p>
                <p className="text-xs text-purple-600" data-unique-id="b52d6033-9e80-44df-b8f2-7909f47e4903" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="ff401c7d-8a34-4eb8-bef2-0a5cb0c74480" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">tanggal {peakDay.day}</span>
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" data-unique-id="44c85427-8485-4eea-ba91-6ec42238dc32" data-file-name="components/statistics/DailyRegistrations.tsx" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="bar" className="space-y-4" data-unique-id="0e657f44-5394-4493-9f88-47d6935872d1" data-file-name="components/statistics/DailyRegistrations.tsx">
          <TabsList>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="26d21914-2e7e-493d-93d2-26c02432b173" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Batang</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="593c11c7-b8a8-4332-a483-1212ad0cd55f" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Garis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="h-80" data-unique-id="0e68bc24-94a6-49b3-8307-b6b992d2652e" data-file-name="components/statistics/DailyRegistrations.tsx">
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
            <div className="h-80" data-unique-id="37f17165-d71c-43fd-94e1-4934fa9b4339" data-file-name="components/statistics/DailyRegistrations.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="f381d2ba-cb9a-4d19-b246-85722c4064c1" data-file-name="components/statistics/DailyRegistrations.tsx">
          <p className="text-sm text-blue-800" data-unique-id="848714cb-f517-40f8-a31a-94efe4f5e577" data-file-name="components/statistics/DailyRegistrations.tsx">
            <span className="editable-text" data-unique-id="fa99aa34-4a95-42d8-994e-0ee6a5ec95cb" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Menampilkan jumlah user yang mendaftar setiap hari dalam bulan {monthNames[month - 1]} {year}. 
            Total {totalRegistrations} pendaftaran dengan rata-rata {averagePerDay} pendaftaran per hari.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}