// MAIN MENU SCENE
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenuScene" });
    }

    create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

        // Title
        this.add
            .text(400, 120, "2D PLATFORMER", {
                fontSize: "48px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Subtitle
        this.add
            .text(400, 170, "100 Levels of Adventure!", {
                fontSize: "24px",
                fill: "#ffff00",
                fontFamily: "Courier New",
            })
            .setOrigin(0.5);

        // Current Level Display
        this.add
            .text(400, 210, `Current Level: ${currentLevel}`, {
                fontSize: "20px",
                fill: "#00ff00",
                fontFamily: "Courier New",
            })
            .setOrigin(0.5);

        // Play Button
        const playButton = this.add.rectangle(400, 280, 200, 60, 0x228b22);
        playButton.setInteractive({ useHandCursor: true });

        const playText = this.add
            .text(400, 280, "PLAY", {
                fontSize: "28px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Level Select Button
        const levelButton = this.add.rectangle(400, 360, 200, 60, 0x4169e1);
        levelButton.setInteractive({ useHandCursor: true });

        const levelText = this.add
            .text(400, 360, "SELECT LEVEL", {
                fontSize: "20px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Button hover effects
        playButton.on("pointerover", () => {
            playButton.setFillStyle(0x32cd32);
            playText.setScale(1.1);
        });

        playButton.on("pointerout", () => {
            playButton.setFillStyle(0x228b22);
            playText.setScale(1);
        });

        levelButton.on("pointerover", () => {
            levelButton.setFillStyle(0x6495ed);
            levelText.setScale(1.1);
        });

        levelButton.on("pointerout", () => {
            levelButton.setFillStyle(0x4169e1);
            levelText.setScale(1);
        });

        // Start game on click
        playButton.on("pointerdown", () => {
            this.scene.start("GameScene", { level: currentLevel });
        });

        // Level select
        levelButton.on("pointerdown", () => {
            this.scene.start("LevelSelectScene");
        });

        // Instructions
        this.add
            .text(400, 440, "CONTROLS:", {
                fontSize: "20px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        this.add
            .text(
                400,
                470,
                "ARROW KEYS - Move | SPACEBAR - Jump | A - Attack",
                {
                    fontSize: "14px",
                    fill: "#cccccc",
                    fontFamily: "Courier New",
                }
            )
            .setOrigin(0.5);

        // Goal
        this.add
            .text(
                400,
                520,
                "Defeat enemies, collect power-ups, and reach the golden goal!",
                {
                    fontSize: "12px",
                    fill: "#ffff00",
                    fontFamily: "Courier New",
                }
            )
            .setOrigin(0.5);
    }
}