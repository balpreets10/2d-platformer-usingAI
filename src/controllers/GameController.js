// CONTROLLER - Input and Game Logic
class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.keys = {};
    }

    setupInput(scene) {
        //this.keys = scene.input.keyboard.addKeys("SPACE,SHIFT,A,UP,LEFT,RIGHT");
        this.jumpPressed = false;

        // Jump with SPACE or UP arrow
        // this.keys.SPACE.on("down", () => {
        //     this.handleJump();
        // });
        // this.keys.SPACE.on("up", () => {
        //     this.jumpPressed = false;
        // });

        // this.keys.UP.on("down", () => {
        //     this.handleJump();
        // });
        // this.keys.UP.on("up", () => {
        //     this.jumpPressed = false;
        // });

        // // Attack
        // this.keys.A.on("down", () => {
        //     this.handleAttack();
        // });
    }
    handleJump() {
        const player = this.view.player;
        const now = Date.now();
    }

    handleAttack() {
        const now = Date.now();
        if (
            now - this.model.player.lastAttackTime >
            this.model.player.attackCooldown
        ) {
            this.model.player.lastAttackTime = now;
            this.model.player.isAttacking = true;
            this.view.performAttack();
            this.view.updatePlayerAnimation();

            // Reset attack state after animation
            setTimeout(() => {
                this.model.player.isAttacking = false;
                this.view.updatePlayerAnimation();
            }, 300);
        }
    }

    update() {
        const player = this.view.player;
        let isMoving = false;

        // Reset movement state
        this.model.player.isMoving = false;

        // Update player animation
        this.view.updatePlayerAnimation();

        // Update model position
        this.model.player.x = player.x;
        this.model.player.y = player.y;

        // Check if player fell off screen
        if (player.y > 700) {
            this.model.takeDamage();
            player.setPosition(100, 400);
        }
    }
}