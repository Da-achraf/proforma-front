import { Injectable } from '@angular/core';

// export const ReportCellColor = {
//   LightBlue: '#90d5ff', // Light Blue
//   LightCoral: '#FFCC99', // Light Coral
//   LightGreen: '#99FF99', // Light Green
//   LightYellow: '#FFFF99', // Light Yellow
//   LightPink: '#FF99CC', // Light Pink
//   LightPurple: '#CC99FF', // Light Purple
//   LightOrange: '#FFCC99', // Light Orange
//   LightTeal: '#99FFFF', // Light Teal
// };


export const ReportCellColor = {
  LightBlue: '#dddce0', // Light Blue
  LightCoral: '#fbf8ff', // Light Coral
  // LightGreen: '#99FF99', // Light Green
  // LightYellow: '#FFFF99', // Light Yellow
  // LightPink: '#FF99CC', // Light Pink
  // LightPurple: '#CC99FF', // Light Purple
  // LightOrange: '#FFCC99', // Light Orange
  // LightTeal: '#99FFFF', // Light Teal
};

@Injectable({
  providedIn: 'root'
})
export class ReportCellColorService {

  private readonly colors = ['#edf0e9', '#f0e9ed'];
  private lastRequestNumber: number | null = null;
  private lastAssignedColorIndex = -1;

  getColorForRequestNumber(requestNumber: number): string {
    // If this is a new request number, switch to the next color
    if (requestNumber !== this.lastRequestNumber) {
      // Increment color index, wrapping around the colors array
      this.lastAssignedColorIndex = (this.lastAssignedColorIndex + 1) % this.colors.length;
      
      // Update the last request number
      this.lastRequestNumber = requestNumber;
    }

    // Return the current color
    return this.colors[this.lastAssignedColorIndex];
  }

  // Optional: Reset method if needed
  reset() {
    console.log('called reset..')
    // this.lastRequestNumber = null;
    this.lastAssignedColorIndex = -1;
  }
}
