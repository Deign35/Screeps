class Delegate {
    constructor(callbackType, callbackId, callbackFunction) {
        this.CallbackType = callbackType;
        this.Callbackfunc = callbackFunction;
        this.CallbackId = callbackId;
    }
}

Delegate.prototype.Callback = function (callbackArgs) {
    StartFunction('Delegate.Callback');
    let callbackFunction;
    let delegateResult = OK;

    if (this.CallbackType == CallbackType_Enum.Id) {
        const obj = Game.getObjectById(this.CallbackId);
        delegateResult = obj[this.Callbackfunc].apply(obj, callbackArgs);
    } else if (this.CallbackType == CallbackType_Enum.Room) {
        let room = Game.rooms[this.CallbackId];
        delegateResult = room[this.Callbackfunc].apply(room, callbackArgs);
    }

    EndFunction();
    return delegateResult;
};

Delegate.FromData = function (data) {
    return new Delegate(data.CallbackType, data.CallbackId, data.Callbackfunc);
}

module.exports = Delegate;