const cardsArray = [
  {
    name: "shell",
    img: "img/blueshell.png",
  },
  {
    name: "star",
    img: "img/star.png",
  },
  {
    name: "bobomb",
    img: "img/bobomb.png",
  },
  {
    name: "mario",
    img: "img/mario.png",
  },
  {
    name: "luigi",
    img: "img/luigi.png",
  },
  {
    name: "peach",
    img: "img/peach.png",
  },
  {
    name: "1up",
    img: "img/1up.png",
  },
  {
    name: "mushroom",
    img: "img/mushroom.png",
  },
  {
    name: "thwomp",
    img: "img/thwomp.png",
  },
  {
    name: "bulletbill",
    img: "img/bulletbill.png",
  },
  {
    name: "coin",
    img: "img/coin.png",
  },
  {
    name: "goomba",
    img: "img/goomba.png",
  },
];

const gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());

let firstGuess = "";
let secondGuess = "";
let count = 0;
let previousTarget = null;
const delay = 1200;
let score = 0;
let timeLeft = 60;
let isPaused = false;

const game = document.getElementById("game");
const grid = document.createElement("section");
const scoreboard = document.querySelector(".score");
const time = document.querySelector(".time");
const sb = document.querySelector(".scoreboard");
const start = document.querySelector(".start");
const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const playBtn = document.querySelector(".play-btn");
const closeBtn = document.querySelector(".close-btn");
const paused = document.querySelector(".paused");
const closed = document.querySelector(".closed");
const btns = document.querySelectorAll(".click");
const icons = document.querySelectorAll(".social a");
const confirmClose = document.querySelector(".yes");
const denyClose = document.querySelector(".no");

const intro = new Audio("./audio/intro.mp3");
const gamePlay = new Audio("./audio/gameplay.mp3");
const pauseMenu = new Audio("./audio/pause.mp3");
const wrong = new Audio("./audio/wrong.wav");
const pair = new Audio("./audio/pair.wav");
const clicks = new Audio("./audio/pair2.mp3");
const gameOver = new Audio("./audio/gameover.mp3");
const final = new Audio("./audio/final.wav");
const completed = new Audio("./audio/complete.mp3");

grid.setAttribute("class", "grid");
game.appendChild(grid);
intro.play();

gameGrid.forEach((item) => {
  const name = item.name;
  const img = item.img;
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.name = name;
  const front = document.createElement("div");
  front.classList.add("front");
  const back = document.createElement("div");
  back.classList.add("back");
  back.style.backgroundImage = "url(".concat(img, ")");
  grid.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
});

const match = function match() {
  pair.play();
  const selected = document.querySelectorAll(".selected");
  selected.forEach(({ classList }) => {
    classList.add("match");
  });
};

const resetGuesses = function resetGuesses() {
  firstGuess = "";
  secondGuess = "";
  count = 0;
  previousTarget = null;
  const selected = document.querySelectorAll(".selected");
  selected.forEach(({ classList }) => {
    classList.remove("selected");
  });
};

const increaseScore = function increaseScore() {
  score++;
  scoreboard.textContent = `Score: ${score}`;
  setTimeout(match, delay);
};

const timer = function timer() {
  timeLeft--;
  time.textContent = `Time Left: ${timeLeft}`;

  if (timeLeft < 0) {
    timeLeft = 0;
    gameOver.play();
    setTimeout(() => (sb.style.display = "flex"), 200);
    sb.innerHTML = `
      <h1> Game Over 😔</h1>
    	<p>You Scored: ${score}</p>
			<span onclick="location.reload()" class="click">Replay</span>
    `;
  }

  if (timeLeft === 3) {
    gamePlay.pause();
    final.play();
    final.volume(200);
  }

  if (score === 12) {
    setTimeout(() => (sb.style.display = "flex"), 200);
    completed.play();
    gamePlay.pause();
    sb.innerHTML = `
      <img src="https://www.mariowiki.com/images/1/15/MK8-Line-Mario-Trophy.gif">
    	<p>Level Complete. Well Done!🌟🎉</p>
			<span onclick="location.reload()" class="click">Replay</span>
    `;
  }
};

const pauseGame = () => {
  pauseMenu.play();
  pauseMenu.loop = true;
  gamePlay.pause();
  isPaused = true;
  paused.style.display = "flex";
};

const playGame = () => {
  pauseMenu.pause();
  gamePlay.play();
  isPaused = false;
  paused.style.display = "none";
};

const closedPause = () => {
  pauseMenu.play();
  pauseMenu.loop = true;
  gamePlay.pause();
  isPaused = true;
  closed.style.display = "flex";
};

const closedPlay = () => {
  pauseMenu.pause();
  gamePlay.play();
  isPaused = false;
  closed.style.display = "none";
};

grid.addEventListener("click", ({ target }) => {
  const clicked = target;

  if (
    clicked.nodeName === "SECTION" ||
    clicked === previousTarget ||
    clicked.parentNode.classList.contains("selected") ||
    clicked.parentNode.classList.contains("match")
  ) {
    return;
  }

  if (count < 2) {
    count++;

    if (count === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add("selected");
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add("selected");
    }

    if (firstGuess && secondGuess) {
      if (firstGuess === secondGuess) {
        increaseScore();
      }

      if (firstGuess !== secondGuess) {
        wrong.play();
      }

      setTimeout(resetGuesses, delay);
    }

    previousTarget = clicked;
  }
});

btns.forEach((btn) =>
  btn.addEventListener("click", () => {
    clicks.play();
  })
);

icons.forEach((icon) => icon.addEventListener("click", pauseGame));

pauseBtn.addEventListener("click", pauseGame);
playBtn.addEventListener("click", playGame);

closeBtn.addEventListener("click", closedPause);
confirmClose.addEventListener("click", () => window.close());
denyClose.addEventListener("click", closedPlay);

startBtn.addEventListener("click", () => {
  setInterval(() => {
    if (!isPaused) {
      timer();
    }
  }, 1000);
  start.style.display = "none";
  intro.pause();
  gamePlay.play();
});

document.addEventListener("keydown", ({ keyCode }) => {
  if (start.style.display === "none" && keyCode === 32) {
    !isPaused ? pauseGame() : playGame();
  }
});
