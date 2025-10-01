import { Component, OnInit } from '@angular/core';
import { ContactusService } from '../../Core/services/contactus-service';
import { Review } from '../../Core/model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class Testimonials implements OnInit {
   reviews: Review[] = [];
  constructor(private contactusService: ContactusService) {}

  ngOnInit(): void {
    this.contactusService.getnormalreviews().subscribe((data: Review[]) => {
      const uniqueParents = new Map<number, Review>();
      data
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) // sort descending by date
        .forEach((review) => {
          if (!uniqueParents.has(review.parentId)) {
            uniqueParents.set(review.parentId, review);
          }
        });

      // 2️⃣ Take only top 3 reviews
      this.reviews = Array.from(uniqueParents.values()).slice(0, 3);
    });
  }

}
