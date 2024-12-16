import { TransformedRequestModel } from "../../models/request.model";
import { WeightTypeEnum } from "../pipes/report-table/weight-calculator.pipe";

export const getFieldValue = (item: any, fieldName: string): string => {
    const field = item?.find((f: any) => f.name === fieldName);
    return field ? String(field.value) : '---';
}

export const getWeight = (item: any, fieldName: string): string => {
    const field = item.find((f: any) => f.name === fieldName);
    return Number.parseFloat(field.value ?? 0).toFixed(3);
}

export const calculatTotalNetWeight = (itemsWithValues: any[]): number => {
    return itemsWithValues.reduce((sum, item) => {
        const partialNetWeight = item.values.find((value: any) => value.name === WeightTypeEnum.NET);
        return sum + (partialNetWeight ? parseFloat(partialNetWeight.value) : 0);
    }, 0);
}

export const calculateAmount = (item: any): number => {
    const unitValue = Number(getFieldValue(item, 'Unit Value')) || 0;
    const quantity = Number(getFieldValue(item, 'Quantity')) || 0;
    return unitValue * quantity;
}

export const calculateTotal = (itemsWithValues: any[]): number => {
    if (!itemsWithValues) return 0
    return itemsWithValues?.map((i: any) => i.values).reduce((sum: number, item: any) => {
        return sum + calculateAmount(item);
    }, 0);
}


// Util function that transform a string to camel case variable
export const toCamelCase = (key: string): keyof TransformedRequestModel => {
    return key
      .split(' ') // Split the string into words by spaces
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toLowerCase() + word.slice(1).toLowerCase() // Lowercase the first word
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize subsequent words
      )
      .join('') as keyof TransformedRequestModel;
  }

