class Delegate {
    constructor(callbackType, callbackId, callbackFunction) {
        this.CallbackType = callbackType;
        this.Callbackfunc = callbackFunction;
        this.CallbackId = callbackId;
    }
}

Delegate.prototype.Callback = function(callbackArgs) {
    let callbackFunction;
    if (this.CallbackType == CallbackType_Enum.GameObject) {
        callbackFunction = Game.getObjectById(this.CallbackId)[this.Callbackfunc];
    } else if (this.CallbackType == CallbackType_Enum.Id) {
        callbackFunction = [this.CallbackId][this.Callbackfunc];
    } else if (this.CallbackType == CallbackType_Enum.Room) {
        let room = Game.rooms[this.CallbackId];
        callbackFunction = room[this.Callbackfunc];
    }

    return callbackFunction(callbackArgs);
};

module.exports = Delegate;