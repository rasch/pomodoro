import { timer } from "./timer.js"

/**
 * @param {string} bg
 * @param {string} fg
 * @param {string} text
 * @returns {string}
 */
const generateFavicon = (bg, fg, text) => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return ""

  canvas.width = canvas.height = 32

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 32, 32)

  ctx.fillStyle = fg
  ctx.font = "bold 20px sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, 16, 16)

  return canvas.toDataURL()
}

/**
 * @param {string} src
 */
const setFavicon = src => {
  /** @type {HTMLLinkElement} */
  const link =
    document.querySelector('link[rel="icon"]') ||
    document.createElement("link")

  link.rel = "icon"
  link.href = src

  document.querySelector("head")?.appendChild(link)
}

const alertAudioContext = new AudioContext()

/**
 * @param {number} duration
 * @param {number} frequency
 * @param {number} volume
 */
const beep = (duration = 200, frequency = 440, volume = 100, delay = 0) => {
  const gainNode = alertAudioContext.createGain()

  gainNode.connect(alertAudioContext.destination)
  gainNode.gain.value = volume * 0.01

  const osc = alertAudioContext.createOscillator()

  osc.connect(gainNode)
  osc.type= "square"
  osc.frequency.value = frequency

  setTimeout(() => {
    osc.start(alertAudioContext.currentTime)
    osc.stop(alertAudioContext.currentTime + duration * 0.001)
  }, delay)
}

/**
 * @returns {[number, (n: number) => number, () => number, number]}
 */
const getParams = () => {
  const params = new URL(document.URL).searchParams

  /**
   * @param {string} parameter
   * @returns {(fallback: number) => number}
   */
  const p = parameter => fallback => Number(params.get(parameter)) || fallback

  return [
    p("c")(0),
    n => (n % 8 ? n % 4 ? p("b")(300) : p("l")(1200) : p("x")(3000)) * 1000,
    () => p("w")(1500) * 1000,
    p("v")(0),
  ]
}

/**
 * @param {{time: string}} state
 */
const updateTime = state => {
  const title = document.querySelector("title")
  const timer = document.querySelector("#timer")

  ;[timer, title].forEach(t => { if(t) t.innerHTML = state.time })
}

/**
 * @param {{work: boolean, count: number, volume: number}} state
 */
const updateDisplay = state => {
  const background = state.work ? "forestgreen" : "tomato"

  document.body.style.background = background
  setFavicon(generateFavicon(background, "papayawhip", String(state.count)))

  ;[396, 417, 528, 639, 741, 852]
    .forEach((f, i) => beep(256, f, state.volume, 256 * i))
}

/**
 * @param {import("./timer.js").State} state
 * @param {(keyof import("./timer.js").State)[]} updated
 */
const ui = (state, updated) => {
  updated.includes("time") && updateTime(state)
  updated.includes("work") && updateDisplay(state)
}

setFavicon(generateFavicon("rebeccapurple", "papayawhip", "PT"))

document.body.addEventListener(
  "click",
  () => timer(ui, ...getParams()),
  { once: true }
)
