export const getFieldValue = (item: any, fieldName: string): string => {
    const field = item.find((f: any) => f.name === fieldName);
    return field ? String(field.value) : '---';
}

export const getWeight = (item: any, fieldName: string): string => {
    const field = item.find((f: any) => f.name === fieldName);
    return Number.parseFloat(field.value ?? 0).toFixed(3);
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

