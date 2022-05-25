import { Div, Input, Label } from '../../components'
import { WaveField } from '../../math/WaveField'

export const WaveControls = (mutableWave: WaveField): void => {
  const controlsWrapper = Div()
  document.body.appendChild(controlsWrapper)
  const ParamInput = ({
    label,
    parent,
    onchange,
  }: {
    label: string
    parent: HTMLDivElement
    onchange: (this: GlobalEventHandlers, ev: Event) => void
  }): HTMLElement => {
    const wrapper = Div()
    const paramInputLabel = Label()
    wrapper.appendChild(paramInputLabel)
    paramInputLabel.innerText = label
    const paramInput = Input()
    parent.appendChild(paramInputLabel)
    paramInputLabel.appendChild(paramInput)
    paramInput.type = 'range'
    paramInput.min = '0'
    paramInput.max = '10'
    paramInput.onchange = onchange
    return wrapper
  }

  ParamInput({
    label: 'x Cos period',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.xCosParameters.period = Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'x Cos amplitude',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.xCosParameters.amplitude = Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'x Cos verticalDisplacement',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.xCosParameters.verticalDisplacement =
        Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'x Cos horizontalDisplacement',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.xCosParameters.horizontalDisplacement =
        Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'y Cos period',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.yCosParameters.period = Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'y Cos amplitude',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.yCosParameters.amplitude = Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'y Cos verticalDisplacement',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.yCosParameters.verticalDisplacement =
        Number(target.value) || 30
      mutableWave.refresh()
    },
  })

  ParamInput({
    label: 'y Cos horizontalDisplacement',
    parent: controlsWrapper,
    onchange: (event: Event): void => {
      const target = event.target as HTMLInputElement
      mutableWave.yCosParameters.horizontalDisplacement =
        Number(target.value) || 30
      mutableWave.refresh()
    },
  })
}
