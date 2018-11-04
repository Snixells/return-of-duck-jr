ig.module(
    'game.entities.arrow'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityArrow = ig.Entity.extend({

            size: { x: 300, y: 300 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            animSheet: new ig.AnimationSheet('media/arrow.png', 150, 300),

            animMovement: -0.08,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                anim = this.addAnim('default', 0.05, [0]);

            },
            update: function () {

                // Turning arrow animation
                let angle = Math.floor(this.currentAnim.angle * 10);
                if (angle == -13) {
                    this.animMovement = 0.08;
                } else if (angle == 13) {
                    this.animMovement = -0.08;
                }

                this.currentAnim.angle += this.animMovement;

                this.parent();


            },

        });

    });