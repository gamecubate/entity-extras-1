/*
EntityPinTrigger

This entity calls the triggeredBy method of one or more targets when it
and another entity of a specific collision type overlap at the almost-same
position.

Keys for Weltmeister:

checks
	Specifies which type of entity can trigger this trigger. NONE, A, B, or BOTH 
	Default: A

tolerance
	Specifies the tolerance in pixels for which positions are considered equal.
	Default: 0.5

enabled
	entity is operational or not
	Default: true
	
target.1, target.2 ... target.n
	Names of the entities whose triggeredBy() method will be called if
  and when a collision occurs
*/

ig.module(
	'game.entities.pin-trigger'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPinTrigger = ig.Entity.extend({
	size: {x: 16, y: 16},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(192, 255, 255, 0.7)',
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.NEVER,
	
	// we fire once per new visit, so we must keep track of visitors
	visitors: [],
	
	
	init: function( x, y, settings )
	{
		this.checkAgainst = settings.checks != undefined ? ig.Entity.TYPE[settings.checks.toUpperCase()] : ig.Entity.TYPE.BOTH;
		this.tolerance = settings.tolerance != undefined ? settings.tolerance : 0.5;
		this.enabled = settings.enabled != undefined ? settings.enabled == "false" : true;
	
		this.parent(x, y, settings);
	},

	check: function(other)
	{
		// operational or not?
		if (! this.enabled)
			return;
			
		// we only act on approximate position center alignments
		if (other.distanceTo(this) > this.tolerance)
			return;
			
		// new visitors only
		if (this.visitors.indexOf(other) != -1)
			return;
		else
			this.visitors.push(other);
		
		if (typeof(this.target) == 'object')
		{
			for (var t in this.target)
			{
				var ent = ig.game.getEntityByName( this.target[t]);
				if (ent && typeof(ent.triggeredBy) == 'function')
				{
						ent.triggeredBy(other, this);
				}
			}
		}
	},
	
	update: function()
	{
		// visitors who have left no longer need to be tracked
		// (until their next visit, that is)
		var temp = ig.copy(this.visitors);
		for (var i=0; i<temp.length; i++)
		{
			var visitor = temp[i];
			if (visitor.distanceTo(this) > this.tolerance)
				this.visitors.splice(this.visitors.indexOf(visitor), 1);
		}
	},
});
});