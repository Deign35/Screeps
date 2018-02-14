declare class IDisposable {
    constructor();
    dispose(): void;
}
declare function using<T extends IDisposable>(resource: T, func: (resource: T) => void): void;
