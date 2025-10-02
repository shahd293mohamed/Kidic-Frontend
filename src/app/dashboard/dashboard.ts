import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ChatButton } from './chat-button/chat-button';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,Header,ChatButton],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
