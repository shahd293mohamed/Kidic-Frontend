// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { NotificationService, Notification } from '../../Core/services/notification-service';
// import { Subscription } from 'rxjs';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-notifications',
//   imports: [FormsModule, CommonModule],
//   templateUrl: './notifications.html',
//   styleUrl: './notifications.css'
// })
// export class Notifications implements OnInit, OnDestroy {
//   notifications: Notification[] = [];
//   parentId = 4; // Replace with logged-in parent's ID
//   private subscription!: Subscription;

//   constructor(private notificationService: NotificationService) {}

//   ngOnInit(): void {
//     // 1️⃣ Connect to WebSocket
//     this.notificationService.connect(this.parentId);

//     // 2️⃣ Fetch existing notifications
//     this.notificationService.getUserNotifications(this.parentId).subscribe(data => {
//       this.notifications = data;
//     });

//     // 3️⃣ Listen for new notifications
//     this.subscription = this.notificationService.notifications$.subscribe(newList => {
//       this.notifications = newList;
//     });
//   }

//   // markAllAsRead(): void {
//   //   this.notificationService.markAllAsRead(this.parentId).subscribe(() => {
//   //     this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
//   //   });
//   // }

//   markAsRead(notificationId: number): void {
//     this.notificationService.markAsRead(notificationId).subscribe(() => {
//       this.notifications = this.notifications.map(n =>
//         n.id === notificationId ? { ...n, isRead: true } : n
//       );
//     });
//   }

//   ngOnDestroy(): void {
//     this.notificationService.disconnect();
//     if (this.subscription) {
//       this.subscription.unsubscribe();
//     }
//   }
// }


import { Component, OnInit, OnDestroy } from '@angular/core';
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
  notifications: Notification[] = []; // ✅ Initialize as empty array
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Example parentId - Replace this with the actual logged-in user's ID
    const parentId = 4;

    // Fetch initial notifications
    this.subscription.add(
      this.notificationService.getUserNotifications(parentId).subscribe(data => {
        this.notifications = data;
      })
    );

    // Subscribe to real-time notifications
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

  // ✅ Helper method to count unread notifications
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
    });
  }
}

