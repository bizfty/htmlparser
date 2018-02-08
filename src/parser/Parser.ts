import { ParserOptions } from "./ParserOptions";
import { Tokenizer } from "./Tokenizer";
import { CallbackState } from "./CallbackState";
import { VoidTag } from "./VoidTag";
import { OpenImpliesCloseTags } from "./OpenImpliesCloseTags";
export class Parser implements CallbackState {
    private static nameEndRg = /\s|\//;
    private _options: ParserOptions;
    private _defaultOptions: ParserOptions = {
        keepComment: true,
        lowerCaseTags: true,
        lowerCaseAttribute: true,
        recognizeSelfClosing: true,
        recognizeCDATA: true,
        xmlMode: true
    };
    private _cbs: CallbackState;
    private _tagName: string;
    private _attrName: string;
    private _attrValue: string;
    private _attrs: {[ name: string ]: string};
    private _stack: string[];
    private _startIndex: number;
    private _endIndex: number;
    private _tokenizer: Tokenizer;
    public constructor(cbs?: CallbackState, options?: ParserOptions) {
        this._options = options || this._defaultOptions;
        this._cbs = cbs || {};
        this._tagName = "";
        this._attrName = "";
        this._attrValue = "";
        this._attrs = null;
        this._stack = [];
        this._startIndex = 0;
        this._endIndex = null;
        if (this._options.Tokenizer) {
            Tokenizer = this._options.Tokenizer;
        }
        this._tokenizer = new Tokenizer(this._options, this);
    }
    public onText(data: string) {
        this.updatePosition(1);
        this._endIndex--;
        if (this._cbs.onText) {
            this._cbs.onText(data);
        }
    }
    public onOpenTagName(name: string) {
        if (this._options.lowerCaseTags) {
            name = name.toLowerCase();
        }
        this._tagName = name;
        if (!this._options.xmlMode && name in OpenImpliesCloseTags) {
            let el: string = this._stack[this._stack.length - 1];
            while (!!el && (el in OpenImpliesCloseTags[name]) ) {
                this.onCloseTag(el);
                el = this._stack[this._stack.length - 1];
            }
        }
        if (this._options.xmlMode || !(name in VoidTag)) {
            this._stack.push(name);
        }
        if (this._cbs.onOpenTagName) {
            this._cbs.onOpenTagName(name);
        }
        if (this._cbs.onOpenTag) {
            this._attrs = {};
        }
    }
    public onOpenTagEnd() {
        this.updatePosition(1);
        if (this._attrs) {
            if (this._cbs.onOpenTag) {
                this._cbs.onOpenTag(this._tagName, this._attrs);
            }
            this._attrs = null;
        }
        if (!this._options.xmlMode && this._cbs.onCloseTag && this._tagName in VoidTag) {
            this._cbs.onCloseTag(this._tagName);
        }
        this._tagName = "";
    }
    public onCloseTag(name: string) {
        this.updatePosition(1);
        if (this._options.lowerCaseTags) {
            name = name.toLowerCase();
        }
        if (this._stack.length && (!(name in VoidTag) || this._options.xmlMode)) {
            let pos = this._stack.lastIndexOf(name);
            if (pos !== -1) {
                if (this._cbs.onCloseTag) {
                    pos = this._stack.length - pos;
                    while (pos--) {
                        this._cbs.onCloseTag(this._stack.pop());
                    }
                } else {
                    this._stack.length = pos;
                }
            } else if (name === "p" && !this._options.xmlMode) {
                this.onOpenTagName(name);
                this.closeCurrentTag();
            }
        } else if (!this._options.xmlMode && (name === "br" || name === "p")) {
            this.onOpenTagName(name);
            this.closeCurrentTag();
        }
    }
    public onSelfClosingTag() {
        if (this._options.xmlMode || this._options.recognizeSelfClosing) {
            this.closeCurrentTag();
        } else {
            this.onOpenTagEnd();
        }
    }
    public onAttrName(name: string) {
        if (this._options.lowerCaseAttribute) {
            name = name.toLowerCase();
        }
        this._attrName = name;
    }
    public onAttrData(value: string) {
        this._attrValue += value;
    }
    public onAttrEnd() {
        if (this._cbs.onAttr) {
            this._cbs.onAttr(this._attrName, this._attrValue);
        }
        if ( this._attrs && !Object.prototype.hasOwnProperty.call(this._attrs, this._attrName) ) {
            this._attrs[this._attrName] = this._attrValue;
        }
        this._attrName = "";
        this._attrValue = "";
    }
    public getInstructionName(value: string) {
        const idx = value.search(Parser.nameEndRg);
        let name = idx < 0 ? value : value.substr(0, idx);

        if (this._options.lowerCaseTags) {
            name = name.toLowerCase();
        }
        return name;
    }
    public onDeclaration(value: string) {
        if (this._cbs.onProcessingInstruction) {
            const name = this.getInstructionName(value);
            this._cbs.onProcessingInstruction("!" + name, "!" + value);
        }
    }
    public onProcessingInstruction(value: string) {
        if (this._cbs.onProcessingInstruction) {
            const name = this.getInstructionName(value);
            this._cbs.onProcessingInstruction("?" + name, "?" + value);
        }
    }
    public onComment(value: string) {
        this.updatePosition(4);
        if (this._cbs.onComment) {
            this._cbs.onComment(value);
        }
        if (this._cbs.onCommentStart) {
            this._cbs.onCommentStart();
        }
        if (this._cbs.onText) {
            this._cbs.onText(value);
        }
        if (this._cbs.onCommentEnd) {
            this._cbs.onCommentEnd();
        }
    }
    public onCdata(value: string) {
        this.updatePosition(1);
        if (this._cbs.onCdata) {
            this._cbs.onCdata(value);
        }
        if (this._options.xmlMode || this._options.recognizeCDATA) {
            if (this._cbs.onCdataStart) {
                this._cbs.onCdataStart();
            }
            if (this._cbs.onText) {
                this._cbs.onText(value);
            }
            if (this._cbs.onCdataEnd) {
                this._cbs.onCdataEnd();
            }
        } else {
            this.onComment("[CDATA[" + value + "]]");
        }
    }
    public onEnd() {
        if (this._cbs.onCloseTag) {
            let i = this._stack.length;
            while (i > 0) {
                this._cbs.onCloseTag(this._stack[--i]);
            }
        }
        if (this._cbs.onEnd) {
            this._cbs.onEnd();
        }
    }
    public onError(error: Error, ...args: any[]) {
        if (this._cbs.onError) {
            this._cbs.onError(error);
        }
    }
    public reset() {
        if (this._cbs.onReset) {
            this._cbs.onReset();
        }
        this._tokenizer.reset();
        this._tagName = "";
        this._attrName = "";
        this._attrs = null;
        this._stack = [];
        if (this._cbs.onParseInit) {
            this._cbs.onParseInit(this);
        }
    }

    /**
     * Parses a complete HTML document and pushes it to the handler
     * @param data
     */
    public parseComplete(data: any) {
        this.reset();
        this.end(data);
    }
    public write(chunk: string) {
        this._tokenizer.write(chunk);
    }
    public parse(chunk: string) {
        this._tokenizer.write(chunk);
        this._tokenizer.end();
    }
    public end(chunk: any) {
        this._tokenizer.end(chunk);
    }
    private closeCurrentTag() {
        const name = this._tagName;
        this.onOpenTagName(name);
        // self-closing tags will be on the top of the stack
        // (cheaper check than in onclosetag)
        if (this._stack[this._stack.length - 1] === name) {
            if (this._cbs.onCloseTag) {
                this._cbs.onCloseTag(name);
            }
            this._stack.pop();
        }
    }

    private updatePosition(initialOffset: number) {
        if (this._endIndex === null) {
            if (this._tokenizer.sectionStart <= initialOffset) {
                this._startIndex = 0;
            } else {
                this._startIndex = this._tokenizer.sectionStart - initialOffset;
            }
        }
    }
}
