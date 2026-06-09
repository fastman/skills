#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skillsDir = path.join(root, 'skills');

async function main() {
  try {
    const stat = await fs.stat(skillsDir);
    if (!stat.isDirectory()) {
      console.error(`Scope validation failed: ${skillsDir} is not a directory`);
      process.exit(1);
    }
  } catch {
    console.error(`Scope validation failed: ${skillsDir} does not exist`);
    process.exit(1);
  }

  console.log('Scope validation passed.');
}

main();
