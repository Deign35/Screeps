// (TODO): Add a start function that creates a try catch to protect from crashing the whole potato.
global['StartFunction'] = Debug['CallStack']['Push'];
global['EndFunction'] = Debug['CallStack']['Pop'];
global['Reset'] = function () { Memory.RESET = true; return OK; };

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