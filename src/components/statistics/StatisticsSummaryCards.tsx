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
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="ac8b1c36-66b8-489c-ae09-241d12c1ecf4" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
      <Card data-unique-id="72b70898-704e-4a52-8730-e7f8f0471294" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="f6742bef-9f0c-498e-a108-5454719178a9" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="b15982be-af08-467f-a456-c269b158c1ed" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="39fc44b5-7e8d-4709-bc69-c93be87b4b0d" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Total Users</span>
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent data-unique-id="393338d5-7c01-4e23-bfa7-2a52dc7ac05d" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="df030581-1e1b-498d-a757-3699e6fb1930" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{totalUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="a46a0fa9-26f1-49da-80d5-6f4f940a0ae3" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="855f7356-9385-477e-8591-621e7789b383" data-file-name="components/statistics/StatisticsSummaryCards.tsx">All registered users</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="5308ea82-1247-4c99-aa86-ba1b3016862b" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="3595d82b-aa86-4ec6-9529-753ea72029dd" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="bc648805-081b-4a3b-85a5-23fc8184b1f5" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="fca83529-2094-45f0-ac3c-904ef740de3d" data-file-name="components/statistics/StatisticsSummaryCards.tsx">This Month</span>
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" data-unique-id="1450e9d3-416c-4217-a577-4d2018557247" data-file-name="components/statistics/StatisticsSummaryCards.tsx" />
        </CardHeader>
        <CardContent data-unique-id="d581ef3a-8020-466a-a1b9-a05c14150787" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="4895aa05-4207-4245-bff4-098b8334183c" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{currentMonthUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="996dc272-8cc3-4371-9692-3244f4900278" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="34a7daac-89ec-4bd5-84e1-fbb0bf93171e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">New users this month</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="2dfef564-13fe-4ff4-95ca-4910f38040e2" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="f4c5431d-e160-4286-95c7-33f7c559ab09" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
          <CardTitle className="text-sm font-medium" data-unique-id="31e5a19a-e7af-4403-93d4-8d52eb70471a" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="cf37ccd4-aa8d-489b-98ee-1fed492d1ce1" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Growth</span>
          </CardTitle>
          {isGrowthPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
        </CardHeader>
        <CardContent data-unique-id="289576f6-6391-471e-a4ff-dc28375cd767" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className={`text-2xl font-bold flex items-center gap-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`} data-unique-id="62637a09-aa62-4064-84a9-fb017c367f37" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
            {isGrowthPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {Math.abs(growth).toFixed(1)}
            <span className="editable-text" data-unique-id="365bd3f3-0583-47a3-81b8-af9b3b205439" data-file-name="components/statistics/StatisticsSummaryCards.tsx">%</span>
          </div>
          <p className="text-xs text-muted-foreground" data-unique-id="edbced7b-0fc1-4093-a0b5-18cd801c5b9f" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="70a9197e-f4ca-4a79-80fe-fde0fa316609" data-file-name="components/statistics/StatisticsSummaryCards.tsx">From last month</span>
          </p>
        </CardContent>
      </Card>
    </div>;
}