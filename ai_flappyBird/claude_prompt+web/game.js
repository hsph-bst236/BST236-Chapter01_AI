class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        // Game state
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        
        // Bird properties
        this.bird = {
            x: 50,
            y: 300,
            velocity: 0,
            gravity: 0.5,
            jump: -8,
            size: 20
        };
        
        // Pipe properties
        this.pipes = [];
        this.pipeWidth = 50;
        this.pipeGap = 150;
        this.pipeSpawnInterval = 90;
        this.frameCount = 0;
        
        // Messages
        this.startMessage = document.getElementById('startMessage');
        this.gameOverMessage = document.getElementById('gameOverMessage');
        this.scoreDisplay = document.getElementById('score');
        
        // Event listeners
        this.bindEvents();
        
        // Start game loop
        this.update();
    }
    
    bindEvents() {
        // Handle both mouse click and spacebar
        document.addEventListener('click', () => this.handleInput());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            }
        });
        
        // Handle touch events for mobile
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });
    }
    
    handleInput() {
        if (!this.gameStarted) {
            this.startGame();
        } else if (this.gameOver) {
            this.resetGame();
        } else {
            this.bird.velocity = this.bird.jump;
        }
    }
    
    startGame() {
        this.gameStarted = true;
        this.startMessage.classList.add('hidden');
    }
    
    resetGame() {
        this.gameOver = false;
        this.gameStarted = false;
        this.score = 0;
        this.pipes = [];
        this.bird.y = 300;
        this.bird.velocity = 0;
        this.frameCount = 0;
        this.scoreDisplay.textContent = '0';
        this.gameOverMessage.classList.add('hidden');
        this.startMessage.classList.remove('hidden');
    }
    
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameStarted && !this.gameOver) {
            // Update bird
            this.bird.velocity += this.bird.gravity;
            this.bird.y += this.bird.velocity;
            
            // Spawn new pipes
            if (this.frameCount % this.pipeSpawnInterval === 0) {
                this.spawnPipe();
            }
            
            // Update pipes
            this.updatePipes();
            
            // Check collisions
            if (this.checkCollisions()) {
                this.gameOver = true;
                this.gameOverMessage.classList.remove('hidden');
            }
            
            this.frameCount++;
        }
        
        // Draw everything
        this.draw();
        
        // Continue game loop
        requestAnimationFrame(() => this.update());
    }
    
    spawnPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            height: height,
            scored: false
        });
    }
    
    updatePipes() {
        for (let pipe of this.pipes) {
            pipe.x -= 2;
            
            // Score point when passing pipe
            if (!pipe.scored && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.scored = true;
                this.score++;
                this.scoreDisplay.textContent = this.score;
            }
        }
        
        // Remove off-screen pipes
        this.pipes = this.pipes.filter(pipe => pipe.x + this.pipeWidth > 0);
    }
    
    checkCollisions() {
        // Check floor and ceiling
        if (this.bird.y < 0 || this.bird.y + this.bird.size > this.canvas.height) {
            return true;
        }
        
        // Check pipes
        for (let pipe of this.pipes) {
            if (this.bird.x + this.bird.size > pipe.x && 
                this.bird.x < pipe.x + this.pipeWidth) {
                if (this.bird.y < pipe.height || 
                    this.bird.y + this.bird.size > pipe.height + this.pipeGap) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    draw() {
        // Draw bird
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.size, this.bird.size);
        
        // Draw pipes
        this.ctx.fillStyle = '#2ecc71';
        for (let pipe of this.pipes) {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.height);
            // Bottom pipe
            this.ctx.fillRect(
                pipe.x, 
                pipe.height + this.pipeGap, 
                this.pipeWidth, 
                this.canvas.height - pipe.height - this.pipeGap
            );
        }
    }
}

// Start game when page loads
window.onload = () => new FlappyBird(); 