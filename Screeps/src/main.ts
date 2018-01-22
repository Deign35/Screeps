require('declared_common');

export const loop = function () {
    let loopCache = new Cache('abc');
    loopCache.Save();
    loopCache.Load();
};

export class Cache extends IMemory {
    readonly memId: string;
    constructor(id: string) {
        super();
        this.memId = id;
        this.Load();
    }
    Load(): void {
        console.log('Rock');
    }
    Save(): void {
        console.log('Roll');
    }
}

let TestFunc = require('Actions_TestFile');
global['TestFunc'] = TestFunc.TestFunc;