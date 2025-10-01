import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  // Get all notifications for a family
  getFamilyNotifications(familyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/family/${familyId}`);
  }

  // Mark notification as read
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${notificationId}/read`, {});
  }

  // Mark all notifications as read
  markAllAsRead(familyId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/family/${familyId}/read-all`, {});
  }
}
