// Make sure we haven't already stored the original
if (!Creep.prototype._harvest) {
    // Harvest should check if there's an associated container to deliver to.'
    // Store the original method
    Creep.prototype._harvest = Creep.prototype.harvest;
    // Create our new function
    Creep.prototype.harvest = function (target) {
        // Add custom functionality
        // Need to check if harvest is even for a source or not.
        if (this.carry.energy == this.carryCapacity) {
            return ERR_FULL;
        }

        // Call and return the original method
        return this._harvest(target);
    }
}
if (!Creep.prototype._say) {
    Creep.prototype._say = Creep.prototype.say;

    Creep.prototype.say = function (message) {
        console.log(message);
        return this._say(message);
    }
}

if (!Creep.prototype._transfer) {
    Creep.prototype._transfer = Creep.prototype.transfer;

    Creep.prototype.transfer = function (target, resourceType) {
        // Currently only doing energy.
        if (target.energy == target.energyCapacity) {
            return ERR_FULL;
        }

        if (this.carry[resourceType] == 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        return this._transfer(target, resourceType);
    };
}