const SlidePuzzle = (root, config) => {
  const { rows, cols, events } = config;

  const solvedPuzzle = createPuzzle(rows, cols);
  const currentPuzzle = shuffle(createPuzzle(rows, cols));

  root.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  root.classList.add("puzzle");

  render();

  // TODO: Generate 2d array
  function createPuzzle(row, col) {
    const puzzle = new Array(row);
    for (let i = 0; i < row; i++) {
      puzzle[i] = new Array(col);
      for (let j = 0; j < col; j++) {
        puzzle[i][j] = Math.min(row, col) * i + j + 1;
      }
    }
    puzzle[row - 1][col - 1] = null;
    return puzzle;
  }

  // TODO: Shuffle the puzzle array
  function shuffle(puzzle) {
    const rand = (max) => ~~(Math.random() * (max + 1));
    puzzle.forEach((row, i) => {
      row.forEach((cell, j) => {
        let k = rand(puzzle.length - 1);
        let l = rand(puzzle[i].length - 1);
        let temp = cell;
        puzzle[i][j] = puzzle[k][l];
        puzzle[k][l] = temp;
      });
    });
    return puzzle;
  }

  // TODO: Render currentPuzzle into HTML
  function render() {
    root.innerHTML = null;
    currentPuzzle.forEach((row, i) => {
      row.forEach((cell, j) => {
        const block = document.createElement("div");
        block.classList.add("block");
        block.dataset.x = j;
        block.dataset.y = i;
        block.textContent = cell;
        block.onclick = swap;
        root.appendChild(block);
      });
    });
  }

  // TODO: Handle blocks onclick events
  function swap(e) {
    const { x, y } = e.target.dataset;

    // Array rows
    const curr = currentPuzzle[y];
    const next = currentPuzzle[+y + 1];
    const prev = currentPuzzle[+y - 1];

    if (next && next[x] == null) {
      next[x] = curr[x];
      curr[x] = null;
    } else if (prev && prev[x] == null) {
      prev[x] = curr[x];
      curr[x] = null;
    } else if (x != cols - 1 && curr[+x + 1] == null) {
      curr[+x + 1] = curr[x];
      curr[x] = null;
    } else if (x != 0 && curr[+x - 1] == null) {
      curr[+x - 1] = curr[x];
      curr[x] = null;
    }

    render();
    check();
  }

  // TODO: Return callback function if puzzle is solved
  function check() {
    JSON.stringify(currentPuzzle) == JSON.stringify(solvedPuzzle) &&
      events.onSolved();
  }
};
