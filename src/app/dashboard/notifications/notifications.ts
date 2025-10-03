import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { NotificationService, Notification } from '../../Core/services/notification-service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [FormsModule, CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit, OnDestroy {
  notifications: Notification[] = []; 
  // @Output() unreadCountChanged = new EventEmitter<number>();
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    const parentId = 4;

    this.subscription.add(
      this.notificationService.getUserNotifications(parentId).subscribe(data => {
        this.notifications = data;
      })
    );
    this.notificationService.connect(parentId);

    this.subscription.add(
      this.notificationService.notifications$.subscribe(data => {
        this.notifications = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.notificationService.disconnect();
  }
  
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // private emitUnreadCount() {
  //   this.unreadCountChanged.emit(this.getUnreadCount());
  // }


  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      // this.emitUnreadCount();
    });
  }
}

