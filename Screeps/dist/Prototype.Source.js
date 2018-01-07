/*Source.prototype.CheckNeeds = function () {
    StartFunction('Source[' + this.id + '].CheckNeeds');
    let requirement = StructureRequirement_Enum.None;
    if (!this.Brain.harvesters) {
        this.Brain.harvesters = []; // This shouldn't be here, but ok for now...
    }

    _.remove(this.Brain.harvesters, function (id) {
        return !(Game.getObjectById(id));
    });

    if (this.Brain.harvesters.length < 2) {
        requirement = StructureRequirement_Enum.Creep;
    }

    EndFunction();
    return requirement;
};

Source.prototype.GiveCreep = function (creep) {
    StartFunction('Source[' + this.id + '].GiveCreep(' + creep.id + ')');

    this.Brain.harvesters.push(creep.id);

    EndFunction();
}*/

/*
 The source should request a harvester if it has an open space and regenerated before depletion.
If there's no more space, request stronger harvesters.
// MAX WORK until there are 6 work components per source!!!!!
Try to eventually get to the point that a harvester with [MOVE, CARRY, WORK * 6].  This can completely deplete
a source with 0 loss.

The source requests a harvester, and the harvester requests a new carrier be made anytime it reaches max energy.
The source also requests a builder to build an associated container.
Once a container is built, the creep no longer needs a CARRY.  It will just directly harvest to the container.

Carriers [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE] can deliver to workers [WORK, WORK, MOVE, CARRY].

ConstructionSite requests a builder.
If carrier runs out of delivery targets, request a worker be made.  That work can be an all purpose creep.

*/