ig.module(
    'game.entities.pointerFootball'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPointerFootball = ig.Entity.extend({

            size: { x: 70, y: 120 },

            animSheet: new ig.AnimationSheet('media/football.png', 70, 120),


            init: function (x, y, settings) {
                this.parent(x, y, settings);

                anim = this.addAnim('default', 1, [0]);


            },
            update: function () {


                ig.input.pressed("space")

            },

        });

    });