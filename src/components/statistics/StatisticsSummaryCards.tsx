'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { MonthlyData } from './types';
interface StatisticsSummaryCardsProps {
  monthlyData: MonthlyData[];
}
export function StatisticsSummaryCards({
  monthlyData
}: StatisticsSummaryCardsProps) {
  const totalUsers = monthlyData.reduce((sum, item) => sum + item.count, 0);

  // Get current month data
  const currentMonth = new Date().toLocaleString('default', {
    month: 'short'
  });
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', {
    month: 'short'
  });
  const currentMonthData = monthlyData.find(item => item.month === currentMonth);
  const previousMonthData = monthlyData.find(item => item.month === lastMonth);
  const currentMonthUsers = currentMonthData?.count || 0;
  const previousMonthUsers = previousMonthData?.count || 0;
  let growth = 0;
  let isGrowthPositive = true;
  if (previousMonthUsers > 0) {
    growth = (currentMonthUsers - previousMonthUsers) / previousMonthUsers * 100;
    isGrowthPositive = growth >= 0;
  } else if (currentMonthUsers > 0) {
    growth = 100;
    isGrowthPositive = true;
  }
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="38116555-2ebe-4b78-801b-053d6ac25ce8" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
      <Card data-unique-id="ff10b4bf-da38-439a-afd0-6cdf49510f58" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="2cf0f718-b2f7-4d03-a851-868d26112095" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="c43ca100-868a-4034-9194-cb01df9b6b7a" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="936eb529-1834-4f19-9134-9ea34f1c6803" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Total Users</span>
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent data-unique-id="ce2166b4-1de3-47ed-81c5-5329ca12033c" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="3ea02a1c-1512-4087-9f34-9209a971ae1a" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{totalUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="6d73d087-b5b2-4dcc-bfa4-57f17731c0d6" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="448944a5-a495-4ee1-b92a-3933faf7ddf7" data-file-name="components/statistics/StatisticsSummaryCards.tsx">All registered users</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="b50c153a-3da6-41dd-b31a-c982393300c8" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="5b20a7ab-c8ac-4047-97fd-6d594fc6a2f8" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="ba0dae8d-ef0f-4998-aeda-bc7845f10e4e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="0626048b-7299-42b1-9568-1db8f2f915d8" data-file-name="components/statistics/StatisticsSummaryCards.tsx">This Month</span>
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" data-unique-id="5a7f8026-b5ca-4c26-b00b-d56c9cdd2019" data-file-name="components/statistics/StatisticsSummaryCards.tsx" />
        </CardHeader>
        <CardContent data-unique-id="8a679481-f45b-47b8-99af-7e933dfb0634" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="b9e5fd85-dea7-41e7-8bb9-c8c5be4b0188" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{currentMonthUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="66790d9a-fcea-405c-b5e4-aad9c5b27e16" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="393718be-3a56-4c79-818b-272bfb9047fa" data-file-name="components/statistics/StatisticsSummaryCards.tsx">New users this month</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="51e0145a-0e55-44cd-bcf1-d47551ae94ae" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="bd93e18d-1f5d-4f37-b1eb-c6ff6083b5a4" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
          <CardTitle className="text-sm font-medium" data-unique-id="2acdcdf5-178d-4d67-86f8-0b2b289d93a3" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="11f8485c-d9d7-45ae-b457-242f781f79c1" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Growth</span>
          </CardTitle>
          {isGrowthPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
        </CardHeader>
        <CardContent data-unique-id="7498dd75-ea1a-4fb4-9220-8f761e3f473b" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className={`text-2xl font-bold flex items-center gap-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`} data-unique-id="dbe58df2-1be2-41ba-ba8e-1e9500d4cf51" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
            {isGrowthPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {Math.abs(growth).toFixed(1)}
            <span className="editable-text" data-unique-id="efacbfa0-0247-4cad-bd23-04abc99332ac" data-file-name="components/statistics/StatisticsSummaryCards.tsx">%</span>
          </div>
          <p className="text-xs text-muted-foreground" data-unique-id="9ec07984-ec9f-4848-8ed7-907ce981ac6e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="329eae62-b9fa-41dd-9557-8f9b7d81cbd4" data-file-name="components/statistics/StatisticsSummaryCards.tsx">From last month</span>
          </p>
        </CardContent>
      </Card>
    </div>;
}