Creep.prototype.findAndDeliver = function (commandArgs) {
    if (!commandArgs['target']) {
        // Find a target to deliver to.
        //Transfer, Build, Upgrade??
        // Build and Upgrade should remain specific tasks including specifically building that objectId.
        // Deliver will refer to moving resources to another object for storage, such as towers, links, extensions, spawns, etc...

        // Or perhaps this changes itself to be build or upgrade.  I think deliver transfer should remain immutable and keep searching.
        this.CommandTarget = this.room.GetEnergyDeliveryTarget(this.pos);
        // this.CommandTarget can't be memory, need to ensure memory is right..
        if (this.CommandTarget == null) {
            return ERR_NOT_FOUND;
        }
        this.CommandData['target'] = this.CommandTarget.id;
        commandArgs['target'] = this.CommandTarget;
    }
    // Perhaps find a target should be the only part that does a thing?
    // Sets the target for next command via this.Brain.CommandData?
    // Hopefully make it so I don't need this command at all.
    return this.transfer(commandArgs);
};

Creep.prototype.waitAt = function (pos) {
    let tarPos = new RoomPosition(pos.x, pos.y, pos.roomName);
    if (this.pos.isEqualTo(tarPos)) {
        return OK;
    }
    this.moveTo(tarPos);
    // Maybe this aught to be a new ERR_ const.... ERR_INCOMPLETE.
    return ERR_TIRED;
}