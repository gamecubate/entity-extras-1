/*
This entity passes through all calls to triggeredBy() to its own targets
after a delay of n seconds.

E.g.: Set an EntityDelay as the target of an EntityTrigger and connect the
entities that should be triggered after the delay as targets to the 
EntityDelay.


Keys for Weltmeister:

delay 
	Delay in seconds after which the targets should be triggered.
	default: 1
	
target.1, target.2 ... target.n
	Names of the entities whose triggeredBy() method will be called after 
	the delay.
*/

ig.module(
	'game.entities.blocker'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBlocker = ig.Entity.extend({
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 0, 0, 0.7)',
	
	size: {x: 8, y: 8},
	//duration: 1,
	arrivals: [],
	departures: [],
	
	init: function( x, y, settings )
	{
		this.duration = settings.duration || 1;
		this.parent( x, y, settings );
	},
	
	triggeredBy: function(entity, trigger)
	{
		ig.log("triggeredBy");
		
		// we only act on approximate position center alignments
		//if (entity.distanceTo(trigger) > 0.5)
		//	return;
			
		// status of entity?
		var inTransit = (this.arrivals.indexOf(entity) != -1);
		var departing = (this.departures.indexOf(entity) != -1);

		// we only check-in new arrivals
		if (inTransit || departing)
			return;
		
		// process
		ig.log("stop!");
		this.arrivals.push(entity);
		entity.blocker = {
			vel:entity.vel,
			update:entity.update,
			durationTimer:new ig.Timer(this.duration)
		};
		entity.vel = {x:0, y:0};
		entity.update = function(){};
	},
	
	update: function()
	{
		// Triage:
		// decide who stays a bit longer and who is now ready to leave,
		// and forget about those who already left and are now out of range

		var visitor;
		for (var i=0; i<this.arrivals.length; i++)
		{
			visitor = this.arrivals[i];
			if (visitor.blocker.durationTimer.delta() > 0)
				this.departures.push(visitor);
		}

		var outOfRange = [];
		for (var i=0; i<this.departures.length; i++)
		{
			visitor = this.departures[i];
			if (this.arrivals.indexOf(visitor) != -1)
			{
				ig.log("go!");
				visitor.vel = visitor.blocker.vel;
				visitor.update = visitor.blocker.update;
				delete visitor.blocker;
				this.arrivals.splice(this.arrivals.indexOf(visitor));
			}
			else if (this.outOfRange(visitor))
			{
				outOfRange.push(visitor);
			}
		}

		for (var i=0; i<outOfRange.length; i++)
		{
			visitor = outOfRange[i];
			this.departures.splice(this.departures.indexOf(visitor));
		}
	},

	outOfRange: function(visitor)
	{
		var x0 = this.pos.x;
		var x1 = this.pos.x + this.size.x;
		var y0 = this.pos.y;
		var y1 = this.pos.y + this.size.y;

		var vx0 = visitor.pos.x;
		var vx1 = visitor.pos.x + visitor.size.x;
		var vy0 = visitor.pos.y;
		var vy1 = visitor.pos.y + visitor.size.y;

		return (x1 < vx0 || vx1 < x0 || y1 < vy0 || vy1 < y0);
	},
});
});