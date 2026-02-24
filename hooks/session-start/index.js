// Rune Session Start Hook
// Loads and injects .rune/ state file CONTENTS into context at session start

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const runeDir = path.join(cwd, '.rune');

if (fs.existsSync(runeDir)) {
  const stateFiles = [
    'progress.md',
    'decisions.md',
    'conventions.md',
    'RESCUE-STATE.md',
    'DEVELOPER-GUIDE.md'
  ];
  const loaded = [];

  for (const file of stateFiles) {
    const filePath = path.join(runeDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      if (content.length > 0) {
        console.log(`\n=== .rune/${file} ===\n${content}`);
        loaded.push(file);
      }
    }
  }

  if (loaded.length > 0) {
    console.log(`\n[Rune: injected project state from ${loaded.join(', ')}]`);
  } else {
    console.log('[Rune: .rune/ directory found but no state files yet. Run /rune onboard to populate.]');
  }
} else {
  console.log('[Rune: No .rune/ directory found. Run /rune onboard to set up project context.]');
}
