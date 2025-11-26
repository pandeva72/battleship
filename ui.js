const SHIP_LENGTHS = [5, 4, 3, 3, 2];

class UI {
    constructor() {
        this.player = new Player('human');
        this.ai = new AIPlayer(new Gameboard());
        this.playerBoardElement = document.getElementById('player-board');
        this.aiBoardElement = document.getElementById('ai-board');
        this.gameStatusElement = document.getElementById('game-status');
        this.startBtn = document.getElementById('start-btn');
        this.randomPlaceBtn = document.getElementById('random-place-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.isGameActive = false;
        this.isPlacementPhase = true;

        this.init();
    }

    init() {
        this.renderBoard(this.playerBoardElement, this.player.gameboard, false);
        this.renderBoard(this.aiBoardElement, this.ai.gameboard, true);

        this.randomPlaceBtn.addEventListener('click', () => this.randomlyPlacePlayerShips());
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }

    renderBoard(boardElement, gameboard, isEnemy) {
        boardElement.innerHTML = '';
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;

                const cellContent = gameboard.board[y][x];
                if (cellContent && !isEnemy) {
                    cell.classList.add('ship');
                }

                if (gameboard.isAlreadyAttacked(x, y)) {
                    const isHit = gameboard.successfulAttacks.some(c => c.x === x && c.y === y);
                    if (isHit) {
                        cell.classList.add('hit');
                    } else {
                        cell.classList.add('miss');
                    }
                }

                // Show sunk ships on enemy board
                if (isEnemy && cellContent && cellContent.sunk) {
                    cell.classList.add('ship', 'sunk');
                }

                if (isEnemy) {
                    cell.addEventListener('click', () => this.handlePlayerAttack(x, y));
                }

                boardElement.appendChild(cell);
            }
        }
    }

    randomlyPlacePlayerShips() {
        if (!this.isPlacementPhase) return;

        this.player.gameboard = new Gameboard(); // Reset board
        const tempAI = new AIPlayer(this.player.gameboard); // Reuse AI logic for placement
        tempAI.randomlyPlaceShips(SHIP_LENGTHS);

        this.renderBoard(this.playerBoardElement, this.player.gameboard, false);
        this.startBtn.disabled = false;
        this.gameStatusElement.textContent = "Navires placés ! Prêt à combattre.";
    }

    startGame() {
        if (!this.startBtn.disabled) {
            this.isPlacementPhase = false;
            this.isGameActive = true;
            this.startBtn.disabled = true;
            this.randomPlaceBtn.disabled = true;

            // Setup AI
            this.ai.randomlyPlaceShips(SHIP_LENGTHS);
            this.renderBoard(this.aiBoardElement, this.ai.gameboard, true);

            this.gameStatusElement.textContent = "Combattez ! Tirez sur les eaux ennemies.";
        }
    }

    handlePlayerAttack(x, y) {
        if (!this.isGameActive) return;
        if (this.ai.gameboard.isAlreadyAttacked(x, y)) return;

        const result = this.ai.gameboard.receiveAttack(x, y);
        this.renderBoard(this.aiBoardElement, this.ai.gameboard, true);

        if (this.ai.gameboard.allShipsSunk()) {
            this.endGame(true);
            return;
        }

        this.gameStatusElement.textContent = result === 'hit' ? "Touché !" : "Manqué !";

        // AI Turn
        setTimeout(() => this.aiTurn(), 500);
    }

    aiTurn() {
        if (!this.isGameActive) return;

        const move = this.ai.makeRandomMove();
        if (move) {
            const result = this.player.gameboard.receiveAttack(move.x, move.y);
            this.renderBoard(this.playerBoardElement, this.player.gameboard, false);

            if (this.player.gameboard.allShipsSunk()) {
                this.endGame(false);
            }
        }
    }

    endGame(playerWon) {
        this.isGameActive = false;
        this.gameStatusElement.textContent = playerWon ? "VICTOIRE ! Vous avez coulé la flotte ennemie !" : "DÉFAITE ! Votre flotte a été anéantie.";
    }

    resetGame() {
        location.reload();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UI();
});
