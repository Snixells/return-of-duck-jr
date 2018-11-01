ig.module(
    'game.entities.player'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: { x: 100, y: 120 },

            type: ig.Entity.TYPE.A,

            checkAgainst: ig.Entity.TYPE.B,

            collides: ig.Entity.COLLIDES.ACTIVE,

            startingValues: {
                speed: 300,
                jumpHeigth: 1000,
                vulnerability: 1
            },

            speedTimer: null,
            jumpTimer: null,
            vulTimer: null,

            speed: 300,
            jumpHeigth: 1000,
            vulnerability: 1,


            animSheet: new ig.AnimationSheet('media/player.png', 80, 120),

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {
                this.parent();
                this.vel.y += 20;

                if (ig.input.state("left")) {
                    this.vel.x = -this.speed;
                }
                else if (ig.input.state("right")) {
                    this.vel.x = this.speed;
                }
                else {
                    this.vel.x = 0;
                }
            },

            handleMovementTrace: function (res) {
                this.parent(res);

                if (res.collision.y || res.collision.x) {
                    this.vel.y = -this.jumpHeigth;
                }
            },

            check: function (other) {
                this.vel.y = -this.jumpHeigth;
            },

            collideWith: function (other, axis) {
                console.log("Collision with " + other + " on " + axis + " axis")
                this.vel.y = -this.jumpHeigth;
            },

            hittingPowerup: function (modifier, factor) {

                if (modifier == "speed") {
                    if (this.speedTimer) {
                        clearInterval(this.speedTimer)
                    }
                    this.speed = factor;
                    this.speedTimer = setTimeout(() => {
                        this.speed = this.startingValues.speed;
                    }, 5000);
                }
                if (modifier == "jumpHeigth") {
                    if (this.jumpTimer) {
                        clearInterval(this.jumpTimer)
                    }
                    this.jumpHeigth = factor;
                    this.jumpTimer = setTimeout(() => {
                        this.jumpHeigth = this.startingValues.jumpHeigth;
                    }, 5000);
                }

                if (modifier == "vulnerability") {
                    this.vulnerability *= factor;
                }
            },

        });

    });