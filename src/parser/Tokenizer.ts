import { ParserOptions } from "./ParserOptions";
import { Token } from "./Token";
import { Special } from "./Special";
import { CallbackState } from "./CallbackState";
import { decodeCodePoint } from "../utils";
import entitiesMap from "../maps/entities.json";
import legacyMap from "../maps/legacy.json";
import xmlMap from "../maps/xml.json";

export class Tokenizer {
    private static EntityMap = entitiesMap;
    private static LegacyMap = legacyMap;
    private static XmlMap = xmlMap;
    private _sectionStart: number;
    private _state: Token;
    private _buffer: string;
    private _index: number;
    private _bufferOffset: number;
    private _baseState: Token;
    private _special: Special;
    private _cbs: CallbackState;
    private _running: boolean;
    private _ended: boolean;
    private _xmlMode: boolean;
    private _decodeEntities: boolean;
    public constructor(options: ParserOptions, cbs: CallbackState) {
        this._state = Token.TEXT;
        this._buffer = "";
        this._sectionStart = 0;
        this._index = 0;
        this._bufferOffset = 0; // chars removed from _buffer
        this._baseState = Token.TEXT;
        this._special = Special.NONE;
        this._cbs = cbs;
        this._running = true;
        this._ended = false;
        this._xmlMode = false;
        this._decodeEntities = false;
    }
    public parse() {
        while (this._index < this._buffer.length && this._running) {
            const c = this._buffer.charAt(this._index);
            if (this._state === Token.TEXT) {
                this.stateText(c);
            } else if (this._state === Token.BEFORE_TAG_NAME) {
                this.stateBeforeTagName(c);
            } else if (this._state === Token.IN_TAG_NAME) {
                this.stateInTagName(c);
            } else if (this._state === Token.BEFORE_CLOSING_TAG_NAME) {
                this.stateBeforeCloseingTagName(c);
            } else if (this._state === Token.IN_CLOSING_TAG_NAME) {
                this.stateInCloseingTagName(c);
            } else if (this._state === Token.AFTER_CLOSING_TAG_NAME) {
                this.stateAfterCloseingTagName(c);
            } else if (this._state === Token.IN_SELF_CLOSING_TAG) {
                this.stateInSelfClosingTag(c);
            } else if (this._state === Token.BEFORE_ATTRIBUTE_NAME) {
                this.stateBeforeAttributeName(c);
            } else if (this._state === Token.IN_ATTRIBUTE_NAME) {
                this.stateInAttributeName(c);
            } else if (this._state === Token.AFTER_ATTRIBUTE_NAME) {
                this.stateAfterAttributeName(c);
            } else if (this._state === Token.BEFORE_ATTRIBUTE_VALUE) {
                this.stateBeforeAttributeValue(c);
            } else if (this._state === Token.IN_ATTRIBUTE_VALUE_DQ) {
                this.stateInAttributeValueDoubleQuotes(c);
            } else if (this._state === Token.IN_ATTRIBUTE_VALUE_SQ) {
                this.stateInAttributeValueSingleQuotes(c);
            } else if (this._state === Token.IN_ATTRIBUTE_VALUE_NQ) {
                this.stateInAttributeValueNoQuotes(c);
            } else if (this._state === Token.BEFORE_DECLARATION) {
                this.stateBeforeDeclaration(c);
            } else if (this._state === Token.IN_DECLARATION) {
                this.stateInDeclaration(c);
            } else if (this._state === Token.IN_PROCESSING_INSTRUCTION) {
                this.stateInProcessingInstruction(c);
            } else if (this._state === Token.BEFORE_COMMENT) {
                this.stateBeforeComment(c);
            } else if (this._state === Token.IN_COMMENT) {
                this.stateInComment(c);
            } else if (this._state === Token.AFTER_COMMENT_1) {
                this.stateAfterComment1(c);
            } else if (this._state === Token.AFTER_COMMENT_2) {
                this.stateAfterComment2(c);
            } else if (this._state === Token.BEFORE_CDATA_1) {
                this.stateBeforeCdata1(c);
            } else if (this._state === Token.BEFORE_CDATA_2) {
                this.stateBeforeCdata2(c);
            } else if (this._state === Token.BEFORE_CDATA_3) {
                this.stateBeforeCdata3(c);
            } else if (this._state === Token.BEFORE_CDATA_4) {
                this.stateBeforeCdata4(c);
            } else if (this._state === Token.BEFORE_CDATA_5) {
                this.stateBeforeCdata5(c);
            } else if (this._state === Token.BEFORE_CDATA_6) {
                this.stateBeforeCdata6(c);
            } else if (this._state === Token.IN_CDATA) {
                this.stateInCdata(c);
            } else if (this._state === Token.AFTER_CDATA_1) {
                this.stateAfterCdata1(c);
            } else if (this._state === Token.AFTER_CDATA_2) {
                this.stateAfterCdata2(c);
            } else if (this._state === Token.BEFORE_SPECIAL) {
                this.stateBeforeSpecial(c);
            } else if (this._state === Token.BEFORE_SPECIAL_END) {
                this.stateBeforeSpecialEnd(c);
            } else if (this._state === Token.BEFORE_SCRIPT_1) {
                this.stateBeforeScript1(c);
            } else if (this._state === Token.BEFORE_SCRIPT_2) {
                this.stateBeforeScript2(c);
            } else if (this._state === Token.BEFORE_SCRIPT_3) {
                this.stateBeforeScript3(c);
            } else if (this._state === Token.BEFORE_SCRIPT_4) {
                this.stateBeforeScript4(c);
            } else if (this._state === Token.BEFORE_SCRIPT_5) {
                this.stateBeforeScript5(c);
            } else if (this._state === Token.AFTER_SCRIPT_1) {
                this.stateAfterScript1(c);
            } else if (this._state === Token.AFTER_SCRIPT_2) {
                this.stateAfterScript2(c);
            } else if (this._state === Token.AFTER_SCRIPT_3) {
                this.stateAfterScript3(c);
            } else if (this._state === Token.AFTER_SCRIPT_4) {
                this.stateAfterScript4(c);
            } else if (this._state === Token.AFTER_SCRIPT_5) {
                this.stateAfterScript5(c);
            } else if (this._state === Token.BEFORE_STYLE_1) {
                this.stateBeforeStyle1(c);
            } else if (this._state === Token.BEFORE_STYLE_2) {
                this.stateBeforeStyle2(c);
            } else if (this._state === Token.BEFORE_STYLE_3) {
                this.stateBeforeStyle3(c);
            } else if (this._state === Token.BEFORE_STYLE_4) {
                this.stateBeforeStyle4(c);
            } else if (this._state === Token.AFTER_STYLE_1) {
                this.stateAfterStyle1(c);
            } else if (this._state === Token.AFTER_STYLE_2) {
                this.stateAfterStyle2(c);
            } else if (this._state === Token.AFTER_STYLE_3) {
                this.stateAfterStyle3(c);
            } else if (this._state === Token.AFTER_STYLE_4) {
                this.stateAfterStyle4(c);
            } else if (this._state === Token.BEFORE_ENTITY) {
                this.stateBeforeEntity(c);
            } else if (this._state === Token.BEFORE_NUMERIC_ENTITY) {
                this.stateBeforeNumericEntity(c);
            } else if (this._state === Token.IN_NAMED_ENTITY) {
                this.stateInNamedEntity(c);
            } else if (this._state === Token.IN_NUMERIC_ENTITY) {
                this.stateInNumericEntity(c);
            } else if (this._state === Token.IN_HEX_ENTITY) {
                this.stateInHexEntity(c);
            } else {
                this._cbs.onError(Error("unknown _state"), this._state);
            }
            this._index++;
        }
        this.cleanup();
    }
    public write(chunk) {
        if (this._ended) {
            this._cbs.onError(Error(".write() after done!"));
        }
        this._buffer += chunk;
        this.parse();
    }
    public reset() {
        Tokenizer.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs);
    }
    public end(chunk?: string) {
        if (this._ended) {
            this._cbs.onError(Error(".end() after done!"));
        }
        if (chunk) {
            this.write(chunk);
        }
        this._ended = true;
        if (this._running) {
            this.finish();
        }
    }
    public pause() {
        this._running = false;
    }
    public resume() {
        this._running = true;
        if (this._index < this._buffer.length) {
            this.parse();
        }
        if (this._ended) {
            this.finish();
        }
    }
    private cleanup() {
        if (this._sectionStart < 0) {
            this._buffer = "";
            this._bufferOffset += this._index;
            this._index = 0;
        } else if (this._running) {
            if (this._state === Token.TEXT) {
                if (this._sectionStart !== this._index) {
                    this._cbs.onText(this._buffer.substr(this._sectionStart));
                }
                this._buffer = "";
                this._bufferOffset += this._index;
                this._index = 0;
            } else if (this._sectionStart === this._index) {
                // the section just started
                this._buffer = "";
                this._bufferOffset += this._index;
                this._index = 0;
            } else {
                // remove everything unnecessary
                this._buffer = this._buffer.substr(this._sectionStart);
                this._index -= this._sectionStart;
                this._bufferOffset += this._sectionStart;
            }
            this._sectionStart = 0;
        }
    }
    private finish() {
        // if there is remaining data, emit it in a reasonable way
        if (this._sectionStart < this._index) {
            this.handleTrailingData();
        }
        this._cbs.onEnd();
    }
    private whitespace(c) {
        return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
    }
    private characterState(char: string, SUCCESS: Token) {
        return function(c) {
            if (c === char) {
                this._state = SUCCESS;
            }
        };
    }
    private ifElseState(upper: string, SUCCESS: Token, FAILURE: Token) {
        const lower = upper.toLowerCase();
        if (upper === lower) {
            return (c: string) => {
                if (c === lower) {
                    this._state = SUCCESS;
                } else {
                    this._state = FAILURE;
                    this._index--;
                }
            };
        } else {
            return (c: string) => {
                if (c === lower || c === upper) {
                    this._state = SUCCESS;
                } else {
                    this._state = FAILURE;
                    this._index--;
                }
            };
        }
    }
    private consumeSpecialNameChar(upper: string, NEXT_STATE: Token) {
        const lower = upper.toLowerCase();

        return (c: string) => {
            if (c === lower || c === upper) {
                this._state = NEXT_STATE;
            } else {
                this._state = Token.IN_TAG_NAME;
                this._index--; // consume the token again
            }
        };
    }
    private stateText(c: string) {
        console.log("stateText", c );
        if (c === "<") {
            if (this._index > this._sectionStart) {
                this._cbs.onText(this.section());
            }
            this._state = Token.BEFORE_TAG_NAME;
            this._sectionStart = this._index;
        } else if (this._decodeEntities && this._special === Special.NONE && c === "&") {
            if (this._index > this._sectionStart) {
                this._cbs.onText(this.section());
            }
            this._baseState = Token.TEXT;
            this._state = Token.BEFORE_ENTITY;
            this._sectionStart = this._index;
        }
    }
    private stateBeforeTagName(c: string) {
        console.log("stateBeforeTagName", c );
        if (c === "/") {
            this._state = Token.BEFORE_CLOSING_TAG_NAME;
        } else if (c === "<") {
            this._cbs.onText(this.section());
            this._sectionStart = this._index;
        } else if (c === ">" || this._special !== Special.NONE || this.whitespace(c)) {
            this._state = Token.TEXT;
        } else if (c === "!") {
            this._state = Token.BEFORE_DECLARATION;
            this._sectionStart = this._index + 1;
        } else if (c === "?") {
            this._state = Token.IN_PROCESSING_INSTRUCTION;
            this._sectionStart = this._index + 1;
        } else {
            this._state = (!this._xmlMode && (c === "s" || c === "S")) ? Token.BEFORE_SPECIAL : Token.IN_TAG_NAME;
            this._sectionStart = this._index;
        }
    }
    private stateInTagName(c: string) {
        console.log( "stateInTagName", c );
        if (c === "/" || c === ">" || this.whitespace(c)) {
            this.emitToken("onOpenTagName");
            this._state = Token.BEFORE_ATTRIBUTE_NAME;
            this._index--;
        }
    }
    private stateBeforeCloseingTagName(c: string) {
        console.log("stateBeforeCloseingTagName", c );
        if (this.whitespace(c) ) {
            // do nothing;
        } else if (c === ">") {
            this._state = Token.TEXT;
        } else if (this._special !== Special.NONE) {
            if (c === "s" || c === "S") {
                this._state = Token.BEFORE_SPECIAL_END;
            } else {
                this._state = Token.TEXT;
                this._index--;
            }
        } else {
            this._state = Token.IN_CLOSING_TAG_NAME;
            this._sectionStart = this._index;
        }
    }
    private stateInCloseingTagName(c: string) {
        console.log("stateInCloseingTagName", c );
        if (c === ">" || this.whitespace(c)) {
            console.log("=======================onCloseTag=================");
            this.emitToken("onCloseTag");
            this._state = Token.AFTER_CLOSING_TAG_NAME;
            this._index--;
        }
    }
    private stateAfterCloseingTagName(c: string) {
        console.log("stateAfterCloseingTagName", c );
        // skip everything until ">"
        if (c === ">") {
            this._state = Token.TEXT;
            this._sectionStart = this._index + 1;
        }
    }
    private stateBeforeAttributeName(c: string) {
        console.log("stateBeforeAttributeName", c );
        if (c === ">") {
            console.log("=======================onOpenTagEnd=================");
            this._cbs.onOpenTagEnd();
            this._state = Token.TEXT;
            this._sectionStart = this._index + 1;
        } else if (c === "/") {
            this._state = Token.IN_SELF_CLOSING_TAG;
        } else if (!this.whitespace(c)) {
            this._state = Token.IN_ATTRIBUTE_NAME;
            this._sectionStart = this._index;
        }
    }
    private stateInSelfClosingTag(c: string) {
        if (c === ">") {
            this._cbs.onSelfClosingTag();
            this._state = Token.TEXT;
            this._sectionStart = this._index + 1;
        } else if (!this.whitespace(c)) {
            this._state = Token.BEFORE_ATTRIBUTE_NAME;
            this._index--;
        }
    }
    private stateInAttributeName(c: string) {
        if (c === "=" || c === "/" || c === ">" || this.whitespace(c)) {
            this._cbs.onAttrName(this.section());
            this._sectionStart = -1;
            this._state = Token.AFTER_ATTRIBUTE_NAME;
            this._index--;
        }
    }
    private stateAfterAttributeName(c: string) {
        if (c === "=") {
            this._state = Token.BEFORE_ATTRIBUTE_VALUE;
        } else if (c === "/" || c === ">") {
            this._cbs.onAttrEnd();
            this._state = Token.BEFORE_ATTRIBUTE_NAME;
            this._index--;
        } else if (!this.whitespace(c)) {
            this._cbs.onAttrEnd();
            this._state = Token.IN_ATTRIBUTE_NAME;
            this._sectionStart = this._index;
        }
    }
    private stateBeforeAttributeValue(c: string) {
        if (c === "\"") {
            this._state = Token.IN_ATTRIBUTE_VALUE_DQ;
            this._sectionStart = this._index + 1;
        } else if (c === "'") {
            this._state = Token.IN_ATTRIBUTE_VALUE_SQ;
            this._sectionStart = this._index + 1;
        } else if (!this.whitespace(c)) {
            this._state = Token.IN_ATTRIBUTE_VALUE_NQ;
            this._sectionStart = this._index;
            this._index--; // reconsume token
        }
    }
    private stateInAttributeValueDoubleQuotes(c: string) {
        if (c === "\"") {
            this.emitToken("onAttrData");
            this._cbs.onAttrEnd();
            this._state = Token.BEFORE_ATTRIBUTE_NAME;
        } else if (this._decodeEntities && c === "&") {
            this.emitToken("onAttrData");
            this._baseState = this._state;
            this._state = Token.BEFORE_ENTITY;
            this._sectionStart = this._index;
        }
    }
    private stateInAttributeValueSingleQuotes(c: string) {
        if (c === "'") {
            this.emitToken("onAttrData");
            this._cbs.onAttrEnd();
            this._state = Token.BEFORE_ATTRIBUTE_NAME;
        } else if (this._decodeEntities && c === "&") {
            this.emitToken("onAttrData");
            this._baseState = this._state;
            this._state = Token.BEFORE_ENTITY;
            this._sectionStart = this._index;
        }
    }
    private stateInAttributeValueNoQuotes(c: string) {
        if (this.whitespace(c) || c === ">") {
            this.emitToken("onAttrData");
            this._cbs.onAttrEnd();
            this._state = Token.BEFORE_ATTRIBUTE_NAME;
            this._index--;
        } else if (this._decodeEntities && c === "&") {
            this.emitToken("onAttrData");
            this._baseState = this._state;
            this._state = Token.BEFORE_ENTITY;
            this._sectionStart = this._index;
        }
    }
    private stateBeforeDeclaration(c: string) {
        console.log("stateBeforeDeclaration", c );
        this._state = c === "[" ? Token.BEFORE_CDATA_1 : c === "-" ? Token.BEFORE_COMMENT : Token.IN_DECLARATION;
    }
    private stateInDeclaration(c: string) {
        console.log("stateInDeclaration", c );
        if (c === ">") {
            this._cbs.onDeclaration(this.section());
            this._state = Token.TEXT;
            this._sectionStart = this._index + 1;
        }
    }
    private stateInProcessingInstruction(c: string) {
        if (c === ">") {
            this._cbs.onProcessingInstruction(this.section());
            this._state = Token.TEXT;
            this._sectionStart = this._index + 1;
        }
    }
    private stateBeforeComment(c: string) {
        console.log("stateBeforeComment", c );
        if (c === "-") {
            this._state = Token.IN_COMMENT;
            this._sectionStart = this._index + 1;
        } else {
            this._state = Token.IN_DECLARATION;
        }
    }
    private stateInComment(c: string) {
        console.log("stateInComment", c );
        if (c === "-") {
            this._state = Token.AFTER_COMMENT_1;
        }
    }
    private stateAfterComment1(c: string) {
        console.log("stateAfterComment1", c );
        if (c === "-") {
            this._state = Token.AFTER_COMMENT_2;
        } else {
            this._state = Token.IN_COMMENT;
        }
    }
    private stateAfterComment2(c: string) {
        console.log("stateAfterComment2", c );
        if (c === ">") {
            // remove 2 trailing chars
            this._cbs.onComment(this._buffer.substring(this._sectionStart, this._index - 2));
            this._state = Token.TEXT;
            this._sectionStart = this._index + 1;
        } else if (c !== "-") {
            this._state = Token.IN_COMMENT;
        }
        // todo condition comment no soupport
        // else: stay in AFTER_COMMENT_2 (`--->`)
    }
    private stateBeforeCdata1(c: string) {
        const handler = this.ifElseState("C", Token.BEFORE_CDATA_2, Token.IN_DECLARATION);
        handler(c);
    }
    private stateBeforeCdata2(c: string) {
        const handler = this.ifElseState("D", Token.BEFORE_CDATA_3, Token.IN_DECLARATION);
        handler(c);
    }
    private stateBeforeCdata3(c: string) {
        const handler = this.ifElseState("A", Token.BEFORE_CDATA_4, Token.IN_DECLARATION);
        handler(c);
    }
    private stateBeforeCdata4(c: string) {
        const handler = this.ifElseState("T", Token.BEFORE_CDATA_5, Token.IN_DECLARATION);
        handler(c);
    }
    private stateBeforeCdata5(c: string) {
        const handler = this.ifElseState("A", Token.BEFORE_CDATA_6, Token.IN_DECLARATION);
        handler(c);
    }
    private stateBeforeCdata6(c: string) {
        if (c === "[") {
            this._state = Token.IN_CDATA;
            this._sectionStart = this._index + 1;
        } else {
            this._state = Token.IN_DECLARATION;
            this._index--;
        }
    }
    private stateInCdata(c: string) {
        if (c === "]") {
            this._state = Token.AFTER_CDATA_1;
        }
    }
    private stateAfterCdata1(c: string) {
        return this.characterState("]", Token.AFTER_CDATA_2);
    }
    private stateAfterCdata2(c: string) {
        if (c === ">") {
            // remove 2 trailing chars
            this._cbs.onCdata(this._buffer.substring(this._sectionStart, this._index - 2));
            this._state =  Token.TEXT;
            this._sectionStart = this._index + 1;
        } else if (c !== "]") {
            this._state =  Token.IN_CDATA;
        }
        // else: stay in AFTER_CDATA_2 (`]]]>`)
    }
    private stateBeforeSpecial(c: string) {
        if (c === "c" || c === "C") {
            this._state = Token.BEFORE_SCRIPT_1;
        } else if (c === "t" || c === "T") {
            this._state = Token.BEFORE_STYLE_1;
        } else {
            this._state = Token.IN_TAG_NAME;
            this._index--; // consume the token again
        }
    }
    private stateBeforeSpecialEnd(c: string) {
        if (this._special === Special.SCRIPT && (c === "c" || c === "C")) {
            this._state = Token.AFTER_SCRIPT_1;
        } else if (this._special === Special.STYLE && (c === "t" || c === "T")) {
            this._state = Token.AFTER_STYLE_1;
        } else {
            this._state = Token.TEXT;
        }
    }
    private stateBeforeScript1(c: string) {
        const handler = this.consumeSpecialNameChar("R", Token.BEFORE_SCRIPT_2);
        handler(c);
    }
    private stateBeforeScript2(c: string) {
        const handler = this.consumeSpecialNameChar("I", Token.BEFORE_SCRIPT_3);
        handler(c);
    }
    private stateBeforeScript3(c: string) {
        const handler = this.consumeSpecialNameChar("P", Token.BEFORE_SCRIPT_4);
        handler(c);
    }
    private stateBeforeScript4(c: string) {
        const handler = this.consumeSpecialNameChar("T", Token.BEFORE_SCRIPT_5);
        handler(c);
    }
    private stateBeforeScript5(c: string) {
        if (c === "/" || c === ">" || this.whitespace(c)) {
            this._special = Special.SCRIPT;
        }
        this._state = Token.IN_TAG_NAME;
        this._index--; // consume the token again
    }
    private stateAfterScript1(c: string) {
        const handler = this.ifElseState("R", Token.AFTER_SCRIPT_2, Token.TEXT);
        handler(c);
    }
    private stateAfterScript2(c: string) {
        const handler = this.ifElseState("I", Token.AFTER_SCRIPT_3, Token.TEXT);
        handler(c);
    }
    private stateAfterScript3(c: string) {
        const handler = this.ifElseState("P", Token.AFTER_SCRIPT_4, Token.TEXT);
        handler(c);
    }
    private stateAfterScript4(c: string) {
        const handler = this.ifElseState("T", Token.AFTER_SCRIPT_5, Token.TEXT);
        handler(c);
    }
    private stateAfterScript5(c: string) {
        if (c === ">" || this.whitespace(c)) {
            this._special = Special.NONE;
            this._state = Token.IN_CLOSING_TAG_NAME;
            this._sectionStart = this._index - 6;
            this._index--; // reconsume the token
        } else {
            this._state = Token.TEXT;
        }
    }
    private stateBeforeStyle1(c: string) {
        const handler = this.consumeSpecialNameChar("Y", Token.BEFORE_STYLE_2);
        handler(c);
    }
    private stateBeforeStyle2(c: string) {
        const handler = this.consumeSpecialNameChar("L", Token.BEFORE_STYLE_3);
        handler(c);
    }
    private stateBeforeStyle3(c: string) {
        const handler = this.consumeSpecialNameChar("E", Token.BEFORE_STYLE_4);
        handler(c);
    }
    private stateBeforeStyle4(c: string) {
        if (c === "/" || c === ">" || this.whitespace(c)) {
            this._special = Special.STYLE;
        }
        this._state = Token.IN_TAG_NAME;
        this._index--; // consume the token again
    }
    private stateAfterStyle1(c: string) {
        const handler = this.ifElseState("Y", Token.AFTER_STYLE_2, Token.TEXT);
        handler(c);
    }
    private stateAfterStyle2(c: string) {
        const handler = this.ifElseState("L", Token.AFTER_STYLE_3, Token.TEXT);
        handler(c);
    }
    private stateAfterStyle3(c: string) {
        const handler = this.ifElseState("E", Token.AFTER_STYLE_4, Token.TEXT);
        handler(c);
    }
    private stateAfterStyle4(c: string) {
        if (c === ">" || this.whitespace(c)) {
            this._special = Special.NONE;
            this._state = Token.IN_CLOSING_TAG_NAME;
            this._sectionStart = this._index - 5;
            this._index--; // reconsume the token
        } else {
            this._state = Token.TEXT;
        }
    }
    private stateBeforeEntity(c: string) {
        const handler = this.ifElseState("#", Token.BEFORE_NUMERIC_ENTITY, Token.IN_NAMED_ENTITY);
        handler(c);
    }
    private stateBeforeNumericEntity(c: string) {
        const handler = this.ifElseState("X", Token.IN_HEX_ENTITY, Token.IN_NUMERIC_ENTITY);
        handler(c);
    }
    private parseNamedEntityStrict() {
        // offset = 1
        if (this._sectionStart + 1 < this._index) {
            const entity = this._buffer.substring(this._sectionStart + 1, this._index);
            const map = this._xmlMode ? Tokenizer.XmlMap : Tokenizer.EntityMap;

            if (map.hasOwnProperty(entity)) {
                this.emitPartial(map[entity]);
                this._sectionStart = this._index + 1;
            }
        }
    }
    private parseLegacyEntity() {
        const start = this._sectionStart + 1;
        let limit = this._index - start;
        if (limit > 6) {
            // the max length of legacy entities is 6
            limit = 6;
        }
        while (limit >= 2) {
            // the min length of legacy entities is 2
            const entity = this._buffer.substr(start, limit);

            if (Tokenizer.LegacyMap.hasOwnProperty(entity)) {
                this.emitPartial(Tokenizer.LegacyMap[entity]);
                this._sectionStart += limit + 1;
                return;
            } else {
                limit--;
            }
        }
    }
    private stateInNamedEntity(c: string) {
        if (c === ";") {
            this.parseNamedEntityStrict();
            if (this._sectionStart + 1 < this._index && !this._xmlMode) {
                this.parseLegacyEntity();
            }
            this._state = this._baseState;
        } else if ((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")) {
            if (this._xmlMode) {
                // do nothing
            } else if (this._sectionStart + 1 === this._index) {
                // do nothing
            } else if (this._baseState !== Token.TEXT) {
                if (c !== "=") {
                    this.parseNamedEntityStrict();
                }
            } else {
                this.parseLegacyEntity();
            }
            this._state = this._baseState;
            this._index--;
        }
    }
    private decodeNumericEntity(offset: number, base: number) {
        const sectionStart = this._sectionStart + offset;
        if (sectionStart !== this._index) {
            // parse entity
            const entity = this._buffer.substring(sectionStart, this._index);
            const parsed = parseInt(entity, base);

            this.emitPartial(decodeCodePoint(parsed));
            this._sectionStart = this._index;
        } else {
            this._sectionStart--;
        }
        this._state = this._baseState;
    }
    private stateInNumericEntity(c: string) {
        if (c === ";") {
            this.decodeNumericEntity(2, 10);
            this._sectionStart++;
        } else if (c < "0" || c > "9") {
            if (!this._xmlMode) {
                this.decodeNumericEntity(2, 10);
            } else {
                this._state = this._baseState;
            }
            this._index--;
        }
    }
    private stateInHexEntity(c: string) {
        if (c === ";") {
            this.decodeNumericEntity(3, 16);
            this._sectionStart++;
        } else if ((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")) {
            if (!this._xmlMode) {
                this.decodeNumericEntity(3, 16);
            } else {
                this._state = this._baseState;
            }
            this._index--;
        }
    }

    private handleTrailingData() {
        const data = this._buffer.substr(this._sectionStart);
        if (this._state === Token.IN_CDATA || this._state === Token.AFTER_CDATA_1 || this._state === Token.AFTER_CDATA_2) {
            this._cbs.onCdata(data);
        } else if (this._state === Token.IN_COMMENT || this._state === Token.AFTER_COMMENT_1 || this._state === Token.AFTER_COMMENT_2) {
            this._cbs.onComment(data);
        } else if (this._state === Token.IN_NAMED_ENTITY && !this._xmlMode) {
            this.parseLegacyEntity();
            if (this._sectionStart < this._index) {
                this._state = this._baseState;
                this.handleTrailingData();
            }
        } else if (this._state === Token.IN_NUMERIC_ENTITY && !this._xmlMode) {
            this.decodeNumericEntity(2, 10);
            if (this._sectionStart < this._index) {
                this._state = this._baseState;
                this.handleTrailingData();
            }
        } else if (this._state === Token.IN_HEX_ENTITY && !this._xmlMode) {
            this.decodeNumericEntity(3, 16);
            if (this._sectionStart < this._index) {
                this._state = this._baseState;
                this.handleTrailingData();
            }
        } else if (
            this._state !== Token.IN_TAG_NAME &&
            this._state !== Token.BEFORE_ATTRIBUTE_NAME &&
            this._state !== Token.BEFORE_ATTRIBUTE_VALUE &&
            this._state !== Token.AFTER_ATTRIBUTE_NAME &&
            this._state !== Token.IN_ATTRIBUTE_NAME &&
            this._state !== Token.IN_ATTRIBUTE_VALUE_SQ &&
            this._state !== Token.IN_ATTRIBUTE_VALUE_DQ &&
            this._state !== Token.IN_ATTRIBUTE_VALUE_NQ &&
            this._state !== Token.IN_CLOSING_TAG_NAME
        ) {
            this._cbs.onText(data);
        }
        // else, ignore remaining data
        // TODO add a way to remove current tag
    }
    private section() {
        return this._buffer.substring(this._sectionStart, this._index);
    }
    private emitToken(name: string) {
        this._cbs[name](this.section());
        this._sectionStart = -1;
    }
    private emitPartial(value: string) {
        if (this._baseState !== Token.TEXT) {
            this._cbs.onAttrData(value); // TODO implement the new event
        } else {
            this._cbs.onText(value);
        }
    }
    private absoluteIndex() {
        return this._bufferOffset + this._index;
    }

    public get sectionStart(): number {
        return this._sectionStart;
    }

    public set sectionStart(value: number) {
        this._sectionStart = value;
    }
}
