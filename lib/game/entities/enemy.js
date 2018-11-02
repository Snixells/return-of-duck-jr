ig.module(
    'game.entities.enemy'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityEnemy = ig.Entity.extend({

            size: { x: 120 , y: 100 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            relatedEntity: null, 


            animSheet: new ig.AnimationSheet('media/enemies.png', 180, 150),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {
                this.parent();
            },
        });

    });