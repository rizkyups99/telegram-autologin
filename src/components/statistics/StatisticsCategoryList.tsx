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
  return <Card data-unique-id="fe9f2f6a-ba0d-434f-a71f-6d27a70a2768" data-file-name="components/statistics/StatisticsCategoryList.tsx">
      <CardHeader data-unique-id="530799ea-e083-416a-97ab-58031c698292" data-file-name="components/statistics/StatisticsCategoryList.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="f633e392-e9a9-416d-a08a-e76bc62349d8" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <Users className="h-5 w-5" />
          <span className="editable-text" data-unique-id="74887ec1-aa60-4039-9d94-bf5715581723" data-file-name="components/statistics/StatisticsCategoryList.tsx">Kategori Populer</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="1b2a5422-8da7-4ca3-86e7-23525c74edab" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
        {/* Filter Analisis Section */}
        <div className="bg-muted p-4 rounded-lg mb-6" data-unique-id="faed7efb-cdc4-48ad-a654-1a818c354777" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <div className="flex items-center gap-2 mb-3" data-unique-id="e48603b3-f54a-499e-9722-514a8cdb2ad4" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium text-sm" data-unique-id="a70af6d0-463e-4b16-803c-308c71cb4ca0" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <span className="editable-text" data-unique-id="9527f090-151d-4ca4-b5c0-fd904e15de07" data-file-name="components/statistics/StatisticsCategoryList.tsx">Filter Analisis</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4" data-unique-id="2147ee33-2b77-4af1-a1c1-7a44d9f8b297" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <div data-unique-id="114799ad-b080-4f64-a34c-1c23e6f109bc" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="cb5f5b06-27d7-45c8-a5a3-c42694201c7c" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="276a061e-05ae-4625-adcf-ff8bf124036d" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tahun</span>
              </label>
              <select value={selectedYear} onChange={e => onYearChange && onYearChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="06400bfc-2a79-43d5-aa19-5015463cafe1" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {years.map(year => <option key={year} value={year} data-unique-id="df0c394c-01a5-4448-9471-6f683fb33703" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {year}
                  </option>)}
              </select>
            </div>
            <div data-unique-id="22545f4f-474f-417b-8796-ca54d75f7f5b" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="3fa8e386-7f35-4149-9232-9e282fc32fe8" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="52a6cde9-3aef-440c-bdfb-0d515b1e8bbe" data-file-name="components/statistics/StatisticsCategoryList.tsx">Bulan</span>
              </label>
              <select value={selectedMonth} onChange={e => onMonthChange && onMonthChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="3034a747-02a2-40f5-8698-44734d0a5c1a" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {months.map(month => <option key={month.value} value={month.value} data-unique-id="f295b166-047d-40ec-a35e-c829d90ef977" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {month.label}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4" data-unique-id="7298c63a-8071-4c04-abe3-2a5c3144ab45" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
          {categorySummary.length === 0 ? <div className="text-center py-8" data-unique-id="4a3f7fb6-c3fd-4d7a-b388-64e239d10523" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <p className="text-muted-foreground" data-unique-id="46ce8452-b14f-4b6d-be6f-921c7e8c90bc" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="775fb473-1d7e-4e51-9a87-b14a575405cb" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tidak ada data kategori untuk periode yang dipilih</span>
              </p>
            </div> : categorySummary.slice(0, 5).map(category => <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted" data-unique-id="b90bbf0f-abc8-41c1-92bc-d591762959d4" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <div className="flex items-center gap-2" data-unique-id="98d1bc37-ef29-48b9-b77b-24efc65d5fda" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <div className="w-2 h-2 rounded-full bg-primary" data-unique-id="25639c68-c300-4b54-a8f3-1358a55b36fb" data-file-name="components/statistics/StatisticsCategoryList.tsx" />
                  <span className="font-medium" data-unique-id="d55970a2-00aa-4122-8085-80c03ecaf2ae" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.name}</span>
                </div>
                <div className="text-right" data-unique-id="520b149e-d4d3-49d5-8817-260e8ad19bb9" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <p className="text-2xl font-bold" data-unique-id="af8a736f-f38d-4693-9489-26d41218fbe6" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.count}</p>
                  <p className="text-xs text-muted-foreground" data-unique-id="49e28576-76dc-4389-b016-e987fb4c1bf9" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                    <span className="editable-text" data-unique-id="c0cff95c-91a5-4adc-ab10-7bda9cca0772" data-file-name="components/statistics/StatisticsCategoryList.tsx">users</span>
                  </p>
                </div>
              </div>)}
        </div>
      </CardContent>
    </Card>;
}