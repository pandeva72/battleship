class AIPlayer {
    constructor(gameboard) {
        this.gameboard = gameboard;
        this.availableMoves = [];
        this.initializeMoves();
    }

    initializeMoves() {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                this.availableMoves.push({ x, y });
            }
        }
    }

    makeRandomMove() {
        if (this.availableMoves.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * this.availableMoves.length);
        const move = this.availableMoves[randomIndex];
        this.availableMoves.splice(randomIndex, 1);
        return move;
    }

    randomlyPlaceShips(ships) {
        ships.forEach(shipLength => {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const isVertical = Math.random() < 0.5;
                const ship = new Ship(shipLength);

                if (this.gameboard.placeShip(ship, x, y, isVertical)) {
                    placed = true;
                }
            }
        });
    }
}
