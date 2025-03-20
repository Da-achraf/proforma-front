import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

@Injectable({ providedIn: 'root' })
export class DATemplateService {
  // Expected headers and data types
  private expectedHeaders = [
    'Customer Id',
    'Company Name',
    'Street',
    'Zip Code',
    'Country',
    'Vat',
    'Full Address',
    'Is TE',
  ];

  private expectedTypes: Array<'string' | 'number' | 'boolean'> = [
    'string', // Customer Id
    'string', // Company Name
    'string', // Street
    'string', // Zip Code
    'string', // Country
    'string', // Vat
    'string', // Full Address
    'boolean', // Is TE
  ];

  generateHistoricalDataTemplate(): void {
    // Create worksheet with headers first
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      this.expectedHeaders,
    ]);

    // Add example data row
    const exampleData1 = [
      'CUST001',
      'ACME Corporation',
      '123 Main St',
      '10001',
      'US',
      'US123456789',
      '',
      false,
    ];

    const exampleData2 = [
      'CUST002',
      '',
      '',
      '',
      '',
      '',
      '233 Main St, New York, NY 13301, US',
      false,
    ];

    XLSX.utils.sheet_add_aoa(worksheet, [exampleData1], { origin: 1 });
    XLSX.utils.sheet_add_aoa(worksheet, [exampleData2], { origin: 2 });

    // Set column widths based on content
    const columnWidths = [
      { wch: 12 }, // Customer Id
      { wch: 20 }, // Company Name
      { wch: 20 }, // Street
      { wch: 10 }, // Zip Code
      { wch: 10 }, // Country
      { wch: 15 }, // Vat
      { wch: 30 }, // Full Address
      { wch: 8 }, // Is TE
    ];
    worksheet['!cols'] = columnWidths;

    // Add data validation for dropdowns
    worksheet['!dataValidation'] = [
      {
        type: 'list',
        allowBlank: false,
        formulae: ['"US,CN,DE,JP,KR,FR,UK,IT,ES,CA"'],
        address: { s: { c: 4, r: 1 }, e: { c: 4, r: 1000 } }, // Country column
      },
      {
        type: 'list',
        formulae: ['"TRUE,FALSE"'],
        address: { s: { c: 7, r: 1 }, e: { c: 7, r: 1000 } }, // Is TE column
      },
    ];

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Data');

    XLSX.writeFile(workbook, 'Customer_Data_Template.xlsx', {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
    });
  }
}
