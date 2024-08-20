"use strict";

import { GridManager } from './gridmanager.js';

export class Kleurplaat {
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
