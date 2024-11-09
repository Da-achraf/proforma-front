import { ElementRef, EmbeddedViewRef, Renderer2, TemplateRef } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

const getFileName = (name?: string) => {
  let timeSpan = new Date().toISOString();
  let sheetName = name || 'ExportResult';
  let fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName,
  };
};

export class TableUtil {

  // Export data based on a provided template ref
  static exportTemplateToExcel(
    templateRef: TemplateRef<any>,
    renderer: Renderer2,
    elementRef: ElementRef,
    name?: string
  ) {
    // Create the embedded view of the template
    const embeddedView: EmbeddedViewRef<any> = templateRef.createEmbeddedView({});
    embeddedView.detectChanges();

    // Temporary container for the table content
    const tableContainer = renderer.createElement('div');
    renderer.appendChild(elementRef.nativeElement, tableContainer);
    embeddedView.rootNodes.forEach(node => renderer.appendChild(tableContainer, node));

    // Locate the table element within the rendered template
    const tableElement = tableContainer.querySelector('table');
    if (tableElement) {
      const { sheetName, fileName } = getFileName(name);
      const wb = XLSX.utils.table_to_book(tableElement, <XLSX.Table2SheetOpts>{
        sheet: sheetName,
      });
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }

    // Clean up by removing the temporary table from the DOM
    renderer.removeChild(elementRef.nativeElement, tableContainer);
  }
}
