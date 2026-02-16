import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import javaLang from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import plaintext from 'highlight.js/lib/languages/plaintext';
import yaml from 'highlight.js/lib/languages/yaml';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import kotlin from 'highlight.js/lib/languages/kotlin';
import sql from 'highlight.js/lib/languages/sql';
import markdown from 'highlight.js/lib/languages/markdown';
import swift from 'highlight.js/lib/languages/swift';

export const lowlight = createLowlight({
    javascript,
    typescript,
    python,
    css,
    xml,
    json,
    bash,
    java: javaLang,
    cpp,
    plaintext,
    yaml,
    csharp,
    go,
    php,
    ruby,
    rust,
    kotlin,
    sql,
    markdown,
    swift
});
