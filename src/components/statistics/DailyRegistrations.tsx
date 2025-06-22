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
    return <Card data-unique-id="531a2386-cea6-42ef-a5f4-2c71714308ec" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="18e38934-ef79-49cd-9842-bb17160ef622" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="090c7e8d-6e50-41e5-9964-f34ac5bf74f4" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="d38389f5-c7cd-4b41-92eb-ccd3fc0d93c2" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="45e3dfea-6449-4347-8344-33fb089d1abf" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="8db9a00f-c24d-4815-8373-7002b755ca09" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="flex justify-center py-8" data-unique-id="9e4c71e2-d713-443f-94c8-bc0b6590732a" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="2eb5831b-1fb1-4d70-abf3-39444e8d635b" data-file-name="components/statistics/DailyRegistrations.tsx"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card data-unique-id="709e8df9-c7ab-45d2-9f0c-de862e016cbd" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="6fba9f6e-8a09-4033-a30e-19326e0bb39a" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="1bbb9dd9-5bc6-4357-adda-64433ba0f772" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="6d9ed33e-19b9-4365-adc4-c6db4672d04b" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="262107ed-0fce-4822-8887-ebabb052e65d" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="c1cc1d3d-3c43-4d9b-bb52-90b1b891b765" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="text-center py-8" data-unique-id="21ec3bb4-12de-451b-a66e-01ab5afb683b" data-file-name="components/statistics/DailyRegistrations.tsx">
            <p className="text-muted-foreground text-red-500" data-unique-id="1963c6ef-38eb-4a2f-bea0-262453d7fa3d" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{error}</p>
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
  return <Card data-unique-id="a87eed15-da23-4367-9e31-c1e8674e4035" data-file-name="components/statistics/DailyRegistrations.tsx">
      <CardHeader data-unique-id="e8750a1e-6846-4742-af81-bf2413933af3" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="89148695-5e2a-45ff-8215-1482f2184658" data-file-name="components/statistics/DailyRegistrations.tsx">
          <Calendar className="h-5 w-5" data-unique-id="b2197d20-1ab7-4f6b-8cc1-0eaccd4d4357" data-file-name="components/statistics/DailyRegistrations.tsx" />
          <span className="editable-text" data-unique-id="c7b9d05d-6166-490d-a0a7-0dcc5848b26b" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground" data-unique-id="126043b0-c266-461e-8114-d9090862eebe" data-file-name="components/statistics/DailyRegistrations.tsx">
          <span className="editable-text" data-unique-id="9bc2558d-d389-406b-b7d5-1f3032e7cd4b" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Analisis pendaftaran user harian untuk {monthNames[month - 1]} {year}</span>
        </p>
      </CardHeader>
      <CardContent data-unique-id="2563b396-8035-473d-9a94-a5aba80c9e77" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-unique-id="89388b89-1ba0-43dd-ab91-e3964f0e8bb3" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200" data-unique-id="aca762b3-a8dc-4ab8-a78c-f60d753ef358" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="9f0dd90d-0efb-481c-8902-12ea422b2b4f" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="5e48c875-2632-4fcd-afcb-55f87fafb656" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-blue-700" data-unique-id="ba4cdb54-fae7-472e-b5f7-fd9cd65eea26" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="d33cff0b-3d3f-45b9-9647-76b559c560b7" data-file-name="components/statistics/DailyRegistrations.tsx">Total Pendaftaran</span>
                </p>
                <p className="text-2xl font-bold text-blue-900" data-unique-id="93489c7e-45f2-4f0a-8140-04d4be792e0c" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{totalRegistrations}</p>
                <p className="text-xs text-blue-600" data-unique-id="b58db416-7b8e-457e-ad9e-a30277971355" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="0e59974c-2b34-4b00-b7c9-90606f3fa7ac" data-file-name="components/statistics/DailyRegistrations.tsx">bulan ini</span>
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-unique-id="cd1b4aa6-e2d7-4a58-9b0d-fd0732ffcccb" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="1e38a372-47e4-4bc5-a944-48ecda810470" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="687f99f4-dac0-4897-bc6c-088e59a2e57e" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-green-700" data-unique-id="9d38a08a-c075-44da-9153-28b3c8eb46bc" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="077851dc-ce3e-4884-8863-ccb02bd9bf9e" data-file-name="components/statistics/DailyRegistrations.tsx">Rata-rata per Hari</span>
                </p>
                <p className="text-2xl font-bold text-green-900" data-unique-id="6436e06b-42e1-4dda-84d8-6d32449780b8" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{averagePerDay}</p>
                <p className="text-xs text-green-600" data-unique-id="36bf5649-9268-4d0a-a4d0-634bcb32f9f0" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="a2540d14-b295-4b2e-9697-9f2517cb20ee" data-file-name="components/statistics/DailyRegistrations.tsx">user/hari</span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200" data-unique-id="c4d5d8f9-78cb-4e24-b65c-73c6065e7119" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="502eb834-2b43-4ee9-9358-d373336382f0" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="74f00d0e-5f1a-4fd4-8b61-e5e8f02faf22" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-purple-700" data-unique-id="585c4752-16fb-4d3f-8f7e-8d6d147d144b" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="81a47357-a890-440a-8d9e-5bea18b7a2e7" data-file-name="components/statistics/DailyRegistrations.tsx">Hari Tertinggi</span>
                </p>
                <p className="text-2xl font-bold text-purple-900" data-unique-id="b06ba0f0-e455-4046-9133-613ddc2ef998" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{peakDay.registrations}</p>
                <p className="text-xs text-purple-600" data-unique-id="87a39fd3-ac43-4a07-9669-4b29123dc602" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="0247992d-841b-46c5-815d-aecd92ee525a" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">tanggal {peakDay.day}</span>
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" data-unique-id="fc92cba3-d871-4b14-ad43-fb8b30898051" data-file-name="components/statistics/DailyRegistrations.tsx" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="bar" className="space-y-4" data-unique-id="c5c2b81e-258f-4a1b-be1f-9ec1e0b5ae22" data-file-name="components/statistics/DailyRegistrations.tsx">
          <TabsList>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="5c200003-40b9-4dd4-bb06-3d76ea56330b" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Batang</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="5490473e-2abf-48fb-a086-956c4aabd1b3" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Garis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="h-80" data-unique-id="9e034ca4-5cdf-412a-b07b-dd8325eb0e29" data-file-name="components/statistics/DailyRegistrations.tsx">
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
            <div className="h-80" data-unique-id="d25f7672-7fd6-4225-909f-98efe6bb956f" data-file-name="components/statistics/DailyRegistrations.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="e20071c1-095a-4c52-95c7-54aeaafb4a34" data-file-name="components/statistics/DailyRegistrations.tsx">
          <p className="text-sm text-blue-800" data-unique-id="77af45ba-bf42-4844-b9a0-d3cf0b2304be" data-file-name="components/statistics/DailyRegistrations.tsx">
            <span className="editable-text" data-unique-id="f1820355-d0f8-4d63-9eed-b688c7ce02f1" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Menampilkan jumlah user yang mendaftar setiap hari dalam bulan {monthNames[month - 1]} {year}. 
            Total {totalRegistrations} pendaftaran dengan rata-rata {averagePerDay} pendaftaran per hari.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}