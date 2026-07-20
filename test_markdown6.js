import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const md = `
Cash: \\$8,000, Bonds: \\$25,000 → \\$$LR = 33,000$ (< \\$100k) → no structured product.
Long‑horizon equity (goals >10yr) = \\$200,000 → > \\$250k? No. So no private overlay yet.
- \\$$PV = 100,000$, \\$$C = 10,000$\\text{/year}
- \\$$FV = 90,305 \\times \\frac{1 - 1.0506^{-30}}{0.0506} \\approx 1,386,000$.
`;

const res = renderToString(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
  children: md
}));
console.log(res);
