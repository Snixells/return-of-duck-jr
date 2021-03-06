ig.module(
    'game.entities.player'
)
    .requires(
        'impact.entity'
    )
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size: { x: 80, y: 120 },

            type: ig.Entity.TYPE.A,

            checkAgainst: ig.Entity.TYPE.B,

            collides: ig.Entity.COLLIDES.ACTIVE,

            startingValues: {
                speed: 500,
                jumpHeigth: 1000,
                vulnerability: 1
            },

            speedTimer: null,
            jumpTimer: null,
            vulTimer: null,

            speed: 500,
            jumpHeigth: 1000,
            vulnerability: 1,

            portal: false,

            dead: false,

            noPortalSize: {
                x: 80,
                y: 120
            },

            animSheet: new ig.AnimationSheet('media/duckJr.png', 80, 120),

            jump: new ig.Sound('media/sounds/jumpingSound.mp3'),
            boostJump: new ig.Sound('media/sounds/boostJump.mp3'),
            pop: new ig.Sound('media/sounds/pop.mp3'),

            nextSound: true,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('default', 1, [0]);

            },
            update: function () {
                this.parent();

                if (!this.portal) {

                    this.currentAnim.angle = 0;
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
                }

                if (this.portal) {


                    this.currentAnim.angle = 1.5;

                    this.vel.x -= 20;

                    if (ig.input.state("left")) {
                        this.vel.y = -this.speed * 1.3;
                    }
                    else if (ig.input.state("right")) {
                        this.vel.y = this.speed * 1.3;
                    }
                    else {
                        if (this.vel.y < 100 && this.vel.y > -100) {
                            this.vel.y = 0;
                        }
                        else if (this.vel.y > 0) {
                            this.vel.y -= 10;
                        } else if (this.vel.y < 0) {
                            this.vel.y += 10;
                        } else {
                            this.vel.y = 0;
                        }
                    }
                }

                if (!this.portal) {
                    if (this.pos.x < -100) {
                        this.pos.x = ig.system.width;
                    } else if (this.pos.x > ig.system.width) {
                        this.pos.x = -100;
                    }
                }

            },

            handleMovementTrace: function (res) {
                this.parent(res);

                if (!this.portal) {
                    if (res.collision.y || res.collision.x) {
                        this.vel.y = -this.jumpHeigth;
                    }
                }

                if (this.portal) {
                    if (res.collision.y || res.collision.x) {
                        console.log("COLLISION")
                        this.vel.x = +this.jumpHeigth * 0.8;
                    }
                }
            },

            check: function (other) {
                if (!this.portal) {
                    if (this.vel.y > -this.jumpHeigth) {
                        if (this.vel.y > 0) {
                            this.jump.play();
                        } else {
                            if (this.nextSound == true) {
                                this.pop.play();
                                this.nextSound = false;
                                setTimeout(() => {
                                    this.nextSound = true;
                                }, 200)
                            }

                        }
                        this.vel.y = -this.jumpHeigth;
                    }
                } else if (this.portal) {
                    this.vel.x = this.jumpHeigth * 0.6;
                }
                if (other.blocktype == 3) {
                    this.boostJump.play();
                    this.vel.y = -2000
                }
            },

            collideWith: function (other, axis) {
                console.log("Collision with " + other + " on " + axis + " axis")
                this.vel.y = -this.jumpHeigth;

                if (other.blocktype == 3) {
                    this.vel.y = this.jumpHeigth * 2;
                    console.log("YEP");
                }
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