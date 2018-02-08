import { Tokenizer } from "./Tokenizer";
export interface ParserOptions {
    keepComment: boolean;
    lowerCaseTags: boolean;
    lowerCaseAttribute: boolean;
    recognizeSelfClosing: boolean;
    recognizeCDATA: boolean;
    xmlMode: boolean;
    Tokenizer?: Tokenizer;
}
