document.addEventListener("DOMContentLoaded", () => {
  //upon the DOM being loaded, we get all of these elements.
  const dragon = document.querySelector(".dragon");
  const ground = document.querySelector(".ground");
  const playButton = document.querySelector(".play");
  const pauseButton = document.querySelector(".pause");
  const message = document.querySelector(".messageJump");
  const messagePlay = document.querySelector(".messagePlay");
  const gameDisplay = document.querySelector(".game-container");
  const scoreDisplay = document.createElement("div");
  const countdownDisplay = document.querySelector(".countdown");

  scoreDisplay.className = "score";
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "50px";
  scoreDisplay.style.right = "10px";
  scoreDisplay.style.color = "white";
  scoreDisplay.style.fontSize = "32px";
  scoreDisplay.textContent = "Score: 0";
  gameDisplay.appendChild(scoreDisplay);

  const scoreboardBanner = document.querySelector(".scoreboardBanner");
  scoreboardBanner.style.display = "none";

  const gameoverTitle = document.querySelector(".gameoverTitle");
  gameoverTitle.style.display = "none";

  const scoreboard = document.querySelector(".scoreboard");
  scoreboard.style.display = "none";

  const currentScoreDisplay = document.getElementById("current-score");
  const bestScoreDisplay = document.getElementById("best-score");

  const obstacleTopTemplate1 = document.querySelector(".obstacle");
  const obstacleBottomTemplate1 = document.querySelector(".obstacle2");

  obstacleBottomTemplate1.style.display = "none";
  obstacleTopTemplate1.style.display = "none";

  ground.style.animationPlayState = "paused";

  const replayButton = document.querySelector(".replay");
  replayButton.style.display = "none";

  let obstaclesGenerated = false;
  let pause_state = false;

  let game_state = false; // initially we say that the game isnt running (so that its false)
  let dragonBottom = 312; // initial values; how far the dragon is from the bottom (we assign pixels to it later)
  let dragonLeft = 400;
  let score = 0;

  const jumpSFX = document.getElementById("jumpSFX");
  const bgSong = document.getElementById("bgSong");
  const titleSong = document.getElementById("titleSong");
  const dragonFallSFX = document.getElementById("dragonFallSFX");
  const countdownSFX = document.getElementById("countdownSFX");

  document.getElementById("titleSong").loop = true;
  titleSong.play();

  let moveObstacleIntervalsArr = [];
  message.style.display = "none";

  playButton.addEventListener("click", function () {
    if (!game_state && pause_state === true) {
      startCountdown(() => {

        titleSong.pause();
        document.getElementById("bgSong").loop = true;
        bgSong.play();
        pauseButton.style.display = "block";
        game_state = true; // when the user clicks play, game_state is true.
        playButton.style.display = "none"; // button is hidden
        messagePlay.style.display = "none"; // click play to begin is hidden
        message.style.display = "block"; // press spacebar to jump is revealed
        messageBlink(); // function that makes the message blink
        ground.style.animationPlayState = "running"; // the ground starts moving
        dragon.style.left -= 20; // the dragon position - 20
        dragon.style.left = dragonLeft + "px"; // subtracting 20 pixels from the left.

        
      });
    } else if (!game_state) {
      titleSong.pause();
      document.getElementById("bgSong").loop = true;
      bgSong.play();
      
      pauseButton.style.display = "block";
      game_state = true; // when the user clicks play, game_state is true.
      playButton.style.display = "none"; // button is hidden
      messagePlay.style.display = "none"; // click play to begin is hidden
      message.style.display = "block"; // press spacebar to jump is revealed
      messageBlink(); // function that makes the message blink
      ground.style.animationPlayState = "running"; // the ground starts moving
      dragon.style.left -= 20; // the dragon position - 20
      dragon.style.left = dragonLeft + "px"; // subtracting 20 pixels from the left.

     
    }
  });

  pauseButton.addEventListener("click", function () {
    if (game_state) {
      game_state = false;
      pause_state = true;
      playButton.style.display = "block";
      pauseButton.style.display = "none";
      ground.style.animationPlayState = "paused";
      clearInterval(fallInterval);

      for (let i = 0; i < moveObstacleIntervalsArr.length; i++) {
        moveObstacleIntervalsArr[i] = setInterval(moveObstacle, 10);
      }
    }
  });

  let fallInterval; // variable for the dragon falling in an interval

  function startCountdown(callback) {
    let countdown = 3;
    countdownDisplay.textContent = countdown;
    countdownDisplay.style.display = "block";

    countdownSFX.play();

    const countdownInterval = setInterval(() => {
      countdown--;
      countdownDisplay.textContent = countdown;

      if (countdown === 0) {
        clearInterval(countdownInterval);
        countdownDisplay.style.display = "none";
        callback();
      }
    }, 1000);
  }

  function controlDragon(e) {
    if (e.key == " " && game_state == true) {
      // if the user presses space bar key AND the game_state is true, call jump function

      if (!obstaclesGenerated) {
        generateObstacles();
        obstaclesGenerated = true;
      }
      jump();
    }
  }

  function jump() {
    clearInterval(fallInterval);
    if (dragonBottom <= 555) {
      // if the dragon is less than a certain height:
      message.style.display = "none"; // press spacebar to jump message is hidden
      dragon.src = "images/dragon_2.png"; // changing the image as the user jumps
      dragon.style.height = "10vh";

      dragonBottom += 70; // how far the dragon jumps
      dragon.style.bottom = dragonBottom + "px";
      setTimeout(() => {
        dragon.src = "images/default_dragon.png"; // when the user lets go of spacebar, image changes after 120 ms.
        dragon.style.height = "7vh";
      }, 120);
    }

    fallInterval = setInterval(() => {
      // after 100 milliseconds, dragon falls -15 pixels.
      if (dragonBottom > 70) {
        dragonBottom -= 15;
        dragon.style.bottom = dragonBottom + "px";
      } else {
        clearInterval(fallInterval);
      }
    }, 100);
  }

  document.addEventListener("keydown", controlDragon);

  function messageBlink() {
    setInterval(() => {
      message.style.visibility =
        message.style.visibility == "hidden" ? "" : "hidden";
    }, 500);
  }

  function generateObstacles() {
    let gap = 400;
    let minTopHeight = 20;
    let maxTopHeight = 50;
    let obstacleTopHeight =
      Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;

    let obstacleBottomHeight = 100 - obstacleTopHeight - gap / 10;

    // Select the existing images

    let obstacleBottomTemplate = obstacleBottomTemplate1;
    let obstacleTopTemplate = obstacleTopTemplate1;

    // Clone the images
    const obstacleTop = obstacleTopTemplate.cloneNode(true);
    const obstacleBottom = obstacleBottomTemplate.cloneNode(true);

    obstacleTop.style.left = "100vw";
    obstacleBottom.style.left = "100vw";

    let minInterval = 800;
    let maxInterval = 2000;
    let delay = Math.random() * (maxInterval - minInterval) + minInterval;
    setTimeout(generateObstacles, delay);

    if (game_state) {
      // Set the height and position of the obstacles
      obstacleBottom.style.display = "block";
      obstacleTop.style.display = "block";
      obstacleTop.style.height = `${obstacleTopHeight}vh`;
      obstacleTop.style.bottom = `${100 - obstacleTopHeight}vh`;
      obstacleTop.style.top = "-1vh";

      obstacleBottom.style.height = `${obstacleBottomHeight}vh`;
      obstacleBottom.style.bottom = "7vh";

      // Append the obstacles to the game container
      gameDisplay.appendChild(obstacleTop);
      gameDisplay.appendChild(obstacleBottom);

      function moveObstacle() {
        if (!game_state) {
          return;
        }

        let obstacleLeft = parseInt(
          window.getComputedStyle(obstacleTop).getPropertyValue("left")
        );
        obstacleLeft -= 5;
        obstacleTop.style.left = `${obstacleLeft}px`;
        obstacleBottom.style.left = `${obstacleLeft}px`;

        // If the obstacle has moved off the screen, remove it
        if (obstacleLeft <= -170) {
          gameDisplay.removeChild(obstacleTop);
          gameDisplay.removeChild(obstacleBottom);

          console.log("obstacleremoved!");
        }

        let dragonBox = dragon.getBoundingClientRect();
        let obstacleTopBox = obstacleTop.getBoundingClientRect();
        let obstacleBottomBox = obstacleBottom.getBoundingClientRect();

        if (
          (dragonBox.right > obstacleTopBox.left &&
            dragonBox.left < obstacleTopBox.right &&
            dragonBox.bottom > obstacleTopBox.top &&
            dragonBox.top < obstacleTopBox.bottom) ||
          (dragonBox.left < obstacleBottomBox.right &&
            dragonBox.right > obstacleBottomBox.left &&
            dragonBox.top < obstacleBottomBox.bottom &&
            dragonBox.bottom > obstacleBottomBox.top)
        ) {
          gameOver();
        } else if (
          obstacleLeft + obstacleTop.offsetWidth < dragonLeft &&
          !obstacleTop.passed
        ) {
          obstacleTop.passed = true;
          jumpSFX.play();
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
        }
      }

      let moveObstacleInterval = setInterval(moveObstacle, 10);
      moveObstacleIntervalsArr.push(moveObstacleInterval);
    }
  }

  function gameOver() {
    for (let i = 0; i < moveObstacleIntervalsArr.length; i++) {
      clearInterval(moveObstacleIntervalsArr[i]);
    }
    ground.style.animationPlayState = "paused";

    dragonFallSFX.play();
    bgSong.pause();

    game_state = false;
    clearInterval(fallInterval);
    fallInterval = setInterval(() => {
      // after 100 milliseconds, dragon falls -15 pixels.
      if (dragonBottom > 70) {
        dragonBottom -= 15;
        dragon.style.bottom = dragonBottom + "px";
       
      } else {
        clearInterval(fallInterval);
        scoreboard.style.display = "block";
        replayButton.style.display = 'block';
        scoreboardBanner.style.display = 'block';
        scoreboard.style.display = "block";
        
      }

      dragon.src = "images/dragon_over.png";
      dragon.style.height = "10vh";
      dragon.style.zIndex = "1";
    }, 40);

    document.removeEventListener("keydown", controlDragon);
    console.log("Game Over!");

    gameoverTitle.style.display = "block";
  
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (score > bestScore) {
      localStorage.setItem("bestScore", score);
    }

    currentScoreDisplay.textContent = `Current Score: ${score}`;
    bestScoreDisplay.textContent = `Best Score: ${localStorage.getItem("bestScore")}`;

    gameoverTitle.style.display = "block";

  }
  replayButton.addEventListener('click', function(){
    window.location.reload();
    
  });
}); // dont touch this!!!
