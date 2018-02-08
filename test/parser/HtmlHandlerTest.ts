import { Parser } from "../../src/parser/Parser";
import { HtmlHandler } from "../../src/parser/HtmlHandler";
import { HtmlErrorHandler } from "../../src/parser/HtmlErrorHandler";

describe("html handler test:", function () {
    it("close tag test:", () => {
        console.clear();
        const errorHandler = new HtmlErrorHandler();
        const handler = new HtmlHandler(errorHandler);
        const parser = new Parser(handler);
        parser.parse("<div></div>");
    });
    // it("open tag test:", () => {
    //     console.clear();
    //     const errorHandler = new HtmlErrorHandler();
    //     const handler = new HtmlHandler(errorHandler);
    //     const parser = new Parser(handler);
    //     parser.parse("<br>");
    // });
    // it("self close tag test:", () => {
    //     console.clear();
    //     const errorHandler = new HtmlErrorHandler();
    //     const handler = new HtmlHandler(errorHandler);
    //     const parser = new Parser(handler);
    //     parser.parse("<br/>");
    // });
    // it("attr single quote test:", () => {
    //     console.clear();
    //     const errorHandler = new HtmlErrorHandler();
    //     const handler = new HtmlHandler(errorHandler);
    //     const parser = new Parser(handler);
    //     parser.parse(`<div attr1='a'></div>`);
    // });
    // it("attr double quote test:", () => {
    //     console.clear();
    //     const parser = new Parser(taghelpers("div" , { attr1: "a" }));
    //     parser.parse(`<div attr1="a"></div>`);
    // });
    // it("attr no quote test:", () => {
    //     console.clear();
    //     const parser = new Parser(taghelpers("div" , { attr1: "a" }));
    //     parser.parse("<div attr1=a></div>");
    // });
    // it("mutliple attrs test:", () => {
    //     console.clear();
    //     const parser = new Parser(taghelpers("div" , { attr1: "a", attr2: "b", attr3: "123", attr4: "124" }));
    //     parser.parse(`<div attr1=a attr2='b' attr3="123" attr4=124></div>`);
    // });
    //
    // it("comment test:", () => {
    //     console.clear();
    //     const parser = new Parser(commenthelpers(`text`));
    //     parser.parse(`<!--text-->`);
    // });
    // it("cdata test:", () => {
    //     console.clear();
    //     const parser = new Parser(cdatahelpers(`text`));
    //     parser.parse(`<![CDATA[text]]>`);
    // });
    // it("conditon comment test:", () => {
    //     console.clear();
    //     const parser = new Parser(cdatahelpers(`[if IE]>用于 IE <![endif]`));
    //     parser.parse(`<!--[if IE]>用于 IE <![endif]-->`);
    // });
    // it("conditon embedded comment test:", () => {
    //     console.clear();
    //     const parser = new Parser(cdatahelpers(`[if IE]>用于 IE <![endif]`));
    //     parser.parse(`<!--[if IE 6]><!--> IE6 or Non-IE <!--<![endif]-->`);
    // });
});
