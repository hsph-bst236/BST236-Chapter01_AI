import pygame
import random

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
CELL_SIZE = 40
PACMAN_SPEED = 5
GHOST_SPEED = 4

# Colors
BLACK = (0, 0, 0)
YELLOW = (255, 255, 0)
BLUE = (0, 0, 255)
WHITE = (255, 255, 255)
RED = (255, 0, 0)

# Create the screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Pac-Man")
clock = pygame.time.Clock()

# Maze layout (0: empty, 1: wall, 2: dot)
MAZE = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0],  # Tunnel
    [1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
]

class Pacman:
    def __init__(self):
        self.reset_position()
        self.score = 0
        self.lives = 3

    def reset_position(self):
        self.x = CELL_SIZE * 10
        self.y = CELL_SIZE * 13
        self.direction = [0, 0]
        self.next_direction = [0, 0]

    def move(self, maze):
        # Check if next direction is possible
        next_x = self.x + self.next_direction[0] * PACMAN_SPEED
        next_y = self.y + self.next_direction[1] * PACMAN_SPEED
        
        # Handle wraparound for next direction
        if next_x < 0:
            next_x = (len(maze[0]) - 1) * CELL_SIZE
        elif next_x >= len(maze[0]) * CELL_SIZE:
            next_x = 0
            
        # Check all corners of Pac-Man's bounding box
        corners = [
            (next_x, next_y),  # Top-left
            (next_x + CELL_SIZE - 1, next_y),  # Top-right
            (next_x, next_y + CELL_SIZE - 1),  # Bottom-left
            (next_x + CELL_SIZE - 1, next_y + CELL_SIZE - 1)  # Bottom-right
        ]
        
        can_move = True
        for corner_x, corner_y in corners:
            cell_x = int(corner_x // CELL_SIZE)
            cell_y = int(corner_y // CELL_SIZE)
            
            # Wrap cell_x for collision detection
            if cell_x < 0:
                cell_x = len(maze[0]) - 1
            elif cell_x >= len(maze[0]):
                cell_x = 0
                
            if (cell_y < 0 or cell_y >= len(maze) or maze[cell_y][cell_x] == 1):
                can_move = False
                break
        
        if can_move:
            self.direction = self.next_direction

        # Move in current direction
        next_x = self.x + self.direction[0] * PACMAN_SPEED
        next_y = self.y + self.direction[1] * PACMAN_SPEED
        
        # Handle wraparound for current movement
        if next_x < 0:
            next_x = (len(maze[0]) - 1) * CELL_SIZE
        elif next_x >= len(maze[0]) * CELL_SIZE:
            next_x = 0
            
        # Check corners again for current direction
        corners = [
            (next_x, next_y),
            (next_x + CELL_SIZE - 1, next_y),
            (next_x, next_y + CELL_SIZE - 1),
            (next_x + CELL_SIZE - 1, next_y + CELL_SIZE - 1)
        ]
        
        can_move = True
        for corner_x, corner_y in corners:
            cell_x = int(corner_x // CELL_SIZE)
            cell_y = int(corner_y // CELL_SIZE)
            
            # Wrap cell_x for collision detection
            if cell_x < 0:
                cell_x = len(maze[0]) - 1
            elif cell_x >= len(maze[0]):
                cell_x = 0
                
            if (cell_y < 0 or cell_y >= len(maze) or maze[cell_y][cell_x] == 1):
                can_move = False
                break
        
        if can_move:
            self.x = next_x
            self.y = next_y
            
            # Get center position for dot collection
            center_x = int((self.x + CELL_SIZE // 2) // CELL_SIZE)
            center_y = int((self.y + CELL_SIZE // 2) // CELL_SIZE)
            
            # Wrap center_x for dot collection
            if center_x < 0:
                center_x = len(maze[0]) - 1
            elif center_x >= len(maze[0]):
                center_x = 0
            
            # Collect dots
            if maze[center_y][center_x] == 2:
                maze[center_y][center_x] = 0
                self.score += 10

class Ghost:
    def __init__(self, x, y, color):
        self.initial_x = x
        self.initial_y = y
        self.reset_position()
        self.color = color
        self.speed = GHOST_SPEED

    def reset_position(self):
        self.x = self.initial_x
        self.y = self.initial_y
        self.direction = [1, 0]

    def move(self, maze):
        # Try to move in current direction
        next_x = self.x + self.direction[0] * self.speed
        next_y = self.y + self.direction[1] * self.speed
        
        # Handle wraparound
        if next_x < 0:
            next_x = (len(maze[0]) - 1) * CELL_SIZE
        elif next_x >= len(maze[0]) * CELL_SIZE:
            next_x = 0
            
        # Check all corners of ghost's bounding box
        corners = [
            (next_x, next_y),  # Top-left
            (next_x + CELL_SIZE - 1, next_y),  # Top-right
            (next_x, next_y + CELL_SIZE - 1),  # Bottom-left
            (next_x + CELL_SIZE - 1, next_y + CELL_SIZE - 1)  # Bottom-right
        ]
        
        can_move = True
        for corner_x, corner_y in corners:
            cell_x = int(corner_x // CELL_SIZE)
            cell_y = int(corner_y // CELL_SIZE)
            
            # Wrap cell_x for collision detection
            if cell_x < 0:
                cell_x = len(maze[0]) - 1
            elif cell_x >= len(maze[0]):
                cell_x = 0
                
            if (cell_y < 0 or cell_y >= len(maze) or maze[cell_y][cell_x] == 1):
                can_move = False
                break
        
        if can_move:
            self.x = next_x
            self.y = next_y
        else:
            # If can't move, choose a new valid direction
            possible_directions = []
            for new_dir in [[1, 0], [-1, 0], [0, 1], [0, -1]]:
                # Don't choose the opposite direction
                if new_dir[0] == -self.direction[0] and new_dir[1] == -self.direction[1]:
                    continue
                    
                # Check if the new direction is valid
                test_x = self.x + new_dir[0] * self.speed
                test_y = self.y + new_dir[1] * self.speed
                
                if test_x < 0:
                    test_x = (len(maze[0]) - 1) * CELL_SIZE
                elif test_x >= len(maze[0]) * CELL_SIZE:
                    test_x = 0
                
                corners = [
                    (test_x, test_y),
                    (test_x + CELL_SIZE - 1, test_y),
                    (test_x, test_y + CELL_SIZE - 1),
                    (test_x + CELL_SIZE - 1, test_y + CELL_SIZE - 1)
                ]
                
                direction_valid = True
                for corner_x, corner_y in corners:
                    cell_x = int(corner_x // CELL_SIZE)
                    cell_y = int(corner_y // CELL_SIZE)
                    
                    if cell_x < 0:
                        cell_x = len(maze[0]) - 1
                    elif cell_x >= len(maze[0]):
                        cell_x = 0
                        
                    if (cell_y < 0 or cell_y >= len(maze) or maze[cell_y][cell_x] == 1):
                        direction_valid = False
                        break
                
                if direction_valid:
                    possible_directions.append(new_dir)
            
            if possible_directions:
                # Choose a random valid direction
                self.direction = random.choice(possible_directions)

def reset_game(pacman, ghosts, maze):
    # Reset Pac-Man
    pacman.reset_position()
    
    # Reset ghosts
    for ghost in ghosts:
        ghost.reset_position()
    
    # Reset maze dots if all were eaten
    for y in range(len(maze)):
        for x in range(len(maze[0])):
            if maze[y][x] == 0 and not (y == 8 and (x < 4 or x > 15)):  # Don't add dots in tunnel
                maze[y][x] = 2

def draw_maze(screen, maze):
    for y in range(len(maze)):
        for x in range(len(maze[0])):
            if maze[y][x] == 1:  # Wall
                pygame.draw.rect(screen, BLUE, 
                               (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE))
            elif maze[y][x] == 2:  # Dot
                pygame.draw.circle(screen, WHITE,
                                 (x * CELL_SIZE + CELL_SIZE//2,
                                  y * CELL_SIZE + CELL_SIZE//2), 4)

def draw_game_over(screen, score):
    font = pygame.font.Font(None, 74)
    text = font.render('Game Over', True, RED)
    text_rect = text.get_rect(center=(SCREEN_WIDTH/2, SCREEN_HEIGHT/2 - 50))
    screen.blit(text, text_rect)
    
    font = pygame.font.Font(None, 36)
    score_text = font.render(f'Final Score: {score}', True, WHITE)
    score_rect = score_text.get_rect(center=(SCREEN_WIDTH/2, SCREEN_HEIGHT/2 + 20))
    screen.blit(score_text, score_rect)
    
    restart_text = font.render('Press SPACE to restart', True, WHITE)
    restart_rect = restart_text.get_rect(center=(SCREEN_WIDTH/2, SCREEN_HEIGHT/2 + 60))
    screen.blit(restart_text, restart_rect)

def draw_lives(screen, lives):
    font = pygame.font.Font(None, 36)
    lives_text = font.render(f'Lives: {lives}', True, WHITE)
    screen.blit(lives_text, (SCREEN_WIDTH - 120, 10))

def main():
    pacman = Pacman()
    ghosts = [
        Ghost(CELL_SIZE * 9, CELL_SIZE * 8, RED),
        Ghost(CELL_SIZE * 10, CELL_SIZE * 8, (255, 192, 203)),  # Pink
        Ghost(CELL_SIZE * 11, CELL_SIZE * 8, (0, 255, 255))     # Cyan
    ]
    
    game_over = False
    running = True
    
    while running:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_SPACE:
                        # Reset everything for a new game
                        pacman = Pacman()
                        ghosts = [
                            Ghost(CELL_SIZE * 9, CELL_SIZE * 8, RED),
                            Ghost(CELL_SIZE * 10, CELL_SIZE * 8, (255, 192, 203)),
                            Ghost(CELL_SIZE * 11, CELL_SIZE * 8, (0, 255, 255))
                        ]
                        reset_game(pacman, ghosts, MAZE)
                        game_over = False
                else:
                    if event.key == pygame.K_LEFT:
                        pacman.next_direction = [-1, 0]
                    elif event.key == pygame.K_RIGHT:
                        pacman.next_direction = [1, 0]
                    elif event.key == pygame.K_UP:
                        pacman.next_direction = [0, -1]
                    elif event.key == pygame.K_DOWN:
                        pacman.next_direction = [0, 1]

        if not game_over:
            # Move characters
            pacman.move(MAZE)
            for ghost in ghosts:
                ghost.move(MAZE)

            # Check for collisions with ghosts
            for ghost in ghosts:
                if (abs(pacman.x - ghost.x) < CELL_SIZE//2 and 
                    abs(pacman.y - ghost.y) < CELL_SIZE//2):
                    pacman.lives -= 1
                    if pacman.lives > 0:
                        # Reset positions but keep score
                        reset_game(pacman, ghosts, MAZE)
                    else:
                        game_over = True
                    break

        # Drawing
        screen.fill(BLACK)
        draw_maze(screen, MAZE)
        
        # Draw Pac-Man
        pygame.draw.circle(screen, YELLOW,
                         (int(pacman.x + CELL_SIZE//2),
                          int(pacman.y + CELL_SIZE//2)), CELL_SIZE//2 - 2)

        # Draw ghosts
        for ghost in ghosts:
            pygame.draw.circle(screen, ghost.color,
                             (int(ghost.x + CELL_SIZE//2),
                              int(ghost.y + CELL_SIZE//2)), CELL_SIZE//2 - 2)

        # Draw score and lives
        font = pygame.font.Font(None, 36)
        score_text = font.render(f'Score: {pacman.score}', True, WHITE)
        screen.blit(score_text, (10, 10))
        draw_lives(screen, pacman.lives)

        if game_over:
            draw_game_over(screen, pacman.score)

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()
