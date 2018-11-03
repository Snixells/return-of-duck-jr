ig.module(
    'game.entities.football'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityFootball = ig.Entity.extend({

            size: { x: 70, y: 120 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            animSheet: new ig.AnimationSheet('media/football.png', 70, 120),

            animMovement: -0.08,

            flying: false,

            didntHit: false, 

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                anim = this.addAnim('default', 0.05, [0]);


            },
            update: function () {

                let angle = Math.floor(this.currentAnim.angle * 10);
                if (angle == -13) {
                    this.animMovement = 0.08;
                } else if (angle == 13) {
                    this.animMovement = -0.08;
                }

                if (!this.flying) {
                    this.currentAnim.angle += this.animMovement;
                }

                if (ig.input.pressed("space")) {
                    console.log("PRESSED SPACE");
                    this.flying = true;
                    this.vel.y = -1000;
                    this.vel.x = this.currentAnim.angle * 750;
                }

                this.parent();




            },

            check: function (other) {
                console.log(other);
                // this.kill();
            },

            handleMovementTrace(res) {
                this.parent(res);

                if (res.collision.y || res.collision.x) {
                    this.didntHit = true;
                    // this.kill();
                }
            }

        });

    });