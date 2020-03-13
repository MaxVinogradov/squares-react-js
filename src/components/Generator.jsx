import React, { useState, memo } from 'react';
import Table from './Table'
import Button from './Button'

const generateMatrix = (height, width, i = 0) => Array
  .from(Array(height))
  .map((_, rowNumber) => Array.from(Array(width)).map((_, collNumber) => ({ rowNumber, collNumber })));

// hideRemoveButtons() {
//   this.#timer = setTimeout(this.hideRemoveButtonsProcessor, 3000);
// }

const Generator = ({ initialHeight = 4, initialWidth = 4, cellSize = 50 }) => {
  const [matrix, setMatrix] = useState(generateMatrix(initialHeight, initialWidth));
  const [{ columnIndex, rowIndex }, setItemToRemove] = useState({ columnIndex: 0, rowIndex: 0 });
  const [removeColumnButtonVisibility, setRemoveColumnButtonVisibility] = useState('hidden');
  const [removeRowButtonVisibility, setRemoveRowButtonVisibility] = useState('hidden');
  const [removeRowButtonTop, setRemoveRowButtonTop] = useState(2);
  const [removeColumnButtonLeft, setRemoveColumnButtonLeft] = useState(3);

  const hideRemoveButtonsProcessor = () => {
    setRemoveRowButtonVisibility('hidden')
    setRemoveColumnButtonVisibility('hidden')
  }

  const hideRemoveButtons = () => {
    hideRemoveButtonsProcessor();
    // setTimeout(hideRemoveButtonsProcessor(), 3000);
  }

  const removeColumnActionHandler = () => {
    if (matrix[0].length > 1) setMatrix(matrix.map(row => row.filter((v, i) => i !== columnIndex)));
    if (matrix[0].length === 1) setRemoveColumnButtonVisibility('hidden');
    if (columnIndex === matrix[0].length) {
      setRemoveColumnButtonLeft(removeColumnButtonLeft - cellSize - 2);
      setItemToRemove({ columnIndex: columnIndex - 1, rowIndex });
    }
    hideRemoveButtons();
  };

  const removeRowActionHandler = () => {
    if (matrix.length > 1) setMatrix([...matrix].filter((v, i) => i !== rowIndex));
    if (matrix.length === 1) setRemoveRowButtonVisibility('hidden');
    if (rowIndex === matrix.length) {
      setRemoveRowButtonTop(removeRowButtonTop - cellSize - 2);
      setItemToRemove({ columnIndex, rowIndex: rowIndex - 1 });
    }
    hideRemoveButtons();
  };

  const addColumnHandler = () => {
    setMatrix(
      [...matrix].map((row, rowNumber) => ([...row, { rowNumber, collNumber: row[row.length - 1].collNumber + 1 }]))
    )
  };

  const addRowActionHandler = () => {
    const rowNumber = matrix[matrix.length - 1][0].rowNumber + 1;
    setMatrix([
      ...matrix,
      Array.from(Array(matrix[0].length)).map((_, collNumber) => ({ rowNumber, collNumber })),
    ])
  };

  const mouseOverTableHandler = (event) => {
    if (!(event.target instanceof HTMLTableCellElement)) return;
    const {
      target: {
        cellIndex: columnIndex,
        parentNode: { rowIndex },
        offsetTop,
        offsetLeft,
      },
    } = event;

    setItemToRemove({ columnIndex, rowIndex });

    if (matrix.length !== 1) {
      setRemoveRowButtonVisibility('visible');
      setRemoveRowButtonTop(offsetTop);
    };
    if (matrix[0].length !== 1) {
      setRemoveColumnButtonVisibility('visible');
      setRemoveColumnButtonLeft(offsetLeft)
    };

  }

  const mouseLeaveTableOrButtonHandler = (event) => {
    const isMouseMovedOnButton = event.relatedTarget.classList.contains('remove-button') ||
      (event.relatedTarget.parentElement && event.relatedTarget.parentElement.classList.contains('remove-button'));
    const isMouseMovedFromTable = event.target.id === 'main-table';
    if (isMouseMovedFromTable && isMouseMovedOnButton) return;
    hideRemoveButtons();
  }

  return (
    <div className="generator-container" style={{ margin: cellSize * 2 }}>
      <Table
        matrix={matrix}
        cellSize={cellSize}
        onMouseOver={mouseOverTableHandler}
        onMouseLeave={mouseLeaveTableOrButtonHandler}
      />
      <Button
        className="remove-button"
        dynamicStyles={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          top: `${-cellSize - 3}px`,
          left: `${removeColumnButtonLeft}px`,
          visibility: removeColumnButtonVisibility,
        }}
        handleClick={removeColumnActionHandler}
        onMouseLeave={mouseLeaveTableOrButtonHandler}
      >
        -
      </Button>
      <Button
        className="remove-button"
        dynamicStyles={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          left: `${-cellSize - 3}px`,
          top: `${removeRowButtonTop}px`,
          visibility: removeRowButtonVisibility,
        }}
        handleClick={removeRowActionHandler}
        onMouseLeave={mouseLeaveTableOrButtonHandler}
      >
        -
      </Button>
      <Button
        className="add-button"
        dynamicStyles={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          left: "3px",
          bottom: `${-cellSize - 3}px`,
        }}
        handleClick={addRowActionHandler}
        onMouseLeave={mouseLeaveTableOrButtonHandler}
      >
        +
      </Button>
      <Button
        className="add-button"
        dynamicStyles={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          right: `${-cellSize - 3}px`,
          top: "2px",
        }}
        handleClick={addColumnHandler}
        onMouseLeave={mouseLeaveTableOrButtonHandler}
      >
        +
      </Button>
    </div>
  );
}

export default memo(Generator);
