const { isChord } = require("markdown-it-music/lib/chord");

const State = {
  DEFAULT: 1,
  VERSE: 2,
  FENCE: 3,
};

function getMaybeHeading(line: string): string | null {
  if (line.endsWith(":")) {
    return `## ${line.slice(0, -1)}`;
  }

  if (line.startsWith("[") && line.endsWith("]")) {
    return `## ${line.slice(1, -1)}`;
  }

  return null;
}

function getMaybeChords(line: string): string | null {
  const tokens = line.trim().split(/\s+/);

  for (const token of tokens) {
    if (!isChord(token)) {
      return null;
    }
  }

  return `c1: ${line}`;
}

function asciiTabConvert(input: string): string {
  let state = State.DEFAULT;
  let voiceIndex = 1;
  const lines = input.split(/\n/);
  const output = [];

  for (const line of lines) {
    if (line.startsWith(":::")) {
      state = State.FENCE;
      output.push(line);
      continue;
    }

    if (state === State.DEFAULT) {
      const maybeHeading = getMaybeHeading(line);
      if (maybeHeading) {
        output.push(maybeHeading);
        continue;
      }

      const maybeChords = getMaybeChords(line);
      if (maybeChords) {
        state = State.VERSE;
        output.push(maybeChords);
        voiceIndex = 1;
        continue;
      }

      output.push(line);
      continue;
    }

    if (state === State.VERSE) {
      const maybeHeading = getMaybeHeading(line);
      if (maybeHeading) {
        state = State.DEFAULT;
        output.push("");
        output.push(maybeHeading);
        continue;
      }

      const maybeChords = getMaybeChords(line);
      if (maybeChords) {
        output.push("");
        output.push(maybeChords);
        voiceIndex = 1;
        continue;
      }

      if (line.trim() === "") {
        continue;
      }

      output.push(`l${voiceIndex}: ${line}`);
      voiceIndex += 1;
      continue;
    }

    if (state === State.FENCE) {
      if (line === ":::") {
        state = State.DEFAULT;
      }

      output.push(line);
      continue;
    }
  }

  return output.join("\n");
}

export default asciiTabConvert;
