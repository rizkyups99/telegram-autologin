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
    return <Card data-unique-id="bcb999d4-e917-4a97-86a3-3747b26e52d2" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="5d44d017-2207-48c2-89b4-51e797a2b625" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="67ca244d-b396-43b3-a605-749158d5d56c" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="027fabea-d33c-4e6e-874e-0157ff606b98" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="df192a08-9c8c-4251-85de-594081c64c24" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="02a0959e-f19a-4774-9495-2548d639aa63" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="flex justify-center py-8" data-unique-id="c094f01d-020c-4e12-912a-a25ce98fcf64" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="158b9c1b-4416-4ec6-8ae5-b0a18c664dfa" data-file-name="components/statistics/DailyRegistrations.tsx"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card data-unique-id="1b00d061-d5bb-4ec5-b773-37ebcdda999a" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="1f92d41a-646a-465b-ae9b-33250e2728b0" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="2b964db8-6a7b-497c-993c-0ad6d3ee237d" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="34948240-fb3a-439e-94a9-98ae262afe26" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="29500e5c-4643-4eaf-9f16-75c02649cccc" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="3d7d3a02-a757-4981-9d64-49c978b67846" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="text-center py-8" data-unique-id="ab4c9bfa-7819-4509-8f67-cc0d0e415d35" data-file-name="components/statistics/DailyRegistrations.tsx">
            <p className="text-muted-foreground text-red-500" data-unique-id="2c6fd968-7af5-4a18-9f3d-a0c74dc736b5" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{error}</p>
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
  return <Card data-unique-id="b579b25f-0d0c-47b6-a3a8-ad52a3039a09" data-file-name="components/statistics/DailyRegistrations.tsx">
      <CardHeader data-unique-id="2b261ed9-93fd-40d6-8d08-c4e518f9bfd6" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="5a20efc4-2025-4500-953e-9663a125276d" data-file-name="components/statistics/DailyRegistrations.tsx">
          <Calendar className="h-5 w-5" data-unique-id="aeb5579e-77d9-4f42-b818-b72c93a9cff8" data-file-name="components/statistics/DailyRegistrations.tsx" />
          <span className="editable-text" data-unique-id="a53b4741-7ab6-4e3c-b0c9-71ec912c54e0" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground" data-unique-id="6bac01bd-b42a-4ff0-ac8c-a6d27a571011" data-file-name="components/statistics/DailyRegistrations.tsx">
          <span className="editable-text" data-unique-id="7f140715-fc5a-4708-a5b0-5d9f749b106e" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Analisis pendaftaran user harian untuk {monthNames[month - 1]} {year}</span>
        </p>
      </CardHeader>
      <CardContent data-unique-id="13dc9009-5a4a-4dd6-bf1f-b728f9dd0161" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-unique-id="d83c6a80-e974-4b73-828a-3abc9922b3e5" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200" data-unique-id="90ae3b0f-6264-4c92-8020-f42121d86845" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="e1361ebe-5d45-4889-b52e-5d5d8365c0d5" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="5f44d4ba-7dc1-4227-91b7-7583d73ed717" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-blue-700" data-unique-id="8492946e-ae16-4881-96c5-2780fadabcea" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="48020ba3-a1a9-4cc1-ab25-adfe66fd6e65" data-file-name="components/statistics/DailyRegistrations.tsx">Total Pendaftaran</span>
                </p>
                <p className="text-2xl font-bold text-blue-900" data-unique-id="4a9e14f7-0341-4f28-9de5-2b09b4dd242c" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{totalRegistrations}</p>
                <p className="text-xs text-blue-600" data-unique-id="8c1d3030-f8ee-461e-9bdd-58380bb8b24b" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="55689593-d951-45ef-a4e7-aa36abd04fc3" data-file-name="components/statistics/DailyRegistrations.tsx">bulan ini</span>
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-unique-id="05f5d670-781e-42c9-a869-ebff49f25425" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="27ae800a-254e-49bf-8f43-d8cbc6d28826" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="acd6465c-db4f-49f8-97ff-c625ab3490a7" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-green-700" data-unique-id="e5661302-5665-4952-b541-257a14cc6b4c" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="2b9cba11-44f1-413f-bdf3-bb913f90b601" data-file-name="components/statistics/DailyRegistrations.tsx">Rata-rata per Hari</span>
                </p>
                <p className="text-2xl font-bold text-green-900" data-unique-id="c9b5ad35-3245-41cc-8b30-64f5f8a751d1" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{averagePerDay}</p>
                <p className="text-xs text-green-600" data-unique-id="bae6b534-3f6f-402b-85ec-e0161f608799" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="d11044af-1555-4982-a072-ec9688e37e75" data-file-name="components/statistics/DailyRegistrations.tsx">user/hari</span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200" data-unique-id="a08fe95a-2963-44fc-9692-f10f5271d64a" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="4fee9e67-bdee-48a9-a6d3-3d546d9283a4" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="82fa489f-0b75-40b7-afa0-d14dfc0800e6" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-purple-700" data-unique-id="32669262-f12b-4ebc-b526-49fa440ddede" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="4d231ad1-4280-4619-bb1e-7acf5ae2b6f5" data-file-name="components/statistics/DailyRegistrations.tsx">Hari Tertinggi</span>
                </p>
                <p className="text-2xl font-bold text-purple-900" data-unique-id="bd286bb4-0484-4511-a3ff-9f69066a1ff7" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{peakDay.registrations}</p>
                <p className="text-xs text-purple-600" data-unique-id="45a448a4-af1a-4e38-ac2f-cb33cb0a988d" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="7177847b-8738-46ca-bb41-cc25dcf9d4e7" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">tanggal {peakDay.day}</span>
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" data-unique-id="0714e176-e58f-480e-9e98-e81905442e5e" data-file-name="components/statistics/DailyRegistrations.tsx" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="bar" className="space-y-4" data-unique-id="87460375-74eb-40de-b2f6-e6f0f82ac06e" data-file-name="components/statistics/DailyRegistrations.tsx">
          <TabsList>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="02a2fbd7-1ef3-4683-a75b-fd831475e1ac" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Batang</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="b38f8410-5fcf-46d0-b3a7-ae182407db48" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Garis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="h-80" data-unique-id="6e4939bc-af88-4f05-a299-f808eac1e493" data-file-name="components/statistics/DailyRegistrations.tsx">
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
            <div className="h-80" data-unique-id="3fbcf748-22b6-44de-8b3f-9c701eab580e" data-file-name="components/statistics/DailyRegistrations.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="83990b53-e4b4-40dd-85e2-406d19ebe740" data-file-name="components/statistics/DailyRegistrations.tsx">
          <p className="text-sm text-blue-800" data-unique-id="e8545ba1-0f5f-442b-aa58-dd2b90053b6a" data-file-name="components/statistics/DailyRegistrations.tsx">
            <span className="editable-text" data-unique-id="799f08a1-1b03-4224-82ee-0d25595440cc" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Menampilkan jumlah user yang mendaftar setiap hari dalam bulan {monthNames[month - 1]} {year}. 
            Total {totalRegistrations} pendaftaran dengan rata-rata {averagePerDay} pendaftaran per hari.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}