/*
Simple Mover that visits all its targets in an ordered fashion. You can use
the void entities (or any other) as targets.


Keys for Weltmeister:

speed
	Traveling speed of the mover in pixels per second.
	Default: 20
	
target.1, target.2 ... target.n
	Names of the entities to visit.
*/

ig.module(
	'game.entities.mover'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityMover = ig.Entity.extend({
	size: {x: 24, y: 8},
	maxVel: {x: 100, y: 100},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,
	
	target: null,
	targets: [],
	currentTarget: 0,
	gravityFactor: 0,
	
	animSheet: new ig.AnimationSheet( 'media/mover.png', 24, 8 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
		this.speed = settings.speed ? settings.speed : 20;
		
		// Transform the target object into an ordered array of targets
		this.targets = ig.ksort( this.target);
	},
	
	update: function()
	{
		var oldDistance = 0;
		var target = ig.game.getEntityByName( this.targets[this.currentTarget] );
		if( target ) {
			oldDistance = this.distanceTo(target);
			
			var angle = this.angleTo( target );
			this.vel.x = Math.cos(angle) * this.speed;
			this.vel.y = Math.sin(angle) * this.speed;
		}
		else {
			this.vel.x = 0;
			this.vel.y = 0;
		}
		
		this.parent();
		
		// Are we close to the target or has the distance actually increased?
		// -> Set new target
		var newDistance = this.distanceTo(target);
		if( target && (newDistance > oldDistance || newDistance < 0.5) ) {
			this.pos.x = target.pos.x + target.size.x/2 - this.size.x/2;
			this.pos.y = target.pos.y + target.size.y/2 - this.size.y/2;
			
			this.currentTarget = this.targets.length>1 ? (this.currentTarget+1) % this.targets.length : 0;
		}
	},
});

});