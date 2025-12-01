import { createLowlight, type LanguageFn } from "lowlight";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import cpp from "highlight.js/lib/languages/cpp";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";

const lowlight = createLowlight();

lowlight.register("typescript", typescript as unknown as LanguageFn);
lowlight.register("ts", typescript as unknown as LanguageFn);
lowlight.register("python", python as unknown as LanguageFn);
lowlight.register("py", python as unknown as LanguageFn);
lowlight.register("cpp", cpp as unknown as LanguageFn);
lowlight.register("c++", cpp as unknown as LanguageFn);
lowlight.register("cxx", cpp as unknown as LanguageFn);
lowlight.register("javascript", javascript as unknown as LanguageFn);
lowlight.register("js", javascript as unknown as LanguageFn);
lowlight.register("json", json as unknown as LanguageFn);
lowlight.register("css", css as unknown as LanguageFn);
lowlight.register("html", html as unknown as LanguageFn);
lowlight.register("bash", bash as unknown as LanguageFn);
lowlight.register("sh", bash as unknown as LanguageFn);
lowlight.register("sql", sql as unknown as LanguageFn);

export { lowlight };
