import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const md = `| C2 | What % of income available for long‑term savings? | >30%=10, 20‑30%=8, 10‑20%=6, 5‑10%=4, <5%=2 |`;

const res = renderToString(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
  children: md
}));
console.log(res);
