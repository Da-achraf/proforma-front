import { Component, computed, effect, ElementRef, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { RequestService } from '../../../services/request.service';
import { InvoiceTypeEnum, StandardFieldEnum } from '../../../models/request.model';
import { PdfService } from '../../services/pdf.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, of } from 'rxjs';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {

  borderStyle = 'border-[2px] border-gray-600 rounded-sm'
  StandardFieldEnum = StandardFieldEnum
  
  requestService = inject(RequestService)

  data = inject(MAT_DIALOG_DATA)
  pdfService = inject(PdfService)

  @ViewChild('invoiceElement', { static: false }) invoiceElement!: ElementRef

  invoiceDate = new Date()

  InvoiceTypeEnum = InvoiceTypeEnum


  dataSignal = toSignal(of(this.data).pipe(filter(data => data.request)))

  request = computed(() => {
    const data = this.dataSignal()
    return data.request
  })

  itemsWithValues = computed(() => {
    const request = this.request()
    return request.itemsWithValues
  })

  values = computed(() => {
    const itemsWithValues: any[] = this.itemsWithValues()
    return itemsWithValues.map((i: any) => i.values)
  })

  grossWeight = computed(() => {
    const items = this.itemsWithValues(); // Get the items with values
    const total = items.reduce((total: any, item: any) => {
      const grossWeightValue = item.values.find((v: any) => v.name === 'Gross Weight')?.value;
      return total + (grossWeightValue ? parseFloat(grossWeightValue) : 0);
    }, 0);
    return total.toFixed(3);
  })

  netWeight = computed(() => {
    const items = this.itemsWithValues(); // Get the items with values
    const total = items.reduce((total: any, item: any) => {
      const grossWeightValue = item.values.find((v: any) => v.name === 'Net Weight')?.value;
      return total + (grossWeightValue ? parseFloat(grossWeightValue) : 0);
    }, 0);
    return total.toFixed(3);
  })

  ngOnInit(): void {}

  constructor() {

    effect(() => {
      const itemsWithValues = this.itemsWithValues()
      console.log('itemsWithValues: ', itemsWithValues)
    })

    console.log('Values: ', this.values())
  }

  getFieldValue(item: any, fieldName: string): string {
    const field = item.find((f: any) => f.name === fieldName);
    return field ? String(field.value) : '---';
  }

  getWeight(item: any, fieldName: string): string {
    const field = item.find((f: any) => f.name === fieldName);
    return Number.parseFloat(field.value ?? 0).toFixed(3);
  }
  
  calculateAmount(item: any): number {
    const unitValue = Number(this.getFieldValue(item, 'Unit Value')) || 0;
    const quantity = Number(this.getFieldValue(item, 'Quantity')) || 0;
    return unitValue * quantity;
  }

  
  calculateTotal(): number {
    const values = this.values()
    if (!values) return 0
    return values.reduce((sum: number, item: any) => {
      return sum + this.calculateAmount(item);
    }, 0);
  }

  /**
   * First example, was not used 
   */
  // async downloadInvoice() {
  //   const invoice = this.invoiceElement?.nativeElement;

  //   try {
  //       // Capture the invoice with a slight padding to avoid cutting off content
  //       const canvas = await html2canvas(invoice, { 
  //           scale: 2,
  //           allowTaint: true,
  //           scrollY: 0,
  //           backgroundColor: null // Ensure transparent background
  //       });
  //       const imgData = canvas.toDataURL('image/png');

  //       // Define A4 page dimensions in points (72 points per inch)
  //       const pageWidth = 595.28;
  //       const pageHeight = 841.89;

  //       // Calculate the scaling factor to fit the width of the image to the page width
  //       const scaleFactor = pageWidth / canvas.width;
  //       const scaledHeight = canvas.height * scaleFactor;

  //       const pdf = new jsPDF({
  //           orientation: 'portrait',
  //           unit: 'pt',
  //           format: 'a4'
  //       });

  //       // Calculate the number of pages needed
  //       const pageCount = Math.ceil(scaledHeight / pageHeight);

  //       // Add image to PDF, potentially spanning multiple pages
  //       for (let i = 0; i < pageCount; i++) {
  //           if (i > 0) {
  //               pdf.addPage();
  //           }

  //           const position = -i * pageHeight;

  //           pdf.addImage(
  //               imgData,
  //               'PNG',
  //               0,
  //               position,
  //               pageWidth,
  //               scaledHeight
  //           );
  //       }

  //       // Save the PDF with a specific filename
  //       pdf.save(`Invoice_${this.data.request.requestNumber}.pdf`);
  //   } catch (error) {
  //       console.error('Error generating invoice PDF: ', error);
  //   }
  // }

  /**
   * 2nd example. It has the text cut issue
   * and a zoomed layout beginning from the second page and so on  
  */
  async downloadInvoice() {
    const invoice = this.invoiceElement?.nativeElement;

    try {
        const canvas = await html2canvas(invoice, { 
            useCORS: true, 
            allowTaint: true, 
            scrollY: 0,
            scale: 2, // Maintain high resolution
            backgroundColor: 'white'
        });

        const imgWidth = 210;
        const pageHeight = 297;
        const margin = [6, 0];
        const innerPageWidth = imgWidth - margin[1] * 2;
        const innerPageHeight = pageHeight - margin[0] * 2;

        // Calculate the number of pages
        const pxFullHeight = canvas.height;
        const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
        const nPages = Math.ceil(pxFullHeight / pxPageHeight);

        // Create a one-page canvas to split up the full image
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pxPageHeight;

        // Initialize the PDF
        const pdf = new jsPDF('p', 'mm', 'a4');

        for (let page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
                pageCanvas.height = pxFullHeight % pxPageHeight;
            }

            // Display the page
            const w = pageCanvas.width;
            const h = pageCanvas.height;
            if (pageCtx) {
              pageCtx.fillStyle = 'white';
              pageCtx.fillRect(0, 0, w, h);
              pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);
          }
            // Add the page to the PDF
            if (page > 0) pdf.addPage();

            const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', margin[1], margin[0], innerPageWidth, innerPageHeight);
        }

        // Save the PDF
        pdf.save(`Invoice_${this.data.request.requestNumber}.pdf`);
    } catch (error) {
        console.error('Error generating invoice PDF: ', error);
    }
  }


  /**
   * latest updated example. It keeps having the text cut issue
   * but fixed the zoomed scale for multiple pages issue 
  */
  // async downloadInvoice() {
  //   const invoice = this.invoiceElement?.nativeElement;

  //   try {
  //       const canvas = await html2canvas(invoice, { 
  //           useCORS: true, 
  //           allowTaint: true,
  //           scrollY: -window.scrollY,
  //           scale: 2, // Maintain high resolution
  //           backgroundColor: 'white'
  //       });

  //       const imgWidth = 210; // A4 width in mm
  //       const pageHeight = 297; // A4 height in mm
  //       const margin = 10;
  //       const innerPageWidth = imgWidth - 2 * margin;
  //       const innerPageHeight = pageHeight - 2 * margin;

  //       // Calculate scaling factor to fit width
  //       const scale = innerPageWidth / canvas.width;
  //       const scaledFullHeight = canvas.height * scale;

  //       // Calculate the number of pages
  //       const nPages = Math.ceil(scaledFullHeight / innerPageHeight);

  //       // Initialize the PDF
  //       const pdf = new jsPDF('p', 'mm', 'a4');

  //       for (let page = 0; page < nPages; page++) {
  //           if (page > 0) pdf.addPage();

  //           // Calculate the portion of the canvas to use for this page
  //           const sy = page * (innerPageHeight / scale);
  //           const sHeight = Math.min(innerPageHeight / scale, canvas.height - sy);

  //           // Create a temporary canvas for this page section
  //           const pageCanvas = document.createElement('canvas');
  //           pageCanvas.width = canvas.width;
  //           pageCanvas.height = sHeight;
  //           const pageCtx = pageCanvas.getContext('2d');
            
  //           if (pageCtx) {
  //               pageCtx.fillStyle = 'white';
  //               pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
  //               pageCtx.drawImage(canvas, 0, sy, canvas.width, sHeight, 0, 0, canvas.width, sHeight);
  //           }

  //           // Convert to base64 image
  //           const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

  //           // Add the image to the PDF, maintaining original scale
  //           pdf.addImage(imgData, 'JPEG', margin, margin, canvas.width * scale, sHeight * scale);
  //       }

  //       // Save the PDF
  //       pdf.save(`Invoice_${this.data.request.requestNumber}.pdf`);
  //   } catch (error) {
  //       console.error('Error generating invoice PDF: ', error);
  //   }
  // }
}
