class AnimationManager {
    static createAnimations(scene) {

        // Player animations
        scene.anims.create({
            key: 'player_idle_right',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'player_idle_left',
            frames: scene.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'player_walk_right',
            frames: scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'player_walk_left',
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'player_jump_right',
            frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        scene.anims.create({
            key: 'player_jump_left',
            frames: scene.anims.generateFrameNumbers('player', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: 0
        });


        // Bat animations
        scene.anims.create({
            key: 'bat_fly',
            frames: scene.anims.generateFrameNumbers('bat', {
                start: 0,
                end: 3,
                first: 0
            }),
            frameRate: 4,
            repeat: -1
        });

        // Shield animations
        scene.anims.create({
            key: 'shield',
            frames: scene.anims.generateFrameNumbers('shield', {
                start: 21,
                end: 24,
                first: 0
            }),
            frameRate: 16,
            repeat: -1
        });

        // Add other animations here...
    }
}