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
    return <div className="flex justify-center items-center h-64" data-unique-id="e4db6abc-4801-404c-9488-2bcf3afaac35" data-file-name="components/StatisticsPanel.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="ffc3560e-0e9a-4251-8b2d-82894b8003a4" data-file-name="components/StatisticsPanel.tsx"></div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-8" data-unique-id="d3842909-40cc-45f7-87d2-b3a5c5a0d5b0" data-file-name="components/StatisticsPanel.tsx">
        <p className="text-muted-foreground" data-unique-id="c49d00a9-dbbc-476b-8a5b-0525d5d458d2" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{error || 'Failed to load statistics data'}</p>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="1ef43851-0c12-46e8-ae0d-934728d215ee" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
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