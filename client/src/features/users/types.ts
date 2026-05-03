export type GetUsersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type UsersSummary = {
  total: number;
  monthlyGrowthPercent: number;
  monthlyCounts: MonthlyUsersCount[];
};

// TODO возможно стоит вынетси в глобальный тип чтобы переиспользовать для различных чартов
export type MonthlyUsersCount = {
  year: number;
  month: number;
  count: number;
};
