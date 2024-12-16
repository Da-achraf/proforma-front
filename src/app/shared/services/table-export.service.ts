import { ElementRef, EmbeddedViewRef, Injectable, Renderer2, TemplateRef } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { getFileName } from '../helpers/report-table.helper';
import { ReportCellColor } from './report-cell-color.service';

@Injectable({
  providedIn: 'root'
})
export class TableExportService {

  // exportTemplateToExcel(
  //   templateRef: TemplateRef<any>,
  //   renderer: Renderer2,
  //   elementRef: ElementRef,
  //   name?: string
  // ) {
  //   // Create the embedded view of the template
  //   const embeddedView: EmbeddedViewRef<any> = templateRef.createEmbeddedView({});
  //   embeddedView.detectChanges();
  
  //   // Temporary container for the table content
  //   const tableContainer = renderer.createElement('div');
  //   renderer.appendChild(elementRef.nativeElement, tableContainer);
  //   embeddedView.rootNodes.forEach(node => renderer.appendChild(tableContainer, node));
  
  //   // Locate the table element within the rendered template
  //   const tableElement = tableContainer.querySelector('table');
  //   if (tableElement) {
  //     const { sheetName, fileName } = getFileName(name);
  
  //     // Convert table to workbook with raw data to prevent initial type inference
  //     const wb = XLSX.utils.table_to_book(tableElement, {
  //       sheet: sheetName,
  //       cellDates: true, // Ensures date cells are correctly formatted
  //       raw: true,        // Prevents XLSX from inferring types automatically
  //     });
  
  //     // Get the first sheet in the workbook
  //     const ws = wb.Sheets[sheetName];
  
  //     if (!ws) {
  //       console.error(`Sheet "${sheetName}" not found in the workbook.`);
  //       return;
  //     }
  
  //     // Decode the range of the sheet (e.g., "A1:C10")
  //     const range = XLSX.utils.decode_range(ws['!ref'] ?? '');
  //     if (range.s.r > range.e.r || range.s.c > range.e.c) {
  //       console.error('Invalid range detected in the worksheet.');
  //       return;
  //     }
  
  //     // Step 1: Identify the column index of 'Creation date'
  //     let creationDateColIndex: number | null = null;
  
  //     for (let col = range.s.c; col <= range.e.c; col++) {
  //       const cellAddress = { r: range.s.r, c: col };
  //       const cellRef = XLSX.utils.encode_cell(cellAddress);
  //       const cell = ws[cellRef];
  
  //       if (cell && typeof cell.v === 'string' && cell.v.trim().toLowerCase() === 'creation date') {
  //         creationDateColIndex = col;
  //         break;
  //       }
  //     }
  
  //     if (creationDateColIndex === null) {
  //       console.error('Creation date column not found in the header row.');
  //       return;
  //     }
  
  //     // Step 2: Iterate over each cell and set types accordingly
  //     for (let row = range.s.r + 1; row <= range.e.r; row++) { // Start from row 1 to skip header
  //       for (let col = range.s.c; col <= range.e.c; col++) {
  //         const cellAddress = { r: row, c: col };
  //         const cellRef = XLSX.utils.encode_cell(cellAddress);
  //         const cell = ws[cellRef];
  
  //         if (cell) {
  //           // Apply left alignment
  //           if (!cell.s) cell.s = {}; // Ensure the cell style exists
  //           cell.s.alignment = { horizontal: 'left' };
  
  //           if (col === creationDateColIndex) {
  //             // Handle 'Creation date' column as date
  //             if (typeof cell.v === 'string') {
  //               const parsedDate = new Date(cell.v);
  //               if (!isNaN(parsedDate.getTime())) {
  //                 cell.v = parsedDate;
  //                 cell.t = 'd'; // Set cell type to date
  //                 cell.z = XLSX.SSF.get_table()['14']; // Set date format (e.g., 'm/d/yy')
  //               } else {
  //                 // If parsing fails, treat as string
  //                 cell.t = 's';
  //               }
  //             } else if (typeof cell.v === 'number') {
  //               // If cell value is already a number, assume it's a date serial
  //               cell.t = 'n'; // Excel stores dates as numbers
  //               cell.z = XLSX.SSF.get_table()['14'];
  //             }
  //           } else {
  //             // Handle other columns
  //             if (typeof cell.v === 'number') {
  //               cell.t = 'n'; // Number
  //             } else if (typeof cell.v === 'boolean') {
  //               cell.t = 'b'; // Boolean
  //             } else if (typeof cell.v === 'string') {
  //               cell.t = 's'; // String
  //             } else {
  //               cell.t = 's'; // Default to string
  //             }
  //           }
  //         }
  //       }
  //     }
  
  //     // Set column widths for better readability
  //     const columnWidths = XLSX.utils.decode_range(ws['!ref'] ?? '').e.c + 1;
  //     ws['!cols'] = Array(columnWidths).fill({ wpx: 100 }); // Set all columns to 100px width
  
  //     // Write the Excel file
  //     XLSX.writeFile(wb, `${fileName}.xlsx`);
  //   }
  
  //   // Clean up by removing the temporary table from the DOM
  //   renderer.removeChild(elementRef.nativeElement, tableContainer);
  // }



  exportTemplateToExcel(
    templateRef: TemplateRef<any> | undefined,
    renderer: Renderer2,
    elementRef: ElementRef,
    name?: string
  ) {

    if (!templateRef) throw Error("template ref for template variable 'exportTable' is undefined")

    const embeddedView: EmbeddedViewRef<any> = templateRef.createEmbeddedView({});
    embeddedView.detectChanges();
  
    const tableContainer = renderer.createElement('div');
    renderer.appendChild(elementRef.nativeElement, tableContainer);
    embeddedView.rootNodes.forEach(node => renderer.appendChild(tableContainer, node));
  
    const tableElement = tableContainer.querySelector('table');
    if (tableElement) {
      const { sheetName, fileName } = getFileName(name);
  
      const wb = XLSX.utils.table_to_book(tableElement, {
        sheet: sheetName,
        cellDates: true,
        raw: true,
      });
  
      const ws = wb.Sheets[sheetName];
  
      const range = XLSX.utils.decode_range(ws['!ref'] ?? '');
      if (range.s.r > range.e.r || range.s.c > range.e.c) {
        console.error('Invalid range detected in the worksheet.');
        return;
      }
  
      let creationDateColIndex: number | null = null;
      let trackingNoColIndex: number | null = null;
  
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = { r: range.s.r, c: col };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = ws[cellRef];
  
        if (cell && typeof cell.v === 'string') {
          const headerValue = cell.v.trim().toLowerCase();
          if (headerValue === 'creation date') creationDateColIndex = col;
          if (headerValue === 'tracking no') trackingNoColIndex = col;
        }
      }
  
      if (creationDateColIndex === null) {
        console.error('Creation date column not found.');
      }
      if (trackingNoColIndex === null) {
        console.error('Tracking No column not found.');
      }
  
      // Step 1: Apply type handling for 'Creation date'
      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = { r: row, c: col };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = ws[cellRef];
  
          if (cell) {
            if (!cell.s) cell.s = {};
            cell.s.alignment = { horizontal: 'left' };
  
            if (col === creationDateColIndex) {
              if (typeof cell.v === 'string') {
                const parsedDate = new Date(cell.v);
                if (!isNaN(parsedDate.getTime())) {
                  cell.v = parsedDate;
                  cell.t = 'd';
                  cell.z = XLSX.SSF.get_table()['14'];
                } else {
                  cell.t = 's';
                }
              } else if (typeof cell.v === 'number') {
                cell.t = 'n';
                cell.z = XLSX.SSF.get_table()['14'];
              }
            } else {
              if (typeof cell.v === 'number') cell.t = 'n';
              else if (typeof cell.v === 'boolean') cell.t = 'b';
              else cell.t = 's';
            }
          }
        }
      }
  
      // Step 2: Color rows with the same 'Tracking No'
      if (trackingNoColIndex !== null) {
        const trackingNoColors = new Map<string, string>();
        const colors = Object.values(ReportCellColor)
        let colorIndex = 0;
  
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          const trackingNoCellRef = XLSX.utils.encode_cell({ r: row, c: trackingNoColIndex });
          const trackingNoCell = ws[trackingNoCellRef];
  
          if (trackingNoCell && trackingNoCell.v) {
            const trackingNo = trackingNoCell.v.toString();
  
            // Assign a color if not already assigned
            if (!trackingNoColors.has(trackingNo)) {
              trackingNoColors.set(trackingNo, colors[colorIndex]);
              colorIndex = (colorIndex + 1) % colors.length;
            }
  
            // Apply the color to the entire row
            const rowColor = trackingNoColors.get(trackingNo);
            if (rowColor) {
              for (let col = range.s.c; col <= range.e.c; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                const cell = ws[cellRef];
                if (cell) {
                  if (!cell.s) cell.s = {};
                  cell.s.fill = { fgColor: { rgb: rowColor.replace('#', '') } };
                }
              }
            }
          }
        }
      }

      // Set column widths for better readability
      const columnWidths = XLSX.utils.decode_range(ws['!ref'] ?? '').e.c + 1;
      ws['!cols'] = Array(columnWidths).fill({ wpx: 100 });

      // Set row heights for better readability
      const rowCount = XLSX.utils.decode_range(ws['!ref'] ?? '').e.r + 1; // Get the total number of rows
      ws['!rows'] = Array(rowCount).fill({ hpx: 20 });
  
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
  
    renderer.removeChild(elementRef.nativeElement, tableContainer);
  }
}
