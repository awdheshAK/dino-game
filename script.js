const jumpSound = new Audio("sounds/jump.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

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

function drawGround() {
  ctx.fillStyle = "#3a6521ff";
  ctx.fillRect(0, groundY, canvas.width, 80);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gravity
  player.vy += gravity;
  player.y += player.vy;

  if (player.y > groundY - player.height) {
    player.y = groundY - player.height;
    player.vy = 0;
  }

  // Move world
  cameraX += 3;
  score++;

  drawGround();

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Draw obstacles
  obstacles.forEach(obs => {
    ctx.drawImage(obstacleImg, obs.x - cameraX, obs.y, 30, 30);

    // Collision
    if (
      obs.x - cameraX < player.x + player.width &&
      obs.x - cameraX + 30 > player.x &&
      player.y + player.height > obs.y
    ) {
      gameOverSound.play();
      gameOver = true;

      if (score > highScore) highScore = score;

      setTimeout(() => {
        alert("GAME OVER");
        restartGame();
      }, 100);
    }
  });

  // New obstacles
  if (cameraX % 300 === 0) {
    obstacles.push({ x: cameraX + 800, y: 190 });
  }

  // Score text
  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.fillText("Score: " + score, 620, 25);
  ctx.fillText("High: " + highScore, 620, 45);
}

function restartGame() {
  score = 0;
  cameraX = 0;
  player.y = 180;
  obstacles = [{ x: 500, y: 190 }];
  gameOver = false;
}

document.addEventListener("keydown", () => {
  if (!gameOver && player.vy === 0) {
    player.vy = -14;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
});

setInterval(update, 30);
