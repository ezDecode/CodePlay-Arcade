let gameSeq = [];
let userSeq = [];
let btns = ["red", "yellow", "green", "purple"];
let started = false;
let level = 0;
const FLASH_DURATION = 250;
const LEVEL_UP_DELAY = 1000;
const POPUP_DURATION = 2000;
const POPUP_FADE_DURATION = 300;
let highestScore = getHighestScore();
let h2 = document.querySelector("h2");
let h3 = document.querySelector("h3");
let startBtn = document.querySelector(".start-btn");

startBtn.addEventListener("click", function () {
  if (!started) {
    started = true;
    startBtn.style.display = "none";
    levelUp();
  }
});

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, FLASH_DURATION);
}

function userFlash(btn) {
  btn.classList.add("userFlash");
  setTimeout(function () {
    btn.classList.remove("userFlash");
  }, FLASH_DURATION);
}

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;
  let randIdx = Math.floor(Math.random() * 4);
  let randColor = btns[randIdx];
  let randBtn = document.querySelector(`.${randColor}`);
  gameSeq.push(randColor);
  gameFlash(randBtn);
}

function getHighestScore() {
  try {
    return parseInt(localStorage.getItem("highestScore")) || 0;
  } catch (e) {
    console.warn("localStorage not available:", e);
    return 0;
  }
}

function showGameOverPopup(score, highScore) {
  const popup = document.createElement('div');
  popup.className = 'popup game-over';
  popup.innerHTML = `
    <h2>Game Over!</h2>
    <p>Your score: <b>${score}</b></p>
    <p>Highest Score: <b>${highScore}</b></p>
  `;
  document.body.appendChild(popup);
  
  return popup;
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length == gameSeq.length) {
      setTimeout(levelUp, LEVEL_UP_DELAY);
    }
  } else {
    if (level > highestScore) {
      highestScore = level;
      try {
        localStorage.setItem("highestScore", highestScore);
      } catch (e) {
        console.warn("Could not save high score:", e);
      }
    }

    const popup = showGameOverPopup(level, highestScore);
    
    const body = document.querySelector("body");
    body.style.backgroundColor = "red";
    setTimeout(() => {
      body.style.backgroundColor = "beige";
    }, 150);

    reset();
    
    startBtn.style.display = "none";

    setTimeout(() => {
      popup.style.opacity = '0';
      popup.style.transition = `opacity ${POPUP_FADE_DURATION}ms ease`;
      setTimeout(() => {
        popup?.parentNode?.removeChild(popup);
        startBtn.style.display = "block";
        startBtn.disabled = false;
        h2.innerHTML = "Ready to Play? Press Start!";
      }, POPUP_FADE_DURATION);
    }, POPUP_DURATION);
  }
}

function btnPress(e) {
  if (!started) return;
  
  const btn = e.currentTarget;
  userFlash(btn);
  const userColor = btn.getAttribute("id");
  userSeq.push(userColor);
  checkAns(userSeq.length - 1);
}

let allBtn = document.querySelectorAll(".btn");
for (btn of allBtn) {
  btn.addEventListener("click", btnPress);
}

function reset() {
  started = false;
  level = 0;
  gameSeq = [];
  userSeq = [];
  startBtn.style.display = "block";
  startBtn.disabled = false;
  h2.innerHTML = "Ready to Play? Press Start!";
}
