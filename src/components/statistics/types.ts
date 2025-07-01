export type MonthlyData = {
  month: string;
  count: number;
};

export type CategoryData = {
  name: string;
  count: number;
  type?: 'regular' | 'audio' | 'pdf' | 'video' | 'audio_cloud' | 'pdf_cloud' | 'file_cloud';
  userCount?: number;
  originalName?: string;
};

export interface CloudCategorySummary {
  type: 'audio_cloud' | 'pdf_cloud' | 'file_cloud';
  name: string;
  fileCount: number;
  userCount: number;
  categoryCount: number;
}

export type CategoryDistribution = {
  categories: number;
  users: number;
};

export type DailyRegistrationData = {
  day: string;
  fullDate: string;
  registrations: number;
};

export type CloudCategoryStats = {
  audioCloud: {
    totalFiles: number;
    totalUsers: number;
    categories: CategoryData[];
  };
  pdfCloud: {
    totalFiles: number;
    totalUsers: number;
    categories: CategoryData[];
  };
  fileCloud: {
    totalFiles: number;
    totalUsers: number;
    categories: CategoryData[];
  };
};

export type StatisticsData = {
  monthlyData: MonthlyData[];
  categorySummary: CategoryData[];
  cloudCategorySummary: CloudCategorySummary[];
  cloudStats: CloudCategoryStats;
  availableMonths: string[];
  categoryDistribution: CategoryDistribution[];
  dailyRegistrations: DailyRegistrationData[];
};
