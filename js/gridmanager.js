"use strict";

import { Cell } from './cell.js';

export class GridManager {
  constructor(gridElement, cellSize = 30) {
    this.gridElement = gridElement;
    this.cellSize = cellSize;
    this.cells = {};
    this.rows = 0;
    this.cols = 0;
    this.currentColor = '#ffffff';
    this.isPainting = false;

    this.initMouseEvents();
  }

  initializeGrid(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = {}; // Reset cells
    this.renderGrid();
  }

  updateGridSize(containerWidth, containerHeight) {
    const newRows = Math.floor(containerHeight / this.cellSize);
    const newCols = Math.floor(containerWidth / this.cellSize);

    this.rows = newRows;
    this.cols = newCols;

    this.gridElement.style.gridTemplateRows = `repeat(${newRows}, ${this.cellSize}px)`;
    this.gridElement.style.gridTemplateColumns = `repeat(${newCols}, ${this.cellSize}px)`;
    this.renderGrid();
  }

  renderGrid() {
    this.gridElement.innerHTML = ''; // Clear previous cells

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cellKey = `${r},${c}`;
        const cellColor = this.cells[cellKey] ? this.cells[cellKey].getColor() : '#ffffff';
        const cell = new Cell(r, c, cellColor);
        this.cells[cellKey] = cell;

        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.dataset.row = r;
        cellElement.dataset.col = c;
        cellElement.style.backgroundColor = cell.getColor();
        cellElement.addEventListener('mousedown', (e) => this.startPainting(e, cell, cellElement));
        cellElement.addEventListener('mousemove', (e) => this.paintCell(e, cell, cellElement));
        cellElement.addEventListener('mouseup', () => this.stopPainting());
        this.gridElement.appendChild(cellElement);
      }
    }
  }

  startPainting(e, cell, cellElement) {
    if (e.buttons !== 1) return; // Only respond to left mouse button
    this.isPainting = true;
    this.colorCell(cell, cellElement);
  }

  paintCell(e, cell, cellElement) {
    if (!this.isPainting) return;
    this.colorCell(cell, cellElement);
  }

  stopPainting() {
    this.isPainting = false;
  }

  colorCell(cell, cellElement) {
    cell.setColor(this.currentColor);
    cellElement.style.backgroundColor = this.currentColor;
    const { row, col } = cell.getPosition();
    const message = this.currentColor === '#ffffff'
      ? `Ik ben veld ${row}, ${col} en ik ben wit`
      : `Ik ben veld ${row}, ${col} en ik werd zopas ${this.currentColor} gekleurd`;
    console.log(message);
    this.cells[`${row},${col}`] = cell; // Update cell in the grid
  }

  setColor(color) {
    this.currentColor = color;
  }

  exportToJson() {
    const data = {};
    for (const key in this.cells) {
      const cell = this.cells[key];
      data[key] = cell.getColor();
    }
    const json = JSON.stringify(data);
    console.log(json);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kleurplaat.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromJson(data) {
    this.cells = {};
    for (const key in data) {
      const [row, col] = key.split(',').map(Number);
      const color = data[key];
      this.cells[key] = new Cell(row, col, color);
    }
    this.renderGrid();
  }

  initMouseEvents() {
    document.addEventListener('mouseup', () => this.stopPainting());
  }
}
