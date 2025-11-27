import { createLowlight } from "lowlight";
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

lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);
lowlight.register("python", python);
lowlight.register("py", python);
lowlight.register("cpp", cpp);
lowlight.register("c++", cpp);
lowlight.register("cxx", cpp);
lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("json", json);
lowlight.register("css", css);
lowlight.register("html", html);
lowlight.register("bash", bash);
lowlight.register("sh", bash);
lowlight.register("sql", sql);

export { lowlight };

