import esprima from 'esprima';
import escodegen from 'escodegen';

const esprimaOptions = {
  sourceType: 'module',
  comment: true,
  range: true,
  loc: true,
  tokens: true,
  raw: false,
};

module.exports = {
  parseJSSource(content) {
    let tree = esprima.parse(content, esprimaOptions);
    tree = escodegen.attachComments(tree, tree.comments, tree.tokens);
    return tree;
  },
};
