import katex from 'katex';
try {
  console.log(katex.renderToString("\\text{\\$90,305}"));
} catch(e) {
  console.log(e.message);
}
