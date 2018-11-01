ig.module(
	'game.main'
)
	.requires(
		'impact.game',
		'impact.font',
		'game.levels.mainLevel',
		'game.entities.player',
		'game.entities.block',
		'game.entities.powerup'
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

			font: new ig.Font('media/biggerBlackFont.font.png'),


			init: function () {
				ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
				ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

				this.loadLevel(LevelMainLevel);

				ig.game.spawnEntity('EntityPlayer', 350, this.screensizeY * 0.8);

				ig.game.spawnEntity('EntityPowerup', 100, 1000);

				// for (let i = 0; i < this.screensizeY; i += 100) {
				// 	let blockXPos = Math.random() * (this.screensizeX - 300) + 100;
				// 	ig.game.spawnEntity('EntityBlock', blockXPos, i);
				// }
			},

			update: function () {
				this.parent();

				let player = this.getEntitiesByType("EntityPlayer")[0];

				// Moving Screen

				if (!this.playerDead) {
					if (player.pos.y < 0.4 * this.screensizeY) {
						this.screen.y = player.pos.y - 0.4 * this.screensizeY;
					}
				}



				// Generating Blocks

				let newYPos = this.screen.y;
				let vorzeichen = 1;


				if (this.lastYPos - newYPos > this.blockSpawnRate - 400) {
					let blockXPos = Math.random() * (this.screensizeX - 100) + 1;
					ig.game.spawnEntity('EntityBlock', blockXPos, this.lastYPos);

					// Deleting old blocks
					let blocks = this.getEntitiesByType("EntityBlock");

					for (let i = 0; i < blocks.length; i++) {

						if (blocks[i].pos.y > player.pos.y + 1200) {
							blocks[i].kill();
						}
					}

					this.lastYPos -= this.blockSpawnRate;
				}

				// Player dies when falling down 

				if (player)
					if (player.pos.y < 0) {
						let blocks = this.getEntitiesByType("EntityBlock");
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
