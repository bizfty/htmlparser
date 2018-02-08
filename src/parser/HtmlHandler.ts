import { CallbackState } from "./CallbackState";
import { ParserOptions } from "./ParserOptions";
import { Parser } from "./Parser";
import { HtmlHandlerOptions } from "./HtmlHandlerOptions";
import { AstNode } from "../vnode/AstNode";
import { AstTag } from "../vnode/AstTag";
import { AstNodeType } from "../vnode/AstNodeType";
import { AstText } from "../vnode/AstText";
import { AstComment } from "../vnode/AstComment";
import { AstCdata } from "../vnode/AstCdata";
import { ErrorHandler } from "./ErrorHandler";

export class HtmlHandler implements CallbackState {
    private static WhiteSpaceRe = /\s+/g;
    private _dom: AstNode[];
    private _stack: any[];
    private _done: boolean;
    private _options: HtmlHandlerOptions;
    private _parser: Parser;
    private _elementCallBack: any;
    private _errorHandler: ErrorHandler ;
    private defaultOptions: HtmlHandlerOptions = {
        normalizeWhitespace: true,
        withStartIndices: true,
        withEndIndices: true
    };
    public constructor(errorHandler?: ErrorHandler , options?: HtmlHandlerOptions , elementCallback?: any) {
        this._errorHandler = errorHandler;
        this._options = options || this.defaultOptions;
        this._elementCallBack = elementCallback;
        this._dom = [];
        this._done = false;
        this._stack = [];
    }
    public onParseInit(parser: Parser) {
        this._parser = parser;
    }
    public onReset() {
        HtmlHandler.call(this, this._errorHandler, this._options, this._elementCallBack);
    }
    public onEnd() {
        if (this._done) {
            return;
        }
        this._done = true;
        this._parser = null;
        this.handleCallback(null);
    }
    public onError(error: Error , ...args: any[]) {
        this.handleCallback(error);
    }
    public onCloseTag() {
        const elem = this._stack.pop();
        if (this._options.withEndIndices) {
            // elem.endIndex = this._parser.endIndex;
        }
        if (this._elementCallBack) {
            this._elementCallBack(elem);
        }
    }
    public onOpenTag(name: string, attrs: {[name: string]: string}) {
        const node = new AstTag(name);
        node.attrs = attrs;
        this.addNode(node);
        this._stack.push(node);
    }
    public onText(data: string) {
        let lastTag: AstNode;
        if (!this._stack.length && this._dom.length && (lastTag = this._dom[this._dom.length - 1]).type === AstNodeType.TEXT) {
            if (lastTag instanceof AstText) {
                if (this._options.normalizeWhitespace) {
                    lastTag.data = (lastTag.data + data).replace(HtmlHandler.WhiteSpaceRe, " ");
                } else {
                    lastTag.data += data;
                }
            }
        } else {
            if (this._stack.length && this._stack[this._stack.length - 1]) {
                lastTag = this._stack[this._stack.length - 1];
                if (lastTag instanceof AstTag && lastTag.children[lastTag.children.length - 1]) {
                    lastTag = lastTag.children[lastTag.children.length - 1];
                    if (lastTag instanceof AstText) {
                        if (this._options.normalizeWhitespace) {
                            lastTag.data = (lastTag.data + data).replace(HtmlHandler.WhiteSpaceRe, " ");
                        } else {
                            lastTag.data += data;
                        }
                    }
                }
            } else {
                if (this._options.normalizeWhitespace) {
                    data = data.replace(HtmlHandler.WhiteSpaceRe, " ");
                }
                const element = new AstText(data);
                this.addNode(element);
            }
        }
    }
    public onComment(data: string) {
        const lastTag: AstNode = this._stack[this._stack.length - 1];
        if (lastTag && lastTag instanceof AstComment ) {
            lastTag.data += data;
            return;
        }
        const element = new AstComment(data);
        this.addNode(element);
        this._stack.push(element);
    }
    public onCdataStart() {
        const element = new AstCdata("");
        this.addNode(element);
        this._stack.push(element);
    }
    public onCommentEnd() {
        this._stack.pop();
    }
    public onCdataEnd() {
        this._stack.pop();
    }
    public onProcessingInstruction(name: string , data: string ) {
        console.log("onProcessingInstruction");
        // todo this.addNode();
    }
    private addNode(node: AstNode) {
        console.log("addNode" , node );
    }

    private handleCallback(error: Error, ...args: any[]) {
        if (!!this._errorHandler) {
            this._errorHandler.error(error, this._dom);
        } else {
            if (error) {
                throw error;
            }
        }
    }
}
