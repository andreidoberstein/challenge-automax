export interface CartFilters {
  userId: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

export interface FilterErrors {
  userId?: string;
  dateRange?: string;
}
