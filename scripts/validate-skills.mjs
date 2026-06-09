#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const skillsDir = path.join(root, 'skills');

async function main() {
  let entries;
  try {
    entries = await fs.readdir(skillsDir, { withFileTypes: true });
  } catch {
    console.error(`Skills validation failed: cannot read ${skillsDir}`);
    process.exit(1);
  }

  const skillDirs = entries
    .filter((e) => e.isDirectory() && !e.name.endsWith('-workspace'))
    .map((e) => e.name)
    .sort();

  if (skillDirs.length === 0) {
    console.error('Skills validation failed: no skill directories found under skills/');
    process.exit(1);
  }

  let exitCode = 0;

  for (const name of skillDirs) {
    const skillPath = path.join(skillsDir, name);
    const skillFile = path.join(skillPath, 'SKILL.md');

    try {
      await fs.access(skillFile);
    } catch {
      console.error(`Skills validation failed: ${skillFile} not found in skills/${name}`);
      exitCode = 1;
      continue;
    }

    try {
      execSync(`npx skills-ref validate "${skillPath}"`, { stdio: 'inherit' });
      console.log(`skills/${name}: OK`);
    } catch {
      exitCode = 1;
    }
  }

  if (exitCode !== 0) process.exit(exitCode);
  console.log('Skills validation passed.');
}

main();
