import {Parser} from "../../src/parser/Parser";
describe("Paser Test", () => {
    const taghelpers = (expectTagName: string, expectAttrs: {[name: string]: string}) => {
        return {
            onCloseTag: (name) => {
                console.log("+++++++++++++++++++++++++++onCloseTag+++++++++++++++++++++++++++", name);
                expect(name).toEqual(expectTagName);
            } ,
            onOpenTag: (name, attrs) => {
                console.log("+++++++++++++++++++++++++++onOpenTag+++++++++++++++++++++++++++", name, attrs);
                expect(name).toEqual(expectTagName);
                expect(attrs).toEqual(expectAttrs);
            },
            onOpenTagEnd() {
                console.log("+++++++++++++++++++++++++++onOpenTagEnd+++++++++++++++++++++++++++");
            },
            onOpenTagName: (name: string) => {
                console.log("+++++++++++++++++++++++++++onOpenTag+++++++++++++++++++++++++++", name);
                expect(name).toEqual(expectTagName);
            },
            onAttr: (name: string, value: string) => {
                console.log("+++++++++++++++++++++++++++onAttr+++++++++++++++++++++++++++", name, value);
            },
            onAttrName: (name: string) => {
                console.log("+++++++++++++++++++++++++++onAttrName+++++++++++++++++++++++++++", name);
            },
            onAttrData: (data: string) => {
                console.log("+++++++++++++++++++++++++++onAttrData+++++++++++++++++++++++++++", data);
            },
            onAttrEnd: () => {
                console.log("+++++++++++++++++++++++++++onAttrEnd+++++++++++++++++++++++++++");
            }
        };
    };
    const commenthelpers = (expectData: string) => {
        return {
            onComment: (data: string) => {
                console.log("+++++++++++++++++++++++++++onComment+++++++++++++++++++++++++++", expectData);
            },
            onCommentStart: () => {
                console.log("+++++++++++++++++++++++++++onCommentStart+++++++++++++++++++++++++++");
            },
            onCommentEnd: () => {
                console.log("+++++++++++++++++++++++++++onCommentEnd+++++++++++++++++++++++++++");
            }
        };
    };
    const cdatahelpers = (expectData: string) => {
        return {
            onCdata: (data: string) => {
                console.log("+++++++++++++++++++++++++++onCdata+++++++++++++++++++++++++++", expectData);
            },
            onCdataStart: () => {
                console.log("+++++++++++++++++++++++++++onCdataStart+++++++++++++++++++++++++++");
            },
            onCdataEnd: () => {
                console.log("+++++++++++++++++++++++++++onCdataEnd+++++++++++++++++++++++++++");
            }
        };
    };
    it("close tag test:", () => {
        const parser = new Parser(taghelpers("div" , {}));
        parser.parse("<div></div>");
    });
    it("open tag test:", () => {
        const parser = new Parser(taghelpers("br" , {}));
        parser.parse("<br>");
    });
    it("self close tag test:", () => {
        const parser = new Parser(taghelpers("br" , {}));
        parser.parse("<br/>");
    });
    it("attr single quote test:", () => {
        console.clear();
        const parser = new Parser(taghelpers("div" , {attr1: "a" }));
        parser.parse(`<div attr1='a'></div>`);
    });
    it("attr double quote test:", () => {
        console.clear();
        const parser = new Parser(taghelpers("div" , { attr1: "a" }));
        parser.parse(`<div attr1="a"></div>`);
    });
    it("attr no quote test:", () => {
        console.clear();
        const parser = new Parser(taghelpers("div" , { attr1: "a" }));
        parser.parse("<div attr1=a></div>");
    });
    it("mutliple attrs test:", () => {
        console.clear();
        const parser = new Parser(taghelpers("div" , { attr1: "a", attr2: "b", attr3: "123", attr4: "124" }));
        parser.parse(`<div attr1=a attr2='b' attr3="123" attr4=124></div>`);
    });

    it("comment test:", () => {
            console.clear();
            const parser = new Parser(commenthelpers(`text`));
            parser.parse(`<!--text-->`);
    });
    it("cdata test:", () => {
            console.clear();
            const parser = new Parser(cdatahelpers(`text`));
            parser.parse(`<![CDATA[text]]>`);
    });
    it("conditon comment test:", () => {
            console.clear();
            const parser = new Parser(cdatahelpers(`[if IE]>用于 IE <![endif]`));
            parser.parse(`<!--[if IE]>用于 IE <![endif]-->`);
    });
    it("conditon embedded comment test:", () => {
        console.clear();
        const parser = new Parser(cdatahelpers(`[if IE]>用于 IE <![endif]`));
        parser.parse(`<!--[if IE 6]><!--> IE6 or Non-IE <!--<![endif]-->`);
    });
});
