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
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="473a7c3c-69cc-4692-9856-3d1e2311cfc2" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
      <Card data-unique-id="bafaffb7-fab6-479e-9ff8-14ddcba8088b" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="7a6c29b7-e875-4d4d-a135-a9cc3b4ecd33" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="b0c13c82-d8c8-497d-be63-d09656cda2ae" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="7af79829-7d0c-47be-b540-7d479ee489c2" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Total Users</span>
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent data-unique-id="2acebdc9-b714-499a-9245-9e1a0b965fb9" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="7d276dd6-ad94-44c1-a93b-e5ece056827e" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{totalUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="a4371de5-b90d-4285-b392-71e107fd4fde" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="fa835219-94dd-4ebe-b935-2cba4bafc307" data-file-name="components/statistics/StatisticsSummaryCards.tsx">All registered users</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="304c2256-6ab2-4b6f-a166-81e1a814f496" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="cdde5450-b1b9-4940-a6ca-ae21ebc7e597" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="d2bbbe6f-f0b7-475f-aa0c-db59aa5ff043" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="08cd6f93-3b33-47bb-972d-12b1a06bc916" data-file-name="components/statistics/StatisticsSummaryCards.tsx">This Month</span>
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" data-unique-id="cd28357b-21d4-4032-9486-fb7c6c4cd4b3" data-file-name="components/statistics/StatisticsSummaryCards.tsx" />
        </CardHeader>
        <CardContent data-unique-id="413ef6aa-e168-48fd-b60a-b43620aebb15" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="e96982a3-5ffd-468a-ac53-052744f45126" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{currentMonthUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="afc5daaa-fe41-4ee3-9bd5-7e7394a1deac" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="2f867ae9-fe81-4d35-acaf-0605a782b805" data-file-name="components/statistics/StatisticsSummaryCards.tsx">New users this month</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="c1510a74-56b5-49f3-808c-19a01e064cde" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="ebd41171-76f4-41fc-8f76-57c4583ee597" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
          <CardTitle className="text-sm font-medium" data-unique-id="ccf8f27d-0eea-4ab0-9964-7ccc551f2d7a" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="69d950e4-d2d3-46c1-9215-963863111ef6" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Growth</span>
          </CardTitle>
          {isGrowthPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
        </CardHeader>
        <CardContent data-unique-id="6f200259-c081-412c-88bc-0c7a7cfcd146" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className={`text-2xl font-bold flex items-center gap-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`} data-unique-id="0a32b471-d400-4be0-b3f3-55fc6906dd7f" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
            {isGrowthPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {Math.abs(growth).toFixed(1)}
            <span className="editable-text" data-unique-id="1198c7ec-b38d-46c6-9694-36a11efe1cab" data-file-name="components/statistics/StatisticsSummaryCards.tsx">%</span>
          </div>
          <p className="text-xs text-muted-foreground" data-unique-id="2665df67-1e9a-468a-aa1f-bac7ef89edba" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="35b5d13c-9f20-41ef-80da-66e32230ec4c" data-file-name="components/statistics/StatisticsSummaryCards.tsx">From last month</span>
          </p>
        </CardContent>
      </Card>
    </div>;
}