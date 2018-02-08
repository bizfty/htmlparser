import {FormTags} from "./FormTags";
export const OpenImpliesCloseTags = {

    tr      : { tr: true, th: true, td: true },
    th      : { th: true },
    td      : { thead: true, th: true, td: true },
    body    : { head: true, link: true, script: true },
    li      : { li: true },
    p       : { p: true },
    h1      : { p: true },
    h2      : { p: true },
    h3      : { p: true },
    h4      : { p: true },
    h5      : { p: true },
    h6      : { p: true },
    select  : FormTags,
    input   : FormTags,
    output  : FormTags,
    button  : FormTags,
    datalist: FormTags,
    textarea: FormTags,
    option  : { option: true },
    optgroup: { optgroup: true }
}
