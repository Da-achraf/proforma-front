export type PagedResult<T> = {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type QueryParamType = { [key: string]: any };
