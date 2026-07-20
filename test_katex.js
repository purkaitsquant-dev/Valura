import katex from 'katex';
try {
  const res = katex.renderToString("R_{ETF} = 0.5 \\times 8.0 + 0.3 \\times 7.5 + 0.2 \\times 9.0 = 8.05\\%");
  console.log("OK");
} catch(e) {
  console.log("ERROR", e.message);
}
