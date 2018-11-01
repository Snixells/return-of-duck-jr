ig.module(
    'game.entities.player'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: { x: 100, y: 120 },

            type: ig.Entity.TYPE.A,

            checkAgainst: ig.Entity.TYPE.B,

            collides: ig.Entity.COLLIDES.ACTIVE,


            animSheet: new ig.AnimationSheet('media/player.png', 80, 120),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {

                this.parent();
                this.vel.y += 20;

                if (ig.input.state("left")) {
                    this.vel.x -= 100;
                }
                else if (ig.input.state("right")) {
                    this.vel.x += 100;
                }
                else {
                    this.vel.x = 0;
                }

            },

            handleMovementTrace: function (res) {
                this.parent(res);

                if (res.collision.y || res.collision.x) {
                    this.vel.y = -1000;
                }
            },

            check: function (other) {
                this.vel.y = -1000;
            },

            collideWith: function (other, axis) {
                console.log("Collision with " + other + " on " + axis + " axis")
                this.vel.y = -1000;
            },
        });

    });