if (Consts.DEBUG_MODE) {
    global['Debug'] = require('Debug');
} else {
    global['Debug'] = {
        CallStack: {
            OutputStackTrace: function () { return OK; }, Push: function () { return OK; }, Pop: function () { return OK; }, Clear: function () { return OK; },
        }
    }
}
global['StartFunction'] = Debug['CallStack']['Push'];
// (TODO): Add a start function that creates a try catch to protect from crashing the whole potato.
global['EndFunction'] = Debug['CallStack']['Pop'];
global['Reset'] = function () { Memory.RESET = true; return OK; };
global['reset'] = Reset;

// Objects
global['RoomFunctions'] = require('RoomFunctions');
global['Delegate'] = require('Delegate');
global['ContractAgency'] = require('ContractAgency');

//Managers
for (let ManagerNameId in Managers_Enum) {
    global[Managers_Enum[ManagerNameId]] = require(Managers_Enum[ManagerNameId]);
}