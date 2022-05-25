export interface WaveParameters {
  horizontalDisplacement?: number
  verticalDisplacement?: number
  amplitude?: number
  period?: number
}

type Wave = (x: number) => number
type WaveFunction = (
  sinParameters: WaveParameters,
  cosParameters: WaveParameters
) => Wave
type XYWave = (x: number, y: number) => number
type XYWaveFunction = (
  xSinParameters?: WaveParameters,
  ySinParameters?: WaveParameters,
  xCosParameters?: WaveParameters,
  yCosParameters?: WaveParameters
) => XYWave

export const waveFunction: WaveFunction = (
  sinParameters = {},
  cosParameters = {}
) => {
  const {
    horizontalDisplacement: sinHorizontalDisplacement = 0,
    verticalDisplacement: sinVerticalDisplacement = 0,
    amplitude: sinAmplitude = 1,
    period: sinPeriod = 1,
  } = sinParameters
  const {
    horizontalDisplacement: cosHorizontalDisplacement = 0,
    verticalDisplacement: cosVerticalDisplacement = 0,
    amplitude: cosAmplitude = 1,
    period: cosPeriod = 1,
  } = cosParameters
  return (x) =>
    sinVerticalDisplacement +
    sinAmplitude * Math.sin((x - sinHorizontalDisplacement) / sinPeriod) +
    (cosVerticalDisplacement +
      cosAmplitude * Math.cos((x - cosHorizontalDisplacement) / cosPeriod))
}

export const xyWaveFunction: XYWaveFunction = (
  xSinParameters = {},
  ySinParameters = {},
  xCosParameters = {},
  yCosParameters = {}
): XYWave => {
  const xWave = waveFunction(xSinParameters, xCosParameters)
  const yWave = waveFunction(ySinParameters, yCosParameters)
  return (x: number, y: number): number => xWave(x) * yWave(y)
}

export interface MutableWaveArgs {
  x?: { sinParameters?: WaveParameters; cosParameters?: WaveParameters }
  y?: { sinParameters?: WaveParameters; cosParameters?: WaveParameters }
}

export class MutableWave {
  constructor({
    x: {
      sinParameters: xSinParameters = {},
      cosParameters: xCosParameters = {},
    } = {},
    y: {
      sinParameters: ySinParameters = {},
      cosParameters: yCosParameters = {},
    } = {},
  }: MutableWaveArgs) {
    this._xSinParameters = xSinParameters
    this._ySinParameters = ySinParameters
    this._xCosParameters = xCosParameters
    this._yCosParameters = yCosParameters
    this._paramsChangedSinceLastCalculate = true
    this._id = Math.floor(Math.random() * 10000000)
  }

  _id

  private _xSinParameters: WaveParameters
  private _ySinParameters: WaveParameters
  private _xCosParameters: WaveParameters
  private _yCosParameters: WaveParameters

  private _paramsChangedSinceLastCalculate: boolean

  public get paramsChangedSinceLastCalculate(): boolean {
    return this._paramsChangedSinceLastCalculate
  }

  public set xSinParameters(parameters: WaveParameters) {
    this._paramsChangedSinceLastCalculate = true
    this._xSinParameters = parameters
  }

  public get xSinParameters(): WaveParameters {
    return this._xSinParameters
  }

  public set ySinParameters(parameters: WaveParameters) {
    this._paramsChangedSinceLastCalculate = true
    this._ySinParameters = parameters
  }

  public get ySinParameters(): WaveParameters {
    return this._ySinParameters
  }

  public set xCosParameters(parameters: WaveParameters) {
    this._paramsChangedSinceLastCalculate = true
    this._xCosParameters = parameters
  }

  public get xCosParameters(): WaveParameters {
    return this._xCosParameters
  }

  public set yCosParameters(parameters: WaveParameters) {
    this._paramsChangedSinceLastCalculate = true
    this._yCosParameters = parameters
  }

  public get yCosParameters(): WaveParameters {
    return this._yCosParameters
  }

  public calculate(x: number, y: number): number {
    this._paramsChangedSinceLastCalculate = false
    return xyWaveFunction(
      this._xSinParameters,
      this._ySinParameters,
      this._xCosParameters,
      this._yCosParameters
    )(x, y)
  }
}
