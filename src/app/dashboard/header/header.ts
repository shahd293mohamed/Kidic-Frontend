import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../Core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  showDropdown: boolean = false;
  constructor(private _auth:Auth, private _router:Router) { }

  ngOnInit(): void {
  }
    toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
 signOut() {
  this._auth.logout(); 
  this._router.navigate(['/']);
  alert("You have been signed out!");
  
}

}
