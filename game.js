class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
        this.isSunk();
    }

    isSunk() {
        if (this.hits >= this.length) {
            this.sunk = true;
        }
        return this.sunk;
    }
}

class Gameboard {
    constructor() {
        this.size = 10;
        this.board = Array(this.size).fill(null).map(() => Array(this.size).fill(null));
        this.ships = [];
        this.missedAttacks = [];
        this.successfulAttacks = []; // Track hits to avoid duplicate logic if needed
    }

    // Place a ship at (x, y) with given orientation
    // x: column (0-9), y: row (0-9)
    placeShip(ship, x, y, isVertical) {
        if (!this.isValidPlacement(ship, x, y, isVertical)) {
            return false;
        }

        if (isVertical) {
            for (let i = 0; i < ship.length; i++) {
                this.board[y + i][x] = ship;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                this.board[y][x + i] = ship;
            }
        }

        this.ships.push(ship);
        return true;
    }

    isValidPlacement(ship, x, y, isVertical) {
        // Check boundaries
        if (isVertical) {
            if (y + ship.length > this.size) return false;
        } else {
            if (x + ship.length > this.size) return false;
        }

        // Check overlap
        if (isVertical) {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[y + i][x] !== null) return false;
            }
        } else {
            for (let i = 0; i < ship.length; i++) {
                if (this.board[y][x + i] !== null) return false;
            }
        }

        return true;
    }

    receiveAttack(x, y) {
        const target = this.board[y][x];

        // Check if already attacked
        if (this.isAlreadyAttacked(x, y)) {
            return 'duplicate';
        }

        if (target === null) {
            this.missedAttacks.push({ x, y });
            return 'miss';
        } else {
            target.hit();
            this.successfulAttacks.push({ x, y });
            return 'hit';
        }
    }

    isAlreadyAttacked(x, y) {
        const isMiss = this.missedAttacks.some(coord => coord.x === x && coord.y === y);
        const isHit = this.successfulAttacks.some(coord => coord.x === x && coord.y === y);
        return isMiss || isHit;
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.sunk);
    }
}

class Player {
    constructor(type) {
        this.type = type; // 'human' or 'ai'
        this.gameboard = new Gameboard();
    }
}
