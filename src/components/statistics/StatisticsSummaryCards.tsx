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
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-unique-id="3c739a18-a21a-42b7-b9fb-cd2503ac9b7f" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
      <Card data-unique-id="7237afa7-a806-4821-8848-82c51d15c664" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="5d267f29-d12d-45ea-83d2-f1848d49685f" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="16708ad8-a528-45e1-904e-f5a7af0c75b5" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="252e5edd-22cb-4213-85ed-ffb211555f62" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Total Users</span>
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent data-unique-id="a0c8e7ca-243d-4505-9436-5429fe5c53df" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="6b0977ed-98ec-4b73-b70b-0a9afad78be3" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{totalUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="5649bae7-ccec-4989-af12-c8b5b4537e41" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="afd2b2a6-2289-4635-a0b5-8332b0380f5e" data-file-name="components/statistics/StatisticsSummaryCards.tsx">All registered users</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="ce7bdfce-1992-4fe4-9ec8-fb275bdc6b50" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="0eec6440-b916-4963-910d-618f0f93ce35" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <CardTitle className="text-sm font-medium" data-unique-id="c7076ef8-d506-4bd2-a814-9324ba85636c" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="ae9bf4b2-89ae-4041-950c-0ae10d0f4dba" data-file-name="components/statistics/StatisticsSummaryCards.tsx">This Month</span>
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" data-unique-id="dbb27044-ea18-4046-b140-fbc82efc8e0e" data-file-name="components/statistics/StatisticsSummaryCards.tsx" />
        </CardHeader>
        <CardContent data-unique-id="4033ecc9-b6a2-4f0c-80ce-2023403cf004" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className="text-2xl font-bold" data-unique-id="5a5557fb-5d96-4717-be12-5c758644df7f" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">{currentMonthUsers}</div>
          <p className="text-xs text-muted-foreground" data-unique-id="4b9113db-da80-4aff-9930-d18069bf59fc" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="0a8e1e6d-5fd2-4805-9afd-9e95866a3494" data-file-name="components/statistics/StatisticsSummaryCards.tsx">New users this month</span>
          </p>
        </CardContent>
      </Card>

      <Card data-unique-id="c99d5602-8ea6-403d-9b45-605aab58f3e6" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-unique-id="9e118626-776e-4697-be6c-7e6ee0e69c15" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
          <CardTitle className="text-sm font-medium" data-unique-id="1d57333e-d4b7-45ed-bbcf-ac0c3e5d1b7c" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="4a7b4fab-75c5-42ec-9871-ab847a13d8fa" data-file-name="components/statistics/StatisticsSummaryCards.tsx">Growth</span>
          </CardTitle>
          {isGrowthPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
        </CardHeader>
        <CardContent data-unique-id="7b567202-0a92-461c-9ae0-89ad2873b839" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
          <div className={`text-2xl font-bold flex items-center gap-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`} data-unique-id="57ce829d-60db-404c-a505-5fcde3d0c264" data-file-name="components/statistics/StatisticsSummaryCards.tsx" data-dynamic-text="true">
            {isGrowthPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {Math.abs(growth).toFixed(1)}
            <span className="editable-text" data-unique-id="677489cb-1d97-4013-9bee-12bdfd269736" data-file-name="components/statistics/StatisticsSummaryCards.tsx">%</span>
          </div>
          <p className="text-xs text-muted-foreground" data-unique-id="4cba9f38-6148-43e9-a82e-29b9c4b47701" data-file-name="components/statistics/StatisticsSummaryCards.tsx">
            <span className="editable-text" data-unique-id="b4b47467-e091-4013-acb8-cf0d3e6926ac" data-file-name="components/statistics/StatisticsSummaryCards.tsx">From last month</span>
          </p>
        </CardContent>
      </Card>
    </div>;
}