import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  activeTab: 'parent' | 'children' = 'parent';

  showTab(tab: 'parent' | 'children') {
    this.activeTab = tab;
  }


}
