ig.module(
    'game.entities.powerup'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPowerup = ig.Entity.extend({

            size: { x: 80, y: 80 },

            // type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            powerupType: 0,

            animSheet: new ig.AnimationSheet('media/powerups.png', 100, 100),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.powerupType = (Math.round(Math.random() * 4));
                // this.powerupType = 0;


                switch (this.powerupType) {
                    case 0:
                        this.addAnim('default', 1, [0]);
                        break;
                    case 1:
                        this.addAnim('default', 1, [1]);
                        break;
                    case 2:
                        this.addAnim('default', 1, [2]);
                        break;
                    case 3:
                        this.addAnim('default', 1, [3]);
                        break;
                    case 4:
                        this.addAnim('default', 1, [4]);
                        break;
                    default:
                        this.addAnim('default', 1, [0]);
                }

            },
            update: function () {
                this.parent();
            },

            check: function (other) {

                if (this.powerupType == 0) {
                    other.hittingPowerup("jumpHeigth", 700)
                    this.kill();
                }
                if (this.powerupType == 1) {
                    other.hittingPowerup("jumpHeigth", 1300)
                    this.kill();
                }
                if (this.powerupType == 2) {
                    other.hittingPowerup("speed", 150)
                    this.kill();
                }
                if (this.powerupType == 3) {
                    other.hittingPowerup("speed", 600)
                    this.kill();
                }
                if (this.powerupType == 4) {
                    other.hittingPowerup("vulnerability", 1)
                    this.kill();
                }
            }
        });

    });