const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');

canvas.width = 400;
canvas.height = 600;

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 24,
    gravity: 0.5,
    velocity: 0,
    jump: -8
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpawnInterval = 1500;

let score = 0;
let gameOver = false;
let lastPipeSpawn = 0;

// Load images
const backgroundImg = new Image();
backgroundImg.src = 'images/background.png';

const birdImg = new Image();
birdImg.src = 'images/bird.png';

const pipeImg = new Image();
pipeImg.src = 'images/pipe.png';

// Add background scroll position
let bgScroll = 0;

function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    let rotation = Math.min(Math.max(bird.velocity * 0.05, -0.5), 0.5);
    ctx.rotate(rotation);
    ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
    ctx.restore();
}

function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: height,
        passed: false
    });

    pipes.push({
        x: canvas.width,
        y: height + pipeGap,
        width: pipeWidth,
        height: canvas.height - height - pipeGap
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Draw top pipe (flipped)
        ctx.save();
        ctx.translate(pipe.x + pipe.width / 2, pipe.y);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, -pipe.width / 2, 0, pipe.width, pipe.height);
        ctx.restore();

        // Draw bottom pipe
        ctx.drawImage(pipeImg, pipe.x, pipe.y + pipe.height + pipeGap, pipe.width, canvas.height - (pipe.y + pipe.height + pipeGap));
    });
}

function checkCollision() {
    return pipes.some(pipe => {
        return !(bird.x + bird.width < pipe.x || 
                bird.x > pipe.x + pipe.width ||
                bird.y + bird.height < pipe.y ||
                bird.y > pipe.y + pipe.height);
    });
}

function updateGame(timestamp) {
    if (gameOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw scrolling background
    bgScroll = (bgScroll + 0.5) % canvas.width;
    ctx.drawImage(backgroundImg, -bgScroll, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, canvas.width - bgScroll, 0, canvas.width, canvas.height);

    // Update bird position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generate pipes
    if (timestamp - lastPipeSpawn > pipeSpawnInterval) {
        createPipe();
        lastPipeSpawn = timestamp;
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        // Remove off-screen pipes
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            continue;
        }

        // Score counting
        if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
            pipes[i].passed = true;
            score += 0.5; // Increment by 0.5 because we have pairs of pipes
            scoreElement.textContent = Math.floor(score);
        }
    }

    // Check collisions
    if (checkCollision() || bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameOver = true;
        return;
    }

    // Draw everything
    drawPipes();
    drawBird();

    requestAnimationFrame(updateGame);
}

// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            // Reset game
            bird.y = canvas.height / 2;
            bird.velocity = 0;
            pipes.length = 0;
            score = 0;
            scoreElement.textContent = '0';
            gameOver = false;
            lastPipeSpawn = 0;
            // Ensure requestAnimationFrame is only called once
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateGame);
            }
        } else {
            bird.velocity = bird.jump;
        }
    }
});

// Start the game
let animationFrameId = requestAnimationFrame(updateGame);
