const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Load images
const birdImage = new Image();
birdImage.src = 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/yellowbird-midflap.png';

const pipeTopImage = new Image();
pipeTopImage.src = 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/pipe-green.png';

const pipeBottomImage = new Image();
pipeBottomImage.src = 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/pipe-green.png';

const backgroundImage = new Image();
backgroundImage.src = 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/background-day.png';

// Game variables
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,  // Match bird sprite size
    height: 24, // Match bird sprite size
    gravity: 0.5,
    velocity: 0,
    jump: -8,
    rotation: 0
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpawnInterval = 1500;

let score = 0;
let gameOver = false;
let lastPipeSpawn = 0;

// Wait for images to load before starting the game
Promise.all([
    new Promise(resolve => birdImage.onload = resolve),
    new Promise(resolve => pipeTopImage.onload = resolve),
    new Promise(resolve => pipeBottomImage.onload = resolve),
    new Promise(resolve => backgroundImage.onload = resolve)
]).then(() => {
    gameLoop();
});

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.jump;
    }
    if (e.code === 'Space' && gameOver) {
        resetGame();
    }
});

document.addEventListener('click', () => {
    if (!gameOver) {
        bird.velocity = bird.jump;
    } else {
        resetGame();
    }
});

// Game functions
function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        height: height,
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
    const currentTime = Date.now();
    if (currentTime - lastPipeSpawn > pipeSpawnInterval) {
        createPipe();
        lastPipeSpawn = currentTime;
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            continue;
        }

        // Check for collision
        if (checkCollision(pipes[i])) {
            gameOver = true;
            return;
        }

        // Update score
        if (!pipes[i].scored && pipes[i].x + pipeWidth < bird.x) {
            pipes[i].scored = true;
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }
    }

    // Check boundaries
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver = true;
    }
}

function checkCollision(pipe) {
    // Check collision with upper pipe
    if (bird.x + bird.width > pipe.x && 
        bird.x < pipe.x + pipeWidth && 
        bird.y < pipe.height) {
        return true;
    }

    // Check collision with lower pipe
    if (bird.x + bird.width > pipe.x && 
        bird.x < pipe.x + pipeWidth && 
        bird.y + bird.height > pipe.height + pipeGap) {
        return true;
    }

    return false;
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw bird with rotation
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    bird.rotation = bird.velocity * 2;
    bird.rotation = Math.max(Math.min(bird.rotation, 90), -20);
    ctx.rotate(bird.rotation * Math.PI / 180);
    ctx.drawImage(
        birdImage,
        -bird.width / 2,
        -bird.height / 2,
        bird.width,
        bird.height
    );
    ctx.restore();

    // Draw pipes
    pipes.forEach(pipe => {
        // Top pipe (flipped)
        ctx.save();
        ctx.translate(pipe.x, pipe.height);
        ctx.scale(1, -1);
        ctx.drawImage(pipeTopImage, 0, 0, pipeWidth, pipe.height);
        ctx.restore();

        // Bottom pipe
        ctx.drawImage(
            pipeBottomImage,
            pipe.x,
            pipe.height + pipeGap,
            pipeWidth,
            canvas.height - pipe.height - pipeGap
        );
    });

    // Draw game over text
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        
        // Stroke
        ctx.strokeText('Game Over!', canvas.width / 2, canvas.height / 2);
        // Fill
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '24px Arial';
        ctx.lineWidth = 3;
        ctx.strokeText('Press Space or Click to restart', canvas.width / 2, canvas.height / 2 + 40);
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