import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameLogicService } from 'src/app/services/game-logic.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  constructor(private glService: GameLogicService) {}
  @Input() option!: string;
  @Output() btnClicked: EventEmitter<string> = new EventEmitter<string>();

  isRight: 'right' | 'wrong' | 'unset' = 'unset';

  btnPressed() {
    this.btnClicked.emit(this.option);
    if (this.glService.CheckForWin(this.option)) {
      this.isRight = 'right';
    } else {
      this.isRight = 'wrong';
    }
  }
}
