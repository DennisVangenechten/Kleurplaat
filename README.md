# Kleurplaat Project

## Project Description

The **Kleurplaat** project is an interactive grid-based drawing application built using JavaScript. Users can paint individual cells in the grid with a selected color, export their creations as JSON files, and even import saved color patterns to continue editing. The grid dynamically resizes based on the size of the container, and users can reset the grid at any time.

## Features

- **Dynamic Grid**: The grid automatically adjusts to the size of the container, with cells that can be painted individually.
- **Color Picker**: Users can select a color from a palette to paint cells.
- **Export & Import**: Users can save their painted grids as JSON files and import them back to continue editing later.
- **Reset Functionality**: The grid can be reset, clearing all cells back to the default color.
- **Responsive**: The grid resizes when the container's dimensions change.

## How to Use

1. **Paint Cells**: Select a color using the color picker and click on grid cells to paint them.
2. **Export Drawing**: Click the "Export" button to download your creation as a JSON file.
3. **Import Drawing**: Use the "Import" button to load a previously saved JSON file and restore your drawing.
4. **Reset Grid**: Click the "Reset" button to clear the grid and start a new drawing.

## How to Set Up

1. Clone the repository.
2. Open `index.html` in your browser.
3. Start painting on the grid using the color picker and interact with the buttons to export, import, or reset the grid.

## Code Overview

### Key Classes and Methods:

- **`Cell`**: Represents an individual grid cell with properties for row, column, and color.
  - `setColor(color)`: Changes the cell's color.
  - `getColor()`: Returns the current color of the cell.

- **`GridManager`**: Manages the grid, cells, and painting logic.
  - `initializeGrid(rows, cols)`: Initializes a grid of specified rows and columns.
  - `renderGrid()`: Renders the grid cells in the DOM.
  - `startPainting(e, cell, cellElement)`: Begins painting when a cell is clicked.
  - `stopPainting()`: Stops the painting process.
  - `exportToJson()`: Exports the current grid to a JSON file.
  - `importFromJson(data)`: Imports a JSON file to restore the grid state.

- **`Kleurplaat`**: Manages the main application logic, including user interaction with the grid and buttons.
  - `initialize()`: Sets up event listeners and initializes the grid.
  - `resetGrid()`: Resets the grid to its default state.
  - `exportToJson()`: Exports the grid to JSON.
  - `importFromJson(event)`: Loads a grid from an imported JSON file.

## Future Improvements

- **Add Undo/Redo Functionality**: Allow users to undo or redo their actions on the grid.
- **Custom Grid Size**: Let users specify custom grid dimensions.
- **Advanced Painting Tools**: Introduce additional tools like line or shape drawing.

Enjoy creating with **Kleurplaat**!
