export enum RequestStatus {
  PendingInFinance = 0,
  PendingInTradCompliance = 1,
  InShipping = 2,
  Done = 3,
  Rejected = 4
}

export const RequestStatusLabelMapping: Record<RequestStatus, string> = {
  [RequestStatus.PendingInFinance]: 'Pending in Finance',
  [RequestStatus.PendingInTradCompliance]: 'Pending in Trad Compliance',
  [RequestStatus.InShipping]: 'In Shipping',
  [RequestStatus.Done]: 'Done',
  [RequestStatus.Rejected]: 'Rejected'
};