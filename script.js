const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "dino.png";

const obstacleImg = new Image();
obstacleImg.src = "cactus.png";

let player = {
  x: 100,
  y: 180,
  width: 20,
  height: 20,
  vy: 0
};

let gravity = 0.8;
let groundY = 220;

let cameraX = 0;
let obstacles = [{ x: 500, y: 190 }];

let score = 0;
let highScore = 0;
let gameOver = false;

const gameOverUI = document.getElementById("gameOverUI");
const restartBtn = document.getElementById("restartBtn");

/* Resize Canvas */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.6;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* Rotate Check */
function checkOrientation() {
  const rotateMsg = document.getElementById("rotateMsg");
  if (window.innerHeight > window.innerWidth) {
    rotateMsg.style.display = "flex";
  } else {
    rotateMsg.style.display = "none";
  }
}
window.addEventListener("resize", checkOrientation);
checkOrientation();

/* Draw Ground */
function drawGround() {
  ctx.fillStyle = "#2e7d32";
  ctx.fillRect(0, groundY, canvas.width, 80);
}

/* Game Loop */
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.vy += gravity;
  player.y += player.vy;

  if (player.y > groundY - player.height) {
    player.y = groundY - player.height;
    player.vy = 0;
  }

  cameraX += 3;
  score++;

  drawGround();
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x - cameraX, obs.y, 30, 30);

    if (
      obs.x - cameraX < player.x + player.width &&
      obs.x - cameraX + 30 > player.x &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }
  });

  if (cameraX % 300 === 0) {
    obstacles.push({ x: cameraX + 800, y: 190 });
  }

  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.fillText("Score: " + score, canvas.width - 180, 25);
  ctx.fillText("High: " + highScore, canvas.width - 180, 45);
}

/* End Game */
function endGame() {
  gameOver = true;
  gameOverSound.play();

  if (score > highScore) highScore = score;

  document.getElementById("finalScore").innerText =
    "Score: " + score + " | High: " + highScore;

  gameOverUI.style.display = "flex";
}

/* Restart */
function restartGame() {
  score = 0;
  cameraX = 0;
  player.y = 180;
  obstacles = [{ x: 500, y: 190 }];
  gameOver = false;
  gameOverUI.style.display = "none";
}

restartBtn.addEventListener("click", restartGame);

/* Jump Controls */
function jump() {
  if (!gameOver && player.vy === 0) {
    player.vy = -14;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  jump();
});

setInterval(update, 30);
