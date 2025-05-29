class AnimationManager {
    static createAnimations(scene) {

        const createSafeAnim = (key, config) => {
            if (!scene.anims.exists(key)) {
                scene.anims.create({
                    key: key,
                    ...config
                });
            }
        };
        // Player animations
        createSafeAnim('player_idle_right', {
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        createSafeAnim('player_idle_left', {
            frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        createSafeAnim('player_walk_right', {
            frames: scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        createSafeAnim('player_walk_left', {
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        createSafeAnim('player_jump_right', {
            frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        createSafeAnim('player_jump_left', {
            frames: scene.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: 0
        });


        // Bat animations
        createSafeAnim('bat_fly', {
            frames: scene.anims.generateFrameNumbers('bat', {
                start: 0,
                end: 3,
                first: 0
            }),
            frameRate: 8,
            repeat: -1,
            yoyo: false
        });

        // Shield animations
        createSafeAnim('shield_rotate', {
            frames: scene.anims.generateFrameNumbers('shield', {
                start: 21,
                end: 24,
                first: 0
            }),
            frameRate: 16,
            repeat: -1,
            yoyo: false
        });

        // Speed boost powerup animation
        createSafeAnim('speed_pulse', {
            frames: scene.anims.generateFrameNumbers('speedBoost', {
                start: 0,
                end: 0
            }),
            frameRate: 8,
            repeat: -1,
            yoyo: true
        });

        // Add other animations here...
    }
}