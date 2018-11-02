ig.module(
    'game.entities.block'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBlock = ig.Entity.extend({

            size: { x: 70, y: 40 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            relatedEntity: null, 


            animSheet: new ig.AnimationSheet('media/blackBox.png', 100, 40),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {
                this.parent();
            },
        });

    });