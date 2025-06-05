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
    return <Card data-unique-id="e1d35f6b-9b90-42af-a8a6-83d5c6225904" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="8d0994a9-4aba-4cec-9528-aa06385bcd22" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="6fab7e3b-0140-46d0-a7e9-57c8d9c59965" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="dadde9d8-19c2-4a04-ae77-b92c88646d0c" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="506b3f77-b9b3-47a2-8d0e-4fdeed3915c6" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="f514535c-0a4d-439f-b321-e47ef09c755a" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="flex justify-center py-8" data-unique-id="2630a19b-a95e-48f8-8834-b5fceba69e7c" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="44fd4ede-4b29-4063-b7f3-35b377e18672" data-file-name="components/statistics/DailyRegistrations.tsx"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card data-unique-id="46a23982-93fe-4519-99f8-b9441266f4c8" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardHeader data-unique-id="3e755d55-2585-47a4-8ff8-ca7774395b6c" data-file-name="components/statistics/DailyRegistrations.tsx">
          <CardTitle className="flex items-center gap-2" data-unique-id="511d3163-65c6-4d2f-9370-da6b540356bf" data-file-name="components/statistics/DailyRegistrations.tsx">
            <Calendar className="h-5 w-5" data-unique-id="1ade592e-0753-4a95-bbbf-bff8582cefc2" data-file-name="components/statistics/DailyRegistrations.tsx" />
            <span className="editable-text" data-unique-id="ee5a376d-6823-4caa-a562-6c074bc41991" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
          </CardTitle>
        </CardHeader>
        <CardContent data-unique-id="a446631f-989d-490e-9ad0-ffbe1cdc22d9" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="text-center py-8" data-unique-id="28de4b21-2bcc-4954-a66c-6b605f11270a" data-file-name="components/statistics/DailyRegistrations.tsx">
            <p className="text-muted-foreground text-red-500" data-unique-id="82187b1c-827b-4a02-9ed4-26ed43a9e9eb" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{error}</p>
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
  return <Card data-unique-id="d8e03ba0-553c-4f35-9764-134fb88c5e5e" data-file-name="components/statistics/DailyRegistrations.tsx">
      <CardHeader data-unique-id="a0967ec0-a75c-42fb-bf8e-582992e6bff2" data-file-name="components/statistics/DailyRegistrations.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="3b2b1662-d229-42cf-8f39-553b99810935" data-file-name="components/statistics/DailyRegistrations.tsx">
          <Calendar className="h-5 w-5" data-unique-id="7516d5b7-3ff5-404c-b565-79ec566ab626" data-file-name="components/statistics/DailyRegistrations.tsx" />
          <span className="editable-text" data-unique-id="31d42cb5-833c-479a-8715-0082414a50be" data-file-name="components/statistics/DailyRegistrations.tsx">Pendaftaran User Per Hari</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground" data-unique-id="7617b5cd-6ae3-46a5-abe9-33ded0eaaf11" data-file-name="components/statistics/DailyRegistrations.tsx">
          <span className="editable-text" data-unique-id="7fdee2cd-1fef-4fc9-9d06-81164505eebf" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Analisis pendaftaran user harian untuk {monthNames[month - 1]} {year}</span>
        </p>
      </CardHeader>
      <CardContent data-unique-id="ef5d3ead-9853-4400-9a75-c8873f59932d" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-unique-id="553ef532-4a61-42a6-b373-b33dc1032018" data-file-name="components/statistics/DailyRegistrations.tsx">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200" data-unique-id="d2aeca16-203c-448b-940f-b209acb91d72" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="c6489985-dc22-4dae-8e5e-aaf39cbaf9b1" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="6a5cd26d-87ad-477d-9bca-cd349f041e31" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-blue-700" data-unique-id="9ea0703c-d6e1-47e8-bede-f13c5c3f6826" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="be19651c-04df-46b9-8729-ccd0c14425b4" data-file-name="components/statistics/DailyRegistrations.tsx">Total Pendaftaran</span>
                </p>
                <p className="text-2xl font-bold text-blue-900" data-unique-id="dcf67528-e3f5-43b4-a215-db5c78e84deb" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{totalRegistrations}</p>
                <p className="text-xs text-blue-600" data-unique-id="333eff5d-7813-4928-ad9c-946960639c92" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="ea1bb1cf-ec5b-4eb0-92d6-7046b5babf0b" data-file-name="components/statistics/DailyRegistrations.tsx">bulan ini</span>
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200" data-unique-id="93b556c0-3600-4c01-8fe2-0e87a2a30c9d" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="4f5c197f-5c5c-4e70-9bb9-254d5b0c9531" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="902d15e6-fd0a-4349-ba3f-7b7e4dda6b1e" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-green-700" data-unique-id="a70273be-ada0-4dc2-8cdc-7cb3c571bb02" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="444b6907-a428-4439-8820-d437c50e6075" data-file-name="components/statistics/DailyRegistrations.tsx">Rata-rata per Hari</span>
                </p>
                <p className="text-2xl font-bold text-green-900" data-unique-id="5d4b2443-40ec-46a0-bfdc-b78a8117e22b" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{averagePerDay}</p>
                <p className="text-xs text-green-600" data-unique-id="3060826d-f316-4bb3-8739-289c8c2a03da" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="db5d4c39-afc1-45ab-b2f6-c68518dfce5b" data-file-name="components/statistics/DailyRegistrations.tsx">user/hari</span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200" data-unique-id="afce605c-89af-4bc8-b5c6-2742474b16ee" data-file-name="components/statistics/DailyRegistrations.tsx">
            <div className="flex items-center justify-between" data-unique-id="6ebaf838-4c2c-4139-9fc5-d511ecc264ad" data-file-name="components/statistics/DailyRegistrations.tsx">
              <div data-unique-id="26cf64a8-82e0-45ba-b575-1c7b323af0f1" data-file-name="components/statistics/DailyRegistrations.tsx">
                <p className="text-sm font-medium text-purple-700" data-unique-id="e92960d7-cfb1-4733-a788-3571c0680921" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="693b4973-0c3f-4cff-b051-cd129768ef90" data-file-name="components/statistics/DailyRegistrations.tsx">Hari Tertinggi</span>
                </p>
                <p className="text-2xl font-bold text-purple-900" data-unique-id="51b68a4a-7bf3-454e-b01d-7d22eff578ae" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">{peakDay.registrations}</p>
                <p className="text-xs text-purple-600" data-unique-id="626706d3-2e58-4f2d-b3f2-d32b5a04e902" data-file-name="components/statistics/DailyRegistrations.tsx">
                  <span className="editable-text" data-unique-id="cfd38cc5-7941-442e-b829-a74007cc2bd6" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">tanggal {peakDay.day}</span>
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" data-unique-id="97289c32-3427-4fe1-a268-66ec505b5c15" data-file-name="components/statistics/DailyRegistrations.tsx" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="bar" className="space-y-4" data-unique-id="ac69bc42-5da7-43ba-9811-fb61b6bc7a88" data-file-name="components/statistics/DailyRegistrations.tsx">
          <TabsList>
            <TabsTrigger value="bar" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="5283c547-550a-489f-b6b5-ab63e5f41fcf" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Batang</span>
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-2">
              <span className="editable-text" data-unique-id="e4a5f255-23ca-4877-8f3c-38a509c78531" data-file-name="components/statistics/DailyRegistrations.tsx">Grafik Garis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="space-y-4">
            <div className="h-80" data-unique-id="1977f538-73e1-4202-8867-f573d3c5cc00" data-file-name="components/statistics/DailyRegistrations.tsx">
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
            <div className="h-80" data-unique-id="bdc1fb74-d44c-47cd-8290-db79d72ef67e" data-file-name="components/statistics/DailyRegistrations.tsx">
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg" data-unique-id="b2900743-88a0-405a-9a38-bdbe4584563e" data-file-name="components/statistics/DailyRegistrations.tsx">
          <p className="text-sm text-blue-800" data-unique-id="ca34a105-a28f-44d9-b487-61c519eaada9" data-file-name="components/statistics/DailyRegistrations.tsx">
            <span className="editable-text" data-unique-id="fd8a0b53-f119-4353-847d-12869d1aa92c" data-file-name="components/statistics/DailyRegistrations.tsx" data-dynamic-text="true">Menampilkan jumlah user yang mendaftar setiap hari dalam bulan {monthNames[month - 1]} {year}. 
            Total {totalRegistrations} pendaftaran dengan rata-rata {averagePerDay} pendaftaran per hari.</span>
          </p>
        </div>
      </CardContent>
    </Card>;
}