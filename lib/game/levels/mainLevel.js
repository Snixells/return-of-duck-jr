ig.module( 'game.levels.mainLevel' )
.requires( 'impact.image' )
.defines(function(){
LevelMainLevel=/*JSON[*/{
	"entities": [],
	"layer": [
		{
			"name": "background",
			"width": 5,
			"height": 8,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/background.png",
			"repeat": true,
			"preRender": false,
			"distance": "1",
			"tilesize": 100,
			"foreground": false,
			"data": [
				[1,2,3,4,5],
				[6,7,8,9,10],
				[11,12,13,14,15],
				[16,17,18,19,20],
				[21,22,23,24,25],
				[26,27,28,29,30],
				[31,32,33,34,35],
				[36,37,38,39,40]
			]
		}
	]
}/*]JSON*/;
LevelMainLevelResources=[new ig.Image('media/background.png')];
});