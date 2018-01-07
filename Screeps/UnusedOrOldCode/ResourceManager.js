//global['ResourceObject'] = require('ResourceObject');
const ResourceManager_Memory_ID = 'ResourceManager';

const LoadResourceMemory = function (resourceType) {
    if (!ResourceManager.ResourceMemory[resourceType]) {
        ResourceManager.ResourceMemory[resourceType] = { total: 0 };
    }
    return ResourceManager.ResourceMemory[resourceType];
};
const SaveResourceMemory = function (resourceType, updatedData) {
    ResourceManager.ResourceMemory[resourceType] = updatedData;
}

const ResourceManager = {
    Init: function () {
        StartFunction('ResourceManager.Init()');
        this.ResourceMemory = MemoryManager.LoadData(ResourceManager_Memory_ID);
        if (!this.ResourceMemory['ResourceTypes']) {
            this.ResourceMemory['ResourceTypes'] = {};
        }
        if (!this.ResourceMemory['Locations']) {
            this.ResourceMemory['Locations'] = {};
        }

        EndFunction();
        return OK;
    },
    Complete: function () {
        StartFunction('ResourceManager.Complete()');
        MemoryManager.SaveData(ResourceManager_Memory_ID, this.ResourceMemory);

        EndFunction();
        return OK;
    },
    AddResources: function (resourceType, amount, location) {
        StartFunction('AddResources');
        if (!this.ResourceMemory['ResourceTypes'][resourceType]) {
            this.ResourceMemory['ResourceTypes'][resourceType] = {total: 0};
        }
        if (!this.ResourceMemory['ResourceTypes'][resourceType][location]) {
            this.ResourceMemory['ResourceTypes'][resourceType][location] = 0;
        }

        if (!this.ResourceMemory['Locations'][location]) {
            this.ResourceMemory['Locations'][location] = {};
        }
        if (!this.ResourceMemory['Locations'][location][resourceType]) {
            this.ResourceMemory['Locations'][location][resourceType] = 0;
        }

        this.ResourceMemory['ResourceTypes'][resourceType][location] += amount;
        this.ResourceMemory['ResourceTypes'][resourceType].total += amount;
        this.ResourceMemory['Locations'][location][resourceType] += amount;

        EndFunction();
        return OK;
    },

    RemoveResources: function (resourceType, amount, location) {
        StartFunction('RemoveResources');
        if (!this.ResourceMemory['ResourceTypes'][resourceType]) {
            return ERR_INVALID_ARGS;
        }
        if (!this.ResourceMemory['ResourceTypes'][resourceType][location]) {
            return ERR_INVALID_TARGET;
        }
        if (this.ResourceMemory['ResourceTypes'][resourceType][location] < amount) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }
        this.ResourceMemory['ResourceTypes'][resourceType][location] -= amount;
        this.ResourceMemory['ResourceTypes'][resourceType].total -= amount;
        this.ResourceMemory['Locations'][location][resourceType] -= amount;

        EndFunction();
        return OK;
    },
};

module.exports = ResourceManager;