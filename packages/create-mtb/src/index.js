#!/usr/bin/env node

/**
 * create-mtb
 * 
 * CLI tool to scaffold new mtb Web Components projects.
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

/**
 * Copy a directory recursively.
 * 
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Replace placeholders in a file.
 * 
 * @param {string} filePath - Path to the file
 * @param {Object} replacements - Key-value pairs of replacements
 */
function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  fs.writeFileSync(filePath, content);
}

/**
 * Main function to create a new project.
 */
async function main() {
  const args = process.argv.slice(2);
  const projectName = args[0] || 'my-mtb-app';
  const targetDir = path.resolve(process.cwd(), projectName);
  
  console.log(`\n🚀 Creating mtb project: ${projectName}\n`);
  
  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${projectName}" already exists.`);
    process.exit(1);
  }
  
  // Copy template
  const templateDir = path.join(TEMPLATES_DIR, 'basic');
  if (!fs.existsSync(templateDir)) {
    console.error('❌ Template not found. Please reinstall create-mtb.');
    process.exit(1);
  }
  
  copyDir(templateDir, targetDir);
  
  // Replace placeholders
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    replaceInFile(packageJsonPath, { projectName });
  }
  
  console.log(`✅ Project created at ${targetDir}\n`);
  console.log('Next steps:\n');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log('  npm start\n');
  console.log('Happy coding! 🎉\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
