export interface WaveParameters {
  horizontalDisplacement?: number
  verticalDisplacement?: number
  amplitude?: number
  period?: number
}

type Wave = (x: number) => number
type WaveFunction = (parameters: WaveParameters) => Wave
type XYWave = (x: number, y: number) => number
type XYWaveFunction = (
  xParameters?: WaveParameters,
  yParameters?: WaveParameters
) => XYWave

export const waveFunction: WaveFunction = (parameters = {}) => {
  const {
    horizontalDisplacement = 0,
    verticalDisplacement = 0,
    amplitude = 1,
    period = 1,
  } = parameters
  return (x) =>
    verticalDisplacement +
    amplitude * Math.sin(((x - horizontalDisplacement) * Math.PI) / period)
}

export const xyWaveFunction: XYWaveFunction = (
  xParameters = {},
  yParameters = {}
): XYWave => {
  const xWave = waveFunction(xParameters)
  const yWave = waveFunction(yParameters)
  return (x: number, y: number): number => xWave(x) * yWave(y)
}

export class MutableWave {
  constructor(
    xParameters: WaveParameters = {},
    yParameters: WaveParameters = {}
  ) {
    this._xParameters = xParameters
    this._yParameters = yParameters
    this._paramsChangedSinceLastCalculate = true
  }

  private _xParameters: WaveParameters
  private _yParameters: WaveParameters

  private _paramsChangedSinceLastCalculate: boolean

  public set paramsChangedSinceLastCalculate(value: boolean) {
    this._paramsChangedSinceLastCalculate = value
  }

  public get paramsChangedSinceLastCalculate(): boolean {
    return this._paramsChangedSinceLastCalculate
  }

  public set xParameters(parameters: WaveParameters) {
    this._paramsChangedSinceLastCalculate = true
    this._xParameters = parameters
  }

  public get xParameters(): WaveParameters {
    return this._xParameters
  }

  public set yParameters(parameters: WaveParameters) {
    this._paramsChangedSinceLastCalculate = true
    this._yParameters = parameters
  }

  public get yParameters(): WaveParameters {
    return this._yParameters
  }

  public calculate(x: number, y: number): number {
    this._paramsChangedSinceLastCalculate = false
    return xyWaveFunction(this._xParameters, this._yParameters)(x, y)
  }
}
