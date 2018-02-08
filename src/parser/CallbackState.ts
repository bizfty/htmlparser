export interface CallbackState {

    onText?(data: string): void;

    onAttr?(name: string, value: string): void;
    onAttrName?(name: string): void;
    onAttrData?(data: string): void;
    onAttrEnd?(): void;

    onOpenTag?(name: string , attrs: {[name: string]: string}): void;
    onOpenTagName?(data: string): void;
    onOpenTagEnd?(): void;

    onCloseTag?(name: string): void;
    onSelfClosingTag?(): void;
    onDeclaration?(data: string): void;
    onProcessingInstruction?(name: string, value?: string): void;

    onComment?(data: string): void;
    onCommentStart?(): void;
    onCommentEnd?(): void;

    onCdata?(data: string): void;
    onCdataStart?(): void;
    onCdataEnd?(): void;

    onError?(error: Error, ...args: any[]): void;
    onReset?(): void;

    onEnd?(): void;
    onParseInit?(parser: CallbackState): void;
}
