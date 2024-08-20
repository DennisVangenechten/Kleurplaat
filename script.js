"use strict";

class Cell {
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
initializeGrid(rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this.cells = {}; // Reset cells

  // Set the gridElement size
  this.gridElement.style.width = `${cols * this.cellSize}px`;
  this.gridElement.style.height = `${rows * this.cellSize}px`;

  // Clear existing grid visually
  this.gridElement.innerHTML = '';

  // Create and render cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = new Cell(row, col);
      this.cells[`${row}-${col}`] = cell;

      // Create a div element for each cell
      const cellElement = document.createElement('div');
      cellElement.style.width = `${this.cellSize}px`;
      cellElement.style.height = `${this.cellSize}px`;
      cellElement.style.backgroundColor = cell.getColor();
      cellElement.style.position = 'absolute';
      cellElement.style.left = `${col * this.cellSize}px`;
      cellElement.style.top = `${row * this.cellSize}px`;

      // Optional: Add event listeners for cell interaction (e.g., painting)
      // cellElement.addEventListener('click', () => { /* Handle click */ });

      this.gridElement.appendChild(cellElement);
    }
  }
}
  getPosition() {
    return { row: this.row, col: this.col };
  }
}

class GridManager {
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

class Kleurplaat {
  constructor(gridElement, gridContainer, colorPicker, resetButton, exportButton, importFile) {
    this.gridManager = new GridManager(gridElement);
    this.gridContainer = gridContainer;
    this.colorPicker = colorPicker;
    this.resetButton = resetButton;
    this.exportButton = exportButton;
    this.importFile = importFile;
    this.currentColor = colorPicker.value;

    this.initialize();
  }

  initialize() {
    this.addEventListeners();
    this.gridManager.setColor(this.currentColor);
    this.addResizeObserver();
    this.updateGridSize();
  }

  addEventListeners() {
    this.colorPicker.addEventListener('input', (e) => this.setColor(e.target.value));
    this.resetButton.addEventListener('click', () => this.resetGrid());
    this.exportButton.addEventListener('click', () => this.exportToJson());
    this.importFile.addEventListener('change', (e) => this.importFromJson(e));
  }

  addResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.updateGridSize();
    });
    resizeObserver.observe(this.gridContainer);
  }

  updateGridSize() {
    const containerWidth = this.gridContainer.clientWidth;
    const containerHeight = this.gridContainer.clientHeight;
    this.gridManager.updateGridSize(containerWidth, containerHeight);
  }

  setColor(color) {
    this.currentColor = color;
    this.gridManager.setColor(color);
  }

  resetGrid() {
    const containerWidth = this.gridContainer.clientWidth;
    const containerHeight = this.gridContainer.clientHeight;
    const rows = Math.floor(containerHeight / this.gridManager.cellSize);
    const cols = Math.floor(containerWidth / this.gridManager.cellSize);
    this.gridManager.initializeGrid(rows, cols);
  }

  exportToJson() {
    this.gridManager.exportToJson();
  }

  importFromJson(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        this.gridManager.importFromJson(data);
      };
      reader.readAsText(file);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gridElement = document.getElementById('grid');
  const gridContainer = document.getElementById('grid-container');
  const colorPicker = document.getElementById('colorPicker');
  const resetButton = document.getElementById('resetButton');
  const exportButton = document.getElementById('exportButton');
  const importFile = document.getElementById('importFile');

  new Kleurplaat(gridElement, gridContainer, colorPicker, resetButton, exportButton, importFile);
});
