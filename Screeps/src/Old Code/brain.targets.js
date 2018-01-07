const DEFUALT_TARGET_REASON = 'default';

let Targets = {
    createNewTarget: function(newTargetId) {
        if(!Memory.targets[newTargetId]) {
            Memory.targets[newTargetId] = { isTargeting: { },
                                            isTargetedBy: { },
                                            targetReasons: { },
            };
            Memory.targets.length += 1;
        }
        
        return Memory.targets[newTargetId];
    },
    addTarget: function(sourceId, targetId, targetReason = DEFUALT_TARGET_REASON) {
        if(!Memory.targets[targetId]) {
            this.createNewTarget(targetId);
        }
        if(!Memory.targets[sourceId]) {
            this.createNewTarget(sourceId);
        }
        if(!Memory.targets[sourceId]['isTargeting'][targetId]) {
            Memory.targets[sourceId]['isTargeting'][targetId] = targetReason;
            Memory.targets[targetId]['isTargetedBy'][sourceId] = targetReason;
            
            if(!Memory.targets[sourceId]['targetReasons'][targetReason]) {
                Memory.targets[sourceId]['targetReasons'][targetReason] = [];
            }
            Memory.targets[sourceId]['targetReasons'][targetReason].push(targetId);
        }
    },
    removeTarget: function(sourceId, targetId) {
        if(Memory.targets[sourceId]['isTargeting'][targetId]) {
            delete Memory.targets[sourceId]['targetReasons'][Memory.targets[sourceId]['isTargeting'][targetId]];
            
            delete Memory.targets[sourceId]['isTargeting'][targetId];
            delete Memory.targets[targetId]['isTargetedBy'][sourceId];
        }
    },
    getTargetsOf: function(sourceId, targetReason) {
        return Memory.targets[sourceId]['targetReasons'][targetReason];
    },
    removeTargetReason: function(sourceId, targetReason) {
       if(Memory.targets[sourceId]['targetReasons']) {
           const targets = Memory.targets[sourceId]['targetReasons'][targetReason];
           for(let target in targets) {
                this.removeTarget(sourceId, targets[target]);
           }
       }
    },
    updateTargetReason: function(sourceId, targetId, targetReason) {
        this.removeTarget(sourceId, targetId);
        this.addTarget(sourceId, targetId, targetReason);
    },
    deleteTargetObject: function(targetObjectId) {
        if(Memory.targets[targetObjectId]) {
            const targetingList = Memory.targets[targetObjectId]['isTargeting'];
            for(let target in targetingList) {
                this.removeTarget(targetObjectId, targetObjectId);
            }
            
            const targetedByList = Memory.targets[targetObjectId]['isTargetedBy'];
            for(let target in targetedByList) {
                this.removeTarget(targetObjectId, target);
            }
            
            delete Memory.targets[targetObjectId];
            Memory.targets.length -= 1;
        }
    },
    
    clearTargetMemory: function() {
        if(Memory.targets) {
            delete Memory.targets;
        }
        Memory.targets = { length: 0 };
    }
};
module.exports = Targets;