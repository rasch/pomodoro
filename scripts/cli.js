import { exec } from "node:child_process"
import { timer } from "./timer.js"

/**
 * @param {import("./timer.js").State} state
 * @param {(keyof import("./timer.js").State)[]} updated
 */
const cli = (state, updated) => {
  const moveCursor = "\x1b[1G"
  const work = "\x1b[32m>\x1b[0m"
  const stop = "\x1b[31m<\x1b[0m"
  const sound = `play -qnt alsa \
    synth pl G2 pl B2 pl D3 pl G3 pl D4 pl G4 \
    delay 0 .05 .1 .15 .2 .25 remix - fade 0 4 .1 norm -1`

  process.stdout.write(
    `${moveCursor}${state.count} ${state.work ? work : stop} ${state.time} `
  )

  if (updated.includes("work")) exec(sound)
}

process.on("SIGINT", () => process.exit())

timer(cli)
