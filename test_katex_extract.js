import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const md = String.raw`- First income = $\text{\$50,000} \times 1.03^{20} = \text{\$90,305}$.`;
try {
  const res = renderToString(React.createElement(ReactMarkdown, {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    children: md
  }));
  console.log(res);
} catch(e) {
  console.log("Exception:", e.message);
}
