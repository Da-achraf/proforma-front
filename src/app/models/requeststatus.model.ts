export enum RequestStatus {
  PendingInFinance = 0,
  PendingInTradCompliance = 1,
  InShipping = 2,
  WaitingForTrackingNo = 3,
  Done = 4,
  Rejected = 5
}

export const RequestStatusLabelMapping: Record<RequestStatus, string> = {
  [RequestStatus.PendingInFinance]: 'Pending in Finance',
  [RequestStatus.PendingInTradCompliance]: 'Pending in Trad Compliance',
  [RequestStatus.InShipping]: 'In Shipping',
  [RequestStatus.WaitingForTrackingNo]: 'Waiting For Tracking No',
  [RequestStatus.Done]: 'Done',
  [RequestStatus.Rejected]: 'Rejected'
};