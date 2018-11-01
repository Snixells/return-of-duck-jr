ig.module(
	'game.main'
)
	.requires(
		'impact.game',
		'impact.font',
		'game.levels.mainLevel',
		'game.entities.player',
		'game.entities.block'
	)
	.defines(function () {
		MyGame = ig.Game.extend({

			screensizeX: 700,
			screensizeY: 1200,
			lastYPos: 0,
			lastYardYPos: 0,
			blockSpawnRate: 200,

			font: new ig.Font('media/biggerBlackFont.font.png'),


			init: function () {
				ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
				ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

				this.loadLevel(LevelMainLevel);

				ig.game.spawnEntity('EntityPlayer', 350, this.screensizeY * 0.8);

				for (let i = 0; i < this.screensizeY; i += 100) {
					let blockXPos = Math.random() * (this.screensizeX - 300) + 100;
					ig.game.spawnEntity('EntityBlock', blockXPos, i);
				}
			},

			update: function () {
				this.parent();

				let player = this.getEntitiesByType("EntityPlayer")[0];

				// Moving Screen

				if (player.pos.y < 0.4 * this.screensizeY) {
					this.screen.y = player.pos.y - 0.4 * this.screensizeY;
				}

				// Generating Blocks

				let newYPos = this.screen.y;
				if (this.lastYPos - newYPos > this.blockSpawnRate - 400) {
					let blockXPos = Math.random() * (this.screensizeX - 100) + 1;
					ig.game.spawnEntity('EntityBlock', blockXPos, this.lastYPos);

					this.lastYPos -= this.blockSpawnRate;
				}
			},

			draw: function () {
				this.parent();

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
			}
		});

		ig.main('#canvas', MyGame, 60, 700, 1200, 1);

	});
