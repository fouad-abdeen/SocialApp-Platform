import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = <Socket>{};
  private notificationSubject = new Subject<string>();

  constructor() {}

  connect(userId: string) {
    this.socket = io(environment.webSocketUrl, {
      path: environment.webSocketPath,
      auth: { userId },
    });

    this.socket.on('notification', (notification) => {
      this.notificationSubject.next(notification.content);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  get notifications$() {
    return this.notificationSubject.asObservable();
  }
}
