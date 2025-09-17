import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { Features } from './features/features';
import { Howitworks } from './howitworks/howitworks';
import { Testimonials } from './testimonials/testimonials';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header,Hero,Features,Howitworks,Testimonials,Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
