// Game state variables
let moves = 0;
let timeElapsed = 0;
let timerInterval = null;
let firstCard = null;
let secondCard = null;
let canFlip = true;

// Card data - using emojis for card values (reduced to 6 pairs)
const cardValues = [
    '🐶', '🐱', '🐭', '🐰', '🦊', '🐻',
    '🐶', '🐱', '🐭', '🐰', '🦊', '🐻'
];

// DOM elements
const gameBoard = document.querySelector('.game-board');
const movesCount = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const resetButton = document.getElementById('reset-btn');
const congratsModal = document.getElementById('congratsModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');

// Initialize game
function initializeGame() {
    moves = 0;
    timeElapsed = 0;
    firstCard = null;
    secondCard = null;
    canFlip = true;
    movesCount.textContent = moves;
    timeValue.textContent = '00:00';
    
    // Clear existing timer
    if (timerInterval) clearInterval(timerInterval);
    
    // Hide modal if visible
    congratsModal.classList.remove('show');
    
    // Shuffle cards
    const shuffledCards = [...cardValues].sort(() => Math.random() - 0.5);
    
    // Clear game board
    gameBoard.innerHTML = '';
    
    // Create cards
    shuffledCards.forEach((value, index) => {
        const card = createCard(value, index);
        gameBoard.appendChild(card);
    });
    
    // Start timer
    startTimer();
}

// Create card element
function createCard(value, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-front">${value}</div>
        <div class="card-back">?</div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    return card;
}

// Flip card
function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card === firstCard) return;
    
    card.classList.add('flipped');
    
    if (!firstCard) {
        firstCard = card;
        return;
    }
    
    secondCard = card;
    canFlip = false;
    checkForMatch();
    moves++;
    movesCount.textContent = moves;
}

// Check for match
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    
    if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetCards();
        checkWin();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetCards();
        }, 1000);
    }
}

// Reset cards
function resetCards() {
    firstCard = null;
    secondCard = null;
    canFlip = true;
}

// Check win condition
function checkWin() {
    const matchedCards = document.querySelectorAll('.matched');
    if (matchedCards.length === cardValues.length) {
        clearInterval(timerInterval);
        showCongratulations();
    }
}

// Show congratulations modal
function showCongratulations() {
    finalMoves.textContent = `${moves} moves`;
    finalTime.textContent = timeValue.textContent;
    
    // Small delay before showing modal
    setTimeout(() => {
        congratsModal.classList.add('show');
    }, 500);
}

// Timer function
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timeValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Event Listeners
resetButton.addEventListener('click', initializeGame);
playAgainBtn.addEventListener('click', initializeGame);

// Initialize game on load
initializeGame(); 