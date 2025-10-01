import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface Notification {
  id: number;
  type: 'MEDICAL' | 'EDUCATIONAL' | 'MEAL' | 'GROWTH' | 'GENERAL' | 'URGENT';
  content: string;
  parentId: number;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';
  private stompClient: Client | null = null;

  // ✅ Store notifications so UI updates in real-time
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ------------------------
  // REST APIs
  // ------------------------

  getUserNotifications(parentId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${parentId}`);
  }

  getUnreadNotifications(parentId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/unread/${parentId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(parentId: number): Observable<void> {
    return new Observable(observer => {
      this.getUnreadNotifications(parentId).subscribe(unread => {
        if (unread.length === 0) {
          observer.next();
          observer.complete();
          return;
        }

        const requests = unread.map(n => this.markAsRead(n.id).toPromise());
        Promise.all(requests).then(() => {
          observer.next();
          observer.complete();
        });
      });
    });
  }

  clearAllNotifications(parentId: number): Observable<void> {
    // If backend supports deleting all notifications
    return of(); // placeholder
  }

  // ------------------------
  // WebSocket Setup
  // ------------------------

  connect(parentId: number): void {
    if (this.stompClient && this.stompClient.active) {
      console.log('Already connected to WebSocket');
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws');

    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = () => {}; // disable debug logs for cleaner console

    this.stompClient.onConnect = () => {
      console.log('✅ Connected to WebSocket');

      // Subscribe to the specific user's queue
      this.stompClient?.subscribe(`/user/${parentId}/queue/notifications`, (message: IMessage) => {
        if (message.body) {
          const newNotification: Notification = JSON.parse(message.body);
          console.log('🔔 New notification:', newNotification);

          // Update local state
          const current = this.notificationsSubject.value;
          this.notificationsSubject.next([newNotification, ...current]);
        }
      });
    };

    this.stompClient.onStompError = frame => {
      console.error('WebSocket error:', frame.headers['message'], frame.body);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate().then(() => {
        console.log('❌ Disconnected from WebSocket');
      });
      this.stompClient = null;
    }
  }
}
