// MODEL - Game State Management
class GameModel {
    constructor(level = 1) {
        this.currentLevel = level;
        this.player = {
            x: 100,
            y: 400,
            health: 3,
            speed: 160,
            baseSpeed: 160,
            isShielded: false,
            canDoubleJump: true,
            isSliding: false,
            lastAttackTime: 0,
            attackCooldown: 500,
            direction: "right",
            isMoving: false,
            isJumping: false,
            isAttacking: false,
        };

        this.enemies = [];
        this.powerUps = [];
        this.score = 0;
        this.gameTime = Math.max(30, 90 - level * 0.5); // Time decreases with level
        this.gameStartTime = Date.now();
        this.isGameOver = false;
        this.levelCompleted = false;
        this.difficulty = this.calculateDifficulty(level);
        this.lastOnGroundTime = 0;
        this.coyoteTimeDuration = 100; // milliseconds
    }

    calculateDifficulty(level) {
        return {
            enemyCount: Math.min(3 + Math.floor(level / 5), 15),
            enemySpeed: Math.min(50 + level * 2, 150),
            platformGaps: Math.min(level * 2, 50),
            powerUpCount: Math.max(3 - Math.floor(level / 10), 1),
            enemyHealth: Math.min(1 + Math.floor(level / 10), 3),
        };
    }

    updateScore(points) {
        this.score += points;
    }

    getTimeRemaining() {
        const elapsed = (Date.now() - this.gameStartTime) / 1000;
        return Math.max(0, this.gameTime - elapsed);
    }

    applySpeedBoost() {
        this.player.speed = this.player.baseSpeed * 1.5;
        setTimeout(() => {
            this.player.speed = this.player.baseSpeed;
        }, 5000);
    }

    applyShield() {
        this.player.isShielded = true;
        setTimeout(() => {
            this.player.isShielded = false;
        }, 8000);
    }

    takeDamage() {
        if (!this.player.isShielded) {
            this.player.health--;
            if (this.player.health <= 0) {
                this.isGameOver = true;
            }
            return true;
        }
        return false;
    }

    getBackgroundTheme() {
        const themeIndex = Math.floor((this.currentLevel - 1) / 10);
        const themes = [
            { name: "Sky", color: 0x87ceeb, platformColor: 0x228b22 },
            { name: "Desert", color: 0xf4a460, platformColor: 0xd2691e },
            { name: "Ocean", color: 0x006994, platformColor: 0x4682b4 },
            { name: "Forest", color: 0x228b22, platformColor: 0x8b4513 },
            { name: "Cave", color: 0x2f4f4f, platformColor: 0x696969 },
            { name: "Volcano", color: 0x8b0000, platformColor: 0x000000 },
            { name: "Ice", color: 0xe0ffff, platformColor: 0x4169e1 },
            { name: "Space", color: 0x191970, platformColor: 0x483d8b },
            { name: "Hell", color: 0x660000, platformColor: 0x8b0000 },
            { name: "Heaven", color: 0xf0f8ff, platformColor: 0xffd700 },
        ];
        return themes[Math.min(themeIndex, themes.length - 1)];
    }
}