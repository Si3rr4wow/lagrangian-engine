export enum parameters {
  horizontalDisplacement = 'horizontalDisplacement',
  verticalDisplacement = 'verticalDisplacement',
  amplitude = 'amplitude',
  period = 'period',
}

export interface WaveParameters {
  [parameters.horizontalDisplacement]?: number
  [parameters.verticalDisplacement]?: number
  [parameters.amplitude]?: number
  [parameters.period]?: number
}

export enum waves {
  sin = 'sin',
  cos = 'cos',
}

export interface WaveFormParameters {
  [waves.sin]?: WaveParameters
  [waves.cos]?: WaveParameters
}

export enum axes {
  x = 'x',
  y = 'y',
}

type Wave = (x: number) => number
type WaveFunction = (waveFormParameters: WaveFormParameters) => Wave
type XYWavePoint = (x: number, y: number) => number
export interface MutableWaveArgs {
  [axes.x]?: WaveFormParameters
  [axes.y]?: WaveFormParameters
}
type XYWaveFunction = (args: MutableWaveArgs) => XYWavePoint

export const waveFunction: WaveFunction = ({ sin = {}, cos = {} }) => {
  const {
    horizontalDisplacement: sinHorizontalDisplacement = 0,
    verticalDisplacement: sinVerticalDisplacement = 0,
    amplitude: sinAmplitude = 1,
    period: sinPeriod = 10,
  } = sin
  const {
    horizontalDisplacement: cosHorizontalDisplacement = 0,
    verticalDisplacement: cosVerticalDisplacement = 0,
    amplitude: cosAmplitude = 1,
    period: cosPeriod = 10,
  } = cos
  return (x) =>
    sinVerticalDisplacement +
    sinAmplitude * Math.sin((x - sinHorizontalDisplacement) / sinPeriod) +
    (cosVerticalDisplacement +
      cosAmplitude * Math.cos((x - cosHorizontalDisplacement) / cosPeriod))
}

export const xyWaveFunction: XYWaveFunction = ({
  x = {},
  y = {},
}): XYWavePoint => {
  const xWave = waveFunction(x)
  const yWave = waveFunction(y)
  return (x: number, y: number): number => xWave(x) * yWave(y)
}

export class MutableWave {
  constructor(args: MutableWaveArgs) {
    this._id = Math.floor(Math.random() * 10000000)
    this.calculate = xyWaveFunction(args)
    this._parameters = args
  }

  private _id
  private _parameters

  public get id(): number {
    return this._id
  }

  public get parameters(): MutableWaveArgs {
    return this._parameters
  }

  public setParameters(
    func: (parameters: MutableWaveArgs) => MutableWaveArgs
  ): void {
    this._parameters = func(this.parameters)
    this.calculate = xyWaveFunction(this._parameters)
  }

  public calculate
}
