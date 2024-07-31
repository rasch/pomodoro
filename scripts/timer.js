/**
 * @param {number} n
 * @returns {string}
 */
const formatTime = n => new Date(n).toTimeString().slice(n < 3.6e6 ? 3 : 0, 8)

/**
 * @typedef {Object} State
 * @property {number} count
 * @property {number} end
 * @property {string} time
 * @property {boolean} work
 * @property {number} volume
 */

/**
 * @param {(state: State, changed: (keyof State)[]) => void} draw
 * @param {number} count
 * @param {(n: number) => number} rest
 * @param {() => number} work
 */
export const timer = (
  draw,
  count = 0,
  rest = n => (n % 8 ? (n % 4 ? 3e5 : 12e5) : 3e6),
  work = () => 15e5,
  volume = 50,
) => {
  const state = {
    count,
    end: Date.now() + work(),
    time: formatTime(work()),
    work: true,
    volume,
  }

  draw(state, ["count", "end", "time", "work"])

  const update = () => {
    state.time = formatTime(state.end - Date.now() + 1000)
    draw(state, ["time"])

    if (state.time <= "00:00") {
      state.end += (state.work = !state.work) ? work() : rest(++state.count)
      draw(state, ["count", "end", "work"])
    }
  }

  if (typeof window !== "undefined" && window.Worker) {
    const worker = new Worker("/scripts/tick.js")
    worker.onmessage = update
  } else {
    setInterval(update, 1000)
  }
}
