"use strict";

import { Kleurplaat } from './js/kleurplaat.js';

document.addEventListener('DOMContentLoaded', () => {
  const gridElement = document.getElementById('grid');
  const gridContainer = document.getElementById('grid-container');
  const colorPicker = document.getElementById('colorPicker');
  const resetButton = document.getElementById('resetButton');
  const exportButton = document.getElementById('exportButton');
  const importFile = document.getElementById('importFile');

  new Kleurplaat(gridElement, gridContainer, colorPicker, resetButton, exportButton, importFile);
});
