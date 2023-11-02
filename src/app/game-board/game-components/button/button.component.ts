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

  btnPressed() {
    this.btnClicked.emit(this.option);
  }
}
