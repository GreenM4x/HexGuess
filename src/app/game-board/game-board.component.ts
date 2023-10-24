import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
  optionOne: string = '7f75ed';
  optionTwo: string = 'd00914';
  optionThree: string = '989193';
  optionFour: string = 'd73db0';

  colorToGuess: string = 'ffffff';

  ngOnInit(): void {
    this.GenerateRandomHex();
  }
  GenerateRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    this.colorToGuess = color;
  }
}
