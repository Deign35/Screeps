if (Consts.DEBUG_MODE) {
    global['Debug'] = require('Init_Debug');
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

// Functions
global['CreateBody'] = function (bodyparts) {
    let bodyList = [];
    for (let i = 0, length = bodyParts.length; i < length; i++) {
        const part = bodyParts[i];
        for (let j = 0; j < part[0]; j++) {
            bodyList.push(part[1]);
        }
    }
}

//Managers
for (let ManagerNameId in Managers_Enum) {
    global[Managers_Enum[ManagerNameId]] = require('Managers_' + Managers_Enum[ManagerNameId]);
}