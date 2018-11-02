ig.module(
	'game.main'
)
	.requires(
		'impact.game',
		'impact.font',
		'game.levels.mainLevel',
		'game.entities.player',
		'game.entities.block',
		'game.entities.powerup',
		'game.entities.portal',
		'game.entities.enemy',
		'game.entities.blockPortalActive'
	)
	.defines(function () {
		MyGame = ig.Game.extend({

			screensizeX: 700,
			screensizeY: 1200,
			lastYPos: 0,
			lastYardYPos: 0,
			blockSpawnRate: 200,
			score: 0,
			playerDead: false,
			portalMode: false,

			font: new ig.Font('media/biggerBlackFont.font.png'),


			init: function () {
				ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
				ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

				this.loadLevel(LevelMainLevel);

				// ig.game.spawnEntity('EntityPlayer', 350, this.screensizeY * 0.8);

				// ig.game.spawnEntity('EntityPortal', 500, -2000);

				ig.game.spawnEntity('EntityPortal', 500, -2000);


				// for (let i = 0; i < this.screensizeY; i += 100) {
				// 	let blockXPos = Math.random() * (this.screensizeX - 300) + 100;
				// 	ig.game.spawnEntity('EntityBlock', blockXPos, i);
				// }
			},

			update: function () {
				this.parent();

				let player = this.getEntitiesByType("EntityPlayer")[0];

				// Moving Screen

				if (player) {
					if (!this.playerDead) {
						if (player.pos.y < 0.6 * this.screensizeY) {
							this.screen.y = player.pos.y - 0.6 * this.screensizeY;
						}
					}
				}

				// Generating Blocks

				let newYPos = this.screen.y;
				let vorzeichen = 1;

				if (this.lastYPos - newYPos > this.blockSpawnRate - 400) {
					console.log(this.lastYPos);
					let blockXPos = Math.random() * (this.screensizeX - 100) + 1;
					if (!this.portalMode) {
						ig.game.spawnEntity('EntityBlock', blockXPos, this.lastYPos);
					} else {
						ig.game.spawnEntity('EntityBlockPortalActive', blockXPos, this.lastYPos);

					}

					let blocks = this.getEntitiesByType("EntityBlock");

					if (!this.portalMode) {

						// Generating Powerups
						if (player.pos.y < -2000 && blocks[blocks.length - 1].blocktype != 1) {
							if (Math.floor(Math.random() * 15) == 0) {
								let newPowerup = ig.game.spawnEntity('EntityPowerup', blockXPos, this.lastYPos - 100);
								blocks[blocks.length - 1].relatedEntity = newPowerup;
							}
						}

						// Generating enemies
						if (player.pos.y < -3000) {
							if (Math.floor(Math.random() * 30) == 0) {
								if (!blocks[blocks.length - 1].relatedEntity && blocks[blocks.length - 1].blocktype != 1) {
									let newEnemey = ig.game.spawnEntity('EntityEnemy', blockXPos, this.lastYPos - 120);
									blocks[blocks.length - 1].relatedEntity = newEnemey;

								}
							}
						}

						// Generating Poratals
						if (player.pos.y < -5000) {
							if (Math.floor(Math.random() * 70) == 0) {
								if (!blocks[blocks.length - 1].relatedEntity && blocks[blocks.length - 1].blocktype != 1) {
									let newPortal = ig.game.spawnEntity('EntityPortal', blockXPos, this.lastYPos - 120);
									blocks[blocks.length - 1].relatedEntity = newPortal;

								}
							}
						}

						// Deleting old blocks

						for (let i = 0; i < blocks.length; i++) {

							if (blocks[i].pos.y > player.pos.y + 1200) {
								blocks[i].kill();
							}
						}

					}

					this.lastYPos -= this.blockSpawnRate;

				}




				// Player dies when falling down 

				if (!this.portalMode) {
					if (player.pos.y < 0) {
						let blocks = this.getEntitiesByType("EntityBlock");

						if (blocks.length > 0) {
							lowestBlock = blocks[0];

							if (player.pos.y > lowestBlock.pos.y) {
								let playerPosBeforeDead = player.pos.y;
								player.vel.y = 2000;
								this.playerDead = true;
							}

							if (this.playerDead && player.pos.y - 1000 > lowestBlock.pos.y) {
								console.log("HELLO" + player.pos.y);
								player.kill();
								this.loadLevelDeferred(LevelMainLevel);
							}
						}

					}
				}
				if (player.dead) {
					this.loadLevelDeferred(LevelMainLevel);
				}


				// DOING THE PORTAL MAGIC

				let portal = this.getEntitiesByType("EntityPortal")[0];

				if (portal) {
					if (portal.collidingWithPlayer) {
						portal.kill();
						player.portal = true;
						this.portalMode = true;
						setTimeout(() => {
							this.portalMode = false;
							player.portal = false
							console.log("Turning back");
							let portalBlocks = this.getEntitiesByType("EntityBlockPortalActive")
							for (let i = 0; i < portalBlocks.length; i++) {
								portalBlocks[i].kill();
								console.log("DOING STUFF");
								ig.game.spawnEntity('EntityBlock', portalBlocks[i].pos.x, portalBlocks[i].pos.y);
								console.log("KIlling Portalblock");
							}
						}, 5000)

						// "Turning" all blocks
						let blocks = this.getEntitiesByType("EntityBlock");

						for (let i = 0; i < blocks.length; i++) {
							// deleting bloc 
							let oldBlock = blocks[i];
							let newblockx = oldBlock.pos.x
							let newblocky = oldBlock.pos.y
							blocks[i].kill();
							ig.game.spawnEntity('EntityBlockPortalActive', newblockx, newblocky);
						}

						let enemies = this.getEntitiesByType("EntityEnemy")
						for (let i = 0; i < enemies.length; i++) {
							enemies[0].kill();
						}

						let powerups = this.getEntitiesByType("EntityPowerup")
						for (let i = 0; i < powerups.length; i++) {
							powerups[0].kill();
						}
					}
				}

				if (this.portalMode == true) {

				}

				// player.vel.x = 200;
			},

			draw: function () {
				this.parent();

				let player = this.getEntitiesByType("EntityPlayer")[0];


				// Generating Score

				let fakeScore = this.score - 700;

				if (this.screen.y > 0 && fakeScore < this.screen.y) {
					fakeScore = this.screen.y;
				} else if (this.screen.y < 0 && fakeScore < -this.screen.y) {
					fakeScore = -this.screen.y;
				}

				this.score = fakeScore + 700;

				// Generating Yard Numbers

				if (this.lastYardYPos + this.screen.y < 100) {
					this.lastYardYPos += 100;
				}

				var y = ig.system.height - this.font.height;

				for (let i = 0; i < ig.system.height + this.lastYardYPos; i += 200) {
					if (i > -this.screen.y - ig.system.height && i < -this.screen.y + ig.system.height) {

						if (i < 10000) {
							this.font.draw(i, 30, y - this.screen.y - i, ig.Font.ALIGN.CENTER);
							this.font.draw(i, ig.system.width - 30, y - this.screen.y - i, ig.Font.ALIGN.CENTER);
						} else if (i < 100000) {
							this.font.draw(i, 50, y - this.screen.y - i, ig.Font.ALIGN.CENTER);
							this.font.draw(i, ig.system.width - 50, y - this.screen.y - i, ig.Font.ALIGN.CENTER);
						} else if (i < 1000000) {
							this.font.draw(i, 70, y - this.screen.y - i, ig.Font.ALIGN.CENTER);
							this.font.draw(i, ig.system.width - 70, y - this.screen.y - i, ig.Font.ALIGN.CENTER);
						}
					}
				}
			},


		});

		ig.main('#canvas', MyGame, 60, 700, 1200, 1);

	});
