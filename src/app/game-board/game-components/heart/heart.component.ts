import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.scss'],
})
export class HeartComponent {
  @Input() isDead: boolean = false;
}
