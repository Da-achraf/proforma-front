import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { API_URL_TOKEN } from '../api/api.config';

@Injectable({
  providedIn: 'root',
})
export class BulkUploadSignalR1Service {
  private baseUrl = inject(API_URL_TOKEN);
  private hubConnection: signalR.HubConnection;
  private progressSubjects = new Map<string, BehaviorSubject<number>>(); // Track progress for each uploadId
  private uploadIds = new Set<string>(); // Track active uploads

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/bulkUploadHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    // Listen for progress updates
    this.hubConnection.on(
      'ReceiveProgress',
      (uploadId: string, progress: number) => {
        this.updateProgress(uploadId, progress);
      },
    );
  }

  // Start the SignalR connection
  async startConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.hubConnection.start();
        console.log('SignalR connection started');
      } catch (err) {
        console.error('Error starting SignalR connection: ', err);
      }
    }
  }

  // Stop the SignalR connection
  stopConnection(): void {
    if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      this.hubConnection
        .stop()
        .then(() => console.log('SignalR connection stopped'));
    }
  }

  // Register an upload session with the backend
  async registerUpload(uploadId: string): Promise<void> {
    await this.hubConnection.invoke('RegisterUpload', uploadId);
    this.uploadIds.add(uploadId); // Track the uploadId
    this.progressSubjects.set(uploadId, new BehaviorSubject<number>(0)); // Initialize progress tracking
  }

  // Get progress updates for a specific uploadId
  getProgressUpdates(uploadId: string) {
    const progressSubject = this.progressSubjects.get(uploadId);
    if (!progressSubject) {
      throw new Error(`No progress tracking found for uploadId: ${uploadId}`);
    }
    return progressSubject.asObservable();
  }

  // Update progress for a specific uploadId
  private updateProgress(uploadId: string, progress: number): void {
    const progressSubject = this.progressSubjects.get(uploadId);
    if (progressSubject) {
      progressSubject.next(progress);
    } else {
      console.warn(`No progress tracking found for uploadId: ${uploadId}`);
    }
  }

  // Generate a unique upload ID
  generateUploadId(): string {
    return uuidv4();
  }

  // Clean up progress tracking for a completed upload
  completeUpload(uploadId: string): void {
    this.uploadIds.delete(uploadId);
    this.progressSubjects.delete(uploadId);
  }
}
