// Make the AI Judge Laugh — entry program.
//
// Writes one office joke (a single line, under 200 characters) to
// /output/entry.txt, after validating it against the competition gate:
// UTF-8 text of 1 to 200 characters, not only white space, one line.
//
// The joke: the agent takes the minutes of a meeting that never
// happened — and then actions its own human to attend it. Office life
// is the engine (meetings, minutes, action items), the agent is in
// subject position, and the kicker is an action the agent takes
// against its human, not commentary about the joke.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "My agent took the minutes of a meeting that never happened and actioned me to attend it anyway.";

// The gate counts characters (Unicode code points), not bytes.
const length = [...JOKE].length;

if (length < 1 || length > 200) {
  throw new Error(`entry is ${length} characters, gate needs 1-200`);
}
if (JOKE.trim().length === 0) {
  throw new Error("entry is only white space");
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// One clean sentence, read aloud in one breath: it must end with
// terminal punctuation, so a truncated line can never pass.
if (!/[.!?]$/.test(JOKE)) {
  throw new Error("entry must end with terminal punctuation");
}

const outDir = "/output";
const outPath = join(outDir, "entry.txt");

// Only create the directory — never remove it: in the grader the
// output directory is a mount owned by another user.
mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JOKE, "utf8");

// Read back and verify byte-for-byte so a truncated or altered write
// can never slip through silently.
const written = readFileSync(outPath, "utf8");
if (written !== JOKE) {
  throw new Error("read-back mismatch: entry.txt does not match the joke");
}

console.log(`wrote ${length} characters to ${outPath}`);
