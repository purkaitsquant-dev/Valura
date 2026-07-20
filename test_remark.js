import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';

const md = String.raw`- First income = $\text{\$50,000} \times 1.03^{20} = \text{\$90,305}$.`;
const tree = unified().use(remarkParse).use(remarkMath).parse(md);
console.log(JSON.stringify(tree, null, 2));
