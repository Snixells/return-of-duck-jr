ig.module(
    'game.entities.enemy'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityEnemy = ig.Entity.extend({

            size: { x: 160, y: 100 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            enemyType: 2,

            moveSpeed: 200,


            animSheet: new ig.AnimationSheet('media/enemies.png', 180, 150),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.enemyType = Math.floor(Math.random() * 3);
                console.log(this.enemyType);

                if (this.enemyType == 0 || this.enemyType == 1) {
                    this.addAnim('default', 1, [0]);
                } else if (this.enemyType == 2) {
                    this.addAnim('left', 1, [1]);
                    this.addAnim('rigth', 1, [2]);

                    let direction = Math.floor(Math.random() * 2);
                    if (direction) {
                        this.vel.x = this.moveSpeed;
                    } else {
                        this.vel.x = -this.moveSpeed;
                    }
                }
            },

            update: function () {
                this.parent();

                if (this.enemyType == 2) {
                    if (this.pos.x < -10) {
                        this.vel.x = this.moveSpeed
                    } else if (this.pos.x > ig.system.width - 200) {
                        this.vel.x = -this.moveSpeed
                    }
                }

                if (this.vel.x > 0) {
                    this.currentAnim = this.anims.left;
                } else if (this.vel.x < 0) {
                    this.currentAnim = this.anims.rigth;
                }
            },

            check: function (other) {

                other.dead = true;
                this.kill();

            }
        });

    });