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

            bounciness: 1,


            animSheet: new ig.AnimationSheet('media/player.png', 80, 120),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

                // this.vel.y = 150;

            },
            update: function () {

                this.vel.y += 20;

                // if (ig.input.state("up")) {
                //     this.vel.y = -100;
                // }
                if (ig.input.state("down")) {
                    this.vel.y = 100;
                }
                else if (ig.input.state("left")) {
                    this.vel.x = -100;
                }
                else if (ig.input.state("right")) {
                    this.vel.x = 100;
                }
                else {
                    this.vel.x = 0;
                }


                this.parent();

                console.log(this.vel.y);

            },

            handleMovementTrace: function (res) {

                this.parent(res);


                if (res.collision.y || res.collision.x) {
                    // this.vel.y = -100;
                    // this.pos.y -= 200;

                    this.vel.y *= -1;
                    // this.vel.y = -1.5;

                    console.log(this.vel.y);
                }

                this.parent(res);
            },
        });

    });