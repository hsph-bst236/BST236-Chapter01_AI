const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

let pipes = [];
let frame = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
        pipes.push({
            x: canvas.width,
            width: 20,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - 100
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function checkCollision() {
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            gameOver = true;
        }
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', 70, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    checkCollision();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

gameLoop();