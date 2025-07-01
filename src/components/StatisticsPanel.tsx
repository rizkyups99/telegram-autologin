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
    return <div className="flex justify-center items-center h-64" data-unique-id="0cfb35e1-ee19-4418-b104-abcdd4c70e7b" data-file-name="components/StatisticsPanel.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="e8e4ce44-1031-4a24-88bc-17b4673e2af3" data-file-name="components/StatisticsPanel.tsx"></div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-8" data-unique-id="00611987-1253-46a3-a1fe-7eeeeed4108f" data-file-name="components/StatisticsPanel.tsx">
        <p className="text-muted-foreground" data-unique-id="4e4d09d8-95de-453a-8e67-3a6fb9da3861" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{error || 'Failed to load statistics data'}</p>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="7556415e-a315-4d5a-998b-8e661a1bfb06" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
      {/* Summary Cards */}
      <StatisticsSummaryCards monthlyData={data.monthlyData} />

      {/* Charts */}
      <StatisticsCharts monthlyData={data.monthlyData} />

      {/* Category Statistics (Regular + Cloud) */}
      <StatisticsCategoryList categorySummary={data.categorySummary} selectedYear={selectedYear} selectedMonth={selectedMonth} onYearChange={setSelectedYear} onMonthChange={setSelectedMonth} />

      {/* User Category Distribution */}
      <UserCategoryDistribution categoryDistribution={data.categoryDistribution} />
    </div>;
}