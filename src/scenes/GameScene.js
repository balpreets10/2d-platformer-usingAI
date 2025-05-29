// VIEW - Phaser Scene and Rendering
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    init(data) {
        this.currentLevel = data.level || 1;
    }

    preload() {
        this.load.spritesheet("bat", "assets/sprites/bat.png", {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 15,
        });

        this.load.spritesheet("golem", "assets/sprites/golem.png", {
            frameWidth: 40,
            frameHeight: 40,
        });

        // Load player spritesheet
        this.load.spritesheet('player', 'assets/sprites/player.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        // Create sprites programmatically using Phaser's graphics
    }

    create() {

        // Initialize animations first
        AnimationManager.createAnimations(this);

        // Initialize MVC with current level
        this.model = new GameModel(this.currentLevel);
        this.controller = new GameController(this.model, this);

        // Set up input
        // this.keys = this.input.keyboard.addKeys(
        //     "LEFT,RIGHT,UP,DOWN,SPACE,SHIFT,A"
        // );

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.controller.keys = this.keys;

        // Set background
        const theme = this.model.getBackgroundTheme();
        this.cameras.main.setBackgroundColor(theme.color);

        // Create world elements in correct order
        this.createWorld();
        this.createPlayer();
        this.createEnemies(); // Now this will have access to this.model
        this.createPowerUps();
        this.createUI();

        // Setup physics
        this.physics.world.gravity.y = 800;

        // Rest of the create method...
        this.setupCollisions();
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 2000, 600);
        this.setupEnemyAI();

        // Level intro text
        const levelIntro = this.add
            .text(400, 100, `LEVEL ${this.currentLevel}`, {
                fontSize: "32px",
                fill: "#ffff00",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5)
            .setScrollFactor(0);

        this.tweens.add({
            targets: levelIntro,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => levelIntro.destroy(),
        });
    }

    createEnemies() {
        this.enemies = this.physics.add.group();

        // Create bats
        const batCount = Math.min(Math.floor(difficulty.enemyCount / 2), 8);
        for (let i = 0; i < batCount; i++) {
            // const x = 300 + i * 250 + Math.random() * 100;
            // const y = 150 + Math.random() * 200;
            const x = 300 + i * 200;
            const y = 150 + Math.random() * 100;

            const bat = this.enemies.create(x, y, 'bat');
            bat.play('bat_fly'); // Now this should work
            bat.setCollideWorldBounds(true);
            bat.body.setAllowGravity(false);
            bat.setVelocityX(50);

        }

        // Create golems with sprite
        const golemCount = difficulty.enemyCount - batCount;
        for (let i = 0; i < golemCount; i++) {
            const x = 400 + i * 300 + Math.random() * 50;
            const y = 500;

            const golem = this.physics.add.sprite(x, y, "golem");
            golem.setBounce(0.1);
            golem.body.setGravityY(800);
            golem.body.setSize(40, 40);
            golem.enemyType = "golem";
            golem.direction = Math.random() > 0.5 ? 1 : -1;
            golem.patrolDistance = 80 + Math.random() * 40;
            golem.startX = x;
            golem.health = difficulty.enemyHealth;
            golem.isCharging = false;
            golem.speed = difficulty.enemySpeed * 0.7;
            this.enemies.add(golem);
        }
    }

    createPowerUpSprites() {
        this.load.image("speedBoost", "assets/sprites/speed.png");

        this.load.spritesheet(
            "shield-spritesheet",
            "assets/sprites/rotating_orbs.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            }
        );
    }

    createWorld() {
        this.platforms = this.physics.add.staticGroup();
        const theme = this.model.getBackgroundTheme();

        // Create ground platforms
        for (let i = 0; i < 25; i++) {
            const platform = this.add.rectangle(
                i * 80,
                550,
                80,
                32,
                theme.platformColor
            );
            this.physics.add.existing(platform, true);
            this.platforms.add(platform);
        }

        // Generate level-specific platform layout
        const difficulty = this.model.difficulty;
        const platformConfigs = this.generatePlatformLayout(
            this.currentLevel,
            difficulty
        );

        platformConfigs.forEach((config) => {
            const platform = this.add.rectangle(
                config.x,
                config.y,
                config.width,
                20,
                theme.platformColor
            );
            this.physics.add.existing(platform, true);
            this.platforms.add(platform);
        });

        // Create goal - positioned at the end of the level
        this.goal = this.add.rectangle(1850, 450, 60, 120, 0xffd700);
        this.physics.add.existing(this.goal, true);

        // Add goal glow effect
        this.tweens.add({
            targets: this.goal,
            alpha: 0.7,
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1,
        });
    }

    generatePlatformLayout(level, difficulty) {
        const platforms = [];
        const baseY = 450;
        const spacing = 150 + difficulty.platformGaps;

        // Create varied platform patterns based on level
        for (let i = 1; i <= 12; i++) {
            const x = i * spacing;
            let y = baseY;
            let width = 100;

            // Vary platform heights and sizes based on level
            if (level > 10) {
                y = baseY - (i % 3) * 50 - Math.sin(i) * 30;
            } else {
                y = baseY - (i % 2) * 60;
            }

            // Smaller platforms for higher levels
            if (level > 20) {
                width = Math.max(60, 120 - level);
            }

            // Skip some platforms for higher difficulty
            if (level > 30 && i % 4 === 0) continue;

            platforms.push({ x, y, width });
        }

        return platforms;
    }
    createPlayer() {
        this.player = this.physics.add.sprite(
            this.model.player.x,
            this.model.player.y,
            "player"
        );
        this.player.setBounce(0.2); // Add some bounce
        this.player.setCollideWorldBounds(true); // Keep player on screen
        this.player.body.setGravityY(800); // Match the config gravity
        this.player.body.setSize(32, 48);
        this.player.body.setOffset(8, 0);

        // Store current animation state
        this.player.play('player_idle_right');
        this.currentPlayerAnim = "idle_right";
    }

    // REWORKED CREATE ENEMIES FUNCTION
    createEnemies() {
        this.enemies = this.physics.add.group();
        var difficulty = this.model.difficulty;

        // Create flying enemies (Bats)
        const batCount = Math.min(Math.floor(difficulty.enemyCount / 2), 8);
        console.log(`Creating ${batCount} bats`);
        for (let i = 0; i < batCount; i++) {
            const x = 300 + i * 250 + Math.random() * 100;
            const y = 150 + Math.random() * 200;

            const bat = this.physics.add.sprite(x, y, "bat_frame_0");
            bat.play("bat_fly"); // Start animation
            bat.body.setGravityY(0);
            bat.body.setSize(24, 24);
            bat.enemyType = "bat";
            bat.startY = y;
            bat.time = Math.random() * Math.PI * 2;
            bat.health = 1;
            bat.speed = difficulty.enemySpeed;
            this.enemies.add(bat);
        }

        // Create ground enemies (Golems)
        const golemCount = difficulty.enemyCount - batCount;
        for (let i = 0; i < golemCount; i++) {
            const x = 400 + i * 300 + Math.random() * 50;
            const y = 500;

            const golem = this.physics.add.sprite(x, y, "golem");
            golem.setBounce(0.1);
            golem.body.setGravityY(800);
            golem.body.setSize(40, 40);
            golem.enemyType = "golem";
            golem.direction = Math.random() > 0.5 ? 1 : -1;
            golem.patrolDistance = 80 + Math.random() * 40;
            golem.startX = x;
            golem.health = difficulty.enemyHealth;
            golem.isCharging = false;
            golem.speed = difficulty.enemySpeed * 0.7;
            this.enemies.add(golem);
        }
    }

    // REWORKED CREATE POWER UPS FUNCTION
    createPowerUps() {
        this.powerUps = this.physics.add.group();
        const difficulty = this.model.difficulty;

        const powerUpTypes = ["speed", "shield"];

        for (let i = 0; i < difficulty.powerUpCount; i++) {
            const x = 350 + i * 400 + Math.random() * 100;
            const y = 200 + Math.random() * 150;
            const type =
                powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];

            const powerUp = this.physics.add.sprite(
                x,
                y,
                type === "speed" ? "speedBoost" : "shield"
            );
            powerUp.body.setGravityY(0);
            powerUp.body.setSize(20, 20);
            powerUp.powerUpType = type;
            this.powerUps.add(powerUp);

            // Enhanced floating animation
            this.tweens.add({
                targets: powerUp,
                y: powerUp.y - 15,
                duration: 1500,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            // Pulsing glow effect
            this.tweens.add({
                targets: powerUp,
                alpha: 0.5,
                duration: 1000,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            // Rotation
            this.tweens.add({
                targets: powerUp,
                rotation: Math.PI * 2,
                duration: 3000,
                ease: "Linear",
                repeat: -1,
            });
        }
    }

    createUI() {
        // Main game UI
        this.scoreText = this.add
            .text(16, 16, `Score: ${this.model.score}`, {
                fontSize: "20px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            })
            .setScrollFactor(0);

        this.healthText = this.add
            .text(16, 50, `Health: ${this.model.player.health}`, {
                fontSize: "20px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            })
            .setScrollFactor(0);

        this.timeText = this.add
            .text(16, 84, `Time: ${Math.ceil(this.model.getTimeRemaining())}`, {
                fontSize: "20px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            })
            .setScrollFactor(0);

        this.levelText = this.add
            .text(16, 118, `Level: ${this.currentLevel}`, {
                fontSize: "20px",
                fill: "#ffff00",
                fontFamily: "Courier New",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            })
            .setScrollFactor(0);

        this.statusText = this.add
            .text(16, 152, "", {
                fontSize: "16px",
                fill: "#00ff00",
                fontFamily: "Courier New",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            })
            .setScrollFactor(0);

        // Progress indicator
        this.progressBar = this.add.graphics().setScrollFactor(0);
        this.updateProgressBar();
    }

    updateProgressBar() {
        if (!this.progressBar) return;

        this.progressBar.clear();
        const progress = this.player.x / 1900; // Assuming goal is at x=1850
        const barWidth = 200;
        const barHeight = 8;
        const x = 16;
        const y = 190;

        // Background
        this.progressBar.fillStyle(0x333333);
        this.progressBar.fillRect(x, y, barWidth, barHeight);

        // Progress
        this.progressBar.fillStyle(0x00ff00);
        this.progressBar.fillRect(
            x,
            y,
            barWidth * Math.min(progress, 1),
            barHeight
        );

        // Border
        this.progressBar.lineStyle(2, 0xffffff);
        this.progressBar.strokeRect(x, y, barWidth, barHeight);
    }

    updatePlayerAnimation() {
        if (!this.player) return;

        let newAnim = "";

        if (this.model.player.isJumping) {
            newAnim = this.model.player.direction === 'right' ? 'player_jump_right' : 'player_jump_left';
        } else if (this.model.player.isMoving) {
            newAnim = this.model.player.direction === 'right' ? 'player_walk_right' : 'player_walk_left';
        } else {
            newAnim = this.model.player.direction === 'right' ? 'player_idle_right' : 'player_idle_left';
        }

        if (this.currentPlayerAnim !== newAnim) {
            this.currentPlayerAnim = newAnim;
            this.player.play(newAnim);
        }
    }

    setupCollisions() {
        // Player collisions
        this.physics.add.collider(this.player, this.platforms);

        this.platforms.children.iterate((child) => {
            child.body.immovable = true;
            child.body.allowGravity = false;
        });

        // Enemy collisions
        this.physics.add.collider(this.enemies, this.platforms);

        // Player-enemy collision
        this.physics.add.overlap(
            this.player,
            this.enemies,
            (player, enemy) => {
                if (this.model.takeDamage()) {
                    // Knockback
                    player.setVelocityX(-200);
                    player.setVelocityY(-300);
                }
            }
        );

        // Player-powerup collision
        this.physics.add.overlap(
            this.player,
            this.powerUps,
            (player, powerUp) => {
                this.collectPowerUp(powerUp);
            }
        );

        // Player-goal collision
        this.physics.add.overlap(this.player, this.goal, () => {
            this.completeLevel();
        });
    }

    setupEnemyAI() {
        // Bat AI - sinusoidal movement and diving
        this.time.addEvent({
            delay: 50,
            callback: () => {
                this.enemies.children.entries.forEach((enemy) => {
                    if (enemy.enemyType === "bat") {
                        enemy.time += 0.1;
                        enemy.y = enemy.startY + Math.sin(enemy.time) * 30;

                        // Flip sprite based on movement direction
                        if (enemy.x < this.player.x) {
                            enemy.setFlipX(false);
                        } else {
                            enemy.setFlipX(true);
                        }
                        const distToPlayer = Math.abs(enemy.x - this.player.x);
                        if (distToPlayer < 150 && Math.random() < 0.01) {
                            const angle = Phaser.Math.Angle.Between(
                                enemy.x,
                                enemy.y,
                                this.player.x,
                                this.player.y
                            );
                            enemy.setVelocity(
                                Math.cos(angle) * 200,
                                Math.sin(angle) * 200
                            );

                            // Return to normal movement after 1 second
                            this.time.delayedCall(1000, () => {
                                enemy.setVelocity(0, 0);
                            });
                        }
                    }
                });
            },
            loop: true,
        });

        // Golem AI - patrol and charge
        this.time.addEvent({
            delay: 100,
            callback: () => {
                this.enemies.children.entries.forEach((enemy) => {
                    if (enemy.enemyType === "golem" && !enemy.isCharging) {
                        // Patrol behavior
                        const distFromStart = Math.abs(enemy.x - enemy.startX);
                        if (distFromStart > enemy.patrolDistance) {
                            enemy.direction *= -1;
                        }
                        enemy.setVelocityX(enemy.direction * 50);

                        // Charge at player when close
                        const distToPlayer = Math.abs(enemy.x - this.player.x);
                        if (
                            distToPlayer < 200 &&
                            Math.abs(enemy.y - this.player.y) < 50
                        ) {
                            enemy.isCharging = true;
                            const chargeDirection = this.player.x > enemy.x ? 1 : -1;
                            enemy.setVelocityX(chargeDirection * 300);

                            // Stop charging after 2 seconds
                            this.time.delayedCall(2000, () => {
                                enemy.isCharging = false;
                            });
                        }
                    }
                });
            },
            loop: true,
        });
    }

    performAttack() {
        // Create temporary attack hitbox
        const attackBox = this.add.rectangle(
            this.player.x + 30,
            this.player.y,
            40,
            40,
            0xff0000,
            0.3
        );
        this.physics.add.existing(attackBox);

        // Check for enemy hits
        this.physics.add.overlap(attackBox, this.enemies, (box, enemy) => {
            enemy.health--;
            if (enemy.health <= 0) {
                // Award points based on enemy type
                const points = enemy.enemyType === "bat" ? 50 : 100;
                this.model.updateScore(points);
                enemy.destroy();
            } else {
                // Knockback
                const knockDirection = enemy.x > this.player.x ? 1 : -1;
                enemy.setVelocityX(knockDirection * 200);
                enemy.setTint(0xff0000);
                this.time.delayedCall(200, () => {
                    enemy.clearTint();
                });
            }
        });

        // Remove attack box after brief moment
        this.time.delayedCall(100, () => {
            attackBox.destroy();
        });
    }

    collectPowerUp(powerUp) {
        this.model.updateScore(100);

        if (powerUp.powerUpType === "speed") {
            this.model.applySpeedBoost();
            this.statusText.setText("Speed Boost Active!");
            this.time.delayedCall(5000, () => {
                this.statusText.setText("");
            });
        } else if (powerUp.powerUpType === "shield") {
            this.model.applyShield();
            this.statusText.setText("Shield Active!");
            this.time.delayedCall(3000, () => {
                this.statusText.setText("");
            });
        }

        powerUp.destroy();
    }

    completeLevel() {
        if (!this.model.levelCompleted) {
            this.model.levelCompleted = true;
            const timeBonus = Math.floor(this.model.getTimeRemaining() * 10);
            const totalScore = this.model.score + timeBonus;

            // Advance to next level
            if (this.currentLevel < MAX_LEVELS) {
                currentLevel = this.currentLevel + 1;
            }

            // Stop all game mechanics
            this.physics.pause();

            // Start level complete scene with data
            this.scene.start("LevelCompleteScene", {
                level: this.currentLevel,
                score: this.model.score,
                timeBonus: timeBonus,
                totalScore: totalScore,
            });
        }
    }

    update() {
        if (this.model.isGameOver) {
            const gameOverText = this.add
                .text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY - 50,
                    `Game Over!\nFinal Score: ${this.model.score}`,
                    {
                        fontSize: "24px",
                        fill: "#ff0000",
                        fontFamily: "Courier New",
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setScrollFactor(0);

            // Return to menu button
            const menuButton = this.add.rectangle(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 30,
                200,
                50,
                0x8b0000
            );
            menuButton.setInteractive({ useHandCursor: true });
            menuButton.setScrollFactor(0);

            const menuText = this.add
                .text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY + 30,
                    "MAIN MENU",
                    {
                        fontSize: "18px",
                        fill: "#ffffff",
                        fontFamily: "Courier New",
                    }
                )
                .setOrigin(0.5)
                .setScrollFactor(0);

            menuButton.on("pointerdown", () => {
                this.scene.start("MainMenuScene");
            });

            return;
        }

        //Handle player movement and jumping
        if (this.spaceKey.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }

        if (this.player && this.player.body) {
            // Left/Right movement
            if (this.cursors.left.isDown || this.leftKey.isDown) {
                this.player.setVelocityX(-160);
                this.model.player.direction = 'left';
                this.model.player.isMoving = true;
            } else if (this.cursors.right.isDown || this.rightKey.isDown) {
                this.player.setVelocityX(160);
                this.model.player.direction = 'right';
                this.model.player.isMoving = true;
            } else {
                this.player.setVelocityX(0);
                this.model.player.isMoving = false;
            }

            // Jumping (keep existing jump code)
            if ((this.spaceKey.isDown || this.cursors.up.isDown) && this.player.body.touching.down) {
                this.player.setVelocityY(-600);
                this.model.player.isJumping = true;
            }

            // Update animation based on movement
            this.updatePlayerAnimation();
        }

        // Update controller
        this.controller.update();

        // Update UI
        this.scoreText.setText(`Score: ${this.model.score}`);
        this.healthText.setText(`Health: ${this.model.player.health}`);
        this.timeText.setText(
            `Time: ${Math.ceil(this.model.getTimeRemaining())}`
        );

        // Shield visual effect
        if (this.model.player.isShielded) {
            this.player.setTint(0x00ffff);
        } else {
            this.player.clearTint();
        }

        // Check time limit
        if (
            this.model.getTimeRemaining() <= 0 &&
            !this.model.levelCompleted
        ) {
            this.model.isGameOver = true;
        }
    }
}