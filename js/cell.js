"use strict";

export class Cell {
  constructor(row, col, color = '#ffffff') {
    this.row = row;
    this.col = col;
    this.color = color;
  }

  setColor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  getPosition() {
    return { row: this.row, col: this.col };
  }
}
