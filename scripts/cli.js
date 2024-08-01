import { exec } from "node:child_process"
import { timer } from "./timer.js"
import { argv } from "lil-argv"

const o = argv()

if (o.h || o.help) {
  console.log(`Usage: pt [OPTION]...

An interval timer for pomodoros, tabatas, and more.

  -c  number of pomodoros completed [range: 0-99, default: 0]
  -w  work time in seconds [range: 1-86399, default: 1500]
  -b  break time in seconds [range: 1-86399, default: 300]
  -l  long break in seconds (every 4th break) [range: 1-86399, default: 1200]
  -x  extended break in seconds (every 8th break) [range: 1-86399, default: 3000]
  -v  beep volume in percent [range: 0-100, default: 100] (not implemented)

Press Ctrl+c to exit the timer.
`)
  process.exit(0)
}

/**
 * @param {string | boolean | undefined} parameter
 * @returns {(fallback: number) => number}
 */
const p = parameter => fallback => Number(parameter) || fallback

/**
 * @param {import("./timer.js").State} state
 * @param {(keyof import("./timer.js").State)[]} updated
 */
const cli = (state, updated) => {
  const moveCursor = "\x1b[2K\x1b[1G"
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

timer(
  cli,
  p(o.c)(0),
  n => (n % 8 ? n % 4 ? p(o.b)(300) : p(o.l)(1200) : p(o.x)(3000)) * 1000,
  () => p(o.w)(1500) * 1000,
)
