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
  return <Card data-unique-id="16b59bbd-7b0a-4376-91ec-e285a2ad74e0" data-file-name="components/statistics/StatisticsCategoryList.tsx">
      <CardHeader data-unique-id="67ad04dc-66d0-449f-ba29-4decff1de66b" data-file-name="components/statistics/StatisticsCategoryList.tsx">
        <CardTitle className="flex items-center gap-2" data-unique-id="f9540210-bdfe-4711-a665-5028817b41df" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <Users className="h-5 w-5" />
          <span className="editable-text" data-unique-id="479d7cfa-af97-43e2-a819-79692e898800" data-file-name="components/statistics/StatisticsCategoryList.tsx">Kategori Populer</span>
        </CardTitle>
      </CardHeader>
      <CardContent data-unique-id="b3241471-f4bd-4bf8-88ba-09eaa58a443a" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
        {/* Filter Analisis Section */}
        <div className="bg-muted p-4 rounded-lg mb-6" data-unique-id="34fbb806-6347-4a1f-951c-53c7746201a2" data-file-name="components/statistics/StatisticsCategoryList.tsx">
          <div className="flex items-center gap-2 mb-3" data-unique-id="cebe7c14-1fc9-48ef-9358-ae6329cc3a8f" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium text-sm" data-unique-id="d6a46473-da90-487e-95a3-2876d082dc98" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <span className="editable-text" data-unique-id="4b0589a7-633a-4ea9-b456-91deb3803c1a" data-file-name="components/statistics/StatisticsCategoryList.tsx">Filter Analisis</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4" data-unique-id="2c21485a-bd92-4a0a-b8b4-32e4917f098a" data-file-name="components/statistics/StatisticsCategoryList.tsx">
            <div data-unique-id="fce1d8c1-297d-4829-a5c9-6213d4fad214" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="25b81491-31b3-4b69-a244-7478da9173a4" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="0ba59e29-ba91-4275-aefb-b64245e727c6" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tahun</span>
              </label>
              <select value={selectedYear} onChange={e => onYearChange && onYearChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="c490a4a9-6391-4338-9d20-58f356287129" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {years.map(year => <option key={year} value={year} data-unique-id="dc62b0fc-a622-4652-a28c-69099bf2dfe9" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {year}
                  </option>)}
              </select>
            </div>
            <div data-unique-id="ca4fd0e8-faba-4702-b304-1debb8f9c30d" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="ba76a4a0-a92a-4b62-9618-ae287a0c9cac" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="3bc7eac7-9a97-4692-9a18-d92abfd1cb4c" data-file-name="components/statistics/StatisticsCategoryList.tsx">Bulan</span>
              </label>
              <select value={selectedMonth} onChange={e => onMonthChange && onMonthChange(Number(e.target.value))} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="8b39f702-85b8-4845-a0a1-f1a20374c97d" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                {months.map(month => <option key={month.value} value={month.value} data-unique-id="2a20bc35-38fc-4d9e-9880-240261040315" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
                    {month.label}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4" data-unique-id="87c7d709-4c4e-4ef6-9a0e-e460ff87e57d" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">
          {categorySummary.length === 0 ? <div className="text-center py-8" data-unique-id="9243763f-2014-499d-bcd0-fb177c4141dc" data-file-name="components/statistics/StatisticsCategoryList.tsx">
              <p className="text-muted-foreground" data-unique-id="22f65b87-9b44-4141-866d-2ed497395257" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <span className="editable-text" data-unique-id="f58cc9e3-e048-4664-a9da-b33b15665b51" data-file-name="components/statistics/StatisticsCategoryList.tsx">Tidak ada data kategori untuk periode yang dipilih</span>
              </p>
            </div> : categorySummary.slice(0, 5).map(category => <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted" data-unique-id="3879944e-415b-4dd1-8a02-1b250a468b20" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                <div className="flex items-center gap-2" data-unique-id="583f6362-5b6c-47c2-88fd-fa4422b264fd" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <div className="w-2 h-2 rounded-full bg-primary" data-unique-id="d14efe7f-4a00-4cc0-acfe-cdf3859da94b" data-file-name="components/statistics/StatisticsCategoryList.tsx" />
                  <span className="font-medium" data-unique-id="ae3b8c67-5fda-4773-833d-fc495a35c9b5" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.name}</span>
                </div>
                <div className="text-right" data-unique-id="92cfbf22-a6af-4596-b4e5-091f3f9f89ca" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                  <p className="text-2xl font-bold" data-unique-id="c2f9c244-6f10-4bf7-b515-920726f1c1be" data-file-name="components/statistics/StatisticsCategoryList.tsx" data-dynamic-text="true">{category.count}</p>
                  <p className="text-xs text-muted-foreground" data-unique-id="dc44787a-7105-4db7-bb44-36d3bdffe9c6" data-file-name="components/statistics/StatisticsCategoryList.tsx">
                    <span className="editable-text" data-unique-id="a33914c4-c7f0-496b-8cdb-2d60af36f25a" data-file-name="components/statistics/StatisticsCategoryList.tsx">users</span>
                  </p>
                </div>
              </div>)}
        </div>
      </CardContent>
    </Card>;
}