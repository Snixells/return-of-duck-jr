ig.module(
    'game.entities.block'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityBlock = ig.Entity.extend({

            size: { x: 180, y: 60 },

            type: ig.Entity.TYPE.B,

            checkAgainst: ig.Entity.TYPE.A,

            collides: ig.Entity.COLLIDES.NONE,

            relatedEntity: null,

            blocktype: 0,

            moveSpeed: 200,

            animSheet: new ig.AnimationSheet('media/blocks.png', 180, 60),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.blockType = (Math.round(Math.random() * 100));
                // this.blockType = 99;
                // this.powerupType = 0;

                let blocktype = this.blockType

                switch (true) {
                    case blocktype < 87:
                        this.addAnim('default', 1, [0]);
                        this.blocktype = 0;
                        break;
                    case blocktype < 92:
                        this.addAnim('default', 1, [1]);
                        this.size.y = 10;
                        this.offset.y = 10
                        this.blocktype = 1;
                        let direction = Math.floor(Math.random() * 2);
                        if (direction) {
                            this.vel.x = this.moveSpeed;
                        } else {
                            this.vel.x = -this.moveSpeed;
                        }
                        break;
                    case blocktype < 97:
                        this.addAnim('default', 1, [2]);
                        this.addAnim('broken', 1, [3]);
                        this.blocktype = 2;
                        break;
                    case blocktype <= 100:
                        this.addAnim('default', 1, [4]);
                        this.blocktype = 3;
                        break;
                    default:
                        this.addAnim('default', 1, [0]);
                }

                this.addAnim('default', 1, [0]);

            },
            update: function () {

                if (this.blocktype == 1) {
                    if (this.pos.x < -10) {
                        this.vel.x = this.moveSpeed
                    } else if (this.pos.x > ig.system.width - 200) {
                        this.vel.x = -this.moveSpeed
                    }
                }



                this.parent();
            },

            check(other) {

                if (this.blocktype == 2) {
                    if (other.vel.y > 0) {
                        setTimeout(() => {
                            this.currentAnim = this.anims.broken;
                            setTimeout(() => {
                                this.kill()
                            }, 100)
                        }, 100)
                    }

                }

                if (this.blocktype == 3) {
                    other.vel.y = -2000;
                }


            }
        });

    });