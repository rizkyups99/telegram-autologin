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
    return <div className="flex justify-center items-center h-64" data-unique-id="7b6a213e-7eb8-4f7c-804b-93b0f44acd5a" data-file-name="components/StatisticsPanel.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="bbe494de-6893-4f94-a2a9-a942166fb3e7" data-file-name="components/StatisticsPanel.tsx"></div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-8" data-unique-id="8bf4820f-8d0b-4e93-a190-dcc79ffa5b70" data-file-name="components/StatisticsPanel.tsx">
        <p className="text-muted-foreground" data-unique-id="4b24a22b-71bb-420b-af1e-7994005c2e01" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{error || 'Failed to load statistics data'}</p>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="0148a97b-024b-440a-b6d4-1618d5a8bc5f" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
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