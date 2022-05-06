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

type MakeWave = (
  parameters?: WaveParameters
) => (options: WaveOptions) => Array<[number, number]>
export const makeWave: MakeWave = (parameters = {}) => {
  const waveform = makeWaveform(parameters)
  return (options: WaveOptions) => {
    const xArray = makeXArray(options)
    return xArray.map((x) => [x, waveform(x)])
  }
}
