import { Component } from '@angular/core';
import { WeddingCountdownComponent } from './wedding-countdown/wedding-countdown.component';

@Component({
  selector: 'app-root',
  imports: [WeddingCountdownComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
