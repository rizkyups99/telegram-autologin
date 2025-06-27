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
  return <Card data-unique-id="721c270e-2213-4a31-bfd3-b994657d24e0" data-file-name="components/statistics/StatisticsCategoryList.tsx">
      <CardHeader data-unique-id="ea51afd6-1ac1-4e43-b1a2-785f48d859e1" data-file-name="components/statistics/StatisticsCategoryList.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="494c0a54-76d1-4cc7-8166-9a73bb235c81" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <Users className="h-5 w-5" />
          <span className="editable-text" data-unique-id="c528b53d-4805-4b4f-988d-37b234057630" data-file-name="components/statistics/StatisticsCategoryList.tsx">Kategori Populer</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="dceaeb4f-c4d2-4175-bfe7-49200e8ede24" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
        {/* Filter Analisis Section */}
        <div className="bg-muted p-4 rounded-lg mb-6" data-unique-id="82a152c0-0895-4aea-8ec6-2518d052c315" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <div className="flex items-center gap-2 mb-3" data-unique-id="c3961297-0f4c-4108-ac6c-36bf38e20613" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium text-sm" data-unique-id="06dabc3c-4cec-4d1f-b54e-00f73876c979" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <span className="editable-text" data-unique-id="40731756-92a9-498b-a7f6-650bc793a4fe" data-file-name="components/statistics/StatisticsCategoryList.tsx">Filter Analisis</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4" data-unique-id="b6e509ed-0705-467a-a3cb-e3c65c7653d4" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <div data-unique-id="049481c5-ac5d-4c17-a211-76980bd5963e" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="d59d4499-27a9-4e26-936c-93f73720f367" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="0e8282b1-adae-445d-a9a9-df756c7a3021" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tahun</span>
              </label>
              <select value={selectedYear} onChange={e => onYearChange && onYearChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="070bef65-457a-4505-9b8c-9469f06e27e5" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {years.map(year => <option key={year} value={year} data-unique-id="6e3e5082-a5fe-472f-b5d2-b6cc807a993a" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {year}
                  </option>)}
              </select>
            </div>
            <div data-unique-id="bb507a20-cc58-427d-bf6e-fa668c77b426" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="4b4c0e51-3398-4572-adc5-7ae5e923e862" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="9505b75e-7cbe-4b68-9034-2afacf4c070a" data-file-name="components/statistics/StatisticsCategoryList.tsx">Bulan</span>
              </label>
              <select value={selectedMonth} onChange={e => onMonthChange && onMonthChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="7cc499f2-8118-4d3d-9bec-a384f9977460" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {months.map(month => <option key={month.value} value={month.value} data-unique-id="8c0751cd-3a25-435a-a77d-ce17fc5e4644" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {month.label}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4" data-unique-id="9d3f77e1-86c9-4402-b73f-2e3f5875a4b7" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
          {categorySummary.length === 0 ? <div className="text-center py-8" data-unique-id="66198d3d-1491-4731-8307-7a09f89170fc" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <p className="text-muted-foreground" data-unique-id="53eb3365-086d-40e1-aa3a-3a023f078c2b" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="5ed4bc28-52ee-4dd2-90df-e92200234114" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tidak ada data kategori untuk periode yang dipilih</span>
              </p>
            </div> : categorySummary.slice(0, 5).map(category => <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted" data-unique-id="768baea5-d9be-404d-be4e-5577a4f6bb86" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <div className="flex items-center gap-2" data-unique-id="b634b97c-2cef-4cc7-8a19-a296ab032b25" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <div className="w-2 h-2 rounded-full bg-primary" data-unique-id="40a9582b-650d-4a5e-863d-90ecd453ac41" data-file-name="components/statistics/StatisticsCategoryList.tsx" />
                  <span className="font-medium" data-unique-id="66e07bfd-d5a2-4600-a11d-916d010a1d1c" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.name}</span>
                </div>
                <div className="text-right" data-unique-id="3cc8af2a-57c9-4490-a7e3-1607f77b7f19" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <p className="text-2xl font-bold" data-unique-id="e3f8c606-03c3-4843-9be7-d0560db479e5" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.count}</p>
                  <p className="text-xs text-muted-foreground" data-unique-id="71e990d4-6573-4cba-8f62-18c1a3ead6c5" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                    <span className="editable-text" data-unique-id="bfdd7eef-9b90-4cfb-9ee3-67601c7f99e1" data-file-name="components/statistics/StatisticsCategoryList.tsx">users</span>
                  </p>
                </div>
              </div>)}
        </div>
      </CardContent>
    </Card>;
}