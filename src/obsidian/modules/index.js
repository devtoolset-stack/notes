"use strict";

/**
 * 模块索引文件 - 提供统一的 require 接口
 * 
 * 这个文件提供了对所有重构后的模块的统一访问入口。
 * 每个模块都有明确的 exports，使用的地方使用明确的 require。
 */

const fs = require("fs");
const path = require("path");

// 自动加载所有模块
const modules = {};
const moduleDir = __dirname;

// 读取目录中的所有 JS 文件（除了 index.js 和工具脚本）
const files = fs.readdirSync(moduleDir);
for (const file of files) {
  if (file.endsWith(".js") && file !== "index.js" && file !== "refactor.js" && file !== "split.js") {
    const moduleName = path.basename(file, ".js");
    try {
      modules[moduleName] = require(`./${moduleName}`);
    } catch (e) {
      console.error(`Failed to load module ${moduleName}:`, e.message);
    }
  }
}

// 输出目录中的模块
const outputDir = path.join(moduleDir, "output");
if (fs.existsSync(outputDir)) {
  const outputFiles = fs.readdirSync(outputDir);
  for (const file of outputFiles) {
    if (file.endsWith(".js")) {
      const moduleName = path.basename(file, ".js");
      try {
        modules[moduleName] = require(`./output/${moduleName}`);
      } catch (e) {
        console.error(`Failed to load output module ${moduleName}:`, e.message);
      }
    }
  }
}

// 导出所有模块
module.exports = modules;

// 也提供便捷访问方式
module.exports.utils = require("./utils");
