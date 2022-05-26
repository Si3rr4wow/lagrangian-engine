import { Div, Input, Label } from '../../components'
import { axes, parameters, waves } from '../../math/MutableWave'
import { WaveField } from '../../math/WaveField'
import { defaultMutableWaveArgs } from '.'

const controlScaling = 10

export const WaveControls = (mutableWave: WaveField): void => {
  const controlsWrapper = Div()
  controlsWrapper.style.position = 'absolute'
  controlsWrapper.style.background = '#ff69b433'
  document.body.appendChild(controlsWrapper)
  const ParamInput = ({
    label,
    parent,
    onchange,
    value,
  }: {
    label: string
    parent: HTMLDivElement
    onchange: (this: GlobalEventHandlers, ev: Event) => void
    value: number
  }): HTMLElement => {
    const wrapper = Div()
    wrapper.style.borderBottom = '1px solid #aaa'
    wrapper.style.margin = '2px'
    wrapper.style.padding = '2px'
    const paramInputLabel = Label()
    wrapper.appendChild(paramInputLabel)
    paramInputLabel.innerText = label
    paramInputLabel.style.color = 'wheat'
    const paramInput = Input()
    parent.appendChild(wrapper)
    paramInputLabel.appendChild(paramInput)
    paramInput.style.width = '100%'
    paramInput.type = 'range'
    paramInput.min = String(-controlScaling * 10)
    paramInput.max = String(controlScaling * 10)
    paramInput.value = String(value * controlScaling)
    paramInput.oninput = onchange
    return wrapper
  }

  Object.values(parameters).forEach((parameter) => {
    Object.values(waves).forEach((wave) => {
      Object.values(axes).forEach((axis) => {
        ParamInput({
          label: `${axis} ${wave} ${parameter}`,
          parent: controlsWrapper,
          value: defaultMutableWaveArgs[axis]?.[wave]?.[parameter] || 1,
          onchange: (event: Event): void => {
            const target = event.target as HTMLInputElement
            mutableWave.setParameters((parameters) => {
              return {
                ...parameters,
                [axis]: {
                  ...parameters[axis],
                  [wave]: {
                    ...parameters[axis]?.[wave],
                    [parameter]: Number(target.value) / controlScaling,
                  },
                },
              }
            })
          },
        })
      })
    })
  })
}
