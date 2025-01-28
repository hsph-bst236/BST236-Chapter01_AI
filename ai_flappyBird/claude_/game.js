const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Game variables
const bird = {
    x: 50,
    y: canvas.height / 2,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    size: 20
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 2;
let score = 0;
let gameOver = false;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.jump;
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameOver) {
        resetGame();
    } else {
        bird.velocity = bird.jump;
    }
});

// Game functions
function createPipe() {
    const gapPosition = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + pipeGap,
        scored: false
    });
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    scoreElement.textContent = `Score: ${score}`;
}

function update() {
    if (gameOver) return;

    // Update bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            continue;
        }

        // Check collision
        if (
            bird.x + bird.size > pipes[i].x &&
            bird.x < pipes[i].x + pipeWidth &&
            (bird.y < pipes[i].topHeight || bird.y + bird.size > pipes[i].bottomY)
        ) {
            gameOver = true;
        }

        // Update score
        if (!pipes[i].scored && bird.x > pipes[i].x + pipeWidth) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            pipes[i].scored = true;
        }
    }

    // Check boundaries
    if (bird.y < 0 || bird.y + bird.size > canvas.height) {
        gameOver = true;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    ctx.fillStyle = '#2ECC71';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    });

    // Draw bird
    ctx.fillStyle = '#F1C40F';
    ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press Space or Click to restart', canvas.width / 2, canvas.height / 2 + 40);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 