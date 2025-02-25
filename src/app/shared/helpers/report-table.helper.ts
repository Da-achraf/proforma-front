import { RequestModel, TransformedRequestModel } from '../../models/request.model';
import { RequestStatus, RequestStatusLabelMapping } from '../../models/requeststatus.model';
import { calculateAmount, toCamelCase } from './invoice.helper';

export const getFileName = (name?: string) => {
  let timeSpan = new Date().toISOString();
  let sheetName = name || 'ExportResult';
  let fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName,
  };
};


export const adaptRequest = (request: RequestModel): Partial<TransformedRequestModel> => {
  return {
    requestNumber: request.requestNumber,
    createdAt: request.created_at,
    status: request.status,
    requesterName: request.user.userName,
    invoicesTypes: request.invoicesTypes,
    invoicesAddress: request.invoicesAddress,
    incoterm: request.incoterm,
    trackingNumber: request.trackingNumber,
    dimension: request.dimension,
    invoiceAddress: request.invoiceAddress,
    exporterAddress: request.exporterAddress,
    modeOfTransport: request.modeOfTransport,
    shippedVia: request.shippedVia,
    currency: request.currency,
    grossWeight: request.grossWeight,
    costCenter: request.costCenter,
    boxes: request.boxes,
    pallets: request.pallets,
    shipPoint: request.shipPoint.shipPoint,
    deliveryAddress: request.deliveryAddress?.customerId,
  };
}


/**
 * Transforms a @RequestModel into a list of @TransformedRequestModel by spreading
 * deeply nested properties (e.g., 'Material', 'COO', 'Description') from the `itemsWithValues`
 * array to the main properties of the request.
 * 
 * @param request - The input request of type @RequestModel.
 * @returns A list of transformed requests of type @TransformedRequestModel.
 * 
 * Example:
 * If `request.itemsWithValues` contains multiple items with nested fields like 'Material',
 * 'COO', and 'Description', the function will generate multiple requests where these
 * fields are moved to the top level of the request.
 */
export const transformRequest = (request: RequestModel): TransformedRequestModel[] => {
  if (!request || !request.itemsWithValues || !Array.isArray(request.itemsWithValues)) {
    return [];
  }

  const keysToChange = ['Material', 'Description', 'HTS Code', 'COO', 'Net Weight'];

  // Extract duplicated values and changes for each item
  return request.itemsWithValues.map((item: any) => {

    let transformedRequest = adaptRequest(request)

    // Add keys that differ per request
    keysToChange.forEach((key) => {
      const valueObj = item.values.find((v: any) => v.name === key);
      if (valueObj) {
        const camelCaseKey = toCamelCase(key) as keyof typeof transformedRequest;
        transformedRequest[camelCaseKey] = valueObj.value;
      }
    });

    // Calculate total amount for each item (price * quantity)
    transformedRequest.totalAmount = calculateAmount(item.values)

    return transformedRequest as TransformedRequestModel;
  })
}


export const filterRequests = (searchValue: string, requests: TransformedRequestModel[]): TransformedRequestModel[] => {
    const searchKeyword = searchValue.trim().toLowerCase();
    return requests.filter(request =>
      request.requestNumber?.toString().toLowerCase().includes(searchKeyword) ||
      RequestStatusLabelMapping[request.status as RequestStatus].toLowerCase().includes(searchKeyword) ||
      request.createdAt?.toLowerCase().includes(searchKeyword) ||
      request.trackingNumber?.toLowerCase().includes(searchKeyword) ||
      request.currency?.toLowerCase().includes(searchKeyword) ||
      request.incoterm?.toLowerCase().includes(searchKeyword) ||
      request.costCenter?.toLowerCase().includes(searchKeyword) ||
      request.invoicesTypes?.toLowerCase().includes(searchKeyword) ||
      request.modeOfTransport?.toLowerCase().includes(searchKeyword) ||
      request.shipPoint?.toLowerCase().includes(searchKeyword) ||
      request.deliveryAddress?.toLowerCase().includes(searchKeyword) ||
      request.requesterName?.toLowerCase().includes(searchKeyword) ||
      request.material?.toLowerCase().includes(searchKeyword) ||
      request.description?.toLowerCase().includes(searchKeyword) ||
      request.htsCode?.toLowerCase().includes(searchKeyword) ||
      request.coo?.toLowerCase().includes(searchKeyword) ||
      Number(request.grossWeight ?? 0).toString().includes(searchKeyword) ||
      Number(request.netWeight ?? 0).toString().includes(searchKeyword)
    );
  }