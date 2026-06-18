const fs = require('fs');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// Read the input file as a stream and process it
const inputFile = '/workspace/src/obsidian/app.js';
const outputFile = '/workspace/src/obsidian/app_transformed.js';

// Read the entire file content (we'll use line-by-line processing for output)
const content = fs.readFileSync(inputFile, 'utf-8');

// Parse the file into AST
const ast = parser.parse(content, {
  sourceType: 'unambiguous',
  plugins: []
});

// Track if we need to keep __extends import
let needExtendsImport = false;

// Transform function-like class patterns to ESNext classes
function transform() {
  let modified = false;
  
  // We need to find patterns like:
  // X = (function (e) { function t(...) { ... } __extends(t, e); ... return t; })(Y)
  // And convert them to: class X extends Y { constructor(...) { super(...); ... } ... }
  
  // First, let's identify all variable/function declarations that match the pattern
  
  const body = ast.program.body;
  const newBody = [];
  
  for (let i = 0; i < body.length; i++) {
    const node = body[i];
    const transformed = transformNode(node);
    if (transformed !== null) {
      if (Array.isArray(transformed)) {
        newBody.push(...transformed);
      } else {
        newBody.push(transformed);
      }
      if (transformed !== node) {
        modified = true;
      }
    }
  }
  
  ast.program.body = newBody;
  
  // Remove __extends from imports if not needed
  if (!needExtendsImport) {
    removeExtendsFromImports();
  }
  
  return modified;
}

function removeExtendsFromImports() {
  const body = ast.program.body;
  for (let i = 0; i < body.length; i++) {
    const node = body[i];
    // Look for: const { __extends, ... } = require("tslib");
    if (t.isVariableDeclaration(node)) {
      for (const decl of node.declarations) {
        if (t.isObjectPattern(decl.id) && 
            t.isCallExpression(decl.init) &&
            t.isIdentifier(decl.init.callee) &&
            decl.init.callee.name === 'require' &&
            t.isStringLiteral(decl.init.arguments[0]) &&
            decl.init.arguments[0].value === 'tslib') {
          // Remove __extends from the properties
          const newProperties = [];
          for (const prop of decl.id.properties) {
            if (t.isObjectProperty(prop)) {
              const keyName = t.isIdentifier(prop.key) ? prop.key.name : 
                             (t.isStringLiteral(prop.key) ? prop.key.value : null);
              if (keyName !== '__extends') {
                newProperties.push(prop);
              } else {
                needExtendsImport = true; // Actually we're removing it, so mark as not needed
              }
            } else {
              newProperties.push(prop);
            }
          }
          if (newProperties.length > 0) {
            decl.id.properties = newProperties;
          }
        }
      }
    }
  }
}

function transformNode(node) {
  // Check for expression statements or variable declarations with the pattern
  
  // Pattern 1: Variable assignment like TFile = (function (e) { ... })(TAbstractFile)
  if (t.isExpressionStatement(node) && t.isAssignmentExpression(node.expression)) {
    const result = tryTransformIIFE(node.expression.left, node.expression.right);
    if (result) {
      return result;
    }
  }
  
  // Pattern 2: Variable declaration like var TFile = (function (e) { ... })(TAbstractFile)
  if (t.isVariableDeclaration(node)) {
    const newDecls = [];
    let changed = false;
    for (const decl of node.declarations) {
      if (t.isCallExpression(decl.init)) {
        const result = tryTransformIIFE(decl.id, decl.init);
        if (result) {
          newDecls.push(result);
          changed = true;
        } else {
          newDecls.push(decl);
        }
      } else {
        newDecls.push(decl);
      }
    }
    if (changed) {
      node.declarations = newDecls;
    }
    return node;
  }
  
  return node;
}

function tryTransformIIFE(leftId, callExpr) {
  // Check if this is: (function (e) { ... })(ParentClass)
  if (!t.isFunctionExpression(callExpr.callee) || callExpr.arguments.length !== 1) {
    return null;
  }
  
  const func = callExpr.callee;
  const parentClass = callExpr.arguments[0];
  
  // Function should have exactly one parameter (the parent class)
  if (func.params.length !== 1 || !t.isIdentifier(func.params[0])) {
    return null;
  }
  
  const parentParamName = func.params[0].name;
  
  // Analyze function body to find the pattern
  const body = func.body ? func.body.body : [];
  
  // Find the inner constructor function and __extends call
  let innerFunc = null;
  let innerFuncName = null;
  let extendsIndex = -1;
  let returnIndex = -1;
  
  for (let i = 0; i < body.length; i++) {
    const stmt = body[i];
    
    // Look for: function t(...) { ... }
    if (t.isFunctionDeclaration(stmt)) {
      innerFunc = stmt;
      innerFuncName = stmt.id.name;
    }
    
    // Look for: __extends(t, e);
    if (t.isExpressionStatement(stmt) && 
        t.isCallExpression(stmt.expression) &&
        t.isIdentifier(stmt.expression.callee) &&
        stmt.expression.callee.name === '__extends') {
      extendsIndex = i;
    }
    
    // Look for: return t;
    if (t.isReturnStatement(stmt) && 
        t.isIdentifier(stmt.argument) &&
        stmt.argument.name === innerFuncName) {
      returnIndex = i;
    }
  }
  
  if (!innerFunc || extendsIndex === -1 || returnIndex === -1) {
    return null;
  }
  
  // Now extract prototype methods
  const methods = [];
  const staticMethods = [];
  
  for (let i = extendsIndex + 1; i < returnIndex; i++) {
    const stmt = body[i];
    
    // Look for: t.prototype.methodName = function (...) { ... }
    if (t.isExpressionStatement(stmt) && 
        t.isAssignmentExpression(stmt.expression)) {
      const assign = stmt.expression;
      
      if (t.isMemberExpression(assign.left) &&
          t.isMemberExpression(assign.left.object) &&
          t.isIdentifier(assign.left.object.object) &&
          assign.left.object.object.name === innerFuncName &&
          t.isIdentifier(assign.left.object.property) &&
          assign.left.object.property.name === 'prototype') {
        
        const methodName = assign.left.property.name;
        const methodFunc = assign.right;
        
        if (t.isFunctionExpression(methodFunc)) {
          methods.push(t.classMethod(
            'method',
            t.identifier(methodName),
            methodFunc.params,
            methodFunc.body
          ));
        } else if (t.isArrowFunctionExpression(methodFunc)) {
          // Convert arrow function to block if needed
          let body = methodFunc.body;
          if (!t.isBlockStatement(body)) {
            body = t.blockStatement([t.returnStatement(body)]);
          }
          methods.push(t.classMethod(
            'method',
            t.identifier(methodName),
            methodFunc.params,
            body,
            false,
            false,
            null,
            Boolean(methodFunc.async),
            false
          ));
        }
      }
      
      // Look for: t.staticMethod = function (...) { ... }
      if (t.isMemberExpression(assign.left) &&
          t.isIdentifier(assign.left.object) &&
          assign.left.object.name === innerFuncName &&
          !t.isIdentifier(assign.left.property) && 
          assign.left.property.name !== 'prototype') {
        // This might be a static property/method
      }
    }
    
    // Look for: t.methodName = function (...) { ... } (static methods)
    if (t.isExpressionStatement(stmt) && 
        t.isAssignmentExpression(stmt.expression)) {
      const assign = stmt.expression;
      
      if (t.isMemberExpression(assign.left) &&
          t.isIdentifier(assign.left.object) &&
          assign.left.object.name === innerFuncName &&
          t.isIdentifier(assign.left.property)) {
        const methodName = assign.left.property.name;
        const methodFunc = assign.right;
        
        if (t.isFunctionExpression(methodFunc) || t.isArrowFunctionExpression(methodFunc)) {
          const prop = t.classProperty(
            t.identifier(methodName),
            methodFunc
          );
          prop.static = true;
          staticMethods.push(prop);
        }
      }
    }
  }
  
  // Convert constructor
  const constructorParams = innerFunc.params;
  let constructorBody = innerFunc.body.body.slice();
  
  // Transform constructor body: replace "var i = e.call(this, ...) || this; return i;" with "super(...);"
  const newConstructorBody = [];
  let hasSuper = false;
  
  for (let i = 0; i < constructorBody.length; i++) {
    const stmt = constructorBody[i];
    
    // Look for: var i = e.call(this, ...) || this;
    if (t.isVariableDeclaration(stmt)) {
      const foundPattern = transformConstructorVarDecl(stmt, parentParamName);
      if (foundPattern) {
        // Add super call instead
        const superArgs = foundPattern.superArgs;
        newConstructorBody.push(
          t.expressionStatement(
            t.callExpression(t.super(), superArgs)
          )
        );
        hasSuper = true;
        continue;
      }
    }
    
    // Look for: return i; at the end (skip it as we already handled the pattern)
    if (t.isReturnStatement(stmt) && 
        t.isIdentifier(stmt.argument) &&
        stmt.argument.name === 'i' && hasSuper) {
      continue;
    }
    
    // Keep other statements but rename references if needed
    newConstructorBody.push(transformConstructorBody(stmt, parentParamName));
  }
  
  // Build the class
  const classBody = [];
  
  // Add constructor
  classBody.push(
    t.classMethod(
      'constructor',
      t.identifier('constructor'),
      constructorParams,
      t.blockStatement(newConstructorBody)
    )
  );
  
  // Add methods
  classBody.push(...methods);
  
  // Add static methods/properties
  classBody.push(...staticMethods);
  
  // Create class declaration or expression
  const superClass = t.cloneNode(parentClass);
  
  if (leftId && t.isIdentifier(leftId)) {
    // Class declaration: class Name extends Parent { ... }
    return t.classDeclaration(leftId, superClass, t.classBody(classBody));
  } else if (leftId) {
    // For assignments, return class expression
    return t.assignmentExpression('=', leftId, t.classExpression(null, superClass, t.classBody(classBody)));
  }
  
  return null;
}

function transformConstructorVarDecl(stmt, parentParamName) {
  // Pattern: var i = e.call(this, ...) || this;
  if (stmt.declarations.length === 1) {
    const decl = stmt.declarations[0];
    if (t.isIdentifier(decl.id) && decl.init) {
      // Check for: e.call(this, ...) || this
      if (t.isLogicalExpression(decl.init) && 
          decl.init.operator === '||' &&
          t.isCallExpression(decl.init.left) &&
          t.isMemberExpression(decl.init.left.callee) &&
          t.isIdentifier(decl.init.left.callee.object) &&
          decl.init.left.callee.object.name === parentParamName &&
          t.isIdentifier(decl.init.left.callee.property) &&
          decl.init.left.callee.property.name === 'call' &&
          t.isThisExpression(decl.init.left.arguments[0]) &&
          t.isThisExpression(decl.init.right)) {
        
        return {
          superArgs: decl.init.left.arguments.slice(1)
        };
      }
    }
  }
  return null;
}

function transformConstructorBody(stmt, parentParamName) {
  // In constructor body, we may need to handle any remaining references
  // For now, just return as-is since most transformations are done
  return stmt;
}

// Run transformation
transform();

// Generate the output
const output = generate(ast, {
  comments: true,
  compact: false,
  retainLines: true
}, content);

// Write output
fs.writeFileSync(outputFile, output.code, 'utf-8');

console.log('Transformation complete!');
console.log('Output written to:', outputFile);
