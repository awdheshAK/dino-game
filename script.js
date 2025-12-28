const jumpSound = new Audio("jump.mp3");
const gameOverSound = new Audio("gameover.mp3");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "dino.png";

const obstacleImg = new Image();
obstacleImg.src = "cactus.png";

let player = {
  x: 80,
  y: 0,
  width: 30,
  height: 30,
  vy: 0
};

let gravity = 0.9;
let groundY;
let cameraX = 0;
let obstacles = [];

let score = 0;
let highScore = 0;
let gameOver = false;

const gameOverUI = document.getElementById("gameOverUI");
const restartBtn = document.getElementById("restartBtn");

/* Fullscreen canvas */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  groundY = canvas.height * 0.75;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* Draw ground */
function drawGround() {
  ctx.fillStyle = "#2e7d32";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
}

/* Game loop */
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.vy += gravity;
  player.y += player.vy;

  if (player.y > groundY - player.height) {
    player.y = groundY - player.height;
    player.vy = 0;
  }

  cameraX += 4;
  score++;

  drawGround();
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x - cameraX, obs.y, 40, 40);

    if (
      obs.x - cameraX < player.x + player.width &&
      obs.x - cameraX + 40 > player.x &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }
  });

  if (cameraX % 350 === 0) {
    obstacles.push({ x: cameraX + canvas.width, y: groundY - 40 });
  }

  ctx.fillStyle = "#000";
  ctx.font = "18px monospace";
  ctx.fillText("Score: " + score, canvas.width - 150, 30);
  ctx.fillText("High: " + highScore, canvas.width - 150, 55);
}

/* End game */
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
  obstacles = [];
  player.y = 0;
  gameOver = false;
  gameOverUI.style.display = "none";
}

restartBtn.addEventListener("click", restartGame);

/* Jump */
function jump() {
  if (!gameOver && player.vy === 0) {
    player.vy = -16;
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
