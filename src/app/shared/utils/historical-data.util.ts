interface CacheEntry {
  [key: string]: any;
  material: string;
}

interface FieldMapping {
  targetField: string;
  sourceField: string;
  type?: 'text' | 'number';
}

interface EnhancementOptions {
  materialFieldKey?: string;
  fieldMappings: FieldMapping[];
}


export const enhanceItemsWithCacheData = (
  items: any[],
  cache: Record<string, CacheEntry>,
  options: EnhancementOptions
): any[] => {
  const {
    materialFieldKey = 'Material', // Default material field key
    fieldMappings,
  } = options;

  return items.map((item) => {
    // Create a copy to avoid mutating original item
    const enhancedItem = { ...item };
    const materialValue = enhancedItem[materialFieldKey]?.value;

    if (!materialValue) return enhancedItem;

    // Find matching cache entry
    const cacheEntry = Object.values(cache).find(
      (entry) => entry.material === materialValue
    );

    if (!cacheEntry) return enhancedItem;

    // Add mapped fields
    fieldMappings.forEach(({ targetField, sourceField, type = 'text' }) => {
      enhancedItem[targetField] = {
        name: targetField,
        value: cacheEntry[sourceField],
        type: type,
      };
    });

    return enhancedItem;
  });
};

/**
 *
 *
 */
export const enhancementConfig: EnhancementOptions = {
  fieldMappings: [
    { targetField: 'HTS Code', sourceField: 'htsCode' },
    { targetField: 'COO', sourceField: 'coo', type: 'text' },
  ],
};
