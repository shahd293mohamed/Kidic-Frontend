import { Component } from '@angular/core';
import { ContactusService } from '../../Core/services/contactus-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactus',
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './contactus.html',
  styleUrl: './contactus.css'
})
export class Contactus {
 activeIndex: number | null = null;

  subject: string = '';
  message: string = '';
  stars: number = 0; 
  successMessage: string = '';

  constructor(private contactusService: ContactusService) {}

  toggleFaq(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
  submitForm() {
  if (!this.subject || !this.message) {
    return;
  }

  let type: string;
  if (this.subject === 'review') {
    type = 'NORMAL';   
  } else if (this.subject === 'complain') {
    type = 'COMPLAIN'; 
  } else {
    return; 
  }

  const payload: any = {
    content: this.message,
    type: type,
  };

  if (this.subject === 'review') {
    payload.stars = this.stars;
  }

  this.contactusService.addReview(payload).subscribe({
    next: () => {
      this.successMessage = '✅ Thank you! Your message has been sent successfully.';
      this.message = '';
      this.subject = '';
      this.stars = 0;
    },
    error: (err) => {
      console.error('Error sending message', err);
    }
  });
}

}
