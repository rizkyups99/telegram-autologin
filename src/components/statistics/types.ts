export type MonthlyData = {
  month: string;
  count: number;
};

export type CategoryData = {
  name: string;
  count: number;
};

export type CategoryDistribution = {
  categories: number;
  users: number;
};

export type DailyRegistrationData = {
  day: string;
  fullDate: string;
  registrations: number;
};

export type StatisticsData = {
  monthlyData: MonthlyData[];
  categorySummary: CategoryData[];
  availableMonths: string[];
  categoryDistribution: CategoryDistribution[];
  dailyRegistrations: DailyRegistrationData[];
};
