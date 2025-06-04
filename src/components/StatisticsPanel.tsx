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
    return <div className="flex justify-center items-center h-64" data-unique-id="ff04493d-e9dd-4bac-ba01-b3e6412e9cb2" data-file-name="components/StatisticsPanel.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="4f96c8a1-c7ce-40d9-99e0-b7d4c940fbf5" data-file-name="components/StatisticsPanel.tsx"></div>
      </div>;
  }
  if (error || !data) {
    return <div className="text-center py-8" data-unique-id="95ef2e22-9b7a-48da-8165-f3c19881133e" data-file-name="components/StatisticsPanel.tsx">
        <p className="text-muted-foreground" data-unique-id="25737e28-ab51-42cd-b30e-9e378c00edd6" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">{error || 'Failed to load statistics data'}</p>
      </div>;
  }
  return <div className="space-y-6" data-unique-id="44aa4782-364d-4796-b040-4d151078338b" data-file-name="components/StatisticsPanel.tsx" data-dynamic-text="true">
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