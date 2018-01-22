/*declare interface IMemory extends IDisposable {
    readonly MemoryId: string;
    Memory: any;
    function Load() => void;
    function Save() => void;
}*/

declare interface IDisposable {
    dispose(): void;
}