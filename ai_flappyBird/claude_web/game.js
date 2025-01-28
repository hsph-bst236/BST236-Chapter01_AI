const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.5;
const FLAP_SPEED = -8;
const PIPE_SPEED = 2;
const PIPE_SPAWN_INTERVAL = 1500;
const PIPE_GAP = 150;

// Game state
let bird = {
    x: 50,
    y: canvas.height / 2,
    velocity: 0,
    width: 30,
    height: 30
};

let pipes = [];
let score = 0;
let gameOver = false;

// Event listeners
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = FLAP_SPEED;
        }
    }
});

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
}

function createPipe() {
    const gapPosition = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + PIPE_GAP,
        scored: false
    });
}

function update() {
    if (gameOver) return;

    // Update bird
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    // Check collisions with ground and ceiling
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Update pipes
    pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;

        // Check collisions with pipes
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + 50) {
            if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY) {
                gameOver = true;
            }
        }

        // Update score
        if (!pipe.scored && pipe.x + 50 < bird.x) {
            score++;
            pipe.scored = true;
        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x > -50);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';  // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = '#FFD700';  // Gold
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = '#228B22';  // Forest green
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, 50, canvas.height - pipe.bottomY);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over!', canvas.width/2 - 100, canvas.height/2);
        ctx.font = '24px Arial';
        ctx.fillText('Press Space to Restart', canvas.width/2 - 100, canvas.height/2 + 40);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start spawning pipes
setInterval(createPipe, PIPE_SPAWN_INTERVAL);

// Start game
gameLoop(); 