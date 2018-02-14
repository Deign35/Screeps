declare class IMemory extends IDisposable {
    readonly MemoryId: string;
    constructor();
    Load(): void;
    Save(): void;
}
