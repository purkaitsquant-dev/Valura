import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const md = `
Ticket Size: if $LR < \\$100,000$ → no structured product.
`;

const res = renderToString(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
  children: md
}));
console.log(res);
