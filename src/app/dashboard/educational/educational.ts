import { Component } from '@angular/core';

@Component({
  selector: 'app-educational',
  imports: [],
  templateUrl: './educational.html',
  styleUrl: './educational.css'
})
export class Educational {
  activeTab: string = 'activities'; 

  showTab(tabName: string) {
    this.activeTab = tabName;
  }

}
