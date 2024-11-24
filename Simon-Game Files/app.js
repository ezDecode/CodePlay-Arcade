let gameSeq = [];
let userSeq = [];
let btns = ["red", "yellow", "green", "purple"];
let started = false;
let level = 0;
let highestScore = localStorage.getItem("highestScore") || 0;
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
  }, 250);
}

function userFlash(btn) {
  btn.classList.add("userFlash");
  setTimeout(function () {
    btn.classList.remove("userFlash");
  }, 250);
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

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length == gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    if (level > highestScore) {
      highestScore = level;
      localStorage.setItem("highestScore", highestScore);
    }

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
      <h2>Game Over!</h2>
      <p>Your score: <b>${level}</b></p>
      <p>Highest Score: <b>${highestScore}</b></p>
    `;
    document.body.appendChild(popup);

    document.querySelector("body").style.backgroundColor = "red";
    setTimeout(function () {
      document.querySelector("body").style.backgroundColor = "beige";
    }, 150);

    reset();
    
    startBtn.style.display = "none";

    setTimeout(function () {
      popup.style.opacity = '0';
      popup.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
        startBtn.style.display = "block";
        startBtn.disabled = false;
        h2.innerHTML = "Ready to Play? Press Start!";
      }, 300);
    }, 2000);
  }
}

function btnPress() {
  let btn = this;
  userFlash(btn);
  let userColor = btn.getAttribute("id");
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
