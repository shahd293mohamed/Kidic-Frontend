import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from '../../Core/services/chatbot-service';
import { FormsModule } from '@angular/forms';
import {Message} from '../../Core/model';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule,CommonModule,MarkdownModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot implements AfterViewChecked {
userMessage: string = '';
  messages: Message[] = [];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: this.userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.messages.push(userMsg);

    // Call backend
    this.chatbotService.sendMessage(this.userMessage, 1).subscribe({
      next: (response) => {
        console.log('Bot response:', response.answer);
        const botMsg: Message = {
          sender: 'bot',
          text: response.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMsg);
      },
      error: () => {
        const botMsg: Message = {
          sender: 'bot',
          text: "⚠️ Sorry, something went wrong.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMsg);
      }
    });

    this.userMessage = '';
  }
}

