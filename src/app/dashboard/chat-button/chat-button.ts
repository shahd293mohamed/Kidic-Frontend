import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-button',
  imports: [],
  template: `
 <button (click)="goToChat()" class="fixed bottom-6 right-6 bg-blue-200 text-blue-800 p-4 rounded-full shadow-lg hover:bg-blue-500 transition" style="animation: bounce 3s ease-in-out infinite 1s;"> 🤖 Ai Assistant </button>
  `,
  styleUrl: './chat-button.css'
})
export class ChatButton {

   constructor(private router: Router) {}

  goToChat() {
    this.router.navigate(['/dashboard/chatbot']);
  }

}
