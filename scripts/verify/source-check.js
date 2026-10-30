// Parse all owned modules. Optionally prove a file reorganization preserved
// every active segment's syntax tree, independent of formatting and comments.
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const acorn = require('acorn');
const root = path.resolve(__dirname, '../..');

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  });
}

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== 'object') return value;
  // Parentheses may regroup a chain of the same short-circuit operator without
  // changing operand order, evaluation or return values.
  if (value.type === 'LogicalExpression') {
    const operands = [];
    function collect(node) {
      if (node.type === 'LogicalExpression' && node.operator === value.operator) {
        collect(node.left);
        collect(node.right);
      } else operands.push(normalize(node));
    }
    collect(value);
    return { type: value.type, operator: value.operator, operands };
  }
  const result = Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !['start', 'end', 'loc', 'raw'].includes(key))
      .map(([key, child]) => [key, normalize(child)]),
  );
  // Quoted and unquoted object keys are equivalent. Prettier may unquote them.
  if (value.type === 'Property' && !value.computed && value.key.type === 'Identifier') {
    result.key = { type: 'Literal', value: value.key.name };
  }
  return result;
}

function segments(source) {
  const ast = acorn.parse(source, { ecmaVersion: 'latest' });
  const result = {};
  for (const statement of ast.body) {
    const expression = statement.type === 'ExpressionStatement' && statement.expression;
    if (
      expression?.type === 'AssignmentExpression' &&
      expression.left.type === 'MemberExpression' &&
      expression.left.object.name === 'AppParts'
    ) {
      result[expression.left.property.value] = normalize(expression.right);
    }
  }
  return result;
}

const current = {};
const entry = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const file of files(path.join(root, 'src/modules')).filter((file) => file.endsWith('.js'))) {
  const found = segments(fs.readFileSync(file, 'utf8'));
  if (Object.keys(found).length !== 1) throw new Error(`${file}: expected one segment`);
  const name = Object.keys(found)[0];
  const expected = path
    .relative(path.join(root, 'src/modules'), file)
    .replace(/\\/g, '/')
    .slice(0, -3);
  if (name !== expected || Object.hasOwn(current, name)) {
    throw new Error(`${file}: mismatched path or duplicate registration`);
  }
  const reference = path.relative(root, file).replace(/\\/g, '/');
  if (entry.split(`src="${reference}"`).length !== 2) {
    throw new Error(`${file}: must be loaded exactly once by index.html`);
  }
  Object.assign(current, found);
}
const boot = fs.readFileSync(path.join(root, 'src/boot.js'), 'utf8');
acorn.parse(boot, { ecmaVersion: 'latest' });
const order = [...boot.matchAll(/^\s*'([^']+)',/gm)].map((match) => match[1]);
const active = new Set(order);
if (
  active.size !== order.length ||
  active.size !== Object.keys(current).length ||
  [...active].some((name) => !Object.hasOwn(current, name))
) {
  throw new Error('Boot order must match registered modules exactly once');
}
console.log(`Syntax: ${Object.keys(current).length} modules and boot passed`);

const against = process.argv.indexOf('--against');
if (against >= 0) {
  const snapshot = JSON.parse(fs.readFileSync(process.argv[against + 1], 'utf8'));
  const previous = {};
  for (const [file, source] of Object.entries(snapshot)) {
    if (file.startsWith('src/modules/')) Object.assign(previous, segments(source));
  }
  const differences = [...active].filter(
    (name) => !isDeepStrictEqual(current[name], previous[name]),
  );
  const priorBoot = normalize(acorn.parse(snapshot['src/boot.js'], { ecmaVersion: 'latest' }));
  if (!isDeepStrictEqual(normalize(acorn.parse(boot, { ecmaVersion: 'latest' })), priorBoot)) {
    differences.push('boot');
  }
  if (differences.length) throw new Error('Changed syntax trees: ' + differences.join(', '));
  console.log(`AST equivalence: ${active.size} active segments and boot unchanged`);
}
