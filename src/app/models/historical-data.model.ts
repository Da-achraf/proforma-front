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
