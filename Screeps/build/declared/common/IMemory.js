var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var IMemory = (function (_super) {
    __extends(IMemory, _super);
    function IMemory() {
        return _super.call(this) || this;
    }
    ;
    IMemory.prototype.Load = function () { };
    ;
    IMemory.prototype.Save = function () { };
    ;
    return IMemory;
}(IDisposable));
global['IMemory'] = IMemory;
//# sourceMappingURL=IMemory.js.map