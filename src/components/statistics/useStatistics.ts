'use client';

import { useState, useEffect, useCallback } from 'react';
import { StatisticsData } from './types';

export function useStatistics() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch main statistics data
      const statisticsResponse = await fetch(`/api/statistics?year=${selectedYear}&month=${selectedMonth}`);
      if (!statisticsResponse.ok) throw new Error('Failed to fetch statistics');
      const statisticsData = await statisticsResponse.json();
      
      // Fetch category distribution data
      const distributionResponse = await fetch(`/api/statistics/category-distribution?year=${selectedYear}&month=${selectedMonth}`);
      if (!distributionResponse.ok) throw new Error('Failed to fetch category distribution');
      const distributionData = await distributionResponse.json();
      
      // Combine both data sets
      const combinedData: StatisticsData = {
        ...statisticsData,
        categoryDistribution: distributionData,
        cloudCategorySummary: statisticsData.cloudCategorySummary || []
      };
      
      setData(combinedData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleMonthChange = useCallback((month: number) => {
    setSelectedMonth(month);
  }, []);

  return {
    data,
    isLoading,
    error,
    selectedYear,
    selectedMonth,
    setSelectedYear: handleYearChange,
    setSelectedMonth: handleMonthChange,
    refetch: fetchStatistics
  };
}
