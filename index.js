
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let food_x;
let food_y;

function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
  food_x = randomFood(0, canvas.width - 10);
  food_y = randomFood(0, canvas.height - 10);
}

createFood();

function drawSnakePart(snakePart, isHead = false) {
  const gradient = ctx.createLinearGradient(
    snakePart.x,
    snakePart.y,
    snakePart.x + 10,
    snakePart.y + 10
  );
  gradient.addColorStop(0, "darkgreen");
  gradient.addColorStop(1, "lightgreen");

  ctx.fillStyle = isHead ? "green" : gradient;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(snakePart.x + 5, snakePart.y + 5, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawSnake() {
  snake.forEach((part, index) => drawSnakePart(part, index === 0));
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "darkred";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(food_x + 5, food_y + 5, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

let dx = 10;
let dy = 0;

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    createFood();
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

document.addEventListener("keydown", changeDirection);

function checkGameOver() {
  for (let i = 4; i < snake.length; i++) {
    const has_collided =
      snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (has_collided) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall) {
    displayGameOver();
    const score = snake.length - 5;
    if (score !== 0) {
      const name = prompt("Game Over! Enter your name:");
      if (name !== null) {
        saveHighScore(score, name);
      }
    }
    return true;
  }
  return false;
}

function main() {
  if (checkGameOver()) return;
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    main();
  }, 100);
}

function clearCanvas() {
  const gridSize = 20;
  for (let y = 0; y < canvas.height; y += gridSize) {
    for (let x = 0; x < canvas.width; x += gridSize) {
      if ((x / gridSize + y / gridSize) % 2 === 0) {
        ctx.fillStyle = "lightgrey";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(x, y, gridSize, gridSize);
    }
  }
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

main();

const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

function saveHighScore(score, name) {
  console.log(score);

  const newScore = { score, name };
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayHighScores();
}

function displayHighScores() {
  highScoresList.innerHTML = highScores
    .map((score) => `<h2>${score.name} - ${score.score}</h2>`)
    .join("");
}

displayHighScores();
function displayGameOver() {
  ctx.fillStyle = "black";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}