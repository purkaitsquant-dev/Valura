import katex from 'katex';
try {
  console.log(katex.renderToString("LR < \\$100,000"));
} catch(e) {
  console.log(e.message);
}
