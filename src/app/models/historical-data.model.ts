type HistoricalDataBase = {
  material: string;
  unitValue: number;
  unit: string;
  description: string;
  htsCode: string;
  coo: string; // country of origin
};

export type HistoricalDataCreate = HistoricalDataBase;
export type HistoricalDataUpdate = HistoricalDataBase;
export type HistoricalData = HistoricalDataBase & {
  id: number;
};

export type BulkUploadResult = {
  totalRowCount: number; // Total rows in original uploaded excel file
  successCount: number;
  errors: BulkUploadError[];
};

export type BulkUploadError = {
  rowNumber: number;
  errorMessage: string;
};
