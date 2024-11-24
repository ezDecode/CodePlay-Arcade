// Constants
const GAME_CONFIG = {
  FLASH_DURATION: 250,
  LEVEL_UP_DELAY: 1000,
  POPUP_DURATION: 2000,
  POPUP_FADE_DURATION: 300,
  COLORS: ["red", "yellow", "green", "purple"]
};

// Game state
class SimonGame {
  constructor() {
    this.gameSequence = [];
    this.userSequence = [];
    this.isStarted = false;
    this.level = 0;
    this.highestScore = this.getHighestScore();
    
    // DOM elements
    this.elements = {
      heading: document.querySelector("h2"),
      subheading: document.querySelector("h3"),
      startButton: document.querySelector(".start-btn"),
      buttons: document.querySelectorAll(".btn")
    };
    
    // Bind methods to preserve 'this' context
    this.startGame = this.startGame.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    
    this.initializeGame();
  }

  initializeGame() {
    // Remove any existing listeners first
    this.cleanup();
    
    // Add new listeners
    this.elements.startButton.addEventListener("click", this.startGame);
    this.elements.buttons.forEach(btn => {
      btn.addEventListener("click", this.handleButtonPress);
    });
  }

  startGame() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.elements.startButton.style.display = 'none';
      this.gameSequence = []; // Reset game sequence
      this.level = 0; // Reset level
      this.levelUp();
    }
  }

  levelUp() {
    this.userSequence = [];
    this.level++;
    this.elements.heading.innerText = `Level ${this.level}`;
    
    const randomColor = GAME_CONFIG.COLORS[Math.floor(Math.random() * GAME_CONFIG.COLORS.length)];
    const randomButton = document.querySelector(`.${randomColor}`);
    
    this.gameSequence.push(randomColor);
    
    // Play the entire sequence
    this.playSequence();
  }

  playSequence() {
    let i = 0;
    const interval = setInterval(() => {
      const color = this.gameSequence[i];
      const button = document.querySelector(`.${color}`);
      this.animateButton(button, 'flash');
      
      i++;
      if (i >= this.gameSequence.length) {
        clearInterval(interval);
      }
    }, GAME_CONFIG.FLASH_DURATION * 2);
  }

  animateButton(button, animationType) {
    if (!button) return;
    
    button.classList.add(animationType);
    setTimeout(() => {
      button.classList.remove(animationType);
    }, GAME_CONFIG.FLASH_DURATION);
  }

  handleButtonPress(event) {
    if (!this.isStarted) return;
    
    const button = event.currentTarget;
    this.animateButton(button, 'userFlash');
    
    const userColor = button.classList[1]; // Get color class
    this.userSequence.push(userColor);
    this.checkAnswer(this.userSequence.length - 1);
  }

  checkAnswer(index) {
    if (this.userSequence[index] === this.gameSequence[index]) {
      if (this.userSequence.length === this.gameSequence.length) {
        setTimeout(() => this.levelUp(), GAME_CONFIG.LEVEL_UP_DELAY);
      }
    } else {
      this.handleGameOver();
    }
  }

  handleGameOver() {
    this.updateHighScore();
    this.showGameOverPopup();
    this.reset();
  }

  showGameOverPopup() {
    // Create popup container
    const popup = document.createElement("div");
    popup.className = "popup-container";
    
    // Create popup content with glassmorphism effect
    popup.innerHTML = `
        <div class="game-over-popup">
            <div class="popup-content">
                <h2>Game Over!</h2>
                <div class="score-container">
                    <p class="score">Score: ${this.level - 1}</p>
                    <p class="high-score">High Score: ${this.highestScore}</p>
                </div>
                <div class="button-container">
                    <button id="play-again-btn" class="play-again-btn">
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(popup);

    // Add click handler for Play Again button
    const playAgainBtn = popup.querySelector('#play-again-btn');
    playAgainBtn.addEventListener('click', () => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.remove();
            this.startGame();
        }, 300);
    });

    // Trigger entrance animation
    requestAnimationFrame(() => {
        popup.classList.add('active');
    });
  }

  updateHighScore() {
    if (this.level - 1 > this.highestScore) {
      this.highestScore = this.level - 1;
      localStorage.setItem('simonHighScore', this.highestScore);
    }
  }

  getHighestScore() {
    try {
      return parseInt(localStorage.getItem('simonHighScore')) || 0;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return 0;
    }
  }

  reset() {
    this.isStarted = false;
    this.level = 0;
    this.gameSequence = [];
    this.userSequence = [];
    
    this.elements.startButton.style.display = 'block';
    this.elements.startButton.disabled = false;
    this.elements.heading.innerHTML = "Ready to Play? Press Start!";
  }

  cleanup() {
    // Remove existing event listeners
    this.elements.startButton.removeEventListener("click", this.startGame);
    this.elements.buttons.forEach(btn => {
      btn.removeEventListener("click", this.handleButtonPress);
    });
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new SimonGame();
  
  // Cleanup on page unload
  window.addEventListener('unload', () => {
    game.cleanup();
  });
});
