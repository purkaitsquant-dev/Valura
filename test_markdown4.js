import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const md = `
$$FV = First\\_Income \\times \\frac{1 - (1 + r_{safe\\_nom})^{-N}}{r_{safe\\_nom}}$$
`;

const res = renderToString(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
  children: md
}));
console.log(res);
