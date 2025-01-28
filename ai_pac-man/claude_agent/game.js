const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 16;
const PACMAN_SIZE = CELL_SIZE * 1.5;
const GHOST_SIZE = CELL_SIZE * 1.5;

// Game state
let score = 0;
let gameOver = false;
let pacman = {
    x: CELL_SIZE * 14,
    y: CELL_SIZE * 23,
    direction: 0,
    speed: 2,
    mouthOpen: 0
};

let ghosts = [
    { x: CELL_SIZE * 14, y: CELL_SIZE * 11, color: 'red', direction: 0, speed: 1.5 },
    { x: CELL_SIZE * 13, y: CELL_SIZE * 11, color: 'pink', direction: 0, speed: 1.5 },
    { x: CELL_SIZE * 15, y: CELL_SIZE * 11, color: 'cyan', direction: 0, speed: 1.5 },
    { x: CELL_SIZE * 14, y: CELL_SIZE * 12, color: 'orange', direction: 0, speed: 1.5 }
];

// Maze layout (0: wall, 1: dot, 2: empty, 3: power pellet)
const maze = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,3,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,3,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
    [2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2],
    [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,3,1,1,0,0,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,0,0,1,1,3,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// Game controls
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[0].length; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;

            if (maze[row][col] === 0) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            } else if (maze[row][col] === 1) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (maze[row][col] === 3) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x + PACMAN_SIZE/2, pacman.y + PACMAN_SIZE/2);
    ctx.rotate((pacman.direction * 90) * Math.PI / 180);
    
    ctx.beginPath();
    ctx.arc(0, 0, PACMAN_SIZE/2, (0.2 + pacman.mouthOpen) * Math.PI, (1.8 - pacman.mouthOpen) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    
    ctx.restore();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x + GHOST_SIZE/2, ghost.y + GHOST_SIZE/2, GHOST_SIZE/2, Math.PI, 0);
        ctx.lineTo(ghost.x + GHOST_SIZE, ghost.y + GHOST_SIZE);
        ctx.lineTo(ghost.x, ghost.y + GHOST_SIZE);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ghost.x + GHOST_SIZE/3, ghost.y + GHOST_SIZE/2, 4, 0, Math.PI * 2);
        ctx.arc(ghost.x + (GHOST_SIZE/3 * 2), ghost.y + GHOST_SIZE/2, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(ghost.x + GHOST_SIZE/3, ghost.y + GHOST_SIZE/2, 2, 0, Math.PI * 2);
        ctx.arc(ghost.x + (GHOST_SIZE/3 * 2), ghost.y + GHOST_SIZE/2, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        // Simple ghost movement - they move randomly
        if (Math.random() < 0.05) {
            ghost.direction = Math.floor(Math.random() * 4);
        }

        const nextX = ghost.x + (ghost.direction === 1 ? ghost.speed : ghost.direction === 3 ? -ghost.speed : 0);
        const nextY = ghost.y + (ghost.direction === 2 ? ghost.speed : ghost.direction === 0 ? -ghost.speed : 0);

        // Check collision with walls
        const gridX = Math.floor(nextX / CELL_SIZE);
        const gridY = Math.floor(nextY / CELL_SIZE);

        if (maze[gridY] && maze[gridY][gridX] !== 0) {
            ghost.x = nextX;
            ghost.y = nextY;
        } else {
            ghost.direction = Math.floor(Math.random() * 4);
        }

        // Wrap around the tunnel
        if (ghost.x < -GHOST_SIZE) ghost.x = canvas.width;
        if (ghost.x > canvas.width) ghost.x = -GHOST_SIZE;
    });
}

function checkCollisions() {
    // Check collision with ghosts
    ghosts.forEach(ghost => {
        const dx = (pacman.x + PACMAN_SIZE/2) - (ghost.x + GHOST_SIZE/2);
        const dy = (pacman.y + PACMAN_SIZE/2) - (ghost.y + GHOST_SIZE/2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < PACMAN_SIZE/2 + GHOST_SIZE/2) {
            gameOver = true;
        }
    });

    // Check collision with dots
    const gridX = Math.floor((pacman.x + PACMAN_SIZE/2) / CELL_SIZE);
    const gridY = Math.floor((pacman.y + PACMAN_SIZE/2) / CELL_SIZE);

    if (maze[gridY] && maze[gridY][gridX] === 1) {
        maze[gridY][gridX] = 2;
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
    } else if (maze[gridY] && maze[gridY][gridX] === 3) {
        maze[gridY][gridX] = 2;
        score += 50;
        document.getElementById('score').textContent = `Score: ${score}`;
        // TODO: Make ghosts vulnerable
    }
}

function update() {
    if (!gameOver) {
        // Update Pacman's mouth animation
        pacman.mouthOpen = Math.abs(Math.sin(Date.now() * 0.1)) * 0.3;

        // Move Pacman based on input
        let nextX = pacman.x;
        let nextY = pacman.y;

        if (keys.ArrowLeft) {
            nextX -= pacman.speed;
            pacman.direction = 2;
        }
        if (keys.ArrowRight) {
            nextX += pacman.speed;
            pacman.direction = 0;
        }
        if (keys.ArrowUp) {
            nextY -= pacman.speed;
            pacman.direction = 3;
        }
        if (keys.ArrowDown) {
            nextY += pacman.speed;
            pacman.direction = 1;
        }

        // Check collision with walls
        const gridX = Math.floor(nextX / CELL_SIZE);
        const gridY = Math.floor(nextY / CELL_SIZE);

        if (maze[gridY] && maze[gridY][gridX] !== 0) {
            pacman.x = nextX;
            pacman.y = nextY;
        }

        // Wrap around the tunnel
        if (pacman.x < -PACMAN_SIZE) pacman.x = canvas.width;
        if (pacman.x > canvas.width) pacman.x = -PACMAN_SIZE;

        moveGhosts();
        checkCollisions();
    }

    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawMaze();
    drawPacman();
    drawGhosts();

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('GAME OVER', canvas.width/2 - 100, canvas.height/2);
    }

    requestAnimationFrame(update);
}

// Start the game
update(); 