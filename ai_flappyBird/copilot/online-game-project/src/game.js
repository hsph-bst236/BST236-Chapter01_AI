// Main game logic
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 600;

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    velocity: 0,
    jump: -6,
};

let pipes = [];
let score = 0;
let gameOver = false;
let lastPipeSpawn = 0;
const pipeWidth = 50;
const pipeGap = 100;
const pipeSpeed = 2;
const gravity = 0.25;

const images = {
    bird: 'https://example.com/bird.png',
    pipe: 'https://example.com/pipe.png',
    background: 'https://example.com/background.png',
};

function updateGame() {
    if (gameOver) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    if (Date.now() - lastPipeSpawn > 1500) {
        spawnPipe();
        lastPipeSpawn = Date.now();
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });

    render();
    requestAnimationFrame(updateGame);
}

function spawnPipe() {
    const pipeHeight = Math.random() * (canvas.height - pipeGap - 20) + 20;
    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - pipeHeight - pipeGap,
    });
}

function render() {
    ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(images.bird, bird.x, bird.y, bird.width, bird.height);

    pipes.forEach(pipe => {
        ctx.drawImage(images.pipe, pipe.x, pipe.y, pipe.width, pipe.height);
    });

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
    }
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
            gameOver = false;
            lastPipeSpawn = 0;
            requestAnimationFrame(updateGame);
        } else {
            bird.velocity = bird.jump;
        }
    }
});

// Start the game
requestAnimationFrame(updateGame);