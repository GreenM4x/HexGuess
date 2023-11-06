import { Component, OnInit } from '@angular/core';
import { GameLogicService } from '../services/game-logic.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
  constructor(private glService: GameLogicService) {}

  lives!: boolean[];

  gameBoard!: { colorToGuess: string; optionsArr: string[] };
  ngOnInit(): void {
    this.gameBoard = this.glService.SetBoard();
    this.glService.livesArr.subscribe((Arr) => {
      this.lives = Arr;
    });
  }

  checkForWin(color: string) {
    if (this.glService.CheckForWin(color))
      setTimeout(() => {
        this.gameBoard = this.glService.SetBoard();
      }, 1000);
    else this.glService.UpdatedLifes();
  }
}
