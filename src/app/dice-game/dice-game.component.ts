import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dice-game',
  templateUrl: './dice-game.component.html',
  styleUrls: ['./dice-game.component.scss'],
})
export class DiceGameComponent {
  constructor(private snackBar: MatSnackBar) {}
  @ViewChild('ladder', { static: false }) ladderElement!: ElementRef;
  currentPlayer: 'blue' | 'yellow' = 'blue';
  bluePosition = 1;
  yellowPosition = 1;
  diceSound!: HTMLAudioElement;
  steps = Array(30)
    .fill(0)
    .map((_, index) => index + 1);
  diceRoll: number | null = null;
  winner: 'blue' | 'yellow' | null = null;

  // to get a grid with snake and ladder pattern
  grid: number[][] = [
    [25, 26, 27, 28, 29, 30],
    [24, 23, 22, 21, 20, 19],
    [13, 14, 15, 16, 17, 18],
    [12, 11, 10, 9, 8, 7],
    [1, 2, 3, 4, 5, 6],
  ];

  snakes: { [position: number]: number } = {
    17: 4,
    19: 7,
    21: 9,
    27: 1,
  };

  ladders: { [position: number]: number } = {
    3: 22,
    5: 8,
    11: 26,
    20: 29,
  };

  rollDice() {
    if (this.winner) {
      // if someone has won then further dice operations will be stopped
      return;
    }

    this.playDiceSound();
    this.diceRoll = Math.floor(Math.random() * 6) + 1;

    let currentPosition;

    if (this.currentPlayer === 'blue') {
      currentPosition = this.bluePosition;
      this.bluePosition = Math.min(currentPosition + this.diceRoll, 30);
    } else {
      currentPosition = this.yellowPosition;
      this.yellowPosition = Math.min(currentPosition + this.diceRoll, 30);
    }

    // Check for snakes
    if (this.snakes[this.bluePosition]) {
      this.openSnackBar(`Oh no! Blue Player got bitten by a snake.`);
      this.playSnakeSound();
      this.bluePosition = this.snakes[this.bluePosition];
    }

    if (this.snakes[this.yellowPosition]) {
      this.openSnackBar(`Oh no! Yellow Player got bitten by a snake.`);
      this.playSnakeSound();
      this.yellowPosition = this.snakes[this.yellowPosition];
    }

    // Check for ladders
    if (this.ladders[this.bluePosition]) {
      this.openSnackBar(`Wow! Blue Player climbed a ladder.`);
      this.playLadderSound();
      this.bluePosition = this.ladders[this.bluePosition];
    }

    if (this.ladders[this.yellowPosition]) {
      this.openSnackBar(`Wow! Yellow Player climbed a ladder.`);
      this.playLadderSound();
      this.yellowPosition = this.ladders[this.yellowPosition];
    }

    // Check if the current player has reached the winning position
    if (this.currentPlayer === 'blue' && this.bluePosition === 30) {
      this.winner = 'blue';
      this.openSnackBar('Blue Player is the winner!');
      this.playWinSound();
    } else if (this.currentPlayer === 'yellow' && this.yellowPosition === 30) {
      this.winner = 'yellow';
      this.openSnackBar('Yellow Player is the winner!');
      this.playWinSound();
    } else {
      this.switchPlayer();
    }
  }

  playDiceSound() {
    this.diceSound = new Audio('assets/DiceSound.mp3');
    this.diceSound.play();
  }

  playSnakeSound() {
    this.diceSound = new Audio('assets/snake-hissing-6092.mp3');
    this.diceSound.play();
  }

  playLadderSound() {
    this.diceSound = new Audio('assets/cartoon-jump-6462.mp3');
    this.diceSound.play();
  }

  playWinSound() {
    this.diceSound = new Audio('assets/WinSound.mp3');
    this.diceSound.play();
  }

  playNewSound() {
    this.diceSound = new Audio('assets/GameStart.mp3');
    this.diceSound.play();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'blue' ? 'yellow' : 'blue';
  }

  resetGame() {
    this.playNewSound();
    this.bluePosition = 1;
    this.yellowPosition = 1;
    this.diceRoll = null;
    this.winner = null;
    this.currentPlayer = 'blue';
  }
}
