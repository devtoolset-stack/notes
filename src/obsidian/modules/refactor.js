"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");

/**
 * 流式处理器：分析 app.js 的依赖关系和导出
 */
async function analyzeFile(inputPath) {
  const fileStream = fs.createReadStream(inputPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const declarations = [];
  let lineNumber = 0;
  
  // 正则表达式匹配各种声明
  const varRegex = /^var\s+([a-zA-Z_$][\w$]*)\s*=/;
  const letRegex = /^let\s+([a-zA-Z_$][\w$]*)\s*=/;
  const constRegex = /^const\s+([a-zA-Z_$][\w$]*)\s*=/;
  const functionRegex = /^function\s+([a-zA-Z_$][\w$]*)\s*\(/;
  const classRegex = /^class\s+([a-zA-Z_$][\w$]*)\s*(?:extends|{)/;
  const exportRegex = /^\s*(module\.exports|exports\.)\s*=/;

  for await (const line of rl) {
    lineNumber++;
    
    if (varRegex.test(line)) {
      const match = line.match(varRegex);
      declarations.push({ line: lineNumber, type: 'var', name: match[1] });
    } else if (letRegex.test(line)) {
      const match = line.match(letRegex);
      declarations.push({ line: lineNumber, type: 'let', name: match[1] });
    } else if (constRegex.test(line)) {
      const match = line.match(constRegex);
      declarations.push({ line: lineNumber, type: 'const', name: match[1] });
    } else if (functionRegex.test(line)) {
      const match = line.match(functionRegex);
      declarations.push({ line: lineNumber, type: 'function', name: match[1] });
    } else if (classRegex.test(line)) {
      const match = line.match(classRegex);
      declarations.push({ line: lineNumber, type: 'class', name: match[1] });
    } else if (exportRegex.test(line)) {
      declarations.push({ line: lineNumber, type: 'exports', name: 'module.exports' });
    }
    
    // 每处理 10000 行输出进度
    if (lineNumber % 10000 === 0) {
      console.error(`Processed ${lineNumber} lines...`);
    }
  }

  return declarations;
}

// 主函数
async function main() {
  const inputFile = process.argv[2] || '/workspace/src/obsidian/app.js';
  const outputFile = process.argv[3] || '/tmp/analysis.json';
  
  console.error(`Analyzing ${inputFile}...`);
  const declarations = await analyzeFile(inputFile);
  
  console.error(`Found ${declarations.length} declarations`);
  fs.writeFileSync(outputFile, JSON.stringify(declarations, null, 2));
  console.error(`Analysis saved to ${outputFile}`);
}

main().catch(console.error);
