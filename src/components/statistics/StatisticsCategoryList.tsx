'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Filter } from 'lucide-react';
import { CategoryData } from './types';
interface StatisticsCategoryListProps {
  categorySummary: CategoryData[];
  selectedYear?: number;
  selectedMonth?: number;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
}
export function StatisticsCategoryList({
  categorySummary,
  selectedYear = new Date().getFullYear(),
  selectedMonth = new Date().getMonth() + 1,
  onYearChange,
  onMonthChange
}: StatisticsCategoryListProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({
    length: 5
  }, (_, i) => currentYear - i);
  const months = [{
    value: 1,
    label: 'Januari'
  }, {
    value: 2,
    label: 'Februari'
  }, {
    value: 3,
    label: 'Maret'
  }, {
    value: 4,
    label: 'April'
  }, {
    value: 5,
    label: 'Mei'
  }, {
    value: 6,
    label: 'Juni'
  }, {
    value: 7,
    label: 'Juli'
  }, {
    value: 8,
    label: 'Agustus'
  }, {
    value: 9,
    label: 'September'
  }, {
    value: 10,
    label: 'Oktober'
  }, {
    value: 11,
    label: 'November'
  }, {
    value: 12,
    label: 'Desember'
  }];
  if (categorySummary.length === 0) {
    return null;
  }
  return <Card data-unique-id="f2d4b944-b00c-4a82-b502-3b44c954b199" data-file-name="components/statistics/StatisticsCategoryList.tsx">
      <CardHeader data-unique-id="3a392601-2d04-4bff-93d0-d96c65cafb7e" data-file-name="components/statistics/StatisticsCategoryList.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="1b45bc14-7341-4135-afaf-bf2cf94d4567" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <Users className="h-5 w-5" />
          <span className="editable-text" data-unique-id="a58f9163-465f-4110-92c0-18bfb7112bc8" data-file-name="components/statistics/StatisticsCategoryList.tsx">Kategori Populer</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="35d118ff-c8b0-4945-bc79-a50409849ada" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
        {/* Filter Analisis Section */}
        <div className="bg-muted p-4 rounded-lg mb-6" data-unique-id="67618224-201e-46cf-a590-02e461112e18" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <div className="flex items-center gap-2 mb-3" data-unique-id="db5d474b-a0ba-4b92-a5e9-6451f2f64ef8" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium text-sm" data-unique-id="0ac1a4ed-a29e-4c89-9b78-88e1ebeabaef" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <span className="editable-text" data-unique-id="b73f55c1-01f6-4ef5-8e53-d099e82ba6c1" data-file-name="components/statistics/StatisticsCategoryList.tsx">Filter Analisis</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4" data-unique-id="88e8660a-6c83-4309-a3e4-2a21efba5e03" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <div data-unique-id="7886098d-980b-4cf0-9a3e-f4de2020e5aa" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="1596d196-583c-470d-bd87-64122f9e948a" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="c40d671d-dcee-4fd2-a572-40eec5125b31" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tahun</span>
              </label>
              <select value={selectedYear} onChange={e => onYearChange && onYearChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="40be9553-5b6b-4ee4-8030-a6c89eab843e" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {years.map(year => <option key={year} value={year} data-unique-id="f4f5a801-1383-4d2f-93df-027977dc1edd" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {year}
                  </option>)}
              </select>
            </div>
            <div data-unique-id="d61acd6b-4fd8-4793-84b8-1fd67bacf25b" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="1f14d2ef-32bc-4569-b99b-d864388db34d" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="9117bd7d-7ade-4e74-914b-73203d64b55b" data-file-name="components/statistics/StatisticsCategoryList.tsx">Bulan</span>
              </label>
              <select value={selectedMonth} onChange={e => onMonthChange && onMonthChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="d06f550a-b10e-4913-aa9f-ea5c93a41065" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {months.map(month => <option key={month.value} value={month.value} data-unique-id="77935714-c5ae-4d39-9717-5ac1d5f95cf2" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {month.label}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4" data-unique-id="d9017fe0-f385-44d8-bae2-16baaf34e683" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
          {categorySummary.length === 0 ? <div className="text-center py-8" data-unique-id="e31a4dcd-36d5-47f4-8355-ac525a2dfe8a" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <p className="text-muted-foreground" data-unique-id="47ded207-5c0b-4017-9d01-85b870db85c1" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="a67c008e-3d32-4fa2-a8d0-b6f295d75637" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tidak ada data kategori untuk periode yang dipilih</span>
              </p>
            </div> : categorySummary.slice(0, 5).map(category => <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted" data-unique-id="4efa9de1-5216-4c57-94ce-1441ada888fa" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <div className="flex items-center gap-2" data-unique-id="955fe0b6-a244-4002-a351-4ffcafab94ad" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <div className="w-2 h-2 rounded-full bg-primary" data-unique-id="8f538db2-7ffb-42ba-8907-90d4069497c4" data-file-name="components/statistics/StatisticsCategoryList.tsx" />
                  <span className="font-medium" data-unique-id="f14ba1ab-716a-4cc1-890c-c0c9dba6d8cd" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.name}</span>
                </div>
                <div className="text-right" data-unique-id="3637668e-3a50-4039-b472-8c796eeea552" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <p className="text-2xl font-bold" data-unique-id="c6fbfacb-ee66-403a-b869-0afb61fef502" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.count}</p>
                  <p className="text-xs text-muted-foreground" data-unique-id="c98a60e1-d6ac-4780-82bd-32682a562bad" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                    <span className="editable-text" data-unique-id="36e2d34f-1ef9-4865-b7df-ba314666c57a" data-file-name="components/statistics/StatisticsCategoryList.tsx">users</span>
                  </p>
                </div>
              </div>)}
        </div>
      </CardContent>
    </Card>;
}