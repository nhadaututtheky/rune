// Rune Context Watch Hook
// Lightweight tool call counter — detects context pressure and suggests rune:context-engine
// Runs as PreToolUse hook on Edit/Write (high-cost operations)
//
// Uses a temp file counter (survives across hook invocations within same session).
// Zero overhead: just reads/increments a number. No token cost.

const fs = require('fs');
const path = require('path');
const os = require('os');

// Counter file scoped to current working directory (hash of cwd)
const cwd = process.cwd();
const hash = Buffer.from(cwd).toString('base64url').slice(0, 16);
const counterFile = path.join(os.tmpdir(), `rune-context-watch-${hash}.json`);

// Thresholds
const FIRST_WARNING = 40;
const REPEAT_INTERVAL = 20;
const CRITICAL_THRESHOLD = 80;

// Read current state
let state = { count: 0, lastWarning: 0 };
try {
  const raw = fs.readFileSync(counterFile, 'utf-8');
  state = JSON.parse(raw);
} catch {
  // First run or corrupted — start fresh
}

// Increment
state.count += 1;

// Check thresholds
const count = state.count;
const sinceLast = count - state.lastWarning;

if (count >= CRITICAL_THRESHOLD && sinceLast >= REPEAT_INTERVAL) {
  console.log(`\n🔴 [Rune context-watch] ${count} tool calls — context likely RED (>85%).`);
  console.log('  RECOMMENDED: Invoke rune:context-engine for state save + /compact.');
  console.log('  Risk: auto-compaction may lose critical decisions without state save.\n');
  state.lastWarning = count;
} else if (count >= FIRST_WARNING && sinceLast >= REPEAT_INTERVAL) {
  console.log(`\n🟡 [Rune context-watch] ${count} tool calls — context filling up.`);
  console.log('  Consider invoking rune:context-engine at the next logical boundary.');
  console.log('  Or run /compact manually if at a good stopping point.\n');
  state.lastWarning = count;
}

// Persist
try {
  fs.writeFileSync(counterFile, JSON.stringify(state));
} catch {
  // Non-critical — counter resets next run
}

process.exit(0);
