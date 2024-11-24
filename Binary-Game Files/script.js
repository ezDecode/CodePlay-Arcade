class BinaryGame {
    static CONFIG = {
        DIFFICULTIES: {
            easy: { timeLimit: 30, multiplier: 1 },
            medium: { timeLimit: 20, multiplier: 2 },
            hard: { timeLimit: 10, multiplier: 3 }
        },
        ANIMATION_DURATION: 300,
        MAX_BINARY_NUMBER: 255
    };

    constructor() {
        this.state = {
            score: 0,
            highScore: this.getStoredHighScore(),
            timeLeft: BinaryGame.CONFIG.DIFFICULTIES.easy.timeLimit,
            currentDecimal: 0,
            isGameActive: false,
            bits: new Array(8).fill(0),
            difficulty: "easy",
            currentAnswerCorrect: false,
            scoreMultiplier: 1
        };

        this.timer = null;
        this.initializeElements();
        this.setupEventListeners();
        this.showInitialScreen();
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
        this.state.isGameActive = true;
        this.state.score = 0;
        
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

        this.state.bits.forEach((bit, index) => {
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
                this.state.bits[index] = this.state.bits[index] ? 0 : 1;

                bitElement.className = `bit cursor-pointer text-center p-4 rounded-lg select-none transition-all duration-300 ease-in-out
                                        ${this.state.bits[index] ? "bg-primary text-white" : "bg-white text-primary border-2 border-primary"}`;

                bitElement.querySelector(".text-2xl").textContent = this.state.bits[index];
                
                bitElement.classList.add("bit-click");
                setTimeout(() => bitElement.classList.remove("bit-click"), 300);

                this.updateCurrentValue();
            };

            bitsContainer.appendChild(bitElement);
        });

        this.updateCurrentValue();
    }

    updateCurrentValue() {
        const currentValue = parseInt(this.state.bits.join(""), 2);
        const binaryValue = document.getElementById("binary-value");
        if (binaryValue) {
            binaryValue.innerHTML = `
                <div class="text-lg font-bold text-primary">Current Value: ${currentValue}</div>
                <div class="text-sm mt-2 text-secondary">Binary: ${this.state.bits.join("")}</div>
            `;
        }
    }

    generateNewNumber() {
        this.state.currentDecimal = Math.floor(Math.random() * BinaryGame.CONFIG.MAX_BINARY_NUMBER) + 1;
        const decimalElement = document.getElementById("decimal-number");
        decimalElement.style.transform = "scale(0.8)";
        decimalElement.style.opacity = "0";
        setTimeout(() => {
            decimalElement.textContent = this.state.currentDecimal;
            decimalElement.style.transform = "scale(1)";
            decimalElement.style.opacity = "1";
        }, 300);
        this.state.bits = new Array(8).fill(0);
        this.renderBits();
        this.resetTimer();
        this.state.currentAnswerCorrect = false;
    }

    checkAnswer() {
        const userBinary = parseInt(this.state.bits.join(""), 2);
        if (userBinary === this.state.currentDecimal) {
            if (!this.state.currentAnswerCorrect) {
                const points = 10 * this.state.scoreMultiplier;
                this.state.score += points;
                this.updateScore();
                this.state.currentAnswerCorrect = true;
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
            scoreElement.textContent = this.state.score;
        }
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimer();

            if (this.state.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimerEnd();
            }
        }, 1000);
    }

    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        switch (this.state.difficulty) {
            case "easy":
                this.state.timeLeft = BinaryGame.CONFIG.DIFFICULTIES.easy.timeLimit;
                break;
            case "medium":
                this.state.timeLeft = BinaryGame.CONFIG.DIFFICULTIES.medium.timeLimit;
                break;
            case "hard":
                this.state.timeLeft = BinaryGame.CONFIG.DIFFICULTIES.hard.timeLimit;
                break;
            default:
                this.state.timeLeft = BinaryGame.CONFIG.DIFFICULTIES.easy.timeLimit;
        }

        this.updateTimer();
        this.startTimer();
    }

    setDifficulty(level) {
        if (!this.state.isGameActive) return;

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

        this.state.difficulty = level;
        this.state.timeLeft = level === "easy" ? BinaryGame.CONFIG.DIFFICULTIES.easy.timeLimit : level === "medium" ? BinaryGame.CONFIG.DIFFICULTIES.medium.timeLimit : BinaryGame.CONFIG.DIFFICULTIES.hard.timeLimit;
        this.state.scoreMultiplier = level === "easy" ? 1 : level === "medium" ? 2 : 3;

        this.updateTimer();
        this.startTimer();

        this.generateNewNumber();
    }

    handleTimerEnd() {
        const userBinary = parseInt(this.state.bits.join(""), 2);
        if (userBinary === this.state.currentDecimal) {
            if (!this.state.currentAnswerCorrect) {
                const points = 10 * this.state.scoreMultiplier;
                this.state.score += points;
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
            timerElement.textContent = this.state.timeLeft;
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
        this.state.isGameActive = false;
        this.saveHighScore();
        this.showGameOver();
    }

    saveHighScore() {
        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
            localStorage.setItem('binaryGameHighScore', this.state.highScore);
            this.updateHighScore();
        }
    }

    updateHighScore() {
        document.getElementById('high-score').textContent = `${this.state.highScore}`;
    }

    showGameOver() {
        const gameOver = document.createElement("div");
        gameOver.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
        gameOver.innerHTML = `
            <div class="bg-white p-8 rounded-xl text-center max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
                <h2 class="text-3xl font-bold text-primary mb-4">Game Over!</h2>
                <p class="text-secondary mb-2">Difficulty: ${this.state.difficulty.charAt(0).toUpperCase() + this.state.difficulty.slice(1)}</p>
                <p class="text-secondary mb-2">Final Score: ${this.state.score}</p>
                <p class="text-secondary mb-6">High Score: ${this.state.highScore}</p>
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
        this.state.score = 0;
        this.state.currentAnswerCorrect = false;
        this.updateScore();
        this.startGame();
    }

    cleanup() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.removeEventListeners();
    }

    removeEventListeners() {
        this.elements.startButton.removeEventListener('click', () => this.startGame());
        this.elements.checkButton.removeEventListener('click', () => this.checkAnswer());
        this.elements.nextButton.removeEventListener('click', () => this.generateNewNumber());
        Object.entries(this.elements.difficultyButtons).forEach(([level, button]) => {
            button.removeEventListener('click', () => this.setDifficulty(level));
        });
    }
}

// Initialize game with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        const game = new BinaryGame();
        
        window.addEventListener("unload", () => {
            game.cleanup();
        });
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});