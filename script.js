const modeSelection = document.querySelector('.mode-selection');
const gameBoard = document.querySelector('.game-board');
const onePlayerBtn = document.getElementById('one-player');
const twoPlayersBtn = document.getElementById('two-players');
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.game-status');
const resetButton = document.querySelector('.reset-btn');
const backButton = document.querySelector('.back-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isOnePlayerMode = false;
let lightEffectX = null;
let lightEffectO = null;

// Click event handlers for mode selection buttons
onePlayerBtn.addEventListener('click', () => {
  isOnePlayerMode = true;
  startGame();
});

twoPlayersBtn.addEventListener('click', () => {
  isOnePlayerMode = false;
  startGame();
});

function startGame() {
  modeSelection.classList.add('hidden');
  gameBoard.classList.remove('hidden');

  // Create light effects if they haven't been created yet
  if (!lightEffectX || !lightEffectO) {
    lightEffectX = document.createElement('div');
    lightEffectX.classList.add('light-effect-x');
    document.body.appendChild(lightEffectX);

    lightEffectO = document.createElement('div');
    lightEffectO.classList.add('light-effect-O');
    document.body.appendChild(lightEffectO);
  }

  cells.forEach(cell => {
    cell.textContent = '';
    cell.addEventListener('click', handleCellClick);
  });

  resetButton.addEventListener('click', resetGame);
  backButton.addEventListener('click', goBackToMenu);
  statusText.textContent = `${currentPlayer}'s turn`;
  updateLightEffect(); // Update initial light effect state
}

// Handle cell click event
function handleCellClick() {
  const index = this.getAttribute('data-index');
  if (board[index] !== '' || !isGameActive) return;

  updateCell(this, index);
  checkWinner();

  // In one-player mode, if it's the computer's turn, make an optimal move
  if (isOnePlayerMode && isGameActive && currentPlayer === 'O') {
    setTimeout(makeOptimalMove, 2000);
  }
}

// Update the cell with the current player's move and switch players
function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s turn`;
  updateLightEffect();
}

// Update the light effect
function updateLightEffect() {
  if (lightEffectX && lightEffectO) {
    if (currentPlayer === 'X') {
      lightEffectX.style.opacity = 1;
      lightEffectO.style.opacity = 0;
    } else {
      lightEffectX.style.opacity = 0;
      lightEffectO.style.opacity = 1;
    }
  }
}

// Check for a winner
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `${board[a]} wins!`;
      isGameActive = false;
      return;
    }
  }

  // Check for a draw
  if (!board.includes('')) {
    statusText.textContent = 'Draw!';
    isGameActive = false;
  }
}

// Reset the game
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });

  statusText.textContent = `${currentPlayer}'s turn`;
  updateLightEffect();
}

// Go back to the main menu and reset the game
function goBackToMenu() {
  gameBoard.classList.add('hidden');
  modeSelection.classList.remove('hidden');
  resetGame();

  // Remove light effects
  if (lightEffectX) {
    lightEffectX.remove();
    lightEffectX = null;
  }
  if (lightEffectO) {
    lightEffectO.remove();
    lightEffectO = null;
  }
}
