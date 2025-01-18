import { ElementRef, EmbeddedViewRef, inject, Injectable, Renderer2, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas, { Options } from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  sanitizer = inject(DomSanitizer)

  // Base

  // async downloadInvoice(
  //   invoiceElementRef: TemplateRef<any>,
  //   renderer: Renderer2,
  //   elementRef: ElementRef
  // ) {
  //   const embeddedView: EmbeddedViewRef<any> = invoiceElementRef.createEmbeddedView({});
  //   embeddedView.detectChanges();

  //   const invoiceContainer = renderer.createElement('div');
  //   renderer.appendChild(elementRef.nativeElement, invoiceContainer);
  //   embeddedView.rootNodes.forEach(node => renderer.appendChild(invoiceContainer, node));

  //   const invoiceElement = invoiceContainer.querySelector('app-the-invoice');

  //   renderer.removeChild(elementRef.nativeElement, invoiceContainer);

  //   try {
  //     // Create a temporary container with fixed width
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.width = '210mm'; // A4 width
  //     tempContainer.style.position = 'absolute';
  //     tempContainer.style.left = '-9999px';

  //     // Clone the invoice element
  //     const clonedInvoice = invoiceElement.cloneNode(true) as HTMLElement;

  //     // Add a class to potential page break points
  //     const rows = clonedInvoice.querySelectorAll('tr, .row, div > *');
  //     rows.forEach(row => {
  //       (row as HTMLElement).style.pageBreakInside = 'avoid';
  //       (row as HTMLElement).style.breakInside = 'avoid';
  //     });

  //     tempContainer.appendChild(clonedInvoice);
  //     document.body.appendChild(tempContainer);

  //     const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
  //       useCORS: true,
  //       allowTaint: true,
  //       scrollY: 0,
  //       scale: 2, // Maintain high resolution
  //       backgroundColor: 'white'
  //     });

  //     // Remove the temporary container
  //     document.body.removeChild(tempContainer);

  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const margin = [6, 0]; // [top/bottom, left/right] margins in mm
  //     const innerPageWidth = imgWidth - margin[1] * 2;
  //     const innerPageHeight = pageHeight - margin[0] * 2;

  //     // Calculate scaling factors
  //     const scale = innerPageWidth / canvas.width;
  //     const scaledHeight = canvas.height * scale;

  //     // Calculate the height of each page in pixels at the original scale
  //     const pageHeightPx = Math.floor(innerPageHeight / scale);

  //     // Find natural break points
  //     const breakPoints: number[] = [];
  //     let currentHeight = 0;

  //     // Function to check if a pixel row is mostly white (a potential break point)
  //     const isRowEmpty = (y: number): boolean => {
  //       const imageData = canvas
  //         .getContext('2d')
  //         ?.getImageData(0, y, canvas.width, 1).data;

  //       if (!imageData) return true;

  //       // Check if the row is mostly white
  //       let whitePixels = 0;
  //       for (let i = 0; i < imageData.length; i += 4) {
  //         if (imageData[i] > 250 && imageData[i + 1] > 250 && imageData[i + 2] > 250) {
  //           whitePixels++;
  //         }
  //       }
  //       return whitePixels > canvas.width * 0.95; // 95% white threshold
  //     };

  //     while (currentHeight < canvas.height) {
  //       // Look for a natural break point within a 20px window before the page end
  //       let breakPoint = currentHeight + pageHeightPx;
  //       const searchStart = Math.max(breakPoint - 20, currentHeight);

  //       for (let y = searchStart; y <= breakPoint; y++) {
  //         if (isRowEmpty(y)) {
  //           breakPoint = y;
  //           break;
  //         }
  //       }

  //       breakPoints.push(breakPoint);
  //       currentHeight = breakPoint;
  //     }

  //     // Initialize the PDF
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     // Handle each page
  //     for (let i = 0; i < breakPoints.length; i++) {
  //       if (i > 0) {
  //         pdf.addPage();
  //       }

  //       const startY = i === 0 ? 0 : breakPoints[i - 1];
  //       const endY = breakPoints[i];
  //       const height = endY - startY;

  //       // Create a temporary canvas for this page section
  //       const pageCanvas = document.createElement('canvas');
  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = height;

  //       const pageCtx = pageCanvas.getContext('2d');
  //       if (pageCtx) {
  //         pageCtx.fillStyle = 'white';
  //         pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  //         pageCtx.drawImage(
  //           canvas,
  //           0,        // source x
  //           startY,   // source y
  //           canvas.width,  // source width
  //           height,    // source height
  //           0,        // destination x
  //           0,        // destination y
  //           canvas.width,  // destination width
  //           height     // destination height
  //         );
  //       }

  //       // Convert to base64 image
  //       const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

  //       // Calculate the height for this page's content in mm
  //       const contentHeightMM = (height / pageHeightPx) * innerPageHeight;

  //       // Add the image to the PDF
  //       pdf.addImage(
  //         imgData,
  //         'JPEG',
  //         margin[1],        // x position
  //         margin[0],        // y position
  //         innerPageWidth,   // width
  //         contentHeightMM   // height - scaled properly for this page
  //       );
  //     }

  //     // Generate blob and open in new tab
  //     const pdfBlob = pdf.output('blob');
  //     const blobUrl = URL.createObjectURL(pdfBlob);
  //     window.open(blobUrl, '_blank');

  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

  //   } catch (error) {
  //     console.error('Error generating invoice PDF: ', error);
  //   }
  // }


  // Improved
  async downloadInvoice(
    requestNumber: string,
    invoiceElementRef: TemplateRef<any>,
    renderer: Renderer2,
    elementRef: ElementRef
  ) {
    const embeddedView: EmbeddedViewRef<any> = invoiceElementRef.createEmbeddedView({});
    embeddedView.detectChanges();

  
    const invoiceContainer = renderer.createElement('div');
    renderer.appendChild(elementRef.nativeElement, invoiceContainer);
    embeddedView.rootNodes.forEach(node => renderer.appendChild(invoiceContainer, node));
  
    const invoiceElement = invoiceContainer.querySelector('app-the-invoice');
    renderer.removeChild(elementRef.nativeElement, invoiceContainer);
  
    try {
      // Ensure images are fully loaded before processing [Reserver for invoice ui enhancments]
      const images = invoiceElement.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img: any) => new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => {
              console.warn('Image failed to load:', img.src);
              resolve(true); // Resolve even if image fails to load
            };
          }
        }))
      );

      // Create a temporary container with fixed width
      const tempContainer = document.createElement('div');
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
  
      // Clone and prepare the invoice element
      const clonedInvoice = invoiceElement.cloneNode(true) as HTMLElement;

      // Additional image preparation [Reserver for invoice ui enhancments]
      const clonedImages = clonedInvoice.querySelectorAll('img');
      clonedImages.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
      });
      
      // Apply specific styles to prevent text cutting
      const styles = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        table { page-break-inside: auto !important; }
        tr { page-break-inside: avoid !important; page-break-after: auto !important; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        .page-break-avoid { page-break-inside: avoid !important; }
      `;
      
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      clonedInvoice.insertBefore(styleElement, clonedInvoice.firstChild);
  
      // Add break-avoidance to specific elements
      const breakAvoidElements = clonedInvoice.querySelectorAll('tr, .row, .header, .footer, h1, h2, h3, h4, h5, h6');
      breakAvoidElements.forEach(element => {
        (element as HTMLElement).classList.add('page-break-avoid');
      });
  
      tempContainer.appendChild(clonedInvoice);
      document.body.appendChild(tempContainer);
  
      // Calculate optimal height for each page
      const a4Height = 297; // mm
      const a4Width = 210; // mm
      const margin = 10; // mm
      // const margin = 7; // mm // better value [for invoice ui enhancements]
      const innerHeight = a4Height - (margin * 2);
      
      // Enhanced html2canvas configuration
      const canvas = await html2canvas(clonedInvoice, {
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        scale: 2, // Higher scale for better quality
        backgroundColor: 'white',
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
        logging: false,
        onclone: (clonedDoc) => {
          // Additional modifications to cloned document if needed
          const clonedElement = clonedDoc.querySelector('app-the-invoice');
          if (clonedElement) {
          }
        }
      });
  
      // Remove temporary container
      document.body.removeChild(tempContainer);
  
      // Calculate dimensions
      const scale = (a4Width - (margin * 2)) / canvas.width;
      const scaledHeight = canvas.height * scale;
      const pageCount = Math.ceil(scaledHeight / (innerHeight));
  
      // Initialize PDF
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });
  
      // Enhanced page splitting with overlap
      const overlap = 3; // 5mm overlap between pages to prevent cutting
      const pageHeightPx = (innerHeight / scale);
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
  
        // Calculate page section with overlap
        const startY = Math.max(0, i * pageHeightPx - (i > 0 ? overlap / scale : 0));
        const remainingHeight = canvas.height - startY;
        const currentPageHeight = Math.min(pageHeightPx + (i > 0 ? overlap / scale : 0), remainingHeight);
  
        // Create temporary canvas for current page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = currentPageHeight;
  
        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          // Clear background
          pageCtx.fillStyle = 'white';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
  
          // Draw page content with overlap
          pageCtx.drawImage(
            canvas,
            0,
            startY,
            canvas.width,
            currentPageHeight,
            0,
            0,
            canvas.width,
            currentPageHeight
          );
  
          // Add to PDF
          const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(
            imgData,
            'JPEG',
            margin,
            margin,
            a4Width - (margin * 2),
            (currentPageHeight * scale)
          );
        }
      }

      // Generate and open PDF
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      
      return true
      // Cleanup
  
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  }

  async prepareInvoice(
    invoiceElementRef: TemplateRef<any>,
    renderer: Renderer2,
    elementRef: ElementRef
  ) {
    const embeddedView: EmbeddedViewRef<any> = invoiceElementRef.createEmbeddedView({});
  
    const invoiceContainer = renderer.createElement('div');
    renderer.appendChild(elementRef.nativeElement, invoiceContainer);
    embeddedView.rootNodes.forEach(node => renderer.appendChild(invoiceContainer, node));
  
    const invoiceElement = invoiceContainer.querySelector('app-the-invoice');
    renderer.removeChild(elementRef.nativeElement, invoiceContainer);
  
    try {
      // Create a temporary container with fixed width
      const tempContainer = document.createElement('div');
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
  
      // Clone and prepare the invoice element
      const clonedInvoice = invoiceElement.cloneNode(true) as HTMLElement;
      
      // Apply specific styles to prevent text cutting
      const styles = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        table { page-break-inside: auto !important; }
        tr { page-break-inside: avoid !important; page-break-after: auto !important; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        .page-break-avoid { page-break-inside: avoid !important; }
      `;
      
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      clonedInvoice.insertBefore(styleElement, clonedInvoice.firstChild);
  
      // Add break-avoidance to specific elements
      const breakAvoidElements = clonedInvoice.querySelectorAll('tr, .row, .header, .footer, h1, h2, h3, h4, h5, h6');
      breakAvoidElements.forEach(element => {
        (element as HTMLElement).classList.add('page-break-avoid');
      });
  
      tempContainer.appendChild(clonedInvoice);
      document.body.appendChild(tempContainer);
  
      // Calculate optimal height for each page
      const a4Height = 297; // mm
      const a4Width = 210; // mm
      const margin = 10; // mm
      const innerHeight = a4Height - (margin * 2);
      
      // Enhanced html2canvas configuration
      const canvas = await html2canvas(clonedInvoice, {
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        scale: 3, // Higher scale for better quality
        backgroundColor: 'white',
        windowWidth: tempContainer.scrollWidth,
        windowHeight: tempContainer.scrollHeight,
        logging: false,
        onclone: (clonedDoc) => {
          // Additional modifications to cloned document if needed
          const clonedElement = clonedDoc.querySelector('app-the-invoice');
          if (clonedElement) {
            // Ensure all fonts are loaded
            // const fonts = Array.from(document.fonts);
            // return Promise.all(fonts.map(font => font.load()));
          }
        }
      });
  
      // Remove temporary container
      document.body.removeChild(tempContainer);
  
      // Calculate dimensions
      const scale = (a4Width - (margin * 2)) / canvas.width;
      const scaledHeight = canvas.height * scale;
      const pageCount = Math.ceil(scaledHeight / (innerHeight));
  
      // Initialize PDF
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });
  
      // Enhanced page splitting with overlap
      const overlap = 1; // 5mm overlap between pages to prevent cutting
      const pageHeightPx = (innerHeight / scale);
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
  
        // Calculate page section with overlap
        const startY = Math.max(0, i * pageHeightPx - (i > 0 ? overlap / scale : 0));
        const remainingHeight = canvas.height - startY;
        const currentPageHeight = Math.min(pageHeightPx + (i > 0 ? overlap / scale : 0), remainingHeight);
  
        // Create temporary canvas for current page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = currentPageHeight;
  
        const pageCtx = pageCanvas.getContext('2d');
        if (pageCtx) {
          // Clear background
          pageCtx.fillStyle = 'white';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
  
          // Draw page content with overlap
          pageCtx.drawImage(
            canvas,
            0,
            startY,
            canvas.width,
            currentPageHeight,
            0,
            0,
            canvas.width,
            currentPageHeight
          );
  
          // Add to PDF
          const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(
            imgData,
            'JPEG',
            margin,
            margin,
            a4Width - (margin * 2),
            (currentPageHeight * scale)
          );
        }
      }
  
      // Generate and open PDF
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      // window.open(blobUrl, '_blank');
  
      // Cleanup
      // setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
  
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      throw error;
    }
  }



















  






  






















  // Older methods
  // /**
  //  * This version opens the invoice in a new page but has the zoom issue
  //  * for multiple pages.
  //  */
  // async downloadInvoiceKat() {
  //   // Create the embedded view of the template
  //   const embeddedView: EmbeddedViewRef<any> = this.invoiceElement.createEmbeddedView({});
  //   embeddedView.detectChanges();

  //   const invoiceContainer = this.renderer.createElement('div');
  //   this.renderer.appendChild(this.elementRef.nativeElement, invoiceContainer);
  //   embeddedView.rootNodes.forEach(node => this.renderer.appendChild(invoiceContainer, node));

  //   const invoiceElement = invoiceContainer.querySelector('app-the-invoice');

  //   this.renderer.removeChild(this.elementRef.nativeElement, invoiceContainer);

  //   try {
  //     // Create a temporary container with fixed width
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.width = '210mm'; // A4 width
  //     tempContainer.style.position = 'absolute';
  //     tempContainer.style.left = '-9999px';
  //     tempContainer.appendChild(invoiceElement.cloneNode(true));
  //     document.body.appendChild(tempContainer);

  //     const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
  //       useCORS: true,
  //       allowTaint: true,
  //       scrollY: 0,
  //       scale: 2, // Maintain high resolution
  //       backgroundColor: 'white'
  //     });

  //     // Remove the temporary container
  //     document.body.removeChild(tempContainer);

  //     const imgWidth = 210;
  //     const pageHeight = 297;
  //     const margin = [6, 0];
  //     const innerPageWidth = imgWidth - margin[1] * 2;
  //     const innerPageHeight = pageHeight - margin[0] * 2;

  //     // Calculate the number of pages
  //     const pxFullHeight = canvas.height;
  //     const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
  //     const nPages = Math.ceil(pxFullHeight / pxPageHeight);

  //     // Create a one-page canvas to split up the full image
  //     const pageCanvas = document.createElement('canvas');
  //     const pageCtx = pageCanvas.getContext('2d');
  //     pageCanvas.width = canvas.width;
  //     pageCanvas.height = pxPageHeight;

  //     // Initialize the PDF
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     for (let page = 0; page < nPages; page++) {
  //       // Trim the final page to reduce file size
  //       if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
  //         pageCanvas.height = pxFullHeight % pxPageHeight;
  //       }

  //       // Display the page
  //       const w = pageCanvas.width;
  //       const h = pageCanvas.height;
  //       if (pageCtx) {
  //         pageCtx.fillStyle = 'white';
  //         pageCtx.fillRect(0, 0, w, h);
  //         pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);
  //       }
  //       // Add the page to the PDF
  //       if (page > 0) pdf.addPage();

  //       const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
  //       pdf.addImage(imgData, 'JPEG', margin[1], margin[0], innerPageWidth, innerPageHeight);
  //     }

  //     // Generate blob from PDF
  //     const pdfBlob = pdf.output('blob');

  //     // Create a URL for the blob
  //     const blobUrl = URL.createObjectURL(pdfBlob);

  //     // Open the PDF in a new tab
  //     window.open(blobUrl, '_blank');

  //     // Optionally, you can revoke the blob URL after a delay to free up memory
  //     // Be careful with the timing to ensure the PDF has loaded in the new tab
  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

  //   } catch (error) {
  //     console.error('Error generating invoice PDF: ', error);
  //   }
  // }

  // /**
  //  * This version opens the invoice in a new page with fixed zoom issue
  //  * for multiple pages. but with cutting text
  //  */
  // async downloadInvoiceYeah() {
  //   const embeddedView: EmbeddedViewRef<any> = this.invoiceElement.createEmbeddedView({});
  //   embeddedView.detectChanges();

  //   const invoiceContainer = this.renderer.createElement('div');
  //   this.renderer.appendChild(this.elementRef.nativeElement, invoiceContainer);
  //   embeddedView.rootNodes.forEach(node => this.renderer.appendChild(invoiceContainer, node));

  //   const invoiceElement = invoiceContainer.querySelector('app-the-invoice');

  //   this.renderer.removeChild(this.elementRef.nativeElement, invoiceContainer);

  //   try {
  //     // Create a temporary container with fixed width
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.width = '210mm'; // A4 width
  //     tempContainer.style.position = 'absolute';
  //     tempContainer.style.left = '-9999px';
  //     tempContainer.appendChild(invoiceElement.cloneNode(true));
  //     document.body.appendChild(tempContainer);

  //     const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
  //       useCORS: true,
  //       allowTaint: true,
  //       scrollY: 0,
  //       scale: 2, // Maintain high resolution
  //       backgroundColor: 'white'
  //     });

  //     // Remove the temporary container
  //     document.body.removeChild(tempContainer);

  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const margin = [6, 0]; // [top/bottom, left/right] margins in mm
  //     const innerPageWidth = imgWidth - margin[1] * 2;
  //     const innerPageHeight = pageHeight - margin[0] * 2;

  //     // Calculate scaling factors
  //     const scale = innerPageWidth / canvas.width;
  //     const scaledHeight = canvas.height * scale;

  //     // Calculate the height of each page in pixels at the original scale
  //     const pageHeightPx = Math.floor(innerPageHeight / scale);
  //     const nPages = Math.ceil(canvas.height / pageHeightPx);

  //     // Initialize the PDF
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     for (let page = 0; page < nPages; page++) {
  //       if (page > 0) {
  //         pdf.addPage();
  //       }

  //       // Calculate the height of content for this page
  //       const remainingHeight = canvas.height - (page * pageHeightPx);
  //       const currentPageHeight = Math.min(pageHeightPx, remainingHeight);

  //       // Create a temporary canvas for this page section
  //       const pageCanvas = document.createElement('canvas');
  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = currentPageHeight;

  //       const pageCtx = pageCanvas.getContext('2d');
  //       if (pageCtx) {
  //         pageCtx.fillStyle = 'white';
  //         pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  //         // Draw the appropriate portion of the original canvas
  //         pageCtx.drawImage(
  //           canvas,
  //           0,                    // source x
  //           page * pageHeightPx,  // source y
  //           canvas.width,         // source width
  //           currentPageHeight,    // source height
  //           0,                    // destination x
  //           0,                    // destination y
  //           canvas.width,         // destination width
  //           currentPageHeight     // destination height
  //         );
  //       }

  //       // Convert to base64 image
  //       const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

  //       // Calculate the height for this page's content in mm
  //       const contentHeightMM = (currentPageHeight / pageHeightPx) * innerPageHeight;

  //       // Add the image to the PDF, maintaining scale
  //       pdf.addImage(
  //         imgData,
  //         'JPEG',
  //         margin[1],                // x position
  //         margin[0],                // y position
  //         innerPageWidth,           // width
  //         contentHeightMM           // height - scaled properly for this page
  //       );
  //     }

  //     // Generate blob and open in new tab
  //     const pdfBlob = pdf.output('blob');
  //     const blobUrl = URL.createObjectURL(pdfBlob);
  //     window.open(blobUrl, '_blank');

  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

  //   } catch (error) {
  //     console.error('Error generating invoice PDF: ', error);
  //   }
  // }

  // /**
  //  * This version opens the invoice in a new page with fixed zoom issue
  //  * for multiple pages. but with minor cutting text issue
  //  */
  // async downloadInvoice() {
  //   const embeddedView: EmbeddedViewRef<any> = this.invoiceElement.createEmbeddedView({});
  //   embeddedView.detectChanges();

  //   const invoiceContainer = this.renderer.createElement('div');
  //   this.renderer.appendChild(this.elementRef.nativeElement, invoiceContainer);
  //   embeddedView.rootNodes.forEach(node => this.renderer.appendChild(invoiceContainer, node));

  //   const invoiceElement = invoiceContainer.querySelector('app-the-invoice');

  //   this.renderer.removeChild(this.elementRef.nativeElement, invoiceContainer);

  //   try {
  //     // Create a temporary container with fixed width
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.width = '210mm'; // A4 width
  //     tempContainer.style.position = 'absolute';
  //     tempContainer.style.left = '-9999px';

  //     // Clone the invoice element
  //     const clonedInvoice = invoiceElement.cloneNode(true) as HTMLElement;

  //     // Add a class to potential page break points
  //     const rows = clonedInvoice.querySelectorAll('tr, .row, div > *');
  //     rows.forEach(row => {
  //       (row as HTMLElement).style.pageBreakInside = 'avoid';
  //       (row as HTMLElement).style.breakInside = 'avoid';
  //     });

  //     tempContainer.appendChild(clonedInvoice);
  //     document.body.appendChild(tempContainer);

  //     const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
  //       useCORS: true,
  //       allowTaint: true,
  //       scrollY: 0,
  //       scale: 2, // Maintain high resolution
  //       backgroundColor: 'white'
  //     });

  //     // Remove the temporary container
  //     document.body.removeChild(tempContainer);

  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const margin = [6, 0]; // [top/bottom, left/right] margins in mm
  //     const innerPageWidth = imgWidth - margin[1] * 2;
  //     const innerPageHeight = pageHeight - margin[0] * 2;

  //     // Calculate scaling factors
  //     const scale = innerPageWidth / canvas.width;
  //     const scaledHeight = canvas.height * scale;

  //     // Calculate the height of each page in pixels at the original scale
  //     const pageHeightPx = Math.floor(innerPageHeight / scale);

  //     // Find natural break points
  //     const breakPoints: number[] = [];
  //     let currentHeight = 0;

  //     // Function to check if a pixel row is mostly white (a potential break point)
  //     const isRowEmpty = (y: number): boolean => {
  //       const imageData = canvas
  //         .getContext('2d')
  //         ?.getImageData(0, y, canvas.width, 1).data;

  //       if (!imageData) return true;

  //       // Check if the row is mostly white
  //       let whitePixels = 0;
  //       for (let i = 0; i < imageData.length; i += 4) {
  //         if (imageData[i] > 250 && imageData[i + 1] > 250 && imageData[i + 2] > 250) {
  //           whitePixels++;
  //         }
  //       }
  //       return whitePixels > canvas.width * 0.95; // 95% white threshold
  //     };

  //     while (currentHeight < canvas.height) {
  //       // Look for a natural break point within a 20px window before the page end
  //       let breakPoint = currentHeight + pageHeightPx;
  //       const searchStart = Math.max(breakPoint - 20, currentHeight);

  //       for (let y = searchStart; y <= breakPoint; y++) {
  //         if (isRowEmpty(y)) {
  //           breakPoint = y;
  //           break;
  //         }
  //       }

  //       breakPoints.push(breakPoint);
  //       currentHeight = breakPoint;
  //     }

  //     // Initialize the PDF
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     // Handle each page
  //     for (let i = 0; i < breakPoints.length; i++) {
  //       if (i > 0) {
  //         pdf.addPage();
  //       }

  //       const startY = i === 0 ? 0 : breakPoints[i - 1];
  //       const endY = breakPoints[i];
  //       const height = endY - startY;

  //       // Create a temporary canvas for this page section
  //       const pageCanvas = document.createElement('canvas');
  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = height;

  //       const pageCtx = pageCanvas.getContext('2d');
  //       if (pageCtx) {
  //         pageCtx.fillStyle = 'white';
  //         pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  //         pageCtx.drawImage(
  //           canvas,
  //           0,        // source x
  //           startY,   // source y
  //           canvas.width,  // source width
  //           height,    // source height
  //           0,        // destination x
  //           0,        // destination y
  //           canvas.width,  // destination width
  //           height     // destination height
  //         );
  //       }

  //       // Convert to base64 image
  //       const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

  //       // Calculate the height for this page's content in mm
  //       const contentHeightMM = (height / pageHeightPx) * innerPageHeight;

  //       // Add the image to the PDF
  //       pdf.addImage(
  //         imgData,
  //         'JPEG',
  //         margin[1],        // x position
  //         margin[0],        // y position
  //         innerPageWidth,   // width
  //         contentHeightMM   // height - scaled properly for this page
  //       );
  //     }

  //     // Generate blob and open in new tab
  //     const pdfBlob = pdf.output('blob');
  //     const blobUrl = URL.createObjectURL(pdfBlob);
  //     window.open(blobUrl, '_blank');

  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

  //   } catch (error) {
  //     console.error('Error generating invoice PDF: ', error);
  //   }
  // }

  // /**
  //  * latest updated example. It keeps having the text cut issue
  //  * but fixed the zoomed scale for multiple pages issue 
  // */
  // async downloadInvoiceTest1() {
  //   // Create the embedded view of the template
  //   const embeddedView: EmbeddedViewRef<any> = this.invoiceElement.createEmbeddedView({});
  //   embeddedView.detectChanges();

  //   const invoiceContainer = this.renderer.createElement('div');
  //   this.renderer.appendChild(this.elementRef.nativeElement, invoiceContainer);
  //   embeddedView.rootNodes.forEach(node => this.renderer.appendChild(invoiceContainer, node));

  //   const invoice = invoiceContainer.querySelector('app-the-invoice');

  //   this.renderer.removeChild(this.elementRef.nativeElement, invoiceContainer);

  //   try {
  //     const canvas = await html2canvas(invoice, {
  //       useCORS: true,
  //       allowTaint: true,
  //       scrollY: -window.scrollY,
  //       scale: 2, // Maintain high resolution
  //       backgroundColor: 'white'
  //     });

  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const margin = 10;
  //     const innerPageWidth = imgWidth - 2 * margin;
  //     const innerPageHeight = pageHeight - 2 * margin;

  //     // Calculate scaling factor to fit width
  //     const scale = innerPageWidth / canvas.width;
  //     const scaledFullHeight = canvas.height * scale;

  //     // Calculate the number of pages
  //     const nPages = Math.ceil(scaledFullHeight / innerPageHeight);

  //     // Initialize the PDF
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     for (let page = 0; page < nPages; page++) {
  //       if (page > 0) pdf.addPage();

  //       // Calculate the portion of the canvas to use for this page
  //       const sy = page * (innerPageHeight / scale);
  //       const sHeight = Math.min(innerPageHeight / scale, canvas.height - sy);

  //       // Create a temporary canvas for this page section
  //       const pageCanvas = document.createElement('canvas');
  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = sHeight;
  //       const pageCtx = pageCanvas.getContext('2d');

  //       if (pageCtx) {
  //         pageCtx.fillStyle = 'white';
  //         pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
  //         pageCtx.drawImage(canvas, 0, sy, canvas.width, sHeight, 0, 0, canvas.width, sHeight);
  //       }

  //       // Convert to base64 image
  //       const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

  //       // Add the image to the PDF, maintaining original scale
  //       pdf.addImage(imgData, 'JPEG', margin, margin, canvas.width * scale, sHeight * scale);
  //     }

  //     // Generate blob from PDF
  //     const pdfBlob = pdf.output('blob');

  //     // Create a URL for the blob
  //     const blobUrl = URL.createObjectURL(pdfBlob);

  //     // Open the PDF in a new tab
  //     window.open(blobUrl, '_blank');

  //     // Optionally, you can revoke the blob URL after a delay to free up memory
  //     // Be careful with the timing to ensure the PDF has loaded in the new tab
  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
  //   } catch (error) {
  //     console.error('Error generating invoice PDF: ', error);
  //   }
  // }

  // /**
  //  * Latest chatgpt version
  //  */
  // async downloadInvoiceTest() {
  //   // Create the embedded view of the template
  //   const embeddedView: EmbeddedViewRef<any> = this.invoiceElement.createEmbeddedView({});
  //   embeddedView.detectChanges();

  //   const invoiceContainer = this.renderer.createElement('div');
  //   this.renderer.appendChild(this.elementRef.nativeElement, invoiceContainer);
  //   embeddedView.rootNodes.forEach(node => this.renderer.appendChild(invoiceContainer, node));

  //   const invoiceElement = invoiceContainer.querySelector('app-the-invoice');

  //   this.renderer.removeChild(this.elementRef.nativeElement, invoiceContainer);

  //   try {
  //     // Create a temporary container with fixed width for A4 sizing
  //     const tempContainer = document.createElement('div');
  //     tempContainer.style.width = '210mm'; // A4 width
  //     tempContainer.style.position = 'absolute';
  //     tempContainer.style.left = '-9999px';
  //     tempContainer.appendChild(invoiceElement.cloneNode(true));
  //     document.body.appendChild(tempContainer);

  //     // Capture the invoice as a high-resolution canvas
  //     const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
  //       useCORS: true,
  //       allowTaint: true,
  //       scrollY: 0,
  //       scale: 2, // Maintain high resolution
  //       backgroundColor: 'white'
  //     });

  //     // Clean up
  //     document.body.removeChild(tempContainer);

  //     // PDF page dimensions
  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const margin = 10;
  //     const innerPageWidth = imgWidth - 2 * margin;
  //     const innerPageHeight = pageHeight - 2 * margin;

  //     // Scaling factor to fit canvas content to PDF width
  //     const scale = innerPageWidth / canvas.width;
  //     const scaledFullHeight = canvas.height * scale;

  //     // Calculate the number of pages required
  //     const nPages = Math.ceil(scaledFullHeight / innerPageHeight);

  //     // Initialize the PDF
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     for (let page = 0; page < nPages; page++) {
  //       if (page > 0) pdf.addPage();

  //       // Calculate the source section on canvas for each page
  //       const sy = page * (innerPageHeight / scale);
  //       const sHeight = Math.min(innerPageHeight / scale, canvas.height - sy);

  //       // Create a temporary canvas for this section
  //       const pageCanvas = document.createElement('canvas');
  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = sHeight;
  //       const pageCtx = pageCanvas.getContext('2d');

  //       if (pageCtx) {
  //         pageCtx.fillStyle = 'white';
  //         pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
  //         pageCtx.drawImage(canvas, 0, sy, canvas.width, sHeight, 0, 0, canvas.width, sHeight);
  //       }

  //       // Convert the page canvas to an image
  //       const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);

  //       // Add image to PDF, maintaining scale for consistent page size
  //       pdf.addImage(imgData, 'JPEG', margin, margin, innerPageWidth, innerPageHeight);
  //     }

  //     // Generate blob from PDF
  //     const pdfBlob = pdf.output('blob');

  //     // Create a URL for the blob
  //     const blobUrl = URL.createObjectURL(pdfBlob);

  //     // Open the PDF in a new tab
  //     window.open(blobUrl, '_blank');

  //     // Revoke the blob URL to free up memory after a delay
  //     setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);

  //   } catch (error) {
  //     console.error('Error generating invoice PDF: ', error);
  //   }
  // }

}