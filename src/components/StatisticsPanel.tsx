'use client';

import { StatisticsSummaryCards } from './statistics/StatisticsSummaryCards';
import { StatisticsCharts } from './statistics/StatisticsCharts';
import { StatisticsCategoryList } from './statistics/StatisticsCategoryList';
import { UserCategoryDistribution } from './statistics/UserCategoryDistribution';
import { useStatistics } from './statistics/useStatistics';
export default function StatisticsPanel() {
  const {
    data,
    isLoading,
    error,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth
  } = useStatistics();
  if (isLoading) {
    return <div className="flex justify-center items-center h-64" data-unique-id="e639cc3c-d8aa-41e4-b455-5f6afd71a60b" data-file-name="components/StatisticsPanel.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="210d15aa-01e0-4c28-ae68-e8866a3cbb1a" data-file-name="components/StatisticsPanel.tsx"></div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-8" data-unique-id="e9c933a3-b75a-4acf-a51f-6b43dafea7b4" data-file-name="components/StatisticsPanel.tsx">
        <p className="text-muted-foreground" data-unique-id="0936ba7c-b3c5-4d7b-8d5e-0e61be0a951a" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{error || 'Failed to load statistics data'}</p>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="ca04d1cc-f3be-43df-a69f-596f68e596f3" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
      {/* Summary Cards */}
      <StatisticsSummaryCards monthlyData={data.monthlyData} />

      {/* Charts */}
      <StatisticsCharts monthlyData={data.monthlyData} />

      {/* Category Statistics */}
      <StatisticsCategoryList categorySummary={data.categorySummary} selectedYear={selectedYear} selectedMonth={selectedMonth} onYearChange={setSelectedYear} onMonthChange={setSelectedMonth} />

      {/* User Category Distribution */}
      <UserCategoryDistribution categoryDistribution={data.categoryDistribution} />
    </div>;
}