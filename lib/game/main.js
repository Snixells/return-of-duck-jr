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
			blockSpawnRate: 200,

			// Load a font
			font: new ig.Font('media/04b03.font.png'),


			init: function () {
				// Initialize your game here; bind keys etc.

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

				// ig.game.spawnEntity('EntityBlock', 500, 900);
			},

			update: function () {
				this.parent();

				let player = this.getEntitiesByType("EntityPlayer")[0];

				if (player.pos.y < 0.4 * this.screensizeY) {
					this.screen.y = player.pos.y - 0.4 * this.screensizeY;
				}

				let newYPos = this.screen.y;


				if (this.lastYPos - newYPos > this.blockSpawnRate - 400) {
					let blockXPos = Math.random() * (this.screensizeX - 100) + 1;
					ig.game.spawnEntity('EntityBlock', blockXPos, this.lastYPos);

					this.lastYPos -= this.blockSpawnRate;
				}

				console.log(this.screen.y);

			},

			draw: function () {
				// Draw all entities and backgroundMaps
				this.parent();


				// Add your own drawing code here
				var x = ig.system.width / 2,
					y = ig.system.height / 2;

				this.font.draw('It Works!', x, y, ig.Font.ALIGN.CENTER);
			}
		});

		ig.main('#canvas', MyGame, 60, 700, 1200, 1);

	});
