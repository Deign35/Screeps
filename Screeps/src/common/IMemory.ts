class IMemory extends IDisposable {
    readonly MemoryId: string;
    constructor() { super(); };
    Load() {};
    Save() {};
}

global['IMemory'] = IMemory;