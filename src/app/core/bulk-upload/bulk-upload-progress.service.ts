import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { API_URL_TOKEN } from '../api/api.config';

@Injectable({
  providedIn: 'root',
})
export class BulkUploadSignalRService {
  private hubConnection: signalR.HubConnection;
  private progressSubject = new BehaviorSubject<number>(0);
  private connectionState = 'Disconnected';

  private baseUrl = inject(API_URL_TOKEN);

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/bulkUploadHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    // Set up the progress event handler once
    this.hubConnection.on('ReceiveProgress', (progress: number) => {
      this.progressSubject.next(progress);
    });
  }

  async startConnection(): Promise<void> {
    // Only start if disconnected
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.hubConnection.start();
        console.log('SignalR connection started');
      } catch (err) {
        console.error('Error starting SignalR connection: ', err);
        // Reset progress on connection failure
        this.progressSubject.next(0);
      }
    } else {
      console.log(
        'SignalR connection already in state:',
        this.hubConnection.state,
      );
    }
  }

  stopConnection(): void {
    if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      this.hubConnection
        .stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch((err) =>
          console.error('Error stopping SignalR connection: ', err),
        );
    }
  }

  resetProgress(): void {
    this.progressSubject.next(0);
  }

  getProgressUpdates() {
    return this.progressSubject.asObservable();
  }
}
