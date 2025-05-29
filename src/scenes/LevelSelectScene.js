     // LEVEL SELECT SCENE
      class LevelSelectScene extends Phaser.Scene {
        constructor() {
          super({ key: "LevelSelectScene" });
        }

        create() {
          this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);

          this.add
            .text(400, 50, "SELECT LEVEL", {
              fontSize: "32px",
              fill: "#ffffff",
              fontFamily: "Courier New",
              fontStyle: "bold",
            })
            .setOrigin(0.5);

          // Create level buttons (10 levels per row)
          const levelsPerRow = 10;
          const rows = 10;
          const buttonSize = 35;
          const spacing = 40;
          const startX = 400 - (levelsPerRow * spacing) / 2 + spacing / 2;
          const startY = 120;

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < levelsPerRow; col++) {
              const levelNum = row * levelsPerRow + col + 1;
              const x = startX + col * spacing;
              const y = startY + row * spacing;

              const button = this.add.rectangle(
                x,
                y,
                buttonSize,
                buttonSize,
                0x4169e1
              );
              button.setInteractive({ useHandCursor: true });

              const text = this.add
                .text(x, y, levelNum.toString(), {
                  fontSize: "12px",
                  fill: "#ffffff",
                  fontFamily: "Courier New",
                })
                .setOrigin(0.5);

              button.on("pointerover", () => {
                button.setFillStyle(0x6495ed);
                text.setScale(1.2);
              });

              button.on("pointerout", () => {
                button.setFillStyle(0x4169e1);
                text.setScale(1);
              });

              button.on("pointerdown", () => {
                currentLevel = levelNum;
                this.scene.start("GameScene", { level: levelNum });
              });
            }
          }

          // Back button
          const backButton = this.add.rectangle(400, 550, 150, 40, 0x8b0000);
          backButton.setInteractive({ useHandCursor: true });

          const backText = this.add
            .text(400, 550, "BACK", {
              fontSize: "18px",
              fill: "#ffffff",
              fontFamily: "Courier New",
            })
            .setOrigin(0.5);

          backButton.on("pointerdown", () => {
            this.scene.start("MainMenuScene");
          });
        }
      }