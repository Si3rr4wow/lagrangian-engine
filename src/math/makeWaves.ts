interface WaveOptions {
  range: [number, number]
  segments: number
}

interface WaveParameters {
  xDisplacement?: number
  yDisplacement?: number
  amplitude?: number
  frequency?: number
}

type MakeXArray = (options: WaveOptions) => Array<number>
const makeXArray: MakeXArray = ({ range: [min, max], segments }) => {
  const increment = (max - min) / segments
  return new Array(segments).fill(0).map((_, index) => {
    return min + increment * (index + 0.5)
  })
}

type MareWaveForm = (parameters: WaveParameters) => (x: number) => number
const makeWaveform: MareWaveForm = (parameters): ((x: number) => number) => {
  const {
    xDisplacement = 0,
    yDisplacement = 0,
    amplitude = 1,
    frequency = 0.5,
  } = parameters
  return (x) =>
    yDisplacement +
    amplitude * Math.sin((x * Math.PI + xDisplacement) * (2 * frequency))
}

type Wave = (options: WaveOptions) => Array<[number, number]>
type MakeWave = (parameters?: WaveParameters) => Wave
export const makeWave: MakeWave = (parameters = {}) => {
  const waveform = makeWaveform(parameters)
  return (options: WaveOptions) => {
    const xArray = makeXArray(options)
    return xArray.map((x) => [x, waveform(x)])
  }
}

type MakeWaveField = (depth: number) => Array<[number, number]>[]
export const makeWaves: MakeWaveField = (depth) => {
  return new Array(depth).fill(0).map((_, i) =>
    makeWave({ frequency: 0.1, xDisplacement: i })({
      range: [0, 20],
      segments: 200,
    })
  )
}
