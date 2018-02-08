export interface ErrorHandler {
    error(error: Error, ...args: any[]): void;
}
