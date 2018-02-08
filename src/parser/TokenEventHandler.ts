import { CallbackState } from "./CallbackState";

export interface TokenEventHandler {

    onText(): void;

    onAttr(): void;
    onAttrName(): void;
    onAttrNameEnd(): void;
    onAttrData(data: string): void;
    onAttrDataEnd(data: string): void;
    onAttrEnd(): void;

    onOpenTag(name: string , attrs: {[name: string]: string}): void;
    onOpenTagName(data: string): void;
    onOpenTagEnd(): void;

    onTag(): void;
    onTagEnd(): void;
    onCloseTag(name: string): void;

    onSelfClosingTag(): void;
    onDeclaration(data: string): void;
    onProcessingInstruction?(name: string, value?: string): void;

    onComment(): void;
    onCommentEnd(): void;
    onCdata(): void;
    onCdataEnd(): void;

    onError?(error: Error, ...args: any[]): void;
    onReset?(): void;

    onEnd?(): void;
    onParseInit?(parser: CallbackState): void;
}
