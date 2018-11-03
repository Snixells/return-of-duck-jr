ig.module(
    'game.entities.fieldgoalBlocker'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityFieldgoalBlocker = ig.Entity.extend({

            size: { x: 150, y: 100 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            animSheet: new ig.AnimationSheet('media/blackBox.png', 150, 100),

            init: function (x, y, settings) {
                this.parent(x, y, settings);


                anim = this.addAnim('default', 1, [0]);



            },
            update: function () {


                this.parent();


            },

        });

    });