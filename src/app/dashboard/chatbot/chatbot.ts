import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class Chatbot implements AfterViewChecked , OnInit{
userMessage: string = '';
  messages: Message[] = [];
  ngOnInit() {
  const savedMessages = localStorage.getItem('chatMessages');
  if (savedMessages) {
    this.messages = JSON.parse(savedMessages);
  }
}

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

  // sendMessage() {
  //   if (!this.userMessage.trim()) return;

  //   // Add user message
  //   const userMsg: Message = {
  //     sender: 'user',
  //     text: this.userMessage,
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //   };
  //   this.messages.push(userMsg);

  //   // Call backend
  //   this.chatbotService.sendMessage(this.userMessage, 1).subscribe({
  //     next: (response) => {
  //       console.log('Bot response:', response.answer);
  //       const botMsg: Message = {
  //         sender: 'bot',
  //         text: response.answer,
  //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //       };
  //       this.messages.push(botMsg);
  //     },
  //     error: () => {
  //       const botMsg: Message = {
  //         sender: 'bot',
  //         text: "⚠️ Sorry, something went wrong.",
  //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //       };
  //       this.messages.push(botMsg);
  //     }
  //   });

  //   this.userMessage = '';
  // }
  sendMessage() {
  if (!this.userMessage.trim()) return;

  const userMsg: Message = {
    sender: 'user',
    text: this.userMessage,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  this.messages.push(userMsg);

  this.saveMessages(); // ✅ Save to local storage

  this.chatbotService.sendMessage(this.userMessage, 1).subscribe({
    next: (response) => {
      const botMsg: Message = {
        sender: 'bot',
        text: response.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(botMsg);
      this.saveMessages(); // ✅ Save again after bot reply
    },
    error: () => {
      const botMsg: Message = {
        sender: 'bot',
        text: "⚠️ Sorry, something went wrong.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(botMsg);
      this.saveMessages();
    }
  });

  this.userMessage = '';
}

saveMessages() {
  localStorage.setItem('chatMessages', JSON.stringify(this.messages));
}
}

