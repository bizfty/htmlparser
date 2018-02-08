import { ErrorHandler } from "./ErrorHandler";

export class HtmlErrorHandler implements ErrorHandler {
    public error(error: Error, ...args: any[]) {
        console.log(error, args);
    }
}
