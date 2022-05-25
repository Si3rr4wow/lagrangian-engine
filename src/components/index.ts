type Element = HTMLDivElement | HTMLLabelElement | HTMLInputElement

type Tag = <TElement extends Element>(name: string) => () => TElement

const tag: Tag =
  <TElement extends Element>(name: string) =>
  (): TElement =>
    document.createElement(name) as TElement

export const Div = tag<HTMLDivElement>('div')
export const Label = tag<HTMLLabelElement>('label')
export const Input = tag<HTMLInputElement>('input')
