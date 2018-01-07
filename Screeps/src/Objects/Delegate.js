const Delegate = function Delegate(callbackType, callbackId, callbackFunction) {
    this.CallbackType = callbackType;
    this.Callback = callbackFunction;
    this.CallbackId = callbackId;
};

Delegate.prototype.Callback = function(callbackArgs) {
    let callbackFunction;

    if (callbackArgs.CallbackType == CallbackType_Enum.GameObject) {
        callbackFunction = Game.getObjectById(this.CallbackId)[this.Callback];
    } else if (callbackArgs.CallbackType == CallbackType_Enum.Id) {
        callbackFunction = [this.CallbackId][this.Callback];
    } else if (callbackArgs.CallbackType == CallbackType_Enum.Room) {
        callbackFunction = Game.rooms[this.CallbackId][this.Callback];
    }

    return callbackFunction(callbackArgs);
};

module.exports = Delegate;