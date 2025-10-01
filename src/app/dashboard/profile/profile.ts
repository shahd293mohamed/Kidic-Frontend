import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../Core/services/main_service';
import { Auth } from '../../Core/services/auth';
import { DecodedToken } from '../../Core/model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  children: any[] = [];
  parent: any = null;
  familyId : any = null;
  
  constructor(private mainService: MainService, private _auth: Auth) {}
  ngOnInit(): void {
    this.mainService.getFamily().subscribe((familyData: any) => {
      this.children = familyData.children;
      console.log("Children Data:", this.children);
    })
    this.mainService.getParent().subscribe((parentData: any) => {
      this.parent = parentData;
      console.log("Parent Data:", this.parent);
    })
      this.familyId = this._auth.getFamilyId();
    console.log('Decoded Family ID:', this.familyId);

    if (!this.familyId) {
      console.error('No family_id found in token!');
      return;
    }
    
    
  }
 

  activeTab: 'parent' | 'children' = 'parent';

  parentEditMode = false;
  childEditMode: { [key: number]: boolean } = {};

  // Switch between Parent & Children tabs
  showTab(tab: 'parent' | 'children') {
    this.activeTab = tab;
  }

  // Toggle parent edit mode
  toggleParentEdit() {
    this.parentEditMode = !this.parentEditMode;
  }

  // Toggle child edit mode
 toggleChildEdit(childId: number) {
  this.childEditMode[childId] = !this.childEditMode[childId];
}

saveChild(child: any) {
  child.allergies = (child.allergiesString || '')
    .split(',')
    .map((a: string) => a.trim())
    .filter((a: string) => a);

  this.mainService.updateChild(child.id, child).subscribe({
    next: (res) => {
      console.log('Child updated successfully:', res);
      this.toggleChildEdit(child.id);
    },
    error: (err) => {
      console.error('Error updating child:', err);
    }
  });
}

  saveParent() {
  this.mainService.updateparent(this.parent).subscribe({
    next: (res) => {
      console.log('Parent updated successfully:', res);
      this.parentEditMode = false;
    },
    error: (err) => {
      console.error('Error updating parent:', err);
    }
  });
}


  // Helper to get initials
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  // Helper to calculate age
  getAge(dateOfBirth: string): string {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const diff = today.getTime() - birthDate.getTime();
    const ageDate = new Date(diff);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  }

// deleteChild(id: number) {
//   if (confirm('Are you sure you want to delete this child?')) {
//     this.mainService.deleteChild(id).subscribe({
//       next: (res) => {
//         console.log('Child deleted:', res);
//         this.children = this.children.filter(c => c.id !== id);
//       },
//       error: (err) => {
//         console.error('Error deleting child:', err);
//       }
//     });
//   }
// }
deleteChild(id: number) {
  if (confirm('Are you sure you want to delete this child?')) {
    this.mainService.deleteChild(id).subscribe({
      next: (res) => {
        console.log('Child deleted:', res);
        this.children = this.children.filter(c => c.id !== id);
      },
      error: (err) => {
        console.error('Error deleting child:', err);
      }
    });
  }
}


  

}
