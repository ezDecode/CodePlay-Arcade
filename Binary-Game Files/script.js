class BinaryGame {
    constructor() {
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('binaryGameHighScore')) || 0;
        this.timeLeft = 30;
        this.currentDecimal = 0;
        this.isGameActive = false;
        this.timer = null;
        this.bits = new Array(8).fill(0);
        this.difficulty = "easy";
        this.currentAnswerCorrect = false;
        this.scoreMultiplier = 1;

        this.initializeElements();
        this.setupEventListeners();

        // Show game board with blur and start screen by default
        document.getElementById('game-content').classList.remove('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
    }

    initializeElements() {
        // Initialize all DOM elements
        this.elements = {
            startButton: document.getElementById('start-button'),
            startScreen: document.getElementById('start-screen'),
            gameContent: document.getElementById('game-content'),
            timer: document.getElementById('timer'),
            score: document.getElementById('score'),
            highScore: document.getElementById('high-score'),
            decimalNumber: document.getElementById('decimal-number'),
            binaryValue: document.getElementById('binary-value'),
            checkButton: document.getElementById('check-button'),
            nextButton: document.getElementById('next-button'),
            difficultyButtons: {
                easy: document.getElementById('easy-button'),
                medium: document.getElementById('medium-button'),
                hard: document.getElementById('hard-button')
            }
        };

        this.updateHighScore();
    }

    setupEventListeners() {
        this.elements.startButton.addEventListener('click', () => this.startGame());
        this.elements.checkButton.addEventListener('click', () => this.checkAnswer());
        this.elements.nextButton.addEventListener('click', () => this.generateNewNumber());

        // Setup difficulty buttons
        Object.entries(this.elements.difficultyButtons).forEach(([level, button]) => {
            button.addEventListener('click', () => this.setDifficulty(level));
        });
    }

    startGame() {
        this.isGameActive = true;
        this.score = 0;
        
        // Update start screen and game content transitions
        const gameContent = this.elements.gameContent;
        const startScreen = this.elements.startScreen;
        
        // Hide start screen with fade out
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.classList.add('hidden');
        }, 300);
        
        // Remove blur and enable game board
        gameContent.classList.remove('blur-effect');
        
        this.updateScore();
        this.setDifficulty('easy');
        this.generateNewNumber();
    }

    renderBits() {
        const bitsContainer = document.querySelector(".binary-bits");
        bitsContainer.innerHTML = "";

        this.bits.forEach((bit, index) => {
            const bitElement = document.createElement("div");
            const powerOfTwo = Math.pow(2, 7 - index);

            bitElement.className = `bit cursor-pointer text-center p-4 rounded-lg select-none transition-all duration-300 ease-in-out
                                    ${bit ? "bg-primary text-white" : "bg-white text-primary border-2 border-primary"}`;

            bitElement.innerHTML = `
                <div class="text-2xl font-bold">${bit}</div>
                <div class="text-xs mt-1">${powerOfTwo}</div>
            `;

            bitElement.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.bits[index] = this.bits[index] ? 0 : 1;

                bitElement.className = `bit cursor-pointer text-center p-4 rounded-lg select-none transition-all duration-300 ease-in-out
                                        ${this.bits[index] ? "bg-primary text-white" : "bg-white text-primary border-2 border-primary"}`;

                bitElement.querySelector(".text-2xl").textContent = this.bits[index];
                
                bitElement.classList.add("bit-click");
                setTimeout(() => bitElement.classList.remove("bit-click"), 300);

                this.updateCurrentValue();
            };

            bitsContainer.appendChild(bitElement);
        });

        this.updateCurrentValue();
    }

    updateCurrentValue() {
        const currentValue = parseInt(this.bits.join(""), 2);
        const binaryValue = document.getElementById("binary-value");
        if (binaryValue) {
            binaryValue.innerHTML = `
                <div class="text-lg font-bold text-primary">Current Value: ${currentValue}</div>
                <div class="text-sm mt-2 text-secondary">Binary: ${this.bits.join("")}</div>
            `;
        }
    }

    generateNewNumber() {
        this.currentDecimal = Math.floor(Math.random() * 255) + 1;
        const decimalElement = document.getElementById("decimal-number");
        decimalElement.style.transform = "scale(0.8)";
        decimalElement.style.opacity = "0";
        setTimeout(() => {
            decimalElement.textContent = this.currentDecimal;
            decimalElement.style.transform = "scale(1)";
            decimalElement.style.opacity = "1";
        }, 300);
        this.bits = new Array(8).fill(0);
        this.renderBits();
        this.resetTimer();
        this.currentAnswerCorrect = false;
    }

    checkAnswer() {
        const userBinary = parseInt(this.bits.join(""), 2);
        if (userBinary === this.currentDecimal) {
            if (!this.currentAnswerCorrect) {
                const points = 10 * this.scoreMultiplier;
                this.score += points;
                this.updateScore();
                this.currentAnswerCorrect = true;
            }
            this.showSuccessMessage();
            setTimeout(() => {
                this.generateNewNumber();
            }, 1000);
        } else {
            this.showErrorMessage();
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimerEnd();
            }
        }, 1000);
    }

    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        switch (this.difficulty) {
            case "easy":
                this.timeLeft = 30;
                break;
            case "medium":
                this.timeLeft = 20;
                break;
            case "hard":
                this.timeLeft = 10;
                break;
            default:
                this.timeLeft = 30;
        }

        this.updateTimer();
        this.startTimer();
    }

    setDifficulty(level) {
        if (!this.isGameActive) return;

        if (this.timer) {
            clearInterval(this.timer);
        }

        Object.entries(this.elements.difficultyButtons).forEach(([diff, button]) => {
            if (diff === level) {
                button.classList.add("ring-4", "ring-primary");
            } else {
                button.classList.remove("ring-4", "ring-primary");
            }
        });

        this.difficulty = level;
        this.timeLeft = level === "easy" ? 30 : level === "medium" ? 20 : 10;
        this.scoreMultiplier = level === "easy" ? 1 : level === "medium" ? 2 : 3;

        this.updateTimer();
        this.startTimer();

        this.generateNewNumber();
    }

    handleTimerEnd() {
        const userBinary = parseInt(this.bits.join(""), 2);
        if (userBinary === this.currentDecimal) {
            if (!this.currentAnswerCorrect) {
                const points = 10 * this.scoreMultiplier;
                this.score += points;
                this.updateScore();
            }
            this.showSuccessMessage();
            setTimeout(() => {
                this.generateNewNumber();
            }, 1000);
        } else {
            this.showErrorMessage();
            setTimeout(() => {
                this.endGame();
            }, 1000);
        }
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.timeLeft;
        }
    }

    showSuccessMessage() {
        const successMessage = document.getElementById("success-message");
        const errorMessage = document.getElementById("error-message");

        if (!successMessage || !errorMessage) return;

        errorMessage.classList.add("hidden", "scale-0");

        successMessage.classList.remove("hidden");
        successMessage.offsetHeight; // Force reflow
        successMessage.classList.remove("scale-0");

        setTimeout(() => {
            successMessage.classList.add("scale-0");
            setTimeout(() => {
                successMessage.classList.add("hidden");
            }, 300);
        }, 1000);
    }

    showErrorMessage() {
        const successMessage = document.getElementById("success-message");
        const errorMessage = document.getElementById("error-message");

        if (!successMessage || !errorMessage) return;

        successMessage.classList.add("hidden", "scale-0");

        errorMessage.classList.remove("hidden");
        errorMessage.offsetHeight; // Force reflow
        errorMessage.classList.remove("scale-0");

        setTimeout(() => {
            errorMessage.classList.add("scale-0");
            setTimeout(() => {
                errorMessage.classList.add("hidden");
            }, 300);
        }, 1000);
    }

    endGame() {
        clearInterval(this.timer);
        this.isGameActive = false;
        this.saveHighScore();
        this.showGameOver();
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('binaryGameHighScore', this.highScore);
            this.updateHighScore();
        }
    }

    updateHighScore() {
        document.getElementById('high-score').textContent = `${this.highScore}`;
    }

    showGameOver() {
        const gameOver = document.createElement("div");
        gameOver.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
        gameOver.innerHTML = `
            <div class="bg-white p-8 rounded-xl text-center max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
                <h2 class="text-3xl font-bold text-primary mb-4">Game Over!</h2>
                <p class="text-secondary mb-2">Difficulty: ${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}</p>
                <p class="text-secondary mb-2">Final Score: ${this.score}</p>
                <p class="text-secondary mb-6">High Score: ${this.highScore}</p>
                <button id="play-again-button" 
                        class="bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105">
                    Play Again
                </button>
            </div>
        `;
        document.body.appendChild(gameOver);

        document.getElementById("play-again-button").addEventListener("click", () => {
            gameOver.remove();
            this.resetGame();
        });
    }

    resetGame() {
        this.score = 0;
        this.currentAnswerCorrect = false;
        this.updateScore();
        this.startGame();
    }

    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        // Remove event listeners
        this.elements.startButton.removeEventListener('click', () => this.startGame());
        this.elements.checkButton.removeEventListener('click', () => this.checkAnswer());
        this.elements.nextButton.removeEventListener('click', () => this.generateNewNumber());
        Object.entries(this.elements.difficultyButtons).forEach(([level, button]) => {
            button.removeEventListener('click', () => this.setDifficulty(level));
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new BinaryGame();
    
    // Add cleanup on page unload
    window.addEventListener("unload", () => {
        game.cleanup();
    });
});