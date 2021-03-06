ig.module(
    'game.entities.portal'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPortal = ig.Entity.extend({

            size: { x: 130, y: 130 },

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            collidingWithPlayer: false,


            animSheet: new ig.AnimationSheet('media/portal.png', 130, 130),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {
                this.parent();
            },

            check: function () {
                this.collidingWithPlayer = true;
            }
        });

    });