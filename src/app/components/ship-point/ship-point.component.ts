import { Component, OnInit } from '@angular/core';
import { ShippointService } from '../../services/shippoint.service';
import { Ship } from '../../models/ship.model';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-shippoint',
  templateUrl: './ship-point.component.html',
  styleUrls: ['./ship-point.component.css'],
  providers: [DialogService, MessageService]
})
export class ShipPointComponent implements OnInit {
  shippoints: Ship[] = [];
  filteredshippoints: Ship[] = [];
  SearchText: string = '';
  page: number = 1;
  tableSize: number = 5;
  display: boolean = false;
  data: { id_ship: number, shipPoint: string, fullAddress: string } = { id_ship: 0, shipPoint: '', fullAddress: '' };

  constructor(
    private shippointService: ShippointService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadShipPoints();
  }

  loadShipPoints(): void {
    this.shippointService.getShipPoints().subscribe(
      (data: Ship[]) => {
        this.shippoints = data;
        this.filteredshippoints = data;
      },
      (error) => {
        console.error('Error loading ship points', error);
      }
    );
  }

  searchShipPoint(): void {
    this.filteredshippoints = this.shippoints.filter((ship: Ship) =>
      ship.shipPoint.toLowerCase().includes(this.SearchText.toLowerCase()) ||
      ship.fullAddress.toLowerCase().includes(this.SearchText.toLowerCase())
    );
  }

  AjouterShipPoint(): void {
    this.data = { id_ship: 0, shipPoint: '', fullAddress: '' };
    this.display = true;
  }

  openUpdateShipPointDialog(ship: Ship): void {
    this.data = { ...ship };
    this.display = true;
  }

  onNoClick(): void {
    this.display = false;
  }

  onSaveClick(): void {
    if (this.data.id_ship) {
      this.shippointService.updateShipPoint(this.data.id_ship, this.data).subscribe({
        next: () => {
          this.loadShipPoints();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ship point updated successfully' });
          this.display = false;
        },
        error: (error) => {
          console.error('Error updating ship point', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating ship point' });
        }
      });
    } else {
      this.shippointService.CreateShipPoint(this.data).subscribe({
        next: () => {
          this.loadShipPoints();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ship point created successfully' });
          this.display = false;
        },
        error: (error) => {
          console.error('Error creating ship point', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating ship point' });
        }
      });
    }
  }

  deleteShipPoint(id_ship: number): void {
    if (confirm('Are you sure you want to delete this ship point?')) {
      this.shippointService.deleteShipPoint(id_ship).subscribe({
        next: () => {
          this.loadShipPoints();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ship point deleted successfully' });
        },
        error: (error) => {
          console.error('Error deleting ship point', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting ship point' });
        }
      });
    }
  }

  onPageChange(event: any): void {
    this.page = event.page + 1;
  }

  getPageNumbers(): number[] {
    return Array(Math.ceil(this.filteredshippoints.length / this.tableSize)).fill(0).map((x, i) => i + 1);
  }
}
