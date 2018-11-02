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

            animMovement: -0.05,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                // this.addAnim('default', 0.05,  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
                anim = this.addAnim('default', 0.05,  [0]);
                // this.currentAnim.pivot.y += 20;


            },
            update: function () {

                let angle = Math.floor(this.currentAnim.angle*10);
                if(angle == -10){
                    this.animMovement = 0.05;
                } else if(angle == 10){
                    this.animMovement = -0.05;
                }

                this.currentAnim.angle += this.animMovement;

                console.log(this.currentAnim.angle);


                this.parent();


            },

        });

    });