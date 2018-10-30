ig.module( 'game.levels.mainLevel' )
.requires( 'impact.image' )
.defines(function(){
LevelMainLevel=/*JSON[*/{
	"entities": [],
	"layer": [
		{
			"name": "background",
			"width": 7,
			"height": 12,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/Yardlinien.png",
			"repeat": true,
			"preRender": false,
			"distance": "1",
			"tilesize": 100,
			"foreground": false,
			"data": [
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,3,4,5,6,7],
				[1,2,5,5,5,6,7],
				[1,2,5,5,5,6,7],
				[1,2,5,5,5,6,7],
				[1,2,5,5,5,6,7]
			]
		}
	]
}/*]JSON*/;
LevelMainLevelResources=[new ig.Image('media/Yardlinien.png')];
});