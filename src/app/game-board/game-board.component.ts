import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
  optionOne: string = '000000';
  optionTwo: string = '000000';
  optionThree: string = '000000';
  optionFour: string = '000000';

  colorToGuess: string = '000000';

  ngOnInit(): void {
    this.SetBoard();
  }

  SetBoard() {
    let indeces = [1, 2, 3, 4];
    indeces = this.ShuffleArray(indeces);

    this.optionOne = this.GenerateRandomHex();
    this.optionTwo = this.GenerateRandomHex();
    this.optionThree = this.GenerateRandomHex();
    this.optionFour = this.GenerateRandomHex();

    switch (indeces[0]) {
      case 1:
        this.colorToGuess = this.optionOne;
        break;
      case 2:
        this.colorToGuess = this.optionTwo;
        break;
      case 3:
        this.colorToGuess = this.optionThree;
        break;
      case 4:
        this.colorToGuess = this.optionFour;
        break;
      default:
        this.colorToGuess = this.GenerateRandomHex();
        break;
    }
  }

  ShuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }

  GenerateRandomHex(): string {
    const letters = '0123456789ABCDEF';
    let color = '';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  SetColorToGuess(color: string) {
    this.colorToGuess = color;
  }

  CheckForWin(btnIndex: number) {
    switch (btnIndex) {
      case 1:
        if (this.colorToGuess === this.optionOne) {
          console.log(true);
          this.SetBoard();
        } else console.log(false);
        break;
      case 2:
        if (this.colorToGuess === this.optionTwo) {
          console.log(true);
          this.SetBoard();
        } else console.log(false);
        break;
      case 3:
        if (this.colorToGuess === this.optionThree) {
          console.log(true);
          this.SetBoard();
        } else console.log(false);
        break;
      case 4:
        if (this.colorToGuess === this.optionFour) {
          console.log(true);
          this.SetBoard();
        } else console.log(false);
        break;
    }
  }
}
