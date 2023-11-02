import { Component, Input } from '@angular/core';
import { GameLogicService } from 'src/app/services/game-logic.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  constructor(private glService: GameLogicService) {}
  @Input() option!: string;

  btnPressed() {
    console.log(this.glService.CheckForWin(this.option));
  }
}
