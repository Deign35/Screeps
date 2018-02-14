var IDisposable = (function () {
    function IDisposable() {
    }
    IDisposable.prototype.dispose = function () { };
    return IDisposable;
}());
function using(resource, func) {
    try {
        func(resource);
    }
    finally {
        resource.dispose();
    }
}
global['IDisposable'] = IDisposable;
global['using'] = using;
//# sourceMappingURL=IDisposable.js.map