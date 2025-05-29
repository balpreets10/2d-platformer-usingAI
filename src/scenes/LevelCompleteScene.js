// LEVEL COMPLETE SCENE
class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: "LevelCompleteScene" });
    }

    init(data) {
        this.levelData = data;
    }

    create() {
        // Hide the game scene completely
        this.scene.stop("GameScene");

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

        // Level Complete Text
        this.add
            .text(400, 150, `LEVEL ${this.levelData.level} COMPLETE!`, {
                fontSize: "32px",
                fill: "#ffff00",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Score display
        this.add
            .text(400, 200, `Score: ${this.levelData.score}`, {
                fontSize: "24px",
                fill: "#ffffff",
                fontFamily: "Courier New",
            })
            .setOrigin(0.5);

        // Time bonus
        this.add
            .text(400, 230, `Time Bonus: ${this.levelData.timeBonus}`, {
                fontSize: "20px",
                fill: "#00ff00",
                fontFamily: "Courier New",
            })
            .setOrigin(0.5);

        // Total score
        this.add
            .text(400, 260, `Total Score: ${this.levelData.totalScore}`, {
                fontSize: "24px",
                fill: "#ffff00",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        // Buttons
        let buttonY = 350;

        // Next Level Button (only if not on last level)
        if (this.levelData.level < MAX_LEVELS) {
            const nextButton = this.add.rectangle(
                300,
                buttonY,
                180,
                50,
                0x228b22
            );
            nextButton.setInteractive({ useHandCursor: true });

            const nextText = this.add
                .text(300, buttonY, "NEXT LEVEL", {
                    fontSize: "18px",
                    fill: "#ffffff",
                    fontFamily: "Courier New",
                    fontStyle: "bold",
                })
                .setOrigin(0.5);

            nextButton.on("pointerover", () => {
                nextButton.setFillStyle(0x32cd32);
                nextText.setScale(1.1);
            });

            nextButton.on("pointerout", () => {
                nextButton.setFillStyle(0x228b22);
                nextText.setScale(1);
            });

            nextButton.on("pointerdown", () => {
                currentLevel = this.levelData.level + 1;
                this.scene.start("GameScene", { level: currentLevel });
            });
        } else {
            // Game Complete message
            this.add
                .text(400, 320, "CONGRATULATIONS!", {
                    fontSize: "28px",
                    fill: "#ff6347",
                    fontFamily: "Courier New",
                    fontStyle: "bold",
                })
                .setOrigin(0.5);

            this.add
                .text(400, 340, "You completed all 100 levels!", {
                    fontSize: "18px",
                    fill: "#ffff00",
                    fontFamily: "Courier New",
                })
                .setOrigin(0.5);
        }

        // Main Menu Button
        const menuX = this.levelData.level < MAX_LEVELS ? 500 : 400;
        const menuButton = this.add.rectangle(
            menuX,
            buttonY,
            180,
            50,
            0x4169e1
        );
        menuButton.setInteractive({ useHandCursor: true });

        const menuText = this.add
            .text(menuX, buttonY, "MAIN MENU", {
                fontSize: "18px",
                fill: "#ffffff",
                fontFamily: "Courier New",
                fontStyle: "bold",
            })
            .setOrigin(0.5);

        menuButton.on("pointerover", () => {
            menuButton.setFillStyle(0x6495ed);
            menuText.setScale(1.1);
        });

        menuButton.on("pointerout", () => {
            menuButton.setFillStyle(0x4169e1);
            menuText.setScale(1);
        });

        menuButton.on("pointerdown", () => {
            this.scene.start("MainMenuScene");
        });
    }
}