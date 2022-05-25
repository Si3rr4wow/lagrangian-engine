import { Div, Input, Label } from '../../components'
import { MutableWave } from '../../math/MutableWave'

const paramKeys = [
  'period',
  'amplitude',
  'verticalDisplacement',
  'horizontalDisplacement',
]

const axes = [
  'xSinParameters',
  'ySinParameters',
  'xCosParameters',
  'yCosParameters',
]

export const WaveControls = (mutableWave: MutableWave): void => {
  axes.forEach((axis) => {
    const controlsWrapper = Div()
    controlsWrapper.innerText = axis
    controlsWrapper.style.display = 'flex'
    document.body.appendChild(controlsWrapper)
    paramKeys.forEach((param) => {
      const paramInputLabel = Label()
      paramInputLabel.innerText = param
      const paramInput = Input()
      controlsWrapper.appendChild(paramInputLabel)
      paramInputLabel.appendChild(paramInput)
      paramInput.type = 'range'
      paramInput.min = '0'
      paramInput.max = '10'
      paramInput.onchange = (event): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mutableWave[axis] = {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...mutableWave[axis],
          [param]: Number((event?.target as HTMLInputElement)?.value) || 1,
        }
      }
    })
  })
}
