import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameLogicService {
  constructor() {}

  private gameObj: { colorToGuess: string; optionsArr: string[] } = {
    colorToGuess: '000000',
    optionsArr: ['000000', '111111', '222222', '333333'],
  };

  private timer: number = 60;

  private lives: number = 3;

  public livesArr: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([
    false,
    false,
    false,
  ]);

  public score: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  SetBoard(): { colorToGuess: string; optionsArr: string[] } {
    let indeces = [1, 2, 3, 4];
    indeces = this.ShuffleArray(indeces);

    this.gameObj.optionsArr.forEach((_, i) => {
      this.gameObj.optionsArr[i] = this.GenerateRandomHex();
    });

    switch (indeces[0]) {
      case 1:
        this.gameObj.colorToGuess = this.gameObj.optionsArr[0];
        break;
      case 2:
        this.gameObj.colorToGuess = this.gameObj.optionsArr[1];
        break;
      case 3:
        this.gameObj.colorToGuess = this.gameObj.optionsArr[2];
        break;
      case 4:
        this.gameObj.colorToGuess = this.gameObj.optionsArr[3];
        break;
      default:
        this.gameObj.colorToGuess = this.GenerateRandomHex();
        break;
    }

    return this.gameObj;
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
    this.gameObj.colorToGuess = color;
  }

  CheckForWin(option: string): boolean {
    if (option === this.gameObj.colorToGuess) {
      return true;
    } else {
      return false;
    }
  }

  UpdateScore() {
    const currentValue = this.score.getValue();
    this.score.next(currentValue + 1);
  }

  UpdateLifes() {
    const currentValue = this.livesArr.getValue();
    currentValue[this.lives - 1] = true;
    this.lives--;
    this.livesArr.next(currentValue);
  }
}
