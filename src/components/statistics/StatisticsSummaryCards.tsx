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
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="bb3ed258-9a8a-43a0-8f49-f11c09c3cb64" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
      <Card data-unique-id="df57f043-a92e-442c-a0b7-29f904adf703" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="c1a27128-e96c-4777-afb8-bd5487269fe2" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="9a58b976-c855-4641-a330-234c824b6a6d" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="066cb655-c708-4510-8f5f-c7cd4cec4be1" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Total Users</span>
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent data-unique-id="c30e6604-6a95-4daf-bbbe-14c8991261f3" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="b1e7317d-a2aa-4233-9feb-ecf4a09124d4" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{totalUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="8b83f02e-9bcb-41c4-a0ac-9ba0dd05d8e4" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="940aa780-b892-45fc-8668-c4c78c33908e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">All registered users</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="c2e4850d-493d-4cf7-ae9c-f744363f881c" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="cc80cb37-4faf-4649-98e6-787c53ac8165" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="d7b81ac5-c6f0-45b7-bae5-1a0ccde8c41e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="860f0a2d-e69c-4750-95b9-79fa7dda3b3d" data-file-name="components/statistics/StatisticsSummaryCards.tsx">This Month</span>
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" data-unique-id="288442f5-09ce-44b9-a291-b4d94084540a" data-file-name="components/statistics/StatisticsSummaryCards.tsx" />
        </CardHeader>
        <CardContent data-unique-id="f061202a-7930-4aa1-aa65-1fd8805e8416" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="d0296309-e67f-4aae-9e62-9621d107f055" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{currentMonthUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="5ca94a36-5cda-43cd-96a7-15578e4095df" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="82a2fe5e-0ca1-4a46-a4a4-1d191d349f55" data-file-name="components/statistics/StatisticsSummaryCards.tsx">New users this month</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="a31e950a-cb47-41bb-8233-089c002cfaed" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="850d6495-a740-4c46-96d0-56cd0db3ff44" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
          <CardTitle className="text-sm font-medium" data-unique-id="d7dae7b0-169f-4c9d-8be8-6b319dbeb30a" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="4c694c12-367e-4d6c-be91-45f66bd32fbd" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Growth</span>
          </CardTitle>
          {isGrowthPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
        </CardHeader>
        <CardContent data-unique-id="81932892-9841-4bfb-920f-2022cab8d3e2" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className={`text-2xl font-bold flex items-center gap-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`} data-unique-id="eef5f180-f396-4f1e-b56b-dde7b00c0454" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
            {isGrowthPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {Math.abs(growth).toFixed(1)}
            <span className="editable-text" data-unique-id="d7d6ba10-1351-4ae0-9db0-29563dd6065a" data-file-name="components/statistics/StatisticsSummaryCards.tsx">%</span>
          </div>
          <p className="text-xs text-muted-foreground" data-unique-id="a660a941-d3d2-4553-ab7f-f7a986e22980" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="12a2cde0-090e-4b46-a4fb-0fbf8759a87e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">From last month</span>
          </p>
        </CardContent>
      </Card>
    </div>;
}