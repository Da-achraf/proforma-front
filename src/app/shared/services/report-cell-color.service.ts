import { Injectable } from '@angular/core';

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

  private lastTrackingNumber = '';
  private lastColorIndex = 0;
  private colors = Object.values(ReportCellColor);
  
  getNextColor(trackingNumber: string): string {
    if (this.lastTrackingNumber.length === 0) {
      this.lastTrackingNumber = trackingNumber;
    }

    if (trackingNumber === this.lastTrackingNumber) {
      return this.colors[this.lastColorIndex];
    }

    this.lastTrackingNumber = trackingNumber;
    this.lastColorIndex = (this.lastColorIndex + 1) % this.colors.length;

    return this.colors[this.lastColorIndex];
  }

}
