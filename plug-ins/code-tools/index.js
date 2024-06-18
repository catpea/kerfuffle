import {parseScript} from 'esprima';

export function getFunctionSignature(src){

  console.log(src);
  const response = [];
  src = src.replace(/\?\./g, '.')
  const ast = parseScript(src, { tolerant: true });

  console.log(ast.body[0].params);

  for (const param of ast.body[0].params) {
    switch (param.type) {
      case 'Identifier':
        response.push(param.name)
        break;
      case 'AssignmentPattern':
        response.push(param.left.name)

        break;
      case 'ObjectPattern':
        response.push('{...}')

        break;
      default:
        response.push(JSON.stringify(param))

    }
  }

  // BUG: esbuild renames variables by assing a number at the end, I do that to with x x1 x2 n1 so there is no esay fix
  // response = response.map(name=>name.replace(/\d+$/,'')); 

  return response;
}
