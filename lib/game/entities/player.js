ig.module(
    'game.entities.player'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: { x: 40, y: 33 },

            type: ig.Entity.TYPE.A,

            checkAgainst: ig.Entity.TYPE.B,

            collides: ig.Entity.COLLIDES.ACTIVE,



            animSheet: new ig.AnimationSheet('media/player.jpeg', 40, 33),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

                // this.vel.y = 150;

            },
            update: function () {

                if (ig.input.state("up")) {
                    this.vel.y = -100;
                }
                else if (ig.input.state("down")) {
                    this.vel.y = 100;
                }
                else if (ig.input.state("left")) {
                    this.vel.x = -100;
                }
                else if (ig.input.state("right")) {
                    this.vel.x = 100;
                }
                else {
                    this.vel.y = 0;
                    this.vel.x = 0;
                }


                this.parent();

            },

            check: function (other) {
                other.hitCounter++;
                this.kill();
            }
        });

    });