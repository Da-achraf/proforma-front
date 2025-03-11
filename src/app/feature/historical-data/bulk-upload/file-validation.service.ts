import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FileValidationService {
  // Allowed file extensions and max file size
  allowedExtensions = ['.xlsx', '.csv'];
  private maxFileSize = 50 * 1024 * 1024; // 50MB

  // Expected headers and (optionally) expected data types for each column
  private expectedHeaders = [
    'Material*',
    'Unit Value*',
    'Unit*',
    'Description*',
    'HTS Code*',
    'COO*',
  ];

  // You can define expected types for sample data rows (if needed)
  // For instance: Material (string), Unit Value (number), etc.
  private expectedTypes: Array<'string' | 'number'> = [
    'string', // Material*
    'number', // Unit Value*
    'string', // Unit*
    'string', // Description*
    'string', // HTS Code*
    'string', // COO*
  ];

  validateFile(file: File): Promise<ValidationResult> {
    const errors: string[] = [];

    // 1. File type validation
    if (!this.allowedExtensions.some((ext) => file.name.endsWith(ext))) {
      errors.push('Invalid file type. Please upload .xlsx or .csv files.');
    }

    // 2. File size validation
    if (file.size > this.maxFileSize) {
      errors.push('File size exceeds 50MB limit.');
    }

    // If basic file checks fail, return early.
    if (errors.length > 0) {
      return Promise.resolve({ valid: false, errors });
    }

    // 3. Validate file structure by reading only the first few rows
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          // Read only the first 2 rows (header + one sample row) to keep it efficient
          const workbook = XLSX.read(data, { type: 'array', sheetRows: 2 });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert worksheet to an array-of-arrays
          const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          if (!rows || rows.length === 0) {
            errors.push('No data found in the sheet.');
            return resolve({ valid: false, errors });
          }

          // Validate header row
          const headers = rows[0] as string[];
          if (headers.length !== this.expectedHeaders.length) {
            errors.push(
              `Invalid number of columns. Expected ${this.expectedHeaders.length} but got ${headers.length}.`,
            );
          }
          this.expectedHeaders.forEach((expectedHeader, index) => {
            if (headers[index] !== expectedHeader) {
              errors.push(
                `Column ${index + 1} should be "${expectedHeader}" but found "${headers[index] ?? ''}".`,
              );
            }
          });

          // Optionally validate data types from the first data row, if it exists.
          if (rows.length > 1) {
            const sampleRow = rows[1];
            sampleRow.forEach((cell, index) => {
              const expectedType = this.expectedTypes[index];
              // If the cell exists and its type doesn't match, add an error.
              if (
                cell !== undefined &&
                cell !== null &&
                typeof cell !== expectedType
              ) {
                errors.push(
                  `Data type mismatch in column ${index + 1}. Expected ${expectedType} but got ${typeof cell}.`,
                );
              }
            });
          }

          resolve({ valid: errors.length === 0, errors });
        } catch (err) {
          errors.push('Error processing file.');
          resolve({ valid: false, errors });
        }
      };

      reader.onerror = () => {
        errors.push('Error reading file.');
        resolve({ valid: false, errors });
      };

      // Read the file as an ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  }
}
