document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas"); // Get the canvas element for drawing the game
    const ctx = canvas.getContext("2d"); // Get the 2D context for rendering

    const foodSound = new Audio("audio/sound/Level Up Sound Effect.mp3"); // Sound for when the snake eats food
    const gameOverSound = new Audio("audio/sound/Game Over sound effect.mp3"); // Sound for game over
    const powerupSound = new Audio("audio/sound/Screen_Recording_20240921_014107_YouTube_21092024.mp3"); //Sound for power up

    const gridSize = 20; // Size of each grid cell
    let snake = [{ x: 5, y: 5 }]; // Initial position of the snake
    let food = generateFood(); // Generate initial food position
    let powerUp = null; // Initialize power-up to null
    let direction = { x: 0, y: 0 }; // Initial direction of the snake
    let score = 0; // Initialize score
    let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score from local storage
    const snakeColor = localStorage.getItem('snakeColor') || '#00ff00'; //Retrive snake color from local storage
    const foodColor = localStorage.getItem('foodColor') || '#ff0000'; //Retrive food color from local storage
    const backgroundColor = localStorage.getItem('backgroundColor') || '#000000'; //Retrive background color from local storage
    const powerupColor = localStorage.getItem('powerupColor') || '#00ff99' //Retrive power up color from local storage
    let gameInterval; // Variable to store the game loop interval
    let intervalTime = 100; // Initial interval time for the game loop
    const resetButton = document.getElementById("resetButton"); // Get reset button element
    document.getElementById("highScore").textContent = highScore; // Display high score

    function startGame() {
        resetButton.style.display = "none"; // Hide reset button
        direction = { x: gridSize, y: 0 }; // Set initial direction to right
        gameInterval = setInterval(gameLoop, intervalTime); // Start the game loop
        generatePowerUp(); // Generate initial power-up
    }

    document.body.style.backgroundColor = backgroundColor;

    document.getElementById('customizationButton').addEventListener('click', function () {
        window.location.href = 'customization.html'; // Redirect to the customization page
    });

    function generateFood() {
        // Generate random food position within canvas boundaries
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        };
    }

    function generatePowerUp() {
        // Generate random power-up position within canvas boundaries
        powerUp = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        };
    }

    function gameLoop() {
        //Calculate the new head position of the snake
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Check for collision
        if (isCollision(head)) {
            clearInterval(gameInterval); // Stop the game loop
            gameOverSound.play();
            updateHighScore(); // Update high score if needed
            resetButton.style.display = "block"; // Show reset button
            return; // Exit function
        }

        // Add new head to the snake
        snake.unshift(head);

        // Check if snake eats food
        if (isNearFood(head, food, 10)) {
            powerupSound.play(); // Play sound for eating food
            score += 10; // Increase score
            document.getElementById("score").textContent = score; // Update score display
            food = generateFood(); // Generate new food
        }
        // Check if snake eats power-up
        else if (powerUp && isNearFood(head, powerUp, 10)) {
            score += 20; // Increase score for power-up
            foodSound.play();
            document.getElementById("score").textContent = score; // Update score display
            powerUp = null; // Clear power-up
            generatePowerUp(); // Generate new power-up
            intervalTime = Math.max(50, intervalTime - 20); // Speed up the game
            adjustGameSpeed(); // Adjust game loop speed
        }
        // If no food or power-up eaten, remove the tail of the snake
        else {
            snake.pop();
        }

        // Clear canvas and redraw elements
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake(); // Draw the snake
        drawFood(); // Draw the food
        drawPowerUp(); // Draw the power-up
        adjustGameSpeed(); // Adjust game speed if necessary
    }

    function isCollision(head) {
        // Check if head collides with walls or itself
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver();
            return true; // Collision with wall
        }
        return snake.some(segment => segment.x === head.x && segment.y === head.y); // Collision with itself
    }

    function drawSnake() {
        ctx.fillStyle = snakeColor; // Set snake color
        snake.forEach(segment => {
            ctx.shadowBlur = 10; // Set shadow properties
            ctx.shadowColor = "green";
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize); // Draw each segment of the snake
        });
    }

    function drawFood() {
        ctx.fillStyle = foodColor; // Set food color
        ctx.shadowBlur = 10; // Set shadow properties
        ctx.shadowColor = "red";
        ctx.fillRect(food.x, food.y, gridSize, gridSize); // Draw the food
    }

    function drawPowerUp() {
        if (powerUp) {
            ctx.fillStyle = powerupColor; // Set power-up color
            ctx.shadowBlur = 15; // Set shadow properties
            ctx.shadowColor = "blue";
            ctx.fillRect(powerUp.x, powerUp.y, gridSize, gridSize); // Draw the power-up
        }
    }

    document.addEventListener("keydown", (event) => {
        // Change direction based on arrow key presses
        switch (event.key) {
            case "ArrowUp":
                if (direction.y === 0) direction = { x: 0, y: -gridSize }; // Move up
                break;
            case "ArrowDown":
                if (direction.y === 0) direction = { x: 0, y: gridSize }; // Move down
                break;
            case "ArrowLeft":
                if (direction.x === 0) direction = { x: -gridSize, y: 0 }; // Move left
                break;
            case "ArrowRight":
                if (direction.x === 0) direction = { x: gridSize, y: 0 }; // Move right
                break;
        }
    });

    function isNearFood(head, target, range = 10) {
        // Check if the head is near the food or power-up within a certain range
        return (
            head.x >= target.x - range &&
            head.x <= target.x + gridSize + range &&
            head.y >= target.y - range &&
            head.y <= target.y + gridSize + range
        );
    }

    function updateHighScore() {
        // Update high score if current score exceeds previous high score
        if (score > highScore) {
            highScore = score; // Update high score variable
            localStorage.setItem("highScore", highScore); // Store new high score in local storage
            document.getElementById("highScore").textContent = highScore; // Update high score display
        }
    }

    function adjustGameSpeed() {
        clearInterval(gameInterval); // Clear existing game loop interval
        gameInterval = setInterval(gameLoop, intervalTime); // Set new game loop interval
    }

    resetButton.addEventListener("click", () => {
        clearInterval(gameInterval); // Clear game interval on reset
        score = 0; // Reset score
        document.getElementById("score").textContent = score; // Update score display
        snake = [{ x: 5, y: 5 }]; // Reset snake position
        direction = { x: gridSize, y: 0 }; // Reset direction
        intervalTime = 100; // Reset interval time
        startGame(); // Start a new game
    });

    function gameOver() {
        // Stop the game loop
        clearInterval(gameInterval);  // Assuming your game loop is controlled by setInterval

        // Display "You Died" message
        const context = canvas.getContext('2d');
        context.fillStyle = "red";
        context.font = "30px Arial";
        context.fillText("You Died", canvas.width / 2 - 70, canvas.height / 2);  // Centering the text

        // Show reset button
        document.getElementById('resetButton').style.display = 'block';  // Make the reset button visible
    }

    // Tutorial logic
    const tutorialSteps = [
        "Welcome to Snake! Use the arrow keys to move the snake.",
        "Eat the red food to grow longer and earn points.",
        "Avoid colliding with walls or yourself, or it's Game Over!",
        "Look out for blue power-ups! They give you extra points and temporarily speed up the game.",
        "Press the 'Start Game' button to begin playing!",
        "If the game stops, press the How To Play button",
        "If the game bugs, refresh the page"
    ];

    let currentStep = 0; // Current step in the tutorial
    const tutorialBox = document.getElementById("tutorialBox"); // Get tutorial box element
    const tutorialText = document.getElementById("tutorialText"); // Get tutorial text element
    const nextButton = document.getElementById("nextButton"); // Get next button
    const prevButton = document.getElementById("prevButton"); // Get previous button
    const skipButton = document.getElementById("skipButton"); // Get skip button
    const startButton = document.getElementById("startButton"); // Get start button

    function showTutorialStep(step) {
        tutorialText.textContent = tutorialSteps[step]; // Display current tutorial step
        prevButton.style.display = step === 0 ? "none" : "inline-block"; // Show/hide previous button
        nextButton.style.display = step === tutorialSteps.length - 1 ? "none" : "inline-block"; // Show/hide next button
        startButton.style.display = step === tutorialSteps.length - 1 ? "inline-block" : "none"; // Show/hide start button
    }

    nextButton.addEventListener("click", () => {
        if (currentStep < tutorialSteps.length - 1) {
            currentStep++; // Move to next tutorial step
            showTutorialStep(currentStep); // Display the new step
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--; // Move to previous tutorial step
            showTutorialStep(currentStep); // Display the new step
        }
    });

    skipButton.addEventListener("click", () => {
        tutorialBox.style.display = "none"; // Hide tutorial box
        startGame(); // Start the game
    });

    startButton.addEventListener("click", () => {
        tutorialBox.style.display = "none"; // Hide tutorial box
        startGame(); // Start the game
    });

    function startTutorial() {
        tutorialBox.style.display = "block"; // Show tutorial box
        showTutorialStep(currentStep); // Display the first tutorial step
    }

    document.getElementById("howToPlayButton").addEventListener("click", startTutorial); // Start tutorial on button click

    function resizeCanvas() {
        // Resize canvas based on window size
        canvas.width = window.innerWidth * 0.9; // Set width to 90% of window width
        canvas.height = window.innerHeight * 0.9; // Set height to 90% of window height
    }

    window.addEventListener("resize", resizeCanvas); // Resize canvas on window resize


    /*
    For Version 1.1:
    1. Add a login system with a google account or email
    */

    startGame(); // Start the game
});
