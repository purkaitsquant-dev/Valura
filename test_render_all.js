import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { readFileSync } from 'fs';

const content = readFileSync('src/components/InfoPage.tsx', 'utf8');
const md = content.split('const markdownContent = String.raw`')[1].split('`;')[0];

try {
  const res = renderToString(React.createElement(ReactMarkdown, {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex],
    children: md
  }));
  if (res.includes('katex-error')) {
    console.log("FOUND KATEX ERROR!");
    const errors = res.match(/<span class="katex-error"[^>]*>([^<]*)<\/span>/g);
    console.log(errors);
  } else {
    console.log("All clear, no KaTeX errors.");
  }
} catch(e) {
  console.log("Exception:", e.message);
}
