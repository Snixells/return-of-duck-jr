ig.module(
    'game.entities.blockPortalActive'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBlockPortalActive = ig.Entity.extend({

            size: { x: 60, y: 180 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            animSheet: new ig.AnimationSheet('media/blockPortal.png', 60, 180),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {

                this.parent();
            },

            check(other) {

            }
        });

    });