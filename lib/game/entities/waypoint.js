/*
Inherits from EntityTrigger but only fires when collider center
matches ours.


Keys for Weltmeister:

same as for EntityTrigger
*/

ig.module(
	'game.entities.waypoint'
)
.requires(
	'game.entities.trigger'
)
.defines(function(){

EntityWaypoint = EntityTrigger.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(192, 255, 255, 0.7)',
	
	check: function(other)
	{
		// we only act on approximate position center alignments
		if (other.distanceTo(this) > 0.5)
			return;
			
		this.parent(other);
	},
});
});