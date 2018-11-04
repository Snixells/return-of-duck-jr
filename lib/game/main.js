ig.module(
	'game.main'
)
	.requires(
		// Main Game
		'impact.game',
		'impact.font',
		'game.levels.mainLevel',
		'game.levels.fieldGoal',
		'game.entities.player',
		'game.entities.block',
		'game.entities.powerup',
		'game.entities.portal',
		'game.entities.enemy',
		'game.entities.blockPortalActive',

		// Fieldgoal
		'game.entities.arrow',
		'game.entities.football',
		'game.entities.fieldgoalBlocker',

		// Menus
		'game.levels.mainMenu',
		'game.levels.highscore',
		'game.levels.fieldGoalMenu',
		'game.levels.menuAfterEnterName',
		'game.entities.pointerFootball',
	)
	.defines(function () {

		let score = 0;

		globalHighscore = null;

		jQuery.getJSON("https://webtechlecture.appspot.com/highscore/list?gamename=duckJr", (highscore) => {
			console.log(highscore);


			if (highscore.length > 5) {
				highscore.splice(5, highscore.length - 5);
			}

			globalHighscore = highscore;

		});

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
			},

			update: function () {

				this.parent();

				let player = this.getEntitiesByType("EntityPlayer")[0];

				score = -this.lastYPos;

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
								score = -this.lastYPos;
								console.log(score);
							}

							if (this.playerDead && player.pos.y - 1000 > lowestBlock.pos.y) {
								console.log("HELLO" + player.pos.y);
								player.kill();
								ig.system.setGame(Fieldgoal);
								// this.loadLevelDeferred(LevelMainLevel);

							}
						}

					}
				}

				// Portal Mode => Player dies when dropping out of left screen

				if (this.portalMode) {
					if (player.pos.x < - 100) {
						ig.system.setGame(Fieldgoal);
					}
				}
				if (player.dead) {
					// this.loadLevelDeferred(LevelMainLevel);
					ig.system.setGame(Fieldgoal);

				}


				// DOING THE PORTAL MAGIC

				let portals = this.getEntitiesByType("EntityPortal");
				let portal = portals[0]

				for (let i = 0; i < portals.length; i++) {
					if (portals[i].collidingWithPlayer) {
						portals[i].kill();
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

						// Killing all enemies
						let enemies = this.getEntitiesByType("EntityEnemy")
						for (let i = 0; i < enemies.length; i++) {
							enemies[0].kill();
						}

						// Killing all powerups
						let powerups = this.getEntitiesByType("EntityPowerup")
						for (let i = 0; i < powerups.length; i++) {
							powerups[0].kill();
						}
					}
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

		Fieldgoal = ig.Game.extend({
			font: new ig.Font('media/biggerBlackFont.font.png'),


			// font: new ig.Font('media/highscore.font.png'),


			init: function () {
				this.loadLevel(LevelFieldGoal)

				ig.input.bind(ig.KEY.SPACE, 'space');


				ig.game.spawnEntity('EntityArrow', 280, 850)
				ig.game.spawnEntity('EntityFootball', 325, 950)

				ig.game.spawnEntity('EntityFieldgoalBlocker', 275, 220);


				this.sortEntitiesDeferred();

				// Initialize your game here; bind keys etc.	

				console.log("INIT");

			},


			draw: function () {
				this.parent();

				// this.fieldgoalImage.draw(0, 0);	


			},

			update: function () {
				this.parent();

				let fieldgoalBlocker = this.getEntitiesByType("EntityFieldgoalBlocker")[0];
				let football = this.getEntitiesByType("EntityFootball")[0];

				let xmin = fieldgoalBlocker.pos.x;
				let xmax = xmin + fieldgoalBlocker.size.x;

				let ymin = fieldgoalBlocker.pos.y;
				let ymax = ymin + fieldgoalBlocker.size.y;

				// Collision of Football agains Fieldgoal
				if (football) {
					if ((xmin <= (football.pos.x + 0.5 * football.size.x) && (football.pos.x - 0.5 * football.size.x) <= xmax) && ymin <= football.pos.y && football.pos.y <= ymax) {
						football.kill();
						ig.system.setGame(EnterHighscore);

					}
				}

				// Load FieldgoalMenu when Player didn't score the fieldgoal
				if (football.didntHit == true) {
					ig.system.setGame(FieldgoalMenu);
				}




			}
		});

		EnterHighscore = ig.Game.extend({
			highscoreImage: new ig.Image('media/highscore.jpg'),

			font: new ig.Font('media/highscore.font.png'),

			nameDrawn: "",

			init: function () {
				for (let i = 65; i < 90; i++) {
					ig.input.bind(ig.KEY[String.fromCharCode(i)], String.fromCharCode(i));
				}

				ig.input.bind(ig.KEY.SPACE, "space");
				ig.input.bind(ig.KEY.BACKSPACE, "backspace");
				ig.input.bind(ig.KEY.ENTER, "enter");

			},

			update: function () {
				if (ig.input.pressed("enter")) {

					// Adding Highscore wo api
					let requestUrl = "https://webtechlecture.appspot.com/highscore/add?gamename=duckJr&playername=" + this.nameDrawn + "&points=" + score;
					let httpAddHighscore = new XMLHttpRequest();
					httpAddHighscore.open("GET", requestUrl);
					httpAddHighscore.send(null);



					// Loading Highscore Page
					ig.system.setGame(RestartAfterEnterName);
				}
			},


			draw: function () {
				this.parent();

				// Adding all the number inputs to insert name
				if (this.nameDrawn.length <= 10) {
					for (let i = 65; i < 90; i++) {
						if (ig.input.pressed(String.fromCharCode(i))) {
							this.nameDrawn += String.fromCharCode(i);
							console.log(String.fromCharCode(i));
						}
					}

					if (ig.input.pressed("space")) {
						this.nameDrawn += " ";
					}
				}

				if (ig.input.pressed("backspace")) {
					console.log("DEL");
					this.nameDrawn = this.nameDrawn.slice(0, -1);
				}


				this.highscoreImage.draw(0, 0);

				this.font.draw("ENTER YOUR NAME", ig.system.width / 2, 255, ig.Font.ALIGN.CENTER)
				this.font.draw(this.nameDrawn, ig.system.width / 2, 410, ig.Font.ALIGN.CENTER)


			}
		});

		Highscore = ig.Game.extend({

			selectedButton: 0,

			menuJumps: 140,

			score: [],

			font: new ig.Font('media/highscore2.font.png'),

			init: function () {
				this.loadLevel(LevelHighscore);

				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
				ig.input.bind(ig.KEY.ENTER, 'enter');

				ig.game.spawnEntity('EntityPointerFootball', 580, 560);
			},


			draw: function () {
				this.parent();

				// Drawing Highscore

				let entries = 5

				if (globalHighscore.length < 5) {
					entries = globalHighscore.length
				}

				for (let i = 0; i < entries; i++) {
					this.font.draw(globalHighscore[i].playername, 50, i * 53 + 260);
					this.font.draw(globalHighscore[i].points, 500, i * 53 + 260);
				}

			},

			update: function () {

				// Menu
				let pointer = this.getEntitiesByType("EntityPointerFootball")[0];

				if (ig.input.pressed("up")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("down")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("enter")) {
					if (this.selectedButton == 0) {
						ig.system.setGame(MyGame);
					} else if (this.selectedButton == 1) {
						ig.system.setGame(MainMenu);
					}
				}
			}
		});


		FieldgoalMenu = ig.Game.extend({

			selectedButton: 0,

			menuJumps: 170,

			init: function () {
				this.loadLevel(LevelFieldGoalMenu)

				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
				ig.input.bind(ig.KEY.ENTER, 'enter');

				ig.game.spawnEntity('EntityPointerFootball', 580, 380);
			},

			update: function () {
				// Menu
				let pointer = this.getEntitiesByType("EntityPointerFootball")[0];

				if (ig.input.pressed("up")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("down")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("enter")) {
					if (this.selectedButton == 0) {
						ig.system.setGame(MyGame);
					} else if (this.selectedButton == 1) {
						ig.system.setGame(MainMenu);
					}
				}
			}
		});


		MainMenu = ig.Game.extend({

			selectedButton: 0,
			menuJumps: 140,

			init: function () {
				this.loadLevel(LevelMainMenu)

				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
				ig.input.bind(ig.KEY.ENTER, 'enter');

				ig.game.spawnEntity('EntityPointerFootball', 580, 360);


			},

			draw: function () {

				this.parent();

			},

			update: function () {
				this.parent();

				let pointer = this.getEntitiesByType("EntityPointerFootball")[0];

				if (ig.input.pressed("up")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("down")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("enter")) {
					if (this.selectedButton == 0) {
						ig.system.setGame(MyGame);
					} else if (this.selectedButton == 1) {
						ig.system.setGame(Highscore);
					}
				}


				console.log(this.selectedButton);
			}
		});



		RestartAfterEnterName = ig.Game.extend({

			selectedButton: 0,
			menuJumps: 140,

			init: function () {
				this.loadLevel(LevelMenuAfterEnterName)

				ig.input.bind(ig.KEY.UP_ARROW, 'up');
				ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
				ig.input.bind(ig.KEY.ENTER, 'enter');

				ig.game.spawnEntity('EntityPointerFootball', 580, 360);


			},

			draw: function () {

				this.parent();

			},

			update: function () {
				this.parent();

				let pointer = this.getEntitiesByType("EntityPointerFootball")[0];

				if (ig.input.pressed("up")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("down")) {
					if (this.selectedButton == 0) {
						pointer.pos.y += this.menuJumps;
						this.selectedButton++;
					} else if (this.selectedButton == 1) {
						pointer.pos.y -= this.menuJumps;
						this.selectedButton--;
					}
				}

				if (ig.input.pressed("enter")) {
					if (this.selectedButton == 0) {
						ig.system.setGame(MyGame);
					} else if (this.selectedButton == 1) {
						ig.system.setGame(MainMenu);
					}
				}


				console.log(this.selectedButton);
			}
		});

		ig.main('#canvas', MainMenu, 60, 700, 1200, 1);


	});
