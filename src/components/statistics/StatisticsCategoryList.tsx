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
  return <Card data-unique-id="f14e2120-3f8d-4b30-a5bc-d7d0180456b1" data-file-name="components/statistics/StatisticsCategoryList.tsx">
      <CardHeader data-unique-id="265e70a4-54e2-4a4c-9b19-9e603620560c" data-file-name="components/statistics/StatisticsCategoryList.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="a09abd91-71a5-4681-8a25-4b6698a44bc7" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <Users className="h-5 w-5" />
          <span className="editable-text" data-unique-id="7f10dcb3-4041-4acf-9e5e-7a5e0edad8f0" data-file-name="components/statistics/StatisticsCategoryList.tsx">Kategori Populer</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="34dcbe6d-a90c-4ae8-b1c6-6295f8e611b3" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
        {/* Filter Analisis Section */}
        <div className="bg-muted p-4 rounded-lg mb-6" data-unique-id="ee065242-e977-4956-9ef8-3bdc61fab4cd" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <div className="flex items-center gap-2 mb-3" data-unique-id="63b38d8c-fba2-4517-8011-78b4fd6bed78" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium text-sm" data-unique-id="c30ce9d6-34b7-4614-9566-ad0776208986" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <span className="editable-text" data-unique-id="7b7550b7-a068-40d4-85f8-35af165a383a" data-file-name="components/statistics/StatisticsCategoryList.tsx">Filter Analisis</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4" data-unique-id="7f0d60a3-5089-4169-acb1-546982b5f7c4" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <div data-unique-id="c710f568-c2a6-490d-a64f-01d12a797a20" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="21424c37-6a1c-4570-801d-e25a481c76b4" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="c4ac0207-f505-4b3b-9dd8-6f073f28e6cb" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tahun</span>
              </label>
              <select value={selectedYear} onChange={e => onYearChange && onYearChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="25c977d1-e0cc-4377-90ea-9f9205889011" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {years.map(year => <option key={year} value={year} data-unique-id="ff53fd2b-8abf-4d40-b795-beae4fbaca55" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {year}
                  </option>)}
              </select>
            </div>
            <div data-unique-id="8182b433-1f3f-42fe-96c0-80de3051578c" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="92023546-9a15-42c8-ade8-70ea8ed45382" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="fc2829eb-c9ba-421d-a83e-35bab3967ec8" data-file-name="components/statistics/StatisticsCategoryList.tsx">Bulan</span>
              </label>
              <select value={selectedMonth} onChange={e => onMonthChange && onMonthChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="9192a514-2129-4220-9ffa-87ad9a80039f" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {months.map(month => <option key={month.value} value={month.value} data-unique-id="807017f5-eecd-4a7a-8140-8c482a3500a6" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {month.label}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4" data-unique-id="9128422e-240d-40e8-8321-8d9c93ccb0ef" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
          {categorySummary.length === 0 ? <div className="text-center py-8" data-unique-id="4298f134-0f04-4954-a607-4c18de803933" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <p className="text-muted-foreground" data-unique-id="bd31607f-9162-4ac6-ad4a-8febbb612c83" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="ab809d04-50dd-4123-ac6c-59ecfbacbf85" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tidak ada data kategori untuk periode yang dipilih</span>
              </p>
            </div> : categorySummary.slice(0, 5).map(category => <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted" data-unique-id="7b72692f-7b11-4414-8427-4534f0686866" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <div className="flex items-center gap-2" data-unique-id="7700c493-97c1-4ed1-a0d6-625cf2ff686e" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <div className="w-2 h-2 rounded-full bg-primary" data-unique-id="456eac17-edd5-4d36-92a3-ecdb54379a1f" data-file-name="components/statistics/StatisticsCategoryList.tsx" />
                  <span className="font-medium" data-unique-id="202c02dc-b2d5-46ba-a720-dc816cb298ed" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.name}</span>
                </div>
                <div className="text-right" data-unique-id="353696dc-19ae-454a-9a97-e8713a6507f7" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <p className="text-2xl font-bold" data-unique-id="7618bd54-1be9-4644-938b-384875b3f974" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.count}</p>
                  <p className="text-xs text-muted-foreground" data-unique-id="b21860a2-dfd2-4c7d-ad0f-ea6608a1675c" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                    <span className="editable-text" data-unique-id="fb3cef6b-52d3-4fdc-b71b-939060229d00" data-file-name="components/statistics/StatisticsCategoryList.tsx">users</span>
                  </p>
                </div>
              </div>)}
        </div>
      </CardContent>
    </Card>;
}