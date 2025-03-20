import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

@Injectable({ providedIn: 'root' })
export class HDTemplateService {
  generateHistoricalDataTemplate(): void {
    const headers = [
      'Material*',
      'Unit Value*',
      'Unit*',
      'Description*',
      'HTS Code*',
      'COO*',
    ];

    // Create worksheet with headers first
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);

    // Add example data row
    const exampleData = [
      '112322-31',
      45.99,
      'PC',
      'DESC PC',
      '7208.51.0000',
      'MA',
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [exampleData], { origin: 1 });

    // Set column widths based on content
    const columnWidths = [
      { wch: 12 },  // Material
      { wch: 10 },  // Unit Value
      { wch: 8 },   // Unit
      { wch: 20 },  // Description
      { wch: 15 },  // HTS Code
      { wch: 8 },   // COO
    ];
    worksheet['!cols'] = columnWidths;

    // Add data validation for dropdowns
    worksheet['!dataValidation'] = [
      {
        type: 'list',
        allowBlank: false,
        formulae: ['"US,CN,DE,JP,KR"'],
        address: { s: { c: 5, r: 1 }, e: { c: 5, r: 1000 } }, // COO column
      },
      {
        type: 'list',
        formulae: ['"KG,LB,MT,PC"'],
        address: { s: { c: 2, r: 1 }, e: { c: 2, r: 1000 } }, // Unit column
      },
    ];

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historical Data');

    XLSX.writeFile(workbook, 'Historical_Data_Template.xlsx', {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
    });
  }
}